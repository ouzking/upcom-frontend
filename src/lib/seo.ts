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
