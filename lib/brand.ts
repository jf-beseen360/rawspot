// RawSpot brand constants. Pure values, no React, no DOM.
//
// LEVELS is re-exported from domain/scoring/level.ts to keep a single source
// of truth for Bronze/Argent/Or/Platine — the brand layer only re-exposes
// what UI consumers need to import from a single place.

export { LEVELS, levelForScore, progressToNextLevel } from "@/domain/scoring/level";
export type { Level, LevelInfo, LevelProgress } from "@/domain/scoring/level";

export const BRAND_NAME = "RawSpot" as const;
export const BRAND_NAME_WITH_DEGREE = "RawSpot°" as const;
export const BRAND_TAGLINE = "Être vu. Être choisi." as const;

// Brand palette — separate from the scoring level palette (gold here is the
// brand gold; the gold used for the "Or" tier badge lives in LEVELS.gold and
// is intentionally a slightly different shade).
export const BRAND_COLORS = {
  gold: "#D4A017",
  black: "#0A0A0A",
  white: "#FAFAFA",
} as const;

export const BRAND_FONTS = {
  sans: "var(--font-geist-sans)",
  mono: "var(--font-geist-mono)",
} as const;
