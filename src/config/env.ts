/**
 * Variables d'environnement publiques, lues une seule fois et validées.
 * Aucune valeur n'est codée en dur : tout vient de import.meta.env (VITE_*).
 * Aucune valeur secrète ne doit transiter par une variable VITE_*.
 */
const clean = (value: string | undefined): string => value?.trim() ?? "";

const LOCAL_HOST = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?(\/|$)/i;

const supabaseUrl = clean(import.meta.env.VITE_SUPABASE_URL).replace(/\/+$/, "");
const supabaseKey = clean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) || clean(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const env = {
  supabaseUrl,
  supabaseKey,
  /** URL publique du site (canonical, Open Graph). À défaut, l'origine courante du navigateur. */
  siteUrl: (clean(import.meta.env.VITE_SITE_URL) || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/+$/, ""),
  turnstileSiteKey: clean(import.meta.env.VITE_TURNSTILE_SITE_KEY) || null,
} as const;

export const isTurnstileEnabled = Boolean(env.turnstileSiteKey);

/**
 * Problèmes de configuration bloquants. Vérifiés au démarrage (main.tsx) :
 * l'application ne démarre pas avec une configuration invalide.
 */
export function getEnvErrors(): string[] {
  const errors: string[] = [];
  if (!supabaseUrl) errors.push("VITE_SUPABASE_URL est manquante.");
  else if (!/^https?:\/\//.test(supabaseUrl)) errors.push(`VITE_SUPABASE_URL est invalide (« ${supabaseUrl} »).`);
  if (!supabaseKey) errors.push("VITE_SUPABASE_PUBLISHABLE_KEY est manquante.");

  // En production, une URL locale ferait demander au visiteur l'accès à son réseau local.
  if (import.meta.env.PROD && LOCAL_HOST.test(supabaseUrl)) {
    errors.push(`VITE_SUPABASE_URL pointe vers une adresse locale (« ${supabaseUrl} ») dans un build de production.`);
  }
  return errors;
}
