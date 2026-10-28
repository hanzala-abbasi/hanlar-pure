"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Trash2, Upload } from "lucide-react";
import { saveBanner } from "@/app/admin/actions";
import { ALLOWED_IMAGE_TYPES, validateImageFile } from "@/lib/uploads";
import { bannerSchema, type BannerInput } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { FocalImage } from "@/components/ui/focal-image";
import { toast } from "@/components/ui/toast";

const input =
  "mt-1.5 w-full border border-black/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold-dark aria-invalid:border-red-600";
const label = "text-xs font-medium uppercase tracking-[0.15em]";

export const emptyBanner: BannerInput = {
  eyebrow: "",
  title: "",
  subtitle: "",
  ctaLabel: "Shop Now",
  ctaHref: "/shop",
  imageUrl: "",
  mobileImageUrl: null,
  imageAlt: "",
  focusX: 50,
  active: true,
  sortOrder: 0,
};

function ImageField({
  value,
  onChange,
  title,
  hint,
  optional = false,
  error,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  title: string;
  hint: string;
  optional?: boolean;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handle(file: File) {
    const invalid = validateImageFile(file);
    if (invalid) return toast(invalid, "error");
    setUploading(true);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      toast((err as Error).message, "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className={label}>
        {title} {optional && <span className="font-normal normal-case tracking-normal text-muted">(optional)</span>}
      </p>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]);
        }}
        className={cn(
          "mt-1.5 flex items-center gap-4 border border-dashed bg-white p-3",
          error ? "border-red-600" : "border-black/20",
        )}
      >
        <div className="relative size-20 shrink-0 overflow-hidden bg-off-white">
          {value && <Image src={value} alt="" fill sizes="80px" className="object-cover" />}
        </div>
        <div className="min-w-0 flex-1 text-sm">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] underline underline-offset-4 hover:text-gold-dark disabled:opacity-50"
          >
            {uploading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <Upload aria-hidden className="size-4" />}
            {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
          </button>
          <p className="mt-1 text-xs text-muted">{hint}</p>
        </div>
        {value && optional && (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Remove ${title.toLowerCase()}`}
            className="p-2 text-muted hover:text-red-700"
          >
            <Trash2 className="size-4" />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) handle(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

/** Scaled-down copy of the home hero so the owner sees the crop and text before saving. */
function Preview({ values }: { values: BannerInput }) {
  const mobileSrc = values.mobileImageUrl || values.imageUrl;
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs text-muted">Desktop</p>
        <div className="grid aspect-[16/8] grid-cols-[5fr_7fr] overflow-hidden border border-black/10 bg-off-white">
          <div className="flex flex-col justify-center p-4">
            {values.eyebrow && <p className="mb-1 text-[7px] uppercase tracking-[0.25em] text-gold-dark">{values.eyebrow}</p>}
            <p className="font-serif text-base leading-tight">{values.title || "Banner title"}</p>
            {values.subtitle && <p className="mt-1 line-clamp-2 text-[8px] text-muted">{values.subtitle}</p>}
            <span className="mt-2 w-fit bg-black px-2 py-1 text-[6px] uppercase tracking-[0.2em] text-white">
              {values.ctaLabel || "Button"}
            </span>
          </div>
          <div className="relative">
            {values.imageUrl && <FocalImage src={values.imageUrl} alt="" sizes="320px" focusX={values.focusX ?? 50} />}
          </div>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs text-muted">Phone</p>
        <div className="w-36 overflow-hidden border border-black/10 bg-off-white">
          <div className="relative aspect-[4/5]">
            {mobileSrc && <FocalImage src={mobileSrc} alt="" sizes="144px" focusX={values.focusX ?? 50} />}
          </div>
          <div className="p-2">
            <p className="font-serif text-xs leading-tight">{values.title || "Banner title"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BannerForm({ id, initial }: { id: string | null; initial: BannerInput }) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BannerInput>({ resolver: zodResolver(bannerSchema), defaultValues: initial });
  const values = useWatch({ control }) as BannerInput;

  const onSubmit = handleSubmit(
    async (data) => {
      setFormError("");
      const res = await saveBanner(id, data).catch(() => ({
        ok: false as const,
        error: "Network error. Please try again.",
        fieldErrors: undefined,
      }));
      if (!res.ok) {
        for (const [field, messages] of Object.entries(res.fieldErrors ?? {})) {
          if (messages?.[0]) setError(field as keyof BannerInput, { message: messages[0] });
        }
        setFormError(res.error);
        toast(res.error, "error");
        return;
      }
      reset(data);
      toast("Banner saved. The home page is updated.");
      if (!id && res.id) router.replace(`/admin/banners/${res.id}`);
      else router.refresh();
    },
    () => setFormError("Please fix the highlighted fields."),
  );

  const text = (name: keyof BannerInput, title: string, hint?: string, placeholder?: string) => {
    const error = errors[name]?.message;
    return (
      <div>
        <label htmlFor={name} className={label}>
          {title}
        </label>
        <input
          id={name}
          placeholder={placeholder}
          className={input}
          aria-invalid={!!error}
          aria-describedby={`${name}-msg`}
          {...register(name)}
        />
        <p id={`${name}-msg`} className={cn("mt-1", error ? "text-sm text-red-700" : "text-xs text-muted")}>
          {error ?? hint}
        </p>
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="space-y-8">
        <section className="space-y-4 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-serif text-2xl">Images</h2>
          <Controller
            control={control}
            name="imageUrl"
            render={({ field, fieldState }) => (
              <ImageField
                title="Banner image"
                hint="Landscape works best, at least 1600 px wide. Avoid text or logos printed on the image: the headline is added beside it."
                value={field.value || null}
                onChange={(url) => field.onChange(url ?? "")}
                error={fieldState.error ? "Upload a banner image" : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="mobileImageUrl"
            render={({ field }) => (
              <ImageField
                title="Phone image"
                optional
                hint="Portrait (4:5) version for phones. If empty, the banner image is cropped around the product position below."
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div>
            <label htmlFor="focusX" className={label}>
              Product position: {values.focusX ?? 50}%
            </label>
            <input
              id="focusX"
              type="range"
              min={0}
              max={100}
              className="mt-2 w-full accent-[var(--gold-dark)]"
              {...register("focusX", { valueAsNumber: true })}
            />
            <p className="mt-1 text-xs text-muted">
              Where the product sits across the photo (0 = left edge, 100 = right edge). It is kept centred when the
              image is cropped. Adjust until the product is centred in both previews.
            </p>
          </div>
          {text("imageAlt", "Image description", "Describes the image for screen readers and Google.", "Hair Oil on a marble plinth")}
        </section>

        <section className="space-y-4 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-serif text-2xl">Text</h2>
          {text("eyebrow", "Small heading", "Optional line above the title.", "Hair Oil · 100 ml")}
          {text("title", "Title", "Keep it short: 2 to 5 words reads best.", "Nourish. Strengthen. Shine.")}
          <div>
            <label htmlFor="subtitle" className={label}>
              Subtitle
            </label>
            <textarea id="subtitle" rows={2} className={input} {...register("subtitle")} />
            <p className={cn("mt-1", errors.subtitle ? "text-sm text-red-700" : "text-xs text-muted")}>
              {errors.subtitle?.message ?? "Optional. One sentence."}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {text("ctaLabel", "Button text", undefined, "Shop Now")}
            {text("ctaHref", "Button link", "A page like /shop or /shop/hair-oil", "/shop")}
          </div>
        </section>

        <section className="space-y-4 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-serif text-2xl">Display</h2>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="size-4 accent-[var(--gold-dark)]" {...register("active")} />
            Show this banner on the home page
          </label>
          <div className="max-w-40">
            <label htmlFor="sortOrder" className={label}>
              Order
            </label>
            <input id="sortOrder" type="number" className={input} {...register("sortOrder", { valueAsNumber: true })} />
            <p className="mt-1 text-xs text-muted">Lower numbers show first.</p>
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 font-serif text-2xl">Preview</h2>
          <Preview values={values} />
        </div>
      </aside>

      <div className="sticky bottom-0 -mx-5 flex items-center gap-4 border-t border-black/10 bg-off-white/95 px-5 py-4 backdrop-blur sm:mx-0 sm:px-0 lg:col-span-2">
        {formError && (
          <p role="alert" className="text-sm text-red-800">
            {formError}
          </p>
        )}
        <Button type="submit" variant="dark" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save banner"}
        </Button>
        {isDirty && <span className="text-sm text-muted">You have unsaved changes.</span>}
      </div>
    </form>
  );
}
