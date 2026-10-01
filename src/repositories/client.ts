import type { PostgrestError } from "@supabase/supabase-js";
import { getSupabase, type UpcomClient } from "@/lib/supabase";

/** Erreur de lecture Supabase, avec un message affichable. */
export class RepositoryError extends Error {
  readonly code: string | null;

  constructor(context: string, cause: PostgrestError) {
    super(`${context} : ${cause.message}`);
    this.name = "RepositoryError";
    this.code = cause.code ?? null;
  }
}

/** Forme minimale d'une réponse supabase-js. */
type QueryResponse = { data: unknown; error: PostgrestError | null };

/**
 * Exécute une requête ; `fallback` est renvoyé si la base ne renvoie rien (`null`).
 * Centralise la gestion d'erreur : un repository ne manipule jamais `{ data, error }`.
 * (Le type de résultat est déduit de la réponse entière : l'inférence directe sur
 * `data` échoue avec les builders `maybeSingle()` de postgrest-js.)
 */
export async function query<Res extends QueryResponse, F>(
  context: string,
  fallback: F,
  run: (client: UpcomClient) => PromiseLike<Res>,
): Promise<NonNullable<Res["data"]> | F> {
  const { data, error } = await run(await getSupabase());
  if (error) throw new RepositoryError(context, error);
  return (data ?? fallback) as NonNullable<Res["data"]> | F;
}

/** Échappe un terme de recherche pour un filtre PostgREST `or(...ilike...)`. */
export const sanitizeSearch = (term: string): string =>
  term.replace(/[%_,()*\\:"']/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);

/** Supabase renvoie une relation « to-one » comme objet (ou tableau selon l'inférence). */
export function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
