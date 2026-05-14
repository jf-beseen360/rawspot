// Portage de lib/grillesEvaluation.ts du legacy core (BeSeen360-MVP-demo).
// 8 critères par poste × 8 postes = 64 critères calibrés pour le football moderne.
// Chaque critère a un poids (1 standard, 2 critère clef pour le poste).
// Source : grille de scouting standardisée par les académies pro européennes.
//
// IMPORTÉ TEL QUEL : libellés FR, poids, catégories, descriptions, clés snake_case.
//   Les clés (reflexes, detente, tackle, ...) sont délibérément conservées en FR :
//   l'algo dans algorithm.ts utilise critereCle.charCodeAt(0) pour produire
//   une variation déterministe par critère — anglifier les clés casserait le
//   snapshot de non-régression.
// IMPORTÉ PUIS CORRIGÉ :
//   - Types renommés (CritereDefini -> CriterionDefinition).
//   - GRILLES_PAR_POSTE -> GRIDS_BY_POSITION, indexé par Position au lieu de Poste.
//   - Champs renommés (cle/libelle/poids/categorie -> key/label/weight/category).

import type { Position } from "@/domain/shared/position";

export type CriterionCategory =
  | "technical"
  | "physical"
  | "tactical"
  | "mental";

export interface CriterionDefinition {
  key: string;
  label: string;
  weight: number;
  category: CriterionCategory;
  description: string;
}

