"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import { whatsappLink } from "@/config/site";
import { settingsSchema, type SettingsInput } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const input =
  "mt-1.5 w-full border border-black/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold-dark aria-invalid:border-red-600";

type FieldDef = { name: keyof SettingsInput; label: string; hint?: string; type?: string; rows?: number; placeholder?: string };

const sections: { title: string; intro: string; fields: FieldDef[] }[] = [
  {
    title: "Contact",
    intro: "Shown in the footer, on the Contact page and used for WhatsApp orders.",
    fields: [
      {
        name: "whatsappNumber",
        label: "WhatsApp number",
        hint: "International format, digits only, no + or spaces. Example: 923001234567",
        placeholder: "923001234567",
        type: "tel",
      },
      { name: "phone", label: "Phone (as displayed)", placeholder: "+92 300 1234567", type: "tel" },
      { name: "email", label: "Business email", type: "email" },
      { name: "address", label: "Address", rows: 2 },
    ],
  },
  {
    title: "Social media",
    intro: "Full links to your profiles. Leave a field empty to hide that icon.",
    fields: [
      { name: "instagramUrl", label: "Instagram", placeholder: "https://instagram.com/yourbrand", type: "url" },
      { name: "facebookUrl", label: "Facebook", placeholder: "https://facebook.com/yourbrand", type: "url" },
      { name: "tiktokUrl", label: "TikTok", placeholder: "https://tiktok.com/@yourbrand", type: "url" },
    ],
  },
  {
    title: "Delivery info",
    intro: "Shown on every product page and the Delivery Policy page.",
    fields: [
      { name: "deliveryTitle", label: "Title" },
      { name: "deliveryInfo", label: "Details", hint: "One point per line.", rows: 4 },
    ],
  },
];

export function SettingsForm({ initial }: { initial: SettingsInput }) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsInput>({ resolver: zodResolver(settingsSchema), defaultValues: initial });
  const number = useWatch({ control, name: "whatsappNumber" });

  const onSubmit = handleSubmit(
    async (values) => {
      setFormError("");
      const res = await saveSettings(values).catch(() => ({
        ok: false as const,
        error: "Network error. Please try again.",
        fieldErrors: undefined,
      }));
      if (!res.ok) {
        for (const [field, messages] of Object.entries(res.fieldErrors ?? {})) {
          if (messages?.[0]) setError(field as keyof SettingsInput, { message: messages[0] });
        }
        setFormError(res.error);
        toast(res.error, "error");
        return;
      }
      reset(values);
      toast("Settings saved. The website is updated.");
      router.refresh();
    },
    () => setFormError("Please fix the highlighted fields."),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-3xl space-y-8">
      {sections.map((section) => (
        <section key={section.title} className="space-y-4 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="font-serif text-2xl">{section.title}</h2>
            <p className="text-sm text-muted">{section.intro}</p>
          </div>
          {section.fields.map((f) => {
            const error = errors[f.name]?.message;
            const common = {
              id: f.name,
              placeholder: f.placeholder,
              className: input,
              "aria-invalid": !!error,
              "aria-describedby": `${f.name}-msg`,
              ...register(f.name),
            };
            return (
              <div key={f.name}>
                <label htmlFor={f.name} className="text-xs font-medium uppercase tracking-[0.15em]">
                  {f.label}
                </label>
                {f.rows ? <textarea rows={f.rows} {...common} /> : <input type={f.type ?? "text"} {...common} />}
                <p id={`${f.name}-msg`} className={cn("mt-1", error ? "text-sm text-red-700" : "text-xs text-muted")}>
                  {error ?? f.hint}
                </p>
                {f.name === "whatsappNumber" && /^\d{10,15}$/.test(number ?? "") && (
                  <a
                    href={whatsappLink(number, "Test message from the HANLAR PURE dashboard")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-gold-dark hover:underline"
                  >
                    <ExternalLink aria-hidden className="size-3.5" /> Test this WhatsApp number
                  </a>
                )}
              </div>
            );
          })}
        </section>
      ))}

      {formError && (
        <p role="alert" className="bg-red-50 p-3 text-sm text-red-800">
          {formError}
        </p>
      )}

      <div className="sticky bottom-0 -mx-5 flex items-center gap-4 border-t border-black/10 bg-off-white/95 px-5 py-4 backdrop-blur sm:mx-0 sm:px-0">
        <Button type="submit" variant="dark" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save settings"}
        </Button>
        {isDirty && <span className="text-sm text-muted">You have unsaved changes.</span>}
      </div>
    </form>
  );
}
