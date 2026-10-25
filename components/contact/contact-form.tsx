"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "@/app/(site)/contact/actions";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-2 w-full border border-black/20 bg-white px-4 py-3 outline-none transition-colors focus:border-gold-dark aria-invalid:border-red-600";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", company: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("idle");
    const result = await sendContactMessage(values).catch(() => ({
      ok: false as const,
      error: "Network error. Please try again.",
      fieldErrors: undefined,
    }));
    if (result.ok) {
      setStatus("success");
      reset();
      return;
    }
    for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
      if (messages?.[0]) setError(field as keyof ContactInput, { message: messages[0] });
    }
    setServerError(result.error);
    setStatus("error");
  });

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center bg-off-white px-6 py-14 text-center">
        <CheckCircle2 aria-hidden className="size-10 text-gold-dark" strokeWidth={1.4} />
        <p className="mt-4 font-serif text-3xl">Thank you</p>
        <p className="mt-2 text-muted">Your message has been sent. We will get back to you soon.</p>
        <Button variant="outline-dark" className="mt-8" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message} id="name">
          <input id="name" autoComplete="name" className={inputClass} aria-invalid={!!errors.name} aria-describedby="name-error" {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message} id="email">
          <input id="email" type="email" autoComplete="email" className={inputClass} aria-invalid={!!errors.email} aria-describedby="email-error" {...register("email")} />
        </Field>
      </div>
      <Field label="Phone (optional)" error={errors.phone?.message} id="phone">
        <input id="phone" type="tel" autoComplete="tel" className={inputClass} aria-invalid={!!errors.phone} aria-describedby="phone-error" {...register("phone")} />
      </Field>
      <Field label="Message" error={errors.message?.message} id="message">
        <textarea id="message" rows={6} className={inputClass} aria-invalid={!!errors.message} aria-describedby="message-error" {...register("message")} />
      </Field>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto sm:px-12">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

function Field({ label, error, id, children }: { label: string; error?: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-[0.2em]">
        {label}
      </label>
      {children}
      <p id={`${id}-error`} className="mt-1 min-h-5 text-sm text-red-700">
        {error}
      </p>
    </div>
  );
}
