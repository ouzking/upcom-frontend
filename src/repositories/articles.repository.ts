import { storageUrl } from "@/lib/storage";
import type { Article, ArticleCategory, ArticleDetail, Paginated } from "@/types/domain";
import { one, query, sanitizeSearch } from "./client";

const ARTICLE_COLUMNS =
  "id, slug, title, excerpt, cover_image_path, published_at, author_name, is_featured, category:article_categories(slug, name)" as const;

type ArticleRowWithCategory = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_path: string | null;
  published_at: string | null;
  author_name: string | null;
  is_featured: boolean;
  category: { slug: string; name: string } | { slug: string; name: string }[] | null;
};

const toArticle = (row: ArticleRowWithCategory): Article => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  coverUrl: storageUrl("articles", row.cover_image_path),
  // Garanti non nul pour un article publié (contrainte SQL), valeur de repli par sécurité.
  publishedAt: row.published_at ?? new Date(0).toISOString(),
  authorName: row.author_name,
  isFeatured: row.is_featured,
  category: one(row.category),
});

export async function listArticleCategories(): Promise<ArticleCategory[]> {
  return query("Chargement des catégories", [], (db) =>
    db.from("article_categories").select("id, slug, name").order("display_order"),
  );
}

export interface ArticleListOptions {
  page?: number;
  pageSize?: number;
  categoryId?: string | null;
  search?: string;
  excludeId?: string;
}

/**
 * Actualités publiées, paginées côté serveur. La RLS n'expose que les articles
 * dont la date de publication est atteinte (les articles programmés restent invisibles).
 */
export async function listArticles({
  page = 0,
  pageSize = 9,
  categoryId = null,
  search = "",
  excludeId,
}: ArticleListOptions = {}): Promise<Paginated<Article>> {
  const from = page * pageSize;
  const term = sanitizeSearch(search);

  const empty: { rows: ArticleRowWithCategory[]; count: number } = { rows: [], count: 0 };
  const result = await query(
    "Chargement des actualités",
    empty,
    async (db) => {
      let request = db
        .from("articles")
        .select(ARTICLE_COLUMNS, { count: "exact" })
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .range(from, from + pageSize - 1);
      if (categoryId) request = request.eq("category_id", categoryId);
      if (excludeId) request = request.neq("id", excludeId);
      if (term) request = request.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`);
      const { data, error, count } = await request;
      return { data: data ? { rows: data, count: count ?? data.length } : null, error };
    },
  );

  const total = result.count;
  return {
    items: result.rows.map(toArticle),
    total,
    nextPage: from + pageSize < total ? page + 1 : null,
  };
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const row = await query("Chargement de l'article", null, (db) =>
    db
      .from("articles")
      .select(`${ARTICLE_COLUMNS}, content, updated_at, category_id`)
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle(),
  );
  return row ? { ...toArticle(row), categoryId: row.category_id, content: row.content, updatedAt: row.updated_at } : null;
}