export const GRIDS_BY_POSITION: Record<Position, readonly CriterionDefinition[]> = {
  goalkeeper: [
    {
      key: "reflexes",
      label: "Réflexes",
      weight: 2,
      category: "technical",
      description: "Vitesse de réaction sur frappes proches et déviations.",
    },
    {
      key: "detente",
      label: "Détente",
      weight: 2,
      category: "physical",
      description: "Amplitude des plongeons latéraux.",
    },
    {
      key: "sortie_aerienne",
      label: "Sortie aérienne",
      weight: 1,
      category: "technical",
      description:
        "Domination de la surface sur centres et coups de pied arrêtés.",
    },
    {
      key: "relance_courte",
      label: "Jeu au pied (court)",
      weight: 1,
      category: "technical",
      description: "Précision et choix sur premières relances.",
    },
    {
      key: "relance_longue",
      label: "Jeu au pied (long)",
      weight: 1,
      category: "technical",
      description: "Capacité à transpercer les lignes.",
    },
    {
      key: "placement",
      label: "Lecture et placement",
      weight: 2,
      category: "tactical",
      description: "Position au moment de la frappe, fermeture de l'angle.",
    },
    {
      key: "communication",
      label: "Communication ligne",
      weight: 1,
      category: "tactical",
      description: "Direction de la ligne défensive sur phases arrêtées.",
    },
    {
      key: "mental",
      label: "Mental compétition",
      weight: 1,
      category: "mental",
      description: "Calme sur les moments chauds, résilience après erreur.",
    },
  ],
  centre_back: [
    {
      key: "duel_aerien",
      label: "Duel aérien",
      weight: 2,
      category: "physical",
      description:
        "Ratio de victoires dans les airs sur centres et touches longues.",
    },
    {
      key: "tackle",
      label: "Tackle au sol",
      weight: 2,
      category: "technical",
      description: "Propreté et timing du tackle.",
    },
    {
      key: "anticipation",
      label: "Anticipation",
      weight: 2,
      category: "tactical",
      description: "Lecture des lignes de passe et interceptions.",
    },
    {
      key: "lecture_traj",
      label: "Lecture des trajectoires",
      weight: 1,
      category: "tactical",
      description: "Choix de l'intervention sur ballon long.",
    },
    {
      key: "relance_courte",
      label: "Relance courte",
      weight: 1,
      category: "technical",
      description: "Sécurité dans la relance, premier choix.",
    },
    {
      key: "relance_longue",
      label: "Relance longue",
      weight: 1,
      category: "technical",
      description: "Capacité à casser les lignes par le long.",
    },
    {
      key: "force",
      label: "Force physique",
      weight: 1,
      category: "physical",
      description: "Tenue de duel dos au but adverse.",
    },
    {
      key: "discipline",
      label: "Discipline tactique",
      weight: 1,
      category: "tactical",
      description: "Respect de la consigne défensive collective.",
    },
  ],
  full_back: [
    {
      key: "vitesse",
      label: "Vitesse pure",
      weight: 2,
      category: "physical",
      description: "Pointe sur 30 mètres.",
    },
    {
      key: "endurance",
      label: "Endurance (doubler)",
      weight: 2,
      category: "physical",
      description: "Capacité à doubler offensivement sur 90 min.",
    },
    {
      key: "centres",
      label: "Qualité de centre",
      weight: 2,
      category: "technical",
      description: "Variété et précision (rentrant, fuyant, en retrait).",
    },
    {
      key: "discipline_def",
      label: "Discipline défensive",
      weight: 1,
      category: "tactical",
      description: "Replacement et couverture du couloir.",
    },
    {
      key: "conduite",
      label: "Conduite de balle",
      weight: 1,
      category: "technical",
      description: "Conservation pied droit/gauche en course.",
    },
    {
      key: "duel_def",
      label: "Duel défensif 1v1",
      weight: 1,
      category: "technical",
      description: "Tenue debout face à l'ailier adverse.",
    },
    {
      key: "tackle",
      label: "Tackle",
      weight: 1,
      category: "technical",
      description: "Propreté et opportunité.",
    },
    {
      key: "lecture_trans",
      label: "Lecture transitions",
      weight: 1,
      category: "tactical",
      description: "Choix de monter ou de temporiser.",
    },
  ],
  defensive_midfielder: [
    {
      key: "recuperation",
      label: "Récupération",
      weight: 2,
      category: "tactical",
      description:
        "Volume d'interceptions et de duels gagnés en récupération.",
    },
    {
      key: "tackle",
      label: "Tackle",
      weight: 2,
      category: "technical",
      description: "Propreté et timing dans la zone basse.",
    },
    {
      key: "lecture_jeu",
      label: "Lecture du jeu",
      weight: 2,
      category: "tactical",
      description: "Position préventive, anticipation des lignes adverses.",
    },
    {
      key: "passe_courte",
      label: "Passe courte sécurité",
      weight: 1,
      category: "technical",
      description: "Premier ballon juste, sortie sous pression.",
    },
    {
      key: "passe_longue",
      label: "Passe longue",
      weight: 1,
      category: "technical",
      description: "Précision changements d'aile.",
    },
    {
      key: "volume",
      label: "Volume de jeu",
      weight: 1,
      category: "physical",
      description: "Surface couverte au cours du match.",
    },
    {
      key: "force_duel",
      label: "Force dans les duels",
      weight: 1,
      category: "physical",
      description: "Densité et solidité au sol.",
    },
    {
      key: "positionnement",
      label: "Positionnement",
      weight: 1,
      category: "tactical",
      description: "Tenue de la ligne, couverture des deux centraux.",
    },
  ],
  central_midfielder: [
    {
      key: "endurance",
      label: "Endurance haute intensité",
      weight: 2,
      category: "physical",
      description: "Capacité à enchaîner box-to-box.",
    },
    {
      key: "vision",
      label: "Vision du jeu",
      weight: 2,
      category: "tactical",
      description: "Lecture deux actions à l'avance.",
    },
    {
      key: "passe_courte",
      label: "Passe courte",
      weight: 1,
      category: "technical",
      description: "Sûreté dans les transitions et conservation.",
    },
    {
      key: "passe_longue",
      label: "Passe longue",
      weight: 1,
      category: "technical",
      description: "Variété et précision.",
    },
    {
      key: "tir_distance",
      label: "Tir à mi-distance",
      weight: 1,
      category: "technical",
      description: "Frappe à 18-25 mètres.",
    },
    {
      key: "recup_haute",
      label: "Récupération haute",
      weight: 1,
      category: "tactical",
      description: "Pressing immédiat à la perte.",
    },
    {
      key: "course_box",
      label: "Course arrivée box",
      weight: 2,
      category: "physical",
      description: "Apparition décalée dans la surface.",
    },
    {
      key: "polyvalence",
      label: "Polyvalence",
      weight: 1,
      category: "tactical",
      description:
        "Capacité à occuper relayeur ou sentinelle selon phase.",
    },
  ],
  attacking_midfielder: [
    {
      key: "vision",
      label: "Vision du jeu",
      weight: 2,
      category: "tactical",
      description: "Anticipation des espaces, ouverture du jeu.",
    },
    {
      key: "premier_controle",
      label: "Premier contrôle",
      weight: 2,
      category: "technical",
      description:
        "Orientation systématique en faveur de l'action suivante.",
    },
    {
      key: "passe_decisive",
      label: "Passe décisive",
      weight: 2,
      category: "technical",
      description: "Capacité à servir le buteur dans la zone.",
    },
    {
      key: "conduite_pression",
      label: "Conduite sous pression",
      weight: 1,
      category: "technical",
      description: "Conservation face au pressing.",
    },
    {
      key: "tir_distance",
      label: "Tir à distance",
      weight: 1,
      category: "technical",
      description: "Frappe placée et puissante.",
    },
    {
      key: "cpa",
      label: "Coups de pied arrêtés",
      weight: 1,
      category: "technical",
      description: "Coups francs et corners.",
    },
    {
      key: "anticipation",
      label: "Anticipation tactique",
      weight: 1,
      category: "tactical",
      description: "Lecture des phases offensives adverses.",
    },
    {
      key: "leadership",
      label: "Leadership",
      weight: 1,
      category: "mental",
      description: "Voix et présence dans les moments clés.",
    },
  ],
  winger: [
    {
      key: "vitesse",
      label: "Vitesse pure",
      weight: 2,
      category: "physical",
      description: "Pointe et accélération sur 5-10 mètres.",
    },
    {
      key: "conduite",
      label: "Conduite de balle",
      weight: 2,
      category: "technical",
      description: "Maîtrise en course haute vitesse.",
    },
    {
      key: "dribble",
      label: "Dribble (1 contre 1)",
      weight: 2,
      category: "technical",
      description: "Rupture et débordement face au latéral.",
    },
    {
      key: "centres",
      label: "Qualité de centre",
      weight: 1,
      category: "technical",
      description: "Variation et précision.",
    },
    {
      key: "frappe_ext",
      label: "Frappe extérieure",
      weight: 1,
      category: "technical",
      description: "Frappes enroulées rentrant vers le but.",
    },
    {
      key: "replacement",
      label: "Replacement défensif",
      weight: 1,
      category: "tactical",
      description: "Effort de retour, couverture du latéral.",
    },
    {
      key: "endurance",
      label: "Endurance intensité",
      weight: 1,
      category: "physical",
      description: "Capacité à répéter les sprints sur 90 min.",
    },
    {
      key: "finition",
      label: "Finition",
      weight: 1,
      category: "technical",
      description: "Conclusion sur les actions menées.",
    },
  ],
  striker: [
    {
      key: "finition_droit",
      label: "Finition pied droit",
      weight: 2,
      category: "technical",
      description: "Conversion sur frappe pied droit dans la surface.",
    },
    {
      key: "finition_gauche",
      label: "Finition pied gauche",
      weight: 2,
      category: "technical",
      description: "Conversion sur frappe pied gauche dans la surface.",
    },
    {
      key: "tete",
      label: "Jeu de tête",
      weight: 1,
      category: "technical",
      description: "Détente et placement sur centres.",
    },
    {
      key: "demarquage",
      label: "Démarquage",
      weight: 2,
      category: "tactical",
      description: "Mouvement entre les lignes, appels en profondeur.",
    },
    {
      key: "premiere_touche",
      label: "Première touche",
      weight: 1,
      category: "technical",
      description: "Conservation et orientation premier contact.",
    },
    {
      key: "force_dos_but",
      label: "Force dos au but",
      weight: 1,
      category: "physical",
      description: "Capacité à fixer et redistribuer.",
    },
    {
      key: "vitesse_premier",
      label: "Vitesse premiers mètres",
      weight: 1,
      category: "physical",
      description: "Démarrage explosif.",
    },
    {
      key: "mental_face",
      label: "Mental face au gardien",
      weight: 1,
      category: "mental",
      description: "Sang-froid et lucidité dans l'instant clé.",
    },
  ],
};

export function totalCriteria(position: Position): number {
  return GRIDS_BY_POSITION[position].length;
}
