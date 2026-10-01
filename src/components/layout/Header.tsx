import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import { EASE } from "@/components/motion/variants";
import { LogoLink } from "@/components/ui/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { MAIN_NAV, PRIMARY_CTA, ROUTES } from "@/config/site";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";

/**
 * En-tête sticky : transparent en haut de page, verre dépoli ensuite ; se
 * rétracte au défilement vers le bas et réapparaît au défilement vers le haut.
 */
export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 24);
    setHidden(current > 320 && current > previous + 4);
    if (current < previous - 4) setHidden(false);
  });

  return (
    <>
      <m.header
        className="fixed inset-x-0 top-0 z-50"
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-100%" : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div
          className={cn(
            "transition-[background-color,box-shadow,backdrop-filter] duration-500",
            scrolled ? "bg-white/85 shadow-[0_1px_0_rgba(10,22,51,0.06),0_12px_40px_-20px_rgba(1,53,146,0.25)] backdrop-blur-xl" : "bg-transparent",
          )}
        >
          <nav className="container-page flex h-[4.75rem] items-center justify-between gap-6 sm:h-[5.5rem]" aria-label="Navigation principale">
            <LogoLink />

            <ul className="hidden items-center gap-1 xl:flex">
              {MAIN_NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === ROUTES.home}
                    className={({ isActive }) =>
                      cn(
                        "relative inline-flex h-10 items-center rounded-full px-4 text-[0.92rem] font-semibold transition-colors duration-300",
                        isActive ? "text-brand" : "text-ink-soft hover:text-brand",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <AnimatePresence>
                          {isActive ? (
                            <m.span
                              layoutId="nav-indicator"
                              className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-accent"
                              transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                          ) : null}
                        </AnimatePresence>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <ButtonLink to={PRIMARY_CTA.to} variant="accent" arrow>
                  {PRIMARY_CTA.label}
                </ButtonLink>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex size-11 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink backdrop-blur transition hover:border-brand hover:text-brand xl:hidden"
                aria-label="Ouvrir le menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </m.header>

      <AnimatePresence>{menuOpen ? <MobileMenu onClose={() => setMenuOpen(false)} /> : null}</AnimatePresence>
    </>
  );
}
