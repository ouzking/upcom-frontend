import { EXPERTISES, findExpertiseContent } from "@/content/expertises";
import { storageUrl } from "@/lib/storage";
import type { Expertise, ServiceItem } from "@/types/domain";
import { one, query } from "./client";

const staticExpertises = (): Expertise[] =>
  EXPERTISES.map((content, index) => ({ ...content, id: null, order: index }));

/**
 * Pôles d'activité publiés. La base décide de la liste, de l'ordre et des
 * textes saisis ; le contenu officiel complète les champs vides.
 */
export async function listExpertises(): Promise<Expertise[]> {
  const rows = await query("Chargement des pôles", [], (db) =>
    db
      .from("service_categories")
      .select("id, slug, name, description, icon, display_order")
      .eq("status", "published")
      .order("display_order"),
  );
  if (rows.length === 0) return staticExpertises();

  return rows.map((row, index) => {
    const content = findExpertiseContent(row.slug);
    const description = row.description?.trim() || content?.description || "";
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      shortName: content?.shortName ?? row.name,
      icon: row.icon || content?.icon || "sparkles",
      summary: content?.summary ?? description,
      description,
      offerings: content?.offerings ?? [],
      order: index,
    };
  });
}

const SERVICE_COLUMNS =
  "id, slug, title, short_description, description, icon, image_path, is_featured, category:service_categories(slug, name)" as const;

type ServiceRowWithCategory = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  icon: string | null;
  image_path: string | null;
  is_featured: boolean;
  category: { slug: string; name: string } | { slug: string; name: string }[] | null;
};

const toService = (row: ServiceRowWithCategory): ServiceItem => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  shortDescription: row.short_description,
  description: row.description,
  icon: row.icon,
  imageUrl: storageUrl("services", row.image_path),
  isFeatured: row.is_featured,
  category: one(row.category),
});

/** Prestations publiées (toutes catégories), dans l'ordre défini au back-office. */
export async function listServices(): Promise<ServiceItem[]> {
  const rows = await query("Chargement des services", [], (db) =>
    db.from("services").select(SERVICE_COLUMNS).eq("status", "published").order("display_order"),
  );
  return rows.map(toService);
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const row = await query("Chargement du service", null, (db) =>
    db.from("services").select(SERVICE_COLUMNS).eq("status", "published").eq("slug", slug).maybeSingle(),
  );
  return row ? toService(row) : null;
}
