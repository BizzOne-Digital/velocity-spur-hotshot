// Plain serialisable shapes passed from server components to client components.

export type SectionContent = {
  sectionKey: string;
  heading: string;
  subheading: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
  additionalData: Record<string, unknown>;
};

export type PageSections = Record<string, SectionContent>;

export type ServiceItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  disclaimer: string;
  order: number;
  active: boolean;
};

export type PackageItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  image: string;
  icon: string;
  ctaLabel: string;
  order: number;
  active: boolean;
};

export type GalleryEntry = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  order: number;
  active: boolean;
};

export type SiteSettings = {
  companyName: string;
  tagline: string;
  secondaryTagline: string;
  phone: string;
  email: string;
  location: string;
  logoUrl: string;
  primaryServiceArea: string;
  serviceCommunities: string[];
  plannedExpansion: string[];
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
};
