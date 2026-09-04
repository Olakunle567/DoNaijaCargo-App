/**
 * Apple HIG-inspired type scale, adapted to Outfit and this app's compact
 * density. Single source of truth: tailwind.config.js reads `tailwindFontSize`
 * to generate `text-largeTitle`, `text-body`, etc. Pair each with the matching
 * `weightClass` (or a literal `font-outfit-*` class) for the correct Outfit cut.
 */

export type TypeRole =
  | "largeTitle"
  | "title"
  | "headline"
  | "body"
  | "callout"
  | "subhead"
  | "footnote"
  | "caption";

export type FontWeight = "regular" | "medium" | "semibold" | "bold" | "extrabold";

type RoleSpec = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  weight: FontWeight;
};

export const typography: Record<TypeRole, RoleSpec> = {
  // Screen headers / hero greetings
  largeTitle: { fontSize: 30, lineHeight: 36, letterSpacing: -0.4, weight: "extrabold" },
  // Section titles, feature-card titles
  title: { fontSize: 22, lineHeight: 28, letterSpacing: -0.3, weight: "bold" },
  // Card titles, emphasized row labels
  headline: { fontSize: 16, lineHeight: 21, letterSpacing: -0.2, weight: "semibold" },
  // Primary readable text
  body: { fontSize: 16, lineHeight: 22, letterSpacing: 0, weight: "regular" },
  // Secondary emphasized text
  callout: { fontSize: 14, lineHeight: 19, letterSpacing: 0, weight: "medium" },
  // Supporting text, form labels
  subhead: { fontSize: 13, lineHeight: 18, letterSpacing: 0, weight: "regular" },
  // Descriptions under a title, meta text
  footnote: { fontSize: 12, lineHeight: 16, letterSpacing: 0, weight: "regular" },
  // Timestamps, small badges, uppercase field labels
  caption: { fontSize: 11, lineHeight: 14, letterSpacing: 0.1, weight: "medium" },
};

/** `font-outfit-*` className for each weight role. */
export const weightClass: Record<FontWeight, string> = {
  regular: "font-outfit",
  medium: "font-outfit-medium",
  semibold: "font-outfit-semibold",
  bold: "font-outfit-bold",
  extrabold: "font-outfit-extrabold",
};

/** `text-{role} {weightClass}` combined className, e.g. typeClass("headline"). */
export function typeClass(role: TypeRole): string {
  return `text-${role} ${weightClass[typography[role].weight]}`;
}

/** Consumed by tailwind.config.js to build the `fontSize` theme extension. */
export const tailwindFontSize = Object.fromEntries(
  Object.entries(typography).map(([role, spec]) => [
    role,
    [`${spec.fontSize}px`, { lineHeight: `${spec.lineHeight}px`, letterSpacing: `${spec.letterSpacing}px` }],
  ]),
);
