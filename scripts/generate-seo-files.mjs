/**
 * Génère dist/sitemap.xml et dist/robots.txt après le build.
 * Les URLs dynamiques (services, réalisations, actualités, événements) sont lues
 * via l'API REST publique de Supabase (clé publishable, contenus publiés uniquement).
 * Sans configuration Supabase, seules les pages statiques sont listées.
 *
 * Usage : exécuté automatiquement par `npm run build` (postbuild).
 */
import { writeFile } from "node:fs/promises";
import { loadEnv } from "vite";

const mode = process.env.MODE ?? "production";
const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env };
const siteUrl = (env.VITE_SITE_URL ?? "").replace(/\/+$/, "");
const supabaseUrl = env.VITE_SUPABASE_URL?.replace(/\/+$/, "");
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!siteUrl) {
  console.warn("[seo] VITE_SITE_URL non défini : sitemap.xml non généré (robots.txt conservé).");
  process.exit(0);
}

const STATIC_ROUTES = [
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

async function rest(table, select, filters = "") {
  if (!supabaseUrl || !supabaseKey) return [];
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${select}&status=eq.published${filters}`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.warn(`[seo] ${table} ignoré : ${error.message}`);
    return [];
  }
}

const [categories, services, projects, articles, events] = await Promise.all([
  rest("service_categories", "slug,updated_at"),
  rest("services", "slug,updated_at,category:service_categories(slug)"),
  rest("projects", "slug,updated_at"),
  rest("articles", "slug,updated_at"),
  rest("events", "slug,updated_at"),
]);

const urls = [
  ...STATIC_ROUTES.map(([path, priority, changefreq]) => ({ path, priority, changefreq })),
  ...categories.map((row) => ({ path: `/services/${row.slug}`, lastmod: row.updated_at, priority: "0.8" })),
  ...services
    .filter((row) => row.category?.slug)
    .map((row) => ({ path: `/services/${row.category.slug}/${row.slug}`, lastmod: row.updated_at, priority: "0.7" })),
  ...projects.map((row) => ({ path: `/realisations/${row.slug}`, lastmod: row.updated_at, priority: "0.7" })),
  ...articles.map((row) => ({ path: `/actualites/${row.slug}`, lastmod: row.updated_at, priority: "0.6" })),
  ...events.map((row) => ({ path: `/evenements/${row.slug}`, lastmod: row.updated_at, priority: "0.5" })),
];

const escape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url>\n    <loc>${escape(siteUrl + url.path)}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod.slice(0, 10)}</lastmod>` : ""}${
        url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ""
      }\n    <priority>${url.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;

await writeFile("dist/sitemap.xml", xml);
await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`[seo] sitemap.xml : ${urls.length} URL(s) — robots.txt mis à jour.`);
