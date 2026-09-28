import { AnimatePresence, m } from "framer-motion";
import { Outlet, ScrollRestoration, useLocation, useNavigation } from "react-router";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { EASE } from "@/components/motion/variants";

/** Barre de progression fine pendant le chargement d'une page (code splitting). */
function NavigationProgress() {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  return (
    <AnimatePresence>
      {loading ? (
        <m.div
          className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-accent"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 0.85, transition: { duration: 2.5, ease: EASE } }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.4 } }}
          role="progressbar"
          aria-label="Chargement de la page"
        />
      ) : null}
    </AnimatePresence>
  );
}

export function RootLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <a
        href="#contenu"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        Aller au contenu
      </a>
      <NavigationProgress />
      <Header />
      <m.main
        key={pathname}
        id="contenu"
        tabIndex={-1}
        className="min-h-[70vh] outline-none"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <Outlet />
      </m.main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
