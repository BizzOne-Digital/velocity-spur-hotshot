import { MapPin, Navigation } from "lucide-react";
import Accent from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import SafeImage from "@/components/ui/SafeImage";
import { GlowRule, Reveal } from "@/components/ui/Reveal";
import type { SectionContent, SiteSettings } from "@/lib/types";
import AlbertaMap from "./AlbertaMap";

type Props = { section: SectionContent; settings: SiteSettings };

export default function ServiceArea({ section, settings }: Props) {
  return (
    <section aria-labelledby="area-heading" className="relative isolate overflow-hidden bg-charcoal py-20 sm:py-24">
      <GlowRule className="absolute top-0 left-0 right-0" />
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/3 lg:block">
        <SafeImage src={section.image} alt="" fill sizes="33vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#16181d] to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">{section.subheading}</p>
          <h2 id="area-heading" className="heading-display mt-3 text-5xl sm:text-6xl">
            <Accent text={section.heading} />
          </h2>
          <p className="mt-5 max-w-xl text-white/75">{section.description}</p>

          <div className="mt-8">
            <h3 className="font-display text-lg font-bold italic uppercase tracking-wide text-white">
              Primary Communities
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {settings.serviceCommunities.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-2 rounded-md border border-white/10 bg-ink/50 px-3 py-2 text-sm text-white/90"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {settings.plannedExpansion.length > 0 && (
            <div className="mt-6 rounded-lg border border-dashed border-steel/30 bg-ink/40 p-4">
              <p className="flex items-center gap-2 font-display text-base font-bold italic uppercase tracking-wide text-steel">
                <Navigation className="h-4 w-4 text-brand" aria-hidden />
                Planned Expansion
              </p>
              <p className="mt-1.5 text-sm text-white/70">
                {settings.plannedExpansion.join(" and ")} — future service areas, not currently active.
              </p>
            </div>
          )}

          {section.ctaLabel && section.ctaUrl && (
            <div className="mt-8">
              <ButtonLink href={section.ctaUrl}>{section.ctaLabel}</ButtonLink>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.15} className="card-glow p-4 sm:p-6">
          <AlbertaMap planned={settings.plannedExpansion} />
        </Reveal>
      </div>
    </section>
  );
}
