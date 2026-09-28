import type { LucideProps } from "lucide-react";
import { createElement } from "react";
import { resolveIcon, type IconName } from "@/lib/icons";

/**
 * Icône choisie à l'exécution (colonne `icon` en base, contenu officiel).
 * `createElement` sur un composant du registre statique : aucune création de
 * composant pendant le rendu.
 */
export function DynamicIcon({ name, fallback, ...props }: { name: string | null | undefined; fallback?: IconName } & Omit<LucideProps, "name">) {
  return createElement(resolveIcon(name, fallback), props);
}
