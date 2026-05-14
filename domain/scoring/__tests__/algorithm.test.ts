import { describe, it, expect } from "vitest";
import type { Media } from "@/domain/media/types";
import type { Player } from "@/domain/player/types";
import type { MediaId, PlayerId } from "@/domain/shared/id";
import type { Position } from "@/domain/shared/position";
import { computeScoring } from "../algorithm";

const FIXED_NOW = new Date("2026-05-14T12:00:00.000Z");

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

// Fixed player used across deterministic and snapshot tests.
const SNAPSHOT_PLAYER: Player = {
  id: "snap-player-001" as unknown as PlayerId,
  phone: "+221 77 000 0000",
  firstName: "Amadou",
  lastName: "Diallo",
  dateOfBirth: new Date("2008-03-15T00:00:00.000Z"),
  nationality: "Sénégalaise",
  city: "Dakar",
  country: "Sénégal",
  clubSituation: "academy",
  currentClub: "Diambars",
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

const SNAPSHOT_MEDIAS: readonly Media[] = [
  {
    id: "media-snap-001" as unknown as MediaId,
    playerId: SNAPSHOT_PLAYER.id,
    kind: "match_video",
    title: "Match Diambars vs Génération Foot",
    durationSec: 240,
    format: "horizontal",
    blobRef: "supabase://snap/match-001",
    uploadedAt: new Date("2026-01-20T10:00:00.000Z"),
    createdAt: new Date("2026-01-20T10:00:00.000Z"),
    updatedAt: new Date("2026-01-20T10:00:00.000Z"),
  },
  {
    id: "media-snap-002" as unknown as MediaId,
    playerId: SNAPSHOT_PLAYER.id,
    kind: "tech_video",
    title: "Geste technique pied droit",
    durationSec: 90,
    format: "vertical",
    blobRef: "supabase://snap/tech-001",
    uploadedAt: new Date("2026-01-25T10:00:00.000Z"),
    createdAt: new Date("2026-01-25T10:00:00.000Z"),
    updatedAt: new Date("2026-01-25T10:00:00.000Z"),
  },
];

describe("computeScoring", () => {
  it("[determinism] produces identical outputs for identical inputs", () => {
    const a = computeScoring(SNAPSHOT_PLAYER, SNAPSHOT_MEDIAS, FIXED_NOW);
    const b = computeScoring(SNAPSHOT_PLAYER, SNAPSHOT_MEDIAS, FIXED_NOW);
    expect(b).toEqual(a);
  });

  it("[range] value is an integer in [0, 100]", () => {
    const { value } = computeScoring(
      SNAPSHOT_PLAYER,
      SNAPSHOT_MEDIAS,
      FIXED_NOW,
    );
    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(100);
  });

  it("[range] each criterion note is in [1, 10] with 0.5 step", () => {
    const { evaluation } = computeScoring(
      SNAPSHOT_PLAYER,
      SNAPSHOT_MEDIAS,
      FIXED_NOW,
    );
    const all = [
      ...evaluation.technical,
      ...evaluation.physical,
      ...evaluation.tactical,
      ...evaluation.mental,
    ];
    for (const c of all) {
      expect(c.note).toBeGreaterThanOrEqual(1);
      expect(c.note).toBeLessThanOrEqual(10);
      expect((c.note * 2) % 1).toBe(0);
    }
  });

  it("[coverage] every position produces exactly 8 criteria spread across 4 categories", () => {
    for (const position of ALL_POSITIONS) {
      const player: Player = { ...SNAPSHOT_PLAYER, primaryPosition: position };
      const { evaluation } = computeScoring(player, [], FIXED_NOW);
      const total =
        evaluation.technical.length +
        evaluation.physical.length +
        evaluation.tactical.length +
        evaluation.mental.length;
      expect(total).toBe(8);
    }
  });

  it("[shape] returns strengths (top 3) and improvementAreas (bottom 2)", () => {
    const { evaluation } = computeScoring(
      SNAPSHOT_PLAYER,
      SNAPSHOT_MEDIAS,
      FIXED_NOW,
    );
    expect(evaluation.strengths).toHaveLength(3);
    expect(evaluation.improvementAreas).toHaveLength(2);
    expect(evaluation.commentary.length).toBeGreaterThan(0);
  });

  it("[metadata] uses injected now and ia-v1 generator", () => {
    const result = computeScoring(SNAPSHOT_PLAYER, SNAPSHOT_MEDIAS, FIXED_NOW);
    expect(result.generatedAt.toISOString()).toBe(FIXED_NOW.toISOString());
    expect(result.generatedBy).toBe("ia-v1");
  });

  it("[regression] snapshot of full result for SNAPSHOT_PLAYER", () => {
    const result = computeScoring(SNAPSHOT_PLAYER, SNAPSHOT_MEDIAS, FIXED_NOW);
    expect(result).toMatchSnapshot();
  });
});
