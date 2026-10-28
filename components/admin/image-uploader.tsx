"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, LoaderCircle, Star, Trash2, Upload } from "lucide-react";
import { ALLOWED_IMAGE_TYPES, validateImageFile } from "@/lib/uploads";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export type FormImage = { url: string; alt: string };

/** Uploads one file (Cloudinary in production, /public/uploads in development) and returns its URL. */
export async function uploadImage(file: File): Promise<string> {
  const res = await fetch("/api/admin/upload");
  const target = await res.json();
  if (!res.ok) throw new Error(target.error ?? "Upload is not available");
  return uploadOne(file, target);
}

type UploadTarget =
  | { mode: "cloudinary"; uploadUrl: string; fields: Record<string, string | number> }
  | { mode: "local" };

async function uploadOne(file: File, target: UploadTarget): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  if (target.mode === "cloudinary") {
    for (const [k, v] of Object.entries(target.fields)) body.append(k, String(v));
    const res = await fetch(target.uploadUrl, { method: "POST", body });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message ?? "Upload failed");
    return json.secure_url as string;
  }
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? "Upload failed");
  return json.url as string;
}

export function ImageUploader({
  value,
  onChange,
  productName,
}: {
  value: FormImage[];
  onChange: (images: FormImage[]) => void;
  productName: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files);
    const valid: File[] = [];
    for (const file of list) {
      const error = validateImageFile(file);
      if (error) toast(error, "error");
      else valid.push(file);
    }
    if (!valid.length) return;

    setUploading(valid.length);
    try {
      const res = await fetch("/api/admin/upload");
      const target = await res.json();
      if (!res.ok) throw new Error(target.error ?? "Upload is not available");

      let images = value;
      for (const file of valid) {
        try {
          const url = await uploadOne(file, target);
          images = [...images, { url, alt: "" }];
          onChange(images);
        } catch (err) {
          toast(`${file.name}: ${(err as Error).message}`, "error");
        } finally {
          setUploading((n) => n - 1);
        }
      }
    } catch (err) {
      toast((err as Error).message, "error");
      setUploading(0);
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center border border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-gold-dark bg-gold/5" : "border-black/20 bg-white",
        )}
      >
        {uploading > 0 ? (
          <LoaderCircle aria-hidden className="size-6 animate-spin text-gold-dark" />
        ) : (
          <Upload aria-hidden className="size-6 text-gold-dark" strokeWidth={1.5} />
        )}
        <p className="mt-3 text-sm">
          {uploading > 0 ? `Uploading ${uploading} image${uploading > 1 ? "s" : ""}...` : "Drag images here, or"}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading > 0}
          className="mt-2 text-xs uppercase tracking-[0.15em] underline underline-offset-4 hover:text-gold-dark disabled:opacity-50"
        >
          Choose files
        </button>
        <p className="mt-2 text-xs text-muted">JPEG, PNG or WebP, up to 5 MB each. The first image is the primary image.</p>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {value.length > 0 && (
        <ul className="mt-4 space-y-2">
          {value.map((img, i) => (
            <li key={img.url} className="flex items-center gap-3 bg-white p-2">
              <div className="relative size-16 shrink-0 overflow-hidden bg-off-white">
                <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                {i === 0 && (
                  <span className="mb-1 inline-block bg-gold/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-gold-dark">
                    Primary
                  </span>
                )}
                <input
                  aria-label={`Alt text for image ${i + 1}`}
                  placeholder={`Alt text (e.g. ${productName || "product"} bottle front)`}
                  value={img.alt}
                  onChange={(e) => onChange(value.map((v, j) => (j === i ? { ...v, alt: e.target.value } : v)))}
                  className="w-full border border-black/15 px-2 py-1.5 text-sm outline-none focus:border-gold-dark"
                />
              </div>
              <div className="flex shrink-0 items-center">
                {i !== 0 && (
                  <IconButton label="Make primary" onClick={() => move(i, 0)}>
                    <Star className="size-4" />
                  </IconButton>
                )}
                <IconButton label="Move up" onClick={() => move(i, i - 1)} disabled={i === 0}>
                  <ArrowUp className="size-4" />
                </IconButton>
                <IconButton label="Move down" onClick={() => move(i, i + 1)} disabled={i === value.length - 1}>
                  <ArrowDown className="size-4" />
                </IconButton>
                <IconButton
                  label="Remove image"
                  onClick={() => confirm("Remove this image?") && onChange(value.filter((_, j) => j !== i))}
                  className="hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IconButton({
  label,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn("p-2 text-muted transition-colors hover:text-black disabled:opacity-25", className)}
      {...props}
    />
  );
}
