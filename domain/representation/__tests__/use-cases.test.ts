import { describe, expect, it } from "vitest";
import type { Player } from "@/domain/player/types";
import type { PlayerId } from "@/domain/shared/id";
import type {
  AgentId,
  RepresentationRequest,
  RepresentationRequestId,
} from "../types";
import {
  isExpired,
  respondToRequest,
  sendRepresentationRequest,
  toggleOutreachAvailability,
} from "../use-cases";

const FIXED_NOW = new Date("2026-05-14T12:00:00.000Z");

const VALID_MESSAGE =
  "Bonjour, je suis très intéressé par ton profil et souhaite te représenter."; // > 30 chars

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: "test-player" as unknown as PlayerId,
    phone: "+221 77 000 0000",
    firstName: "Test",
    lastName: "Player",
    dateOfBirth: new Date("2000-01-01T00:00:00.000Z"), // ~26 ans, adulte
    nationality: "Sénégalaise",
    city: "Dakar",
    country: "Sénégal",
    clubSituation: "academy",
    primaryPosition: "striker",
    dominantFoot: "right",
    heightCm: 180,
    weightKg: 75,
    parentalConsent: true,
    avatarInitials: "TP",
    avatarColor: "#E4B330",
    status: "published",
    registeredAt: new Date("2026-01-01T00:00:00.000Z"),
    motivation: "Test",
    openToOutreach: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function makeInput(
  player: Player,
  overrides: { message?: string; agentId?: string } = {},
) {
  return {
    id: "req-001" as unknown as RepresentationRequestId,
    request: {
      agentId: (overrides.agentId ?? "agent-001") as unknown as AgentId,
      agentName: "Pitey Test",
      agentFifaLicense: "202507-11145",
      playerId: player.id,
      message: overrides.message ?? VALID_MESSAGE,
    },
    player,
  };
}

