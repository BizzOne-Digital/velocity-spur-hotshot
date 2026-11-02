import { CheckCircle2 } from "lucide-react";
import Accent from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import SafeImage from "@/components/ui/SafeImage";
import { GlowRule, Reveal } from "@/components/ui/Reveal";
import type { SectionContent } from "@/lib/types";

export default function Partnership({ section, points }: { section: SectionContent; points: string[] }) {
  return (
    <section aria-labelledby="partner-heading" className="relative isolate overflow-hidden bg-charcoal py-20 sm:py-24">
      <GlowRule className="absolute top-0 left-0 right-0" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal className="relative order-2 lg:order-1">
          <div
            className="relative aspect-[4/3] overflow-hidden border border-brand/40"
            style={{ clipPath: "polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)" }}
          >
            <SafeImage
              src={section.image}
              alt="Construction crew on an active jobsite"
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/70 via-transparent to-brand/15" />
          </div>
          <span aria-hidden className="absolute -right-3 top-10 h-28 w-[3px] bg-brand shadow-[0_0_12px_rgba(255,121,0,.9)]" />
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <h2 id="partner-heading" className="heading-display text-4xl sm:text-5xl lg:text-6xl">
            <Accent text={section.heading} />
          </h2>
          <p className="mt-5 text-white/75">{section.description}</p>
          <ul className="mt-7 space-y-3">
            {points.map((pt) => (
              <li key={pt} className="flex items-start gap-3 font-display text-lg font-semibold italic uppercase tracking-wide text-white">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                {pt}
              </li>
            ))}
          </ul>
          {section.ctaLabel && section.ctaUrl && (
            <div className="mt-8">
              <ButtonLink href={section.ctaUrl}>{section.ctaLabel}</ButtonLink>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
