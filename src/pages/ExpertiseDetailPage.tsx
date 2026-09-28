import { ArrowUpRight, Check } from "lucide-react";
import { Link, useParams } from "react-router";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { SmartImage } from "@/components/media/SmartImage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Feedback";
import { Accent, Eyebrow, SectionHeading } from "@/components/ui/Section";
import { ROUTES } from "@/config/site";
import { COMPANY } from "@/content/company";
import { useExpertises, useProjects, useServices } from "@/hooks/queries";
import NotFoundPage from "./NotFoundPage";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export default function ExpertiseDetailPage() {
  const { expertiseSlug = "" } = useParams();
  const { data: expertises, isPending } = useExpertises();
  const { data: services = [] } = useServices();
  const { data: projects = [] } = useProjects();

  if (isPending) {
    return (
      <div className="container-page space-y-6 pb-24 pt-40">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-3/4" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  const index = expertises?.findIndex((item) => item.slug === expertiseSlug) ?? -1;
  const expertise = expertises?.[index];
  if (!expertise) return <NotFoundPage />;

  const poleServices = services.filter((service) => service.category?.slug === expertise.slug);
  const poleProjects = projects.filter((project) => project.category?.slug === expertise.slug).slice(0, 3);
  const others = expertises?.filter((item) => item.slug !== expertise.slug) ?? [];
  const quoteLink = `${ROUTES.quote}?besoin=${expertise.slug}`;

  return (
    <>
      <Seo
        title={expertise.name}
        description={expertise.description}
        jsonLd={{
          "@type": "Service",
          name: expertise.name,
          description: expertise.description,
          serviceType: expertise.name,
          provider: { "@type": "ProfessionalService", name: COMPANY.name, telephone: COMPANY.phones[0], address: COMPANY.address },
          url: absoluteUrl(ROUTES.expertise(expertise.slug)),
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: expertise.name,
            itemListElement: expertise.offerings.map((offering) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: offering } })),
          },
          breadcrumb: breadcrumbJsonLd([
            { name: "Services", path: ROUTES.services },
            { name: expertise.name, path: ROUTES.expertise(expertise.slug) },
          ]),
        }}
      />
      <PageHero
        eyebrow={`Pôle ${String(index + 1).padStart(2, "0")}`}
        title={expertise.name}
        intro={expertise.description}
        crumbs={[{ label: "Services", to: ROUTES.services }, { label: expertise.name }]}
      >
        <Reveal delay={0.45} className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to={quoteLink} variant="accent" size="lg" arrow>
            Démarrer un projet
          </ButtonLink>
          <ButtonLink to={ROUTES.contact} variant="outline" size="lg">
            Nous contacter
          </ButtonLink>
        </Reveal>
      </PageHero>

      {/* Prestations */}
      <section className="py-24 sm:py-32" aria-labelledby="offerings-title">
        <div className="container-page grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-brand text-white">
              <DynamicIcon name={expertise.icon} className="size-7" aria-hidden="true" />
            </span>
            <Eyebrow className="mt-10">Ce que nous proposons</Eyebrow>
            <h2 id="offerings-title" className="mt-5 text-display-md text-ink">
              Nos <Accent>prestations</Accent>
            </h2>
          </Reveal>
          <Stagger className="grid content-start gap-x-10 sm:grid-cols-2 lg:col-span-8" stagger={0.05}>
            {expertise.offerings.map((offering) => (
              <StaggerItem key={offering} className="flex items-start gap-4 border-b border-line py-5">
                <Check className="mt-1 size-5 shrink-0 text-accent-deep" aria-hidden="true" />
                <span className="text-lg font-medium text-ink">{offering}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Prestations détaillées (back-office) */}
      {poleServices.length > 0 ? (
        <section className="bg-mist py-24 sm:py-32" aria-labelledby="services-title">
          <div className="container-page">
            <SectionHeading eyebrow="En détail" title={<span id="services-title">Découvrez nos offres</span>} />
            <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {poleServices.map((service) => (
                <StaggerItem key={service.id}>
                  <Link to={ROUTES.service(expertise.slug, service.slug)} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(1,53,146,0.35)]">
                    <SmartImage src={service.imageUrl} alt="" seed={service.id} fallbackIcon={service.icon ?? expertise.icon} className="aspect-[16/10]" imgClassName="group-hover:scale-105" />
                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="font-display text-xl font-semibold tracking-tight text-ink group-hover:text-brand">{service.title}</h3>
                      {service.shortDescription ? <p className="mt-3 line-clamp-3 text-muted">{service.shortDescription}</p> : null}
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand">
                        En savoir plus <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* Réalisations liées */}
      {poleProjects.length > 0 ? (
        <section className="py-24 sm:py-32" aria-labelledby="related-projects">
          <div className="container-page">
            <SectionHeading
              eyebrow="Réalisations"
              title={<span id="related-projects">Nos projets en {expertise.shortName.toLowerCase()}</span>}
              aside={<TextLink to={`${ROUTES.projects}?categorie=${expertise.slug}`}>Voir tout</TextLink>}
            />
            <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {poleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Autres pôles */}
      <section className="border-t border-line py-20" aria-labelledby="other-expertises">
        <div className="container-page">
          <h2 id="other-expertises" className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Nos autres expertises
          </h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {others.map((other) => {
              return (
                <li key={other.slug}>
                  <Link to={ROUTES.expertise(other.slug)} className="group flex h-full flex-col gap-6 bg-white p-6 transition-colors hover:bg-brand">
                    <DynamicIcon name={other.icon} className="size-6 text-brand transition-colors group-hover:text-accent" aria-hidden="true" />
                    <span className="font-display text-lg font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-white">{other.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBand to={quoteLink} title={`Un projet en ${expertise.shortName.toLowerCase()} ? Parlons-en.`} />
    </>
  );
}
