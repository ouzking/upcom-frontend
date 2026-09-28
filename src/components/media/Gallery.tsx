import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Stagger, StaggerItem } from "@/components/motion/primitives";
import { EASE } from "@/components/motion/variants";
import { useLockBodyScroll } from "@/hooks/ui";
import { cn } from "@/lib/cn";
import type { ProjectImage } from "@/types/domain";

/** Galerie en mosaïque + visionneuse plein écran (clavier : ← → Échap). */
export function Gallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  if (images.length === 0) return null;

  return (
    <>
      <Stagger className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3" stagger={0.06}>
        {images.map((image, index) => (
          <StaggerItem key={image.id} className={cn(index % 5 === 0 && "col-span-2 lg:col-span-2 lg:row-span-2")}>
            <button
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setOpenIndex(index);
              }}
              className="group relative block h-full w-full overflow-hidden rounded-2xl bg-mist"
              aria-label={`Agrandir l'image ${index + 1} sur ${images.length}${image.alt ? ` : ${image.alt}` : ""}`}
            >
              <img
                src={image.url}
                alt={image.alt ?? `${title} — visuel ${index + 1}`}
                loading="lazy"
                decoding="async"
                className={cn("h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]", index % 5 === 0 ? "aspect-[4/3] lg:aspect-auto" : "aspect-square")}
              />
              <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="size-4" aria-hidden="true" />
              </span>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      <AnimatePresence>
        {openIndex !== null ? <Lightbox images={images} index={openIndex} onIndexChange={setOpenIndex} onClose={close} title={title} /> : null}
      </AnimatePresence>
    </>
  );
}

interface LightboxProps {
  images: ProjectImage[];
  index: number;
  title: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

function Lightbox({ images, index, title, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const image = images[index];
  const count = images.length;
  useLockBodyScroll(true);

  const go = useCallback((delta: number) => onIndexChange((index + delta + count) % count), [index, count, onIndexChange]);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  if (!image) return null;

  return (
    <m.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — galerie`}
      tabIndex={-1}
      className="fixed inset-0 z-[80] flex flex-col bg-brand-night/95 backdrop-blur-sm outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-4 text-white sm:px-8">
        <p className="text-sm tabular-nums text-white/70" aria-live="polite">
          {index + 1} / {count}
        </p>
        <button type="button" onClick={onClose} className="flex size-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20" aria-label="Fermer la galerie">
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
        <AnimatePresence mode="wait" initial={false}>
          <m.figure
            key={image.id}
            className="flex max-h-full flex-col items-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <img src={image.url} alt={image.alt ?? `${title} — visuel ${index + 1}`} className="max-h-[78vh] w-auto rounded-xl object-contain" />
            {image.caption ? <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/75">{image.caption}</figcaption> : null}
          </m.figure>
        </AnimatePresence>

        {count > 1 ? (
          <>
            <button type="button" onClick={() => go(-1)} className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6" aria-label="Image précédente">
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6" aria-label="Image suivante">
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
    </m.div>
  );
}
