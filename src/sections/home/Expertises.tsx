import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { EASE } from "@/components/motion/variants";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Feedback";
import { Accent, SectionHeading } from "@/components/ui/Section";
import { ROUTES } from "@/config/site";
import { useExpertises } from "@/hooks/queries";
import { cn } from "@/lib/cn";
import type { Expertise } from "@/types/domain";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

const PREVIEW_COUNT = 6;

function ExpertiseDetails({ expertise, compact = false }: { expertise: Expertise; compact?: boolean }) {
  const preview = expertise.offerings.slice(0, PREVIEW_COUNT);
  const remaining = expertise.offerings.length - preview.length;

  return (
    <div>
      {!compact ? (
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-ink">
          <DynamicIcon name={expertise.icon} className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      {!compact ? <h3 className="mt-8 text-display-sm text-white">{expertise.name}</h3> : null}
      <p className={cn("leading-relaxed text-white/75", compact ? "text-base" : "mt-4 text-lg")}>{expertise.description}</p>
      {preview.length > 0 ? (
        <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {preview.map((offering) => (
            <li key={offering} className="flex gap-2.5 text-[0.95rem] text-white/90">
              <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
              {offering}
            </li>
          ))}
          {remaining > 0 ? (
            <li className="flex gap-2.5 text-[0.95rem] text-white/55">
              <Plus className="mt-1 size-4 shrink-0" aria-hidden="true" />
              {remaining} autre{remaining > 1 ? "s" : ""} prestation{remaining > 1 ? "s" : ""}
            </li>
          ) : null}
        </ul>
      ) : null}
      <ButtonLink to={ROUTES.expertise(expertise.slug)} variant="accent" arrow className="mt-9">
        Découvrir ce pôle
      </ButtonLink>
    </div>
  );
}

/**
 * Les six pôles. Desktop : liste typographique + panneau sticky piloté au survol.
 * Mobile / tablette : accordéon (un seul pôle ouvert).
 */
export function Expertises() {
  const { data: expertises, isPending } = useExpertises();
  const [active, setActive] = useState(0);
  const current = expertises?.[active];

  return (
    <section id="expertises" className="relative isolate overflow-hidden bg-brand-night py-24 text-white sm:py-32 lg:py-40" aria-labelledby="expertises-title">
      <div className="absolute inset-0 -z-10 bg-noise" aria-hidden="true" />
      <div className="absolute -left-[20%] top-0 -z-10 aspect-square w-[60rem] rounded-full bg-[radial-gradient(circle,rgba(1,114,231,0.25),transparent_60%)]" aria-hidden="true" />

      <div className="container-page">
        <SectionHeading
          index="03"
          eyebrow="Nos expertises"
          tone="dark"
          title={
            <span id="expertises-title">
              Six pôles d'expertise, <Accent tone="dark">une seule</Accent> exigence.
            </span>
          }
          intro="De la stratégie à la production, UPCOM réunit l'ensemble des métiers de la communication et des services aux organisations."
          aside={
            <Link to={ROUTES.services} className="inline-flex items-center gap-2 font-semibold text-white transition hover:text-accent">
              Tous nos services <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <ul className="lg:col-span-7">
            {isPending
              ? Array.from({ length: 6 }, (_, index) => (
                  <li key={index} className="border-t border-white/10 py-7">
                    <Skeleton className="h-9 w-2/3 bg-white/10" />
                  </li>
                ))
              : expertises?.map((expertise, index) => {
                  const isActive = index === active;
                  const panelId = `expertise-panel-${expertise.slug}`;
                  return (
                    <li key={expertise.slug} className="border-t border-white/10 last:border-b">
                      <button
                        type="button"
                        onClick={() => setActive(index)}
                        onMouseEnter={() => setActive(index)}
                        onFocus={() => setActive(index)}
                        aria-expanded={isActive}
                        aria-controls={panelId}
                        className="group flex w-full items-center gap-5 py-6 text-left sm:gap-8 sm:py-7"
                      >
                        <span className={cn("font-display text-sm font-semibold tabular-nums transition-colors", isActive ? "text-accent" : "text-white/40")}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "flex-1 font-display text-[clamp(1.5rem,3.2vw,2.6rem)] font-semibold leading-tight tracking-tight transition-all duration-500 ease-premium",
                            isActive ? "translate-x-1 text-white" : "text-white/45 group-hover:text-white/80",
                          )}
                        >
                          {expertise.name}
                        </span>
                        <ArrowUpRight
                          className={cn("size-6 shrink-0 transition-all duration-500 ease-premium", isActive ? "rotate-45 text-accent lg:rotate-0" : "text-white/30")}
                          aria-hidden="true"
                        />
                      </button>

                      {/* Accordéon mobile */}
                      <AnimatePresence initial={false}>
                        {isActive ? (
                          <m.div
                            id={panelId}
                            className="overflow-hidden lg:hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                          >
                            <div className="pb-10 pl-10 sm:pl-14">
                              <ExpertiseDetails expertise={expertise} compact />
                            </div>
                          </m.div>
                        ) : null}
                      </AnimatePresence>
                    </li>
                  );
                })}
          </ul>

          {/* Panneau desktop */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-32 min-h-[34rem] rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 backdrop-blur-sm xl:p-12">
              <AnimatePresence mode="wait">
                {current ? (
                  <m.div
                    key={current.slug}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <ExpertiseDetails expertise={current} />
                  </m.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
