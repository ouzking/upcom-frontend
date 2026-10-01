import { ArrowLeft, CalendarPlus, Clock, MapPin } from "lucide-react";
import { Link, useParams } from "react-router";
import { CtaBand } from "@/components/layout/CtaBand";
import { Breadcrumbs } from "@/components/layout/PageHero";
import { RichText } from "@/components/media/RichText";
import { SmartImage } from "@/components/media/SmartImage";
import { ImageReveal, Reveal, SplitWords } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { absoluteUrl } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { Eyebrow } from "@/components/ui/Section";
import { ROUTES } from "@/config/site";
import { COMPANY } from "@/content/company";
import { useEvent } from "@/hooks/queries";
import { dateParts, formatDateRange, formatTime } from "@/lib/format";
import { isUpcoming } from "@/repositories/events.repository";
import type { EventDetail } from "@/types/domain";
import NotFoundPage from "./NotFoundPage";

const icsDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsEscape = (text: string) => text.replace(/[\\;,]/g, (char) => `\\${char}`).replace(/\n/g, "\\n");

/** Génère un fichier .ics (compatible Google Agenda, Outlook, Apple Calendrier). */
function downloadIcs(event: EventDetail, url: string) {
  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : new Date(start.getTime() + 2 * 3600_000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UPCOM AGENCY & SERVICES//Site//FR",
    "BEGIN:VEVENT",
    `UID:${event.id}@upcom`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsEscape(event.title)}`,
    event.location ? `LOCATION:${icsEscape(event.location)}` : "",
    `DESCRIPTION:${icsEscape(`${event.excerpt ?? ""}\n${url}`.trim())}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${event.slug}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function EventDetailPage() {
  const { slug = "" } = useParams();
  const { data: event, isPending, isError, refetch } = useEvent(slug);

  if (isPending) {
    return (
      <div className="container-page space-y-6 pb-24 pt-40">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-3/4" />
      </div>
    );
  }
  if (isError) return <ErrorState className="container-page mb-24 mt-40" onRetry={() => void refetch()} />;
  if (!event) return <NotFoundPage />;

  const url = absoluteUrl(ROUTES.event(event.slug));
  const upcoming = isUpcoming(event);
  const { day, month, year } = dateParts(event.startsAt);

  return (
    <>
      <Seo
        title={event.title}
        description={event.excerpt ?? `${event.title} — ${formatDateRange(event.startsAt, event.endsAt)}`}
        image={event.coverUrl}
        jsonLd={{
          "@type": "Event",
          name: event.title,
          description: event.excerpt ?? undefined,
          startDate: event.startsAt,
          endDate: event.endsAt ?? undefined,
          image: event.coverUrl ?? undefined,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: event.location ? { "@type": "Place", name: event.location, address: event.location } : undefined,
          organizer: { "@type": "Organization", name: COMPANY.name, url: absoluteUrl("/") },
          url,
        }}
      />

      <article>
        <header className="container-page pb-14 pt-32 sm:pt-40">
          <Breadcrumbs items={[{ label: "Événements", to: ROUTES.events }, { label: event.title }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-9">
              <Eyebrow>{upcoming ? "Événement à venir" : "Événement passé"}</Eyebrow>
              <h1 className="mt-6 text-display-lg text-ink">
                <SplitWords text={event.title} immediate delay={0.1} />
              </h1>
            </div>
            <Reveal delay={0.25} className="lg:col-span-3">
              <time dateTime={event.startsAt} className="block font-display leading-none lg:text-right">
                <span className="block text-7xl font-bold tracking-tight text-brand">{day}</span>
                <span className="mt-2 block text-sm font-semibold uppercase tracking-[0.2em] text-accent-ink">
                  {month} {year}
                </span>
              </time>
            </Reveal>
          </div>

          <Reveal delay={0.35} className="mt-10 flex flex-col gap-6 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
            <dl className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Date</dt>
                <Clock className="size-4 text-accent-ink" aria-hidden="true" />
                <dd className="font-semibold text-ink">
                  {formatDateRange(event.startsAt, event.endsAt)} · {formatTime(event.startsAt)}
                </dd>
              </div>
              {event.location ? (
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Lieu</dt>
                  <MapPin className="size-4 text-accent-ink" aria-hidden="true" />
                  <dd className="font-semibold text-ink">{event.location}</dd>
                </div>
              ) : null}
            </dl>
            {upcoming ? (
              <Button variant="outline" onClick={() => downloadIcs(event, url)} icon={<CalendarPlus className="size-4" aria-hidden="true" />}>
                Ajouter à mon agenda
              </Button>
            ) : null}
          </Reveal>
        </header>

        {event.coverUrl ? (
          <div className="container-page">
            <ImageReveal disabled className="rounded-[2rem]">
              <SmartImage src={event.coverUrl} alt={event.title} priority className="aspect-[16/8] rounded-[2rem]" sizes="100vw" />
            </ImageReveal>
          </div>
        ) : null}

        <div className="container-page max-w-3xl py-16 sm:py-24">
          {event.excerpt ? <p className="mb-10 text-lead text-ink-soft">{event.excerpt}</p> : null}
          <RichText content={event.description} videoTitle={event.title} />
          <Link to={ROUTES.events} className="mt-16 inline-flex items-center gap-2 font-semibold text-brand hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" /> Tous les événements
          </Link>
        </div>
      </article>
      <CtaBand title="Un événement à organiser ? Parlons-en." to={`${ROUTES.quote}?besoin=evenementiel`} />
    </>
  );
}
