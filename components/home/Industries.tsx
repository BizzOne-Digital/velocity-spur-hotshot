import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { getIcon } from "@/lib/icons";
import type { SectionContent } from "@/lib/types";

type Item = { icon?: string; title: string };

/** Icon strip replacing the reference's testimonials with factual positioning. */
export default function Industries({ section, items }: { section: SectionContent; items: Item[] }) {
  return (
    <section aria-labelledby="industries-heading" className="bg-industrial relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div id="industries-heading">
            <SectionHeading heading={section.heading} subheading={section.subheading} />
          </div>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7" gap={0.06}>
          {items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <StaggerItem key={item.title}>
                <div className="card-glow clip-angle group flex h-full flex-col items-center justify-center gap-3 px-3 py-7 text-center">
                  <Icon
                    className="h-10 w-10 text-steel transition duration-300 group-hover:-translate-y-1 group-hover:text-brand"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="font-display text-base font-bold italic uppercase leading-tight tracking-wide text-white">
                    {item.title}
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
