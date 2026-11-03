import { IMG } from "./images";
import type { PackageItem, SectionContent, ServiceItem, SiteSettings } from "./types";

/*
 * Default content used to seed MongoDB and as a fallback when the database is
 * unavailable. Headings support two light formatting conventions:
 *   - "\n" forces a line break
 *   - "*word*" renders in the brand orange
 * Content rule: no fabricated stats, reviews, fleet size, 24/7 claims or
 * service outside Alberta (Saskatchewan / BC are planned only).
 */

export const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "Velocity Spur Hotshot Ltd.",
  tagline: "Your Freight. Our Commitment.",
  secondaryTagline: "Reliable Transportation. Professional Service. Built for Your Business.",
  phone: "780-802-1074",
  email: "velocityspurshotshot@gmail.com",
  location: "Edmonton, Alberta, Canada",
  logoUrl: "",
  primaryServiceArea: "Alberta",
  serviceCommunities: [
    "Edmonton",
    "Acheson",
    "Spruce Grove",
    "Sherwood Park",
    "Leduc",
    "Nisku",
    "Red Deer",
    "Calgary",
  ],
  plannedExpansion: ["Saskatchewan", "British Columbia"],
  socials: { facebook: "https://www.facebook.com/share/1EAGn11Bx5/", instagram: "", linkedin: "", youtube: "" },
};

type SectionInput = Partial<SectionContent> & { sectionKey: string };
const s = (input: SectionInput): SectionContent => ({
  heading: "",
  subheading: "",
  description: "",
  image: "",
  ctaLabel: "",
  ctaUrl: "",
  additionalData: {},
  ...input,
});

