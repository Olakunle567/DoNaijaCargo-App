import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export type Product = {
  id: string;
  name: string;
  emoji: string;
  category: string;
  price: number;
  rating: number;
  ratingCount: number;
  badge?: string;
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        setProducts(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Product));
        setLoading(false);
      },
      (error) => {
        console.warn("[products] listen failed:", error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { products, loading };
}
