# D.O Naija Cargo

D.O Naija Cargo is a cross-platform Expo application for managing cargo shipments, delivery estimates, tracking, haulage, and dispatch rides. The project currently focuses on the mobile UI foundation and navigation flows, with a lightweight in-memory authentication prototype.

## Current Status

- Expo SDK 57 application
- TypeScript with strict compiler checks
- React Native for Android and iOS, with React Native Web support
- React Navigation stack and bottom-tab navigation types prepared for the main product flows
- NativeWind and Tailwind CSS styling
- Outfit font family loaded at startup
- Authentication state is currently local component state; no API, database, token persistence, or production identity provider is connected yet

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

The project does not currently define automated test, lint, or production build scripts.

## Application Structure

```text
.
├── App.tsx                    # Application root, fonts, splash screen, and providers
├── app.json                   # Expo application configuration
├── global.css                 # NativeWind directives
├── index.ts                   # Expo entry point
├── assets/
│   └── images/                # Logos, illustrations, icons, and delivery imagery
└── src/
	├── auth/                  # Authentication context and hooks
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
- Authentication actions currently simulate completion locally. Connect them to a backend before treating sign-in, sign-up, password recovery, or social login as production functionality.

## License

This project is distributed under the license in [LICENSE](LICENSE).