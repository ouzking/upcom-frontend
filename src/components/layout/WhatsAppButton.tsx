import { m } from "framer-motion";
import { SocialIcon } from "@/components/media/SocialIcon";
import { EASE } from "@/components/motion/variants";
import { COMPANY } from "@/content/company";
import { useSiteInfo } from "@/hooks/queries";
import { whatsappHref } from "@/lib/format";

/**
 * Accès WhatsApp permanent. Numéro : `site_settings.whatsapp_number` s'il est
 * renseigné au back-office, sinon le numéro officiel principal.
 */
export function WhatsAppButton() {
  const { data: site } = useSiteInfo();
  const number = site?.whatsapp ?? site?.phones[0] ?? COMPANY.phones[0];

  return (
    <m.a
      href={whatsappHref(number, "Bonjour UPCOM, je souhaite échanger au sujet d'un projet.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp (nouvelle fenêtre)"
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_40px_-12px_rgba(10,22,51,0.45)] transition-transform duration-300 hover:scale-105 sm:right-8"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 1.2 }}
    >
      <SocialIcon platform="whatsapp" className="size-7" strokeWidth={2} />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
        Écrivez-nous sur WhatsApp
      </span>
    </m.a>
  );
}
