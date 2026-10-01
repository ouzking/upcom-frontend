import { m, type HTMLMotionProps } from "framer-motion";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EASE, fadeUp, staggerContainer } from "./variants";

const VIEWPORT = { once: true, amount: 0.2 } as const;

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Amplitude du déplacement vertical, en pixels. */
  y?: number;
};

/** Apparition au scroll (fondu + montée). */
export function Reveal({ delay = 0, y = 28, children, ...props }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...props}
    >
      {children}
    </m.div>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & { stagger?: number; delayChildren?: number };

/** Conteneur qui déclenche l'apparition échelonnée de ses <StaggerItem>. */
export function Stagger({ stagger = 0.08, delayChildren = 0, children, ...props }: StaggerProps) {
  return (
    <m.div variants={staggerContainer(stagger, delayChildren)} initial="hidden" whileInView="visible" viewport={VIEWPORT} {...props}>
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <m.div variants={fadeUp} {...props}>
      {children}
    </m.div>
  );
}

/**
 * Révélation d'image : rideau vertical + léger dézoom.
 * L'observation du viewport se fait sur un conteneur non découpé : Chrome exclut
 * de l'IntersectionObserver un élément entièrement masqué par `clip-path`.
 */
export function ImageReveal({ children, className, delay = 0, disabled = false }: { children: ReactNode; className?: string; delay?: number; disabled?: boolean }) {
  // `disabled` : image au-dessus de la ligne de flottaison, affichée sans effet (meilleur LCP).
  if (disabled) return <div className={cn("relative overflow-hidden", className)}>{children}</div>;
  return (
    <m.div initial="hidden" whileInView="visible" viewport={VIEWPORT} className={className}>
      <m.div
        className="relative h-full w-full overflow-hidden rounded-[inherit]"
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0%)" },
          visible: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease: EASE, delay } },
        }}
      >
        <m.div
          className="h-full w-full"
          variants={{ hidden: { scale: 1.18 }, visible: { scale: 1, transition: { duration: 1.5, ease: EASE, delay } } }}
        >
          {children}
        </m.div>
      </m.div>
    </m.div>
  );
}

interface SplitWordsProps {
  text: string;
  /** Mots (sans ponctuation) affichés dans le style d'accent. */
  accentWords?: readonly string[];
  accentClassName?: string;
  className?: string;
  delay?: number;
  /** Anime à l'affichage (hero) plutôt qu'à l'entrée dans le viewport. */
  immediate?: boolean;
}

const stripPunctuation = (word: string) => word.replace(/[.,;:!?«»"]/g, "").toLowerCase();

/** Titre révélé mot à mot. Le texte complet reste lisible par les lecteurs d'écran. */
export function SplitWords({ text, accentWords = [], accentClassName, className, delay = 0, immediate = false }: SplitWordsProps) {
  const accents = new Set(accentWords.map((word) => word.toLowerCase()));
  const words = text.split(" ");

  // Titres de haut de page : animation CSS déclenchée dès le premier rendu, sans
  // attendre le chargement de Framer Motion (meilleur LCP sur mobile).
  if (immediate) {
    return (
      <span className={cn("block", className)}>
        <span className="sr-only">{text}</span>
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.14em] mb-[-0.14em] align-bottom">
              <span
                className={cn("inline-block animate-word-rise", accents.has(stripPunctuation(word)) && accentClassName)}
                style={{ animationDelay: `${delay + index * 0.04}s` }}
              >
                {word}
              </span>
            </span>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    );
  }

  return (
    <m.span className={cn("block", className)} initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={staggerContainer(0.07, delay)}>
      <span className="sr-only">{text}</span>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.14em] mb-[-0.14em] align-bottom">
            <m.span
              className={cn("inline-block", accents.has(stripPunctuation(word)) && accentClassName)}
              variants={{
                hidden: { y: "110%" },
                visible: { y: "0%", transition: { duration: 1, ease: EASE } },
              }}
            >
              {word}
            </m.span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </m.span>
  );
}
