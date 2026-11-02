import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import ServiceDetail from "@/components/services/ServiceDetail";
import { getPageContent, getServices, getSettings } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Our Services | Construction & Equipment Transportation Alberta",
  description:
    "Construction material transportation, heavy equipment hauling, equipment rental transportation, industrial freight and time-sensitive hotshot deliveries across Edmonton and Alberta.",
  path: "/services",
  image: IMG.servicesHero,
});

export default async function ServicesPage() {
  const [c, services, settings] = await Promise.all([getPageContent("services"), getServices(), getSettings()]);

  return (
    <>
      <PageHero heading={c.hero.heading} subheading={c.hero.subheading} image={c.hero.image} crumb="Services">
        {services.length > 0 && (
          <nav aria-label="Jump to service" className="mt-10">
            <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {services.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <li key={s.id} className="shrink-0">
                    <Link
                      href={`#${s.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/85 backdrop-blur transition hover:border-brand hover:text-brand"
                    >
                      <Icon className="h-4 w-4 text-brand" aria-hidden />
                      {s.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </PageHero>

      <section className="bg-industrial py-20 sm:py-24">
        <div className="mx-auto max-w-7xl space-y-24 px-4 sm:space-y-32 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <p className="text-center text-white/60">Service details are being updated. Please contact us to discuss your requirements.</p>
          ) : (
            services.map((s, i) => <ServiceDetail key={s.id} service={s} index={i} />)
          )}
        </div>
      </section>

      <CtaBand
        heading={c.cta.heading}
        description={c.cta.description}
        image={c.cta.image}
        ctaLabel={c.cta.ctaLabel}
        ctaUrl={c.cta.ctaUrl}
        phone={settings.phone}
      />
    </>
  );
}
