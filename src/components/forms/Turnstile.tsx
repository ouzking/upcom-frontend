import { useEffect, useRef } from "react";
import { env, isTurnstileEnabled } from "@/config/env";

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile indisponible")));
    script.onerror = () => reject(new Error("Turnstile indisponible"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Vérification anti-robot Cloudflare Turnstile, affichée uniquement si
 * VITE_TURNSTILE_SITE_KEY est défini (le secret est configuré côté Edge Functions).
 * `resetKey` : changer sa valeur réinitialise le widget (jeton à usage unique).
 */
export function Turnstile({ onToken, resetKey = 0 }: { onToken: (token: string) => void; resetKey?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    const siteKey = env.turnstileSiteKey;
    const container = containerRef.current;
    if (!siteKey || !container) return;
    let widgetId: string | null = null;
    let cancelled = false;

    loadTurnstile()
      .then((api) => {
        if (cancelled) return;
        widgetId = api.render(container, {
          sitekey: siteKey,
          language: "fr",
          theme: "light",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
        });
      })
      .catch(() => onTokenRef.current(""));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [resetKey]);

  if (!isTurnstileEnabled) return null;
  return <div ref={containerRef} className="min-h-[65px]" />;
}
