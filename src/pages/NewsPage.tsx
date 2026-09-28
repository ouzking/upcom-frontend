import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { NewsTabs } from "@/components/layout/NewsTabs";
import { PageHero } from "@/components/layout/PageHero";
import { Stagger, StaggerItem } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, SkeletonGrid } from "@/components/ui/Feedback";
import { FilterPills, SearchInput } from "@/components/ui/Filters";
import { ROUTES } from "@/config/site";
import { useArticleCategories, useArticles } from "@/hooks/queries";
import { useDebouncedValue } from "@/hooks/ui";

export default function NewsPage() {
  const [params, setParams] = useSearchParams();
  const categorySlug = params.get("categorie") ?? "";
  const search = params.get("q") ?? "";
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const { data: categories = [] } = useArticleCategories();
  const categoryId = categories.find((category) => category.slug === categorySlug)?.id ?? null;
  const filtering = Boolean(categorySlug || debouncedSearch);

  const { data, isPending, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isPlaceholderData } = useArticles({
    pageSize: 9,
    categoryId,
    search: debouncedSearch,
  });
  const articles = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;
  const [lead, ...rest] = articles;

  const update = (key: string, value: string) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );

  const categoryOptions = [{ value: "", label: "Toutes" }, ...categories.map((category) => ({ value: category.slug, label: category.name }))];

  return (
    <>
      <Seo
        title="Actualités"
        description="Les actualités d'UPCOM AGENCY & SERVICES : projets, temps forts et coulisses de l'agence."
        jsonLd={breadcrumbJsonLd([{ name: "Actualités", path: ROUTES.news }])}
      />
      <PageHero eyebrow="Actualités" title="L'actualité de l'agence." accentWords={["l'agence"]} crumbs={[{ label: "Actualités" }]}>
        <NewsTabs />
      </PageHero>

      <section className="container-page py-16 sm:py-20" aria-label="Liste des actualités">
        <div className="flex flex-col gap-5 border-b border-line pb-8 lg:flex-row lg:items-center lg:justify-between">
          {categories.length > 0 ? <FilterPills label="Catégories" options={categoryOptions} value={categorySlug} onChange={(value) => update("categorie", value)} /> : <span />}
          <SearchInput label="Rechercher une actualité" placeholder="Rechercher un article…" value={search} onChange={(value) => update("q", value)} />
        </div>

        <div className="mt-12" aria-busy={isPlaceholderData}>
          {isPending ? (
            <SkeletonGrid count={6} />
          ) : isError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : !lead ? (
            filtering ? (
              <div className="py-20 text-center">
                <p className="text-display-sm text-ink">Aucun article ne correspond à votre recherche.</p>
                <Button variant="outline" className="mt-8" onClick={() => setParams({}, { replace: true, preventScrollReset: true })}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <EmptyState title="Les actualités d'UPCOM arrivent bientôt." text="Projets, coulisses et temps forts de l'agence seront publiés ici." />
            )
          ) : (
            <>
              <p className="mb-10 text-sm text-muted" aria-live="polite">
                {total} article{total > 1 ? "s" : ""}
              </p>
              {!filtering ? <ArticleCard article={lead} variant="feature" className="mb-20" /> : null}
              <Stagger className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" key={`${categorySlug}-${debouncedSearch}`}>
                {(filtering ? articles : rest).map((article) => (
                  <StaggerItem key={article.id}>
                    <ArticleCard article={article} />
                  </StaggerItem>
                ))}
              </Stagger>
              {hasNextPage ? (
                <div className="mt-16 flex justify-center">
                  <Button variant="outline" size="lg" onClick={() => void fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? "Chargement…" : "Charger plus d'articles"}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}
