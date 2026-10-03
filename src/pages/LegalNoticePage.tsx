import { Fragment } from "react";
import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Seo } from "@/components/seo/Seo";
import { ROUTES } from "@/config/site";
import { useSiteInfo } from "@/hooks/queries";
import { telHref } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/seo";

/**
 * Mentions légales : identifiants légaux lus dans `site_settings` (modifiables depuis le
 * back-office sans redéploiement). Une ligne sans valeur n'est pas affichée.
 */
export default function LegalNoticePage() {
  const { data: site } = useSiteInfo();
  const legalFields = [
    { label: "Forme juridique", value: site?.legalForm },
    { label: "RCCM", value: site?.rccm },
    { label: "NINEA", value: site?.ninea },
    { label: "Directeur de la publication", value: site?.publicationDirector },
  ].filter((field): field is { label: string; value: string } => Boolean(field.value));

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
          {legalFields.length > 0 ? (
            <dl className="grid gap-x-8 gap-y-3 rounded-2xl border border-line p-6 text-[0.95rem] sm:grid-cols-[auto_1fr]">
              {legalFields.map((field) => (
                <Fragment key={field.label}>
                  <dt className="font-semibold text-ink">{field.label}</dt>
                  <dd className="text-ink-soft">{field.value}</dd>
                </Fragment>
              ))}
            </dl>
          ) : null}

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

          <h2>Crédits photographiques</h2>
          <p>
            Certaines photographies et vidéos d'illustration proviennent de Pexels (pexels.com) et sont utilisées sous licence Pexels. Elles illustrent les
            activités de l'agence et ne représentent ni ses équipes, ni ses clients, ni ses réalisations.
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
