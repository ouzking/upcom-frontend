import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { SocialIcon } from "@/components/media/SocialIcon";
import { CssReveal, Reveal } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { Orbits } from "@/components/ui/Brand";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { PRIMARY_CTA } from "@/config/site";
import { COMPANY } from "@/content/company";
import { useSiteInfo } from "@/hooks/queries";
import { telHref, toE164, whatsappHref } from "@/lib/format";
import { legalIdentifiersJsonLd } from "@/lib/seo";

function InfoBlock({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-5 border-t border-line py-7">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mist text-brand">{icon}</span>
      <div className="min-w-0">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{title}</h2>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

/** Carte en « façade » : aucune requête vers Google tant que le visiteur ne l'a pas demandée. */
function MapBlock({ query, mapUrl }: { query: string; mapUrl: string | null }) {
  const [visible, setVisible] = useState(false);
  const isEmbed = Boolean(mapUrl && /output=embed|\/maps\/embed/.test(mapUrl));
  const embedSrc = isEmbed && mapUrl ? mapUrl : `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const openUrl = mapUrl && !isEmbed ? mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="relative isolate h-[26rem] overflow-hidden rounded-[2rem] bg-brand-night sm:h-[32rem]">
      {visible ? (
        <iframe src={embedSrc} title="Localisation d'UPCOM AGENCY & SERVICES" className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <div className="absolute inset-0 -z-10 bg-grid opacity-20" aria-hidden="true" />
          <Orbits tone="dark" className="absolute left-1/2 top-1/2 -z-10 size-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-70" />
          <span className="flex size-16 items-center justify-center rounded-full bg-accent text-ink shadow-[0_0_0_12px_rgba(253,142,3,0.18)]">
            <MapPin className="size-7" aria-hidden="true" />
          </span>
          <p className="mt-6 font-display text-2xl font-semibold">{COMPANY.address}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-brand transition hover:bg-mist"
            >
              Afficher la carte
            </button>
            <a href={openUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold transition hover:bg-white/10">
              Ouvrir dans Google Maps <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </div>
          <p className="mt-4 text-xs text-white/50">L'affichage de la carte charge un service Google.</p>
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  const { data: site } = useSiteInfo();
  const phones = site?.phones ?? [...COMPANY.phones];
  // Numéro WhatsApp du back-office, à défaut le numéro officiel (77 402 74 94).
  const whatsapp = site?.whatsapp ?? COMPANY.phones[0];

  return (
    <>
      <Seo
        title="Contact"
        description={`Contactez UPCOM AGENCY & SERVICES — ${COMPANY.address} — ${COMPANY.phones.join(" / ")}.`}
        jsonLd={{
          "@type": "ContactPage",
          name: "Contact — UPCOM AGENCY & SERVICES",
          mainEntity: {
            "@type": "LocalBusiness",
            name: COMPANY.name,
            address: { "@type": "PostalAddress", streetAddress: site?.address ?? COMPANY.address, addressCountry: "SN" },
            telephone: phones.map((phone) => toE164(phone)),
            ...(site?.email ? { email: site.email } : {}),
            ...(site?.openingHours ? { openingHours: site.openingHours } : {}),
            ...(site && site.socials.length > 0 ? { sameAs: site.socials.map((social) => social.url) } : {}),
            ...legalIdentifiersJsonLd(site),
          },
        }}
      />
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre projet."
        accentWords={["projet"]}
        intro="Une question, une demande d'information ou un projet à lancer ? Écrivez-nous, appelez-nous ou passez nous voir."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="container-page grid gap-16 py-20 sm:py-28 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 animate-fade-up">
          <div>
            <InfoBlock icon={<MapPin className="size-5" aria-hidden="true" />} title="Adresse">
              <address className="font-display text-xl font-semibold not-italic leading-snug text-ink">{site?.address ?? COMPANY.address}</address>
            </InfoBlock>
          </div>
          <div>
            <InfoBlock icon={<Phone className="size-5" aria-hidden="true" />} title="Téléphone">
              <ul className="space-y-1">
                {phones.map((phone) => (
                  <li key={phone}>
                    <a href={telHref(phone)} className="font-display text-xl font-semibold text-ink transition hover:text-brand">
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </InfoBlock>
          </div>
          {site?.email ? (
            <div>
              <InfoBlock icon={<Mail className="size-5" aria-hidden="true" />} title="E-mail">
                <a href={`mailto:${site.email}`} className="break-all font-display text-xl font-semibold text-ink transition hover:text-brand">
                  {site.email}
                </a>
              </InfoBlock>
            </div>
          ) : null}
          {site?.openingHours ? (
            <div>
              <InfoBlock icon={<Clock className="size-5" aria-hidden="true" />} title="Horaires">
                <p className="whitespace-pre-line text-ink">{site.openingHours}</p>
              </InfoBlock>
            </div>
          ) : null}
          <div className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row lg:flex-col xl:flex-row">
            {whatsapp ? (
              <ButtonAnchor
                href={whatsappHref(whatsapp, "Bonjour UPCOM, je souhaite échanger au sujet d'un projet.")}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                icon={<SocialIcon platform="whatsapp" className="size-4" />}
              >
                Écrire sur WhatsApp
              </ButtonAnchor>
            ) : null}
            <ButtonLink to={PRIMARY_CTA.to} variant="accent" arrow>
              {PRIMARY_CTA.label}
            </ButtonLink>
          </div>
          {site && site.socials.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Suivez-nous</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {site.socials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                    >
                      <SocialIcon platform={social.platform} className="size-4" />
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <CssReveal delay={0.1} className="lg:col-span-7">
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_40px_80px_-50px_rgba(1,53,146,0.35)] sm:p-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Envoyez-nous un message</h2>
            <p className="mb-8 mt-2 text-muted">Nous vous répondons dans les meilleurs délais.</p>
            <ContactForm />
          </div>
        </CssReveal>
      </section>

      <section className="container-page pb-24" aria-label="Localisation">
        <Reveal>
          <MapBlock query={COMPANY.mapQuery} mapUrl={site?.mapUrl ?? null} />
        </Reveal>
      </section>
    </>
  );
}
