import { ArticleCard } from "@/components/cards/ArticleCard";
import { EventCard } from "@/components/cards/EventCard";
import { Reveal } from "@/components/motion/primitives";
import { TextLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Feedback";
import { Accent, SectionHeading } from "@/components/ui/Section";
import { ROUTES } from "@/config/site";
import { useArticles, useEvents } from "@/hooks/queries";
import { isUpcoming } from "@/repositories/events.repository";
import { Link } from "react-router";

export function NewsEvents() {
  const articlesQuery = useArticles({ pageSize: 3 });
  const eventsQuery = useEvents();
  const articles = articlesQuery.data?.pages[0]?.items ?? [];
  const events = eventsQuery.data ?? [];
  const upcoming = events.filter((event) => isUpcoming(event));
  const shownEvents = upcoming.length > 0 ? upcoming.slice(0, 3) : [...events].reverse().slice(0, 3);
  const [lead, ...others] = articles;

  return (
    <section className="py-24 sm:py-32 lg:py-40" aria-labelledby="news-title">
      <div className="container-page">
        <SectionHeading
          index="08"
          eyebrow="Actualités & événements"
          title={
            <span id="news-title">
              L'actualité <Accent>d'UPCOM</Accent>.
            </span>
          }
          aside={<TextLink to={ROUTES.news}>Toutes les actualités</TextLink>}
        />

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            {articlesQuery.isPending ? (
              <div className="space-y-5">
                <Skeleton className="aspect-[16/11]" />
                <Skeleton className="h-7 w-3/4" />
              </div>
            ) : lead ? (
              <Reveal className="space-y-10">
                <ArticleCard article={lead} />
                {others.length > 0 ? (
                  <div className="grid gap-4 border-t border-line pt-6 sm:grid-cols-2 sm:gap-8">
                    {others.map((article) => (
                      <ArticleCard key={article.id} article={article} variant="compact" />
                    ))}
                  </div>
                ) : null}
              </Reveal>
            ) : (
              <div className="flex h-full min-h-64 flex-col justify-center rounded-[2rem] border border-dashed border-line p-10">
                <p className="text-display-sm text-ink">Les actualités d'UPCOM seront publiées ici.</p>
                <p className="mt-3 text-muted">Projets, coulisses et temps forts de l'agence : revenez bientôt.</p>
              </div>
            )}
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="relative isolate h-full overflow-hidden rounded-[2rem] bg-brand-night p-7 text-white sm:p-10">
              <div className="absolute inset-0 -z-10 bg-noise" aria-hidden="true" />
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold tracking-tight">{upcoming.length > 0 || events.length === 0 ? "Prochains événements" : "Derniers événements"}</h3>
                <Link to={ROUTES.events} className="text-sm font-semibold text-accent hover:underline">
                  Agenda
                </Link>
              </div>
              <div className="mt-6">
                {eventsQuery.isPending ? (
                  <Skeleton className="h-40 bg-white/10" />
                ) : shownEvents.length > 0 ? (
                  shownEvents.map((event) => <EventCard key={event.id} event={event} tone="dark" past={!isUpcoming(event)} />)
                ) : (
                  <p className="border-t border-white/15 pt-6 text-white/70">Aucun événement programmé pour le moment. Les prochains rendez-vous d'UPCOM seront annoncés ici.</p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
