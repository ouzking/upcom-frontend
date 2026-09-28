/**
 * Informations officielles fournies par UPCOM AGENCY & SERVICES.
 * Elles servent de valeurs par défaut : la table `site_settings` (back-office)
 * est prioritaire dès qu'un champ y est renseigné.
 */
export const COMPANY = {
  name: "UPCOM AGENCY & SERVICES",
  shortName: "UPCOM",
  tagline: "Donner de la valeur à votre image.",
  description:
    "UPCOM AGENCY & SERVICES accompagne entreprises, institutions, organisations et entrepreneurs dans leurs projets de communication, de création et de développement.",
  address: "Ouest Foire, Cité Air Afrique, Lot 13",
  phones: ["77 402 74 94", "77 835 92 94"],
  /** Recherche cartographique utilisée tant qu'aucun `map_url` n'est défini en base. */
  mapQuery: "Ouest Foire, Cité Air Afrique, Lot 13, Dakar",
} as const;
