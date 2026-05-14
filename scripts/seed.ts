import { randomUUID } from "node:crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { Evaluation } from "../domain/scoring/types";
import type {
  PublicProfileAvatar,
  PublicProfileSummary,
} from "../domain/public-profile/types";
import * as schema from "../lib/db/schema";
import {
  interests,
  medias,
  players,
  publicProfiles,
  scorings,
  visibilities,
} from "../lib/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    "DATABASE_URL is required. Set it in .env.local and retry.",
  );
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(sql, { schema });

function yearsBetween(date: Date, ref: Date): number {
  let years = ref.getFullYear() - date.getFullYear();
  const m = ref.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < date.getDate())) years--;
  return years;
}

const REGISTERED_AT = new Date("2026-01-15T10:00:00Z");
const PUBLISHED_AT = new Date("2026-02-01T10:00:00Z");
const SCORED_AT = new Date("2026-02-02T10:00:00Z");

interface PlayerSeed {
  id: string;
  publicProfileId: string;
  scoringId: string;
  visibilityId: string;
  slug: string;
  phone: string;
  firstName: string;
  lastName: string;
  stageName?: string;
  dateOfBirth: Date;
  nationality: string;
  city: string;
  country: string;
  clubSituation: "amateur_club" | "academy" | "no_club" | "training_centre";
  currentClub?: string;
  primaryPosition:
    | "goalkeeper"
    | "centre_back"
    | "full_back"
    | "defensive_midfielder"
    | "central_midfielder"
    | "attacking_midfielder"
    | "winger"
    | "striker";
  secondaryPosition?: PlayerSeed["primaryPosition"];
  dominantFoot: "left" | "right" | "both";
  heightCm: number;
  weightKg: number;
  avatarInitials: string;
  avatarColor: string;
  motivation: string;
  scoreValue: number;
  scoreLevel: "bronze" | "silver" | "gold" | "platinum";
  evaluation: Evaluation;
  viewCount: number;
  interestCount: number;
  interests: Array<{
    scoutId: string;
    scoutName: string;
    scoutOrganization: string;
    privateNote?: string;
    markedAt: Date;
  }>;
}

