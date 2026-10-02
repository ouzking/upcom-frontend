import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AMBIENT_VIDEO } from "@/content/media";
import { cn } from "@/lib/cn";

/**
 * Vidéo d'ambiance décorative : sans son, en boucle, chargée seulement à l'approche
 * de l'écran (aucun octet tant qu'elle n'est pas visible), mise en pause hors écran.
 * Si l'utilisateur réduit les animations, seule l'image fixe est affichée.
 */
export function AmbientVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const reduceMotion = useReducedMotion();

  // Observation de la visibilité : chargement au premier passage, lecture / pause ensuite.
  useEffect(() => {
    const video = ref.current;
    if (!video || reduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setActive(true);
          if (video.currentSrc) void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  // Les <source> viennent d'être ajoutées : le navigateur doit relire la vidéo.
  useEffect(() => {
    const video = ref.current;
    if (!active || !video) return;
    video.load();
    void video.play().catch(() => undefined);
  }, [active]);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      // Image fixe chargée seulement à l'approche (sinon un poster est téléchargé immédiatement).
      poster={active || reduceMotion ? AMBIENT_VIDEO.poster.src : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    >
      {active ? (
        <>
          <source src={AMBIENT_VIDEO.mobile} type="video/mp4" media="(max-width: 640px)" />
          <source src={AMBIENT_VIDEO.desktop} type="video/mp4" />
        </>
      ) : null}
    </video>
  );
}
