import { useContext, useEffect } from "react";
import { useLocation } from "react-router";
import { COMPANY } from "@/content/company";
import { absoluteUrl as absolute, SeoCollectorContext, type PageMeta } from "@/lib/seo";

export interface SeoProps {
  /** Titre de la page (le nom de l'agence est ajouté automatiquement). */
  title?: string;
  description?: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
  /** Empêche l'indexation (pages introuvables, confirmations…). */
  noindex?: boolean;
  /** Données structurées schema.org propres à la page. */
  jsonLd?: Record<string, unknown> | null;
  publishedTime?: string;
}

const DEFAULT_TITLE = `${COMPANY.name} — ${COMPANY.tagline.replace(/\.$/, "")}`;
const JSON_LD_ID = "page-jsonld";


function setMeta(attribute: "name" | "property", key: string, content: string | null): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (content === null) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

function setJsonLd(serialized: string | null): void {
  document.getElementById(JSON_LD_ID)?.remove();
  if (!serialized) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = JSON_LD_ID;
  script.textContent = serialized;
  document.head.appendChild(script);
}

/**
 * Métadonnées de la page (title, description, canonical, Open Graph, Twitter,
 * JSON-LD). Gestion impérative du <head> : un seul jeu de balises, mis à jour
 * à chaque navigation, sans doublon avec les valeurs par défaut d'index.html.
 */
export function Seo({ title, description = COMPANY.description, image, type = "website", noindex = false, jsonLd = null, publishedTime }: SeoProps) {
  const { pathname } = useLocation();
  const collect = useContext(SeoCollectorContext);

  const meta: PageMeta = {
    title: title ? `${title} | ${COMPANY.shortName}` : DEFAULT_TITLE,
    description,
    url: absolute(pathname),
    image: absolute(image ?? "/og-image.jpg"),
    type,
    robots: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    publishedTime: publishedTime ?? null,
    // Sérialisé : les pages peuvent passer un objet recréé à chaque rendu sans relancer l'effet.
    jsonLd: jsonLd ? JSON.stringify({ "@context": "https://schema.org", ...jsonLd }) : null,
  };

  // Pré-rendu : les métadonnées sont transmises au générateur de HTML statique.
  collect?.(meta);

  const { title: fullTitle, url, image: imageUrl, robots, jsonLd: jsonLdString } = meta;
  useEffect(() => {
    document.title = fullTitle;
    setCanonical(url);
    setMeta("name", "description", description);
    setMeta("name", "robots", robots);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "article:published_time", publishedTime ?? null);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);
    setJsonLd(jsonLdString);
  }, [fullTitle, description, url, imageUrl, type, robots, jsonLdString, publishedTime]);

  return null;
}
