import { COMPANY } from "@/content/company";
import { useSiteInfo } from "@/hooks/queries";
import { toE164 } from "@/lib/format";
import { absoluteUrl, legalIdentifiersJsonLd } from "@/lib/seo";

/**
 * Données structurées de l'agence (LocalBusiness), sur toutes les pages. Rendues par React
 * à partir de `site_settings` : présentes dans le HTML pré-rendu, mises à jour en direct.
 */
export function OrganizationJsonLd() {
  const { data: site } = useSiteInfo();
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site?.companyName ?? COMPANY.name,
    description: "Entreprise de communication et de prestations de services aux particuliers, entreprises, institutions et organisations.",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon-512.png"),
    image: absoluteUrl("/og-image.jpg"),
    address: { "@type": "PostalAddress", streetAddress: site?.address ?? COMPANY.address, addressCountry: "SN" },
    telephone: (site?.phones ?? COMPANY.phones).map((phone) => toE164(phone)),
    ...legalIdentifiersJsonLd(site),
  };
  // « < » échappé : le contenu ne peut pas fermer la balise <script>.
  const json = JSON.stringify(data).replace(/</g, String.raw`\u003c`);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
