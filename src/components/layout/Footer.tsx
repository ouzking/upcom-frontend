import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import { SocialIcon } from "@/components/media/SocialIcon";
import { Logo, Slashes } from "@/components/ui/Brand";
import { MAIN_NAV, ROUTES, SECONDARY_NAV } from "@/config/site";
import { useExpertises, useSiteInfo } from "@/hooks/queries";
import { telHref } from "@/lib/format";

export function Footer() {
  const { data: site } = useSiteInfo();
  const { data: expertises = [] } = useExpertises();

  return (
    <footer className="defer-render relative isolate overflow-hidden bg-brand-night text-white" aria-labelledby="footer-title">
      <div className="absolute inset-0 -z-10 bg-noise" aria-hidden="true" />
      <div className="absolute -right-48 -top-48 -z-10 size-[40rem] rounded-full border border-white/5" aria-hidden="true" />
      <div className="absolute -right-24 -top-24 -z-10 size-[28rem] rounded-full border border-white/5" aria-hidden="true" />

      <div className="container-page pb-10 pt-20 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="footer-title" className="sr-only">
              {site?.companyName}
            </h2>
            <Link to={ROUTES.home} className="inline-block rounded-2xl bg-white p-4" aria-label="UPCOM AGENCY & SERVICES — accueil">
              <Logo className="h-20 w-auto" sizes="96px" />
            </Link>
            <p className="mt-8 max-w-sm text-[0.95rem] leading-relaxed text-white/70">{site?.description}</p>
            {site && site.socials.length > 0 ? (
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Réseaux sociaux">
                {site.socials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-11 items-center justify-center rounded-full border border-white/15 transition hover:border-accent hover:bg-accent hover:text-ink"
                      aria-label={`${social.label} (nouvelle fenêtre)`}
                    >
                      <SocialIcon platform={social.platform} className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav className="grid gap-10 sm:grid-cols-3 lg:col-span-5" aria-label="Plan du site">
            <FooterColumn title="Navigation">
              {[...MAIN_NAV, ...SECONDARY_NAV].map((item) => (
                <li key={item.to}>
                  <FooterLink to={item.to}>{item.label}</FooterLink>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Services" className="sm:col-span-2">
              {expertises.map((expertise) => (
                <li key={expertise.slug}>
                  <FooterLink to={ROUTES.expertise(expertise.slug)}>{expertise.name}</FooterLink>
                </li>
              ))}
              <li className="pt-2">
                <FooterLink to={ROUTES.projects}>Réalisations</FooterLink>
              </li>
            </FooterColumn>
          </nav>

          <div className="lg:col-span-3">
            <FooterColumn title="Contact">
              <li className="flex gap-3 text-white/80">
                <MapPin className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                <address className="not-italic leading-relaxed">{site?.address}</address>
              </li>
              {site?.phones.map((phone) => (
                <li key={phone}>
                  <a href={telHref(phone)} className="flex items-center gap-3 font-semibold text-white transition hover:text-accent">
                    <Phone className="size-4 text-accent" aria-hidden="true" />
                    {phone}
                  </a>
                </li>
              ))}
              {site?.email ? (
                <li>
                  <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-white/80 transition hover:text-accent">
                    <Mail className="size-4 text-accent" aria-hidden="true" />
                    {site.email}
                  </a>
                </li>
              ) : null}
              <li className="pt-3">
                <FooterLink to={ROUTES.contact}>Nous contacter</FooterLink>
              </li>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-20 flex flex-col-reverse gap-6 border-t border-white/10 pt-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p>
              © {site?.companyName}. Tous droits réservés.
            </p>
            <nav aria-label="Informations légales" className="flex gap-5">
              <Link to={ROUTES.legal} className="transition hover:text-accent">
                Mentions légales
              </Link>
              <Link to={ROUTES.privacy} className="transition hover:text-accent">
                Confidentialité
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Slashes className="h-3" />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 font-semibold text-white/80 transition hover:text-accent"
            >
              Haut de page <ArrowUp className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-white/45">{title}</h3>
      <ul className="mt-6 space-y-3 text-[0.95rem]">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-white/80 transition-colors hover:text-accent">
      {children}
    </Link>
  );
}
