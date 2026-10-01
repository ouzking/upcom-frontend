import { Link } from "react-router";
import logoMedium from "@/assets/brand/logo-upcom-md.webp";
import logoSmall from "@/assets/brand/logo-upcom-sm.webp";
import logoTiny from "@/assets/brand/logo-upcom-xs.webp";
import logo from "@/assets/brand/logo-upcom.webp";
import mark from "@/assets/brand/mark-upcom.webp";
import { cn } from "@/lib/cn";

/** Logo officiel UPCOM (version détourée). */
/** `large` : version haute définition, servie en 260 ou 600 px selon la taille affichée (srcset). */
export function Logo({ className, large = false, eager = false, sizes }: { className?: string; large?: boolean; eager?: boolean; sizes?: string }) {
  return (
    <img
      src={large ? logo : logoSmall}
      srcSet={large ? `${logoSmall} 260w, ${logoMedium} 420w, ${logo} 600w` : `${logoTiny} 140w, ${logoSmall} 260w`}
      sizes={large ? (sizes ?? "(min-width: 1024px) 420px, 200px") : (sizes ?? "80px")}
      alt="UPCOM AGENCY & SERVICES"
      width={large ? 600 : 260}
      height={large ? 535 : 232}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager && large ? "high" : undefined}
      decoding="async"
      className={cn("select-none", className)}
      draggable={false}
    />
  );
}

export function LogoLink({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="UPCOM AGENCY & SERVICES — accueil">
      <Logo eager className="h-14 w-auto sm:h-16" />
    </Link>
  );
}

/** Monogramme « UP » + orbite (sans le texte). */
export function Mark({ className, eager = false }: { className?: string; eager?: boolean }) {
  return (
    <img
      src={mark}
      alt=""
      aria-hidden="true"
      width={480}
      height={258}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-auto select-none", className)}
      draggable={false}
    />
  );
}

/** Les trois barres obliques du logo, motif de ponctuation graphique. */
export function Slashes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 20" className={cn("h-3 w-auto", className)} aria-hidden="true" focusable="false">
      <path d="M8 20 18 0h10L18 20Z" fill="#013592" />
      <path d="M26 20 36 0h10L36 20Z" fill="#FD8E03" />
      <path d="M44 20 54 0h10L54 20Z" fill="#0172E7" />
    </svg>
  );
}

/**
 * Orbites elliptiques inspirées de la trajectoire du logo. Purement décoratives :
 * rotation lente (désactivée si l'utilisateur réduit les animations).
 */
export function Orbits({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const id = tone === "light" ? "orbit-l" : "orbit-d";
  return (
    <div className={cn("pointer-events-none select-none", className)} aria-hidden="true">
      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full animate-orbit">
        <defs>
          <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0172E7" stopOpacity={tone === "light" ? 0.9 : 0.7} />
            <stop offset="0.6" stopColor="#013592" stopOpacity="0.15" />
            <stop offset="1" stopColor="#013592" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="300" cy="300" rx="286" ry="150" fill="none" stroke={`url(#${id}-b)`} strokeWidth="2" transform="rotate(-18 300 300)" />
        <circle cx="560" cy="210" r="6" fill="#0172E7" />
      </svg>
      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full animate-orbit-reverse">
        <defs>
          <linearGradient id={`${id}-o`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FD8E03" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="#EB4602" stopOpacity="0.2" />
            <stop offset="1" stopColor="#EB4602" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="300" cy="300" rx="250" ry="206" fill="none" stroke={`url(#${id}-o)`} strokeWidth="1.5" transform="rotate(24 300 300)" />
        <circle cx="94" cy="420" r="4.5" fill="#FD8E03" />
      </svg>
    </div>
  );
}
