import { storageUrl } from "@/lib/storage";
import type { Project, ProjectDetail } from "@/types/domain";
import { one, query } from "./client";

const PROJECT_COLUMNS =
  "id, slug, title, excerpt, client_name, year, cover_image_path, is_featured, category:service_categories(slug, name)" as const;

type ProjectRowWithCategory = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  client_name: string | null;
  year: number | null;
  cover_image_path: string | null;
  is_featured: boolean;
  category: { slug: string; name: string } | { slug: string; name: string }[] | null;
};

const toProject = (row: ProjectRowWithCategory): Project => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  clientName: row.client_name,
  year: row.year,
  coverUrl: storageUrl("projects", row.cover_image_path),
  isFeatured: row.is_featured,
  category: one(row.category),
});

export interface ProjectListOptions {
  featuredOnly?: boolean;
  limit?: number;
}

/**
 * Réalisations publiées. Le volume d'un portfolio d'agence reste modeste :
 * la liste complète est chargée une fois puis filtrée côté client (filtres et
 * recherche instantanés, URL partageable).
 */
export async function listProjects({ featuredOnly = false, limit = 200 }: ProjectListOptions = {}): Promise<Project[]> {
  const rows = await query("Chargement des réalisations", [], (db) => {
    let request = db
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("display_order")
      .order("year", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (featuredOnly) request = request.eq("is_featured", true);
    return request;
  });
  return rows.map(toProject);
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const row = await query("Chargement de la réalisation", null, (db) =>
    db
      .from("projects")
      .select(`${PROJECT_COLUMNS}, description, images:project_images(id, image_path, alt_text, caption, display_order)`)
      .eq("status", "published")
      .eq("slug", slug)
      .order("display_order", { referencedTable: "project_images" })
      .maybeSingle(),
  );
  if (!row) return null;

  return {
    ...toProject(row),
    description: row.description,
    images: row.images.flatMap((image) => {
      const url = storageUrl("projects", image.image_path);
      return url ? [{ id: image.id, url, alt: image.alt_text, caption: image.caption }] : [];
    }),
  };
}
