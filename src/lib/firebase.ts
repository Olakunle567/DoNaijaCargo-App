import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = Constants.expoConfig?.extra?.firebase as FirebaseOptions | undefined;

if (__DEV__) {
  console.log("[firebase] config loaded from Constants.expoConfig.extra.firebase:", {
    apiKey: !!firebaseConfig?.apiKey,
    authDomain: !!firebaseConfig?.authDomain,
    projectId: firebaseConfig?.projectId ?? "(missing)",
    appId: !!firebaseConfig?.appId,
  });
}

if (!firebaseConfig?.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    "Missing Firebase config. Set the FIREBASE_* env vars described in .env.example, then restart the Expo dev server."
  );
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth throws "auth/already-initialized" if this module re-evaluates
// (e.g. Fast Refresh), so fall back to the existing instance when that happens.
let authInstance: Auth;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}
export const auth = authInstance;

// Opt-in, default OFF. GitHub Codespaces forwards each local port to its own
// private HTTPS subdomain, which the Firebase JS SDK can't reliably reach
// from a browser tab (auth interstitials, stale-singleton emulator locks,
// cross-origin quirks) — that's the persistent "Network error" on web. Real
// Firebase is the reliable default for web dev here. Set
// EXPO_PUBLIC_USE_EMULATOR=true (and run `firebase emulators:start`) to opt
// back in — e.g. for a physical device on the same LAN as the emulators.
const useEmulator = process.env.EXPO_PUBLIC_USE_EMULATOR === "true";

// Only relevant when useEmulator is on: GitHub Codespaces forwards each port
// to its own HTTPS subdomain (<codespace-name>-<port>.app.github.dev) instead
// of exposing it as localhost:<port>.
const codespaceHost =
  useEmulator && Platform.OS === "web" && typeof window !== "undefined"
    ? window.location.hostname.match(/^(.+)-\d+\.app\.github\.dev$/)?.[1]
    : undefined;

// initializeFirestore throws if a Firestore instance already exists for this
// app (e.g. Fast Refresh), so fall back to the existing instance then too.
let dbInstance: Firestore;
try {
  dbInstance = codespaceHost
    ? initializeFirestore(app, { host: `${codespaceHost}-8080.app.github.dev`, ssl: true })
    : getFirestore(app);
} catch {
  dbInstance = getFirestore(app);
}
export const db = dbInstance;

export const functions = getFunctions(app);

if (__DEV__ && useEmulator) {
  // Override with your machine's LAN IP (via EXPO_PUBLIC_FIREBASE_EMULATOR_HOST)
  // when running on a physical device, where "localhost" resolves to the device itself.
  const emulatorHost = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST ?? "localhost";

  const authEmulatorUrl = codespaceHost
    ? `https://${codespaceHost}-9099.app.github.dev`
    : `http://${emulatorHost}:9099`;

  console.log("[firebase] EXPO_PUBLIC_USE_EMULATOR=true — connecting Auth emulator at:", authEmulatorUrl);

  // Guard against reconnecting on Fast Refresh, which throws if a service was already used.
  try {
    connectAuthEmulator(auth, authEmulatorUrl, { disableWarnings: true });
    // Firestore is already pointed at the emulator above (via initializeFirestore)
    // when running behind Codespaces' forwarded HTTPS domain.
    if (!codespaceHost) connectFirestoreEmulator(db, emulatorHost, 8080);
    if (codespaceHost) {
      // connectFunctionsEmulator always builds `http(s)://host:port`, and only
      // adds the `s` for Google's own Cloud Workstations domain — it can't
      // produce a Codespaces forwarded-subdomain URL. `emulatorOrigin` is the
      // same field connectFunctionsEmulator sets internally (not part of the
      // public Functions type, but a plain, stable property); set it directly
      // to the forwarded HTTPS origin instead, no port suffix.
      (functions as unknown as { emulatorOrigin: string | null }).emulatorOrigin =
        `https://${codespaceHost}-5001.app.github.dev`;
    } else {
      connectFunctionsEmulator(functions, emulatorHost, 5001);
    }
    console.log("[firebase] emulators connected OK (auth, firestore, functions)");
  } catch (error) {
    console.error("[firebase] emulator connection FAILED — auth/db/functions may be pointed at the wrong host:", error);
  }
} else if (__DEV__) {
  console.log("[firebase] using real Firebase (no emulator)");
}
