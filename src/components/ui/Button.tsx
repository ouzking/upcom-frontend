import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import { cn } from "@/lib/cn";

import { buttonClasses, type ButtonStyleProps as StyleProps } from "./button-styles";

function Content({ children, arrow, icon }: { children: ReactNode; arrow?: boolean; icon?: ReactNode }) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {arrow ? (
        <span className="relative -mr-1 inline-flex size-6 items-center justify-center overflow-hidden" aria-hidden="true">
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-premium group-hover/button:translate-x-5 group-hover/button:-translate-y-5" />
          <ArrowUpRight className="absolute size-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-premium group-hover/button:translate-x-0 group-hover/button:translate-y-0" />
        </span>
      ) : null}
    </>
  );
}

export function ButtonLink({ variant, size, arrow, icon, className, children, ...props }: StyleProps & LinkProps) {
  return (
    <Link className={buttonClasses({ variant, size }, className)} {...props}>
      <Content arrow={arrow} icon={icon}>
        {children}
      </Content>
    </Link>
  );
}

/** Lien externe (tel:, wa.me, cartes…) avec le style bouton. */
export function ButtonAnchor({ variant, size, arrow, icon, className, children, ...props }: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClasses({ variant, size }, className)} {...props}>
      <Content arrow={arrow} icon={icon}>
        {children}
      </Content>
    </a>
  );
}

export function Button({ variant, size, arrow, icon, className, children, type = "button", ...props }: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses({ variant, size }, className)} {...props}>
      <Content arrow={arrow} icon={icon}>
        {children}
      </Content>
    </button>
  );
}

/** Lien texte éditorial avec soulignement animé. */
export function TextLink({ className, children, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        "group/link inline-flex items-center gap-1.5 font-semibold text-brand",
        "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-0.5",
        "transition-[background-size] duration-500 ease-premium hover:bg-[length:100%_1.5px]",
        className,
      )}
      {...props}
    >
      {children}
      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}
