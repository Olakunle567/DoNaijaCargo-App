import { HttpsError, onCall } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/logger";

export type VehicleType = "bike" | "tricycle" | "van";

const VEHICLE_TYPES: VehicleType[] = ["bike", "tricycle", "van"];

/** Flat rate per vehicle type — no distance/geo data is collected yet, so this mirrors the app's existing mock pricing. */
const VEHICLE_RATES: Record<VehicleType, { priceEstimate: number; etaMin: number }> = {
  bike: { priceEstimate: 3900, etaMin: 12 },
  tricycle: { priceEstimate: 5200, etaMin: 15 },
  van: { priceEstimate: 8900, etaMin: 20 },
};

const MOCK_RIDER = {
  name: "Emeka Obi",
  rating: 4.8,
  trips: 202,
  vehicle: "Green Bajaj",
  plate: "LND 482 JK",
};

const CANCELLATION_FEE_NGN = 500;
const MATCH_DELAY_MS = 2500;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// ---------------------------------------------------------------------------
// requestRide
// ---------------------------------------------------------------------------

type RequestRideInput = { pickup: string; dropoff: string; vehicleType: VehicleType };

export const requestRide = onCall<RequestRideInput>(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");

  const data = request.data ?? ({} as RequestRideInput);
  if (!isNonEmptyString(data.pickup)) throw new HttpsError("invalid-argument", "pickup is required.");
  if (!isNonEmptyString(data.dropoff)) throw new HttpsError("invalid-argument", "dropoff is required.");
  if (!VEHICLE_TYPES.includes(data.vehicleType)) {
    throw new HttpsError("invalid-argument", "vehicleType must be one of bike, tricycle, van.");
  }

  const { priceEstimate, etaMin } = VEHICLE_RATES[data.vehicleType];
  const db = getFirestore();
  const rideRef = db.collection("rides").doc();

  await rideRef.set({
    ownerUid: request.auth.uid,
    pickup: data.pickup,
    dropoff: data.dropoff,
    vehicleType: data.vehicleType,
    priceEstimate,
    etaMin,
    rider: null,
    status: "searching",
    createdAt: FieldValue.serverTimestamp(),
  });

  return { id: rideRef.id, priceEstimate, etaMin };
});

// ---------------------------------------------------------------------------
// Mocked matching — a background trigger, not part of requestRide itself, so
// the callable returns immediately and the client just watches the ride doc
// update live via onSnapshot a couple seconds later.
//
// TODO(real dispatch): once there's a real rider-matching service, replace
// this trigger with whatever writes the match — e.g. a callable a rider's
// app calls to accept a ride request, or a dispatch webhook — as long as it
// writes the same { rider, status: 'matched' } shape onto the ride doc.
// ---------------------------------------------------------------------------

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const onRideRequested = onDocumentCreated("rides/{rideId}", async (event) => {
  const snap = event.data;
  if (!snap || snap.data().status !== "searching") return;

  await sleep(MATCH_DELAY_MS);

  // The ride may have been cancelled during the delay — don't resurrect it.
  const latest = await snap.ref.get();
  if (latest.data()?.status !== "searching") return;

  await snap.ref.update({
    rider: MOCK_RIDER,
    status: "matched",
    matchedAt: FieldValue.serverTimestamp(),
  });
});

// ---------------------------------------------------------------------------
// cancelRide
// ---------------------------------------------------------------------------

type CancelRideInput = { rideId: string };

export const cancelRide = onCall<CancelRideInput>(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");

  const rideId = request.data?.rideId;
  if (!isNonEmptyString(rideId)) throw new HttpsError("invalid-argument", "rideId is required.");

  const db = getFirestore();
  const rideRef = db.collection("rides").doc(rideId);
  const rideSnap = await rideRef.get();
  if (!rideSnap.exists) throw new HttpsError("not-found", "Ride not found.");

  const ride = rideSnap.data()!;
  if (ride.ownerUid !== request.auth.uid) throw new HttpsError("permission-denied", "This isn't your ride.");
  if (ride.status === "cancelled" || ride.status === "completed") {
    throw new HttpsError("failed-precondition", `Ride is already ${ride.status}.`);
  }

  // Mock: no wallet involved yet — just record + log the fee.
  logger.info("[cancelRide] fee charged (mock, wallet not debited)", {
    rideId,
    ownerUid: request.auth.uid,
    cancellationFee: CANCELLATION_FEE_NGN,
  });

  await rideRef.update({
    status: "cancelled",
    cancellationFee: CANCELLATION_FEE_NGN,
    cancelledAt: FieldValue.serverTimestamp(),
  });

  return { id: rideId, status: "cancelled" as const, cancellationFee: CANCELLATION_FEE_NGN };
});
