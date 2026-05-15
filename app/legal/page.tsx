import type { Metadata } from "next";
import { BRAND_NAME_WITH_DEGREE } from "@/lib/brand";

// PR #9 — Page publique "Mentions légales + FAQ".
// IMPORTÉ TEL QUEL (texte préservé) PUIS CORRIGÉ :
// - stack rawspot (Tailwind v4 + brand tokens).
// - ancres #fifa19 et #contact préservées (référencées depuis layout footer
//   futur et page parents).
// - email jfpitey@beseen360app.com préservé per memory (décision e-mail
//   séparée non prise).

export const metadata: Metadata = {
  title: "Mentions légales et FAQ",
  description: `${BRAND_NAME_WITH_DEGREE} — éditeur, hébergement, RGPD, propriété intellectuelle, conformité FIFA Article 19, FAQ et contact.`,
};

const CONTACT_EMAIL = "jfpitey@beseen360app.com";

export default function LegalPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-12 px-4 py-10 sm:px-6">
      <div>
        <div className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-brand-gold">
          Mentions légales et FAQ
        </div>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Tout est écrit, rien n&apos;est caché.
        </h1>
        <p className="leading-relaxed text-zinc-700">
          {BRAND_NAME_WITH_DEGREE} est une plateforme jeune, pilotée par un
          agent licencié FIFA et non par des financiers. Nos règles sont
          volontairement simples, lisibles, et construites pour protéger les
          jeunes joueurs et leurs familles avant tout autre intérêt.
        </p>
      </div>

      <Section titre="Éditeur de la plateforme">
        <p>
          {BRAND_NAME_WITH_DEGREE} Football est édité par{" "}
          <strong>{BRAND_NAME_WITH_DEGREE}</strong>, projet porté par Pitey,
          agent licencié FIFA. Adresse, immatriculation et coordonnées
          complètes seront publiées à l&apos;ouverture commerciale (T3 2026).
        </p>
      </Section>

      <Section titre="Hébergement">
        <p>
          La plateforme est hébergée par Vercel Inc., 440 N Barranca Ave,
          Covina CA 91723, USA. La base de données est hébergée en Europe
          (région Frankfurt) sur Supabase. Les fichiers vidéo (en phase 2)
          seront hébergés sur Supabase Storage / Cloudflare R2 selon la
          décision finale d&apos;architecture.
        </p>
      </Section>

      <Section titre="Données personnelles (RGPD)">
        <p>
          Conformément au Règlement européen RGPD et aux lois nationales
          équivalentes des pays où nous opérons, les données personnelles
          sont :
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>
              Collectées strictement pour la finalité d&apos;évaluation et de
              mise en visibilité
            </strong>{" "}
            du joueur auprès de recruteurs vérifiés.
          </li>
          <li>
            <strong>Conservées tant que le profil reste actif</strong>, et
            supprimées définitivement sous 48 h sur demande.
          </li>
          <li>
            <strong>Jamais revendues</strong> à des tiers, ni utilisées pour
            de la publicité.
          </li>
          <li>
            <strong>Accessibles, modifiables et exportables</strong> à tout
            moment par le joueur ou son représentant légal.
          </li>
        </ul>
        <p className="mt-3">
          Pour exercer un droit RGPD :{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-brand-gold underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </Section>

      <Section titre="Propriété intellectuelle">
        <p>
          La marque {BRAND_NAME_WITH_DEGREE}, son logo, ses couleurs et
          notamment la <strong>règle inviolable du symbole ° attaché au nom</strong>{" "}
          sont protégés. Toute reproduction sans autorisation écrite est
          interdite.
        </p>
        <p>
          Les vidéos téléversées par les joueurs restent leur propriété ; ils
          accordent à {BRAND_NAME_WITH_DEGREE} une licence non-exclusive
          d&apos;utilisation pour la durée de visibilité du profil.
        </p>
      </Section>

      <Section titre="Conditions générales d'utilisation">
        <p>
          L&apos;inscription est gratuite pour la saison pilote 2026.
          L&apos;évaluation IA est offerte à tous les inscrits. Un modèle
          d&apos;abonnement modeste pourra être introduit pour pérenniser le
          service — il sera annoncé deux mois à l&apos;avance et
          n&apos;affectera pas les inscrits gratuits.
        </p>
        <p>
          Aucune commission de transfert n&apos;est prélevée par{" "}
          {BRAND_NAME_WITH_DEGREE}. Les transactions éventuelles entre clubs
          et joueurs sont strictement encadrées par le règlement FIFA et
          l&apos;agent licencié.
        </p>
      </Section>

      <Section titre="Conformité FIFA Article 19" id="fifa19">
        <p>
          {BRAND_NAME_WITH_DEGREE} applique strictement l&apos;Article 19 du
          Règlement FIFA sur les transferts internationaux de mineurs. Aucun
          transfert direct vers un club étranger n&apos;est facilité pour un
          joueur de moins de 18 ans, sauf dans les exceptions explicitement
          prévues par la FIFA et accompagnées par un agent licencié.
        </p>
      </Section>

      <hr className="border-zinc-200" />

      <div id="faq">
        <div className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-brand-gold">
          Foire aux questions
        </div>
        <h2 className="mb-8 text-3xl font-semibold tracking-tight">
          Les questions qu&apos;on nous pose souvent
        </h2>

        <div className="space-y-6">
          <FAQ q="Combien ça coûte pour un joueur de s'inscrire ?">
            Gratuit pendant toute la saison pilote 2026. Au-delà, un
            abonnement modeste pourra être introduit, annoncé deux mois à
            l&apos;avance.
          </FAQ>
          <FAQ q="Combien de temps avant que mon profil soit publié ?">
            Instantané dès que ton inscription est complète et qu&apos;au
            moins une vidéo est téléversée.
          </FAQ>
          <FAQ q="Est-ce qu'un robot évalue mes vidéos ?">
            Oui. Le score est généré par notre algorithme propriétaire à
            partir d&apos;éléments objectifs et vérifiables. Aucune
            intervention humaine, aucun favoritisme. Le recruteur garde la
            décision finale en visionnant les vidéos brutes — nous ne
            sélectionnons pas pour lui.
          </FAQ>
          <FAQ q="Si un club me contacte directement par WhatsApp, c'est légitime ?">
            Non. Aucun club ni recruteur sérieux ne contacte un mineur
            directement sur ses réseaux personnels. Tout contact passe par
            l&apos;équipe {BRAND_NAME_WITH_DEGREE} et par un agent FIFA. Si tu
            reçois un message suspect, ne réponds pas et signale-le-nous
            immédiatement.
          </FAQ>
          <FAQ q="Combien de temps le profil reste-t-il visible ?">
            Tant que tu le souhaites. Tu peux mettre en pause ou supprimer ton
            profil à tout moment, sans justification.
          </FAQ>
          <FAQ q="J'ai perdu accès à mon numéro de téléphone, comment je récupère mon compte ?">
            Contacte-nous à{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-brand-gold underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            avec une preuve d&apos;identité — nous transférons ton compte sous
            72 h.
          </FAQ>
          <FAQ q="Êtes-vous des agents qui touchez une commission sur les transferts ?">
            Non. {BRAND_NAME_WITH_DEGREE} ne perçoit AUCUNE commission de
            transfert. La plateforme est ouverte à tous les agents licenciés
            FIFA. Le fondateur est lui-même agent FIFA, mais il n&apos;a aucun
            privilège sur les autres agents — l&apos;athlète choisit librement
            son représentant parmi tous ceux disponibles.
          </FAQ>
        </div>
      </div>

      <Section titre="Nous contacter" id="contact">
        <p>
          Question générale :{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-brand-gold underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>
          Aide compte :{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-brand-gold underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>
          RGPD / vie privée :{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-brand-gold underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>
          Presse / partenariats :{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-brand-gold underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </Section>
    </main>
  );
}

function Section({
  titre,
  children,
  id,
}: {
  titre: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id}>
      <h2 className="mb-3 text-xl font-semibold text-brand-gold">{titre}</h2>
      <div className="space-y-3 leading-relaxed text-zinc-800">{children}</div>
    </section>
  );
}

function FAQ({
  q,
  children,
}: {
  q: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group cursor-pointer rounded-xl border border-zinc-200 bg-white p-5">
      <summary className="flex list-none items-start justify-between gap-4 font-medium">
        <span>{q}</span>
        <span
          className="text-xl text-brand-gold transition-transform group-open:rotate-45"
          aria-hidden
        >
          +
        </span>
      </summary>
      <div className="mt-3 leading-relaxed text-zinc-700">{children}</div>
    </details>
  );
}
