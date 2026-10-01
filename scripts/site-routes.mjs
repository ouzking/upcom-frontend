/**
 * Liste des URLs publiques du site : pages fixes + pages des contenus publiés
 * (lus via l'API REST publique de Supabase, clé publishable). Partagée par le
 * pré-rendu (prerender.mjs) et le plan de site (generate-seo-files.mjs).
 */
import { loadEnv } from "vite";

const mode = process.env.MODE ?? "production";
export const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env };
export const siteUrl = (env.VITE_SITE_URL ?? "").replace(/\/+$/, "");
const supabaseUrl = env.VITE_SUPABASE_URL?.replace(/\/+$/, "");
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

export const STATIC_ROUTES = [
  ["/", "1.0", "weekly"],
  ["/a-propos", "0.8", "monthly"],
  ["/services", "0.9", "monthly"],
  ["/realisations", "0.9", "weekly"],
  ["/expertise", "0.8", "monthly"],
  ["/equipe", "0.6", "monthly"],
  ["/actualites", "0.8", "weekly"],
  ["/evenements", "0.7", "weekly"],
  ["/contact", "0.8", "yearly"],
  ["/demarrer-un-projet", "0.9", "yearly"],
  ["/mentions-legales", "0.2", "yearly"],
  ["/confidentialite", "0.2", "yearly"],
];

async function rest(table, select) {
  if (!supabaseUrl || !supabaseKey) return [];
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${select}&status=eq.published`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.warn(`[routes] ${table} ignoré : ${error.message}`);
    return [];
  }
}

/** @returns {Promise<{ path: string, priority: string, changefreq?: string, lastmod?: string }[]>} */
export async function listSiteRoutes() {
  const [categories, services, projects, articles, events] = await Promise.all([
    rest("service_categories", "slug,updated_at"),
    rest("services", "slug,updated_at,category:service_categories(slug)"),
    rest("projects", "slug,updated_at"),
    rest("articles", "slug,updated_at"),
    rest("events", "slug,updated_at"),
  ]);
  return [
    ...STATIC_ROUTES.map(([path, priority, changefreq]) => ({ path, priority, changefreq })),
    ...categories.map((row) => ({ path: `/services/${row.slug}`, lastmod: row.updated_at, priority: "0.8" })),
    ...services
      .filter((row) => row.category?.slug)
      .map((row) => ({ path: `/services/${row.category.slug}/${row.slug}`, lastmod: row.updated_at, priority: "0.7" })),
    ...projects.map((row) => ({ path: `/realisations/${row.slug}`, lastmod: row.updated_at, priority: "0.7" })),
    ...articles.map((row) => ({ path: `/actualites/${row.slug}`, lastmod: row.updated_at, priority: "0.6" })),
    ...events.map((row) => ({ path: `/evenements/${row.slug}`, lastmod: row.updated_at, priority: "0.5" })),
  ];
}
