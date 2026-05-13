import type {
  InterestId,
  PlayerId,
  VisibilityId,
} from "@/domain/shared/id";
import type { Timestamps } from "@/domain/shared/timestamps";

// Legacy: Interet { id, scoutId/Nom/Org, joueurId, date, notePrivee }
export interface Interest {
  id: InterestId;
  playerId: PlayerId;
  scout: {
    id: string;
    name: string;
    organization: string;
  };
  markedAt: Date;
  privateNote?: string;
}

// Legacy: Joueur.vues + Joueur.interets (counters), hoisted to a domain entity.
export interface Visibility extends Timestamps {
  id: VisibilityId;
  playerId: PlayerId;
  viewCount: number;
  interestCount: number;
  lastViewedAt?: Date;
}
