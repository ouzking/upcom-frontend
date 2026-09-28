import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { AppProviders } from "@/app/providers";
import { router } from "@/app/router";
import { ConfigErrorScreen } from "@/app/ConfigErrorScreen";
import { getEnvErrors } from "@/config/env";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Élément #root introuvable.");
const root = createRoot(container);

// Vérification au démarrage : sans configuration Supabase valide, l'application ne démarre pas.
const envErrors = getEnvErrors();
if (envErrors.length > 0) {
  root.render(<ConfigErrorScreen errors={envErrors} />);
  throw new Error(`[UPCOM] Configuration invalide :\n- ${envErrors.join("\n- ")}\nDéfinissez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY puis relancez le build.`);
}

root.render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
