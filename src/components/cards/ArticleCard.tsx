import { Link } from "react-router";
import { SmartImage } from "@/components/media/SmartImage";
import { ROUTES } from "@/config/site";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { Article } from "@/types/domain";

/** Carte d'actualité — variante « feature » (grand format horizontal) ou standard. */
export function ArticleCard({ article, variant = "default", className }: { article: Article; variant?: "default" | "feature" | "compact"; className?: string }) {
  const date = <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>;

  if (variant === "compact") {
    return (
      <article className={cn("group", className)}>
        <Link to={ROUTES.article(article.slug)} className="grid grid-cols-[6.5rem_1fr] items-center gap-5 rounded-2xl py-2 sm:grid-cols-[8rem_1fr]">
          <SmartImage src={article.coverUrl} alt="" seed={article.id} className="aspect-square rounded-2xl" imgClassName="group-hover:scale-105" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {article.category?.name ? <span className="text-accent-deep">{article.category.name} · </span> : null}
              {date}
            </p>
            <h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
              {article.title}
            </h3>
          </div>
        </Link>
      </article>
    );
  }

  const feature = variant === "feature";
  return (
    <article className={cn("group", className)}>
      <Link to={ROUTES.article(article.slug)} className={cn("block", feature && "grid gap-8 lg:grid-cols-12 lg:items-center")}>
        <SmartImage
          src={article.coverUrl}
          alt=""
          seed={article.id}
          fallbackLabel={article.category?.name}
          className={cn("rounded-[1.75rem]", feature ? "aspect-[16/10] lg:col-span-7" : "aspect-[16/11]")}
          imgClassName="group-hover:scale-[1.04]"
          sizes={feature ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        />
        <div className={cn(feature ? "lg:col-span-5" : "mt-6")}>
          <p className="flex flex-wrap items-center gap-x-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {article.category ? <span className="text-accent-deep">{article.category.name}</span> : null}
            {date}
          </p>
          <h3 className={cn("mt-3 font-display font-semibold tracking-tight text-ink transition-colors group-hover:text-brand", feature ? "text-display-sm" : "text-xl leading-snug sm:text-2xl")}>
            {article.title}
          </h3>
          {article.excerpt ? <p className={cn("mt-3 text-muted", feature ? "text-lead" : "line-clamp-3")}>{article.excerpt}</p> : null}
          {article.authorName ? <p className="mt-5 text-sm font-semibold text-ink-soft">Par {article.authorName}</p> : null}
        </div>
      </Link>
    </article>
  );
}
