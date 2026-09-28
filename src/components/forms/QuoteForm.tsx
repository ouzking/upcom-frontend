import { useMutation } from "@tanstack/react-query";
import type { SubmitQuoteRequestPayload } from "@upcom/supabase";
import { Send } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useExpertises, useServices } from "@/hooks/queries";
import { FormSubmissionError, submitQuoteRequest } from "@/services/forms.service";
import { ChoiceGroup, Honeypot, SelectField, TextAreaField, TextField, type Choice } from "./fields";
import { FormAlert, FormSuccess } from "./FormFeedback";
import { isTurnstileEnabled } from "@/config/env";
import { Turnstile } from "./Turnstile";
import {
  hasErrors,
  optional,
  todayIso,
  validateDeadline,
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
  type Errors,
} from "./validation";
import { Link } from "react-router";
import { ROUTES } from "@/config/site";

type Field = "need" | "service_id" | "budget" | "deadline" | "message" | "name" | "company" | "email" | "phone" | "captcha";

const OTHER_NEED = "autre";

/** Fourchettes indicatives (aide à la qualification, non contractuelles). */
const BUDGETS: readonly Choice[] = [
  { value: "Moins de 500 000 FCFA", label: "Moins de 500 000 FCFA" },
  { value: "500 000 – 1 500 000 FCFA", label: "500 000 – 1 500 000 FCFA" },
  { value: "1 500 000 – 5 000 000 FCFA", label: "1,5 – 5 millions FCFA" },
  { value: "Plus de 5 000 000 FCFA", label: "Plus de 5 millions FCFA" },
  { value: "À définir ensemble", label: "À définir ensemble" },
];

interface QuoteFormProps {
  /** Pôle présélectionné (?besoin=<slug>). */
  initialNeed?: string;
  /** Prestation présélectionnée (?service=<uuid>). */
  initialServiceId?: string;
}

function StepTitle({ id, index, title, text }: { id: string; index: string; title: string; text?: string }) {
  return (
    <div className="mb-8 flex items-start gap-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-white">{index}</span>
      <div>
        <h2 id={id} className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h2>
        {text ? <p className="mt-1 text-muted">{text}</p> : null}
      </div>
    </div>
  );
}

