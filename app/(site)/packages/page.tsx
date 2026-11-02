import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import SectionHeading from "@/components/ui/SectionHeading";
import PackageCard from "@/components/packages/PackageCard";
import { GlowRule, Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { dataList, getPackages, getPageContent, getSettings } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Transportation Packages | Construction & Equipment Rental Contracts Alberta",
  description:
    "Recurring construction transportation contracts, equipment rental transportation, priority hotshot deliveries, dedicated partnerships and backup carrier services in Alberta. Free consultations and quotes.",
  path: "/packages",
  image: IMG.packagesHero,
});

type Benefit = { icon?: string; title: string; description?: string };

export default async function PackagesPage() {
  const [c, packages, settings] = await Promise.all([getPageContent("packages"), getPackages(), getSettings()]);
  const benefits = dataList<Benefit>(c.benefits, "items");

  return (
    <>
      <PageHero heading={c.hero.heading} subheading={c.hero.subheading} image={c.hero.image} crumb="Transportation Packages" />

      <section className="bg-industrial py-20 sm:py-24" aria-label="Transportation packages">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {packages.length === 0 ? (
            <p className="text-center text-white/60">Packages are being updated. Contact us to discuss your requirements.</p>
          ) : (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((p) => (
                <StaggerItem key={p.id}>
                  <PackageCard pkg={p} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
          <p className="mt-10 text-center text-sm text-white/55">
            Pricing is provided by quote based on route, freight, equipment and schedule. Fixed rates are not published.
          </p>
        </div>
      </section>

      <section aria-labelledby="benefits-heading" className="bg-charcoal relative py-20 sm:py-24">
        <GlowRule className="absolute top-0 left-0 right-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div id="benefits-heading">
              <SectionHeading heading={c.benefits.heading} subheading={c.benefits.subheading} />
            </div>
          </Reveal>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((b) => {
              const Icon = getIcon(b.icon);
              return (
                <StaggerItem key={b.title}>
                  <div className="card-glow clip-angle h-full p-7 text-center">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-b from-brand to-brand-deep text-white shadow-[0_0_24px_rgba(255,121,0,.5)]">
                      <Icon className="h-8 w-8" aria-hidden />
                    </span>
                    <h3 className="heading-display mt-5 text-2xl text-white">{b.title}</h3>
                    {b.description && <p className="mt-3 text-sm text-white/70">{b.description}</p>}
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
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
