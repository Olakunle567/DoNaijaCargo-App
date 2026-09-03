import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";
import type { Cargo, EstimateTiers, Party, ServiceTier } from "./api";

export type Shipment = {
  id: string;
  ownerUid: string;
  sender: Party;
  receiver: Party;
  cargo: Cargo;
  fromCity: string;
  toCity: string;
  serviceTier: ServiceTier;
  insured: boolean;
  priceBreakdown: EstimateTiers[ServiceTier];
  total: number;
  status: string;
  trackingRef: string;
  createdAt: Timestamp | null;
};

export function useShipments() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setShipments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const shipmentsQuery = query(collection(db, "shipments"), where("ownerUid", "==", user.uid), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      shipmentsQuery,
      (snapshot) => {
        setShipments(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Shipment));
        setLoading(false);
      },
      (error) => {
        console.warn("[shipments] listen failed:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return { shipments, loading };
}
