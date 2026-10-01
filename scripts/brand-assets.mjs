/**
 * Génère les déclinaisons du logo officiel UPCOM à partir de brand/logo-upcom-source.jpeg :
 *   - src/assets/brand/logo-upcom(.sm).webp   (fond transparent, recadré)
 *   - brand/logo-upcom-transparent.png         (master transparent HD)
 *   - src/assets/brand/mark-upcom.webp         (monogramme « UP » + orbite)
 *   - public/favicon-32.png, apple-touch-icon.png, icon-512.png
 *   - public/og-image.jpg                      (1200×630, partages sociaux)
 *
 * Usage : npm run brand:assets
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SOURCE = "brand/logo-upcom-source.jpeg";
const ASSETS = "src/assets/brand";
const PUBLIC = "public";

/** « Color to alpha » sur le blanc : conserve les dégradés, supprime le fond. */
async function whiteToAlpha(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    let alpha = Math.max(255 - r, 255 - g, 255 - b) / 255;
    if (alpha < 0.06) alpha = 0;
    if (alpha > 0) {
      data[i] = Math.round((r - 255 * (1 - alpha)) / alpha);
      data[i + 1] = Math.round((g - 255 * (1 - alpha)) / alpha);
      data[i + 2] = Math.round((b - 255 * (1 - alpha)) / alpha);
    }
    data[i + 3] = Math.round(alpha * 255);
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

await mkdir(ASSETS, { recursive: true });

const transparent = await whiteToAlpha(SOURCE);
const logo = await sharp(transparent).trim({ threshold: 1 }).png().toBuffer();
await sharp(logo).resize({ width: 600 }).webp({ quality: 78, alphaQuality: 85 }).toFile(`${ASSETS}/logo-upcom.webp`);
await sharp(logo).resize({ width: 420 }).webp({ quality: 78, alphaQuality: 85 }).toFile(`${ASSETS}/logo-upcom-md.webp`);
await sharp(logo).resize({ width: 140 }).webp({ quality: 85, alphaQuality: 90 }).toFile(`${ASSETS}/logo-upcom-xs.webp`);
await sharp(logo).resize({ width: 260 }).webp({ quality: 85, alphaQuality: 90 }).toFile(`${ASSETS}/logo-upcom-sm.webp`);
await sharp(logo).resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile("brand/logo-upcom-transparent.png");

// Monogramme : partie supérieure du logo (UP + orbite), sans le texte.
const markRegion = { left: 70, top: 120, width: 960, height: 515 };
const mark = await sharp(await whiteToAlpha(await sharp(SOURCE).extract(markRegion).toBuffer()))
  .trim({ threshold: 1 })
  .png()
  .toBuffer();
await sharp(mark).resize({ width: 480 }).webp({ quality: 82 }).toFile(`${ASSETS}/mark-upcom.webp`);

const square = (size, background) =>
  sharp(mark)
    .resize({ width: Math.round(size * 0.86), height: Math.round(size * 0.86), fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: Math.round(size * 0.07), bottom: size - Math.round(size * 0.86) - Math.round(size * 0.07),
      left: Math.round(size * 0.07), right: size - Math.round(size * 0.86) - Math.round(size * 0.07),
      background,
    })
    .png();

await square(32, { r: 0, g: 0, b: 0, alpha: 0 }).toFile(`${PUBLIC}/favicon-32.png`);
await square(180, { r: 255, g: 255, b: 255, alpha: 1 }).toFile(`${PUBLIC}/apple-touch-icon.png`);
await square(512, { r: 255, g: 255, b: 255, alpha: 1 }).toFile(`${PUBLIC}/icon-512.png`);
await square(192, { r: 255, g: 255, b: 255, alpha: 1 }).toFile(`${PUBLIC}/icon-192.png`);

// Icône « maskable » (Android) : monogramme dans la zone de sécurité (≈ 60 %), fond blanc.
await sharp(mark)
  .resize({ width: 308, height: 308, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .extend({ top: 102, bottom: 102, left: 102, right: 102, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: "#FFFFFF" })
  .png()
  .toFile(`${PUBLIC}/icon-maskable-512.png`);

// Image Open Graph : fond blanc, logo centré, bandeau bleu → orange en pied.
const W = 1200, H = 630;
const band = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="b" x1="0" x2="1"><stop offset="0" stop-color="#013592"/><stop offset="1" stop-color="#0172E7"/></linearGradient>
    <linearGradient id="o" x1="0" x2="1"><stop offset="0" stop-color="#EB4602"/><stop offset="1" stop-color="#FD8E03"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <rect y="${H - 36}" width="${W * 0.72}" height="36" fill="url(#b)"/>
  <rect x="${W * 0.72}" y="${H - 36}" width="${W * 0.28}" height="36" fill="url(#o)"/>
</svg>`);
const ogLogo = await sharp(logo).resize({ height: 470 }).png().toBuffer();
await sharp(band)
  .composite([{ input: ogLogo, gravity: "center", top: 50, left: Math.round((W - (await sharp(ogLogo).metadata()).width) / 2) }])
  .jpeg({ quality: 88 })
  .toFile(`${PUBLIC}/og-image.jpg`);

console.log("Assets de marque générés.");
