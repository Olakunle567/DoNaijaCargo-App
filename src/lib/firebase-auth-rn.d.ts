import type { Persistence, ReactNativeAsyncStorage } from "firebase/auth";

// The firebase package's public exports map for "firebase/auth" always resolves
// its "types" condition to a browser-oriented .d.ts, even under Metro's
// "react-native" resolution condition, so getReactNativePersistence (which does
// exist in the actual RN build at runtime) is missing from the shipped types.
// https://github.com/firebase/firebase-js-sdk/issues/8104
declare module "firebase/auth" {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
