import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { TextLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { ROUTES } from "@/config/site";
import { AUDIENCES, MISSION, PRESENTATION } from "@/content/agency";

/** Mot dont l'opacité suit la progression du défilement. */
function ScrollWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.5, 1]);
  return (
    <>
      <m.span style={{ opacity }}>{word}</m.span>{" "}
    </>
  );
}

function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className="text-display-md font-semibold text-ink">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <ScrollWord key={`${word}-${index}`} word={word} progress={scrollYProgress} range={[index / words.length, (index + 1) / words.length]} />
        ))}
      </span>
    </p>
  );
}

export function Intro() {
  return (
    <section id="agence" className="defer-render relative py-24 sm:py-32 lg:py-40" aria-labelledby="intro-title">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Reveal>
            <Eyebrow index="02">L'agence</Eyebrow>
            <h2 id="intro-title" className="sr-only">
              Présentation d'UPCOM AGENCY &amp; SERVICES
            </h2>
          </Reveal>
        </div>

        <div className="lg:col-span-9">
          <ScrollText text={PRESENTATION} />

          <div className="mt-16 grid gap-12 border-t border-line pt-12 md:grid-cols-2 md:gap-16 lg:mt-24">
            <Reveal>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-ink">Notre vocation</h3>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">{MISSION}</p>
              <TextLink to={ROUTES.about} className="mt-8">
                Découvrir l'agence
              </TextLink>
            </Reveal>

            <div>
              <Reveal>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-ink">Pour qui ?</h3>
              </Reveal>
              <Stagger className="mt-5 grid sm:grid-cols-2 sm:gap-x-8" stagger={0.05}>
                {AUDIENCES.map((audience, index) => (
                  <StaggerItem key={audience} className="flex items-baseline gap-3 border-b border-line py-3.5">
                    <span className="font-display text-xs font-semibold tabular-nums text-brand/60">{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-semibold text-ink">{audience}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
