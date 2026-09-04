import { HttpsError, onCall } from "firebase-functions/v2/https";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

/** Ordered milestone stages, and the shipment.status each one maps to. */
export const MILESTONE_STAGES = [
  { label: "Order Placed", status: "Pending Pickup" },
  { label: "Arrived at Sorting Center", status: "At Sorting Centre" },
  { label: "In Transit", status: "In Transit" },
  { label: "Out for Delivery", status: "Out for Delivery" },
  { label: "Delivered", status: "Delivered" },
] as const;

function locationForStage(label: string, shipment: FirebaseFirestore.DocumentData): string {
  switch (label) {
    case "Arrived at Sorting Center":
      return `${shipment.fromCity} Sorting Facility`;
    case "In Transit":
      return `En route to ${shipment.toCity}`;
    case "Out for Delivery":
      return `Near ${shipment.toCity}`;
    case "Delivered":
      return shipment.toCity;
    default:
      return shipment.fromCity;
  }
}

/**
 * Core tracking-advance logic: moves a shipment to its next milestone,
 * flips the previous "current" milestone to "done", stamps a
 * timestamp + location on the new one, and updates the shipment's
 * top-level status to match. Shared by every entry point allowed to move a
 * shipment forward (currently just the advanceTracking callable below).
 */
export async function applyNextMilestone(trackingRef: string): Promise<{ id: string; label: string; status: string }> {
  const db = getFirestore();
  const shipmentQuery = await db.collection("shipments").where("trackingRef", "==", trackingRef).limit(1).get();
  if (shipmentQuery.empty) {
    throw new HttpsError("not-found", `No shipment found for trackingRef ${trackingRef}.`);
  }
  const shipmentRef = shipmentQuery.docs[0].ref;
  const milestonesRef = shipmentRef.collection("milestones");

  return db.runTransaction(async (tx) => {
    const [shipmentSnap, currentSnap] = await Promise.all([
      tx.get(shipmentRef),
      tx.get(milestonesRef.where("state", "==", "current").limit(1)),
    ]);

    if (currentSnap.empty) {
      throw new HttpsError("failed-precondition", "This shipment has no active milestone to advance from.");
    }
    const currentDoc = currentSnap.docs[0];
    const currentLabel = currentDoc.data().label as string;
    const currentIndex = MILESTONE_STAGES.findIndex((s) => s.label === currentLabel);
    if (currentIndex === -1) {
      throw new HttpsError("internal", `Unrecognized milestone label "${currentLabel}".`);
    }
    if (currentIndex === MILESTONE_STAGES.length - 1) {
      throw new HttpsError("failed-precondition", "This shipment has already been delivered.");
    }

    const next = MILESTONE_STAGES[currentIndex + 1];
    const shipment = shipmentSnap.data() ?? {};

    tx.update(currentDoc.ref, { state: "done" });
    tx.set(milestonesRef.doc(), {
      label: next.label,
      timestamp: FieldValue.serverTimestamp(),
      location: locationForStage(next.label, shipment),
      state: "current",
    });
    tx.update(shipmentRef, { status: next.status });

    return { id: shipmentRef.id, label: next.label, status: next.status };
  });
}

// ---------------------------------------------------------------------------
// MOCK: advanceTracking — dev-only manual trigger.
//
// There's no live GPS/carrier integration yet, so this callable is how we
// simulate a shipment progressing: a __DEV__-gated button in TrackScreen
// calls it against the emulator to watch the timeline move. It operates on
// the caller's real shipment doc (applyNextMilestone below looks it up by
// trackingRef) — only the "something moved" trigger is fake, not the data.
//
// It only checks that the caller is signed in — no ownership or role check —
// which is fine for a dev-only tool but MUST NOT ship like this.
//
// TODO(real tracking integration): when a real logistics webhook exists,
// give it its own entry point rather than loosening this one's auth, e.g.:
//
//   export const advanceTrackingWebhook = onRequest(async (req, res) => {
//     if (!verifyWebhookSignature(req)) { res.status(401).end(); return; }
//     const { trackingRef } = req.body;
//     await applyNextMilestone(trackingRef);
//     res.status(200).end();
//   });
//
// verifying an HMAC signature / shared secret from the webhook provider
// instead of Firebase Auth, but calling the same applyNextMilestone(trackingRef)
// used here. Keep the two entry points separate — a webhook has a different
// trust model than an end-user callable — and delete or admin-gate this one
// once the webhook exists.
// ---------------------------------------------------------------------------

type AdvanceTrackingInput = { trackingRef: string };

export const advanceTracking = onCall<AdvanceTrackingInput>(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");

  const trackingRef = request.data?.trackingRef;
  if (typeof trackingRef !== "string" || !trackingRef.trim()) {
    throw new HttpsError("invalid-argument", "trackingRef is required.");
  }

  return applyNextMilestone(trackingRef.trim());
});
