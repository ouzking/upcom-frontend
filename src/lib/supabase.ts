import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@upcom/supabase";
import { env } from "@/config/env";

export type UpcomClient = SupabaseClient<Database>;

let client: UpcomClient | null = null;

/**
 * Client Supabase unique du site public (clé publishable), créé au premier usage :
 * la configuration est validée au démarrage (main.tsx) avant tout appel.
 * Le site ne fait que des lectures de contenus publiés (RLS) ; les formulaires
 * passent par les Edge Functions. Aucune session utilisateur n'est nécessaire.
 */
export function getSupabase(): UpcomClient {
  client ??= createClient<Database>(env.supabaseUrl, env.supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
