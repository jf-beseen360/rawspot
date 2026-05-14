// Portage de lib/analysePropreitaire.ts du legacy core (BeSeen360-MVP-demo).
// Chaîne d'analyse propriétaire RawSpot°.
// Séquence stricte : Score IA -> Classement hiérarchique -> Marge de progression
// -> Style de jeu -> Valeur marchande (avec indemnité formation + solidarité FIFA).
//
// Algorithmes déterministes et explicables. Les chiffres sont des avis
// informatifs, pas des vérités contractuelles.
//
// IMPORTÉ TEL QUEL : coefficients valeur marchande, indemnité formation
//   (RSTP art. 20), mécanisme de solidarité (RSTP art. 21), seuils de
//   progression par âge, libellés FR de niveau attendu.
// IMPORTÉ PUIS CORRIGÉ :
//   - Signatures : (player, scoreValue) au lieu de (joueur) qui portait le
//     scoreVisibilite. Le score est désormais externe (Scoring séparé en DDD).
//   - Postes remappés vers Position, pied vers DominantFoot, country direct.
//   - Types FR -> EN (Classement -> Ranking, ProjectionAge -> AgeProjection, etc.).

import type { Player } from "@/domain/player/types";
import type { Position } from "@/domain/shared/position";
import { allCountries, findZone } from "./geographic-zones";
import { STARS, type StarReference } from "./stars-reference";

// ============ CLASSEMENT HIÉRARCHIQUE ============

export interface Ranking {
  rank: number;
  total: number;
  percentile: number; // 1-100, plus haut = mieux
  label: string;
}

export interface HierarchicalRanking {
  country: Ranking;
  zone: Ranking;
  continent: Ranking;
  world: Ranking;
}

const POSITION_LABEL_FR: Record<Position, string> = {
  goalkeeper: "gardien",
  centre_back: "défenseur central",
  full_back: "latéral",
  defensive_midfielder: "sentinelle",
  central_midfielder: "relayeur",
  attacking_midfielder: "meneur de jeu",
  winger: "ailier",
  striker: "attaquant",
};

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

function ageCategory(age: number): string {
  if (age <= 16) return "U16";
  if (age <= 17) return "U17";
  if (age <= 18) return "U18";
  if (age <= 19) return "U19";
  if (age <= 21) return "U21";
  return "Senior";
}

// Estime la taille de cohorte selon densité zone × âge — conservé tel quel.
function estimateCohort(relativeCohort: number, age: number): number {
  return Math.round(
    relativeCohort * relativeCohort * 50 * (age <= 21 ? 1 : 0.6),
  );
}

export function computeHierarchicalRanking(
  player: Player,
  scoreValue: number,
  now: Date = new Date(),
): HierarchicalRanking {
  const age = computeAge(player.dateOfBirth, now);
  const cat = ageCategory(age);
  const positionLabel = POSITION_LABEL_FR[player.primaryPosition];
  const z = findZone(player.country);

  const computeRank = (
    relativeCohort: number,
    percentileModifier: number,
  ): Ranking => {
    const total = estimateCohort(relativeCohort, age);
    const effectivePercentile = Math.max(
      1,
      Math.min(99, scoreValue * (1 + percentileModifier / 100)),
    );
    const rank = Math.max(
      1,
      Math.round(total * (1 - effectivePercentile / 100)),
    );
    return {
      rank,
      total,
      percentile: Math.round(effectivePercentile),
      label: `${rank}ᵉ ${positionLabel} ${cat}`,
    };
  };

  const country = computeRank(z.relativeCohort, 0);
  country.label = `${country.rank}ᵉ ${positionLabel} ${cat} du ${player.country}`;

  const zone = computeRank(z.relativeCohort * 4, -8);
  zone.label = `${zone.rank}ᵉ ${positionLabel} ${cat} de ${z.zone}`;

  const continent = computeRank(z.relativeCohort * 12, -18);
  continent.label = `${continent.rank}ᵉ ${positionLabel} ${cat} d'${z.continent}`;

  const worldCohortBase = allCountries().reduce(
    (sum, c) => sum + c.relativeCohort,
    0,
  );
  const world = computeRank(worldCohortBase, -28);
  world.label = `${world.rank}ᵉ ${positionLabel} ${cat} mondial`;

  return { country, zone, continent, world };
}

