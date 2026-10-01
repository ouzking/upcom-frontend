import { AnimatePresence, m } from "framer-motion";
import { useMemo } from "react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { EASE } from "@/components/motion/variants";
import { Seo } from "@/components/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FilterPills, SearchInput } from "@/components/ui/Filters";
import { EmptyState, ErrorState, SkeletonGrid } from "@/components/ui/Feedback";
import { PRIMARY_CTA, ROUTES } from "@/config/site";
import { useExpertises, useProjects } from "@/hooks/queries";
import { useDebouncedValue, useHydratedSearchParams } from "@/hooks/ui";
import { cn } from "@/lib/cn";
import { normalize } from "@/lib/format";

export default function ProjectsPage() {
  const [params, setParams] = useHydratedSearchParams();
  const category = params.get("categorie") ?? "";
  const search = params.get("q") ?? "";
  const debouncedSearch = useDebouncedValue(search, 200);

  const { data: projects, isPending, isError, refetch } = useProjects();
  const { data: expertises = [] } = useExpertises();

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

  // Seuls les pôles ayant au moins une réalisation sont proposés comme filtre.
  const filterOptions = useMemo(() => {
    const used = new Set(projects?.map((project) => project.category?.slug).filter(Boolean));
    return [{ value: "", label: "Tous les projets" }, ...expertises.filter((expertise) => used.has(expertise.slug)).map((expertise) => ({ value: expertise.slug, label: expertise.shortName }))];
  }, [projects, expertises]);

  const filtered = useMemo(() => {
    const term = normalize(debouncedSearch);
    return (projects ?? []).filter((project) => {
      if (category && project.category?.slug !== category) return false;
      if (!term) return true;
      return normalize([project.title, project.excerpt, project.clientName, project.category?.name].filter(Boolean).join(" ")).includes(term);
    });
  }, [projects, category, debouncedSearch]);

  const hasProjects = (projects?.length ?? 0) > 0;

  return (
    <>
      <Seo
        title="Réalisations"
        description="Découvrez les réalisations d'UPCOM AGENCY & SERVICES : communication, création graphique, production audiovisuelle, événementiel."
        jsonLd={breadcrumbJsonLd([{ name: "Réalisations", path: ROUTES.projects }])}
      />
      <PageHero
        eyebrow="Portfolio"
        title="Nos réalisations."
        accentWords={["réalisations"]}
        intro="Une sélection de projets menés pour nos clients, du conseil stratégique à la production."
        crumbs={[{ label: "Réalisations" }]}
      />

      <section className="container-page py-16 sm:py-20" aria-labelledby="listing-title">
        <h2 id="listing-title" className="sr-only">
          {"Toutes les réalisations"}
        </h2>
        {isPending ? (
          <SkeletonGrid count={6} />
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : !hasProjects ? (
          <EmptyState
            title="Notre portfolio arrive bientôt en ligne."
            text="Les réalisations d'UPCOM seront présentées ici très prochainement. En attendant, parlons de votre projet."
            action={
              <ButtonLink to={PRIMARY_CTA.to} variant="primary" arrow>
                {PRIMARY_CTA.label}
              </ButtonLink>
            }
          />
        ) : (
          <>
            <div className="flex flex-col gap-5 border-b border-line pb-8 lg:flex-row lg:items-center lg:justify-between">
              <FilterPills label="Filtrer par pôle" options={filterOptions} value={category} onChange={(value) => update("categorie", value)} />
              <SearchInput label="Rechercher une réalisation" placeholder="Rechercher un projet, un client…" value={search} onChange={(value) => update("q", value)} />
            </div>

            <p className="mt-6 text-sm text-muted" aria-live="polite">
              {filtered.length} réalisation{filtered.length > 1 ? "s" : ""}
            </p>

            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-display-sm text-ink">Aucun projet ne correspond à votre recherche.</p>
                <Button variant="outline" className="mt-8" onClick={() => setParams({}, { replace: true, preventScrollReset: true })}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <m.ul layout className="mt-10 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {/* initial={false} : pas d'apparition animée au chargement (cartes visibles dès le HTML pré-rendu). */}
                <AnimatePresence mode="popLayout" initial={false}>
                  {filtered.map((project, index) => (
                    <m.li
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className={cn(index === 0 && !category && !search && "sm:col-span-2")}
                    >
                      <ProjectCard project={project} large={index === 0 && !category && !search} priority={index < 2} />
                    </m.li>
                  ))}
                </AnimatePresence>
              </m.ul>
            )}
          </>
        )}
      </section>

      <CtaBand />
    </>
  );
}
