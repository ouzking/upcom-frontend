/** Écran affiché le temps de charger la première page (quelques centaines de ms). */
export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white" role="status" aria-label="Chargement">
      <span className="size-10 animate-spin rounded-full border-2 border-brand/15 border-t-accent" />
    </div>
  );
}
