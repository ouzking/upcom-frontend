/**
 * Validation côté client, alignée sur les schémas zod des Edge Functions
 * (upcom-backend/supabase/functions/_shared/validation.ts). Le serveur reste
 * l'autorité : ses erreurs par champ sont affichées telles quelles.
 */
export const PHONE_PATTERN = /^\+?[0-9 ().-]{6,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Errors<K extends string> = Partial<Record<K, string>>;

export function validateName(value: string): string | undefined {
  const length = value.trim().length;
  if (length < 2) return "Le nom doit contenir au moins 2 caractères.";
  if (length > 120) return "Le nom ne peut pas dépasser 120 caractères.";
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "L'adresse e-mail est requise.";
  if (!EMAIL_PATTERN.test(value.trim()) || value.length > 254) return "Adresse e-mail invalide.";
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (!value.trim()) return undefined;
  return PHONE_PATTERN.test(value.trim()) ? undefined : "Numéro de téléphone invalide.";
}

export function validateMessage(value: string): string | undefined {
  const length = value.trim().length;
  if (length < 10) return "Le message doit contenir au moins 10 caractères.";
  if (length > 5000) return "Le message ne peut pas dépasser 5000 caractères.";
  return undefined;
}

export const todayIso = (): string => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

export function validateDeadline(value: string): string | undefined {
  if (!value) return undefined;
  return value >= todayIso() ? undefined : "La date souhaitée ne peut pas être dans le passé.";
}

export const optional = (value: string): string | null => (value.trim() ? value.trim() : null);

export const hasErrors = <K extends string>(errors: Errors<K>): boolean => Object.values(errors).some(Boolean);
