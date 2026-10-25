// Edge-safe session helpers (no next/headers), shared by proxy.ts and server code.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "hp_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set and at least 32 characters long.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getKey());
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
