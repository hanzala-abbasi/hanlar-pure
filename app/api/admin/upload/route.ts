import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "@/lib/auth";
import { validateImageFile } from "@/lib/uploads";

const FOLDER = "hanlar-pure/products";

function cloudinaryConfigured() {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

/**
 * GET: returns how the browser should upload.
 * - Cloudinary: a short-lived signature so the browser uploads directly (avoids Vercel's 4.5 MB body limit).
 * - Local (development only): upload by POSTing the file here.
 */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (cloudinaryConfigured()) {
    const timestamp = Math.round(Date.now() / 1000);
    const params = { timestamp, folder: FOLDER, allowed_formats: "jpg,jpeg,png,webp" };
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
    return NextResponse.json({
      mode: "cloudinary",
      uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      fields: { ...params, api_key: process.env.CLOUDINARY_API_KEY, signature },
    });
  }

  if (process.env.NODE_ENV !== "production") return NextResponse.json({ mode: "local" });
  return NextResponse.json({ error: "Image storage is not configured. Set the CLOUDINARY_* env vars." }, { status: 500 });
}

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.NODE_ENV === "production" || cloudinaryConfigured()) {
    return NextResponse.json({ error: "Local uploads are only available in development." }, { status: 400 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  const invalid = validateImageFile(file);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${EXT[file.type]}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
