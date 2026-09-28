import { storageUrl } from "@/lib/storage";
import type { EventDetail, EventItem } from "@/types/domain";
import { query } from "./client";

const EVENT_COLUMNS = "id, slug, title, excerpt, location, event_date, end_date, cover_image_path, is_featured" as const;

type EventRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  location: string | null;
  event_date: string;
  end_date: string | null;
  cover_image_path: string | null;
  is_featured: boolean;
};

const toEvent = (row: EventRow): EventItem => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  location: row.location,
  startsAt: row.event_date,
  endsAt: row.end_date,
  coverUrl: storageUrl("events", row.cover_image_path),
  isFeatured: row.is_featured,
});

/** Un événement est « à venir » tant qu'il n'est pas terminé. */
export const isUpcoming = (event: EventItem, now = Date.now()): boolean =>
  new Date(event.endsAt ?? event.startsAt).getTime() >= now;

/** Événements publiés, du plus proche au plus lointain. */
export async function listEvents(limit = 100): Promise<EventItem[]> {
  const rows = await query("Chargement des événements", [], (db) =>
    db.from("events").select(EVENT_COLUMNS).eq("status", "published").order("event_date").limit(limit),
  );
  return rows.map(toEvent);
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  const row = await query("Chargement de l'événement", null, (db) =>
    db.from("events").select(`${EVENT_COLUMNS}, description`).eq("status", "published").eq("slug", slug).maybeSingle(),
  );
  return row ? { ...toEvent(row), description: row.description } : null;
}
