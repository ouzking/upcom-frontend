import { Seo } from "@/components/seo/Seo";
import { Orbits, Slashes } from "@/components/ui/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { MAIN_NAV, PRIMARY_CTA } from "@/config/site";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-mist pb-24 pt-40">
      <Seo title="Page introuvable" noindex />
      <Orbits className="absolute -right-40 top-10 -z-10 size-[44rem] opacity-70" />
      <div className="container-page">
        <Slashes className="h-3.5" />
        <p className="mt-8 font-display text-[clamp(6rem,20vw,14rem)] font-bold leading-none tracking-tighter text-brand">404</p>
        <h1 className="mt-4 text-display-md text-ink">Cette page n'existe pas (ou plus).</h1>
        <p className="mt-4 max-w-lg text-lead text-muted">Le lien est peut-être erroné, ou le contenu a été déplacé. Voici quelques pistes :</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {MAIN_NAV.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink to={PRIMARY_CTA.to} variant="accent" size="lg" arrow className="mt-10">
          {PRIMARY_CTA.label}
        </ButtonLink>
      </div>
    </section>
  );
}
