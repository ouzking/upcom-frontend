import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "outline" | "ghost" | "light";
type Size = "md" | "lg";

export interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  /** Affiche la flèche animée à droite du libellé. */
  arrow?: boolean;
  icon?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  // Bleu institutionnel : texte blanc (contraste 11:1)
  primary: "bg-brand text-white hover:bg-brand-deep",
  // Orange d'accent : texte navy pour rester lisible (contraste AA)
  accent: "bg-accent text-ink hover:bg-[#ff9d24]",
  outline: "border border-ink/15 text-ink hover:border-brand hover:text-brand bg-white/60 backdrop-blur",
  ghost: "text-ink hover:text-brand",
  light: "bg-white text-brand hover:bg-mist",
};

const SIZES: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-[0.95rem]",
};

export const buttonClasses = ({ variant = "primary", size = "md" }: ButtonStyleProps = {}, className?: string) =>
  cn(
    "group/button relative inline-flex select-none items-center justify-center gap-2.5 rounded-full font-semibold tracking-tight",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-premium",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
