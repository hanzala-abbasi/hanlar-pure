"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations";

export type ContactResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function sendEmail(data: { name: string; email: string; phone: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "HANLAR PURE Website <onboarding@resend.dev>",
      to: [to],
      reply_to: data.email,
      subject: `New website message from ${data.name}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
<p><strong>Phone:</strong> ${escapeHtml(data.phone || "-")}</p>
<p><strong>Message:</strong></p><p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
  return true;
}

export async function sendContactMessage(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const { company, ...data } = parsed.data;

  // Honeypot filled in: pretend success so bots learn nothing.
  if (company) return { ok: true };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000).ok) {
    return { ok: false, error: "Too many messages. Please try again later or contact us on WhatsApp." };
  }

  let stored = false;
  try {
    await prisma.contactMessage.create({ data: { ...data, phone: data.phone || null } });
    stored = true;
  } catch (err) {
    console.error("Failed to store contact message", err);
  }

  let emailed = false;
  try {
    emailed = await sendEmail(data);
  } catch (err) {
    console.error("Failed to send contact email", err);
  }

  if (!stored && !emailed) {
    return { ok: false, error: "Sorry, your message could not be sent. Please contact us on WhatsApp." };
  }
  return { ok: true };
}
