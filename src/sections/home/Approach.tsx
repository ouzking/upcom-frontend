import { m } from "framer-motion";
import { ImageReveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { EASE } from "@/components/motion/variants";
import { Accent, SectionHeading } from "@/components/ui/Section";
import { APPROACH } from "@/content/agency";
import { cn } from "@/lib/cn";
import { StockPicture } from "@/components/media/StockPicture";
import { STOCK } from "@/content/media";

/** Méthode en quatre temps, reliée par une ligne qui se trace au défilement. */
export function Approach({ index = "04", className }: { index?: string; className?: string }) {
  return (
    <section className={cn("defer-render relative isolate overflow-hidden bg-mist py-24 sm:py-32 lg:py-40", className)} aria-labelledby="approach-title">
      <div className="absolute inset-0 -z-10 bg-grid opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" aria-hidden="true" />
      <div className="container-page">
        <SectionHeading
          index={index}
          eyebrow="Notre approche"
          title={
            <span id="approach-title">
              Une méthode claire, du premier échange <Accent>au suivi</Accent>.
            </span>
          }
          intro="Chaque projet suit un cheminement structuré pour garantir des solutions adaptées, livrées dans le respect des délais et des budgets."
        />

        <div className="relative mt-16 lg:mt-24">
          {/* Ligne de progression (desktop : horizontale, mobile : verticale) */}
          <m.div
            className="absolute left-0 right-0 top-7 hidden h-px origin-left bg-brand/25 lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.6, ease: EASE }}
            aria-hidden="true"
          />
          <m.div
            className="absolute bottom-0 left-7 top-0 w-px origin-top bg-brand/25 lg:hidden"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.6, ease: EASE }}
            aria-hidden="true"
          />

          <Stagger className="grid gap-12 lg:grid-cols-4 lg:gap-8" stagger={0.15}>
            {APPROACH.map((step, stepIndex) => (
              <StaggerItem key={step.title} className="relative pl-20 lg:pl-0">
                <span
                  className={cn(
                    "absolute left-0 top-0 flex size-14 items-center justify-center rounded-full border font-display text-lg font-bold lg:relative",
                    stepIndex === APPROACH.length - 1 ? "border-accent bg-accent text-ink" : "border-brand/20 bg-white text-brand",
                  )}
                >
                  {String(stepIndex + 1).padStart(2, "0")}
                </span>
                <h3 className="text-display-sm text-ink lg:mt-10">{step.title}</h3>
                <p className="mt-4 max-w-xs leading-relaxed text-muted">{step.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <ImageReveal className="mt-16 rounded-[2rem] lg:mt-24">
          <StockPicture image={STOCK.approche} sizes="(min-width: 1408px) 1300px, 100vw" className="aspect-[4/3] rounded-[2rem] sm:aspect-[21/8]" imgClassName="object-[50%_35%]" />
        </ImageReveal>
      </div>
    </section>
  );
}
