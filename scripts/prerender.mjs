/**
 * Pré-rendu statique : génère le HTML complet de chaque page publique
 * (pages fixes + contenus publiés), avec ses données et ses balises SEO.
 *
 *   dist/index.html, dist/<route>.html         → pages pré-rendues (servies telles quelles)
 *   dist/app.html                              → coquille de l'application, pour les URLs
 *                                                non pré-rendues (contenus publiés après le build)
 *
 * Le navigateur « hydrate » ensuite la page : affichage immédiat, puis interactivité.
 * Usage : exécuté par `npm run build` après les builds client et serveur.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { listSiteRoutes, siteUrl } from "./site-routes.mjs";

const DIST = "dist";
const SERVER_ENTRY = "dist-ssr/entry-server.js";

// Feuille de style intégrée dans la page : un aller-retour réseau de moins avant le premier affichage.
const template = await inlineStylesheets(await readFile(join(DIST, "index.html"), "utf8"));

async function inlineStylesheets(html) {
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g)];
  for (const [tag, href] of links) {
    const css = await readFile(join(DIST, href), "utf8");
    html = html.replace(tag, `<style>${css}</style>`);
  }
  return html;
}
// Coquille sans contenu pour les routes non pré-rendues (voir public/_redirects).
await writeFile(join(DIST, "app.html"), template);

const { render } = await import(pathToFileURL(SERVER_ENTRY).href);

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeText = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// JSON dans une balise <script> : « < » échappé pour empêcher toute fermeture prématurée.
const safeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

function setMeta(html, attribute, key, content) {
  const tag = `<meta ${attribute}="${key}" content="${escapeAttr(content)}" />`;
  const pattern = new RegExp(`<meta\\s+${attribute}="${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?/>`);
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function applyMeta(html, meta) {
  if (!meta) return html;
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(meta.title)}</title>`);
  out = out.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${escapeAttr(meta.url)}" />`);
  out = setMeta(out, "name", "description", meta.description);
  out = setMeta(out, "name", "robots", meta.robots);
  out = setMeta(out, "property", "og:title", meta.title);
  out = setMeta(out, "property", "og:description", meta.description);
  out = setMeta(out, "property", "og:type", meta.type);
  out = setMeta(out, "property", "og:url", meta.url);
  out = setMeta(out, "property", "og:image", meta.image);
  out = setMeta(out, "name", "twitter:title", meta.title);
  out = setMeta(out, "name", "twitter:description", meta.description);
  out = setMeta(out, "name", "twitter:image", meta.image);
  if (meta.publishedTime) out = setMeta(out, "property", "article:published_time", meta.publishedTime);
  if (meta.jsonLd) {
    out = out.replace("</head>", `    <script type="application/ld+json" id="page-jsonld">${meta.jsonLd.replace(/</g, "\\u003c")}</script>\n  </head>`);
  }
  return out;
}

/**
 * Précharge l'image principale de la page (première image marquée fetchpriority="high"),
 * déclarée en tête du <head> : elle est téléchargée avant les modules JavaScript (meilleur LCP).
 */
function preloadLcpImage(page, html) {
  const img = html.match(/<img\b[^>]*fetchPriority="high"[^>]*>|<img\b[^>]*fetchpriority="high"[^>]*>/i)?.[0];
  if (!img) return page;
  const attr = (name) => img.match(new RegExp(`\\s${name}="([^"]*)"`, "i"))?.[1];
  const src = attr("src");
  if (!src) return page;
  const srcset = attr("srcSet") ?? attr("srcset");
  const sizes = attr("sizes");
  const link = `<link rel="preload" as="image" href="${src}"${srcset ? ` imagesrcset="${srcset}"` : ""}${sizes ? ` imagesizes="${sizes}"` : ""} fetchpriority="high" />`;
  // Après la balise viewport : avant elle, le navigateur évalue `sizes` sur une largeur de bureau
  // (980 px) et précharge une résolution trop grande.
  return page.replace(/<meta name="viewport"[^>]*>/i, (viewport) => `${viewport}\n    ${link}`);
}

const routes = await listSiteRoutes();
if (!siteUrl) throw new Error("[prerender] VITE_SITE_URL est requis (URL canonique du site, ex. https://www.upcomagency.com).");
const origin = siteUrl;
let count = 0;
const failures = [];

for (const { path } of routes) {
  try {
    const { html, meta, state } = await render(path, origin);
    const page = preloadLcpImage(applyMeta(template, meta), html).replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>\n    <script type="application/json" id="__UPCOM_STATE__">${safeJson(state)}</script>`,
    );
    // Fichiers « à plat » (/a-propos → a-propos.html) : Netlify les sert sans redirection
    // vers une URL à barre oblique finale, cohérent avec les URLs canoniques.
    const file = path === "/" ? join(DIST, "index.html") : join(DIST, `${path.slice(1)}.html`);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, page);
    count += 1;
  } catch (error) {
    failures.push(`${path} : ${error instanceof Error ? error.message : String(error)}`);
  }
}

await rm("dist-ssr", { recursive: true, force: true });
console.log(`[prerender] ${count}/${routes.length} page(s) pré-rendue(s).`);
if (failures.length > 0) console.error(`[prerender] Échecs :\n  - ${failures.join("\n  - ")}`);
// Sortie explicite : connexions HTTP et minuteries des bibliothèques ne doivent pas bloquer le build.
process.exit(failures.length > 0 ? 1 : 0);