export const DEFAULT_PAGES: Record<string, SectionContent[]> = {
  home: [
    s({
      sectionKey: "hero",
      heading: "Reliable Hotshot\n*Trucking &*\n*Transportation*",
      subheading: "Driven by Reliability. Built for Business.",
      description:
        "Dependable, time-sensitive transportation for construction materials, equipment and commercial freight throughout Alberta.",
      image: IMG.homeHeroTruck,
      ctaLabel: "Request a Quote",
      ctaUrl: "/request-quote",
      additionalData: {
        secondaryCtaLabel: "Explore Services",
        secondaryCtaUrl: "/services",
        indicators: ["Construction", "Equipment", "Industrial", "Commercial Freight"],
        backgroundImage: IMG.homeHeroBackground,
      },
    }),
    s({
      sectionKey: "services",
      heading: "Our *Services*",
      subheading: "Hotshot & specialized transportation for Alberta business",
      ctaLabel: "View All Services",
      ctaUrl: "/services",
    }),
    s({
      sectionKey: "why",
      heading: "Why Choose *Velocity Spur Hotshot?*",
      subheading:
        "A transportation partner built around reliability, safety, clear communication and the realities of commercial work.",
      image: IMG.homeWhyChoose,
      additionalData: {
        items: [
          {
            icon: "shield",
            title: "Reliability",
            description: "Dependable transportation planning focused on keeping commercial operations moving.",
          },
          {
            icon: "badge",
            title: "Safety",
            description: "Proper cargo securement and attention to applicable transportation requirements.",
          },
          {
            icon: "messages",
            title: "Communication",
            description: "Clear coordination between customers, transportation operations and drivers.",
          },
          {
            icon: "shuffle",
            title: "Flexibility",
            description: "Transportation solutions structured around commercial requirements.",
          },
        ],
      },
    }),
    s({
      sectionKey: "industries",
      heading: "Industries We *Support*",
      subheading: "Built for commercial transportation",
      additionalData: {
        items: [
          { icon: "construction", title: "Construction" },
          { icon: "forklift", title: "Equipment Rental" },
          { icon: "factory", title: "Manufacturing" },
          { icon: "flame", title: "Oil & Energy" },
          { icon: "tractor", title: "Agriculture" },
          { icon: "cog", title: "Industrial" },
          { icon: "boxes", title: "Building Materials" },
        ],
      },
    }),
    s({
      sectionKey: "serviceArea",
      heading: "Alberta *Service Area*",
      subheading: "Primary service area",
      description:
        "Based in Edmonton, we focus on the communities and industrial corridors that keep Alberta building — from the Edmonton region down the QE2 to Red Deer and Calgary.",
      image: IMG.homeServiceArea,
      ctaLabel: "Check Your Route",
      ctaUrl: "/request-quote",
    }),
    s({
      sectionKey: "packages",
      heading: "Transportation *Packages*",
      subheading: "Structured around how your business moves freight",
      description:
        "From recurring construction contracts to backup carrier capacity, every arrangement is built around your schedule and requirements. No fixed rate cards — custom pricing for recurring customers.",
      ctaLabel: "Explore Packages",
      ctaUrl: "/packages",
    }),
    s({
      sectionKey: "partnership",
      heading: "Built for Long-Term\n*Business Partnerships*",
      description:
        "Construction companies, equipment rental branches and manufacturers need a carrier they can plan around. We welcome recurring work, dedicated arrangements and backup capacity partnerships.",
      image: IMG.homePartnership,
      ctaLabel: "Discuss a Partnership",
      ctaUrl: "/contact#partnership",
      additionalData: {
        points: [
          "Free transportation consultations & quotes",
          "Custom pricing for recurring business customers",
          "Negotiated long-term transportation arrangements",
        ],
      },
    }),
    s({
      sectionKey: "quoteCta",
      heading: "Your Freight.\n*Our Commitment.*",
      description:
        "Tell us what needs to move, where and when. We will review your requirements and respond with a transportation quote.",
      image: IMG.ctaBackground,
      ctaLabel: "Request a Quote",
      ctaUrl: "/request-quote",
    }),
  ],

  about: [
    s({
      sectionKey: "hero",
      heading: "About *Velocity Spur*\n*Hotshot Ltd.*",
      subheading: "Reliable Transportation. Professional Service. Built for Your Business.",
      image: IMG.aboutHero,
    }),
    s({
      sectionKey: "company",
      heading: "Our *Company*",
      description:
        "Velocity Spur Hotshot Ltd. is an Alberta-based hotshot trucking and transportation company focused on reliable, efficient and time-sensitive freight solutions.\n\nWe are a newly incorporated company built from the ground up around what commercial customers actually need from a carrier: clear communication, careful handling and a schedule you can plan a project around.",
      image: IMG.aboutCompany,
      additionalData: {
        supports: [
          "Construction",
          "Equipment rental",
          "Manufacturing",
          "Industrial",
          "Agricultural",
          "Energy-related transportation requirements",
        ],
      },
    }),
    s({
      sectionKey: "mission",
      heading: "Our *Mission*",
      description: "Deliver dependable transportation solutions that help businesses keep their projects moving.",
      image: IMG.aboutMission,
    }),
    s({
      sectionKey: "values",
      heading: "What We *Stand For*",
      subheading: "The standards behind every load",
      additionalData: {
        items: [
          {
            icon: "shield",
            title: "Reliability",
            description:
              "We plan every move around your schedule and communicate early if anything changes, so your crews and customers are never left guessing.",
          },
          {
            icon: "badge",
            title: "Safety",
            description:
              "Proper load securement, equipment checks and attention to applicable transportation requirements on every trip.",
          },
          {
            icon: "messages",
            title: "Communication",
            description:
              "Clear coordination between your team, our operations and the driver — from pickup confirmation to delivery.",
          },
          {
            icon: "shuffle",
            title: "Flexibility",
            description:
              "One-off priority runs, scheduled rental moves or recurring contract work — arrangements built around your operation.",
          },
          {
            icon: "hard-hat",
            title: "Professionalism",
            description:
              "Respect for your jobsite, your yard and your customers. We represent your business every time we arrive on site.",
          },
        ],
      },
    }),
    s({
      sectionKey: "cta",
      heading: "Your Freight.\n*Our Commitment.*",
      description: "Talk to us about your next load, project or recurring transportation requirement.",
      image: IMG.ctaBackground,
      ctaLabel: "Request a Quote",
      ctaUrl: "/request-quote",
    }),
  ],

  services: [
    s({
      sectionKey: "hero",
      heading: "Our *Services*",
      subheading: "Hotshot and specialized transportation for construction, equipment and commercial freight across Alberta.",
      image: IMG.servicesHero,
    }),
    s({
      sectionKey: "cta",
      heading: "Have a Load That\n*Needs to Move?*",
      description:
        "Share the pickup, delivery, dimensions and timing. We will confirm what is possible and send a transportation quote.",
      image: IMG.ctaBackground,
      ctaLabel: "Request a Quote",
      ctaUrl: "/request-quote",
    }),
  ],

  packages: [
    s({
      sectionKey: "hero",
      heading: "Transportation\n*Packages*",
      subheading: "Flexible arrangements for construction, equipment rental and commercial operations.",
      image: IMG.packagesHero,
    }),
    s({
      sectionKey: "benefits",
      heading: "Every Package *Includes*",
      additionalData: {
        items: [
          {
            icon: "handshake",
            title: "Free Transportation Consultations & Quotes",
            description: "We review your requirements and recommend the right arrangement at no cost.",
          },
          {
            icon: "layers",
            title: "Custom Pricing for Recurring Business Customers",
            description: "Pricing is built around your volume, lanes and schedule — not a generic rate card.",
          },
          {
            icon: "calendar",
            title: "Negotiated Long-Term Transportation Arrangements",
            description: "Term agreements that give your team predictable capacity and costs.",
          },
        ],
      },
    }),
    s({
      sectionKey: "cta",
      heading: "Discuss Your Transportation\n*Requirements*",
      description:
        "Every operation is different. Tell us about your lanes, volumes and timing and we will put together an arrangement that fits.",
      image: IMG.ctaBackground,
      ctaLabel: "Discuss Your Transportation Requirements",
      ctaUrl: "/contact#partnership",
    }),
  ],

  quote: [
    s({
      sectionKey: "hero",
      heading: "Request a\n*Transportation Quote*",
      subheading:
        "Provide as much detail as you can about your load. Accurate dimensions and weights help us respond faster.",
      image: IMG.quoteHero,
    }),
    s({
      sectionKey: "sidebar",
      heading: "What Happens *Next*",
      additionalData: {
        items: [
          { title: "Review", description: "We review your freight details, route and timing." },
          { title: "Clarify", description: "If anything is unclear we contact you to confirm specifics." },
          { title: "Quote", description: "You receive a transportation quote based on your requirements." },
          { title: "Schedule", description: "Once approved, pickup and delivery are scheduled and confirmed." },
        ],
      },
    }),
  ],

  contact: [
    s({
      sectionKey: "hero",
      heading: "Contact *Us*",
      subheading: "Questions, partnerships or a load to move — we are ready to talk.",
      image: IMG.contactHero,
    }),
    s({
      sectionKey: "info",
      heading: "Get In *Touch*",
      description:
        "Reach us by phone or email, or send a message using the form. For freight pricing, the quote request form gives us everything we need.",
    }),
    s({
      sectionKey: "partnership",
      heading: "Business *Partnership* Inquiries",
      description:
        "Looking for a recurring carrier, a dedicated arrangement or backup capacity for your construction or rental operation? Select “Business Partnership” in the form and tell us about your requirements.",
      image: IMG.contactPartnership,
    }),
    s({
      sectionKey: "quoteCta",
      heading: "Ready to Move\n*Your Freight?*",
      description: "Skip the back-and-forth. Send your load details and we will respond with a quote.",
      image: IMG.ctaBackground,
      ctaLabel: "Request a Quote",
      ctaUrl: "/request-quote",
    }),
  ],
};

