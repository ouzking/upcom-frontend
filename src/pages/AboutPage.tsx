import { Check } from "lucide-react";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Logo, Orbits } from "@/components/ui/Brand";
import { Accent, Eyebrow, SectionHeading } from "@/components/ui/Section";
import { Seo } from "@/components/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ROUTES } from "@/config/site";
import { MISSION, OBJECTIVES, PRESENTATION, VALUES, VISION } from "@/content/agency";
import { Approach } from "@/sections/home/Approach";
import { TeamPreview } from "@/sections/home/TeamPreview";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export default function AboutPage() {
  return (
    <>
      <Seo
        title="À propos"
        description="UPCOM AGENCY & SERVICES : entreprise de communication et de prestations de services. Présentation, vision, mission, valeurs et approche."
        jsonLd={breadcrumbJsonLd([{ name: "À propos", path: ROUTES.about }])}
      />
      <PageHero
        eyebrow="À propos"
        title="Une agence au service de votre image."
        accentWords={["image"]}
        intro={PRESENTATION}
        crumbs={[{ label: "À propos" }]}
      />

      {/* Présentation */}
      <section className="py-24 sm:py-32" aria-labelledby="about-intro">
        <div className="container-page grid items-center gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow index="01">Qui sommes-nous</Eyebrow>
            <h2 id="about-intro" className="mt-5 text-display-md text-ink">
              Communication, création <Accent>et services</Accent>, réunis en une seule agence.
            </h2>
            <p className="mt-6 text-lead text-muted">
              UPCOM AGENCY &amp; SERVICES a pour vocation de proposer des solutions professionnelles, créatives et adaptées aux besoins de ses clients : communication, marketing,
              communication digitale, événementiel, conception graphique et accompagnement des organisations.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="relative lg:col-span-6">
            <div className="relative mx-auto aspect-square max-w-md">
              <Orbits className="absolute inset-0" />
              <div className="absolute inset-[18%] flex items-center justify-center rounded-full bg-mist p-10">
                <Logo large className="h-auto w-full" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="relative isolate overflow-hidden bg-brand-night py-24 text-white sm:py-32" aria-label="Vision et mission">
        <div className="absolute inset-0 -z-10 bg-noise" aria-hidden="true" />
        <div className="container-page grid gap-16 md:grid-cols-2 md:gap-10">
          {[
            { index: "02", label: "Notre vision", text: VISION },
            { index: "03", label: "Notre mission", text: MISSION },
          ].map((block, blockIndex) => (
            <Reveal key={block.label} delay={blockIndex * 0.15} className={blockIndex === 1 ? "md:border-l md:border-white/10 md:pl-10" : undefined}>
              <Eyebrow index={block.index} tone="dark">
                {block.label}
              </Eyebrow>
              <p className="mt-8 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-snug tracking-tight">{block.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 sm:py-32" aria-labelledby="values-title">
        <div className="container-page">
          <SectionHeading
            index="04"
            eyebrow="Nos valeurs"
            title={
              <span id="values-title">
                Ce qui guide <Accent>chacun</Accent> de nos projets.
              </span>
            }
          />
          <Stagger className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((value) => {
              return (
                <StaggerItem key={value.title} className="group bg-white p-8 transition-colors duration-500 hover:bg-brand lg:min-h-80">
                  <DynamicIcon name={value.icon} className="size-7 text-accent-deep transition-colors group-hover:text-accent" aria-hidden="true" />
                  <h3 className="mt-10 font-display text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-white">{value.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted transition-colors group-hover:text-white/80">{value.text}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Objectifs */}
      <section className="border-t border-line py-24 sm:py-32" aria-labelledby="objectives-title">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow index="05">Nos objectifs</Eyebrow>
            <h2 id="objectives-title" className="mt-5 text-display-md text-ink">
              Des ambitions <Accent>claires</Accent>.
            </h2>
          </Reveal>
          <Stagger className="lg:col-span-8" stagger={0.06}>
            {OBJECTIVES.map((objective) => (
              <StaggerItem key={objective} className="flex gap-5 border-b border-line py-5 first:border-t">
                <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-deep">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                <p className="text-lg text-ink">{objective}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Approach index="06" />
      <TeamPreview />
      <CtaBand />
    </>
  );
}
