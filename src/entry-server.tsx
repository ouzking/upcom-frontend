/**
 * Rendu serveur utilisé UNIQUEMENT au build (scripts/prerender.mjs) pour générer
 * le HTML statique de chaque page : affichage immédiat, et titres / balises
 * Open Graph propres à chaque URL pour les moteurs et les aperçus de liens.
 */
import { dehydrate, hashKey } from "@tanstack/react-query";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { prefetchRoute } from "@/app/prefetch";
import { AppProviders } from "@/app/providers";
import { createQueryClient } from "@/app/query-client";
import { routes } from "@/app/router";
import { SeoCollectorContext, type PageMeta } from "@/lib/seo";

export interface RenderResult {
  html: string;
  meta: PageMeta | null;
  /** État React Query sérialisé, réhydraté par le navigateur. */
  state: unknown;
}

const handler = createStaticHandler(routes);

export async function render(pathname: string, origin: string): Promise<RenderResult> {
  const context = await handler.query(new Request(new URL(pathname, origin)));
  if (context instanceof Response) throw new Error(`Redirection inattendue pour ${pathname}`);

  const queryClient = createQueryClient();
  // Pas de minuterie de nettoyage du cache côté serveur (le processus doit pouvoir se terminer).
  queryClient.setDefaultOptions({ queries: { ...queryClient.getDefaultOptions().queries, gcTime: Infinity } });
  const keys = await prefetchRoute(queryClient, pathname);
  const hashes = new Set(keys.map((key) => hashKey(key)));

  let meta: PageMeta | null = null;
  const router = createStaticRouter(handler.dataRoutes, context);
  const html = renderToString(
    <StrictMode>
      <SeoCollectorContext.Provider value={(collected) => (meta = collected)}>
        <AppProviders queryClient={queryClient}>
          {/* hydrate={false} : pas de script en ligne (compatible avec la CSP). */}
          <StaticRouterProvider router={router} context={context} hydrate={false} />
        </AppProviders>
      </SeoCollectorContext.Provider>
    </StrictMode>,
  );

  const state = dehydrate(queryClient, {
    shouldDehydrateQuery: (query) => query.state.status === "success" && hashes.has(query.queryHash),
  });
  return { html, meta, state };
}
