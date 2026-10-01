import { useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams, type SetURLSearchParams } from "react-router";

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Bloque le défilement de la page (menu mobile, visionneuse). */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

const subscribeNothing = () => () => undefined;

/**
 * `false` pendant le pré-rendu et le rendu d'hydratation, `true` ensuite.
 * Sert à n'utiliser qu'après l'hydratation ce que le HTML pré-rendu ne peut pas
 * connaître (paramètres d'URL…), sans écart entre HTML serveur et navigateur.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribeNothing, () => true, () => false);
}

/** Paramètres d'URL, vides tant que la page pré-rendue n'est pas hydratée. */
export function useHydratedSearchParams(): [URLSearchParams, SetURLSearchParams] {
  const [params, setParams] = useSearchParams();
  return [useIsHydrated() ? params : EMPTY_PARAMS, setParams];
}

const EMPTY_PARAMS = new URLSearchParams();
