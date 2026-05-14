import { describe, expect, it } from "vitest";
import type { Player } from "@/domain/player/types";
import type { PlayerId } from "@/domain/shared/id";
import {
  canBeApproachedByAgent,
  hasValidGuardianship,
  isMinor,
} from "../eligibility";

const FIXED_NOW = new Date("2026-05-14T12:00:00.000Z");

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: "test-player" as unknown as PlayerId,
    phone: "+221 77 000 0000",
    firstName: "Test",
    lastName: "Player",
    dateOfBirth: new Date("2000-01-01T00:00:00.000Z"),
    nationality: "Sénégalaise",
    city: "Dakar",
    country: "Sénégal",
    clubSituation: "academy",
    primaryPosition: "striker",
    dominantFoot: "right",
    heightCm: 175,
    weightKg: 70,
    parentalConsent: false,
    avatarInitials: "TP",
    avatarColor: "#E4B330",
    status: "published",
    registeredAt: new Date("2026-01-01T00:00:00.000Z"),
    motivation: "Test",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("isMinor", () => {
  it("returns true for a player not yet 18 years old", () => {
    const player = makePlayer({
      dateOfBirth: new Date("2008-06-15T00:00:00.000Z"), // ~17 ans 11 mois au FIXED_NOW
    });
    expect(isMinor(player, FIXED_NOW)).toBe(true);
  });

  it("returns false on the day of the 18th birthday", () => {
    const player = makePlayer({
      dateOfBirth: new Date("2008-05-14T00:00:00.000Z"), // 18 ans pile au FIXED_NOW
    });
    expect(isMinor(player, FIXED_NOW)).toBe(false);
  });

  it("returns false for a 19 years old player", () => {
    const player = makePlayer({
      dateOfBirth: new Date("2007-01-01T00:00:00.000Z"),
    });
    expect(isMinor(player, FIXED_NOW)).toBe(false);
  });

  it("returns true for a player whose birth month is after the current month", () => {
    // FIXED_NOW est en mai ; un joueur né en octobre 2008 a 17 ans révolus
    // au 2026-05-14 (anniversaire des 18 ans pas encore atteint).
    const player = makePlayer({
      dateOfBirth: new Date("2008-10-15T12:00:00.000Z"),
    });
    expect(isMinor(player, FIXED_NOW)).toBe(true);
  });
});

describe("hasValidGuardianship", () => {
  const validatedAt = new Date("2026-01-01T00:00:00.000Z");

  it("returns false when parentalConsent is false", () => {
    const player = makePlayer({
      parentalConsent: false,
      accountHolder: {
        firstName: "Papa",
        lastName: "Test",
        relationship: "father",
        phone: "+221 77 111 1111",
        validatedAt,
      },
    });
    expect(hasValidGuardianship(player)).toBe(false);
  });

  it("returns false when accountHolder is missing", () => {
    const player = makePlayer({
      parentalConsent: true,
      accountHolder: undefined,
    });
    expect(hasValidGuardianship(player)).toBe(false);
  });

  it("returns true with both parentalConsent and accountHolder", () => {
    const player = makePlayer({
      parentalConsent: true,
      accountHolder: {
        firstName: "Papa",
        lastName: "Test",
        relationship: "father",
        phone: "+221 77 111 1111",
        validatedAt,
      },
    });
    expect(hasValidGuardianship(player)).toBe(true);
  });
});

describe("canBeApproachedByAgent", () => {
  it("blocks a minor regardless of guardianship", () => {
    const player = makePlayer({
      dateOfBirth: new Date("2010-01-01T00:00:00.000Z"), // ~16 ans
      parentalConsent: true,
      accountHolder: {
        firstName: "Papa",
        lastName: "Test",
        relationship: "father",
        phone: "+221 77 111 1111",
        validatedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    });
    const decision = canBeApproachedByAgent(player, FIXED_NOW);
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("minor_blocked_by_article_19");
  });

  it("allows an adult", () => {
    const player = makePlayer({
      dateOfBirth: new Date("2000-01-01T00:00:00.000Z"), // ~26 ans
    });
    const decision = canBeApproachedByAgent(player, FIXED_NOW);
    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBeUndefined();
  });
});
