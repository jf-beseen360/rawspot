"use server";

import { randomUUID } from "node:crypto";
import {
  type RepresentationRequest,
  type RepresentationRequestId,
  type RespondError,
  type SendRequestError,
  sendRepresentationRequest as sendRepresentationRequestUseCase,
  respondToRequest as respondToRequestUseCase,
} from "@/domain/representation";
import type { AgentId } from "@/domain/representation/types";
import {
  requirePlayerOwnership,
  requireRole,
} from "@/lib/auth/server";
import { playerRepository } from "@/lib/db/repositories/player.repository";
import { representationRepository } from "@/lib/db/repositories/representation.repository";
import { ok, type Result } from "@/lib/result";
import type { PlayerId } from "@/domain/shared/id";

// Server Action B — Envoi d'une demande de représentation.
// Auth (PR #11a) : requireRole("agent") — seul un utilisateur ayant le rôle
// "agent" (ou "admin") peut envoyer une demande. Le binding agentId ↔
// session.user.id sera ajouté en PR #17 quand la table fifa_agents existera.
export async function sendRepresentationRequest(
  agentId: string,
  agentName: string,
  agentFifaLicense: string,
  playerId: string,
  message: string,
): Promise<Result<RepresentationRequest, SendRequestError>> {
  await requireRole("agent");

  const typedPlayerId = playerId as PlayerId;
  const typedAgentId = agentId as AgentId;

  const player = await playerRepository.findById(typedPlayerId);
  if (!player) {
    throw new Error("player_not_found");
  }

  const existingRequests =
    await representationRepository.listByAgentAndPlayer(
      typedAgentId,
      typedPlayerId,
    );

  const result = sendRepresentationRequestUseCase(
    {
      id: randomUUID() as RepresentationRequestId,
      request: {
        agentId: typedAgentId,
        agentName,
        agentFifaLicense,
        playerId: typedPlayerId,
        message,
      },
      player,
    },
    { existingRequests },
  );

  if (result.ok) {
    await representationRepository.save(result.value);
  }

  return result;
}

// Server Action C — Réponse à une demande de représentation.
// Auth (PR #11a) : requirePlayerOwnership(request.playerId) — seul le joueur
// destinataire (ou admin) peut accepter/refuser sa propre demande.
// Throw AuthError "unauthorized" | "forbidden" | "not_found" sinon.
export async function respondToRepresentationRequest(
  requestId: string,
  response: "ACCEPTED" | "REJECTED",
): Promise<Result<RepresentationRequest, RespondError>> {
  const typedRequestId = requestId as RepresentationRequestId;

  const request = await representationRepository.findById(typedRequestId);
  if (!request) {
    throw new Error("request_not_found");
  }

  await requirePlayerOwnership(request.playerId);

  const action = response === "ACCEPTED" ? "accept" : "reject";
  const result = respondToRequestUseCase(request, action);

  if (!result.ok) {
    return result;
  }

  await representationRepository.applyResponse(
    result.value.updatedRequest,
    result.value.newRepresentation ?? null,
  );

  return ok(result.value.updatedRequest);
}