export function QuoteForm({ initialNeed = "", initialServiceId = "" }: QuoteFormProps) {
  const { data: expertises = [] } = useExpertises();
  const { data: services = [] } = useServices();

  const [values, setValues] = useState({
    need: initialNeed,
    service_id: initialServiceId,
    budget: "",
    deadline: "",
    message: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    website: "",
  });
  const [captcha, setCaptcha] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [errors, setErrors] = useState<Errors<Field>>({});

  // Le service présélectionné détermine le pôle s'il n'est pas fourni.
  const preselected = services.find((service) => service.id === values.service_id);
  const need = values.need || preselected?.category?.slug || "";

  const needChoices: Choice[] = useMemo(
    () => [
      ...expertises.map((expertise) => {
        return { value: expertise.slug, label: expertise.name, icon: <DynamicIcon name={expertise.icon} className="size-4 shrink-0 opacity-80" aria-hidden="true" /> };
      }),
      { value: OTHER_NEED, label: "Autre besoin" },
    ],
    [expertises],
  );
  const needServices = services.filter((service) => service.category?.slug === need);

  const mutation = useMutation({
    mutationFn: submitQuoteRequest,
    onError: (error) => {
      if (error instanceof FormSubmissionError) setErrors(error.fieldErrors as Errors<Field>);
      setCaptchaKey((key) => key + 1);
      setCaptcha("");
    },
  });

  const set = (field: keyof typeof values) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value, ...(field === "need" ? { service_id: "" } : {}) }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Errors<Field> = {
      need: need ? undefined : "Sélectionnez le type de besoin.",
      name: validateName(values.name),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      deadline: validateDeadline(values.deadline),
      message: validateMessage(values.message),
      captcha: isTurnstileEnabled && !captcha ? "Merci de valider la vérification anti-robot." : undefined,
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      document.querySelector<HTMLElement>("[aria-invalid='true'], fieldset [role='alert']")?.focus();
      return;
    }

    // Le contrat de l'API n'a pas de champ « pôle » : sans prestation précise,
    // le type de besoin est indiqué en tête du message pour l'équipe commerciale.
    const needLabel = needChoices.find((choice) => choice.value === need)?.label;
    const message = values.service_id || !needLabel ? values.message.trim() : `Type de besoin : ${needLabel}\n\n${values.message.trim()}`;

    const payload: SubmitQuoteRequestPayload = {
      name: values.name.trim(),
      company: optional(values.company),
      email: values.email.trim(),
      phone: optional(values.phone),
      service_id: optional(values.service_id),
      budget: optional(values.budget),
      deadline: optional(values.deadline),
      message,
      website: values.website,
      ...(isTurnstileEnabled ? { captcha_token: captcha } : {}),
    };
    mutation.mutate(payload);
  };

  if (mutation.isSuccess) {
    return (
      <FormSuccess
        title="Merci, votre demande est bien envoyée."
        email={mutation.variables?.email}
        text="L'équipe UPCOM étudie votre projet et revient vers vous rapidement pour en échanger. Pensez à vérifier vos courriers indésirables."
        actions={
          <ButtonLink to="/" variant="outline">
            Retour à l'accueil
          </ButtonLink>
        }
      />
    );
  }

  const serverError = mutation.error instanceof FormSubmissionError ? mutation.error.message : mutation.error ? "Une erreur est survenue. Merci de réessayer." : null;

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-14" aria-describedby="quote-required-note">
      <p id="quote-required-note" className="text-sm text-muted">
        Les champs marqués d'un <span className="text-accent-deep">*</span> sont obligatoires.
      </p>

      <section aria-labelledby="quote-step-1">
        <StepTitle id="quote-step-1" index="01" title="Votre projet" text="Quel est votre besoin principal ?" />
        <div className="space-y-8">
          <ChoiceGroup legend="Type de besoin" name="need" choices={needChoices} value={need} onChange={set("need")} error={errors.need} required />
          {needServices.length > 0 ? (
            <SelectField label="Prestation" value={values.service_id} onChange={(event) => set("service_id")(event.target.value)} error={errors.service_id}>
              <option value="">Pas de prestation précise</option>
              {needServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </SelectField>
          ) : null}
          <ChoiceGroup legend="Budget indicatif" name="budget" choices={BUDGETS} value={values.budget} onChange={set("budget")} error={errors.budget} columns="sm:grid-cols-2 lg:grid-cols-3" />
          <TextField
            type="date"
            label="Délai souhaité"
            min={todayIso()}
            value={values.deadline}
            onChange={(event) => set("deadline")(event.target.value)}
            error={errors.deadline}
            hint="Date à laquelle vous souhaitez disposer du livrable ou tenir l'événement."
            className="max-w-sm"
          />
        </div>
      </section>

      <section aria-labelledby="quote-step-2">
        <StepTitle id="quote-step-2" index="02" title="Description" text="Contexte, objectifs, public visé, livrables attendus…" />
        <TextAreaField
          label="Décrivez votre projet"
          required
          rows={7}
          maxLength={5000}
          value={values.message}
          onChange={(event) => set("message")(event.target.value)}
          error={errors.message}
          hint={`${values.message.trim().length} / 5000 caractères — 10 minimum.`}
        />
      </section>

      <section aria-labelledby="quote-step-3">
        <StepTitle id="quote-step-3" index="03" title="Vos coordonnées" text="Pour vous recontacter au sujet de votre demande." />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Nom" required autoComplete="name" maxLength={120} value={values.name} onChange={(event) => set("name")(event.target.value)} error={errors.name} />
          <TextField label="Entreprise / organisation" autoComplete="organization" maxLength={160} value={values.company} onChange={(event) => set("company")(event.target.value)} error={errors.company} />
          <TextField label="E-mail" type="email" required autoComplete="email" inputMode="email" value={values.email} onChange={(event) => set("email")(event.target.value)} error={errors.email} />
          <TextField label="Téléphone" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={(event) => set("phone")(event.target.value)} error={errors.phone} />
        </div>
      </section>

      <Honeypot value={values.website} onChange={set("website")} />

      <div className="space-y-6 border-t border-line pt-10">
        <Turnstile onToken={setCaptcha} resetKey={captchaKey} />
        {errors.captcha ? (
          <p className="text-sm font-medium text-accent-deep" role="alert">
            {errors.captcha}
          </p>
        ) : null}
        {serverError ? <FormAlert message={serverError} /> : null}
        <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-xs leading-relaxed text-muted">
            Vos informations sont utilisées uniquement pour traiter votre demande et ne sont jamais cédées à des tiers. <Link to={ROUTES.privacy} className="underline underline-offset-2 hover:text-brand">Politique de confidentialité</Link>
          </p>
          <Button type="submit" variant="accent" size="lg" disabled={mutation.isPending} icon={<Send className="size-4" aria-hidden="true" />}>
            {mutation.isPending ? "Envoi en cours…" : "Envoyer ma demande"}
          </Button>
        </div>
      </div>
    </form>
  );
}
