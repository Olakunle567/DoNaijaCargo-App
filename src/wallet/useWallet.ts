import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";

export type Wallet = { balance: number; walletId: string; currency: string };

/** Live-reads the signed-in user's wallet/current doc. Never mutate this locally — top-ups/debits only ever happen server-side. */
export function useWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWallet(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid, "wallet", "current"),
      (snap) => {
        setWallet(snap.exists() ? (snap.data() as Wallet) : null);
        setLoading(false);
      },
      (error) => {
        console.warn("[wallet] listen failed:", error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  return { wallet, loading };
}
