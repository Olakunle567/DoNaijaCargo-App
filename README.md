# D.O Naija Cargo

D.O Naija Cargo is a cross-platform Expo application for managing cargo shipments, delivery estimates, tracking, haulage, and dispatch rides, backed by Firebase (Auth, Firestore, and Cloud Functions).

## Current Status

- Expo SDK 57 application
- TypeScript with strict compiler checks
- React Native for Android and iOS, with React Native Web support
- React Navigation stack and bottom-tab navigation types prepared for the main product flows
- NativeWind and Tailwind CSS styling
- Outfit font family loaded at startup
- Firebase Auth (email/password, session persisted via AsyncStorage) backs sign-in; Firestore + Cloud Functions back shipments, tracking, rides, haulage, shop, and the wallet — see [Backend (Firebase)](#backend-firebase) below

## Requirements

Install the following before starting development:

- Node.js compatible with Expo SDK 57
- npm
- Expo Go on a physical device, or an Android emulator / iOS simulator
- For native development: Android Studio and an Android SDK, or Xcode on macOS for iOS

Check the installed versions with:

```bash
node --version
npm --version
```

## Getting Started

Clone the repository and install its dependencies:

```bash
git clone https://github.com/Olakunle567/DoNaijaCargo-App.git
cd DoNaijaCargo-App
npm install
```

Start the Expo development server:

```bash
npm start
```

Use the Expo CLI prompts or the commands below to open a target platform:

```bash
npm run android
npm run ios
npm run web
```

To test on a physical device, ensure the device and development machine are on the same network, install Expo Go, and scan the QR code shown by the Expo CLI. An emulator or simulator must already be installed and running before using the corresponding platform command.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Start Expo and open Android |
| `npm run ios` | Start Expo and open iOS |
| `npm run web` | Start Expo and open the web app |

The Expo app itself does not define automated test, lint, or production build scripts. The Firebase backend does — see [Testing](#testing) under Backend (Firebase).

## Application Structure

```text
.
├── App.tsx                    # Application root, fonts, splash screen, and providers
├── app.json / app.config.ts   # Expo config; app.config.ts injects Firebase env vars
├── firebase.json               # Emulator ports + Firestore/Functions deploy targets
├── .firebaserc                 # Firebase project alias (replace the placeholder)
├── firestore.rules             # Security rules
├── firestore.indexes.json      # Composite indexes
├── functions/                  # Cloud Functions (Node 20 + TypeScript)
│   └── src/
│       ├── pricing.ts, shipments.ts, tracking.ts   # getEstimate, bookShipment, advanceTracking
│       ├── rides.ts, haulage.ts                    # requestRide, cancelRide, submitHaulage
│       ├── orders.ts, wallet.ts, payments/         # placeOrder, topUpWallet + PaymentProvider
│       ├── scripts/seedProducts.ts                 # Seeds the products collection
│       └── *.test.ts                               # node:test unit/integration tests
├── firestore-tests/             # @firebase/rules-unit-testing suite for firestore.rules
├── global.css                  # NativeWind directives
├── index.ts                    # Expo entry point
├── assets/
│   └── images/                # Logos, illustrations, icons, and delivery imagery
└── src/
	├── auth/                  # Firebase Auth context and hooks
	├── lib/firebase.ts        # Firebase app/Auth/Firestore/Functions init + emulator wiring
	├── shipments/, rides/, haulage/, shop/, wallet/, orders/  # Domain hooks + Cloud Functions callable wrappers
	├── chat/                  # Local-only context (not yet backed by Firestore)
	├── navigation/            # Navigator components and typed route params
	├── screens/
	│   ├── auth/              # Splash, sign-in, and sign-up screens
	│   └── main/              # Home, shipping, tracking, account, and shop screens
	├── theme/                 # Shared color tokens
	└── ui/                    # Reusable headers, fields, buttons, tabs, and illustrations
```

## Navigation Domains

Route parameter types are defined in `src/navigation/types.ts`:

- **Authentication:** splash, sign in, and sign up
- **Home:** dashboard, shipments, haulage, and shop
- **Shipping:** shipment form, estimate, and confirmation with a tracking reference
- **Tracking:** shipment tracking
- **Riding:** ride request and active ride states
- **Account:** account management

`App.tsx` initializes the gesture-handler root, safe-area provider, React Navigation container, dark status bar, Outfit fonts, and splash-screen lifecycle. The auth navigator is the current entry navigator.

## Styling

UI components use NativeWind class names. Tailwind configuration lives in `tailwind.config.js` and includes the project design tokens:

- Brand green: `#1B4332`
- Ink: `#111827`
- Body text: `#374151`
- Muted text: `#8A9A92`
- Surface: `#F3F5F4`

Reusable UI primitives are in `src/ui`, including `Button`, `TextField`, `ScreenContainer`, headers, the bottom tab bar, and visual illustration components. Prefer extending these components and existing theme tokens when adding screens.

## Assets

The project includes local assets for the D.O Naija Cargo brand and product experience, including:

- Full and mark logo images
- Google and Apple sign-in marks
- Map and wireframe illustrations
- Truck icon
- Delivery rider image

Expo app icons and web favicon are configured in `app.json`.

## Development Notes

- Keep route names and parameters synchronized with `src/navigation/types.ts`.
- Use the existing Outfit font utility classes rather than introducing a second font family.
- Keep platform-specific behavior inside the relevant screen or UI component and verify it on web when the component is shared.
- Email/password sign-in and sign-up are real (Firebase Auth). Google/Apple sign-in still run the mocked, timer-based sheets and sign in a fixed demo Firebase user behind the `AUTH_SOCIAL_REAL` flag — see [Mocked seams](#mocked-seams).
- Password recovery ("Forgot Password?" on SignInScreen) is still local-only UI; it doesn't call `sendPasswordResetEmail` yet.

## Backend (Firebase)

The app talks to Firebase directly from the client (Auth, Firestore reads/live
listeners, and `httpsCallable` Cloud Functions) and never computes anything
security- or money-sensitive itself — pricing, tracking-ref allocation,
wallet balance, and order totals are all server-computed and enforced by
`firestore.rules`.

### Collections

| Path | Written by | Notes |
| --- | --- | --- |
| `users/{uid}` | client (owner) | Profile: `fullName`, `email`, `phone`, `createdAt`. |
| `users/{uid}/wallet/current` | client **once**, then functions only | `balance`, `walletId`, `currency`. Client may `create` it exactly once, at sign-up, pinned to the fixed starting balance; every later write (top-ups, debits) is function-written. |
| `users/{uid}/cart/{productId}` | client | `productId`, `qty`. Fully client-owned — no callable involved. |
| `products/{id}` | seed script only | `name`, `emoji`, `category`, `price`, `rating`, `ratingCount`, `badge?`. Readable by any signed-in user. |
| `shipments/{id}` | client (create/update) + **functions** | `ownerUid`, `sender`, `receiver`, `cargo`, `fromCity`, `toCity`, `serviceTier`, `insured`, plus function-written `trackingRef`, `priceBreakdown`, `total`, `status`. |
| `shipments/{id}/milestones/{mid}` | **functions only** | `label`, `timestamp`, `location`, `state` (`'done' \| 'current'`; a `'pending'` step is synthesized client-side for stages with no doc yet). |
| `rides/{id}` | **functions only** | `ownerUid`, `pickup`, `dropoff`, `vehicleType`, `priceEstimate`, `etaMin`, `rider` (or `null`), `status`, `cancellationFee?`. |
| `haulageRequests/{id}` | **functions only** | `ownerUid`, `truckType`, `pickup`, `dropoff`, `description`, `weightRange`, `preferredDate`, `status`. |
| `orders/{id}` | **functions only** | `ownerUid`, `items[]`, `total`, `status`. |
| `counters/shipments-{year}` | **functions only** | Internal; not client-readable. Backs the `DN-YYYY-#####` tracking-ref allocator. |

### Function-written fields

Anything listed as "functions only" above is closed to client writes entirely
(`allow write: if false`) — the collection has no valid client write path, so
locking down every field is simplest and safest. `shipments` and
`users/{uid}/wallet/current` are more surgical, since the client legitimately
owns part of the document:

- **shipments** — client can `create`/`update` everything *except*
  `trackingRef`, `priceBreakdown`, `total`, and `status`, which only
  `bookShipment` (create) and the tracking functions (update) ever set.
  Enforced by `keysExclude`/`noneOf` helpers in `firestore.rules`.
- **wallet/current** — client can `create` the document once, but only with
  the exact starting balance (`36650`, hardcoded in the rule to match
  `INITIAL_WALLET_BALANCE_NGN` in `AuthContext.tsx`); `update`/`delete` are
  closed, so `topUpWallet` and `placeOrder` are the only things that ever
  change a balance after that.

### Mocked seams

Three integration points are deliberately stubbed. Each is isolated behind a
narrow interface (or a single function) so swapping in the real thing doesn't
touch call sites elsewhere in the app.

1. **Payment** — `functions/src/payments/PaymentProvider.ts` defines the
   interface; `MockProvider.ts` implements it by instantly "succeeding" any
   top-up. `wallet.ts`'s `topUpWallet` is the only caller
   (`new MockProvider()`). **To go live:** write a class (e.g.
   `PaystackProvider`) that satisfies `PaymentProvider` by verifying a
   transaction reference against the gateway's API — never by trusting the
   client-supplied amount, the way the mock does — and swap the
   `new MockProvider()` line in `wallet.ts`. The gateway's secret key belongs
   in a [Functions secret](#environment-variables--secrets), never in code
   or a plain `.env`.
2. **Tracking** — two mocks: `functions/src/rides.ts`'s `onRideRequested`
   (a Firestore-create trigger that waits ~2.5s then assigns a fixed mock
   rider and flips the ride to `'matched'`), and
   `functions/src/tracking.ts`'s `advanceTracking` (a `__DEV__`-gated
   callable that manually steps a shipment through its milestones — there's
   a matching dev-only button on TrackScreen). **To go live:** replace
   `onRideRequested` with whatever a real dispatch/matching service writes
   (a callable a rider's app calls to accept, or a webhook), writing the
   same `{ rider, status: 'matched' }` shape; give tracking its own webhook
   entry point — `tracking.ts` has a TODO showing the exact
   `advanceTrackingWebhook = onRequest(...)` shape, verifying an HMAC/shared
   secret instead of Firebase Auth — and call the same
   `applyNextMilestone(trackingRef)` used by the dev callable, then delete or
   admin-gate `advanceTracking` once it exists.
3. **Push** — **not implemented.** `AppHeader.tsx`'s notification bell reads
   a hardcoded local `NOTIFICATIONS` array with a local `unread` counter;
   nothing server-side triggers it, and it isn't scoped to the signed-in
   user. **To go live:** add a `users/{uid}/notifications/{id}` collection,
   have the relevant Cloud Functions write to it at key transitions
   (`onRideRequested` on match, `applyNextMilestone` on each shipment
   milestone, `placeOrder` on order placement), and send a push via
   `admin.messaging().send(...)` using a device token the client registers
   (e.g. with `expo-notifications`) to `users/{uid}/pushTokens/{token}`.
   Swap `AppHeader`'s local array for a live `onSnapshot` on that
   collection. Following the `PaymentProvider` pattern, a
   `PushProvider`/`FcmProvider` pair would keep the messaging API isolated
   the same way.

### Environment variables & secrets

**App** (`.env`, see `.env.example`) — read by `app.config.ts` and exposed to
the app via `Constants.expoConfig.extra`:

- `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`,
  `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`,
  `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID` (optional) — from the Firebase
  console. Not secret (they identify the project, not authorize access), but
  still not hardcoded.
- `EXPO_PUBLIC_FIREBASE_EMULATOR_HOST` (dev only) — LAN IP for a physical
  device to reach the local emulators; defaults to `localhost`.
- `EXPO_PUBLIC_AUTH_SOCIAL_REAL` (dev flag) — `false` until real
  expo-auth-session Google/Apple credentials are wired up.

**Functions** — none required today; `MockProvider` needs no credentials.
Once a real `PaymentProvider` (or any other integration needing an API key)
is added, set it as a Cloud Functions secret rather than an env var or
`.env` file, since those aren't available at runtime for deployed functions
the way they are for the Expo app:

```bash
firebase functions:secrets:set PAYSTACK_SECRET_KEY
```

then declare and bind it in code:

```ts
import { defineSecret } from "firebase-functions/params";
const paystackSecretKey = defineSecret("PAYSTACK_SECRET_KEY");

export const topUpWallet = onCall({ secrets: [paystackSecretKey] }, async (request) => {
  const key = paystackSecretKey.value();
  // ...
});
```

### Testing

Requires the Firebase CLI (`npm install -g firebase-tools`, or prefix each
command with `npx`). `--project` can be any lowercase string here — these
run entirely against the local emulator and never touch a real project, so
this works before `.firebaserc` has a real project id.

```bash
# Functions: pure pricing unit tests + placeOrder transaction tests (needs the emulator)
firebase emulators:exec --project demo-test --only firestore "npm --prefix functions test"

# Firestore security rules
firebase emulators:exec --project demo-test --only firestore "npm --prefix firestore-tests test"
```

Both use Node's built-in test runner (`node:test`); `firestore-tests/`
additionally needs `npm install` run once (it's a separate package, not part
of the Expo app's `node_modules`).

### Deploy runbook

1. **Point at the right project** — replace the placeholder in `.firebaserc`
   with your real Firebase project ID (or run
   `firebase use --add` to select one), and confirm with `firebase login`
   if you haven't already authenticated the CLI.
2. **Run the checks** — from the repo root:
   ```bash
   npx tsc --noEmit                                                                    # app
   npm --prefix functions run build                                                   # functions typecheck
   firebase emulators:exec --project demo-test --only firestore "npm --prefix functions test"
   firebase emulators:exec --project demo-test --only firestore "npm --prefix firestore-tests test"
   ```
3. **Deploy rules, indexes, and functions** (skips Hosting — there is none):
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,functions
   ```
   `functions`' `predeploy` hook (`firebase.json`) runs `npm run build`
   automatically, so there's no separate build step needed here.
4. **Seed products in the real project, once** (never touches the
   emulator when `SEED_TARGET=prod` is set):
   ```bash
   SEED_TARGET=prod npm --prefix functions run seed:products
   ```
   Requires `GOOGLE_APPLICATION_CREDENTIALS` pointing at a service account
   with Firestore write access (Application Default Credentials also work if
   you're already `gcloud auth application-default login`'d against that
   project).
5. **Point the app at prod** — fill in `.env` with the real project's
   Firebase config (from `.env.example`), and make sure
   `EXPO_PUBLIC_FIREBASE_EMULATOR_HOST`/`__DEV__` aren't accidentally routing
   a production build at the emulator (the emulator connection in
   `src/lib/firebase.ts` is gated on `__DEV__`, which Expo sets to `false` in
   release builds, so this is automatic for a real production build — only a
   concern if testing a dev client against prod).

## License

This project is distributed under the license in [LICENSE](LICENSE).