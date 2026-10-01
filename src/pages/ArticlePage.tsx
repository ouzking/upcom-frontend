import { ArrowLeft, Check, Link2 } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { Breadcrumbs } from "@/components/layout/PageHero";
import { RichText } from "@/components/media/RichText";
import { SmartImage } from "@/components/media/SmartImage";
import { SocialIcon } from "@/components/media/SocialIcon";
import { CssReveal, ImageReveal, SplitWords } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { absoluteUrl } from "@/lib/seo";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { ROUTES } from "@/config/site";
import { COMPANY } from "@/content/company";
import { useArticle, useRelatedArticles } from "@/hooks/queries";
import { formatDate, readingTime } from "@/lib/format";
import NotFoundPage from "./NotFoundPage";

function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const links = [
    { platform: "linkedin" as const, label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { platform: "facebook" as const, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { platform: "whatsapp" as const, label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Partager</span>
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition hover:border-brand hover:bg-brand hover:text-white"
          aria-label={`Partager sur ${link.label} (nouvelle fenêtre)`}
        >
          <SocialIcon platform={link.platform} className="size-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={() => void copy()}
        className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition hover:border-brand hover:bg-brand hover:text-white"
        aria-label={copied ? "Lien copié" : "Copier le lien"}
      >
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

export default function ArticlePage() {
  const { slug = "" } = useParams();
  const { data: article, isPending, isError, refetch } = useArticle(slug);
  const { data: related } = useRelatedArticles(article);

  if (isPending) {
    return (
      <div className="container-page mx-auto max-w-4xl space-y-6 pb-24 pt-40">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24" />
        <Skeleton className="aspect-[16/9]" />
      </div>
    );
  }
  if (isError) return <ErrorState className="container-page mb-24 mt-40" onRetry={() => void refetch()} />;
  if (!article) return <NotFoundPage />;

  const url = absoluteUrl(ROUTES.article(article.slug));
  const minutes = readingTime(article.content);

  return (
    <>
      <Seo
        title={article.title}
        description={article.excerpt ?? article.title}
        image={article.coverUrl}
        type="article"
        publishedTime={article.publishedAt}
        jsonLd={{
          "@type": "Article",
          headline: article.title,
          description: article.excerpt ?? undefined,
          image: article.coverUrl ?? undefined,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: article.authorName ? { "@type": "Person", name: article.authorName } : { "@type": "Organization", name: COMPANY.name },
          publisher: { "@type": "Organization", name: COMPANY.name, logo: { "@type": "ImageObject", url: absoluteUrl("/icon-512.png") } },
          mainEntityOfPage: url,
          articleSection: article.category?.name,
        }}
      />

      <article>
        <header className="container-page max-w-5xl pb-12 pt-32 sm:pt-40">
          <Breadcrumbs items={[{ label: "Actualités", to: ROUTES.news }, { label: article.title }]} />
          <CssReveal className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            {article.category ? (
              <Link to={`${ROUTES.news}?categorie=${article.category.slug}`} className="rounded-full bg-accent/15 px-3 py-1 font-semibold text-accent-ink transition hover:bg-accent/25">
                {article.category.name}
              </Link>
            ) : null}
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{minutes} min de lecture</span>
          </CssReveal>
          <h1 className="mt-6 text-display-lg text-ink">
            <SplitWords text={article.title} immediate delay={0.1} />
          </h1>
          {article.excerpt ? (
            <CssReveal delay={0.3}>
              <p className="mt-8 text-lead text-muted">{article.excerpt}</p>
            </CssReveal>
          ) : null}
          <CssReveal delay={0.4} className="mt-10 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              <span className="text-muted">Par </span>
              <span className="font-semibold text-ink">{article.authorName ?? COMPANY.name}</span>
            </p>
            <ShareBar url={url} title={article.title} />
          </CssReveal>
        </header>

        {article.coverUrl ? (
          <div className="container-page max-w-6xl">
            <ImageReveal disabled className="rounded-[2rem]">
              <SmartImage src={article.coverUrl} alt={article.title} priority className="aspect-[16/9] rounded-[2rem]" sizes="(min-width: 1280px) 1150px, 100vw" />
            </ImageReveal>
          </div>
        ) : null}

        <div className="container-page max-w-3xl py-16 sm:py-24">
          <RichText content={article.content} videoTitle={article.title} />
          <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link to={ROUTES.news} className="inline-flex items-center gap-2 font-semibold text-brand hover:underline">
              <ArrowLeft className="size-4" aria-hidden="true" /> Toutes les actualités
            </Link>
            <ShareBar url={url} title={article.title} />
          </div>
        </div>
      </article>

      {related && related.items.length > 0 ? (
        <section className="border-t border-line bg-mist py-24" aria-labelledby="related-articles">
          <div className="container-page">
            <h2 id="related-articles" className="text-display-sm text-ink">
              À lire aussi
            </h2>
            <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.items.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <CtaBand />
    </>
  );
}
