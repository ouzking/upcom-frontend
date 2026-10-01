/**
 * Génère dist/sitemap.xml et dist/robots.txt après le build.
 * Les URLs dynamiques (services, réalisations, actualités, événements) sont lues
 * via l'API REST publique de Supabase (clé publishable, contenus publiés uniquement).
 * Sans configuration Supabase, seules les pages statiques sont listées.
 *
 * Usage : exécuté automatiquement par `npm run build` (postbuild).
 */
import { writeFile } from "node:fs/promises";
import { listSiteRoutes, siteUrl } from "./site-routes.mjs";

if (!siteUrl) {
  console.warn("[seo] VITE_SITE_URL non défini : sitemap.xml non généré (robots.txt conservé).");
  process.exit(0);
}

const urls = await listSiteRoutes();

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
