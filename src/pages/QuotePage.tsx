import { Phone } from "lucide-react";
import { useSearchParams } from "react-router";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Breadcrumbs } from "@/components/layout/PageHero";
import { Reveal, SplitWords } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { Orbits, Slashes } from "@/components/ui/Brand";
import { Eyebrow } from "@/components/ui/Section";
import { APPROACH } from "@/content/agency";
import { useSiteInfo } from "@/hooks/queries";
import { telHref } from "@/lib/format";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function QuotePage() {
  const [params] = useSearchParams();
  const { data: site } = useSiteInfo();
  const need = params.get("besoin") ?? "";
  const service = params.get("service") ?? "";

  return (
    <>
      <Seo
        title="Démarrer un projet"
        description="Décrivez votre projet de communication, de création, d'événement ou de services : l'équipe UPCOM revient vers vous avec une proposition adaptée."
      />
      <section className="relative isolate overflow-hidden bg-mist pb-20 pt-32 sm:pt-40">
        <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]" aria-hidden="true" />
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Breadcrumbs items={[{ label: "Démarrer un projet" }]} />
              <Reveal className="mt-10">
                <Eyebrow>Demande de projet</Eyebrow>
              </Reveal>
              <h1 className="mt-6 text-display-lg text-ink">
                <SplitWords text="Démarrons votre projet." accentWords={["projet"]} accentClassName="text-brand" immediate delay={0.1} />
              </h1>
              <Reveal delay={0.3}>
                <p className="mt-6 text-lead text-muted">Quelques informations suffisent : l'équipe UPCOM étudie votre besoin et revient vers vous pour en échanger.</p>

                <ol className="mt-10 space-y-4">
                  {APPROACH.map((step, index) => (
                    <li key={step.title} className="flex items-center gap-4">
                      <span className="flex size-8 items-center justify-center rounded-full border border-brand/20 bg-white font-display text-xs font-bold text-brand">{index + 1}</span>
                      <span className="font-semibold text-ink">{step.title}</span>
                    </li>
                  ))}
                </ol>

                <div className="relative mt-12 overflow-hidden rounded-[1.75rem] bg-brand-night p-7 text-white">
                  <Orbits tone="dark" className="absolute -right-24 -top-24 size-72 opacity-60" />
                  <Slashes className="h-3" />
                  <p className="mt-5 font-display text-lg font-semibold">Vous préférez en parler de vive voix ?</p>
                  <ul className="mt-4 space-y-2">
                    {site?.phones.map((phone) => (
                      <li key={phone}>
                        <a href={telHref(phone)} className="inline-flex items-center gap-2 font-semibold transition hover:text-accent">
                          <Phone className="size-4 text-accent" aria-hidden="true" />
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </aside>

          <Reveal delay={0.15} className="lg:col-span-8">
            <div className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_40px_80px_-50px_rgba(1,53,146,0.35)] sm:p-10 lg:p-14">
              <QuoteForm initialNeed={need} initialServiceId={UUID.test(service) ? service : ""} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
