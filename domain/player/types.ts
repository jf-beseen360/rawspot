import type { PlayerId } from "@/domain/shared/id";
import type {
  ClubSituation,
  DominantFoot,
  Position,
} from "@/domain/shared/position";
import type { Timestamps } from "@/domain/shared/timestamps";

// Legacy: Joueur.statut (brouillon/videos_en_cours/en_evaluation/publie)
export type PlayerStatus =
  | "draft"
  | "videos_in_progress"
  | "in_review"
  | "published";

// Legacy: TitulaireCompte.lien (pere/mere/tuteur/frere/soeur/oncle/tante/autre)
export type AccountHolderRelationship =
  | "father"
  | "mother"
  | "guardian"
  | "brother"
  | "sister"
  | "uncle"
  | "aunt"
  | "other";

// Legacy: contactUrgence{Nom,Prenom,Tel,Lien}
export interface EmergencyContact {
  firstName: string;
  lastName: string;
  phone: string;
  relationship: AccountHolderRelationship;
}

// Legacy: TitulaireCompte (account holder for a minor)
export interface AccountHolder {
  firstName: string;
  lastName: string;
  relationship: AccountHolderRelationship;
  phone: string;
  email?: string;
  validatedAt: Date;
}

// Legacy: RegimeRepresentation
export type RepresentationRegime =
  | "already_represented"
  | "integrated_agency"
  | "independent";

// Legacy: AgentExterne (FIFA agent under "voie 1")
export interface ExternalAgent {
  fullName: string;
  fifaLicenseNumber: string;
  federation: string;
  mandateStart: Date;
  mandateEnd: Date;
}

// Legacy: Representation
export interface Representation {
  regime: RepresentationRegime;
  externalAgent?: ExternalAgent;
  agencyMandateSignature?: string;
  agencyMandateEnd?: Date;
  decidedAt: Date;
}

// Legacy: Joueur (identity + athletic + status + preferences only).
// Content (videos, highlights, photo) → domain/media.
// Score & evaluation → domain/scoring.
// View / interest counters → domain/visibility.
export interface Player extends Timestamps {
  id: PlayerId;

  phone: string;
  firstName: string;
  lastName: string;
  stageName?: string;
  dateOfBirth: Date;
  nationality: string;
  city: string;
  country: string;

  clubSituation: ClubSituation;
  currentClub?: string;
  primaryPosition: Position;
  secondaryPosition?: Position;
  dominantFoot: DominantFoot;
  heightCm: number;
  weightKg: number;

  parentalConsent: boolean;
  emergencyContact?: EmergencyContact;
  accountHolder?: AccountHolder;

  avatarInitials: string;
  avatarColor: string;

  status: PlayerStatus;
  registeredAt: Date;
  publishedAt?: Date;

  motivation: string;
  openToOutreach?: boolean;
  representation?: Representation;
}
