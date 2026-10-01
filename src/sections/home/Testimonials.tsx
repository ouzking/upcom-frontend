import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/primitives";
import { EASE } from "@/components/motion/variants";
import { Eyebrow } from "@/components/ui/Section";
import { useTestimonials } from "@/hooks/queries";

/**
 * Témoignages publiés depuis le back-office. La section n'existe que si au
 * moins un témoignage réel est publié : aucun contenu de substitution.
 */
export function Testimonials() {
  const { data: testimonials = [] } = useTestimonials();
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const current = testimonials[index % Math.max(count, 1)];
  if (!current) return null;

  const go = (delta: number) => setIndex((value) => (value + delta + count) % count);

  return (
    <section className="defer-render relative isolate overflow-hidden bg-brand py-24 text-white sm:py-32" aria-labelledby="testimonials-title" aria-roledescription="carrousel">
      <div className="absolute inset-0 -z-10 bg-noise" aria-hidden="true" />
      <Quote className="absolute -left-6 top-10 -z-10 size-72 text-white/[0.04]" aria-hidden="true" />
      <div className="container-page">
        <Reveal>
          <Eyebrow tone="dark">Ils témoignent</Eyebrow>
          <h2 id="testimonials-title" className="sr-only">
            Témoignages
          </h2>
        </Reveal>

        <div className="mt-10 min-h-[16rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <m.figure
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <blockquote className="max-w-5xl font-display text-[clamp(1.5rem,3vw,2.6rem)] font-medium leading-[1.25] tracking-tight">« {current.content} »</blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                {current.photoUrl ? <img src={current.photoUrl} alt={`Portrait de ${current.name}`} width={56} height={56} loading="lazy" className="size-14 rounded-full object-cover" /> : null}
                <div>
                  <p className="font-semibold">{current.name}</p>
                  <p className="text-sm text-white/70">{[current.role, current.company].filter(Boolean).join(" — ")}</p>
                </div>
              </figcaption>
            </m.figure>
          </AnimatePresence>
        </div>

        {count > 1 ? (
          <div className="mt-12 flex items-center gap-3">
            <button type="button" onClick={() => go(-1)} className="flex size-12 items-center justify-center rounded-full border border-white/25 transition hover:bg-white hover:text-brand" aria-label="Témoignage précédent">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} className="flex size-12 items-center justify-center rounded-full border border-white/25 transition hover:bg-white hover:text-brand" aria-label="Témoignage suivant">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <p className="ml-4 text-sm tabular-nums text-white/70">
              {(index % count) + 1} / {count}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
