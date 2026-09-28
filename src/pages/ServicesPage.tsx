import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Feedback";
import { ROUTES } from "@/config/site";
import { useExpertises, useServices } from "@/hooks/queries";
import { cn } from "@/lib/cn";
import type { Expertise, ServiceItem } from "@/types/domain";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

function ExpertiseRow({ expertise, index, services }: { expertise: Expertise; index: number; services: ServiceItem[] }) {
  const reversed = index % 2 === 1;

  return (
    <section id={expertise.slug} className="scroll-mt-40 border-t border-line py-16 sm:py-20" aria-labelledby={`${expertise.slug}-title`}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className={cn("lg:col-span-5", reversed && "lg:order-2 lg:col-start-8")}>
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-semibold tabular-nums text-accent-deep">{String(index + 1).padStart(2, "0")}</span>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-white">
              <DynamicIcon name={expertise.icon} className="size-5" aria-hidden="true" />
            </span>
          </div>
          <h2 id={`${expertise.slug}-title`} className="mt-8 text-display-md text-ink">
            {expertise.name}
          </h2>
          <p className="mt-5 text-lead text-muted">{expertise.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={ROUTES.expertise(expertise.slug)} variant="primary" arrow>
              Voir le détail
            </ButtonLink>
            <ButtonLink to={`${ROUTES.quote}?besoin=${expertise.slug}`} variant="outline">
              Demander un devis
            </ButtonLink>
          </div>
        </Reveal>

        <div className={cn("lg:col-span-7", reversed && "lg:order-1 lg:col-start-1")}>
          {expertise.offerings.length > 0 ? (
            <Stagger className="grid gap-x-8 sm:grid-cols-2" stagger={0.04}>
              {expertise.offerings.map((offering) => (
                <StaggerItem key={offering} className="flex items-center gap-3 border-b border-line py-4">
                  <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="font-medium text-ink">{offering}</span>
                </StaggerItem>
              ))}
            </Stagger>
          ) : null}

          {services.length > 0 ? (
            <Reveal className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Prestations détaillées</h3>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      to={ROUTES.service(expertise.slug, service.slug)}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                    >
                      {service.title}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  const { data: expertises, isPending } = useExpertises();
  const { data: services = [] } = useServices();

  return (
    <>
      <Seo
        title="Services"
        description="Communication stratégique, communication digitale, identité visuelle & création graphique, production audiovisuelle, événementiel et services aux entreprises."
        jsonLd={breadcrumbJsonLd([{ name: "Services", path: ROUTES.services }])}
      />
      <PageHero
        eyebrow="Nos services"
        title="Des solutions complètes pour communiquer, créer et se développer."
        accentWords={["créer"]}
        intro="Six pôles complémentaires pour accompagner particuliers, entreprises, institutions et organisations, de la stratégie à la réalisation."
        crumbs={[{ label: "Services" }]}
      />

      {/* Sommaire des pôles (ancre) */}
      <nav className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl" aria-label="Pôles d'activité">
        <ul className="container-page scrollbar-none flex gap-2 overflow-x-auto py-3">
          {expertises?.map((expertise, index) => (
            <li key={expertise.slug} className="shrink-0">
              <a href={`#${expertise.slug}`} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-mist hover:text-brand">
                <span className="text-xs tabular-nums text-accent-deep">{String(index + 1).padStart(2, "0")}</span>
                {expertise.shortName}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-page pb-8 pt-8">
        {isPending
          ? Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="my-10 h-72" />)
          : expertises?.map((expertise, index) => (
              <ExpertiseRow key={expertise.slug} expertise={expertise} index={index} services={services.filter((service) => service.category?.slug === expertise.slug)} />
            ))}
      </div>

      <CtaBand />
    </>
  );
}
