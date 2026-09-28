/**
 * Modèles métier du site public, découplés des lignes SQL (`@upcom/supabase`).
 * Les repositories convertissent les lignes en modèles : chemins Storage → URL,
 * snake_case → camelCase, colonnes internes écartées.
 */
import type { SocialPlatform } from "@upcom/supabase";

export interface CategoryRef {
  slug: string;
  name: string;
}

/** Pôle d'activité (table `service_categories` + contenu officiel du cahier des charges). */
export interface Expertise {
  id: string | null;
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  summary: string;
  description: string;
  offerings: readonly string[];
  order: number;
}

/** Prestation détaillée (table `services`), rattachée à un pôle. */
export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  category: CategoryRef | null;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  clientName: string | null;
  year: number | null;
  coverUrl: string | null;
  isFeatured: boolean;
  category: CategoryRef | null;
}

export interface ProjectImage {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
}

export interface ProjectDetail extends Project {
  description: string | null;
  images: ProjectImage[];
}

export interface ArticleCategory {
  id: string;
  slug: string;
  name: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  publishedAt: string;
  authorName: string | null;
  isFeatured: boolean;
  category: CategoryRef | null;
}

export interface ArticleDetail extends Article {
  categoryId: string | null;
  content: string | null;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  coverUrl: string | null;
  isFeatured: boolean;
}

export interface EventDetail extends EventItem {
  description: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  biography: string | null;
  photoUrl: string | null;
  linkedinUrl: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  content: string;
  photoUrl: string | null;
}

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
}

/** Informations globales du site : `site_settings` + `social_links`, complétées par le contenu officiel. */
export interface SiteInfo {
  companyName: string;
  tagline: string;
  description: string;
  address: string;
  phones: string[];
  email: string | null;
  whatsapp: string | null;
  openingHours: string | null;
  mapUrl: string | null;
  socials: SocialLink[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  nextPage: number | null;
}
