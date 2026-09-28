import { m } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

/** Filtres de catégorie en « pilules » avec indicateur animé partagé. */
export function FilterPills({ options, value, onChange, label }: { options: { value: string; label: string }[]; value: string; onChange: (value: string) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="scrollbar-none -mx-5 flex gap-1.5 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn("relative shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-300", active ? "text-white" : "text-ink-soft hover:text-brand")}
          >
            {active ? <m.span layoutId={`pill-${label}`} className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 400, damping: 34 }} /> : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, label }: { value: string; onChange: (value: string) => void; placeholder: string; label: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-11 text-sm text-ink placeholder:text-muted/80 transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button type="button" onClick={() => onChange("")} className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-mist hover:text-ink" aria-label="Effacer la recherche">
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
