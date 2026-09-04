import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  // `config` is typed Partial<ExpoConfig> even though app.json already supplies
  // every required field (name, slug, ...) at this point.
  const baseConfig = config as ExpoConfig;

  return {
    ...baseConfig,
    android: {
      ...baseConfig.android,
      // google-services.json is gitignored (matches this project's .env
      // convention — see .gitignore), so EAS Build never has it on disk at
      // the plain "./google-services.json" path app.json declares; it's
      // supplied instead as a file-type EAS environment variable
      // (GOOGLE_SERVICES_JSON), whose value is the *path* to the file EAS
      // injected on the builder. app.json's static string is only correct
      // for a local prebuild where the real file actually sits there.
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? baseConfig.android?.googleServicesFile,
    },
    // @react-native-google-signin/google-signin's config plugin needs the iOS
    // client's reversed URL scheme (from Google Cloud Console, or the
    // REVERSED_CLIENT_ID in GoogleService-Info.plist) baked into the iOS
    // native project so the OAuth redirect can reach the app. It's read from
    // an env var here (rather than hardcoded in app.json) for the same
    // reason the Firebase config below is.
    plugins: [
      ...(baseConfig.plugins ?? []),
      ...(process.env.GOOGLE_SIGNIN_IOS_URL_SCHEME
        ? ([
            ["@react-native-google-signin/google-signin", { iosUrlScheme: process.env.GOOGLE_SIGNIN_IOS_URL_SCHEME }],
          ] satisfies ExpoConfig["plugins"])
        : []),
    ],
    extra: {
      ...baseConfig.extra,
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      },
      googleSignIn: {
        webClientId: process.env.GOOGLE_SIGNIN_WEB_CLIENT_ID,
        iosClientId: process.env.GOOGLE_SIGNIN_IOS_CLIENT_ID,
      },
    },
  };
};