// ============ MARGE DE PROGRESSION ============

export interface AgeProjection {
  years: number;
  projectedAge: number;
  projectedScore: number;
  expectedLevel: string;
}

const CLUB_SITUATION_BONUS: Record<Player["clubSituation"], number> = {
  training_centre: 1.3,
  academy: 1.2,
  amateur_club: 1.0,
  no_club: 0.8,
};

function levelDescriptionForScore(s: number): string {
  if (s >= 88) return "Élite mondiale (top championnats européens)";
  if (s >= 80)
    return "Premier plan européen (Ligue 1, Bundesliga, Liga, Premier League)";
  if (s >= 72)
    return "Deuxième division européenne (Championship, Ligue 2, Bundesliga 2)";
  if (s >= 64)
    return "Troisième division ou D1 en développement (National 1 FR, MLS, BeNe)";
  if (s >= 55)
    return "Semi-pro européen ou D1 nord-africain (Botola, Ligue 1 sénégalaise)";
  if (s >= 45) return "Championnat national amateur de bon niveau";
  return "Niveau régional / local";
}

export function computeProjections(
  player: Player,
  scoreValue: number,
  now: Date = new Date(),
): AgeProjection[] {
  const age = computeAge(player.dateOfBirth, now);

  // Coefficient de progression : maximum entre 16-19 ans, décroît ensuite.
  const progressionCoefficient = (
    currentAge: number,
    targetAge: number,
  ): number => {
    let total = 0;
    for (let a = currentAge + 1; a <= targetAge; a++) {
      if (a <= 18) total += 4;
      else if (a <= 21) total += 2.5;
      else if (a <= 25) total += 1;
      else total += 0.3;
    }
    return total;
  };

  const formationBonus = CLUB_SITUATION_BONUS[player.clubSituation];

  const project = (years: number): AgeProjection => {
    const projectedAge = age + years;
    const gain = progressionCoefficient(age, projectedAge) * formationBonus;
    const projectedScore = Math.min(98, Math.round(scoreValue + gain));
    return {
      years,
      projectedAge,
      projectedScore,
      expectedLevel: levelDescriptionForScore(projectedScore),
    };
  };

  return [project(2), project(3), project(5)];
}

// ============ STYLE DE JEU - rapprochement star ============

export interface PlayStyle {
  star: StarReference;
  reason: string;
}

export function findClosestStyle(
  player: Player,
  now: Date = new Date(),
): PlayStyle {
  const candidates = STARS.filter((s) => s.position === player.primaryPosition);
  if (candidates.length === 0) {
    return {
      star: STARS[0],
      reason:
        "Aucune star de référence pour ce poste, comparaison non disponible.",
    };
  }

  const age = computeAge(player.dateOfBirth, now);
  const z = findZone(player.country);
  const bmi = player.weightKg / Math.pow(player.heightCm / 100, 2);
  const idStr = String(player.id);
  const idNoise = idStr.length > 0 ? idStr.charCodeAt(idStr.length - 1) % 5 : 0;

  const scored = candidates.map((s) => {
    let score = 0;
    if (s.dominantFoot === player.dominantFoot) score += 10;
    if (s.dominantFoot === "both" || player.dominantFoot === "both") score += 3;
    if (z.continent === "Afrique" && s.keywords.includes("afrique")) score += 8;
    if (
      z.continent === "Amériques" &&
      s.keywords.includes("amérique du sud")
    ) {
      score += 5;
    }
    if (age <= 19 && s.keywords.includes("jeune")) score += 5;
    if (player.heightCm >= 185 && s.keywords.includes("grand")) score += 4;
    if (player.heightCm < 175 && s.keywords.includes("petit")) score += 4;
    if (bmi > 23 && s.keywords.includes("puissance")) score += 4;
    score += idNoise;
    return { star: s, score };
  });
  scored.sort((a, b) => b.score - a.score);

  const chosen = scored[0].star;
  const reasons: string[] = [];
  if (chosen.dominantFoot === player.dominantFoot) {
    reasons.push(`pied ${player.dominantFoot} dominant`);
  }
  if (player.heightCm >= 185 && chosen.keywords.includes("grand")) {
    reasons.push("gabarit imposant");
  }
  if (player.heightCm < 175 && chosen.keywords.includes("petit")) {
    reasons.push("petite taille technique");
  }
  if (z.continent === "Afrique" && chosen.keywords.includes("afrique")) {
    reasons.push("école africaine");
  }
  if (reasons.length === 0) reasons.push("profil de poste similaire");

  return {
    star: chosen,
    reason: `${chosen.description} Rapprochement basé sur : ${reasons.join(", ")}.`,
  };
}

