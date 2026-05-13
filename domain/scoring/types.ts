import type { PlayerId, ScoringId } from "@/domain/shared/id";
import type { Timestamps } from "@/domain/shared/timestamps";
import type { Level } from "./level";

// Legacy: CritereEvaluation { nom, note 1-10, commentaire }
export interface Criterion {
  name: string;
  note: number;
  comment: string;
}

// Legacy: Evaluation.{criteresTechniques,criteresPhysiques,criteresTactiques,criteresPotentiel}
// "mental" matches the iaScoring algorithm category (legacy types called it "potentiel").
export interface Evaluation {
  technical: Criterion[];
  physical: Criterion[];
  tactical: Criterion[];
  mental: Criterion[];
  strengths: string[];
  improvementAreas: string[];
  commentary: string;
}

// Legacy: Joueur.scoreVisibilite (0-100) + Joueur.evaluation, hoisted to a domain entity.
export interface Scoring extends Timestamps {
  id: ScoringId;
  playerId: PlayerId;
  value: number;
  level: Level;
  generatedAt: Date;
  generatedBy: string;
  evaluation: Evaluation;
}
