import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { SmartImage } from "@/components/media/SmartImage";
import { ImageReveal } from "@/components/motion/primitives";
import { ROUTES } from "@/config/site";
import { findExpertiseContent } from "@/content/expertises";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/domain";

interface ProjectCardProps {
  project: Project;
  /** Format large (mise en avant dans une mosaïque). */
  large?: boolean;
  priority?: boolean;
  className?: string;
}

/** Carte portfolio : visuel dominant, métadonnées révélées au survol. */
export function ProjectCard({ project, large = false, priority = false, className }: ProjectCardProps) {
  const meta = [project.clientName, project.year].filter(Boolean).join(" · ");
  const icon = project.category ? findExpertiseContent(project.category.slug)?.icon : null;

  return (
    <article className={cn("group relative", className)}>
      <Link to={ROUTES.project(project.slug)} className="block rounded-[1.75rem] focus-visible:outline-offset-4">
        <ImageReveal className="rounded-[1.75rem]">
          <SmartImage
            src={project.coverUrl}
            alt={project.title}
            seed={project.id}
            priority={priority}
            fallbackIcon={icon}
            fallbackLabel={project.category?.name}
            sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className={cn("rounded-[1.75rem]", large ? "aspect-[4/3] lg:aspect-[16/11]" : "aspect-[4/3]")}
            imgClassName="group-hover:scale-[1.04]"
          />
        </ImageReveal>
        <span
          className="absolute right-5 top-5 flex size-12 scale-75 items-center justify-center rounded-full bg-white text-brand opacity-0 shadow-lg transition-all duration-500 ease-premium group-hover:scale-100 group-hover:opacity-100"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-5" />
        </span>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            {project.category ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-deep">{project.category.name}</p> : null}
            <h3 className={cn("mt-2 font-display font-semibold tracking-tight text-ink transition-colors group-hover:text-brand", large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl")}>
              {project.title}
            </h3>
            {project.excerpt && large ? <p className="mt-3 line-clamp-2 max-w-xl text-muted">{project.excerpt}</p> : null}
          </div>
          {meta ? <p className="shrink-0 pt-6 text-sm text-muted">{meta}</p> : null}
        </div>
      </Link>
    </article>
  );
}
