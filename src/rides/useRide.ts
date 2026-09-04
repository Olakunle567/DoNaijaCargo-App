import { useEffect, useState } from "react";
import { doc, onSnapshot, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { cancelRide as cancelRideApi } from "./api";
import type { VehicleType } from "./api";

export type Rider = { name: string; rating: number; trips: number; vehicle: string; plate: string; phone: string };

export type RideStatus = "searching" | "matched" | "cancelled" | "completed";

export type Ride = {
  id: string;
  ownerUid: string;
  pickup: string;
  dropoff: string;
  vehicleType: VehicleType;
  priceEstimate: number;
  etaMin: number;
  rider: Rider | null;
  status: RideStatus;
  cancellationFee?: number;
  createdAt: Timestamp | null;
};

const ETA_TICK_MS = 15_000;

/** Live-subscribes to a ride by id, ticking its ETA down client-side between snapshots. */
export function useRide(rideId: string | null) {
  const [ride, setRide] = useState<Ride | null>(null);
  const [etaRemaining, setEtaRemaining] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!rideId) {
      setRide(null);
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, "rides", rideId),
      (snap) => {
        setRide(snap.exists() ? ({ id: snap.id, ...snap.data() } as Ride) : null);
      },
      (err) => {
        console.warn("[ride] listen failed:", err);
        setError("Lost connection to this ride. Pull to refresh.");
      }
    );
    return unsubscribe;
  }, [rideId]);

  useEffect(() => {
    if (!ride || ride.status === "cancelled" || ride.status === "completed") {
      setEtaRemaining(ride?.etaMin ?? null);
      return;
    }
    const anchorMs = ride.createdAt ? ride.createdAt.toDate().getTime() : Date.now();
    const tick = () => {
      const elapsedMin = (Date.now() - anchorMs) / 60_000;
      setEtaRemaining(Math.max(0, Math.ceil(ride.etaMin - elapsedMin)));
    };
    tick();
    const interval = setInterval(tick, ETA_TICK_MS);
    return () => clearInterval(interval);
  }, [ride]);

  const cancel = async () => {
    if (!rideId) return;
    setError("");
    setCancelling(true);
    try {
      await cancelRideApi({ rideId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't cancel this ride. Please try again.");
      throw err;
    } finally {
      setCancelling(false);
    }
  };

  return { ride, etaRemaining, cancelling, error, cancel };
}
