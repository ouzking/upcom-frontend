/** Routes publiques (URLs propres, en français). */
export const ROUTES = {
  home: "/",
  about: "/a-propos",
  services: "/services",
  expertise: (slug: string) => `/services/${slug}`,
  service: (expertiseSlug: string, slug: string) => `/services/${expertiseSlug}/${slug}`,
  projects: "/realisations",
  project: (slug: string) => `/realisations/${slug}`,
  know_how: "/expertise",
  team: "/equipe",
  news: "/actualites",
  article: (slug: string) => `/actualites/${slug}`,
  events: "/evenements",
  event: (slug: string) => `/evenements/${slug}`,
  contact: "/contact",
  quote: "/demarrer-un-projet",
  legal: "/mentions-legales",
  privacy: "/confidentialite",
} as const;

export interface NavItem {
  label: string;
  to: string;
}

/** Navigation principale. */
export const MAIN_NAV: readonly NavItem[] = [
  { label: "Accueil", to: ROUTES.home },
  { label: "À propos", to: ROUTES.about },
  { label: "Services", to: ROUTES.services },
  { label: "Réalisations", to: ROUTES.projects },
  { label: "Expertise", to: ROUTES.know_how },
  { label: "Actualités", to: ROUTES.news },
  { label: "Contact", to: ROUTES.contact },
];

/** Liens secondaires (menu mobile, pied de page). */
export const SECONDARY_NAV: readonly NavItem[] = [
  { label: "Équipe", to: ROUTES.team },
  { label: "Événements", to: ROUTES.events },
  { label: "Démarrer un projet", to: ROUTES.quote },
];

export const PRIMARY_CTA: NavItem = { label: "Démarrer un projet", to: ROUTES.quote };
