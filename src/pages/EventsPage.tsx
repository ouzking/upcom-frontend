import { MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { EventCard } from "@/components/cards/EventCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { NewsTabs } from "@/components/layout/NewsTabs";
import { PageHero } from "@/components/layout/PageHero";
import { SmartImage } from "@/components/media/SmartImage";
import { ImageReveal } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/Feedback";
import { FilterPills } from "@/components/ui/Filters";
import { ROUTES } from "@/config/site";
import { useEvents } from "@/hooks/queries";
import { dateParts, formatDateRange } from "@/lib/format";
import { isUpcoming } from "@/repositories/events.repository";
import type { EventItem } from "@/types/domain";
import { STOCK } from "@/content/media";

function FeaturedEvent({ event }: { event: EventItem }) {
  const { day, month, year } = dateParts(event.startsAt);
  return (
    <div>
      <Link to={ROUTES.event(event.slug)} className="group grid overflow-hidden rounded-[2rem] bg-brand-night text-white lg:grid-cols-12">
        <ImageReveal disabled className="lg:col-span-7">
          <SmartImage src={event.coverUrl} alt={event.title} seed={event.id} fallbackIcon="calendar-range" className="aspect-[16/10] h-full" imgClassName="group-hover:scale-[1.03]" priority />
        </ImageReveal>
        <div className="flex flex-col justify-between gap-10 p-8 sm:p-12 lg:col-span-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Prochain rendez-vous</p>
            <h2 className="mt-5 text-display-sm transition-colors group-hover:text-accent">{event.title}</h2>
            {event.excerpt ? <p className="mt-4 line-clamp-3 text-white/70">{event.excerpt}</p> : null}
          </div>
          <div className="flex items-end justify-between gap-6 border-t border-white/15 pt-6">
            <time dateTime={event.startsAt} className="font-display leading-none">
              <span className="block text-6xl font-bold tracking-tight">{day}</span>
              <span className="mt-2 block text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {month} {year}
              </span>
            </time>
            <div className="text-right text-sm text-white/70">
              <p>{formatDateRange(event.startsAt, event.endsAt)}</p>
              {event.location ? (
                <p className="mt-1 inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {event.location}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function EventsPage() {
  const { data: events = [], isPending, isError, refetch } = useEvents();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const upcoming = events.filter((event) => isUpcoming(event));
  const past = events.filter((event) => !isUpcoming(event)).reverse();
  const list = tab === "upcoming" ? upcoming : past;
  const [featured, ...others] = list;

  return (
    <>
      <Seo
        title="Événements"
        description="L'agenda des événements UPCOM AGENCY & SERVICES : conférences, séminaires, lancements, cérémonies et salons."
        jsonLd={breadcrumbJsonLd([{ name: "Événements", path: ROUTES.events }])}
      />
      <PageHero
        eyebrow="Événements"
        image={STOCK.pageEvenements}
        title="Les rendez-vous UPCOM."
        accentWords={["rendez-vous"]}
        intro="Conférences, séminaires, lancements, cérémonies, salons : retrouvez les événements organisés ou accompagnés par UPCOM."
        crumbs={[{ label: "Événements" }]}
      >
        <NewsTabs />
      </PageHero>

      <section className="container-page py-16 sm:py-20" aria-label="Agenda">
        {isPending ? (
          <Skeleton className="aspect-[16/7]" />
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : events.length === 0 ? (
          <EmptyState title="Aucun événement publié pour le moment." text="Les prochains rendez-vous d'UPCOM seront annoncés ici." />
        ) : (
          <>
            <div className="mb-12">
              <FilterPills
                label="Période"
                value={tab}
                onChange={(value) => setTab(value === "past" ? "past" : "upcoming")}
                options={[
                  { value: "upcoming", label: `À venir (${upcoming.length})` },
                  { value: "past", label: `Passés (${past.length})` },
                ]}
              />
            </div>
            {!featured ? (
              <p className="py-16 text-center text-lead text-muted">{tab === "upcoming" ? "Aucun événement à venir pour le moment." : "Aucun événement passé."}</p>
            ) : (
              <>
                {tab === "upcoming" ? <FeaturedEvent event={featured} /> : <EventCard event={featured} past />}
                <div className={tab === "upcoming" ? "mt-16" : undefined}>
                  {others.map((event) => (
                    <EventCard key={event.id} event={event} past={tab === "past"} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
      <CtaBand title="Un événement à organiser ? Parlons-en." to={`${ROUTES.quote}?besoin=evenementiel`} />
    </>
  );
}
