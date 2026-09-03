import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";

export type OrderItem = { productId: string; name: string; emoji: string; price: number; qty: number };

export type Order = {
  id: string;
  ownerUid: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: Timestamp | null;
};

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ordersQuery = query(collection(db, "orders"), where("ownerUid", "==", user.uid), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        setOrders(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Order));
        setLoading(false);
      },
      (error) => {
        console.warn("[orders] listen failed:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return { orders, loading };
}
