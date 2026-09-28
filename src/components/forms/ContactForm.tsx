import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormSubmissionError, submitContactMessage } from "@/services/forms.service";
import { Honeypot, TextAreaField, TextField } from "./fields";
import { FormAlert, FormSuccess } from "./FormFeedback";
import { isTurnstileEnabled } from "@/config/env";
import { Turnstile } from "./Turnstile";
import { hasErrors, optional, validateEmail, validateMessage, validateName, validatePhone, type Errors } from "./validation";
import { Link } from "react-router";
import { ROUTES } from "@/config/site";

type Field = "name" | "email" | "phone" | "subject" | "message" | "captcha";

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [captcha, setCaptcha] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [errors, setErrors] = useState<Errors<Field>>({});

  const mutation = useMutation({
    mutationFn: submitContactMessage,
    onError: (error) => {
      if (error instanceof FormSubmissionError) setErrors(error.fieldErrors as Errors<Field>);
      setCaptchaKey((key) => key + 1);
      setCaptcha("");
    },
  });

  const set = (field: keyof typeof values) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Errors<Field> = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      subject: values.subject.length > 200 ? "Objet : 200 caractères maximum." : undefined,
      message: validateMessage(values.message),
      captcha: isTurnstileEnabled && !captcha ? "Merci de valider la vérification anti-robot." : undefined,
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    mutation.mutate({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: optional(values.phone),
      subject: optional(values.subject),
      message: values.message.trim(),
      website: values.website,
      ...(isTurnstileEnabled ? { captcha_token: captcha } : {}),
    });
  };

  if (mutation.isSuccess) {
    return (
      <FormSuccess
        title="Message envoyé, merci !"
        email={mutation.variables?.email}
        text="Nous avons bien reçu votre message. L'équipe UPCOM vous répondra dans les meilleurs délais. Pensez à vérifier vos courriers indésirables."
        actions={
          <Button
            variant="outline"
            onClick={() => {
              mutation.reset();
              setValues({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
            }}
          >
            Envoyer un autre message
          </Button>
        }
      />
    );
  }

  const serverError = mutation.error instanceof FormSubmissionError ? mutation.error.message : mutation.error ? "Une erreur est survenue. Merci de réessayer." : null;

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Nom" required autoComplete="name" maxLength={120} value={values.name} onChange={(event) => set("name")(event.target.value)} error={errors.name} />
        <TextField label="E-mail" type="email" required autoComplete="email" inputMode="email" value={values.email} onChange={(event) => set("email")(event.target.value)} error={errors.email} />
        <TextField label="Téléphone" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={(event) => set("phone")(event.target.value)} error={errors.phone} />
        <TextField label="Objet" maxLength={200} value={values.subject} onChange={(event) => set("subject")(event.target.value)} error={errors.subject} />
      </div>
      <TextAreaField label="Message" required rows={6} maxLength={5000} value={values.message} onChange={(event) => set("message")(event.target.value)} error={errors.message} />
      <Honeypot value={values.website} onChange={set("website")} />
      <Turnstile onToken={setCaptcha} resetKey={captchaKey} />
      {errors.captcha ? (
        <p className="text-sm font-medium text-accent-deep" role="alert">
          {errors.captcha}
        </p>
      ) : null}
      {serverError ? <FormAlert message={serverError} /> : null}
      <div className="flex flex-col-reverse gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-muted">Vos informations sont utilisées uniquement pour répondre à votre message. <Link to={ROUTES.privacy} className="underline underline-offset-2 hover:text-brand">Politique de confidentialité</Link></p>
        <Button type="submit" variant="primary" size="lg" disabled={mutation.isPending} icon={<Send className="size-4" aria-hidden="true" />}>
          {mutation.isPending ? "Envoi en cours…" : "Envoyer le message"}
        </Button>
      </div>
    </form>
  );
}
