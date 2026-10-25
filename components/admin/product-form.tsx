"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { saveProduct } from "@/app/admin/actions";
import { productSchema, productStatuses, statusLabels, type ProductInput } from "@/lib/validations";
import { slugify, cn } from "@/lib/utils";
import { Button, buttonClass } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { ImageUploader } from "@/components/admin/image-uploader";

const input =
  "mt-1.5 w-full border border-black/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold-dark aria-invalid:border-red-600";

export const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  ingredients: "",
  benefits: "",
  howToUse: "",
  price: 0,
  size: "",
  status: "DRAFT",
  featured: false,
  sortOrder: 0,
  faqs: [],
  images: [],
};

export function ProductForm({ id, initial }: { id: string | null; initial: ProductInput }) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(!!id);
  const [formError, setFormError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductInput>({ resolver: zodResolver(productSchema), defaultValues: initial });
  const faqs = useFieldArray({ control, name: "faqs" });
  const name = useWatch({ control, name: "name" });
  const slug = useWatch({ control, name: "slug" });

  const onSubmit = handleSubmit(
    async (values) => {
      setFormError("");
      const res = await saveProduct(id, values).catch(() => ({
        ok: false as const,
        error: "Network error. Please try again.",
        fieldErrors: undefined,
      }));
      if (!res.ok) {
        for (const [field, messages] of Object.entries(res.fieldErrors ?? {})) {
          if (messages?.[0]) setError(field as keyof ProductInput, { message: messages[0] });
        }
        setFormError(res.error);
        toast(res.error, "error");
        return;
      }
      toast(id ? "Product saved" : "Product created");
      if (id) router.refresh();
      else router.replace(`/admin/products/${res.id}`);
    },
    () => setFormError("Please fix the highlighted fields."),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-8">
        <Card title="Basics">
          <Field id="name" label="Name" error={errors.name?.message}>
            <input
              id="name"
              aria-describedby="name-msg"
              className={input}
              aria-invalid={!!errors.name}
              {...register("name", {
                onChange: (e) => {
                  if (!slugTouched) setValue("slug", slugify(e.target.value), { shouldValidate: true });
                },
              })}
            />
          </Field>
          <Field id="slug" label="URL slug" error={errors.slug?.message} hint={`Page address: /shop/${slug || "..."}`}>
            <div className="flex gap-2">
              <input
                id="slug"
                aria-describedby="slug-msg"
                className={input}
                aria-invalid={!!errors.slug}
                {...register("slug", { onChange: () => setSlugTouched(true) })}
              />
              <button
                type="button"
                className="mt-1.5 shrink-0 border border-black/15 px-3 text-xs uppercase tracking-[0.1em] hover:border-gold-dark"
                onClick={() => {
                  setValue("slug", slugify(name), { shouldValidate: true, shouldDirty: true });
                  setSlugTouched(false);
                }}
              >
                From name
              </button>
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="price" label="Price (PKR, whole rupees)" error={errors.price?.message}>
              <input
                id="price"
                aria-describedby="price-msg"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                className={input}
                aria-invalid={!!errors.price}
                {...register("price", { valueAsNumber: true })}
              />
            </Field>
            <Field id="size" label="Size" error={errors.size?.message} hint='e.g. "250 ml"'>
              <input id="size" aria-describedby="size-msg" className={input} aria-invalid={!!errors.size} {...register("size")} />
            </Field>
          </div>
          <Field id="shortDescription" label="Short description" error={errors.shortDescription?.message} hint="Shown on product cards and search results.">
            <textarea id="shortDescription" aria-describedby="shortDescription-msg" rows={2} className={input} aria-invalid={!!errors.shortDescription} {...register("shortDescription")} />
          </Field>
          <Field id="description" label="Full description" error={errors.description?.message} hint="Leave a blank line between paragraphs.">
            <textarea id="description" aria-describedby="description-msg" rows={6} className={input} aria-invalid={!!errors.description} {...register("description")} />
          </Field>
        </Card>

        <Card title="Images">
          <Controller
            control={control}
            name="images"
            render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} productName={name} />}
          />
          {errors.images && <p className="text-sm text-red-700">{errors.images.message ?? "Check the images"}</p>}
        </Card>

        <Card title="Details">
          <Field id="ingredients" label="Ingredients" error={errors.ingredients?.message}>
            <textarea id="ingredients" aria-describedby="ingredients-msg" rows={4} className={input} {...register("ingredients")} />
          </Field>
          <Field id="benefits" label="Benefits" error={errors.benefits?.message} hint="One benefit per line. Avoid medical claims or guaranteed results.">
            <textarea id="benefits" aria-describedby="benefits-msg" rows={4} className={input} {...register("benefits")} />
          </Field>
          <Field id="howToUse" label="How to use" error={errors.howToUse?.message}>
            <textarea id="howToUse" aria-describedby="howToUse-msg" rows={4} className={input} {...register("howToUse")} />
          </Field>
        </Card>

        <Card title="Product FAQ (optional)">
          {faqs.fields.map((f, i) => (
            <div key={f.id} className="space-y-2 border border-black/10 p-4">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <input
                    placeholder="Question"
                    aria-label={`FAQ ${i + 1} question`}
                    className={input}
                    aria-invalid={!!errors.faqs?.[i]?.q}
                    {...register(`faqs.${i}.q`)}
                  />
                  <textarea
                    rows={2}
                    placeholder="Answer"
                    aria-label={`FAQ ${i + 1} answer`}
                    className={input}
                    aria-invalid={!!errors.faqs?.[i]?.a}
                    {...register(`faqs.${i}.a`)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => faqs.remove(i)}
                  className="mt-2 p-2 text-muted hover:text-red-700"
                  aria-label={`Remove FAQ ${i + 1}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              {(errors.faqs?.[i]?.q || errors.faqs?.[i]?.a) && (
                <p className="text-sm text-red-700">Fill in both the question and the answer.</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => faqs.append({ q: "", a: "" })}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] hover:text-gold-dark"
          >
            <Plus aria-hidden className="size-4" /> Add question
          </button>
        </Card>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
        <Card title="Publishing">
          <Field id="status" label="Status" error={errors.status?.message}>
            <select id="status" aria-describedby="status-msg" className={input} {...register("status")}>
              {productStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </Field>
          <p className="-mt-2 text-xs leading-relaxed text-muted">
            Active and Out of stock are visible in the shop. Draft and Archived are hidden.
          </p>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="size-4 accent-black" {...register("featured")} />
            Featured on the home page
          </label>
          <Field id="sortOrder" label="Sort order" error={errors.sortOrder?.message} hint="Lower numbers appear first.">
            <input id="sortOrder" aria-describedby="sortOrder-msg" type="number" step={1} className={input} {...register("sortOrder", { valueAsNumber: true })} />
          </Field>
        </Card>

        {formError && (
          <p role="alert" className="bg-red-50 p-3 text-sm text-red-800">
            {formError}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Button type="submit" variant="dark" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : id ? "Save changes" : "Create product"}
          </Button>
          <Link
            href="/admin/products"
            className={buttonClass("ghost", "justify-center")}
            onClick={(e) => {
              if (isDirty && !confirm("Discard unsaved changes?")) e.preventDefault();
            }}
          >
            Back to products
          </Link>
        </div>
      </aside>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-serif text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-[0.15em]">
        {label}
      </label>
      {children}
      <p id={`${id}-msg`} className={cn("mt-1 text-xs", error ? "text-sm text-red-700" : "text-muted")}>
        {error ?? hint}
      </p>
    </div>
  );
}
