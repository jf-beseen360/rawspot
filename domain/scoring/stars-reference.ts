// Portage de lib/starsReference.ts du legacy core (BeSeen360-MVP-demo).
// Stars mondiales de référence pour le module « Style de jeu ».
// Groupées par poste, avec mots-clés descriptifs pour le rapprochement.
//
// IMPORTÉ TEL QUEL : la liste des stars, leurs mots-clés et descriptions FR.
// IMPORTÉ PUIS CORRIGÉ :
//   - StarReference renommé (nom -> name, poste -> position, piedFort -> dominantFoot,
//     motsCles -> keywords, description -> description).
//   - Postes remappés vers domain/shared/position.ts (gardien -> goalkeeper, etc.).
//   - Pied fort remappé vers DominantFoot (gauche -> left, droit -> right).

import type {
  DominantFoot,
  Position,
} from "@/domain/shared/position";

export interface StarReference {
  name: string;
  position: Position;
  dominantFoot: DominantFoot;
  keywords: readonly string[];
  description: string;
}

export const STARS: readonly StarReference[] = [
  // GARDIENS
  {
    name: "Édouard Mendy",
    position: "goalkeeper",
    dominantFoot: "right",
    keywords: ["gabarit", "détente", "calme", "afrique"],
    description:
      "Gabarit imposant, détente d'élite, calme sous pression — école Diambars.",
  },
  {
    name: "Yann Sommer",
    position: "goalkeeper",
    dominantFoot: "right",
    keywords: ["réflexes", "petit", "agile", "lecture"],
    description:
      "Réflexes courts d'exception, agilité en ligne, lecture du jeu de plus haut niveau.",
  },
  {
    name: "Thibaut Courtois",
    position: "goalkeeper",
    dominantFoot: "left",
    keywords: ["grand", "calme", "élite"],
    description:
      "Très grand gabarit, gestion sereine de la surface, jeu au pied moderne.",
  },

  // DÉFENSEURS CENTRAUX
  {
    name: "Kalidou Koulibaly",
    position: "centre_back",
    dominantFoot: "right",
    keywords: ["puissant", "duel aérien", "leader", "afrique"],
    description:
      "Roc défensif, domination aérienne, leadership vocal de la ligne.",
  },
  {
    name: "Virgil van Dijk",
    position: "centre_back",
    dominantFoot: "right",
    keywords: ["élite", "anticipation", "relance", "calme"],
    description:
      "Anticipation chirurgicale, relance propre, calme à toute épreuve.",
  },
  {
    name: "Aymeric Laporte",
    position: "centre_back",
    dominantFoot: "left",
    keywords: ["technique", "relance", "moderne"],
    description:
      "Défenseur moderne, relance précise du pied gauche, lecture tactique fine.",
  },

  // LATÉRAUX
  {
    name: "Achraf Hakimi",
    position: "full_back",
    dominantFoot: "right",
    keywords: ["vitesse", "offensif", "centres", "afrique"],
    description:
      "Latéral moderne, fusée en montée, qualité de centre rentrant exceptionnelle.",
  },
  {
    name: "Theo Hernandez",
    position: "full_back",
    dominantFoot: "left",
    keywords: ["puissance", "vitesse", "frappe"],
    description:
      "Latéral gauche box-to-box, puissance et vitesse pures, frappe redoutable.",
  },
  {
    name: "Trent Alexander-Arnold",
    position: "full_back",
    dominantFoot: "right",
    keywords: ["centres", "vision", "passes"],
    description:
      "Précision de centre rare, vision de jeu d'un meneur, passes longues décisives.",
  },

  // SENTINELLES
  {
    name: "Idrissa Gueye",
    position: "defensive_midfielder",
    dominantFoot: "right",
    keywords: ["récupération", "volume", "tackle", "afrique"],
    description:
      "Volume de course massif, agressivité au tacle propre, leadership défensif.",
  },
  {
    name: "Rodri",
    position: "defensive_midfielder",
    dominantFoot: "right",
    keywords: ["élite", "lecture", "passe", "calme"],
    description:
      "Lecture du jeu d'élite, passe sécurisée à 90 %, base parfaite d'une équipe.",
  },
  {
    name: "N'Golo Kanté",
    position: "defensive_midfielder",
    dominantFoot: "right",
    keywords: ["récupération", "endurance", "humble"],
    description:
      "Machine de récupération, endurance phénoménale, simplicité technique remarquable.",
  },

  // RELAYEURS
  {
    name: "Naby Keïta",
    position: "central_midfielder",
    dominantFoot: "right",
    keywords: ["technique", "course", "afrique"],
    description:
      "Box-to-box africain, technique pure et course offensive constante.",
  },
  {
    name: "Federico Valverde",
    position: "central_midfielder",
    dominantFoot: "right",
    keywords: ["puissance", "frappe", "endurance"],
    description:
      "Puissance physique, frappe extérieure d'élite, endurance sans limite.",
  },
  {
    name: "Jude Bellingham",
    position: "central_midfielder",
    dominantFoot: "right",
    keywords: ["complet", "buts", "leader"],
    description: "Profil complet, arrivée box, leader malgré la jeunesse.",
  },

  // MENEURS
  {
    name: "Sadio Mané",
    position: "attacking_midfielder",
    dominantFoot: "right",
    keywords: ["polyvalent", "vitesse", "afrique", "leader"],
    description:
      "Polyvalent ailier-meneur, leadership africain par l'exemple, vitesse et finition.",
  },
  {
    name: "Luka Modrić",
    position: "attacking_midfielder",
    dominantFoot: "right",
    keywords: ["vision", "premier contrôle", "élite"],
    description:
      "Vision d'élite, premier contrôle quasi parfait, longévité au sommet.",
  },
  {
    name: "Bernardo Silva",
    position: "attacking_midfielder",
    dominantFoot: "left",
    keywords: ["technique", "petit", "polyvalent"],
    description:
      "Conduite sous pression rare, polyvalence offensive totale.",
  },

  // AILIERS
  {
    name: "Kylian Mbappé",
    position: "winger",
    dominantFoot: "right",
    keywords: ["vitesse pure", "finition", "élite"],
    description:
      "Vitesse pure d'élite mondiale, finition les deux pieds, mental de gagnant.",
  },
  {
    name: "Vinícius Júnior",
    position: "winger",
    dominantFoot: "right",
    keywords: ["dribble", "vitesse", "gauche", "amérique du sud"],
    description:
      "Dribble côté gauche dévastateur, accélération courte, créativité brésilienne.",
  },
  {
    name: "Mohamed Salah",
    position: "winger",
    dominantFoot: "left",
    keywords: ["finition", "intérieur", "afrique"],
    description:
      "Ailier inversé droit, frappe pied gauche enroulée, finition d'élite.",
  },
  {
    name: "Khvicha Kvaratskhelia",
    position: "winger",
    dominantFoot: "right",
    keywords: ["dribble", "gauche", "créativité"],
    description:
      "Dribble pied droit côté gauche, créativité hors norme, frappe surprise.",
  },

  // ATTAQUANTS
  {
    name: "Erling Haaland",
    position: "striker",
    dominantFoot: "left",
    keywords: ["puissance", "finition", "grand"],
    description:
      "Puissance physique brute, finition clinique des deux pieds, démarquage parfait.",
  },
  {
    name: "Victor Osimhen",
    position: "striker",
    dominantFoot: "right",
    keywords: ["jeu de tête", "vitesse", "afrique"],
    description:
      "Jeu de tête d'élite, vitesse explosive, hargne dans la surface.",
  },
  {
    name: "Lautaro Martínez",
    position: "striker",
    dominantFoot: "right",
    keywords: ["mouvement", "finition", "amérique du sud"],
    description:
      "Démarquage permanent, finition précise, intelligence du mouvement.",
  },
  {
    name: "Karim Benzema",
    position: "striker",
    dominantFoot: "right",
    keywords: ["technique", "élite", "complet"],
    description:
      "Profil complet, technique fine, capable de jouer pour les autres.",
  },
];

export function starsByPosition(position: Position): readonly StarReference[] {
  return STARS.filter((s) => s.position === position);
}
