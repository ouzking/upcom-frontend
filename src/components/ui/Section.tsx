import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/primitives";
import { cn } from "@/lib/cn";

/** Sur-titre de section : index éditorial + libellé. */
export function Eyebrow({ index, children, tone = "light", className }: { index?: string; children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3 text-[0.78rem] font-semibold uppercase tracking-[0.22em]",
        tone === "light" ? "text-brand" : "text-white/75",
        className,
      )}
    >
      {index ? <span className={cn("font-display tabular-nums", tone === "light" ? "text-accent-deep" : "text-accent")}>{index}</span> : null}
      {index ? <span className={cn("h-px w-8", tone === "light" ? "bg-brand/30" : "bg-white/30")} aria-hidden="true" /> : null}
      <span>{children}</span>
    </p>
  );
}

interface SectionHeadingProps {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  /** Élément aligné à droite du titre (lien « voir tout »…). */
  aside?: ReactNode;
  headingLevel?: "h1" | "h2";
}

export function SectionHeading({ index, eyebrow, title, intro, tone = "light", align = "left", className, aside, headingLevel = "h2" }: SectionHeadingProps) {
  const Heading = headingLevel;
  return (
    <div className={cn("flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between", align === "center" && "items-center text-center lg:flex-col lg:items-center", className)}>
      <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        <Eyebrow index={index} tone={tone}>
          {eyebrow}
        </Eyebrow>
        <Heading className={cn("mt-5 text-display-md", tone === "light" ? "text-ink" : "text-white")}>{title}</Heading>
        {intro ? <p className={cn("mt-5 max-w-2xl text-lead", tone === "light" ? "text-muted" : "text-white/75", align === "center" && "mx-auto")}>{intro}</p> : null}
      </Reveal>
      {aside ? <Reveal delay={0.15} className="shrink-0">{aside}</Reveal> : null}
    </div>
  );
}

/** Mot d'accent d'un titre, mis en valeur par la couleur (bleu sur fond clair, orange sur fond sombre). */
export function Accent({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return <span className={cn(tone === "light" ? "text-brand" : "text-accent", className)}>{children}</span>;
}
