import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

const CONTROL =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[0.98rem] text-ink placeholder:text-muted/70 transition-[border-color,box-shadow] duration-300 hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 aria-[invalid=true]:border-accent-deep aria-[invalid=true]:ring-accent-deep/10";

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

function FieldShell({ id, label, required, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
        <span>
          {label}
          {required ? (
            <span className="ml-1 text-accent-ink" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="ml-2 text-xs font-medium text-muted">(facultatif)</span>
          )}
        </span>
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-accent-ink" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, hint?: string, error?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

type BaseProps = { label: string; hint?: string; error?: string; className?: string };

export function TextField({ label, hint, error, className, required, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <input id={id} required={required} aria-invalid={Boolean(error)} aria-describedby={describedBy(id, hint, error)} className={CONTROL} {...props} />
    </FieldShell>
  );
}

export function TextAreaField({ label, hint, error, className, required, ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(CONTROL, "min-h-40 resize-y leading-relaxed")}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({ label, hint, error, className, required, children, ...props }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <select
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(CONTROL, "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23013592%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11")}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export interface Choice {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface ChoiceGroupProps {
  legend: string;
  name: string;
  choices: readonly Choice[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  columns?: string;
  required?: boolean;
}

/** Groupe de boutons radio présentés en « chips » (navigation clavier native). */
export function ChoiceGroup({ legend, name, choices, value, onChange, error, hint, columns = "sm:grid-cols-2", required }: ChoiceGroupProps) {
  const id = useId();
  return (
    <fieldset aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}>
      <legend className="mb-3 text-sm font-semibold text-ink">
        {legend}
        {required ? (
          <span className="ml-1 text-accent-ink" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 text-xs font-medium text-muted">(facultatif)</span>
        )}
      </legend>
      <div className={cn("grid gap-2.5", columns)}>
        {choices.map((choice) => (
          <label key={choice.value} className="group relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={choice.value}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
              className="peer sr-only"
              required={required}
            />
            <span
              className={cn(
                "flex h-full items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 text-[0.93rem] font-semibold text-ink-soft transition-all duration-300",
                "group-hover:border-brand/40 peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
              )}
            >
              {choice.icon}
              {choice.label}
            </span>
          </label>
        ))}
      </div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-accent-ink" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Champ piège anti-spam : invisible pour les humains, rempli par les robots. */
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label>
        Site web
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    </div>
  );
}
