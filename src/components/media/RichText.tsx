import DOMPurify from "dompurify";
import { Fragment, type ReactNode } from "react";
import { useIsHydrated } from "@/hooks/ui";
import { cn } from "@/lib/cn";
import { parseVideoUrl } from "@/lib/video";
import { VideoEmbed } from "./VideoEmbed";


/**
 * Rendu sûr du contenu saisi au back-office (articles, réalisations, services).
 *
 * Format : Markdown léger — paragraphes séparés par une ligne vide, titres `##` / `###`,
 * listes `-` ou `1.`, citations `>`, **gras**, *italique*, [liens](https://…).
 * Une URL YouTube / Vimeo seule sur sa ligne devient un lecteur vidéo.
 *
 * ⚠ C'est le format enregistré par upcom-admin, dont l'aperçu reproduit ce rendu :
 * toute évolution de syntaxe doit être répercutée dans le back-office.
 *
 * Si le contenu est du HTML (éditeur riche), il est nettoyé par DOMPurify avant
 * affichage (scripts, iframes, styles et gestionnaires d'événements supprimés).
 */

const HTML_CONTENT = /^\s*<(p|h[1-6]|ul|ol|div|blockquote|figure|section|br|strong|em|a|img|table)[\s>/]/i;

// Liens externes : nouvel onglet sécurisé. (DOMPurify n'opère que dans le navigateur.)
if (typeof window !== "undefined") DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && /^https?:\/\//.test(node.getAttribute("href") ?? "")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
  if (node.tagName === "IMG") {
    node.setAttribute("loading", "lazy");
    node.setAttribute("decoding", "async");
  }
});

function SanitizedHtml({ html, className }: { html: string; className?: string }) {
  // Nettoyage côté navigateur uniquement : rien n'est rendu au pré-rendu, ni au tout premier rendu d'hydratation.
  const isClient = useIsHydrated();
  if (!isClient) return <div className={cn("prose-upcom", className)} />;
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style", "form", "input", "button", "iframe", "object", "embed"],
    FORBID_ATTR: ["style"],
  });
  return <div className={cn("prose-upcom", className)} dangerouslySetInnerHTML={{ __html: clean }} />;
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\((?:https?:\/\/|mailto:|tel:|\/)[^)\s]+\))/g;

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={index}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href = ""] = link;
      const external = /^https?:\/\//.test(href);
      return (
        <a key={index} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {label}
        </a>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

const withLineBreaks = (text: string): ReactNode[] =>
  text.split("\n").flatMap((line, index) => (index === 0 ? renderInline(line) : [<br key={`br-${index}`} />, ...renderInline(line)]));

export function RichText({ content, className, videoTitle = "Vidéo" }: { content: string | null | undefined; className?: string; videoTitle?: string }) {
  if (!content?.trim()) return null;
  if (HTML_CONTENT.test(content)) return <SanitizedHtml html={content} className={className} />;
  const blocks = content.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);

  return (
    <div className={cn("prose-upcom", className)}>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        const lines = trimmed.split("\n");

        const video = lines.length === 1 ? parseVideoUrl(trimmed) : null;
        if (video) return <VideoEmbed key={index} source={video} title={videoTitle} />;
        if (trimmed.startsWith("### ")) return <h3 key={index}>{renderInline(trimmed.slice(4))}</h3>;
        if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) return <h2 key={index}>{renderInline(trimmed.replace(/^#{1,2} /, ""))}</h2>;
        if (lines.every((line) => /^\s*[-*•] /.test(line)))
          return (
            <ul key={index}>
              {lines.map((line, item) => (
                <li key={item}>{renderInline(line.replace(/^\s*[-*•] /, ""))}</li>
              ))}
            </ul>
          );
        if (lines.every((line) => /^\s*\d+[.)] /.test(line)))
          return (
            <ol key={index}>
              {lines.map((line, item) => (
                <li key={item}>{renderInline(line.replace(/^\s*\d+[.)] /, ""))}</li>
              ))}
            </ol>
          );
        if (lines.every((line) => line.startsWith(">")))
          return <blockquote key={index}>{withLineBreaks(lines.map((line) => line.replace(/^>\s?/, "")).join("\n"))}</blockquote>;
        return <p key={index}>{withLineBreaks(trimmed)}</p>;
      })}
    </div>
  );
}
