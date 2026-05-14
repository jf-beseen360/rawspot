import { describe, it, expect } from "vitest";
import type { Player } from "@/domain/player/types";
import type { PlayerId } from "@/domain/shared/id";
import {
  computeHierarchicalRanking,
  computeProjections,
  estimateMarketValue,
  findClosestStyle,
  formatEur,
} from "../chain-of-analysis";

const FIXED_NOW = new Date("2026-05-14T12:00:00.000Z");

const PLAYER: Player = {
  id: "chain-player-001" as unknown as PlayerId,
  phone: "+221 77 000 0000",
  firstName: "Amadou",
  lastName: "Diallo",
  dateOfBirth: new Date("2008-03-15T00:00:00.000Z"),
  nationality: "Sénégalaise",
  city: "Dakar",
  country: "Sénégal",
  clubSituation: "academy",
  primaryPosition: "striker",
  dominantFoot: "right",
  heightCm: 182,
  weightKg: 75,
  parentalConsent: true,
  avatarInitials: "AD",
  avatarColor: "#E4B330",
  status: "published",
  registeredAt: new Date("2026-01-15T10:00:00.000Z"),
  motivation: "Devenir pro",
  openToOutreach: true,
  createdAt: new Date("2026-01-15T10:00:00.000Z"),
  updatedAt: new Date("2026-02-01T10:00:00.000Z"),
};

describe("computeHierarchicalRanking", () => {
  it("returns the four levels with non-empty labels", () => {
    const r = computeHierarchicalRanking(PLAYER, 70, FIXED_NOW);
    expect(r.country.label.length).toBeGreaterThan(0);
    expect(r.zone.label.length).toBeGreaterThan(0);
    expect(r.continent.label.length).toBeGreaterThan(0);
    expect(r.world.label.length).toBeGreaterThan(0);
  });

  it("monotonically expands cohort from country to world", () => {
    const r = computeHierarchicalRanking(PLAYER, 70, FIXED_NOW);
    expect(r.zone.total).toBeGreaterThanOrEqual(r.country.total);
    expect(r.continent.total).toBeGreaterThanOrEqual(r.zone.total);
    expect(r.world.total).toBeGreaterThanOrEqual(r.continent.total);
  });

  it("clamps percentile within [1, 99]", () => {
    const r = computeHierarchicalRanking(PLAYER, 70, FIXED_NOW);
    for (const level of [r.country, r.zone, r.continent, r.world]) {
      expect(level.percentile).toBeGreaterThanOrEqual(1);
      expect(level.percentile).toBeLessThanOrEqual(99);
      expect(level.rank).toBeGreaterThanOrEqual(1);
    }
  });

  it("[determinism] same inputs produce identical output", () => {
    const a = computeHierarchicalRanking(PLAYER, 70, FIXED_NOW);
    const b = computeHierarchicalRanking(PLAYER, 70, FIXED_NOW);
    expect(b).toEqual(a);
  });
});

describe("computeProjections", () => {
  it("returns exactly 3 projections at 2y / 3y / 5y", () => {
    const p = computeProjections(PLAYER, 70, FIXED_NOW);
    expect(p).toHaveLength(3);
    expect(p.map((x) => x.years)).toEqual([2, 3, 5]);
  });

  it("caps the projected score at 98 and never decreases it", () => {
    const p = computeProjections(PLAYER, 70, FIXED_NOW);
    for (const projection of p) {
      expect(projection.projectedScore).toBeGreaterThanOrEqual(70);
      expect(projection.projectedScore).toBeLessThanOrEqual(98);
      expect(projection.expectedLevel.length).toBeGreaterThan(0);
    }
  });

  it("[determinism] same inputs produce identical output", () => {
    const a = computeProjections(PLAYER, 70, FIXED_NOW);
    const b = computeProjections(PLAYER, 70, FIXED_NOW);
    expect(b).toEqual(a);
  });
});

describe("findClosestStyle", () => {
  it("returns a star matching the player position for each of the 8 positions", () => {
    const positions = [
      "goalkeeper",
      "centre_back",
      "full_back",
      "defensive_midfielder",
      "central_midfielder",
      "attacking_midfielder",
      "winger",
      "striker",
    ] as const;
    for (const position of positions) {
      const player: Player = { ...PLAYER, primaryPosition: position };
      const style = findClosestStyle(player, FIXED_NOW);
      expect(style.star.position).toBe(position);
      expect(style.reason.length).toBeGreaterThan(0);
    }
  });

  it("[determinism] same inputs produce identical output", () => {
    const a = findClosestStyle(PLAYER, FIXED_NOW);
    const b = findClosestStyle(PLAYER, FIXED_NOW);
    expect(b).toEqual(a);
  });
});

describe("estimateMarketValue", () => {
  it("returns internally consistent ranges and net values", () => {
    const v = estimateMarketValue(PLAYER, 70, FIXED_NOW);
    expect(v.rangeMin).toBeLessThanOrEqual(v.rangeMax);
    expect(v.netMin).toBeGreaterThanOrEqual(0);
    expect(v.netMax).toBeGreaterThanOrEqual(v.netMin);
    expect(v.trainingCompensation).toBeGreaterThanOrEqual(0);
    expect(v.solidarityMechanism).toBeGreaterThanOrEqual(0);
    expect(v.calculationDetails.length).toBe(3);
  });

  it("[determinism] same inputs produce identical output", () => {
    const a = estimateMarketValue(PLAYER, 70, FIXED_NOW);
    const b = estimateMarketValue(PLAYER, 70, FIXED_NOW);
    expect(b).toEqual(a);
  });

  it("[regression] snapshot of estimateMarketValue for PLAYER, score 70", () => {
    const v = estimateMarketValue(PLAYER, 70, FIXED_NOW);
    expect(v).toMatchSnapshot();
  });
});

describe("formatEur", () => {
  it("formats euros in three magnitude buckets", () => {
    expect(formatEur(0)).toBe("0 €");
    expect(formatEur(750)).toBe("750 €");
    expect(formatEur(12_000)).toBe("12 k€");
    expect(formatEur(1_500_000)).toBe("1.5 M€");
  });
});
