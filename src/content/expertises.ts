import type { IconName } from "@/lib/icons";

/**
 * Les six pôles d'activité et leurs prestations, tels que définis par le cahier
 * des charges UPCOM. Les slugs correspondent à la table `service_categories`
 * (insérée par migration dans upcom-backend) : la base reste la source de vérité
 * pour le nom, la description, l'icône et la publication ; ce contenu complète
 * ce qui n'est pas (encore) saisi dans le back-office.
 */
export interface ExpertiseContent {
  slug: string;
  name: string;
  shortName: string;
  icon: IconName;
  summary: string;
  description: string;
  offerings: readonly string[];
}

export const EXPERTISES: readonly ExpertiseContent[] = [
  {
    slug: "communication-strategique",
    name: "Communication stratégique",
    shortName: "Stratégie",
    icon: "compass",
    summary: "Stratégies et plans de communication, conseil en image et positionnement, relations publiques.",
    description:
      "Définir un discours clair et cohérent, aligné sur vos objectifs : de l'élaboration de la stratégie au plan d'action, de la communication institutionnelle aux relations publiques, jusqu'au lancement de vos produits et services.",
    offerings: [
      "Élaboration de stratégies de communication",
      "Plan de communication",
      "Conseil en image et positionnement",
      "Communication institutionnelle",
      "Communication interne et externe",
      "Relations publiques",
      "Accompagnement de lancement de produits ou services",
    ],
  },
  {
    slug: "communication-digitale",
    name: "Communication digitale",
    shortName: "Digital",
    icon: "monitor-smartphone",
    summary: "Réseaux sociaux, community management, contenus, campagnes sponsorisées et visibilité en ligne.",
    description:
      "Développer une présence forte et maîtrisée sur les supports numériques : animation de vos communautés, création de contenus, campagnes publicitaires et suivi des performances.",
    offerings: [
      "Création et gestion de pages sur les réseaux sociaux",
      "Community management",
      "Élaboration de calendriers éditoriaux",
      "Création de contenus",
      "Rédaction d'articles et publications",
      "Campagnes publicitaires digitales",
      "Gestion de campagnes sponsorisées",
      "Création et gestion de newsletters",
      "Référencement et visibilité en ligne",
      "Analyse des performances digitales",
    ],
  },
  {
    slug: "identite-visuelle-creation-graphique",
    name: "Identité visuelle & création graphique",
    shortName: "Création",
    icon: "pen-tool",
    summary: "Logos, chartes graphiques, supports imprimés et numériques, packaging et présentations.",
    description:
      "Donner à votre organisation une image forte et reconnaissable : création de logo et de charte graphique, déclinée sur l'ensemble de vos supports imprimés et numériques.",
    offerings: [
      "Création de logos",
      "Charte graphique",
      "Cartes de visite",
      "Flyers et affiches",
      "Brochures et catalogues",
      "Dépliants",
      "Supports institutionnels",
      "Packaging",
      "Bannières web",
      "Visuels pour réseaux sociaux",
      "Présentations professionnelles",
    ],
  },
  {
    slug: "production-audiovisuelle",
    name: "Production audiovisuelle",
    shortName: "Audiovisuel",
    icon: "clapperboard",
    summary: "Photographie, vidéos institutionnelles et promotionnelles, captation, montage et motion design.",
    description:
      "Raconter votre activité en images : photographie professionnelle, vidéos institutionnelles et promotionnelles, interviews, captation d'événements, montage et motion design.",
    offerings: [
      "Photographie professionnelle",
      "Reportages photographiques",
      "Vidéos institutionnelles",
      "Vidéos promotionnelles",
      "Interviews",
      "Captation d'événements",
      "Montage vidéo",
      "Motion design",
      "Création de contenus pour réseaux sociaux",
    ],
  },
  {
    slug: "evenementiel",
    name: "Événementiel",
    shortName: "Événementiel",
    icon: "calendar-range",
    summary: "Organisation et accompagnement de conférences, séminaires, lancements, cérémonies et salons.",
    description:
      "Concevoir et orchestrer des moments qui marquent : organisation et accompagnement de vos conférences, séminaires, lancements de produits, cérémonies, salons et événements d'entreprise.",
    offerings: [
      "Conférences",
      "Séminaires",
      "Ateliers",
      "Formations",
      "Lancements de produits",
      "Cérémonies",
      "Salons et expositions",
      "Événements d'entreprise",
      "Activités promotionnelles",
    ],
  },
  {
    slug: "services-aux-entreprises",
    name: "Services aux entreprises",
    shortName: "Services",
    icon: "briefcase-business",
    summary: "Assistance administrative, secrétariat externalisé, logistique, études et accompagnement de projets.",
    description:
      "Vous libérer des tâches opérationnelles pour vous concentrer sur l'essentiel : assistance administrative, secrétariat externalisé, logistique, formation, études et accompagnement de vos projets.",
    offerings: [
      "Assistance administrative",
      "Secrétariat externalisé",
      "Impression et reprographie",
      "Conception de documents professionnels",
      "Organisation de réunions",
      "Gestion logistique",
      "Mise en relation avec des prestataires",
      "Conseil et accompagnement de projets",
      "Formation professionnelle",
      "Études et enquêtes",
      "Services de représentation et d'accompagnement",
    ],
  },
];

export const findExpertiseContent = (slug: string): ExpertiseContent | undefined =>
  EXPERTISES.find((expertise) => expertise.slug === slug);
