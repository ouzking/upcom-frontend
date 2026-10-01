import { createContext } from "react";
import { env } from "@/config/env";

/** URL absolue (canonical, Open Graph, JSON-LD) à partir d'un chemin du site. */
export const absoluteUrl = (url: string): string => (/^https?:\/\//.test(url) ? url : `${env.siteUrl}${url.startsWith("/") ? "" : "/"}${url}`);

export const breadcrumbJsonLd = (items: { name: string; path: string }[]): Record<string, unknown> => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

/** Métadonnées calculées d'une page (appliquées au <head> dans le navigateur, injectées dans le HTML au pré-rendu). */
export interface PageMeta {
  title: string;
  description: string;
  url: string;
  image: string;
  type: string;
  robots: string;
  publishedTime: string | null;
  jsonLd: string | null;
}

/** Fourni uniquement au pré-rendu : <Seo> y déclare les métadonnées de la page rendue. */
export const SeoCollectorContext = createContext<((meta: PageMeta) => void) | null>(null);
