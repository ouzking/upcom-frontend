import { COMPANY } from "@/content/company";
import { telHref } from "@/lib/format";

/**
 * Affiché lorsque la configuration est invalide (variables Supabase absentes ou
 * locales en production). Autonome : aucune donnée distante, aucun routeur.
 * Le détail technique n'est montré qu'en développement.
 */
export function ConfigErrorScreen({ errors }: { errors: string[] }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-mist px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">{COMPANY.name}</p>
      <h1 className="mt-6 max-w-xl text-display-sm text-ink">Le site est momentanément indisponible.</h1>
      <p className="mt-4 max-w-md text-muted">
        Merci de réessayer dans quelques instants. Vous pouvez aussi nous joindre au{" "}
        {COMPANY.phones.map((phone, index) => (
          <span key={phone}>
            {index > 0 ? " ou au " : null}
            <a href={telHref(phone)} className="font-semibold text-brand">
              {phone}
            </a>
          </span>
        ))}
        .
      </p>
      {import.meta.env.DEV ? (
        <ul className="mt-8 max-w-xl rounded-2xl border border-accent-deep/30 bg-white p-5 text-left text-sm text-ink">
          {errors.map((error) => (
            <li key={error}>⚠ {error}</li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
