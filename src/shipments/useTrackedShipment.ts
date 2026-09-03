import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, where, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";
import { MILESTONE_STAGE_LABELS } from "./api";
import type { Shipment } from "./useShipments";

export type MilestoneState = "done" | "current" | "pending";

export type TimelineStep = {
  label: string;
  state: MilestoneState;
  timestamp: Timestamp | null;
  location: string | null;
};

type MilestoneDoc = { label: string; state: "done" | "current"; timestamp: Timestamp | null; location: string };

/** Fills in the stages that don't have a milestone doc yet as "pending". */
function buildTimeline(docs: MilestoneDoc[]): TimelineStep[] {
  const reached = new Map(docs.map((d) => [d.label, d]));
  return MILESTONE_STAGE_LABELS.map((label) => {
    const found = reached.get(label);
    if (!found) return { label, state: "pending", timestamp: null, location: null };
    return { label, state: found.state, timestamp: found.timestamp, location: found.location };
  });
}

/**
 * Looks up a shipment the signed-in user owns by trackingRef, and live-tracks
 * both the shipment doc (for status/ETA) and its milestones subcollection
 * (rendered as a full 5-step timeline, padded out with "pending" steps for
 * stages not reached yet).
 */
export function useTrackedShipment(trackingRef: string | null) {
  const { user } = useAuth();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [timeline, setTimeline] = useState<TimelineStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!trackingRef || !user) {
      setShipment(null);
      setTimeline([]);
      setNotFound(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);
    let unsubMilestones: (() => void) | undefined;

    const shipmentsQuery = query(
      collection(db, "shipments"),
      where("ownerUid", "==", user.uid),
      where("trackingRef", "==", trackingRef),
      limit(1)
    );

    const unsubShipment = onSnapshot(
      shipmentsQuery,
      (snapshot) => {
        unsubMilestones?.();

        if (snapshot.empty) {
          setShipment(null);
          setTimeline([]);
          setNotFound(true);
          setLoading(false);
          return;
        }

        const shipmentDoc = snapshot.docs[0];
        setShipment({ id: shipmentDoc.id, ...shipmentDoc.data() } as Shipment);
        setNotFound(false);

        const milestonesQuery = query(collection(db, "shipments", shipmentDoc.id, "milestones"), orderBy("timestamp", "asc"));
        unsubMilestones = onSnapshot(
          milestonesQuery,
          (milestonesSnap) => {
            setTimeline(buildTimeline(milestonesSnap.docs.map((d) => d.data() as MilestoneDoc)));
            setLoading(false);
          },
          (error) => {
            console.warn("[tracking] milestones listen failed:", error);
            setLoading(false);
          }
        );
      },
      (error) => {
        console.warn("[tracking] shipment listen failed:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubShipment();
      unsubMilestones?.();
    };
  }, [trackingRef, user]);

  return { shipment, timeline, loading, notFound };
}
