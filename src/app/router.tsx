import type { ComponentType } from "react";
import type { RouteObject } from "react-router";
import { RootLayout } from "@/layouts/RootLayout";
import HomePage from "@/pages/HomePage";
import { RouteErrorPage } from "@/pages/RouteErrorPage";
import { SplashScreen } from "@/pages/SplashScreen";

/** Chaque page est un chunk séparé, chargé à la navigation (code splitting). */
const page = (loader: () => Promise<{ default: ComponentType }>): Pick<RouteObject, "lazy"> => ({
  lazy: async () => ({ Component: (await loader()).default }),
});

/**
 * Arbre des routes, partagé par le navigateur (main.tsx) et le pré-rendu au build
 * (entry-server.tsx).
 */
export const routes: RouteObject[] = [

  {
    path: "/",
    Component: RootLayout,
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <SplashScreen />,
    children: [
      // Accueil inclus dans le bundle principal : pas d'aller-retour réseau supplémentaire au premier affichage.
      { index: true, Component: HomePage },
      { path: "a-propos", ...page(() => import("@/pages/AboutPage")) },
      { path: "services", ...page(() => import("@/pages/ServicesPage")) },
      { path: "services/:expertiseSlug", ...page(() => import("@/pages/ExpertiseDetailPage")) },
      { path: "services/:expertiseSlug/:serviceSlug", ...page(() => import("@/pages/ServiceDetailPage")) },
      { path: "realisations", ...page(() => import("@/pages/ProjectsPage")) },
      { path: "realisations/:slug", ...page(() => import("@/pages/ProjectDetailPage")) },
      { path: "expertise", ...page(() => import("@/pages/KnowHowPage")) },
      { path: "equipe", ...page(() => import("@/pages/TeamPage")) },
      { path: "actualites", ...page(() => import("@/pages/NewsPage")) },
      { path: "actualites/:slug", ...page(() => import("@/pages/ArticlePage")) },
      { path: "evenements", ...page(() => import("@/pages/EventsPage")) },
      { path: "evenements/:slug", ...page(() => import("@/pages/EventDetailPage")) },
      { path: "contact", ...page(() => import("@/pages/ContactPage")) },
      { path: "demarrer-un-projet", ...page(() => import("@/pages/QuotePage")) },
      { path: "mentions-legales", ...page(() => import("@/pages/LegalNoticePage")) },
      { path: "confidentialite", ...page(() => import("@/pages/PrivacyPage")) },
      { path: "*", ...page(() => import("@/pages/NotFoundPage")) },
    ],
  },
];
