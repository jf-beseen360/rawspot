// Legacy → RawSpot mapping:
//   gardien            → goalkeeper
//   defenseur_central  → centre_back
//   lateral            → full_back
//   sentinelle         → defensive_midfielder
//   relayeur           → central_midfielder
//   meneur             → attacking_midfielder
//   ailier             → winger
//   attaquant          → striker
export type Position =
  | "goalkeeper"
  | "centre_back"
  | "full_back"
  | "defensive_midfielder"
  | "central_midfielder"
  | "attacking_midfielder"
  | "winger"
  | "striker";

// Legacy: piedFort (gauche/droit/ambidextre)
export type DominantFoot = "left" | "right" | "both";

// Legacy: situationClub (club_amateur/academie/sans_club/centre_formation)
export type ClubSituation =
  | "amateur_club"
  | "academy"
  | "no_club"
  | "training_centre";
