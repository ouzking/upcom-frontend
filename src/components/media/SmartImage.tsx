import { useState } from "react";
import { Slashes } from "@/components/ui/Brand";
import { cn } from "@/lib/cn";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface SmartImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  /** Classe de l'élément <img> (object-position…). */
  imgClassName?: string;
  /** Image au-dessus de la ligne de flottaison : chargement prioritaire. */
  priority?: boolean;
  sizes?: string;
  /** Graine du visuel de repli (id, slug) : varie la composition d'une carte à l'autre. */
  seed?: string;
  /** Icône du visuel de repli (clé du registre d'icônes). */
  fallbackIcon?: string | null;
  fallbackLabel?: string | null;
  /** Texte affiché en grand dans le visuel de repli (initiales d'un portrait). */
  fallbackText?: string;
}

const FALLBACK_THEMES = [
  "bg-gradient-brand text-white",
  "bg-brand-night text-white",
  "bg-mist text-brand",
] as const;

const hash = (value: string): number => [...value].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);

/**
 * Image Storage avec chargement paresseux et fondu à l'apparition.
 * Sans image, affiche une composition de marque (jamais une photo générique).
 */
export function SmartImage({ src, alt, className, imgClassName, priority = false, sizes, seed = alt, fallbackIcon, fallbackLabel, fallbackText }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const theme = FALLBACK_THEMES[hash(seed) % FALLBACK_THEMES.length] ?? FALLBACK_THEMES[0];
    return (
      <div className={cn("relative isolate flex overflow-hidden", theme, className)} {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}>
        <div className="absolute inset-0 -z-10 bg-grid opacity-40" aria-hidden="true" />
        <div
          className="absolute -bottom-1/3 -right-1/4 -z-10 aspect-square w-[85%] rounded-full border border-current opacity-15"
          aria-hidden="true"
        />
        {fallbackText ? (
          <span className="absolute inset-0 flex items-center justify-center font-display text-[clamp(3rem,9vw,6rem)] font-bold tracking-tight opacity-90" aria-hidden="true">
            {fallbackText}
          </span>
        ) : (
          <DynamicIcon name={fallbackIcon} className="absolute right-[8%] top-[10%] size-[22%] min-h-10 min-w-10 opacity-20" strokeWidth={1.1} aria-hidden="true" />
        )}
        <div className="mt-auto flex w-full items-end justify-between gap-4 p-5 sm:p-6">
          {fallbackLabel ? <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">{fallbackLabel}</span> : <span />}
          <Slashes className="h-2.5 shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-mist", className)}>
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "h-full w-full object-cover transition-[opacity,transform,filter] duration-700 ease-premium",
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
          imgClassName,
        )}
      />
    </div>
  );
}
