"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type Box = { cw: number; ch: number; iw: number; ih: number };

/**
 * Keeps a horizontal focal point (0-100, e.g. where the product sits in the photo) centred in an
 * `object-cover` image at any container size. CSS percentages alone align the point to the same
 * relative position instead of the centre, so the offset is measured and set in pixels.
 */
export function useFocalPosition(focusX: number) {
  const [box, setBox] = useState<Box | null>(null);

  const ref = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    const measure = () => {
      if (!img.naturalWidth || !img.clientWidth) return;
      setBox({ cw: img.clientWidth, ch: img.clientHeight, iw: img.naturalWidth, ih: img.naturalHeight });
    };
    measure();
    img.addEventListener("load", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(img);
    return () => {
      img.removeEventListener("load", measure);
      observer.disconnect();
    };
  }, []);

  let objectPosition = `${focusX}% 50%`; // before measuring (server render)
  if (box) {
    const scale = Math.max(box.cw / box.iw, box.ch / box.ih);
    const width = box.iw * scale;
    const left = Math.min(0, Math.max(box.cw - width, box.cw / 2 - (focusX / 100) * width));
    objectPosition = `${Math.round(left)}px 50%`;
  }

  return { ref, style: { objectPosition } };
}

export function FocalImage({
  focusX,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Image>, "fill" | "style" | "ref"> & { focusX: number }) {
  const { ref, style } = useFocalPosition(focusX);
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is passed through props
  return <Image {...props} ref={ref} fill style={style} className={className ?? "object-cover"} />;
}
