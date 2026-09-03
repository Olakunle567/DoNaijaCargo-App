import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/**
 * Starting balance a wallet is created with at sign-up. Mirrors the design
 * mock (₦36,650, see AccountScreen). Must match the hardcoded check in the
 * `wallet/current` create rule in firestore.rules.
 */
const INITIAL_WALLET_BALANCE_NGN = 36_650;

/**
 * Google/Apple in SignInScreen still run their mocked, timer-based sheets
 * (GoogleAuthSheet / AppleAuthSheet) — that UI is unchanged. What happens
 * on "success" is gated by this flag:
 *
 *  - false (default): we sign in, or on first use create, a real Firebase
 *    user for the demo identity the sheet displays, so the rest of the app
 *    gets a genuine session + Firestore profile/wallet instead of a faked
 *    isAuthenticated flip.
 *  - true: signInWithGoogle/signInWithApple should exchange a real
 *    provider credential instead (see TODOs below) — not implemented here.
 */
const AUTH_SOCIAL_REAL = process.env.EXPO_PUBLIC_AUTH_SOCIAL_REAL === "true";

// Fixed demo identities, matching GoogleAuthSheet's DEMO_ACCOUNT and
// AppleAuthSheet's DEMO_APPLE_ID. Password is only ever used for this
// mock path — never shown to the user, never a "real" credential.
const DEMO_SOCIAL_PASSWORD = "DoNaijaCargoDemo!1";
const DEMO_GOOGLE_ACCOUNT = { fullName: "Adebayo Okafor", email: "adebayo.okafor@gmail.com" };
const DEMO_APPLE_ACCOUNT = { fullName: "Adebayo Okafor", email: "adebayo.o@icloud.com" };

// ---------------------------------------------------------------------------
// Firebase error → inline message
// ---------------------------------------------------------------------------

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "That email address looks invalid.",
  "auth/weak-password": "Password is too weak. Use at least 8 characters.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/user-not-found": "No account found for that email.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/user-disabled": "This account has been disabled.",
};

function errorCode(error: unknown): string {
  return typeof error === "object" && error !== null && "code" in error ? String((error as { code: unknown }).code) : "";
}

function friendlyAuthError(error: unknown): string {
  return AUTH_ERROR_MESSAGES[errorCode(error)] ?? "Something went wrong. Please try again.";
}

// ---------------------------------------------------------------------------
// Firestore writes
// ---------------------------------------------------------------------------

function generateWalletId() {
  return `WLT-${Math.floor(1000 + Math.random() * 8999)}`;
}

async function createUserDocs(user: User, fullName: string, email: string, phone: string) {
  await setDoc(doc(db, "users", user.uid), { fullName, email, phone, createdAt: serverTimestamp() });
  await setDoc(doc(db, "users", user.uid, "wallet", "current"), {
    balance: INITIAL_WALLET_BALANCE_NGN,
    walletId: generateWalletId(),
    currency: "NGN",
  });
}

/** Signs in the fixed demo identity, creating it (profile + wallet) on first use. */
async function ensureDemoUser(account: { fullName: string; email: string }): Promise<User> {
  try {
    const { user } = await signInWithEmailAndPassword(auth, account.email, DEMO_SOCIAL_PASSWORD);
    return user;
  } catch (error) {
    const code = errorCode(error);
    if (code !== "auth/user-not-found" && code !== "auth/invalid-credential") throw error;

    const { user } = await createUserWithEmailAndPassword(auth, account.email, DEMO_SOCIAL_PASSWORD);
    await updateProfile(user, { displayName: account.fullName });
    await createUserDocs(user, account.fullName, account.email, "");
    return user;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type SignUpInput = { fullName: string; email: string; phone: string; password: string };

type AuthContextValue = {
  isAuthenticated: boolean;
  /** True until the initial onAuthStateChanged callback fires (session restore in flight). */
  isInitializing: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsInitializing(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: user !== null,
      isInitializing,
      user,

      signIn: async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          throw new Error(friendlyAuthError(error));
        }
      },

      signUp: async ({ fullName, email, phone, password }) => {
        try {
          const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(newUser, { displayName: fullName });
          await createUserDocs(newUser, fullName, email, phone);
        } catch (error) {
          throw new Error(friendlyAuthError(error));
        }
      },

      signInWithGoogle: async () => {
        if (AUTH_SOCIAL_REAL) {
          // TODO(real social auth): get a real Google ID token via
          // expo-auth-session (e.g. Google.useAuthRequest), then:
          //   const credential = GoogleAuthProvider.credential(idToken);
          //   await signInWithCredential(auth, credential);
          throw new Error("Google sign-in is not configured yet.");
        }
        try {
          await ensureDemoUser(DEMO_GOOGLE_ACCOUNT);
        } catch (error) {
          throw new Error(friendlyAuthError(error));
        }
      },

      signInWithApple: async () => {
        if (AUTH_SOCIAL_REAL) {
          // TODO(real social auth): get a real Apple identity token via
          // expo-auth-session / expo-apple-authentication, then:
          //   const provider = new OAuthProvider('apple.com');
          //   const credential = provider.credential({ idToken, rawNonce });
          //   await signInWithCredential(auth, credential);
          throw new Error("Apple sign-in is not configured yet.");
        }
        try {
          await ensureDemoUser(DEMO_APPLE_ACCOUNT);
        } catch (error) {
          throw new Error(friendlyAuthError(error));
        }
      },

      signOut: () => firebaseSignOut(auth),
    }),
    [user, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
