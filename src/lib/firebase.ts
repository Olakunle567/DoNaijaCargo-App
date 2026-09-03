import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = Constants.expoConfig?.extra?.firebase as FirebaseOptions | undefined;

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

export const db = getFirestore(app);
export const functions = getFunctions(app);

if (__DEV__) {
  // Override with your machine's LAN IP (via EXPO_PUBLIC_FIREBASE_EMULATOR_HOST)
  // when running on a physical device, where "localhost" resolves to the device itself.
  const emulatorHost = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST ?? "localhost";

  // Guard against reconnecting on Fast Refresh, which throws if a service was already used.
  try {
    connectAuthEmulator(auth, `http://${emulatorHost}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(db, emulatorHost, 8080);
    connectFunctionsEmulator(functions, emulatorHost, 5001);
  } catch (error) {
    console.warn("[firebase] emulator connection skipped:", error);
  }
}
