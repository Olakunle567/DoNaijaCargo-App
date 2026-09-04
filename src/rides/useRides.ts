import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";
import type { Ride } from "./useRide";

/** All of the current user's rides, past and present — for stats/history, not the live single-ride tracker (see useRide). */
export function useRides() {
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRides([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ridesQuery = query(collection(db, "rides"), where("ownerUid", "==", user.uid), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      ridesQuery,
      (snapshot) => {
        setRides(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Ride));
        setLoading(false);
      },
      (error) => {
        console.warn("[rides] listen failed:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return { rides, loading };
}
