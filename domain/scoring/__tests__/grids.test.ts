import { describe, it, expect } from "vitest";
import type { Position } from "@/domain/shared/position";
import { GRIDS_BY_POSITION, totalCriteria } from "../grids";

const ALL_POSITIONS: readonly Position[] = [
  "goalkeeper",
  "centre_back",
  "full_back",
  "defensive_midfielder",
  "central_midfielder",
  "attacking_midfielder",
  "winger",
  "striker",
];

describe("GRIDS_BY_POSITION", () => {
  it("covers exactly the 8 positions", () => {
    expect(Object.keys(GRIDS_BY_POSITION).sort()).toEqual(
      [...ALL_POSITIONS].sort(),
    );
  });

  it("has exactly 8 criteria per position", () => {
    for (const position of ALL_POSITIONS) {
      expect(GRIDS_BY_POSITION[position].length).toBe(8);
      expect(totalCriteria(position)).toBe(8);
    }
  });

  it("uses only the 4 documented categories", () => {
    const allowed = new Set(["technical", "physical", "tactical", "mental"]);
    for (const position of ALL_POSITIONS) {
      for (const criterion of GRIDS_BY_POSITION[position]) {
        expect(allowed.has(criterion.category)).toBe(true);
      }
    }
  });

  it("uses positive integer weights (1 or 2)", () => {
    for (const position of ALL_POSITIONS) {
      for (const criterion of GRIDS_BY_POSITION[position]) {
        expect(Number.isInteger(criterion.weight)).toBe(true);
        expect(criterion.weight).toBeGreaterThanOrEqual(1);
        expect(criterion.weight).toBeLessThanOrEqual(2);
      }
    }
  });

  it("declares non-empty keys, labels and descriptions", () => {
    for (const position of ALL_POSITIONS) {
      for (const criterion of GRIDS_BY_POSITION[position]) {
        expect(criterion.key.length).toBeGreaterThan(0);
        expect(criterion.label.length).toBeGreaterThan(0);
        expect(criterion.description.length).toBeGreaterThan(0);
      }
    }
  });
});
