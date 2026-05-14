// Article 19 RSTP FIFA — protection des mineurs lors des transferts
// internationaux. Règles métier en couche domaine pure.
//
// IMPORTÉ TEL QUEL :
//   - Seuil de minorité 18 ans (RSTP et pratique législative).
//   - Exclusion stricte des mineurs du démarchage agent — fidèle à
//     app/agents/demarcher/page.tsx:89-91 du legacy.
// IMPORTÉ PUIS CORRIGÉ :
//   - Logique extraite de la page UI vers une couche domaine isolée
//     (zéro accès store / DB).
//   - Decision typé avec reason machine-readable.

export type Article19BlockReason = "minor_blocked_by_article_19";

export interface Article19Decision {
  allowed: boolean;
  reason?: Article19BlockReason;
}
