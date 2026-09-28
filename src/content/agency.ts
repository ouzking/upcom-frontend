import type { IconName } from "@/lib/icons";

/**
 * Contenus institutionnels issus du cahier des charges UPCOM (présentation,
 * objectifs, public cible, organisation). Textes à faire valider par UPCOM ;
 * aucune donnée chiffrée, référence client ou témoignage n'est inventé.
 */

export const PRESENTATION =
  "UPCOM AGENCY & SERVICES est une entreprise de communication et de prestations de services aux particuliers, entreprises, institutions et organisations.";

export const MISSION =
  "Proposer des solutions professionnelles, créatives et adaptées aux besoins de chaque client, dans les domaines de la communication, du marketing, de la communication digitale, de l'événementiel, de la conception graphique et de l'accompagnement des organisations.";

export const VISION =
  "Accompagner durablement les entreprises et les organisations dans leur visibilité et leur développement, avec une présence forte sur les supports numériques comme traditionnels.";

export const OBJECTIVES: readonly string[] = [
  "Développer une offre professionnelle de communication et de services.",
  "Accompagner les entreprises et organisations dans leur visibilité et leur développement.",
  "Concevoir des stratégies de communication adaptées aux objectifs de chaque client.",
  "Développer une présence forte sur les supports numériques et traditionnels.",
  "Proposer des prestations de qualité dans le respect des délais et des budgets.",
  "Construire une relation durable avec les clients et partenaires.",
  "Développer progressivement un portefeuille diversifié de clients.",
];

export const AUDIENCES: readonly string[] = [
  "PME et grandes entreprises",
  "Start-up et entrepreneurs",
  "Administrations et institutions",
  "ONG et associations",
  "Établissements scolaires et universitaires",
  "Commerces et professionnels indépendants",
  "Organisateurs d'événements",
  "Particuliers",
];

export interface Value {
  title: string;
  text: string;
  icon: IconName;
}

export const VALUES: readonly Value[] = [
  { title: "Confiance", icon: "handshake", text: "Une relation transparente et durable avec chaque client et partenaire." },
  { title: "Expertise", icon: "target", text: "Des stratégies pensées pour vos objectifs, portées par des métiers complémentaires." },
  { title: "Créativité", icon: "sparkles", text: "Des idées et des créations qui donnent une identité forte à votre image." },
  { title: "Modernité", icon: "monitor-smartphone", text: "Une maîtrise des supports numériques, en complément des supports traditionnels." },
  { title: "Professionnalisme", icon: "shield-check", text: "Des prestations de qualité, livrées dans le respect des délais et des budgets." },
];

export interface ApproachStep {
  title: string;
  text: string;
}

export const APPROACH: readonly ApproachStep[] = [
  {
    title: "Comprendre",
    text: "Écouter votre besoin, analyser vos objectifs, votre public et votre contexte pour cadrer précisément le projet.",
  },
  {
    title: "Concevoir",
    text: "Élaborer une stratégie et des solutions créatives adaptées aux objectifs de chaque client.",
  },
  {
    title: "Réaliser",
    text: "Produire et déployer vos supports, contenus et événements dans le respect des délais et des budgets.",
  },
  {
    title: "Accompagner",
    text: "Suivre les résultats, ajuster les actions et construire avec vous une relation durable.",
  },
];

export interface Commitment {
  title: string;
  text: string;
  icon: IconName;
}

export const COMMITMENTS: readonly Commitment[] = [
  {
    title: "Une offre intégrée",
    icon: "layers",
    text: "Six pôles complémentaires réunis au sein d'une même agence : un interlocuteur unique, de la stratégie à la production.",
  },
  {
    title: "Des stratégies sur mesure",
    icon: "target",
    text: "Chaque recommandation est conçue à partir de vos objectifs, de votre public et de votre contexte.",
  },
  {
    title: "Le numérique et le traditionnel",
    icon: "monitor-smartphone",
    text: "Une présence cohérente sur les réseaux sociaux, le web, l'imprimé et l'événementiel.",
  },
  {
    title: "Délais et budgets respectés",
    icon: "clock",
    text: "Des prestations de qualité, cadrées dès le départ et livrées selon les engagements pris.",
  },
  {
    title: "Une relation durable",
    icon: "handshake",
    text: "Un accompagnement dans la durée, pour faire grandir votre image au rythme de vos projets.",
  },
];

/** Organisation de l'équipe prévue par le cahier des charges (postes, sans données personnelles). */
export const TEAM_ROLES: readonly string[] = [
  "CEO",
  "Responsable commercial",
  "Chargé de communication",
  "Community manager",
  "Graphiste",
  "Photographe / vidéaste",
  "Responsable événementiel",
  "Assistant administratif",
  "Comptable",
  "Prestataires et consultants externes",
];
