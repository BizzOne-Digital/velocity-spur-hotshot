import Accent from "@/components/ui/Accent";
import SafeImage from "@/components/ui/SafeImage";
import { GlowRule, Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { getIcon } from "@/lib/icons";
import type { SectionContent } from "@/lib/types";

type Item = { icon?: string; title: string; description?: string };

/** Four-column value strip with truck image bleeding in from the left, as in the reference. */
export default function WhyChoose({ section, items }: { section: SectionContent; items: Item[] }) {
  return (
    <section aria-labelledby="why-heading" className="relative isolate overflow-hidden bg-charcoal py-20 sm:py-24">
      <GlowRule className="absolute top-0 left-0 right-0" />
      <div className="absolute inset-y-0 left-0 -z-10 w-full lg:w-[38%]">
        <SafeImage src={section.image} alt="" fill sizes="(min-width:1024px) 38vw, 100vw" className="object-cover opacity-30 lg:opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#16181d]/70 to-[#16181d]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16181d] via-transparent to-[#16181d]/60 lg:hidden" />
      </div>
      <div aria-hidden className="absolute -right-20 top-0 -z-10 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:ml-[30%]">
          <Reveal>
            <h2 id="why-heading" className="heading-display text-4xl sm:text-5xl lg:text-6xl">
              <Accent text={section.heading} />
            </h2>
            {section.subheading && <p className="mt-4 max-w-2xl text-white/75">{section.subheading}</p>}
          </Reveal>

          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <StaggerItem key={item.title} className="group bg-[#14161b]/95 p-6 text-center transition hover:bg-[#1b1e24]">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-brand/40 text-brand transition group-hover:border-brand group-hover:shadow-[0_0_24px_rgba(255,121,0,.45)]">
                    <Icon className="h-8 w-8" strokeWidth={1.6} aria-hidden />
                  </span>
                  <h3 className="heading-display mt-5 text-2xl text-white">{item.title}</h3>
                  {item.description && <p className="mt-3 text-sm leading-relaxed text-white/70">{item.description}</p>}
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
