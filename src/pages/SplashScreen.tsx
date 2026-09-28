import { Mark } from "@/components/ui/Brand";

/** Écran affiché le temps de charger la première page (quelques centaines de ms). */
export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white" role="status" aria-label="Chargement">
      <Mark eager className="w-28 animate-pulse" />
    </div>
  );
}