type ServiceSeed = Omit<ServiceItem, "id">;

export const DEFAULT_SERVICES: ServiceSeed[] = [
  {
    title: "Construction Material Transportation",
    slug: "construction-material-transportation",
    shortDescription: "Lumber, steel, pipe and palletized supplies delivered to the jobsite when crews need them.",
    description:
      "Keep your project on schedule with dependable delivery of construction materials to active jobsites, laydown yards and supplier locations. Loads are secured for the material type and coordinated around site access and crew timing.",
    image: IMG.serviceConstructionMaterials,
    icon: "construction",
    features: [
      "Lumber & plywood",
      "Building materials",
      "Steel beams & structural components",
      "Pipes",
      "Palletized construction supplies",
      "Concrete forms & accessories",
      "Jobsite tools & equipment",
    ],
    disclaimer: "",
    order: 1,
    active: true,
  },
  {
    title: "Heavy Equipment & Machinery Transportation",
    slug: "heavy-equipment-machinery-transportation",
    shortDescription: "Compact construction equipment and machinery moved safely between yards and jobsites.",
    description:
      "Safe, properly secured transportation for compact construction equipment and machinery. Every move is planned around the equipment's dimensions and weight, loading conditions at both ends and the right securement for the unit.",
    image: IMG.serviceHeavyEquipment,
    icon: "hard-hat",
    features: [
      "Skid steers",
      "Compact track loaders",
      "Mini excavators",
      "Compactors",
      "Generators",
      "Small agricultural machinery",
      "Construction attachments",
    ],
    disclaimer:
      "Equipment acceptance depends on dimensions, weight, trailer capacity and applicable transportation requirements.",
    order: 2,
    active: true,
  },
  {
    title: "Equipment Rental Transportation",
    slug: "equipment-rental-transportation",
    shortDescription: "Delivery, pickup and branch transfers for rental fleets — on the schedule your customers expect.",
    description:
      "Rental companies live and die by delivery windows. We support rental branches with jobsite deliveries, returns to the yard and inter-branch transfers so your fleet is where it needs to be.",
    image: IMG.serviceEquipmentRental,
    icon: "forklift",
    features: [
      "Jobsite equipment delivery",
      "Returns to rental yards",
      "Branch transfers",
      "Scheduled relocation",
      "Transportation coordination",
    ],
    disclaimer: "",
    order: 3,
    active: true,
  },
  {
    title: "Manufacturing & Industrial Freight",
    slug: "manufacturing-industrial-freight",
    shortDescription: "Fabricated steel, components and parts moved between shops, plants and customer sites.",
    description:
      "Industrial freight rarely fits neatly on a standard truck schedule. We move fabricated components, machinery and replacement parts between fabrication shops, plants and customer sites with the care these loads require.",
    image: IMG.serviceManufacturingIndustrial,
    icon: "factory",
    features: [
      "Fabricated steel",
      "Metal components",
      "Industrial machinery",
      "Replacement parts",
      "Pipes & fittings",
      "Commercial supplies",
    ],
    disclaimer: "",
    order: 4,
    active: true,
  },
  {
    title: "Oilfield & Energy Sector Transportation",
    slug: "oilfield-energy-transportation",
    shortDescription: "Parts, tools and supplies for energy-sector operations and service companies.",
    description:
      "Support for energy-related operations that need parts, tools, equipment and supplies moved between yards, shops and field locations. Site access, timing and documentation requirements are confirmed before dispatch.",
    image: IMG.serviceOilfieldEnergy,
    icon: "flame",
    features: [
      "Replacement parts & components",
      "Tools & supplies",
      "Pipe & fittings",
      "Yard-to-site transportation",
      "Service company support",
    ],
    disclaimer: "Site access requirements and applicable transportation regulations are confirmed for each load.",
    order: 5,
    active: true,
  },
  {
    title: "Agricultural Equipment & Supply Transportation",
    slug: "agricultural-equipment-transportation",
    shortDescription: "Implements, small machinery and farm supplies moved between dealers, yards and farms.",
    description:
      "Seasonal timing matters in agriculture. We move implements, small machinery, parts and supplies between dealerships, repair shops and farm locations across Alberta.",
    image: IMG.serviceAgricultural,
    icon: "tractor",
    features: [
      "Small agricultural machinery",
      "Implements & attachments",
      "Dealer-to-farm deliveries",
      "Parts & repair transportation",
      "Farm supplies",
    ],
    disclaimer:
      "Equipment acceptance depends on dimensions, weight, trailer capacity and applicable transportation requirements.",
    order: 6,
    active: true,
  },
  {
    title: "Time-Sensitive Hotshot Deliveries",
    slug: "time-sensitive-hotshot-deliveries",
    shortDescription: "Direct, expedited runs for urgent parts, materials and equipment — subject to availability.",
    description:
      "When a breakdown, missed delivery or schedule change puts a project at risk, a dedicated hotshot run moves your freight directly from pickup to delivery without the stops of a consolidated load.",
    image: IMG.serviceTimeSensitiveHotshot,
    icon: "timer",
    features: [
      "Direct point-to-point runs",
      "Urgent replacement parts",
      "Same-day requests (subject to availability)",
      "Pickup & delivery confirmation",
      "Clear communication en route",
    ],
    disclaimer: "Priority deliveries are subject to availability at the time of request.",
    order: 7,
    active: true,
  },
  {
    title: "Dedicated Transportation & Contract Services",
    slug: "dedicated-transportation-contract-services",
    shortDescription: "Recurring, scheduled transportation arrangements for businesses that need a carrier they can plan around.",
    description:
      "For businesses with ongoing transportation needs, a dedicated or contract arrangement gives you predictable capacity, consistent service and pricing negotiated around your volumes.",
    image: IMG.serviceDedicatedContract,
    icon: "handshake",
    features: [
      "Recurring scheduled runs",
      "Project-length contracts",
      "Backup carrier capacity",
      "Custom pricing for recurring work",
      "Single point of coordination",
    ],
    disclaimer: "",
    order: 8,
    active: true,
  },
];

