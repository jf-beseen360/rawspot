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
import { playerRepository } from "@/lib/db/repositories/player.repository";
import { representationRepository } from "@/lib/db/repositories/representation.repository";
import { ok, type Result } from "@/lib/result";
import type { PlayerId } from "@/domain/shared/id";

// Server Action B — Envoi d'une demande de représentation.
// Orchestre : fetch Player + fetch existing requests + use case domaine +
// persiste si succès. Pas de logique métier ici.
export async function sendRepresentationRequest(
  agentId: string,
  agentName: string,
  agentFifaLicense: string,
  playerId: string,
  message: string,
): Promise<Result<RepresentationRequest, SendRequestError>> {
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
// Orchestre : fetch request + use case domaine + applyResponse transactionnel
// (update request + optionnel update player.representation atomique).
export async function respondToRepresentationRequest(
  requestId: string,
  response: "ACCEPTED" | "REJECTED",
): Promise<Result<RepresentationRequest, RespondError>> {
  const typedRequestId = requestId as RepresentationRequestId;

  const request = await representationRepository.findById(typedRequestId);
  if (!request) {
    throw new Error("request_not_found");
  }

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
