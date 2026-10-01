import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Logo, Orbits } from "@/components/ui/Brand";
import { buttonClasses } from "@/components/ui/button-styles";
import { COMPANY } from "@/content/company";
import { telHref } from "@/lib/format";

/**
 * Erreur inattendue (chunk introuvable après un déploiement, exception…).
 * Autonome : ne dépend ni du layout ni des données distantes.
 */
export function RouteErrorPage() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  if (import.meta.env.DEV) console.error(error);

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-mist px-6 text-center">
      <Orbits className="absolute left-1/2 top-1/2 -z-10 size-[44rem] -translate-x-1/2 -translate-y-1/2 opacity-60" />
      <Logo className="h-auto w-32" eager sizes="128px" />
      <h1 className="mt-10 text-display-md text-ink">{notFound ? "Page introuvable" : "Une erreur est survenue"}</h1>
      <p className="mt-4 max-w-md text-muted">
        {notFound ? "La page demandée n'existe pas ou a été déplacée." : "Rechargez la page. Si le problème persiste, contactez-nous par téléphone."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => window.location.reload()} className={buttonClasses({ variant: "primary" })}>
          Recharger
        </button>
        <Link to="/" className={buttonClasses({ variant: "outline" })}>
          Retour à l'accueil
        </Link>
        <a href={telHref(COMPANY.phones[0])} className={buttonClasses({ variant: "ghost" })}>
          {COMPANY.phones[0]}
        </a>
      </div>
    </main>
  );
}
