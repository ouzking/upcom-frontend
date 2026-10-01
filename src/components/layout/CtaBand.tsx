import { Phone } from "lucide-react";
import { Reveal, SplitWords } from "@/components/motion/primitives";
import { Mark, Orbits, Slashes } from "@/components/ui/Brand";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { PRIMARY_CTA } from "@/config/site";
import { useSiteInfo } from "@/hooks/queries";
import { telHref } from "@/lib/format";

interface CtaBandProps {
  title?: string;
  text?: string;
  /** Lien du CTA principal (préremplissage du formulaire, par ex.). */
  to?: string;
}

/** Appel à l'action final : l'un des rares aplats en dégradé du site. */
export function CtaBand({
  title = "Un projet en tête ? Parlons-en.",
  text = "Stratégie, création, production, événement ou accompagnement : décrivez-nous votre besoin, nous revenons vers vous avec une proposition adaptée.",
  to = PRIMARY_CTA.to,
}: CtaBandProps) {
  const { data: site } = useSiteInfo();
  const phone = site?.phones[0];

  return (
    <section className="defer-render container-page py-20 sm:py-28" aria-labelledby="cta-title">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-brand px-6 py-16 text-white sm:rounded-[2.5rem] sm:px-14 sm:py-20 lg:px-20 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-noise" aria-hidden="true" />
        <Orbits tone="dark" className="absolute -right-32 -top-40 -z-10 size-[42rem] opacity-80" />
        <div className="absolute -bottom-10 right-10 -z-10 hidden w-[26rem] opacity-[0.12] mix-blend-luminosity lg:block" aria-hidden="true">
          <Mark className="w-full brightness-[3] grayscale" />
        </div>

        <div className="max-w-3xl">
          <Slashes className="h-3.5" />
          <h2 id="cta-title" className="mt-8 text-display-lg">
            <SplitWords text={title} accentWords={["parlons-en"]} accentClassName="text-accent" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lead text-white/80">{text}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink to={to} variant="accent" size="lg" arrow>
                {PRIMARY_CTA.label}
              </ButtonLink>
              {phone ? (
                <ButtonAnchor href={telHref(phone)} variant="light" size="lg" icon={<Phone className="size-4" aria-hidden="true" />}>
                  {phone}
                </ButtonAnchor>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
