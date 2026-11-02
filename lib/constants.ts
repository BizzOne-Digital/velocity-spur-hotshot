// Client-safe enums shared by forms, admin UI, models and API validation.

export const QUOTE_STATUSES = ["New", "Contacted", "Reviewing", "Quoted", "Booked", "Closed"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const FREIGHT_TYPES = [
  "Construction Materials",
  "Equipment",
  "Machinery",
  "Industrial Freight",
  "Equipment Rental",
  "Agricultural Equipment",
  "Priority Delivery",
  "Other",
] as const;
export type FreightType = (typeof FREIGHT_TYPES)[number];

export const URGENCY_LEVELS = ["Standard", "Scheduled", "Time-Sensitive"] as const;
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export const INQUIRY_TYPES = [
  "General",
  "Business Partnership",
  "Construction Contract",
  "Equipment Rental",
  "Other",
] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_STATUSES = ["New", "Contacted", "Resolved"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Transportation Packages" },
  { href: "/request-quote", label: "Request a Quote" },
  { href: "/contact", label: "Contact" },
] as const;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
