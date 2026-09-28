import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";

const LOCAL_HOST = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?(\/|$)/i;

/**
 * Garde-fou : un build de production ne doit jamais embarquer une configuration
 * absente ou locale (sinon les visiteurs voient une demande d'accès au réseau local).
 */
function assertProductionEnv(mode: string): void {
  const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env };
  const url = env.VITE_SUPABASE_URL?.trim() ?? "";
  const key = (env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || "").trim();
  const site = env.VITE_SITE_URL?.trim() ?? "";
  const errors: string[] = [];
  if (!url) errors.push("VITE_SUPABASE_URL est manquante.");
  else if (LOCAL_HOST.test(url)) errors.push(`VITE_SUPABASE_URL pointe vers une adresse locale : ${url}`);
  else if (!url.startsWith("https://")) errors.push(`VITE_SUPABASE_URL doit être en https : ${url}`);
  if (!key) errors.push("VITE_SUPABASE_PUBLISHABLE_KEY est manquante.");
  if (site && LOCAL_HOST.test(site)) errors.push(`VITE_SITE_URL pointe vers une adresse locale : ${site}`);
  if (errors.length > 0) {
    throw new Error(`\n[UPCOM] Build de production refusé :\n  - ${errors.join("\n  - ")}\n  Définissez ces variables (Netlify : Site configuration → Environment variables).\n`);
  }
}

/** Préconnexion au projet Supabase (dérivée de VITE_SUPABASE_URL, jamais codée en dur). */
function supabasePreconnect(mode: string): Plugin {
  return {
    name: "upcom-supabase-preconnect",
    transformIndexHtml() {
      const url = ({ ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env }).VITE_SUPABASE_URL;
      if (!url) return [];
      return [{ tag: "link", attrs: { rel: "preconnect", href: new URL(url).origin, crossorigin: "" }, injectTo: "head" }];
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === "build" && mode === "production") assertProductionEnv(mode);

  return {
    plugins: [react(), tailwindcss(), supabasePreconnect(mode)],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: {
      target: "es2022",
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Bibliothèques stables isolées : meilleur cache navigateur entre deux déploiements.
          // (Framer Motion n'est pas regroupé : ses fonctionnalités sont chargées à la demande par LazyMotion.)
          manualChunks(id: string) {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("@supabase")) return "supabase";
            if (id.includes("react-router")) return "router";
            if (id.includes("@tanstack")) return "query";
            if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
            return undefined;
          },
        },
      },
    },
    server: { port: 5173 },
    preview: { port: 4173 },
  };
});
