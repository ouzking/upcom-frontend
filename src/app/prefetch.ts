import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries";
import { getArticleBySlug, listArticleCategories, listArticles, type ArticleListOptions } from "@/repositories/articles.repository";
import { getEventBySlug, listEvents } from "@/repositories/events.repository";
import { getProjectBySlug, listProjects } from "@/repositories/projects.repository";
import { getServiceBySlug, listExpertises, listServices } from "@/repositories/services.repository";
import { getSiteInfo } from "@/repositories/settings.repository";
import { listTeamMembers, listTestimonials } from "@/repositories/team.repository";

/**
 * Données préchargées au pré-rendu, par route. Les clés et fonctions sont celles
 * des hooks (hooks/queries.ts) : le navigateur réutilise ces données à
 * l'hydratation, sans nouvelle requête ni « flash » de chargement.
 * Renvoie les clés préchargées (pour n'embarquer que celles-ci dans la page).
 */
export async function prefetchRoute(client: QueryClient, pathname: string): Promise<readonly unknown[][]> {
  const keys: unknown[][] = [];
  const tasks: Promise<unknown>[] = [];

  const query = (queryKey: readonly unknown[], queryFn: () => Promise<unknown>) => {
    keys.push([...queryKey]);
    tasks.push(client.prefetchQuery({ queryKey, queryFn }));
  };
  const articles = (options: Omit<ArticleListOptions, "page">) => {
    const queryKey = queryKeys.articles(options);
    keys.push([...queryKey]);
    tasks.push(
      client.prefetchInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => listArticles({ ...options, page: pageParam }),
        initialPageParam: 0,
      }),
    );
  };

  // Communs à toutes les pages (en-tête, pied de page, bandeau d'appel à l'action).
  query(queryKeys.siteInfo, getSiteInfo);
  query(queryKeys.expertises, listExpertises);

  const [section = "", slug, subSlug] = pathname.split("/").filter(Boolean);
  switch (section) {
    case "":
      query(queryKeys.projects(false), () => listProjects({ featuredOnly: false }));
      query(queryKeys.team, listTeamMembers);
      query(queryKeys.testimonials, listTestimonials);
      query(queryKeys.events, () => listEvents());
      articles({ pageSize: 3 });
      break;
    case "a-propos":
    case "equipe":
      query(queryKeys.team, listTeamMembers);
      break;
    case "services":
      query(queryKeys.services, listServices);
      if (slug && !subSlug) query(queryKeys.projects(false), () => listProjects({ featuredOnly: false }));
      if (subSlug) query(queryKeys.service(subSlug), () => getServiceBySlug(subSlug));
      break;
    case "realisations":
      query(queryKeys.projects(false), () => listProjects({ featuredOnly: false }));
      if (slug) query(queryKeys.project(slug), () => getProjectBySlug(slug));
      break;
    case "actualites":
      if (slug) query(queryKeys.article(slug), () => getArticleBySlug(slug));
      else {
        query(queryKeys.articleCategories, listArticleCategories);
        articles({ pageSize: 9, categoryId: null, search: "" });
      }
      break;
    case "evenements":
      if (slug) query(queryKeys.event(slug), () => getEventBySlug(slug));
      else query(queryKeys.events, () => listEvents());
      break;
    case "demarrer-un-projet":
      query(queryKeys.services, listServices);
      break;
  }

  await Promise.all(tasks);
  return keys;
}
