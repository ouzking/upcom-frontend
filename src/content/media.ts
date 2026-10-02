/**
 * Visuels d'ILLUSTRATION du site (ambiance), issus de Pexels — licence Pexels : usage
 * commercial gratuit, sans attribution obligatoire (crédits : src/assets/stock/CREDITS.md).
 *
 * ⚠ Ils habillent le design (pôles, sections, bandeau final). Ils ne représentent ni l'équipe,
 * ni des réalisations, ni des événements d'UPCOM : ces contenus restent ceux du back-office.
 */
import conference360 from "@/assets/stock/conference-360.mp4";
import conference540 from "@/assets/stock/conference-540.mp4";

const files = import.meta.glob<string>("../assets/stock/*.webp", { eager: true, query: "?url", import: "default" });

const WIDTHS = [640, 1024, 1600] as const;

export interface StockImage {
  src: string;
  srcSet: string;
  alt: string;
  width: number;
  height: number;
}

function stock(name: string, alt: string): StockImage {
  const url = (width: number) => {
    const file = files[`../assets/stock/${name}-${width}.webp`];
    if (!file) throw new Error(`Visuel manquant : ${name}-${width}.webp`);
    return file;
  };
  return {
    src: url(1024),
    srcSet: WIDTHS.map((width) => `${url(width)} ${width}w`).join(", "),
    alt,
    width: 1600,
    height: 1067,
  };
}

export const STOCK = {
  agenceEquipe: stock("agence-equipe", "Professionnels échangeant dans un bureau moderne"),
  agenceCollaboration: stock("agence-collaboration", "Trois collaborateurs travaillant ensemble autour d'un ordinateur portable"),
  approche: stock("approche", "Présentation d'une stratégie sur un tableau blanc"),
  videoPoster: stock("video-poster", "Présentation devant un auditoire lors d'une conférence"),
} as const;

/** Un visuel par pôle d'activité (clé : slug de `service_categories`). */
export const EXPERTISE_IMAGES: Readonly<Record<string, StockImage>> = {
  "communication-strategique": stock("pole-strategie", "Réunion de travail autour d'une table dans une salle de conférence"),
  "communication-digitale": stock("pole-digital", "Professionnelle souriante travaillant sur ordinateur portable"),
  "identite-visuelle-creation-graphique": stock("pole-creation", "Espace de création avec planches graphiques, croquis et ordinateur"),
  "production-audiovisuelle": stock("pole-audiovisuel", "Caméra professionnelle de tournage sur trépied"),
  evenementiel: stock("pole-evenementiel", "Intervenante prenant la parole au micro lors d'une conférence"),
  "services-aux-entreprises": stock("pole-services", "Professionnelle travaillant à son bureau"),
};

/** Vidéo d'ambiance (sans son, en boucle) : version légère pour mobile, version 540p sinon. */
export const AMBIENT_VIDEO = {
  mobile: conference360,
  desktop: conference540,
  poster: STOCK.videoPoster,
} as const;
