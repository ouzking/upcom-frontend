import { m } from "framer-motion";
import { ArrowUpRight, MapPin, Phone, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { EASE } from "@/components/motion/variants";
import { Orbits, Slashes } from "@/components/ui/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { MAIN_NAV, PRIMARY_CTA, ROUTES, SECONDARY_NAV } from "@/config/site";
import { useSiteInfo } from "@/hooks/queries";
import { useLockBodyScroll } from "@/hooks/ui";
import { cn } from "@/lib/cn";
import { telHref } from "@/lib/format";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Menu plein écran (mobile / tablette) : focus piégé, fermeture par Échap. */
export function MobileMenu({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { data: site } = useSiteInfo();
  useLockBodyScroll(true);

  useEffect(() => {
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const links = [...MAIN_NAV, ...SECONDARY_NAV.filter((item) => item.to !== PRIMARY_CTA.to)];

  return (
    <m.div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-brand-night text-white xl:hidden"
      initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.75rem)" }}
      animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.75rem)" }}
      exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.75rem)" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <Orbits tone="dark" className="absolute -right-40 top-24 size-[36rem] opacity-50" />

      <div className="container-page relative flex h-[4.75rem] items-center justify-between sm:h-[5.5rem]">
        <Slashes className="h-3.5" />
        <button type="button" onClick={onClose} className="flex size-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10" aria-label="Fermer le menu">
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <nav className="container-page relative mt-4 flex-1" aria-label="Menu mobile">
        <m.ul
          className="space-y-1"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
        >
          {links.map((item, index) => (
            <m.li
              key={item.to}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
            >
              <NavLink
                to={item.to}
                end={item.to === ROUTES.home}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "group flex items-baseline gap-4 py-2 font-display text-[clamp(1.9rem,8vw,3rem)] font-semibold tracking-tight transition-colors",
                    isActive ? "text-accent" : "text-white hover:text-accent",
                  )
                }
              >
                <span className="font-sans text-xs font-semibold tabular-nums text-white/40">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
                <ArrowUpRight className="size-6 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </NavLink>
            </m.li>
          ))}
        </m.ul>
      </nav>

      <m.div
        className="container-page relative space-y-6 border-t border-white/10 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5 } }}
      >
        <ButtonLink to={PRIMARY_CTA.to} variant="accent" size="lg" arrow className="w-full sm:w-auto" onClick={onClose}>
          {PRIMARY_CTA.label}
        </ButtonLink>
        <div className="flex flex-col gap-3 text-sm text-white/75 sm:flex-row sm:gap-8">
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            {site?.address}
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Phone className="size-4 text-accent" aria-hidden="true" />
            {site?.phones.map((phone) => (
              <a key={phone} href={telHref(phone)} className="font-semibold text-white hover:text-accent">
                {phone}
              </a>
            ))}
          </p>
        </div>
      </m.div>
    </m.div>
  );
}
