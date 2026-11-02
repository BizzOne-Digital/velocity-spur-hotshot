import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import PackageCard from "@/components/packages/PackageCard";
import type { PackageItem, SectionContent } from "@/lib/types";

export default function PackagesPreview({ section, packages }: { section: SectionContent; packages: PackageItem[] }) {
  if (!packages.length) return null;
  return (
    <section aria-labelledby="packages-heading" className="bg-industrial relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div id="packages-heading">
            <SectionHeading heading={section.heading} subheading={section.subheading} />
          </div>
          {section.description && (
            <p className="mx-auto mt-5 max-w-3xl text-center text-white/70">{section.description}</p>
          )}
        </Reveal>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {packages.map((p) => (
            <StaggerItem key={p.id}>
              <PackageCard pkg={p} compact href={`/packages#${p.slug}`} />
            </StaggerItem>
          ))}
        </Stagger>

        {section.ctaLabel && section.ctaUrl && (
          <Reveal className="mt-12 flex justify-center">
            <ButtonLink href={section.ctaUrl}>{section.ctaLabel}</ButtonLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}
