import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Slashes } from "@/components/ui/Brand";
import { Accent, Eyebrow, SectionHeading } from "@/components/ui/Section";
import { ROUTES } from "@/config/site";
import { AUDIENCES } from "@/content/agency";
import { useExpertises } from "@/hooks/queries";
import { Approach } from "@/sections/home/Approach";
import { WhyUpcom } from "@/sections/home/WhyUpcom";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

const CHANNELS = [
  { title: "Supports numériques", items: ["Réseaux sociaux", "Contenus et publications", "Campagnes sponsorisées", "Newsletters", "Référencement et visibilité en ligne", "Bannières web"] },
  { title: "Supports traditionnels", items: ["Supports institutionnels", "Brochures et catalogues", "Flyers et affiches", "Packaging", "Impression et reprographie", "Salons et expositions"] },
] as const;

/** Savoir-faire transversal : pôles, supports, publics, méthode, engagements. */
export default function KnowHowPage() {
  const { data: expertises = [] } = useExpertises();

  return (
    <>
      <Seo
        title="Expertise"
        description="Le savoir-faire d'UPCOM : six pôles complémentaires, une maîtrise des supports numériques et traditionnels, une méthode éprouvée au service de tous les publics."
        jsonLd={breadcrumbJsonLd([{ name: "Expertise", path: ROUTES.know_how }])}
      />
      <PageHero
        eyebrow="Notre expertise"
        title="Un savoir-faire global, du conseil à la production."
        accentWords={["global"]}
        intro="UPCOM réunit les compétences nécessaires pour concevoir, produire et déployer votre communication, et vous accompagner dans le développement de vos projets."
        crumbs={[{ label: "Expertise" }]}
      />

      {/* Pôles */}
      <section className="py-24 sm:py-32" aria-labelledby="poles-title">
        <div className="container-page">
          <SectionHeading
            index="01"
            eyebrow="Domaines d'intervention"
            title={
              <span id="poles-title">
                Six pôles <Accent>complémentaires</Accent>.
              </span>
            }
          />
          <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {expertises.map((expertise, index) => {
              return (
                <StaggerItem key={expertise.slug}>
                  <Link
                    to={ROUTES.expertise(expertise.slug)}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white p-8 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_30px_60px_-30px_rgba(1,53,146,0.35)]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex size-14 items-center justify-center rounded-2xl bg-mist text-brand transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
                        <DynamicIcon name={expertise.icon} className="size-6" aria-hidden="true" />
                      </span>
                      <span className="font-display text-sm font-semibold tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-10 font-display text-2xl font-semibold leading-tight tracking-tight text-ink">{expertise.name}</h3>
                    <p className="mt-3 flex-1 text-muted">{expertise.summary}</p>
                    <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                      Explorer <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-accent transition-transform duration-500 ease-premium group-hover:scale-x-100" aria-hidden="true" />
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Supports */}
      <section className="relative isolate overflow-hidden bg-brand-night py-24 text-white sm:py-32" aria-labelledby="channels-title">
        <div className="absolute inset-0 -z-10 bg-noise" aria-hidden="true" />
        <div className="container-page">
          <SectionHeading
            index="02"
            eyebrow="Supports"
            tone="dark"
            title={
              <span id="channels-title">
                Numérique et traditionnel, <Accent tone="dark">une même cohérence</Accent>.
              </span>
            }
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {CHANNELS.map((channel, index) => (
              <Reveal key={channel.title} delay={index * 0.12} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 sm:p-10">
                <h3 className="font-display text-2xl font-semibold tracking-tight">{channel.title}</h3>
                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {channel.items.map((item) => (
                    <li key={item} className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/85">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Publics */}
      <section className="py-24 sm:py-32" aria-labelledby="audiences-title">
        <div className="container-page grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow index="03">Pour qui</Eyebrow>
            <h2 id="audiences-title" className="mt-5 text-display-md text-ink">
              Tous les publics, <Accent>une même exigence</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8" stagger={0.05}>
            {AUDIENCES.map((audience) => (
              <StaggerItem key={audience} className="flex items-center justify-between gap-4 border-b border-line py-5">
                <span className="font-display text-xl font-semibold tracking-tight text-ink">{audience}</span>
                <Slashes className="h-2.5 shrink-0 opacity-60" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Approach index="04" />
      <WhyUpcom index="05" />
      <CtaBand />
    </>
  );
}
