// Named site images in public/images. To change a photo, export it as .webp
// (1920px wide, landscape) and overwrite the file with the same name.
// Admins can also override any image from the admin panel.
// Bump IMAGE_VERSION after replacing files so browsers fetch the new copies.
const IMAGE_VERSION = "2";
const img = (name: string) => `/images/${name}.webp?v=${IMAGE_VERSION}`;

export const IMG = {
  // Home
  homeHeroTruck: img("home-hero-truck"),
  homeHeroBackground: img("home-hero-background"),
  homeWhyChoose: img("home-why-choose"),
  homeServiceArea: img("home-service-area"),
  homePartnership: img("home-partnership"),

  // Inner page heroes and sections
  aboutHero: img("about-hero"),
  aboutCompany: img("about-company"),
  aboutMission: img("about-mission"),
  servicesHero: img("services-hero"),
  packagesHero: img("packages-hero"),
  quoteHero: img("quote-hero"),
  contactHero: img("contact-hero"),
  contactPartnership: img("contact-partnership"),

  // Closing call-to-action band (shared)
  ctaBackground: img("cta-background"),

  // Services
  serviceConstructionMaterials: img("service-construction-materials"),
  serviceHeavyEquipment: img("service-heavy-equipment"),
  serviceEquipmentRental: img("service-equipment-rental"),
  serviceManufacturingIndustrial: img("service-manufacturing-industrial"),
  serviceOilfieldEnergy: img("service-oilfield-energy"),
  serviceAgricultural: img("service-agricultural"),
  serviceTimeSensitiveHotshot: img("service-time-sensitive-hotshot"),
  serviceDedicatedContract: img("service-dedicated-contract"),

  // Packages
  packageConstructionContracts: img("package-construction-contracts"),
  packageEquipmentRental: img("package-equipment-rental"),
  packagePriorityHotshot: img("package-priority-hotshot"),
  packageDedicatedPartnership: img("package-dedicated-partnership"),
  packageBackupCarrier: img("package-backup-carrier"),
};
