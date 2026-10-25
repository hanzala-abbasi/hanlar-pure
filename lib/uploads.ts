export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateImageFile(file: { type: string; size: number; name: string }) {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return `${file.name}: only JPEG, PNG or WebP images are allowed.`;
  }
  if (file.size > MAX_IMAGE_BYTES) return `${file.name}: image must be 5 MB or smaller.`;
  return null;
}
