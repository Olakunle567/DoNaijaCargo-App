import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

export type UserProfile = { fullName: string; email: string; phone: string };

/** Live-reads the signed-in user's users/{uid} profile doc (written at sign-up — see createUserDocs). */
export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
        setLoading(false);
      },
      (error) => {
        console.warn("[profile] listen failed:", error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  const saveProfile = async (next: UserProfile) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), next, { merge: true });
    if (next.fullName !== user.displayName) {
      await updateProfile(user, { displayName: next.fullName });
    }
  };

  return { profile, loading, saveProfile };
}
