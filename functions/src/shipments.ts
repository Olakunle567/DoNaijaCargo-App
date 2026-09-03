import { HttpsError, onCall } from "firebase-functions/v2/https";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { computeAllTiers, computeBreakdown, SERVICE_TIERS, type ServiceTier } from "./pricing";

// ---------------------------------------------------------------------------
// getEstimate
// ---------------------------------------------------------------------------

type GetEstimateInput = { weightKg: number; insured: boolean };

export const getEstimate = onCall<GetEstimateInput>((request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");

  const { weightKg, insured } = request.data ?? ({} as GetEstimateInput);
  if (typeof weightKg !== "number" || !Number.isFinite(weightKg) || weightKg <= 0) {
    throw new HttpsError("invalid-argument", "weightKg must be a positive number.");
  }
  if (typeof insured !== "boolean") {
    throw new HttpsError("invalid-argument", "insured must be a boolean.");
  }

  return { tiers: computeAllTiers(weightKg, insured) };
});

// ---------------------------------------------------------------------------
// bookShipment
// ---------------------------------------------------------------------------

type PartyInput = { name: string; address: string };
type CargoInput = { type: string; weightKg: number; dimensions: string };

type BookShipmentInput = {
  sender: PartyInput;
  receiver: PartyInput;
  cargo: CargoInput;
  serviceTier: ServiceTier;
  insured: boolean;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isParty(value: unknown): value is PartyInput {
  const party = value as PartyInput | undefined;
  return !!party && isNonEmptyString(party.name) && isNonEmptyString(party.address);
}

function isCargo(value: unknown): value is CargoInput {
  const cargo = value as CargoInput | undefined;
  return (
    !!cargo &&
    isNonEmptyString(cargo.type) &&
    typeof cargo.weightKg === "number" &&
    Number.isFinite(cargo.weightKg) &&
    cargo.weightKg > 0 &&
    isNonEmptyString(cargo.dimensions)
  );
}

/** Atomically allocates the next DN-YYYY-##### tracking reference for the current year. */
async function nextTrackingRef(db: FirebaseFirestore.Firestore): Promise<string> {
  const year = new Date().getFullYear();
  const counterRef = db.collection("counters").doc(`shipments-${year}`);

  const seq = await db.runTransaction(async (tx) => {
    const snap = await tx.get(counterRef);
    const next = (snap.exists ? (snap.data()?.seq as number) : 0) + 1;
    tx.set(counterRef, { seq: next }, { merge: true });
    return next;
  });

  return `DN-${year}-${String(seq).padStart(5, "0")}`;
}

export const bookShipment = onCall<BookShipmentInput>(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");
  const ownerUid = request.auth.uid;

  const data = request.data ?? ({} as BookShipmentInput);
  if (!isParty(data.sender)) throw new HttpsError("invalid-argument", "sender.name and sender.address are required.");
  if (!isParty(data.receiver)) throw new HttpsError("invalid-argument", "receiver.name and receiver.address are required.");
  if (!isCargo(data.cargo)) throw new HttpsError("invalid-argument", "cargo.type, cargo.weightKg (>0), and cargo.dimensions are required.");
  if (!SERVICE_TIERS.includes(data.serviceTier)) {
    throw new HttpsError("invalid-argument", "serviceTier must be one of standard, express, priority.");
  }
  if (typeof data.insured !== "boolean") throw new HttpsError("invalid-argument", "insured must be a boolean.");

  const { sender, receiver, cargo, serviceTier, insured } = data;
  // Server-computed, never trusts a client-supplied price.
  const priceBreakdown = computeBreakdown(serviceTier, cargo.weightKg, insured);

  const db = getFirestore();
  const trackingRef = await nextTrackingRef(db);
  const shipmentRef = db.collection("shipments").doc();

  await shipmentRef.set({
    ownerUid,
    sender,
    receiver,
    cargo,
    fromCity: sender.address,
    toCity: receiver.address,
    serviceTier,
    insured,
    priceBreakdown,
    total: priceBreakdown.total,
    status: "Pending Pickup",
    trackingRef,
    createdAt: FieldValue.serverTimestamp(),
  });

  await shipmentRef.collection("milestones").doc().set({
    label: "Order Placed",
    timestamp: FieldValue.serverTimestamp(),
    location: sender.address,
    state: "current",
  });

  return { id: shipmentRef.id, trackingRef };
});
