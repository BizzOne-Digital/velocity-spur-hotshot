import { SignJWT, jwtVerify } from "jose";

// Edge-safe session helpers (used by proxy.ts and server code).
export const SESSION_COOKIE = "vsh_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type AdminSession = {
  sub: string;
  email: string;
  role: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set and at least 32 characters long");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: AdminSession): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySession(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email, role: String(payload.role ?? "admin") };
  } catch {
    return null;
  }
}
