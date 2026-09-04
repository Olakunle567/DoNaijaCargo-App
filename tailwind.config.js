const { tailwindFontSize } = require("./src/theme/typography.ts");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1B4332",
          dark: "#132D22",
        },
        ink: "#111827",
        body: "#374151",
        // Darkened from #8A9A92 (same hue/saturation) to clear WCAG AA 4.5:1
        // on white — the original failed at ~2.9:1.
        muted: "#697971",
        placeholder: "#99A1AF",
        surface: "#F3F5F4",
        border: "#E5E7EB",
        "border-brand": "rgba(27,67,50,0.14)",
        apple: "#111827",
      },
      fontSize: tailwindFontSize,
      fontFamily: {
        outfit: ["Outfit_400Regular"],
        "outfit-medium": ["Outfit_500Medium"],
        "outfit-semibold": ["Outfit_600SemiBold"],
        "outfit-bold": ["Outfit_700Bold"],
        "outfit-extrabold": ["Outfit_800ExtraBold"],
        "outfit-black": ["Outfit_900Black"],
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};
