import { Check, Target } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import Accent from "@/components/ui/Accent";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import { GlowRule, Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { dataList, getGallery, getPageContent, getSettings } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "About Us | Alberta Hotshot Trucking Company",
  description:
    "Velocity Spur Hotshot Ltd. is an Edmonton-based hotshot trucking company delivering reliable, time-sensitive transportation for construction, equipment rental, manufacturing and industrial customers across Alberta.",
  path: "/about",
  image: IMG.aboutHero,
});

type ValueItem = { icon?: string; title: string; description?: string };

export default async function AboutPage() {
  const [c, settings, gallery] = await Promise.all([getPageContent("about"), getSettings(), getGallery()]);
  const supports = dataList<string>(c.company, "supports");
  const values = dataList<ValueItem>(c.values, "items");

  return (
    <>
      <PageHero heading={c.hero.heading} subheading={c.hero.subheading} image={c.hero.image} crumb="About Us" />

      {/* Our Company */}
      <section aria-labelledby="company-heading" className="bg-industrial py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 id="company-heading" className="heading-display text-5xl sm:text-6xl">
              <Accent text={c.company.heading} />
            </h2>
            <div className="mt-6 space-y-4 text-white/80">
              {c.company.description.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {supports.length > 0 && (
              <>
                <h3 className="mt-8 font-display text-xl font-bold italic uppercase tracking-wide text-white">
                  We Support
                </h3>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {supports.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-white/85">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Reveal>
          <Reveal delay={0.15} className="relative">
            <div
              className="relative aspect-[4/3] overflow-hidden border border-brand/40 shadow-[0_0_40px_rgba(255,121,0,.18)]"
              style={{ clipPath: "polygon(8% 0, 100% 0, 100% 90%, 92% 100%, 0 100%, 0 10%)" }}
            >
              <SafeImage src={c.company.image} alt="Excavator on a construction site" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section aria-labelledby="mission-heading" className="relative isolate overflow-hidden py-20 sm:py-28">
        <GlowRule className="absolute top-0 left-0 right-0" />
        <div className="absolute inset-0 -z-10">
          <SafeImage src={c.mission.image} alt="" fill sizes="100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-ink/75" />
          <div className="absolute inset-0 speed-lines" />
        </div>
        <Reveal className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-brand/60 text-brand shadow-[0_0_24px_rgba(255,121,0,.4)]">
            <Target className="h-8 w-8" aria-hidden />
          </span>
          <h2 id="mission-heading" className="heading-display mt-6 text-5xl sm:text-6xl">
            <Accent text={c.mission.heading} />
          </h2>
          <p className="mt-6 font-display text-2xl font-semibold italic leading-snug text-white sm:text-4xl">
            “{c.mission.description}”
          </p>
        </Reveal>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="bg-charcoal relative py-20 sm:py-24">
        <GlowRule className="absolute top-0 left-0 right-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div id="values-heading">
              <SectionHeading heading={c.values.heading} subheading={c.values.subheading} />
            </div>
          </Reveal>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {values.map((v, i) => {
              const Icon = getIcon(v.icon);
              return (
                <StaggerItem key={v.title}>
                  <article className="card-glow clip-angle group h-full p-6">
                    <div className="flex items-center justify-between">
                      <span className="grid h-14 w-14 place-items-center rounded-lg border border-brand/50 text-brand transition group-hover:bg-brand group-hover:text-ink">
                        <Icon className="h-7 w-7" aria-hidden />
                      </span>
                      <span aria-hidden className="font-display text-4xl font-black italic text-white/10">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="heading-display mt-5 text-2xl text-white">{v.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{v.description}</p>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {gallery.length > 0 && (
        <section aria-labelledby="gallery-heading" className="bg-industrial py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div id="gallery-heading">
                <SectionHeading heading="Equipment & *Operations*" />
              </div>
            </Reveal>
            <Stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((g) => (
                <StaggerItem key={g.id}>
                  <figure className="card-glow group overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <SafeImage src={g.image} alt={g.title} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <figcaption className="p-3">
                      <p className="text-sm font-semibold text-white">{g.title}</p>
                      {g.category && <p className="text-xs uppercase tracking-wider text-brand">{g.category}</p>}
                    </figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

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