type PackageSeed = Omit<PackageItem, "id">;

export const DEFAULT_PACKAGES: PackageSeed[] = [
  {
    title: "Construction Transportation Contracts",
    slug: "construction-transportation-contracts",
    description: "Customized recurring transportation arrangements for construction companies.",
    features: [
      "Scheduled material and equipment moves",
      "Project-length or seasonal terms",
      "Jobsite delivery coordination",
      "Custom pricing for recurring volume",
    ],
    image: IMG.packageConstructionContracts,
    icon: "construction",
    ctaLabel: "Discuss a Contract",
    order: 1,
    active: true,
  },
  {
    title: "Equipment Rental Transportation",
    slug: "equipment-rental-transportation-package",
    description: "Scheduled pickup, delivery and return transportation.",
    features: [
      "Jobsite deliveries & returns",
      "Branch-to-branch transfers",
      "Scheduled relocation runs",
      "Coordination with branch staff",
    ],
    image: IMG.packageEquipmentRental,
    icon: "forklift",
    ctaLabel: "Discuss Rental Transport",
    order: 2,
    active: true,
  },
  {
    title: "Priority Hotshot Deliveries",
    slug: "priority-hotshot-deliveries",
    description: "Time-sensitive transportation subject to availability.",
    features: [
      "Direct point-to-point service",
      "Urgent parts & materials",
      "Pickup and delivery confirmation",
      "Subject to availability",
    ],
    image: IMG.packagePriorityHotshot,
    icon: "timer",
    ctaLabel: "Request Priority Delivery",
    order: 3,
    active: true,
  },
  {
    title: "Dedicated Transportation Partnerships",
    slug: "dedicated-transportation-partnerships",
    description: "Long-term transportation arrangements based on customer requirements.",
    features: [
      "Dedicated capacity planning",
      "Negotiated long-term terms",
      "Consistent service & communication",
      "Built around your lanes and volumes",
    ],
    image: IMG.packageDedicatedPartnership,
    icon: "handshake",
    ctaLabel: "Discuss a Partnership",
    order: 4,
    active: true,
  },
  {
    title: "Backup Carrier Services",
    slug: "backup-carrier-services",
    description: "Additional transportation capacity for construction and commercial operations.",
    features: [
      "Overflow capacity for busy periods",
      "Coverage when your fleet is committed",
      "On-call arrangements",
      "Simple onboarding",
    ],
    image: IMG.packageBackupCarrier,
    icon: "layers",
    ctaLabel: "Add Backup Capacity",
    order: 5,
    active: true,
  },
];
