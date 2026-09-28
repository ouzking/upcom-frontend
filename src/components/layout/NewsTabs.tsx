import { NavLink } from "react-router";
import { ROUTES } from "@/config/site";
import { cn } from "@/lib/cn";

/** Bascule Actualités / Événements (deux rubriques éditoriales sœurs). */
export function NewsTabs() {
  return (
    <nav aria-label="Rubriques éditoriales" className="mt-10 inline-flex rounded-full border border-line bg-white p-1">
      {[
        { to: ROUTES.news, label: "Actualités" },
        { to: ROUTES.events, label: "Événements" },
      ].map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn("rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300", isActive ? "bg-brand text-white" : "text-ink-soft hover:text-brand")
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
