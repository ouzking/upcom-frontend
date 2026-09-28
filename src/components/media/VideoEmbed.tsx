import { Play } from "lucide-react";
import { useState } from "react";
import type { VideoSource } from "@/lib/video";

/**
 * Vidéo en « façade » : aucun script tiers n'est chargé tant que le visiteur
 * n'a pas cliqué (performance et respect de la vie privée).
 */
export function VideoEmbed({ source, title }: { source: VideoSource; title: string }) {
  const [active, setActive] = useState(false);
  const src =
    source.provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${source.id}?autoplay=1&dnt=1`;
  const thumbnail = source.provider === "youtube" ? `https://i.ytimg.com/vi/${source.id}/hqdefault.jpg` : null;

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl bg-brand-night">
      {active ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 flex h-full w-full items-center justify-center"
          aria-label={`Lire la vidéo : ${title}`}
        >
          {thumbnail ? <img src={thumbnail} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-90" /> : <div className="absolute inset-0 bg-gradient-brand" />}
          <span className="relative flex size-20 items-center justify-center rounded-full bg-accent text-ink shadow-[0_10px_40px_-10px_rgba(253,142,3,0.8)] transition-transform duration-500 ease-premium group-hover:scale-110">
            <Play className="ml-1 size-7 fill-current" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}
