import { cn } from "@/lib/cn";
import type { StockImage } from "@/content/media";

interface StockPictureProps {
  image: StockImage;
  /** Largeur affichée, pour le choix de la bonne résolution (srcset). */
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Image principale de la page : chargement prioritaire, sinon différé. */
  priority?: boolean;
  /** Visuel purement décoratif : masqué aux lecteurs d'écran. */
  decorative?: boolean;
}

/** Visuel d'illustration optimisé (WebP en 3 largeurs, dimensions fixes, pas de décalage de mise en page). */
export function StockPicture({ image, sizes, className, imgClassName, priority = false, decorative = false }: StockPictureProps) {
  return (
    <div className={cn("relative overflow-hidden bg-mist", className)}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={decorative ? "" : image.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
