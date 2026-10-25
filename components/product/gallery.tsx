"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImage = { url: string; alt: string };

export function Gallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const count = images.length;
  const current = images[index];

  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
    };
    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, [count]);

  if (!current) {
    return <div className="aspect-[4/5] bg-off-white" aria-label={`${name}: no image yet`} />;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-off-white"
        aria-label="Open image viewer"
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute right-4 bottom-4 flex size-10 items-center justify-center bg-white/90 text-black">
          <ZoomIn aria-hidden className="size-4" />
        </span>
      </button>

      {count > 1 && (
        <ul className="mt-4 grid grid-cols-5 gap-3" aria-label="Product images">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${count}`}
                aria-current={i === index}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden bg-off-white ring-offset-2 transition",
                  i === index ? "ring-1 ring-gold-dark" : "opacity-70 hover:opacity-100",
                )}
              >
                <Image src={img.url} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`${name} images`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      >
        <div className="relative flex h-full items-center justify-center p-4 sm:p-12">
          <div className="relative h-full w-full">
            <Image src={current.url} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="absolute top-4 right-4 p-2 hover:text-gold"
            aria-label="Close image viewer"
          >
            <X className="size-7" />
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-2 p-3 hover:text-gold sm:left-6"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-8" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-2 p-3 hover:text-gold sm:right-6"
                aria-label="Next image"
              >
                <ChevronRight className="size-8" />
              </button>
              <p className="absolute bottom-4 text-sm text-white/70">
                {index + 1} / {count}
              </p>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
