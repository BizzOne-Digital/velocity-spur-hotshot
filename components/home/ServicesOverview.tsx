import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import ServiceCard from "@/components/services/ServiceCard";
import type { SectionContent, ServiceItem } from "@/lib/types";

export default function ServicesOverview({ section, services }: { section: SectionContent; services: ServiceItem[] }) {
  return (
    <section aria-labelledby="services-heading" className="bg-industrial relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div id="services-heading">
            <SectionHeading heading={section.heading} subheading={section.subheading} />
          </div>
        </Reveal>

        {services.length === 0 ? (
          <p className="mt-12 text-center text-white/60">Service details are being updated. Please contact us for details.</p>
        ) : (
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((s) => (
              <StaggerItem key={s.id} className="relative">
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {section.ctaLabel && section.ctaUrl && (
          <Reveal className="mt-12 flex justify-center">
            <ButtonLink href={section.ctaUrl} variant="outline">
              {section.ctaLabel}
            </ButtonLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}
