import { AlertTriangle, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Orbits, Slashes } from "./Brand";
import { Button } from "./Button";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-line/70", className)} aria-hidden="true" />;
}

/** Grille de squelettes pour les listes en chargement. */
export function SkeletonGrid({ count = 3, className, itemClassName }: { count?: number; className?: string; itemClassName?: string }) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)} role="status" aria-label="Chargement en cours">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className={cn("aspect-[4/3]", itemClassName)} />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  text?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}

/** État vide éditorial : jamais de contenu inventé, une invitation à agir. */
export function EmptyState({ title, text, action, className, tone = "light" }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-12 sm:py-20",
        tone === "light" ? "border border-line bg-mist" : "border border-white/10 bg-white/5",
        className,
      )}
    >
      <Orbits className="absolute -right-24 -top-24 -z-10 size-[26rem] opacity-60" tone={tone} />
      <Slashes className="mx-auto h-3.5" />
      <h3 className={cn("mx-auto mt-6 max-w-xl text-display-sm", tone === "light" ? "text-ink" : "text-white")}>{title}</h3>
      {text ? <p className={cn("mx-auto mt-4 max-w-lg", tone === "light" ? "text-muted" : "text-white/70")}>{text}</p> : null}
      {action ? <div className="mt-8 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <div role="alert" className={cn("flex flex-col items-center gap-4 rounded-3xl border border-line bg-white px-6 py-12 text-center", className)}>
      <AlertTriangle className="size-7 text-accent-ink" aria-hidden="true" />
      <p className="max-w-md text-muted">Le contenu n'a pas pu être chargé. Vérifiez votre connexion puis réessayez.</p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry} icon={<RotateCcw className="size-4" aria-hidden="true" />}>
          Réessayer
        </Button>
      ) : null}
    </div>
  );
}
