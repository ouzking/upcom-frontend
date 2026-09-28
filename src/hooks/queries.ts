import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getArticleBySlug, listArticleCategories, listArticles, type ArticleListOptions } from "@/repositories/articles.repository";
import { getEventBySlug, listEvents } from "@/repositories/events.repository";
import { getProjectBySlug, listProjects } from "@/repositories/projects.repository";
import { getServiceBySlug, listExpertises, listServices } from "@/repositories/services.repository";
import type { ArticleDetail } from "@/types/domain";
import { DEFAULT_SITE_INFO, getSiteInfo } from "@/repositories/settings.repository";
import { listTeamMembers, listTestimonials } from "@/repositories/team.repository";

/**
 * Hooks de données du site. Les composants ne connaissent ni Supabase ni les
 * repositories : ils consomment ces hooks (cache, déduplication, états de chargement).
 */
export const queryKeys = {
  siteInfo: ["site-info"] as const,
  expertises: ["expertises"] as const,
  services: ["services"] as const,
  service: (slug: string) => ["services", slug] as const,
  projects: (featuredOnly: boolean) => ["projects", { featuredOnly }] as const,
  project: (slug: string) => ["project", slug] as const,
  articleCategories: ["article-categories"] as const,
  articles: (options: Omit<ArticleListOptions, "page">) => ["articles", options] as const,
  article: (slug: string) => ["article", slug] as const,
  events: ["events"] as const,
  event: (slug: string) => ["event", slug] as const,
  team: ["team"] as const,
  testimonials: ["testimonials"] as const,
};

export const useSiteInfo = () =>
  useQuery({ queryKey: queryKeys.siteInfo, queryFn: getSiteInfo, placeholderData: DEFAULT_SITE_INFO, staleTime: 30 * 60_000 });

export const useExpertises = () => useQuery({ queryKey: queryKeys.expertises, queryFn: listExpertises, staleTime: 30 * 60_000 });

export const useServices = () => useQuery({ queryKey: queryKeys.services, queryFn: listServices });

export const useService = (slug: string) =>
  useQuery({ queryKey: queryKeys.service(slug), queryFn: () => getServiceBySlug(slug), enabled: Boolean(slug) });

export const useProjects = (featuredOnly = false) =>
  useQuery({ queryKey: queryKeys.projects(featuredOnly), queryFn: () => listProjects({ featuredOnly }) });

export const useProject = (slug: string) =>
  useQuery({ queryKey: queryKeys.project(slug), queryFn: () => getProjectBySlug(slug), enabled: Boolean(slug) });

export const useArticleCategories = () =>
  useQuery({ queryKey: queryKeys.articleCategories, queryFn: listArticleCategories, staleTime: 30 * 60_000 });

/** Liste paginée (« Charger plus ») avec filtres serveur. */
export const useArticles = (options: Omit<ArticleListOptions, "page"> = {}) =>
  useInfiniteQuery({
    queryKey: queryKeys.articles(options),
    queryFn: ({ pageParam }) => listArticles({ ...options, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    placeholderData: keepPreviousData,
  });

/** Articles de la même catégorie (à défaut, les plus récents), hors article courant. */
export const useRelatedArticles = (article: ArticleDetail | null | undefined) =>
  useQuery({
    queryKey: ["articles", "related", article?.id],
    queryFn: () => listArticles({ pageSize: 3, excludeId: article?.id, categoryId: article?.categoryId }),
    enabled: Boolean(article),
  });

export const useArticle = (slug: string) =>
  useQuery({ queryKey: queryKeys.article(slug), queryFn: () => getArticleBySlug(slug), enabled: Boolean(slug) });

export const useEvents = () => useQuery({ queryKey: queryKeys.events, queryFn: () => listEvents() });

export const useEvent = (slug: string) =>
  useQuery({ queryKey: queryKeys.event(slug), queryFn: () => getEventBySlug(slug), enabled: Boolean(slug) });

export const useTeam = () => useQuery({ queryKey: queryKeys.team, queryFn: listTeamMembers });

export const useTestimonials = () => useQuery({ queryKey: queryKeys.testimonials, queryFn: listTestimonials });
