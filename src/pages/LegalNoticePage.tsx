import { Fragment } from "react";
import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Seo } from "@/components/seo/Seo";
import { ROUTES } from "@/config/site";
import { useSiteInfo } from "@/hooks/queries";
import { telHref } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/seo";

/**
 * Mentions légales : seules les informations communiquées par UPCOM figurent ici.
 * Identifiants légaux à renseigner dès qu'UPCOM les fournit (aucune valeur inventée) ;
 * tant que `value` est null, la mention « À compléter par UPCOM » est affichée.
 */
const LEGAL_FIELDS: { label: string; value: string | null }[] = [
  { label: "Forme juridique", value: null },
  { label: "RCCM", value: null },
  { label: "NINEA", value: null },
  { label: "Directeur de la publication", value: null },
];

export default function LegalNoticePage() {
  const { data: site } = useSiteInfo();

  return (
    <>
      <Seo title="Mentions légales" description="Mentions légales du site UPCOM AGENCY & SERVICES." jsonLd={breadcrumbJsonLd([{ name: "Mentions légales", path: ROUTES.legal }])} />
      <PageHero eyebrow="Informations légales" title="Mentions légales" crumbs={[{ label: "Mentions légales" }]} />

      <article className="container-page max-w-3xl py-16 sm:py-24">
        <div className="prose-upcom">
          <h2>Éditeur du site</h2>
          <p>
            <strong>{site?.companyName}</strong>
            <br />
            {site?.address}
            <br />
            Téléphone :{" "}
            {site?.phones.map((phone, index) => (
              <span key={phone}>
                {index > 0 ? " / " : null}
                <a href={telHref(phone)}>{phone}</a>
              </span>
            ))}
            {site?.email ? (
              <>
                <br />
                E-mail : <a href={`mailto:${site.email}`}>{site.email}</a>
              </>
            ) : null}
          </p>
          <dl className="grid gap-x-8 gap-y-3 rounded-2xl border border-line p-6 text-[0.95rem] sm:grid-cols-[auto_1fr]">
            {LEGAL_FIELDS.map((field) => (
              <Fragment key={field.label}>
                <dt className="font-semibold text-ink">{field.label}</dt>
                <dd className={field.value ? "text-ink-soft" : "text-muted"}>{field.value ?? "À compléter par UPCOM"}</dd>
              </Fragment>
            ))}
          </dl>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par <strong>Netlify, Inc.</strong> (netlify.com). Les contenus et les demandes envoyées via les formulaires sont stockés par{" "}
            <strong>Supabase, Inc.</strong> (supabase.com).
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments du site (textes, logo, identité visuelle, images, vidéos, mise en page) est la propriété de {site?.companyName} ou de ses partenaires et
            est protégé par le droit de la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans autorisation préalable écrite est
            interdite.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Le traitement des informations transmises via les formulaires est décrit dans la <Link to={ROUTES.privacy}>politique de confidentialité</Link>.
          </p>

          <h2>Liens externes</h2>
          <p>
            Le site peut contenir des liens vers des sites tiers (réseaux sociaux, cartographie, vidéos). {site?.companyName} n'est pas responsable de leur contenu ni de
            leurs pratiques en matière de données.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question relative au site, utilisez la <Link to={ROUTES.contact}>page de contact</Link>.
          </p>
        </div>
      </article>
    </>
  );
}
