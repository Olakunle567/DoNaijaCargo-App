import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, increment, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";

export type CartItem = { productId: string; qty: number };

/** users/{uid}/cart/* — client owns this outright; no callable involved. */
export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "cart"),
      (snapshot) => {
        setItems(snapshot.docs.map((docSnap) => ({ productId: docSnap.id, qty: docSnap.data().qty as number })));
        setLoading(false);
      },
      (error) => {
        console.warn("[cart] listen failed:", error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  const count = items.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = async (productId: string) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid, "cart", productId), { productId, qty: increment(1) }, { merge: true });
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "cart", productId));
  };

  return { items, count, loading, addToCart, removeFromCart };
}
