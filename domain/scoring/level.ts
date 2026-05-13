// Legacy: lib/niveaux.ts
//   bronze   → bronze
//   argent   → silver
//   or       → gold
//   platine  → platinum
export type Level = "bronze" | "silver" | "gold" | "platinum";

export interface LevelInfo {
  key: Level;
  label: string;
  background: string;
  border: string;
  text: string;
  accent: string;
  symbol: string;
  description: string;
  range: readonly [number, number];
}

export const LEVELS: Record<Level, LevelInfo> = {
  bronze: {
    key: "bronze",
    label: "Bronze",
    background: "#3a2a1a",
    border: "#cd7f32",
    text: "#f5d4a8",
    accent: "#cd7f32",
    symbol: "■",
    description: "Profil en construction. Les fondamentaux sont là.",
    range: [0, 44],
  },
  silver: {
    key: "silver",
    label: "Argent",
    background: "#2a2d33",
    border: "#c0c0c0",
    text: "#e8e8e8",
    accent: "#c0c0c0",
    symbol: "◆",
    description: "Profil solide. Visible auprès des recruteurs nationaux.",
    range: [45, 64],
  },
  gold: {
    key: "gold",
    label: "Or",
    background: "#3d2f10",
    border: "#E4B330",
    text: "#F0CF6E",
    accent: "#E4B330",
    symbol: "★",
    description:
      "Profil distingué. Visible auprès des clubs européens de D2/D3.",
    range: [65, 79],
  },
  platinum: {
    key: "platinum",
    label: "Platine",
    background: "#1a2a2e",
    border: "#b9f2ff",
    text: "#d8f4ff",
    accent: "#b9f2ff",
    symbol: "◈",
    description: "Profil d'élite. Visible auprès des clubs d'élite européens.",
    range: [80, 100],
  },
};

const LEVEL_ORDER: readonly Level[] = ["bronze", "silver", "gold", "platinum"];

export function levelForScore(score: number | undefined | null): LevelInfo {
  const s = typeof score === "number" ? score : 0;
  if (s >= 80) return LEVELS.platinum;
  if (s >= 65) return LEVELS.gold;
  if (s >= 45) return LEVELS.silver;
  return LEVELS.bronze;
}

export interface LevelProgress {
  currentLevel: LevelInfo;
  nextLevel: LevelInfo | null;
  pointsToNextLevel: number;
  percentageWithinLevel: number;
}

export function progressToNextLevel(score: number): LevelProgress {
  const currentLevel = levelForScore(score);
  const idx = LEVEL_ORDER.indexOf(currentLevel.key);
  const nextLevel =
    idx < LEVEL_ORDER.length - 1 ? LEVELS[LEVEL_ORDER[idx + 1]] : null;
  const [min, max] = currentLevel.range;
  const span = max - min;
  const percentageWithinLevel =
    span > 0
      ? Math.max(0, Math.min(100, Math.round(((score - min) / span) * 100)))
      : 100;
  return {
    currentLevel,
    nextLevel,
    pointsToNextLevel: nextLevel ? nextLevel.range[0] - score : 0,
    percentageWithinLevel,
  };
}
