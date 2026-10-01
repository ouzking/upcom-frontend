import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { SplitWords } from "@/components/motion/primitives";
import { Orbits } from "@/components/ui/Brand";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Fil d'Ariane" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <li>
          <Link to="/" className="transition hover:text-brand">
            Accueil
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 opacity-50" aria-hidden="true" />
            {item.to && index < items.length - 1 ? (
              <Link to={item.to} className="transition hover:text-brand">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="line-clamp-1 font-semibold text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Mots du titre en serif italique. */
  accentWords?: readonly string[];
  intro?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
  className?: string;
}

/** En-tête des pages intérieures : clair, typographique, orbite en filigrane. */
export function PageHero({ eyebrow, title, accentWords, intro, crumbs, children, className }: PageHeroProps) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-mist pb-16 pt-32 sm:pb-20 sm:pt-40 lg:pb-24", className)}>
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" aria-hidden="true" />
      <Orbits className="absolute -right-40 -top-32 -z-10 hidden size-[40rem] opacity-70 md:block" />
      <div className="container-page">
        <Breadcrumbs items={crumbs} />
        {/* Animations CSS : contenu visible dès l'affichage de la page pré-rendue (sans attendre le JavaScript). */}
        <div className="mt-10 animate-fade-up">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-6 max-w-5xl text-display-lg text-ink">
          <SplitWords text={title} accentWords={accentWords} accentClassName="text-brand" immediate delay={0.1} />
        </h1>
        {intro ? (
          <div className="mt-8 max-w-2xl animate-fade-up text-lead text-muted" style={{ animationDelay: "0.2s" }}>
            {intro}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
