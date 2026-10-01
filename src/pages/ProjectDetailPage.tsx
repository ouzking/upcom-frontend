import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { Breadcrumbs } from "@/components/layout/PageHero";
import { Gallery } from "@/components/media/Gallery";
import { RichText } from "@/components/media/RichText";
import { SmartImage } from "@/components/media/SmartImage";
import { CssReveal, ImageReveal, SplitWords } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { absoluteUrl } from "@/lib/seo";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { Eyebrow } from "@/components/ui/Section";
import { ROUTES } from "@/config/site";
import { COMPANY } from "@/content/company";
import { findExpertiseContent } from "@/content/expertises";
import { useProject, useProjects } from "@/hooks/queries";
import NotFoundPage from "./NotFoundPage";

export default function ProjectDetailPage() {
  const { slug = "" } = useParams();
  const { data: project, isPending, isError, refetch } = useProject(slug);
  const { data: allProjects = [] } = useProjects();

  if (isPending) {
    return (
      <div className="container-page space-y-6 pb-24 pt-40">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-3/4" />
        <Skeleton className="aspect-[16/8]" />
      </div>
    );
  }
  if (isError) return <ErrorState className="container-page mb-24 mt-40" onRetry={() => void refetch()} />;
  if (!project) return <NotFoundPage />;

  const related = allProjects.filter((item) => item.id !== project.id && item.category?.slug === project.category?.slug).slice(0, 3);
  const facts = [
    { label: "Client", value: project.clientName },
    { label: "Pôle", value: project.category?.name, to: project.category ? ROUTES.expertise(project.category.slug) : undefined },
    { label: "Année", value: project.year?.toString() },
  ].filter((fact): fact is { label: string; value: string; to: string | undefined } => Boolean(fact.value));

  return (
    <>
      <Seo
        title={project.title}
        description={project.excerpt ?? `${project.title} — une réalisation ${COMPANY.name}.`}
        image={project.coverUrl}
        type="article"
        jsonLd={{
          "@type": "CreativeWork",
          name: project.title,
          description: project.excerpt ?? undefined,
          image: project.coverUrl ?? undefined,
          dateCreated: project.year ? String(project.year) : undefined,
          creator: { "@type": "Organization", name: COMPANY.name },
          url: absoluteUrl(ROUTES.project(project.slug)),
        }}
      />

      <article>
        <header className="container-page pb-12 pt-32 sm:pt-40">
          <Breadcrumbs items={[{ label: "Réalisations", to: ROUTES.projects }, { label: project.title }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              {project.category ? <Eyebrow>{project.category.name}</Eyebrow> : null}
              <h1 className="mt-6 text-display-lg text-ink">
                <SplitWords text={project.title} immediate delay={0.1} />
              </h1>
            </div>
            {project.excerpt ? (
              <CssReveal delay={0.3} className="lg:col-span-4">
                <p className="text-lead text-muted">{project.excerpt}</p>
              </CssReveal>
            ) : null}
          </div>
        </header>

        <div className="container-page">
          <ImageReveal disabled className="rounded-[2rem]">
            <SmartImage
              src={project.coverUrl}
              alt={project.title}
              priority
              seed={project.id}
              fallbackIcon={project.category ? findExpertiseContent(project.category.slug)?.icon : null}
              fallbackLabel={project.category?.name}
              className="aspect-[4/3] rounded-[2rem] sm:aspect-[16/8]"
              sizes="100vw"
            />
          </ImageReveal>
        </div>

        <div className="container-page grid gap-14 py-20 sm:py-28 lg:grid-cols-12">
          {facts.length > 0 ? (
            <aside className="lg:col-span-3" aria-label="Informations sur le projet">
              <dl className="space-y-6 lg:sticky lg:top-32">
                {facts.map((fact) => (
                  <div key={fact.label} className="border-t border-line pt-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{fact.label}</dt>
                    <dd className="mt-2 font-display text-lg font-semibold text-ink">
                      {fact.to ? (
                        <Link to={fact.to} className="transition hover:text-brand">
                          {fact.value}
                        </Link>
                      ) : (
                        fact.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          ) : null}
          <div className={facts.length > 0 ? "lg:col-span-8 lg:col-start-5" : "mx-auto max-w-3xl lg:col-span-12"}>
            <RichText content={project.description} videoTitle={project.title} />
          </div>
        </div>

        {project.images.length > 0 ? (
          <section className="container-page pb-24" aria-labelledby="gallery-title">
            <h2 id="gallery-title" className="mb-10 text-display-sm text-ink">
              Galerie
            </h2>
            <Gallery images={project.images} title={project.title} />
          </section>
        ) : null}
      </article>

      {related.length > 0 ? (
        <section className="border-t border-line py-24" aria-labelledby="related-title">
          <div className="container-page">
            <h2 id="related-title" className="text-display-sm text-ink">
              Dans le même pôle
            </h2>
            <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="container-page">
        <Link to={ROUTES.projects} className="inline-flex items-center gap-2 font-semibold text-brand hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" /> Toutes les réalisations
        </Link>
      </div>
      <CtaBand />
    </>
  );
}
