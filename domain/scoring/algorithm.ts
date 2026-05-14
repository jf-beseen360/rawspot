// Portage de lib/iaScoring.ts du legacy core (BeSeen360-MVP-demo).
// Scoring IA déterministe et transparent.
// Principes :
//   1. Aucun jugement subjectif. Chaque note 1-10 vient d'une règle claire.
//   2. Le score reflète : adéquation physique au poste + complétude du dossier
//      vidéo + comparaison cohorte d'âge. Le recruteur garde le dernier mot.
//   3. Algorithme totalement explicable : chaque score a son rationale.
//
// IMPORTÉ TEL QUEL : pondérations, formules, hash de calibration, profils
//   physiques de référence, libellés FR des rationales et commentaires.
// IMPORTÉ PUIS CORRIGÉ :
//   - Signature : computeScoring(player, medias, now?) au lieu de
//     genererEvaluationIA(joueur) (l'God-object Joueur est éclaté en Player +
//     Media[] côté DDD).
//   - Postes remappés vers Position (gardien -> goalkeeper, etc.).
//   - Pied "ambidextre" -> "both" ; situation club remappée vers ClubSituation.
//   - Sortie alignée sur Evaluation DDD (technical/physical/tactical/mental +
//     strengths/improvementAreas/commentary), pas sur le shape legacy.
//   - now injectable pour testabilité (déterminisme).

import type { Media } from "@/domain/media/types";
import type { Player } from "@/domain/player/types";
import type {
  ClubSituation,
  Position,
} from "@/domain/shared/position";
import type { CriterionCategory } from "./grids";
import { GRIDS_BY_POSITION } from "./grids";
import type { Criterion, Evaluation } from "./types";

export interface ScoringResult {
  value: number;
  evaluation: Evaluation;
  generatedAt: Date;
  generatedBy: string;
}

interface PhysicalReference {
  heightMin: number;
  heightIdeal: number;
  heightMax: number;
  weightIdeal: number;
  ageOptimal: readonly [number, number];
}

// Profils physiques de référence par poste — médianes des données mondiales
// pro 16-22 ans, conservés tels quels depuis le legacy.
const REFERENCES: Record<Position, PhysicalReference> = {
  goalkeeper: {
    heightMin: 180,
    heightIdeal: 190,
    heightMax: 200,
    weightIdeal: 82,
    ageOptimal: [18, 22],
  },
  centre_back: {
    heightMin: 182,
    heightIdeal: 188,
    heightMax: 198,
    weightIdeal: 80,
    ageOptimal: [17, 22],
  },
  full_back: {
    heightMin: 168,
    heightIdeal: 178,
    heightMax: 188,
    weightIdeal: 72,
    ageOptimal: [16, 21],
  },
  defensive_midfielder: {
    heightMin: 175,
    heightIdeal: 183,
    heightMax: 192,
    weightIdeal: 76,
    ageOptimal: [17, 22],
  },
  central_midfielder: {
    heightMin: 170,
    heightIdeal: 178,
    heightMax: 188,
    weightIdeal: 72,
    ageOptimal: [16, 21],
  },
  attacking_midfielder: {
    heightMin: 168,
    heightIdeal: 175,
    heightMax: 185,
    weightIdeal: 68,
    ageOptimal: [16, 22],
  },
  winger: {
    heightMin: 165,
    heightIdeal: 175,
    heightMax: 183,
    weightIdeal: 68,
    ageOptimal: [16, 21],
  },
  striker: {
    heightMin: 172,
    heightIdeal: 182,
    heightMax: 195,
    weightIdeal: 75,
    ageOptimal: [16, 21],
  },
};

// Scores 0-1 par situation club — remappage du legacy preservant les valeurs.
const CLUB_SITUATION_SCORES: Record<ClubSituation, number> = {
  training_centre: 1,
  academy: 0.95,
  amateur_club: 0.8,
  no_club: 0.65,
};

interface ProfileMetrics {
  age: number;
  bmi: number;
  heightScore: number;
  ageScore: number;
  clubSituationScore: number;
  videosScore: number;
  ambidextrousBonus: number;
  calibrationScore: number;
}

function computeAge(dateOfBirth: Date, now: Date): number {
  let age = now.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = now.getMonth() - dateOfBirth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }
  return age;
}