function makeRequest(
  overrides: Partial<RepresentationRequest> = {},
): RepresentationRequest {
  return {
    id: "req-001" as unknown as RepresentationRequestId,
    agentId: "agent-001" as unknown as AgentId,
    agentName: "Pitey Test",
    agentFifaLicense: "202507-11145",
    playerId: "player-001" as unknown as PlayerId,
    message: "Test message of sufficient length right here",
    sentAt: new Date("2026-04-01T00:00:00.000Z"),
    status: "sent",
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    updatedAt: new Date("2026-04-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("sendRepresentationRequest", () => {
  it("[message_too_short] rejects a message shorter than 30 chars (trimmed)", () => {
    const player = makePlayer();
    const input = makeInput(player, { message: "Trop court" });
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("message_too_short");
  });

  it("[message_too_short] rejects a 29-char message (trimmed)", () => {
    const player = makePlayer();
    const msg29 = "12345678901234567890123456789"; // 29
    const input = makeInput(player, { message: msg29 });
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(false);
  });

  it("accepts a message with exactly 30 chars (trimmed)", () => {
    const player = makePlayer();
    const msg30 = "123456789012345678901234567890"; // 30
    expect(msg30.length).toBe(30);
    const input = makeInput(player, { message: msg30 });
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(true);
  });

  it("[minor_blocked_by_article_19] rejects a minor player", () => {
    const player = makePlayer({
      dateOfBirth: new Date("2012-01-01T00:00:00.000Z"), // ~14 ans
    });
    const input = makeInput(player);
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("minor_blocked_by_article_19");
  });

  it("[outreach_disabled] rejects when openToOutreach is false", () => {
    const player = makePlayer({ openToOutreach: false });
    const input = makeInput(player);
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("outreach_disabled");
  });

  it("[outreach_disabled] rejects when openToOutreach is undefined", () => {
    const player = makePlayer({ openToOutreach: undefined });
    const input = makeInput(player);
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("outreach_disabled");
  });

  it("[player_already_under_mandate] rejects when regime=already_represented", () => {
    const player = makePlayer({
      representation: {
        regime: "already_represented",
        externalAgent: {
          fullName: "Other Agent",
          fifaLicenseNumber: "OTHER-LIC",
          federation: "FIFA",
          mandateStart: new Date("2026-01-01T00:00:00.000Z"),
          mandateEnd: new Date("2028-01-01T00:00:00.000Z"),
        },
        decidedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    });
    const input = makeInput(player);
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("player_already_under_mandate");
  });

  it("[player_already_under_mandate] rejects when regime=integrated_agency", () => {
    const player = makePlayer({
      representation: {
        regime: "integrated_agency",
        agencyMandateSignature: "Signed",
        agencyMandateEnd: new Date("2028-01-01T00:00:00.000Z"),
        decidedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    });
    const input = makeInput(player);
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("player_already_under_mandate");
  });

  it("allows when regime=independent", () => {
    const player = makePlayer({
      representation: {
        regime: "independent",
        decidedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    });
    const input = makeInput(player);
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(true);
  });

  it("[duplicate_active_request] rejects a duplicate sent request for the same (agent, player)", () => {
    const player = makePlayer();
    const input = makeInput(player);
    const existing = makeRequest({
      agentId: input.request.agentId,
      playerId: input.request.playerId,
      status: "sent",
    });
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [existing] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("duplicate_active_request");
  });

  it("allows a new request when the previous one is rejected (history not blocking)", () => {
    const player = makePlayer();
    const input = makeInput(player);
    const existing = makeRequest({
      agentId: input.request.agentId,
      playerId: input.request.playerId,
      status: "rejected",
    });
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [existing] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(true);
  });

  it("[success] returns a RepresentationRequest with sentAt=now and status=sent", () => {
    const player = makePlayer();
    const input = makeInput(player);
    const result = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe(input.id);
      expect(result.value.status).toBe("sent");
      expect(result.value.sentAt.toISOString()).toBe(FIXED_NOW.toISOString());
      expect(result.value.createdAt.toISOString()).toBe(FIXED_NOW.toISOString());
      expect(result.value.updatedAt.toISOString()).toBe(FIXED_NOW.toISOString());
      expect(result.value.message).toBe(VALID_MESSAGE);
    }
  });

  it("[determinism] same inputs produce identical outputs", () => {
    const player = makePlayer();
    const input = makeInput(player);
    const a = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    const b = sendRepresentationRequest(
      input,
      { existingRequests: [] },
      FIXED_NOW,
    );
    expect(a).toEqual(b);
  });
});

describe("respondToRequest", () => {
  it("[request_already_resolved] rejects when status=accepted", () => {
    const request = makeRequest({ status: "accepted" });
    const result = respondToRequest(request, "accept", FIXED_NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("request_already_resolved");
  });

  it("[request_already_resolved] rejects when status=rejected", () => {
    const request = makeRequest({ status: "rejected" });
    const result = respondToRequest(request, "accept", FIXED_NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("request_already_resolved");
  });

  it("[request_already_resolved] rejects when status=expired", () => {
    const request = makeRequest({ status: "expired" });
    const result = respondToRequest(request, "reject", FIXED_NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("request_already_resolved");
  });

  it("[reject] updates status to rejected without newRepresentation", () => {
    const request = makeRequest({ status: "sent" });
    const result = respondToRequest(request, "reject", FIXED_NOW);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.updatedRequest.status).toBe("rejected");
      expect(result.value.updatedRequest.updatedAt.toISOString()).toBe(
        FIXED_NOW.toISOString(),
      );
      expect(result.value.newRepresentation).toBeUndefined();
    }
  });

  it("[accept] returns updated request + Representation with 2-year mandate", () => {
    const request = makeRequest({ status: "sent" });
    const result = respondToRequest(request, "accept", FIXED_NOW);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.updatedRequest.status).toBe("accepted");
      expect(result.value.newRepresentation).toBeDefined();
      const rep = result.value.newRepresentation;
      if (!rep) return;
      expect(rep.regime).toBe("already_represented");
      expect(rep.externalAgent?.fullName).toBe(request.agentName);
      expect(rep.externalAgent?.fifaLicenseNumber).toBe(
        request.agentFifaLicense,
      );
      expect(rep.externalAgent?.federation).toBe("FIFA");
      expect(rep.externalAgent?.mandateStart.toISOString()).toBe(
        FIXED_NOW.toISOString(),
      );
      const expectedMandateEnd = new Date(
        FIXED_NOW.getFullYear() + 2,
        FIXED_NOW.getMonth(),
        FIXED_NOW.getDate(),
        FIXED_NOW.getHours(),
        FIXED_NOW.getMinutes(),
        FIXED_NOW.getSeconds(),
        FIXED_NOW.getMilliseconds(),
      );
      expect(rep.externalAgent?.mandateEnd.toISOString()).toBe(
        expectedMandateEnd.toISOString(),
      );
      expect(rep.decidedAt.toISOString()).toBe(FIXED_NOW.toISOString());
    }
  });
});

describe("toggleOutreachAvailability", () => {
  it("turns undefined into true", () => {
    const player = makePlayer({ openToOutreach: undefined });
    const updated = toggleOutreachAvailability(player, true);
    expect(updated.openToOutreach).toBe(true);
  });

  it("turns true into false", () => {
    const player = makePlayer({ openToOutreach: true });
    const updated = toggleOutreachAvailability(player, false);
    expect(updated.openToOutreach).toBe(false);
  });

  it("does not mutate the original player", () => {
    const player = makePlayer({ openToOutreach: true });
    const updated = toggleOutreachAvailability(player, false);
    expect(player.openToOutreach).toBe(true);
    expect(updated).not.toBe(player);
  });
});

describe("isExpired", () => {
  it("returns true when sentAt is 31 days ago and ttl=30", () => {
    const sentAt = new Date(FIXED_NOW.getTime() - 31 * 24 * 60 * 60 * 1000);
    expect(isExpired(makeRequest({ sentAt }), FIXED_NOW, 30)).toBe(true);
  });

  it("returns false when sentAt is 29 days ago and ttl=30", () => {
    const sentAt = new Date(FIXED_NOW.getTime() - 29 * 24 * 60 * 60 * 1000);
    expect(isExpired(makeRequest({ sentAt }), FIXED_NOW, 30)).toBe(false);
  });

  it("uses default ttl=30 days when not provided", () => {
    const sentAt = new Date(FIXED_NOW.getTime() - 31 * 24 * 60 * 60 * 1000);
    expect(isExpired(makeRequest({ sentAt }), FIXED_NOW)).toBe(true);
  });
});
