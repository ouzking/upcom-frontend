import { hydrate } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, matchRoutes } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ConfigErrorScreen } from "@/app/ConfigErrorScreen";
import { AppProviders } from "@/app/providers";
import { createQueryClient } from "@/app/query-client";
import { routes } from "@/app/router";
import { getEnvErrors } from "@/config/env";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Élément #root introuvable.");

// Vérification au démarrage : sans configuration Supabase valide, l'application ne démarre pas.
const envErrors = getEnvErrors();
if (envErrors.length > 0) {
  createRoot(container).render(<ConfigErrorScreen errors={envErrors} />);
  throw new Error(
    `[UPCOM] Configuration invalide :\n- ${envErrors.join("\n- ")}\nDéfinissez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY puis relancez le build.`,
  );
}

const queryClient = createQueryClient();

// Page pré-rendue au build : on reprend ses données (aucune requête ni écran de chargement).
const prerenderedState = document.getElementById("__UPCOM_STATE__")?.textContent;
if (prerenderedState) hydrate(queryClient, JSON.parse(prerenderedState));

// Le module de la page courante est chargé avant l'hydratation, pour que le
// premier rendu du navigateur corresponde exactement au HTML pré-rendu.
const lazyMatches = matchRoutes(routes, window.location)?.filter((match) => match.route.lazy) ?? [];
await Promise.all(
  lazyMatches.map(async ({ route }) => {
    const lazy = route.lazy;
    if (typeof lazy !== "function") return;
    Object.assign(route, { ...(await lazy()), lazy: undefined });
  }),
);

const router = createBrowserRouter(routes);
const app = (
  <StrictMode>
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);

if (container.hasChildNodes()) {
  // Laisse d'abord le navigateur afficher la page pré-rendue, puis rend la main à React :
  // l'hydratation ne retarde plus le premier affichage.
  await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
