import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Accent, Eyebrow } from "@/components/ui/Section";
import { PRIMARY_CTA } from "@/config/site";
import { COMMITMENTS } from "@/content/agency";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

/** Engagements d'UPCOM (issus du cahier des charges) — aucun chiffre inventé. */
export function WhyUpcom({ index = "06" }: { index?: string }) {
  return (
    <section className="defer-render relative border-t border-line py-24 sm:py-32 lg:py-40" aria-labelledby="why-title">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-32">
            <Eyebrow index={index}>Pourquoi UPCOM</Eyebrow>
            <h2 id="why-title" className="mt-5 text-display-md text-ink">
              Un partenaire engagé pour <Accent>votre image</Accent>.
            </h2>
            <p className="mt-6 max-w-md text-lead text-muted">
              Une agence qui réunit conseil, création, production et services, avec une même exigence de qualité.
            </p>
            <ButtonLink to={PRIMARY_CTA.to} variant="primary" arrow className="mt-10">
              {PRIMARY_CTA.label}
            </ButtonLink>
          </Reveal>
        </div>

        <Stagger className="lg:col-span-7" stagger={0.1}>
          {COMMITMENTS.map((commitment, commitmentIndex) => {
            return (
              <StaggerItem
                key={commitment.title}
                className="group grid grid-cols-[auto_1fr] gap-6 border-t border-line py-9 transition-colors duration-500 last:border-b sm:gap-10"
              >
                <div className="flex flex-col items-center gap-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-mist text-brand transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
                    <DynamicIcon name={commitment.icon} className="size-6" aria-hidden="true" />
                  </span>
                  <span className="font-display text-xs font-semibold tabular-nums text-muted">{String(commitmentIndex + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <h3 className="text-display-sm text-ink">{commitment.title}</h3>
                  <p className="mt-3 max-w-lg leading-relaxed text-muted">{commitment.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
