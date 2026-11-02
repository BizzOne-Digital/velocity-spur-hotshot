import Link from "next/link";
import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import type { ServiceItem, SiteSettings } from "@/lib/types";
import { ButtonLink } from "@/components/ui/Button";
import SocialIcons from "@/components/ui/SocialIcons";
import Accent from "@/components/ui/Accent";
import Logo from "./Logo";

type Props = { settings: SiteSettings; services: ServiceItem[] };

function ColTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-4 font-display text-lg font-bold italic uppercase tracking-wide text-white">
      {children}
      <span aria-hidden className="mt-1.5 block h-[2px] w-10 bg-brand shadow-[0_0_8px_rgba(255,121,0,.8)]" />
    </h2>
  );
}

export default function Footer({ settings, services }: Props) {
  const tel = settings.phone.replace(/[^\d+]/g, "");
  const tagline = settings.tagline.includes(".")
    ? settings.tagline.replace(/^(.*?\.)\s*(.*)$/, "$1\n*$2*")
    : settings.tagline;

  return (
    <footer className="bg-industrial relative border-t border-transparent">
      <div aria-hidden className="glow-line absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <Logo src={settings.logoUrl} className="h-28 w-auto" />
          <p className="heading-display mt-6 text-3xl">
            <Accent text={tagline} />
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{settings.secondaryTagline}</p>
          <div className="mt-6">
            <SocialIcons socials={settings.socials} />
          </div>
        </div>

        <nav aria-label="Footer quick links" className="lg:col-span-2">
          <ColTitle>Quick Links</ColTitle>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/70 transition hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer services" className="lg:col-span-3">
          <ColTitle>Services</ColTitle>
          <ul className="space-y-2.5 text-sm">
            {services.slice(0, 8).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/services#${s.slug}`}
                  className="group flex items-start gap-1.5 text-white/70 transition hover:text-brand"
                >
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-brand transition group-hover:translate-x-0.5" aria-hidden />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8 lg:col-span-3">
          <div>
            <ColTitle>Contact</ColTitle>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${tel}`} className="flex items-center gap-3 text-white/80 hover:text-brand">
                  <Phone className="h-4 w-4 text-brand" aria-hidden /> {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 break-all text-white/80 hover:text-brand">
                  <Mail className="h-4 w-4 shrink-0 text-brand" aria-hidden /> {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <MapPin className="h-4 w-4 text-brand" aria-hidden /> {settings.location}
              </li>
            </ul>
          </div>
          <div>
            <ColTitle>Service Areas</ColTitle>
            <p className="text-sm text-white/80">
              <span className="font-semibold text-white">Primary:</span> {settings.primaryServiceArea}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/55">{settings.serviceCommunities.join(" · ")}</p>
            {settings.plannedExpansion.length > 0 && (
              <p className="mt-2 text-xs text-white/55">
                <span className="font-semibold uppercase tracking-wider text-brand/90">Planned expansion:</span>{" "}
                {settings.plannedExpansion.join(", ")}
              </p>
            )}
          </div>
          <ButtonLink href="/request-quote" size="sm">
            Request a Quote
          </ButtonLink>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <p className="flex items-center gap-3 font-display text-sm font-bold italic uppercase tracking-wider text-white/80">
            <span className="text-brand" aria-hidden>
              //
            </span>
            {settings.companyName}
          </p>
          <p>
            &copy; {new Date().getFullYear()} {settings.companyName} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
