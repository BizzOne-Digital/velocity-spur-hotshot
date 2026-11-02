// Small, dependency-free input helpers for route handlers.

export function str(value: unknown, max = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function strList(value: unknown, maxItems = 40, maxLen = 200): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => str(v, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function num(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function bool(value: unknown, fallback = true): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

export function isPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 7;
}

export function oneOf<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Image values must be our own upload API, a local /images path, or Unsplash. */
export function imageUrl(value: unknown): string {
  const v = str(value, 600);
  if (!v) return "";
  if (v.startsWith("/api/uploads/") || v.startsWith("/images/")) return v;
  if (v.startsWith("https://images.unsplash.com/")) return v;
  return "";
}

/** CTA links: internal paths, anchors, tel:, mailto: or https URLs. */
export function linkUrl(value: unknown): string {
  const v = str(value, 400);
  if (!v) return "";
  if (/^(\/|#|tel:|mailto:|https:\/\/)/.test(v)) return v;
  return "";
}

/** Very small in-memory rate limiter (per server instance). */
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