// ============ VALEUR MARCHANDE ESTIMÉE ============

export interface MarketValue {
  rangeMin: number;
  rangeMax: number;
  trainingCompensation: number; // EUR — RSTP art. 20
  solidarityMechanism: number; // EUR — RSTP art. 21 (5 %)
  netMin: number;
  netMax: number;
  calculationDetails: readonly string[];
}

const COEFFICIENT_BY_POSITION: Record<Position, number> = {
  goalkeeper: 0.7,
  centre_back: 0.85,
  full_back: 0.95,
  defensive_midfielder: 0.85,
  central_midfielder: 0.95,
  attacking_midfielder: 1.1,
  winger: 1.15,
  striker: 1.2,
};

export function estimateMarketValue(
  player: Player,
  scoreValue: number,
  now: Date = new Date(),
): MarketValue {
  const age = computeAge(player.dateOfBirth, now);

  // Base : score² × 30 — entre 12 k€ et 300 k€ pour scores 60-100.
  const base = Math.pow(scoreValue, 2) * 30;

  // Coefficient âge : pic à 17-19 ans.
  let ageCoeff = 1.0;
  if (age >= 16 && age <= 19) ageCoeff = 1.4;
  else if (age >= 20 && age <= 22) ageCoeff = 1.2;
  else if (age >= 23 && age <= 25) ageCoeff = 1.0;
  else if (age <= 15) ageCoeff = 0.7;
  else ageCoeff = 0.7;

  const positionCoeff = COEFFICIENT_BY_POSITION[player.primaryPosition];

  const grossValue =
    Math.round((base * ageCoeff * positionCoeff) / 1000) * 1000;
  const rangeMin = Math.round(grossValue * 0.7);
  const rangeMax = Math.round(grossValue * 1.4);

  // Indemnité de formation (estimée) : ~10 k€/an entre 12 et 21 ans.
  const formationYears = Math.min(9, Math.max(0, age - 12));
  const trainingCompensation = formationYears * 10000;

  // Mécanisme de solidarité : 5 % du transfert.
  const solidarityMechanism = Math.round(
    ((rangeMin + rangeMax) / 2) * 0.05,
  );

  const netMin = Math.max(
    0,
    rangeMin - trainingCompensation - solidarityMechanism,
  );
  const netMax = Math.max(
    0,
    rangeMax - trainingCompensation - solidarityMechanism,
  );

  return {
    rangeMin,
    rangeMax,
    trainingCompensation,
    solidarityMechanism,
    netMin,
    netMax,
    calculationDetails: [
      `Score IA × coefficient âge (${ageCoeff}) × coefficient poste (${positionCoeff})`,
      `Indemnité de formation (RSTP art. 20) : ${formationYears} années estimées × 10 000 €`,
      `Mécanisme de solidarité (RSTP art. 21) : 5 % de la valeur de transfert réservés aux clubs formateurs`,
    ],
  };
}

export function formatEur(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M€`;
  if (n >= 1_000) return `${Math.round(n / 1_000)} k€`;
  return `${n} €`;
}
