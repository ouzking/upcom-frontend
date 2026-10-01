import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@upcom/supabase";
import { env } from "@/config/env";

export type UpcomClient = SupabaseClient<Database>;

let clientPromise: Promise<UpcomClient> | null = null;

/**
 * Client Supabase unique du site public (clé publishable), chargé à la demande :
 * supabase-js ne pèse pas sur le premier affichage (performance mobile).
 * La configuration est validée au démarrage (main.tsx) avant tout appel.
 * Le site ne fait que des lectures de contenus publiés (RLS) ; les formulaires
 * passent par les Edge Functions. Aucune session utilisateur n'est nécessaire.
 */
export function getSupabase(): Promise<UpcomClient> {
  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient<Database>(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }),
  );
  return clientPromise;
}
