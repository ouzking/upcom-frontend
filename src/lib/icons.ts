import {
  BriefcaseBusiness,
  CalendarRange,
  Clapperboard,
  Clock,
  Compass,
  Handshake,
  Layers,
  Megaphone,
  MonitorSmartphone,
  Palette,
  PenTool,
  ShieldCheck,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

/**
 * Registre d'icônes autorisées. La colonne `icon` des tables `service_categories`
 * et `services` peut contenir l'une de ces clés (format kebab-case de Lucide).
 */
export const ICONS = {
  "briefcase-business": BriefcaseBusiness,
  "calendar-range": CalendarRange,
  clapperboard: Clapperboard,
  clock: Clock,
  compass: Compass,
  handshake: Handshake,
  layers: Layers,
  megaphone: Megaphone,
  "monitor-smartphone": MonitorSmartphone,
  palette: Palette,
  "pen-tool": PenTool,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  target: Target,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export const isIconName = (value: string | null | undefined): value is IconName =>
  typeof value === "string" && value in ICONS;

export function resolveIcon(name: string | null | undefined, fallback: IconName = "sparkles"): LucideIcon {
  return ICONS[isIconName(name) ? name : fallback];
}
