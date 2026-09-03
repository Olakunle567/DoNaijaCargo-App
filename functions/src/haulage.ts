import { HttpsError, onCall } from "firebase-functions/v2/https";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

export type TruckType = "flatbed" | "tipper" | "container" | "lowbed";

const TRUCK_TYPES: TruckType[] = ["flatbed", "tipper", "container", "lowbed"];

type SubmitHaulageInput = {
  truckType: TruckType;
  pickup: string;
  dropoff: string;
  description: string;
  weightRange: string;
  preferredDate: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Pure quote request — no pricing. Writes a 'requested' haulageRequests doc;
 * a consultant follows up outside the app (the "calls within 2 hours" copy
 * in HaulageScreen is just that — copy, not something this function does).
 */
export const submitHaulage = onCall<SubmitHaulageInput>(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");

  const data = request.data ?? ({} as SubmitHaulageInput);
  if (!TRUCK_TYPES.includes(data.truckType)) {
    throw new HttpsError("invalid-argument", "truckType must be one of flatbed, tipper, container, lowbed.");
  }
  if (!isNonEmptyString(data.pickup)) throw new HttpsError("invalid-argument", "pickup is required.");
  if (!isNonEmptyString(data.dropoff)) throw new HttpsError("invalid-argument", "dropoff is required.");
  if (!isNonEmptyString(data.description)) throw new HttpsError("invalid-argument", "description is required.");
  if (!isNonEmptyString(data.weightRange)) throw new HttpsError("invalid-argument", "weightRange is required.");

  const db = getFirestore();
  const ref = db.collection("haulageRequests").doc();

  await ref.set({
    ownerUid: request.auth.uid,
    truckType: data.truckType,
    pickup: data.pickup,
    dropoff: data.dropoff,
    description: data.description,
    weightRange: data.weightRange,
    preferredDate: isNonEmptyString(data.preferredDate) ? data.preferredDate : null,
    status: "requested",
    createdAt: FieldValue.serverTimestamp(),
  });

  return { id: ref.id };
});