const SEEDS: PlayerSeed[] = [
  {
    id: randomUUID(),
    publicProfileId: randomUUID(),
    scoringId: randomUUID(),
    visibilityId: randomUUID(),
    slug: "amadou-diallo-yaounde",
    phone: "+237 690 12 34 56",
    firstName: "Amadou",
    lastName: "Diallo",
    dateOfBirth: new Date("2008-04-21"),
    nationality: "Camerounaise",
    city: "Yaoundé",
    country: "Cameroun",
    clubSituation: "academy",
    currentClub: "Académie Kadji Sports",
    primaryPosition: "winger",
    secondaryPosition: "attacking_midfielder",
    dominantFoot: "right",
    heightCm: 174,
    weightKg: 68,
    avatarInitials: "AD",
    avatarColor: "#E4B330",
    motivation:
      "Jouer en Europe avant 20 ans et représenter le Cameroun en sélection.",
    scoreValue: 78,
    scoreLevel: "gold",
    evaluation: {
      technical: [
        {
          name: "Dribble",
          note: 8,
          comment: "Élimination dans l'axe et sur l'aile, prise de balle propre.",
        },
        {
          name: "Centre",
          note: 7,
          comment: "Précision correcte des centres en mouvement.",
        },
      ],
      physical: [
        {
          name: "Vitesse",
          note: 9,
          comment: "Démarrage explosif et vitesse de pointe au-dessus de la cohorte.",
        },
        {
          name: "Profil",
          note: 7,
          comment: "174 cm / 68 kg adapté au poste d'ailier.",
        },
      ],
      tactical: [
        {
          name: "Placement",
          note: 7,
          comment: "Bonne lecture des espaces en transition rapide.",
        },
        {
          name: "Décision",
          note: 7,
          comment: "Choix de jeu cohérents en situation favorable.",
        },
      ],
      mental: [
        {
          name: "Engagement",
          note: 8,
          comment: "Volume de course constant sur 90 minutes.",
        },
        {
          name: "Confiance",
          note: 8,
          comment: "N'évite pas le un-contre-un, accepte la prise de risque.",
        },
      ],
      strengths: ["Vitesse", "Dribble", "Engagement"],
      improvementAreas: ["Centre", "Décision"],
      commentary:
        "Profil jeune (17 ans) avec marge de progression. Score IA de 78/100 — niveau élevé. Atouts : vitesse, dribble. À renforcer : centre, décision.",
    },
    viewCount: 142,
    interestCount: 4,
    interests: [
      {
        scoutId: "scout-fcs",
        scoutName: "Pierre Lambert",
        scoutOrganization: "FC Sochaux",
        privateNote: "Profil à revoir en match officiel.",
        markedAt: new Date("2026-02-05T14:30:00Z"),
      },
      {
        scoutId: "scout-rsca",
        scoutName: "Tom De Vos",
        scoutOrganization: "RSC Anderlecht",
        markedAt: new Date("2026-02-08T09:15:00Z"),
      },
    ],
  },
  {
    id: randomUUID(),
    publicProfileId: randomUUID(),
    scoringId: randomUUID(),
    visibilityId: randomUUID(),
    slug: "moussa-kone-dakar",
    phone: "+221 77 123 45 67",
    firstName: "Moussa",
    lastName: "Koné",
    dateOfBirth: new Date("2006-09-03"),
    nationality: "Sénégalaise",
    city: "Dakar",
    country: "Sénégal",
    clubSituation: "training_centre",
    currentClub: "Diambars Institute",
    primaryPosition: "attacking_midfielder",
    dominantFoot: "left",
    heightCm: 178,
    weightKg: 72,
    avatarInitials: "MK",
    avatarColor: "#cd7f32",
    motivation: "Devenir meneur de jeu professionnel en Ligue 2 puis Ligue 1.",
    scoreValue: 65,
    scoreLevel: "gold",
    evaluation: {
      technical: [
        {
          name: "Passe",
          note: 8,
          comment: "Qualité de passe courte et longue cohérente.",
        },
        {
          name: "Frappe",
          note: 6,
          comment: "Frappes lointaines à travailler.",
        },
      ],
      physical: [
        {
          name: "Endurance",
          note: 7,
          comment: "Volume de jeu constant sur 90 minutes.",
        },
        {
          name: "Gabarit",
          note: 7,
          comment: "178 cm / 72 kg équilibré pour le poste.",
        },
      ],
      tactical: [
        {
          name: "Vision",
          note: 7,
          comment: "Bonne lecture des dernières passes.",
        },
        {
          name: "Pressing",
          note: 6,
          comment: "Manque de constance sur le repli défensif.",
        },
      ],
      mental: [
        {
          name: "Leadership",
          note: 7,
          comment: "Capitaine de son équipe U19.",
        },
        {
          name: "Concentration",
          note: 6,
          comment: "Quelques pertes de balle évitables en seconde mi-temps.",
        },
      ],
      strengths: ["Passe", "Endurance", "Leadership"],
      improvementAreas: ["Frappe", "Pressing"],
      commentary:
        "Profil 19 ans dans la fenêtre pré-pro. Score IA de 65/100 — niveau élevé. Atouts : passe, endurance. À renforcer : frappe, pressing.",
    },
    viewCount: 87,
    interestCount: 2,
    interests: [
      {
        scoutId: "scout-fcm",
        scoutName: "Julien Garcia",
        scoutOrganization: "FC Metz",
        markedAt: new Date("2026-02-10T16:00:00Z"),
      },
    ],
  },
  {
    id: randomUUID(),
    publicProfileId: randomUUID(),
    scoringId: randomUUID(),
    visibilityId: randomUUID(),
    slug: "kofi-mensah-abidjan",
    phone: "+225 07 12 34 56 78",
    firstName: "Kofi",
    lastName: "Mensah",
    dateOfBirth: new Date("2007-11-14"),
    nationality: "Ivoirienne",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    clubSituation: "amateur_club",
    currentClub: "ASEC Mimosas Junior",
    primaryPosition: "centre_back",
    dominantFoot: "right",
    heightCm: 189,
    weightKg: 81,
    avatarInitials: "KM",
    avatarColor: "#b9f2ff",
    motivation:
      "Devenir défenseur titulaire dans un club européen de premier plan.",
    scoreValue: 82,
    scoreLevel: "platinum",
    evaluation: {
      technical: [
        {
          name: "Relance",
          note: 8,
          comment: "Première passe propre, capable de casser une ligne.",
        },
        {
          name: "Jeu de tête",
          note: 9,
          comment: "Domination aérienne marquée, anticipation excellente.",
        },
      ],
      physical: [
        {
          name: "Gabarit",
          note: 9,
          comment: "189 cm / 81 kg idéal pour un défenseur central.",
        },
        {
          name: "Détente",
          note: 8,
          comment: "Impact aérien au-dessus de la cohorte.",
        },
      ],
      tactical: [
        {
          name: "Placement",
          note: 8,
          comment: "Lecture des trajectoires et couverture systématiques.",
        },
        {
          name: "Anticipation",
          note: 8,
          comment: "Interventions souvent en avance d'un temps.",
        },
      ],
      mental: [
        {
          name: "Agressivité",
          note: 8,
          comment: "Engagement constant dans les duels.",
        },
        {
          name: "Sang-froid",
          note: 8,
          comment: "Garde les nerfs sous pression haute.",
        },
      ],
      strengths: ["Jeu de tête", "Gabarit", "Placement"],
      improvementAreas: [],
      commentary:
        "Profil 18 ans à très haut potentiel. Score IA de 82/100 — niveau très haut. Atouts convergents : jeu de tête, gabarit, placement. Dossier vidéo encore à étoffer.",
    },
    viewCount: 213,
    interestCount: 7,
    interests: [
      {
        scoutId: "scout-omp",
        scoutName: "Marcello Costa",
        scoutOrganization: "Olympique de Marseille",
        privateNote: "Suivi prioritaire — observation match prévue.",
        markedAt: new Date("2026-02-12T11:00:00Z"),
      },
      {
        scoutId: "scout-acm",
        scoutName: "Giovanni Bianchi",
        scoutOrganization: "AC Milan",
        markedAt: new Date("2026-02-14T15:45:00Z"),
      },
    ],
  },
];

