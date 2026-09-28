import { m } from "framer-motion";
import { AlertCircle, MailCheck, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { EASE } from "@/components/motion/variants";
import { COMPANY } from "@/content/company";
import { telHref } from "@/lib/format";

export function FormAlert({ message }: { message: string }) {
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-accent-deep/30 bg-accent/10 p-4 text-sm text-ink">
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-accent-deep" aria-hidden="true" />
      <div>
        <p className="font-semibold">{message}</p>
        <p className="mt-1 text-ink-soft">
          Vous pouvez aussi nous joindre au{" "}
          {COMPANY.phones.map((phone, index) => (
            <span key={phone}>
              {index > 0 ? " ou au " : null}
              <a href={telHref(phone)} className="font-semibold text-brand underline underline-offset-2">
                {phone}
              </a>
            </span>
          ))}
          .
        </p>
      </div>
    </div>
  );
}

/** Confirmation d'envoi, avec coche animée. Le focus y est placé pour les lecteurs d'écran. */
export function FormSuccess({ title, text, email, actions }: { title: string; text: string; email?: string; actions?: ReactNode }) {
  return (
    <m.div
      role="status"
      tabIndex={-1}
      ref={(node) => node?.focus()}
      className="rounded-[2rem] border border-line bg-white p-8 text-center outline-none sm:p-14"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <svg viewBox="0 0 80 80" className="mx-auto size-20" aria-hidden="true">
        <m.circle cx="40" cy="40" r="36" fill="none" stroke="#013592" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: EASE }} />
        <m.path d="M25 41l10 10 20-22" fill="none" stroke="#FD8E03" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.6 }} />
      </svg>
      <h2 className="mt-8 text-display-sm text-ink">{title}</h2>
      {email ? (
        <p className="mx-auto mt-5 inline-flex max-w-md items-center gap-2 rounded-full bg-mist px-4 py-2 text-sm text-ink">
          <MailCheck className="size-4 shrink-0 text-brand" aria-hidden="true" />
          <span>
            Un e-mail de confirmation vous a été envoyé à <strong className="break-all">{email}</strong>.
          </span>
        </p>
      ) : null}
      <p className="mx-auto mt-4 max-w-md text-muted">{text}</p>
      {actions ? <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div> : null}
      <p className="mt-8 inline-flex items-center gap-2 text-sm text-muted">
        <Phone className="size-4 text-accent-deep" aria-hidden="true" />
        Besoin urgent ?{" "}
        <a href={telHref(COMPANY.phones[0])} className="font-semibold text-brand">
          {COMPANY.phones[0]}
        </a>
      </p>
    </m.div>
  );
}
