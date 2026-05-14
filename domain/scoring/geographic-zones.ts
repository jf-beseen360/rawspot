// Portage de lib/zonesGeographiques.ts du legacy core (BeSeen360-MVP-demo).
// Découpage géographique pour le classement comparatif hiérarchique :
// pays -> zone (sous-région) -> continent -> mondial.
//
// IMPORTÉ TEL QUEL : pays, zones, continents, cohortes relatives.
// IMPORTÉ PUIS CORRIGÉ : trouverZone -> findZone, tousLesPays -> allCountries,
// champs ZonePays renommés (pays/cohorteRelative -> country/relativeCohort).

export type Continent =
  | "Afrique"
  | "Europe"
  | "Amériques"
  | "Asie"
  | "Océanie";

export interface CountryZone {
  country: string;
  zone: string;
  continent: Continent;
  // Densité estimée de joueurs (1 = petite cohorte, 10 = très grande).
  relativeCohort: number;
}

function Z(
  country: string,
  zone: string,
  continent: Continent,
  relativeCohort: number,
): CountryZone {
  return { country, zone, continent, relativeCohort };
}

const ALL: readonly CountryZone[] = [
  // Afrique de l'Ouest francophone
  Z("Sénégal", "Afrique de l'Ouest", "Afrique", 7),
  Z("Côte d'Ivoire", "Afrique de l'Ouest", "Afrique", 8),
  Z("Mali", "Afrique de l'Ouest", "Afrique", 5),
  Z("Burkina Faso", "Afrique de l'Ouest", "Afrique", 4),
  Z("Guinée", "Afrique de l'Ouest", "Afrique", 4),
  Z("Bénin", "Afrique de l'Ouest", "Afrique", 3),
  Z("Togo", "Afrique de l'Ouest", "Afrique", 3),
  Z("Niger", "Afrique de l'Ouest", "Afrique", 3),
  // Afrique Centrale
  Z("Cameroun", "Afrique Centrale", "Afrique", 7),
  Z("Gabon", "Afrique Centrale", "Afrique", 3),
  Z("Congo", "Afrique Centrale", "Afrique", 3),
  Z("RDC", "Afrique Centrale", "Afrique", 8),
  Z("Tchad", "Afrique Centrale", "Afrique", 2),
  // Afrique du Nord
  Z("Maroc", "Afrique du Nord", "Afrique", 8),
  Z("Algérie", "Afrique du Nord", "Afrique", 7),
  Z("Tunisie", "Afrique du Nord", "Afrique", 6),
  Z("Égypte", "Afrique du Nord", "Afrique", 9),
  // Afrique de l'Est et Australe
  Z("Madagascar", "Afrique de l'Est", "Afrique", 4),
  Z("Afrique du Sud", "Afrique Australe", "Afrique", 7),
  // Europe
  Z("France", "Europe Ouest", "Europe", 10),
  Z("Belgique", "Europe Ouest", "Europe", 6),
  Z("Suisse", "Europe Ouest", "Europe", 5),
  Z("Espagne", "Europe Sud", "Europe", 10),
  Z("Portugal", "Europe Sud", "Europe", 8),
  Z("Italie", "Europe Sud", "Europe", 10),
  Z("Allemagne", "Europe Centrale", "Europe", 10),
  Z("Pays-Bas", "Europe Ouest", "Europe", 8),
  // Amériques
  Z("Brésil", "Amérique du Sud", "Amériques", 10),
  Z("Argentine", "Amérique du Sud", "Amériques", 9),
  Z("Colombie", "Amérique du Sud", "Amériques", 7),
  Z("Mexique", "Amérique Centrale", "Amériques", 8),
  Z("USA", "Amérique du Nord", "Amériques", 6),
  Z("Canada", "Amérique du Nord", "Amériques", 4),
];

const MAP: ReadonlyMap<string, CountryZone> = new Map(
  ALL.map((z) => [z.country, z]),
);

export function findZone(country: string): CountryZone {
  return (
    MAP.get(country) ?? {
      country,
      zone: "Reste du monde",
      continent: "Asie",
      relativeCohort: 5,
    }
  );
}

export function allCountries(): readonly CountryZone[] {
  return ALL;
}
