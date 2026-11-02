import "server-only";
import { connectDB, isDbConfigured } from "./mongodb";
import { DEFAULT_PACKAGES, DEFAULT_PAGES, DEFAULT_SERVICES, DEFAULT_SETTINGS } from "./defaults";
import type { GalleryEntry, PackageItem, PageSections, SectionContent, ServiceItem, SiteSettings } from "./types";
import Service from "@/models/Service";
import TransportationPackage from "@/models/TransportationPackage";
import PageContent, { type PageKey } from "@/models/PageContent";
import SiteSetting from "@/models/SiteSetting";
import GalleryItem from "@/models/GalleryItem";

const SEED_KEY = "seed:v1";
let seedPromise: Promise<void> | null = null;

/**
 * Inserts default services, packages and settings exactly once per database.
 * A marker document prevents re-seeding after an admin intentionally deletes content.
 */
export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      await connectDB();
      const marker = await SiteSetting.findOne({ key: SEED_KEY }).lean();
      if (marker) return;
      if ((await Service.countDocuments()) === 0) await Service.insertMany(DEFAULT_SERVICES);
      if ((await TransportationPackage.countDocuments()) === 0) await TransportationPackage.insertMany(DEFAULT_PACKAGES);
      await SiteSetting.updateOne({ key: "site" }, { $setOnInsert: { value: DEFAULT_SETTINGS } }, { upsert: true });
      await SiteSetting.updateOne(
        { key: SEED_KEY },
        { $setOnInsert: { value: { at: new Date().toISOString() } } },
        { upsert: true }
      );
    })().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function withDb<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  if (!isDbConfigured()) return fallback;
  try {
    await ensureSeeded();
    return await fn();
  } catch (err) {
    console.error("[data] falling back to defaults:", (err as Error).message);
    return fallback;
  }
}

type Leaned = Record<string, unknown> & { _id: { toString(): string } };

export function toServiceItem(doc: Leaned): ServiceItem {
  return {
    id: doc._id.toString(),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    shortDescription: String(doc.shortDescription ?? ""),
    description: String(doc.description ?? ""),
    image: String(doc.image ?? ""),
    icon: String(doc.icon ?? "truck"),
    features: Array.isArray(doc.features) ? doc.features.map(String) : [],
    disclaimer: String(doc.disclaimer ?? ""),
    order: Number(doc.order ?? 0),
    active: Boolean(doc.active),
  };
}

export function toPackageItem(doc: Leaned): PackageItem {
  return {
    id: doc._id.toString(),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    description: String(doc.description ?? ""),
    features: Array.isArray(doc.features) ? doc.features.map(String) : [],
    image: String(doc.image ?? ""),
    icon: String(doc.icon ?? "handshake"),
    ctaLabel: String(doc.ctaLabel ?? ""),
    order: Number(doc.order ?? 0),
    active: Boolean(doc.active),
  };
}

export function toGalleryEntry(doc: Leaned): GalleryEntry {
  return {
    id: doc._id.toString(),
    title: String(doc.title ?? ""),
    description: String(doc.description ?? ""),
    image: String(doc.image ?? ""),
    category: String(doc.category ?? ""),
    order: Number(doc.order ?? 0),
    active: Boolean(doc.active),
  };
}

const defaultServices = (): ServiceItem[] => DEFAULT_SERVICES.map((sv, i) => ({ ...sv, id: `default-${i}` }));
const defaultPackages = (): PackageItem[] => DEFAULT_PACKAGES.map((p, i) => ({ ...p, id: `default-${i}` }));

export async function getServices(includeInactive = false): Promise<ServiceItem[]> {
  return withDb(defaultServices(), async () => {
    const docs = await Service.find(includeInactive ? {} : { active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean<Leaned[]>();
    return docs.map(toServiceItem);
  });
}

export async function getPackages(includeInactive = false): Promise<PackageItem[]> {
  return withDb(defaultPackages(), async () => {
    const docs = await TransportationPackage.find(includeInactive ? {} : { active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean<Leaned[]>();
    return docs.map(toPackageItem);
  });
}

export async function getGallery(includeInactive = false): Promise<GalleryEntry[]> {
  return withDb([], async () => {
    const docs = await GalleryItem.find(includeInactive ? {} : { active: true })
      .sort({ order: 1, createdAt: -1 })
      .lean<Leaned[]>();
    return docs.map(toGalleryEntry);
  });
}

export function mergeSettings(stored: Partial<SiteSettings> | undefined): SiteSettings {
  const v = stored ?? {};
  return {
    ...DEFAULT_SETTINGS,
    ...v,
    serviceCommunities: v.serviceCommunities?.length ? v.serviceCommunities : DEFAULT_SETTINGS.serviceCommunities,
    plannedExpansion: v.plannedExpansion ?? DEFAULT_SETTINGS.plannedExpansion,
    socials: { ...DEFAULT_SETTINGS.socials, ...(v.socials ?? {}) },
  };
}

export async function getSettings(): Promise<SiteSettings> {
  return withDb(DEFAULT_SETTINGS, async () => {
    const doc = await SiteSetting.findOne({ key: "site" }).lean<{ value?: Partial<SiteSettings> }>();
    return mergeSettings(doc?.value);
  });
}

/**
 * Merges stored sections over defaults by sectionKey. Empty stored strings fall
 * back to the default so a partially edited page never renders blank sections.
 */
export function mergeSections(pageKey: string, stored: Partial<SectionContent>[] = []): SectionContent[] {
  const defaults = DEFAULT_PAGES[pageKey] ?? [];
  return defaults.map((def) => {
    const found = stored.find((x) => x.sectionKey === def.sectionKey);
    if (!found) return def;
    const pick = (k: keyof Omit<SectionContent, "sectionKey" | "additionalData">) =>
      typeof found[k] === "string" && (found[k] as string).trim() !== "" ? (found[k] as string) : def[k];
    return {
      sectionKey: def.sectionKey,
      heading: pick("heading"),
      subheading: pick("subheading"),
      description: pick("description"),
      image: pick("image"),
      ctaLabel: pick("ctaLabel"),
      ctaUrl: pick("ctaUrl"),
      additionalData: { ...def.additionalData, ...(found.additionalData ?? {}) },
    };
  });
}

export async function getPageSectionsList(pageKey: string): Promise<SectionContent[]> {
  return withDb(mergeSections(pageKey), async () => {
    const doc = await PageContent.findOne({ pageKey: pageKey as PageKey }).lean<{ sections?: Partial<SectionContent>[] }>();
    return mergeSections(pageKey, doc?.sections);
  });
}

export async function getPageContent(pageKey: string): Promise<PageSections> {
  const list = await getPageSectionsList(pageKey);
  return Object.fromEntries(list.map((sec) => [sec.sectionKey, sec]));
}

/** Typed accessors for additionalData values. */
export function dataList<T = Record<string, string>>(section: SectionContent | undefined, key: string): T[] {
  const v = section?.additionalData?.[key];
  return Array.isArray(v) ? (v as T[]) : [];
}

export function dataString(section: SectionContent | undefined, key: string, fallback = ""): string {
  const v = section?.additionalData?.[key];
  return typeof v === "string" && v ? v : fallback;
}
