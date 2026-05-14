// Types pour le domaine Representation (demandes de représentation
// agent FIFA -> joueur, agent FIFA enregistré).
//
// IMPORTÉ TEL QUEL :
//   - Structure DemandeRepresentation depuis lib/types.ts:215 du legacy.
//   - Structure AgentFIFA depuis lib/types.ts:125 du legacy.
//   - Statuts (envoyee/acceptee/refusee/expiree, en_attente_verification/verifie).
// IMPORTÉ PUIS CORRIGÉ :
//   - Champs renommés EN, statuts traduits, dates en Date au lieu de
//     string ISO.
//   - Brand types AgentId + RepresentationRequestId (cohérent PR #3).
// NOUVEAU :
//   - Constantes domaine (MIN_REQUEST_MESSAGE_LENGTH = 30,
//     MANDATE_DURATION_YEARS = 2, DEFAULT_REQUEST_TTL_DAYS = 30).
//     Les deux premières viennent du legacy ; la troisième est un
//     défaut sensé (legacy n'avait pas d'auto-expiration).

import type { Brand, PlayerId } from "@/domain/shared/id";
import type { Timestamps } from "@/domain/shared/timestamps";

export type AgentId = Brand<string, "AgentId">;
export type RepresentationRequestId = Brand<string, "RepresentationRequestId">;

// Statut administratif de l'agent FIFA après inscription.
// Legacy : "en_attente_verification" | "verifie".
export type AgentStatus = "pending_verification" | "verified";

// Agent FIFA enregistré sur la plateforme.
// Legacy : AgentFIFA dans lib/types.ts:125-139.
export interface FifaAgent extends Timestamps {
  id: AgentId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fifaLicenseNumber: string;
  federation: string;
  country: string;
  city: string;
  representedPlayerIds: readonly PlayerId[];
  status: AgentStatus;
  registeredAt: Date;
  bio?: string;
}

// Statut d'une demande de représentation agent -> joueur.
// Legacy : "envoyee" | "acceptee" | "refusee" | "expiree".
export type RepresentationRequestStatus =
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

// Demande de représentation envoyée par un agent à un joueur.
// Legacy : DemandeRepresentation dans lib/types.ts:215-224.
export interface RepresentationRequest extends Timestamps {
  id: RepresentationRequestId;
  agentId: AgentId;
  agentName: string;
  agentFifaLicense: string;
  playerId: PlayerId;
  message: string;
  sentAt: Date;
  status: RepresentationRequestStatus;
}

// Erreurs métier pour sendRepresentationRequest.
export type SendRequestError =
  | "message_too_short"
  | "minor_blocked_by_article_19"
  | "outreach_disabled"
  | "player_already_under_mandate"
  | "duplicate_active_request";

// Erreurs métier pour respondToRequest.
export type RespondError = "request_already_resolved";

// Action de réponse à une demande.
export type RespondAction = "accept" | "reject";

// Constantes domaine.
// Legacy app/agents/demarcher/page.tsx:148 : minimum 30 caractères.
export const MIN_REQUEST_MESSAGE_LENGTH = 30;

// Legacy app/moi/demandes-representation/page.tsx:72 : setFullYear(+2).
export const MANDATE_DURATION_YEARS = 2;

// Nouveau défaut (le legacy ne pratiquait pas d'auto-expiration).
export const DEFAULT_REQUEST_TTL_DAYS = 30;
