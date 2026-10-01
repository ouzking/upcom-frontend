import { ProjectCard } from "@/components/cards/ProjectCard";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { EmptyState, ErrorState, SkeletonGrid } from "@/components/ui/Feedback";
import { Accent, SectionHeading } from "@/components/ui/Section";
import { PRIMARY_CTA, ROUTES } from "@/config/site";
import { useProjects } from "@/hooks/queries";
import { cn } from "@/lib/cn";

/** Mosaïque asymétrique des réalisations mises en avant (données Supabase). */
export function FeaturedProjects() {
  const { data: projects, isPending, isError, refetch } = useProjects();
  const selection = projects?.slice(0, 4) ?? [];

  return (
    <section className="defer-render py-24 sm:py-32 lg:py-40" aria-labelledby="projects-title">
      <div className="container-page">
        <SectionHeading
          index="05"
          eyebrow="Réalisations"
          title={
            <span id="projects-title">
              Des projets conçus avec exigence, <Accent>de l'idée</Accent> à la livraison.
            </span>
          }
          aside={selection.length > 0 ? <TextLink to={ROUTES.projects}>Voir toutes les réalisations</TextLink> : null}
        />

        <div className="mt-16 lg:mt-20">
          {isPending ? (
            <SkeletonGrid count={2} className="lg:grid-cols-2" />
          ) : isError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : selection.length === 0 ? (
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
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-12">
              {selection.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  large={index === 0 || index === 3}
                  className={cn(
                    index === 0 && "md:col-span-7",
                    index === 1 && "md:col-span-5 md:mt-32",
                    index === 2 && "md:col-span-5",
                    index === 3 && "md:col-span-7 md:-mt-16",
                    selection.length === 1 && "md:col-span-12",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