function buildSummary(seed: PlayerSeed): PublicProfileSummary {
  return {
    primaryPosition: seed.primaryPosition,
    secondaryPosition: seed.secondaryPosition,
    dominantFoot: seed.dominantFoot,
    heightCm: seed.heightCm,
    weightKg: seed.weightKg,
    ageYears: yearsBetween(seed.dateOfBirth, PUBLISHED_AT),
    city: seed.city,
    country: seed.country,
    nationality: seed.nationality,
    currentClub: seed.currentClub,
    clubSituation: seed.clubSituation,
  };
}

function buildAvatar(seed: PlayerSeed): PublicProfileAvatar {
  return {
    initials: seed.avatarInitials,
    color: seed.avatarColor,
  };
}

async function main() {
  console.log("Truncating tables in FK order…");
  await db.delete(medias);
  await db.delete(interests);
  await db.delete(visibilities);
  await db.delete(scorings);
  await db.delete(publicProfiles);
  await db.delete(players);

  console.log("Inserting players…");
  await db.insert(players).values(
    SEEDS.map((seed) => ({
      id: seed.id,
      phone: seed.phone,
      firstName: seed.firstName,
      lastName: seed.lastName,
      stageName: seed.stageName ?? null,
      dateOfBirth: seed.dateOfBirth,
      nationality: seed.nationality,
      city: seed.city,
      country: seed.country,
      clubSituation: seed.clubSituation,
      currentClub: seed.currentClub ?? null,
      primaryPosition: seed.primaryPosition,
      secondaryPosition: seed.secondaryPosition ?? null,
      dominantFoot: seed.dominantFoot,
      heightCm: seed.heightCm,
      weightKg: seed.weightKg,
      parentalConsent: true,
      avatarInitials: seed.avatarInitials,
      avatarColor: seed.avatarColor,
      status: "published" as const,
      registeredAt: REGISTERED_AT,
      publishedAt: PUBLISHED_AT,
      motivation: seed.motivation,
      openToOutreach: true,
    })),
  );

  console.log("Inserting public profiles…");
  await db.insert(publicProfiles).values(
    SEEDS.map((seed) => ({
      id: seed.publicProfileId,
      playerId: seed.id,
      slug: seed.slug,
      displayName: `${seed.firstName} ${seed.lastName}`,
      status: "published" as const,
      publishedAt: PUBLISHED_AT,
      summary: buildSummary(seed),
      avatar: buildAvatar(seed),
    })),
  );

  console.log("Inserting scorings…");
  await db.insert(scorings).values(
    SEEDS.map((seed) => ({
      id: seed.scoringId,
      playerId: seed.id,
      value: seed.scoreValue,
      level: seed.scoreLevel,
      generatedAt: SCORED_AT,
      generatedBy: "ia-v1",
      evaluation: seed.evaluation,
    })),
  );

  console.log("Inserting visibilities…");
  await db.insert(visibilities).values(
    SEEDS.map((seed) => ({
      id: seed.visibilityId,
      playerId: seed.id,
      viewCount: seed.viewCount,
      interestCount: seed.interestCount,
      lastViewedAt: SCORED_AT,
    })),
  );

  console.log("Inserting interests…");
  const interestRows = SEEDS.flatMap((seed) =>
    seed.interests.map((i) => ({
      id: randomUUID(),
      playerId: seed.id,
      scoutId: i.scoutId,
      scoutName: i.scoutName,
      scoutOrganization: i.scoutOrganization,
      markedAt: i.markedAt,
      privateNote: i.privateNote ?? null,
    })),
  );
  if (interestRows.length > 0) {
    await db.insert(interests).values(interestRows);
  }

  console.log(`Seeded ${SEEDS.length} players. Done.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await sql.end();
  });
