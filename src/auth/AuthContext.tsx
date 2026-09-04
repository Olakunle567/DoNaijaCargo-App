import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
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
 * Gates what Google/Apple sign-in actually do:
 *
 *  - false (default): SignInScreen/SignUpScreen show the mocked, timer-based
 *    sheets (GoogleAuthSheet / AppleAuthSheet), and "success" signs in, or on
 *    first use creates, a real Firebase user for the demo identity the sheet
 *    displays — so the rest of the app gets a genuine session + Firestore
 *    profile/wallet instead of a faked isAuthenticated flip.
 *  - true: the mock sheets are bypassed and signInWithGoogle/signInWithApple
 *    run the real native flow (GoogleSignin / expo-apple-authentication),
 *    exchanging the provider's credential with Firebase. Requires the
 *    GOOGLE_SIGNIN_* env vars to be set (see .env.example) and a rebuilt dev
 *    client — these are native modules, not available in Expo Go.
 */
export const AUTH_SOCIAL_REAL = process.env.EXPO_PUBLIC_AUTH_SOCIAL_REAL === "true";

/** Apple only offers a native sign-in surface on iOS — no Android equivalent. */
export const APPLE_SIGN_IN_SUPPORTED = !AUTH_SOCIAL_REAL || Platform.OS === "ios";

// Fixed demo identities, matching GoogleAuthSheet's DEMO_ACCOUNT and
// AppleAuthSheet's DEMO_APPLE_ID. Password is only ever used for this
// mock path — never shown to the user, never a "real" credential.
const DEMO_SOCIAL_PASSWORD = "DoNaijaCargoDemo!1";
const DEMO_GOOGLE_ACCOUNT = { fullName: "Adebayo Okafor", email: "adebayo.okafor@gmail.com" };
const DEMO_APPLE_ACCOUNT = { fullName: "Adebayo Okafor", email: "adebayo.o@icloud.com" };

const googleSignInConfig = Constants.expoConfig?.extra?.googleSignIn as
  | { webClientId?: string; iosClientId?: string }
  | undefined;

if (AUTH_SOCIAL_REAL && googleSignInConfig?.webClientId) {
  GoogleSignin.configure({
    webClientId: googleSignInConfig.webClientId,
    iosClientId: googleSignInConfig.iosClientId,
    // Firebase's GoogleAuthProvider needs an ID token, which Google only
    // issues alongside offline access when a webClientId is configured.
    offlineAccess: false,
  });
}

/** True for the "user dismissed the picker" case — not a real error. */
function isSocialSignInCancellation(error: unknown): boolean {
  const code = errorCode(error);
  return code === statusCodes.SIGN_IN_CANCELLED || code === "ERR_REQUEST_CANCELED";
}

/** Random string for Apple's OpenID `nonce` replay-protection dance. */
function randomNonce(length = 32): string {
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._";
  return Array.from(Crypto.getRandomBytes(length), (byte) => charset[byte % charset.length]).join("");
}

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

/**
 * Like `throw new Error(friendlyAuthError(error))`, except a plain Error we
 * threw ourselves (no `.code` — Firebase/native errors always have one) is
 * rethrown with its own message intact instead of being genericized.
 */
function throwFriendly(error: unknown): never {
  if (error instanceof Error && !errorCode(error)) throw error;
  throw new Error(friendlyAuthError(error));
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
        if (!AUTH_SOCIAL_REAL) {
          try {
            await ensureDemoUser(DEMO_GOOGLE_ACCOUNT);
          } catch (error) {
            throw new Error(friendlyAuthError(error));
          }
          return;
        }
        if (!googleSignInConfig?.webClientId) {
          throw new Error("Google sign-in isn't configured. Set GOOGLE_SIGNIN_WEB_CLIENT_ID and rebuild.");
        }
        try {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
          const response = await GoogleSignin.signIn();
          if (response.type === "cancelled") return;

          const { idToken, user: googleUser } = response.data;
          if (!idToken) throw new Error("Google didn't return an ID token.");

          const credential = GoogleAuthProvider.credential(idToken);
          const result = await signInWithCredential(auth, credential);
          if (getAdditionalUserInfo(result)?.isNewUser) {
            await createUserDocs(result.user, googleUser.name ?? result.user.displayName ?? "", googleUser.email, "");
          }
        } catch (error) {
          if (isSocialSignInCancellation(error)) return;
          throwFriendly(error);
        }
      },

      signInWithApple: async () => {
        if (!AUTH_SOCIAL_REAL) {
          try {
            await ensureDemoUser(DEMO_APPLE_ACCOUNT);
          } catch (error) {
            throw new Error(friendlyAuthError(error));
          }
          return;
        }
        try {
          if (Platform.OS !== "ios" || !(await AppleAuthentication.isAvailableAsync())) {
            throw new Error("Apple sign-in isn't available on this device.");
          }

          const rawNonce = randomNonce();
          const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
          const appleCredential = await AppleAuthentication.signInAsync({
            requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
            nonce: hashedNonce,
          });
          if (!appleCredential.identityToken) throw new Error("Apple didn't return an identity token.");

          const provider = new OAuthProvider("apple.com");
          const credential = provider.credential({ idToken: appleCredential.identityToken, rawNonce });
          const result = await signInWithCredential(auth, credential);

          if (getAdditionalUserInfo(result)?.isNewUser) {
            // Apple only shares the name/email on the first-ever authorization for this app.
            const fullName = [appleCredential.fullName?.givenName, appleCredential.fullName?.familyName]
              .filter(Boolean)
              .join(" ")
              .trim();
            const email = appleCredential.email ?? result.user.email ?? "";
            if (fullName) await updateProfile(result.user, { displayName: fullName });
            await createUserDocs(result.user, fullName || result.user.displayName || "", email, "");
          }
        } catch (error) {
          if (isSocialSignInCancellation(error)) return;
          throwFriendly(error);
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
