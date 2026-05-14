// Use cases métier du domaine Representation. Fonctions pures et
// déterministes via paramètre `now` injectable.
//
// IMPORTÉ TEL QUEL :
//   - Contrainte « 1 demande active par (agent, joueur) » depuis
//     lib/store.ts:284-287.
//   - Message minimum 30 caractères depuis app/agents/demarcher/page.tsx:148.
//   - Mandat 2 ans à l'acceptation depuis
//     app/moi/demandes-representation/page.tsx:71-79.
//   - Filtre Article 19 (mineurs strictement exclus) via
//     canBeApproachedByAgent.
//   - Player avec representation.regime "already_represented" ou
//     "integrated_agency" exclu (fidèle app/agents/demarcher/page.tsx:97-98).
// IMPORTÉ PUIS CORRIGÉ :
//   - Use cases purs : les listes / état existants sont passés en
//     paramètre ; le caller (futur use case + repository) persiste.
//   - respondToRequest retourne { updatedRequest, newRepresentation? }
//     au lieu d'effets de bord. La Representation est appliquée au
//     Player par le caller.
//   - Erreurs métier propagées via Result<T, E> (lib/result.ts).
// NOUVEAU :
//   - isExpired (read-time helper). Pas de transition automatique vers
//     "expired" — le legacy n'en faisait pas non plus.

import { canBeApproachedByAgent } from "@/domain/article19/eligibility";
import type {
  ExternalAgent,
  Player,
  Representation,
} from "@/domain/player/types";
import type { Result } from "@/lib/result";
import { err, ok } from "@/lib/result";
import {
  DEFAULT_REQUEST_TTL_DAYS,
  MANDATE_DURATION_YEARS,
  MIN_REQUEST_MESSAGE_LENGTH,
  type AgentId,
  type RepresentationRequest,
  type RepresentationRequestId,
  type RespondAction,
  type RespondError,
  type SendRequestError,
} from "./types";
import type { PlayerId } from "@/domain/shared/id";

// Données nécessaires pour créer une demande. L'id est injecté par le
// caller pour préserver la testabilité (déterminisme).
export interface SendRepresentationInput {
  id: RepresentationRequestId;
  request: {
    agentId: AgentId;
    agentName: string;
    agentFifaLicense: string;
    playerId: PlayerId;
    message: string;
  };
  player: Player;
}

// État existant nécessaire pour vérifier l'unicité de la demande.
export interface SendRepresentationContext {
  existingRequests: readonly RepresentationRequest[];
}

// Crée une demande de représentation après validation de tous les
// invariants métier. Pure : pas de side-effect, pas d'accès store.
export function sendRepresentationRequest(
  input: SendRepresentationInput,
  context: SendRepresentationContext,
  now: Date = new Date(),
): Result<RepresentationRequest, SendRequestError> {
  const trimmed = input.request.message.trim();
  if (trimmed.length < MIN_REQUEST_MESSAGE_LENGTH) {
    return err("message_too_short");
  }

  const article19 = canBeApproachedByAgent(input.player, now);
  if (!article19.allowed) {
    return err("minor_blocked_by_article_19");
  }

  if (input.player.openToOutreach !== true) {
    return err("outreach_disabled");
  }

  const regime = input.player.representation?.regime;
  if (regime === "already_represented" || regime === "integrated_agency") {
    return err("player_already_under_mandate");
  }

  // 1 seule demande active par (agentId, playerId) — fidèle store.ts.
  const duplicate = context.existingRequests.find(
    (r) =>
      r.agentId === input.request.agentId &&
      r.playerId === input.request.playerId &&
      r.status === "sent",
  );
  if (duplicate) {
    return err("duplicate_active_request");
  }

  const created: RepresentationRequest = {
    id: input.id,
    agentId: input.request.agentId,
    agentName: input.request.agentName,
    agentFifaLicense: input.request.agentFifaLicense,
    playerId: input.request.playerId,
    message: trimmed,
    sentAt: now,
    status: "sent",
    createdAt: now,
    updatedAt: now,
  };

  return ok(created);
}

// Résultat de respondToRequest. La Representation, si générée, doit être
// appliquée au Player par le caller (le domaine ne mute pas le Player).
export interface RespondResult {
  updatedRequest: RepresentationRequest;
  newRepresentation?: Representation;
}

// Répond à une demande. Si "accept", construit la Representation à
// attacher au Player (mandat MANDATE_DURATION_YEARS années). Si "reject",
// updatedRequest.status = "rejected" et pas de Representation.
export function respondToRequest(
  request: RepresentationRequest,
  action: RespondAction,
  now: Date = new Date(),
): Result<RespondResult, RespondError> {
  if (request.status !== "sent") {
    return err("request_already_resolved");
  }

  if (action === "reject") {
    return ok({
      updatedRequest: { ...request, status: "rejected", updatedAt: now },
    });
  }

  // action === "accept"
  const mandateEnd = new Date(
    now.getFullYear() + MANDATE_DURATION_YEARS,
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );

  const externalAgent: ExternalAgent = {
    fullName: request.agentName,
    fifaLicenseNumber: request.agentFifaLicense,
    federation: "FIFA",
    mandateStart: now,
    mandateEnd,
  };

  const newRepresentation: Representation = {
    regime: "already_represented",
    externalAgent,
    decidedAt: now,
  };

  return ok({
    updatedRequest: { ...request, status: "accepted", updatedAt: now },
    newRepresentation,
  });
}

// Met à jour la disponibilité au démarchage du joueur (toggle pur).
// Retourne un nouveau Player sans muter l'original.
export function toggleOutreachAvailability(
  player: Player,
  available: boolean,
): Player {
  return { ...player, openToOutreach: available };
}

// Read-time : une demande est-elle expirée ? Pas d'auto-transition vers
// "expired" — la demande conserve son statut, c'est à l'appelant de
// décider ce qu'il en fait à la lecture.
export function isExpired(
  request: RepresentationRequest,
  now: Date = new Date(),
  ttlDays: number = DEFAULT_REQUEST_TTL_DAYS,
): boolean {
  const elapsedMs = now.getTime() - request.sentAt.getTime();
  const ttlMs = ttlDays * 24 * 60 * 60 * 1000;
  return elapsedMs > ttlMs;
}
