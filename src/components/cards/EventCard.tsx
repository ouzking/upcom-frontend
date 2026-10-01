import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@/config/site";
import { cn } from "@/lib/cn";
import { dateParts, formatDateRange } from "@/lib/format";
import type { EventItem } from "@/types/domain";

/** Ligne d'événement : bloc date typographique, lecture façon programme. */
export function EventCard({ event, past = false, tone = "light", className }: { event: EventItem; past?: boolean; tone?: "light" | "dark"; className?: string }) {
  const { day, month, year } = dateParts(event.startsAt);
  const dark = tone === "dark";

  return (
    <article className={cn("group", className)}>
      <Link
        to={ROUTES.event(event.slug)}
        className={cn(
          "grid grid-cols-[4.5rem_1fr_auto] items-center gap-5 border-t py-6 transition-colors sm:grid-cols-[6rem_1fr_auto] sm:gap-8",
          dark ? "border-white/15" : "border-line",
        )}
      >
        <time dateTime={event.startsAt} className={cn("flex flex-col font-display leading-none", past && "opacity-60")}>
          <span className={cn("text-4xl font-bold tracking-tight sm:text-5xl", dark ? "text-white" : "text-brand")}>{day}</span>
          <span className={cn("mt-1 text-xs font-semibold uppercase tracking-[0.18em]", dark ? "text-accent" : "text-accent-ink")}>
            {month} {year}
          </span>
        </time>
        <div className="min-w-0">
          <h3 className={cn("font-display text-lg font-semibold leading-snug tracking-tight transition-colors sm:text-xl", dark ? "text-white group-hover:text-accent" : "text-ink group-hover:text-brand")}>
            {event.title}
          </h3>
          <p className={cn("mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm", dark ? "text-white/65" : "text-muted")}>
            <span>{formatDateRange(event.startsAt, event.endsAt)}</span>
            {event.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden="true" />
                {event.location}
              </span>
            ) : null}
          </p>
        </div>
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-full border transition-all duration-500 ease-premium group-hover:rotate-45",
            dark ? "border-white/20 text-white group-hover:border-accent group-hover:bg-accent group-hover:text-ink" : "border-line text-brand group-hover:border-brand group-hover:bg-brand group-hover:text-white",
          )}
          aria-hidden="true"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </Link>
    </article>
  );
}
