export interface VideoSource {
  provider: "youtube" | "vimeo";
  id: string;
}

/** Reconnaît une URL YouTube ou Vimeo. */
export function parseVideoUrl(url: string): VideoSource | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return parsed.pathname.slice(1) ? { provider: "youtube", id: parsed.pathname.slice(1) } : null;
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const id = parsed.searchParams.get("v") ?? parsed.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
      return id ? { provider: "youtube", id } : null;
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = parsed.pathname.match(/(\d{6,})/)?.[1];
      return id ? { provider: "vimeo", id } : null;
    }
  } catch {
    return null;
  }
  return null;
}
