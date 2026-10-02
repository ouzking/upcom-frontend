import { useParams } from "react-router";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { RichText } from "@/components/media/RichText";
import { SmartImage } from "@/components/media/SmartImage";
import { CssReveal, ImageReveal } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { absoluteUrl } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { ROUTES } from "@/config/site";
import { COMPANY } from "@/content/company";
import { useService } from "@/hooks/queries";
import NotFoundPage from "./NotFoundPage";
import { StockPicture } from "@/components/media/StockPicture";
import { EXPERTISE_IMAGES } from "@/content/media";

export default function ServiceDetailPage() {
  const { expertiseSlug = "", serviceSlug = "" } = useParams();
  const { data: service, isPending, isError, refetch } = useService(serviceSlug);

  if (isPending) {
    return (
      <div className="container-page space-y-6 pb-24 pt-40">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-3/4" />
        <Skeleton className="aspect-[16/7]" />
      </div>
    );
  }
  if (isError) return <ErrorState className="container-page mb-24 mt-40" onRetry={() => void refetch()} />;
  if (!service || (service.category && service.category.slug !== expertiseSlug)) return <NotFoundPage />;

  const category = service.category;
  const quoteLink = `${ROUTES.quote}?service=${service.id}`;

  return (
    <>
      <Seo
        title={service.title}
        description={service.shortDescription ?? `${service.title} — ${category?.name ?? "UPCOM AGENCY & SERVICES"}`}
        image={service.imageUrl}
        jsonLd={{
          "@type": "Service",
          name: service.title,
          description: service.shortDescription ?? undefined,
          serviceType: category?.name,
          url: absoluteUrl(ROUTES.service(expertiseSlug, service.slug)),
          provider: { "@type": "LocalBusiness", name: COMPANY.name },
        }}
      />
      <PageHero
        eyebrow={category?.name ?? "Service"}
        title={service.title}
        intro={service.shortDescription}
        crumbs={[
          { label: "Services", to: ROUTES.services },
          ...(category ? [{ label: category.name, to: ROUTES.expertise(category.slug) }] : []),
          { label: service.title },
        ]}
      >
        <CssReveal delay={0.45} className="mt-10">
          <ButtonLink to={quoteLink} variant="accent" size="lg" arrow>
            Demander un devis
          </ButtonLink>
        </CssReveal>
      </PageHero>

      <article className="container-page py-20 sm:py-28">
        {service.imageUrl ? (
          <ImageReveal disabled className="mb-16 rounded-[2rem]">
            <SmartImage src={service.imageUrl} alt={service.title} priority className="aspect-[16/8] rounded-[2rem]" />
          </ImageReveal>
        ) : category && EXPERTISE_IMAGES[category.slug] ? (
          // Pas encore d'image pour cette prestation : visuel d'illustration de son pôle.
          <StockPicture image={EXPERTISE_IMAGES[category.slug]!} sizes="(min-width: 1408px) 1300px, 100vw" priority className="mb-16 aspect-[4/3] rounded-[2rem] sm:aspect-[16/8]" />
        ) : null}
        <div className="mx-auto max-w-3xl">
          {service.description ? (
            <RichText content={service.description} videoTitle={service.title} />
          ) : (
            <p className="text-lead text-muted">Contactez-nous pour obtenir le détail de cette prestation et une proposition adaptée à votre projet.</p>
          )}
        </div>
      </article>

      <CtaBand to={quoteLink} />
    </>
  );
}
