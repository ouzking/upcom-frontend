const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" });
const timeFormatter = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });

export const formatDate = (iso: string): string => dateFormatter.format(new Date(iso));
export const formatTime = (iso: string): string => timeFormatter.format(new Date(iso));

/** Jour et mois abrégé séparés, pour les blocs date des événements. */
export function dateParts(iso: string): { day: string; month: string; year: string } {
  const date = new Date(iso);
  const [day = "", month = ""] = shortDateFormatter.format(date).split(" ");
  return { day, month: month.replace(".", ""), year: String(date.getFullYear()) };
}

/** Plage de dates d'un événement (« 12 mars 2026 » ou « 12 → 14 mars 2026 »). */
export function formatDateRange(startIso: string, endIso: string | null): string {
  if (!endIso) return formatDate(startIso);
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (start.toDateString() === end.toDateString()) return formatDate(startIso);
  return `${formatDate(startIso)} → ${formatDate(endIso)}`;
}

/** Numéro sénégalais local (« 77 402 74 94 ») → format international E.164 (+221…). */
export function toE164(phone: string, countryCode = "221"): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  return `+${countryCode}${digits}`;
}

export const telHref = (phone: string): string => `tel:${toE164(phone)}`;

export function whatsappHref(phone: string, message?: string): string {
  const number = toE164(phone).replace("+", "");
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** Temps de lecture estimé (≈ 220 mots / minute). */
export function readingTime(text: string | null | undefined): number {
  if (!text) return 1;
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 220));
}

/** Normalise une chaîne pour la recherche (casse et accents ignorés). */
export const normalize = (value: string): string =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
