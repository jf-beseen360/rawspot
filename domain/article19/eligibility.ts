// Règles d'éligibilité Article 19 RSTP FIFA. Fonctions pures et
// déterministes via paramètre `now` injectable.
//
// IMPORTÉ TEL QUEL :
//   - Seuil 18 ans (RSTP art. 19).
//   - Calcul d'âge calendar — cohérent avec domain/scoring/algorithm.ts
//     et chain-of-analysis.ts (PR #5).
// IMPORTÉ PUIS CORRIGÉ :
//   - Extraction de la logique de filtre depuis
//     app/agents/demarcher/page.tsx:89-91 (mineurs strictement exclus).
//   - Synthèse de la guardianship valide depuis le couplage legacy
//     parentalConsent + accountHolder.

import type { Player } from "@/domain/player/types";
import type { Article19Decision } from "./types";

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

export function isMinor(player: Player, now: Date = new Date()): boolean {
  return computeAge(player.dateOfBirth, now) < 18;
}

// Tutelle adulte valide : consentement parental + titulaire de compte
// présent (le type Player garantit accountHolder.validatedAt: Date).
export function hasValidGuardianship(player: Player): boolean {
  if (!player.parentalConsent) return false;
  if (!player.accountHolder) return false;
  return true;
}

// Un agent FIFA peut-il démarcher ce joueur ?
// Fidèle au legacy : les mineurs sont strictement exclus du démarchage,
// indépendamment de la guardianship. Le contact via le titulaire de
// compte adulte passe par le parcours d'inscription, jamais par le
// démarchage agent.
export function canBeApproachedByAgent(
  player: Player,
  now: Date = new Date(),
): Article19Decision {
  if (isMinor(player, now)) {
    return { allowed: false, reason: "minor_blocked_by_article_19" };
  }
  return { allowed: true };
}
