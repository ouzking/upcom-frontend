import { FunctionsHttpError } from "@supabase/supabase-js";
import {
  EDGE_FUNCTIONS,
  type ApiErrorCode,
  type ApiResponse,
  type SubmitContactMessagePayload,
  type SubmitContactMessageResult,
  type SubmitQuoteRequestPayload,
  type SubmitQuoteRequestResult,
  type ValidationIssue,
} from "@upcom/supabase";
import { getSupabase } from "@/lib/supabase";

/**
 * Envoi des formulaires publics via les Edge Functions d'upcom-backend
 * (validation zod, honeypot, Turnstile, rate-limit, notification e-mail).
 * Le site n'écrit jamais directement dans les tables.
 */

export class FormSubmissionError extends Error {
  readonly code: ApiErrorCode | "network_error";
  /** Erreurs par champ (messages en français fournis par le backend). */
  readonly fieldErrors: Record<string, string>;

  constructor(code: FormSubmissionError["code"], message: string, details: ValidationIssue[] = []) {
    super(message);
    this.name = "FormSubmissionError";
    this.code = code;
    this.fieldErrors = Object.fromEntries(details.map((issue) => [issue.field, issue.message]));
  }
}

const FALLBACK_MESSAGES: Partial<Record<FormSubmissionError["code"], string>> = {
  rate_limited: "Vous avez envoyé plusieurs demandes en peu de temps. Merci de réessayer dans quelques minutes.",
  captcha_failed: "La vérification anti-robot a échoué. Merci de réessayer.",
  network_error: "Connexion impossible. Vérifiez votre réseau puis réessayez.",
};

type ApiErrorBody = Extract<ApiResponse<unknown>, { ok: false }>["error"];

/** Extrait `{ error: { code, message, details } }` du corps d'erreur (avec ou sans `ok: false`). */
const readErrorBody = (value: unknown): ApiErrorBody | null => {
  if (typeof value !== "object" || value === null || !("error" in value)) return null;
  const error = (value as { error: unknown }).error;
  return typeof error === "object" && error !== null && "code" in error ? (error as ApiErrorBody) : null;
};

async function invoke<TResult>(name: string, body: object): Promise<TResult> {
  const client = await getSupabase();
  const { data, error } = await client.functions.invoke<ApiResponse<TResult>>(name, { body });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const response = error.context as Response;
      const body = readErrorBody(await response.json().catch(() => null));
      if (body) {
        throw new FormSubmissionError(body.code, FALLBACK_MESSAGES[body.code] ?? body.message, body.details);
      }
      // Corps illisible (proxy, passerelle…) : le statut HTTP suffit pour le cas du rate-limit.
      if (response.status === 429) throw new FormSubmissionError("rate_limited", FALLBACK_MESSAGES.rate_limited ?? "");
      throw new FormSubmissionError("internal_error", "Une erreur est survenue. Merci de réessayer.");
    }
    throw new FormSubmissionError("network_error", FALLBACK_MESSAGES.network_error ?? "");
  }

  if (!data || !data.ok) {
    throw new FormSubmissionError("internal_error", data?.ok === false ? data.error.message : "Réponse inattendue du serveur.");
  }
  return data.data;
}

export const submitQuoteRequest = (payload: SubmitQuoteRequestPayload) =>
  invoke<SubmitQuoteRequestResult>(EDGE_FUNCTIONS.submitQuoteRequest, payload);

export const submitContactMessage = (payload: SubmitContactMessagePayload) =>
  invoke<SubmitContactMessageResult>(EDGE_FUNCTIONS.submitContactMessage, payload);