// Hash déterministe simple — porté tel quel. Reproduit la même séquence de
// caractères que le legacy : id + prenom + nom + dateNaissance(yyyy-mm-dd).
function hashPlayer(player: Player): number {
  const dateIso = player.dateOfBirth.toISOString().slice(0, 10);
  const s =
    String(player.id) + player.firstName + player.lastName + dateIso;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function computeMetrics(
  player: Player,
  medias: readonly Media[],
  now: Date,
): ProfileMetrics {
  const age = computeAge(player.dateOfBirth, now);
  const bmi = player.weightKg / Math.pow(player.heightCm / 100, 2);
  const ref = REFERENCES[player.primaryPosition];

  // Score taille : 1 si dans [ideal-3, ideal+3], décroît par paliers.
  const heightDelta = Math.abs(player.heightCm - ref.heightIdeal);
  const heightScore =
    heightDelta <= 3
      ? 1
      : heightDelta <= 8
        ? 0.85
        : heightDelta <= 14
          ? 0.7
          : 0.55;

  // Score âge : pic dans [ageOptimal], décroît linéairement.
  const [ageMin, ageMax] = ref.ageOptimal;
  const ageScore =
    age >= ageMin && age <= ageMax
      ? 1
      : age < ageMin
        ? Math.max(0.5, 1 - (ageMin - age) * 0.1)
        : Math.max(0.4, 1 - (age - ageMax) * 0.08);

  const clubSituationScore = CLUB_SITUATION_SCORES[player.clubSituation];

  // Complétude vidéos — porte la logique legacy (match + technique).
  const relevantMedias = medias.filter(
    (m) => m.kind === "match_video" || m.kind === "tech_video",
  );
  const nbVideos = relevantMedias.length;
  const totalDuration = relevantMedias.reduce(
    (acc, m) => acc + (m.durationSec ?? 0),
    0,
  );
  const hasMatch = relevantMedias.some((m) => m.kind === "match_video");
  const hasTech = relevantMedias.some((m) => m.kind === "tech_video");

  let videosScore = 0;
  if (nbVideos >= 1) videosScore = 0.55;
  if (nbVideos >= 2) videosScore = 0.7;
  if (nbVideos >= 3) videosScore = 0.85;
  if (nbVideos >= 4) videosScore = 1;
  if (totalDuration < 60) videosScore *= 0.6;
  if (hasMatch && hasTech) videosScore *= 1;
  else if (hasMatch || hasTech) videosScore *= 0.85;

  const ambidextrousBonus = player.dominantFoot === "both" ? 1.05 : 1;

  // Calibration : variation déterministe ±15 % pour personnaliser.
  const h = hashPlayer(player);
  const calibrationScore = 0.85 + ((h % 1000) / 1000) * 0.3;

  return {
    age,
    bmi,
    heightScore,
    ageScore,
    clubSituationScore,
    videosScore,
    ambidextrousBonus,
    calibrationScore,
  };
}

// Pondère chaque critère selon sa catégorie. Conservation littérale des
// pondérations legacy (toute modification casse le snapshot test).
function noteCriterion(
  criterionKey: string,
  category: CriterionCategory,
  m: ProfileMetrics,
): number {
  let base = 5;
  switch (category) {
    case "physical":
      base = 4 + m.heightScore * 3 + m.ageScore * 2;
      break;
    case "technical":
      base =
        4 +
        m.clubSituationScore * 2.5 +
        m.videosScore * 2 +
        (m.ambidextrousBonus - 1) * 5;
      break;
    case "tactical":
      base =
        4 + m.clubSituationScore * 3 + m.ageScore * 1.5 + m.videosScore * 1;
      break;
    case "mental":
      base = 5 + m.clubSituationScore * 2 + m.videosScore * 1.5;
      break;
  }
  // Variation déterministe par critère (évite notes identiques).
  const variation =
    ((criterionKey.charCodeAt(0) + criterionKey.length) % 10) / 10 - 0.5;
  base += variation * m.calibrationScore;
  return Math.max(1, Math.min(10, Math.round(base * 2) / 2));
}

function rationaleCriterion(
  category: CriterionCategory,
  note: number,
  m: ProfileMetrics,
  player: Player,
): string {
  const ageStr = `${m.age} ans`;
  const heightStr = `${player.heightCm} cm`;
  if (note >= 8) {
    if (category === "physical") {
      return `Profil physique au-dessus (${heightStr}, ${ageStr}) — adéquation marquée au poste.`;
    }
    if (category === "technical") {
      return "Dossier vidéo complet et contexte de formation favorable.";
    }
    if (category === "tactical") {
      return "Maturité tactique attendue à l'âge et dans le contexte.";
    }
    return "Indicateurs convergents au-dessus de la moyenne cohorte.";
  }
  if (note >= 6) {
    if (category === "physical") {
      return `Profil correct (${heightStr}, ${ageStr}) pour ce poste.`;
    }
    if (category === "technical") {
      return "Dossier vidéo et formation cohérents avec le niveau attendu.";
    }
    return "Indicateurs dans la moyenne pour cette tranche d'âge.";
  }
  if (category === "physical") {
    return "Profil à confirmer (taille ou âge un peu en deçà de l'optimal pour ce poste).";
  }
  if (category === "technical") {
    return "Compléter le dossier vidéo (idéalement 3+ vidéos dont match) renforcerait cette note.";
  }
  return "Note susceptible d'évoluer avec plus de matériel d'analyse.";
}

function pickTop(criteria: readonly Criterion[], n: number): Criterion[] {
  return [...criteria].sort((a, b) => b.note - a.note).slice(0, n);
}

function pickBottom(criteria: readonly Criterion[], n: number): Criterion[] {
  return [...criteria].sort((a, b) => a.note - b.note).slice(0, n);
}

function buildCommentary(
  player: Player,
  m: ProfileMetrics,
  score: number,
  top: readonly string[],
  bottom: readonly string[],
): string {
  const levelText =
    score >= 80
      ? "très haut"
      : score >= 65
        ? "élevé"
        : score >= 50
          ? "intermédiaire"
          : "à consolider";
  const ageContext =
    m.age <= 17
      ? "jeune profil avec marge de progression"
      : m.age <= 19
        ? "profil dans la fenêtre de transition pré-pro"
        : "profil mature";
  const phrases = [
    `Profil ${ageContext} (${m.age} ans, ${player.heightCm} cm, ${player.weightKg} kg).`,
    `Score IA de ${score}/100 — niveau ${levelText}.`,
    `Atouts identifiés : ${top.slice(0, 2).join(", ").toLowerCase()}.`,
    bottom.length > 0
      ? `Points à renforcer : ${bottom.join(", ").toLowerCase()}.`
      : "",
    "Score généré sans intervention humaine. Le recruteur reste seul juge en visionnant les vidéos brutes.",
  ];
  return phrases.filter(Boolean).join(" ");
}

export function computeScoring(
  player: Player,
  medias: readonly Media[],
  now: Date = new Date(),
): ScoringResult {
  const m = computeMetrics(player, medias, now);
  const grid = GRIDS_BY_POSITION[player.primaryPosition];

  const criteria: Criterion[] = grid.map((c) => {
    const note = noteCriterion(c.key, c.category, m);
    return {
      name: c.label,
      note,
      comment: rationaleCriterion(c.category, note, m, player),
    };
  });

  const byCategory = (cat: CriterionCategory): Criterion[] =>
    grid
      .map((c, i) => ({ c, e: criteria[i] }))
      .filter(({ c }) => c.category === cat)
      .map(({ e }) => e);

  const technical = byCategory("technical");
  const physical = byCategory("physical");
  const tactical = byCategory("tactical");
  const mental = byCategory("mental");

  // Score 0-100 : moyenne pondérée des 8 critères × 10.
  const weightedSum = grid.reduce(
    (acc, c, i) => acc + criteria[i].note * c.weight,
    0,
  );
  const totalWeight = grid.reduce((acc, c) => acc + c.weight, 0);
  const value = Math.round((weightedSum / totalWeight) * 10);

  const top = pickTop(criteria, 3).map((c) => c.name);
  const bottom = pickBottom(criteria, 2).map((c) => c.name);

  const commentary = buildCommentary(player, m, value, top, bottom);

  const evaluation: Evaluation = {
    technical,
    physical,
    tactical,
    mental,
    strengths: top,
    improvementAreas: bottom,
    commentary,
  };

  return {
    value,
    evaluation,
    generatedAt: now,
    generatedBy: "ia-v1",
  };
}

export const SCORING_DESCRIPTION = {
  title: "Score RawSpot° IA",
  intro: "Algorithme déterministe et transparent. Aucun jugement humain.",
  factors: [
    "Adéquation physique au poste (taille, poids, IMC vs référence pro 16-22 ans)",
    "Position dans la fenêtre d'âge optimale du poste",
    "Qualité du contexte de formation (centre, académie, club, sans club)",
    "Complétude du dossier vidéo (nombre, durée, mix match + technique)",
    "Polyvalence (pied ambidextre, poste secondaire)",
  ],
  guarantee:
    "Le scoring est régénéré à chaque modification du profil. Aucun analyste humain n'intervient. Le recruteur garde la décision finale.",
} as const;
