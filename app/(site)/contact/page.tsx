import { Handshake, Mail, MapPin, Navigation, Phone } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import Accent from "@/components/ui/Accent";
import SafeImage from "@/components/ui/SafeImage";
import InquiryForm from "@/components/forms/InquiryForm";
import { GlowRule, Reveal } from "@/components/ui/Reveal";
import { getPageContent, getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Contact Us | Edmonton Hotshot Trucking",
  description:
    "Contact Velocity Spur Hotshot Ltd. in Edmonton, Alberta. Call 780-802-1074 or send a message about construction, equipment or industrial transportation.",
  path: "/contact",
  image: IMG.contactHero,
});

export default async function ContactPage() {
  const [c, settings] = await Promise.all([getPageContent("contact"), getSettings()]);
  const tel = settings.phone.replace(/[^\d+]/g, "");

  const cards = [
    { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${tel}` },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Location", value: settings.location },
  ];

  return (
    <>
      <PageHero heading={c.hero.heading} subheading={c.hero.subheading} image={c.hero.image} crumb="Contact" />

      <section className="bg-industrial py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <Reveal className="lg:col-span-5">
            <h2 className="heading-display text-4xl sm:text-5xl">
              <Accent text={c.info.heading} />
            </h2>
            <p className="mt-4 text-white/75">{c.info.description}</p>

            <ul className="mt-8 space-y-4">
              {cards.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="card-glow flex items-center gap-4 p-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-b from-brand to-brand-deep text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-steel">{label}</p>
                    {href ? (
                      <a href={href} className="block break-all text-lg font-semibold text-white hover:text-brand">
                        {value}
                      </a>
                    ) : (
                      <p className="text-lg font-semibold text-white">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg border border-white/10 bg-ink/50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-steel">Service Area</p>
              <p className="mt-1 font-display text-2xl font-bold italic uppercase text-white">{settings.primaryServiceArea}</p>
              <p className="mt-1 text-sm text-white/60">{settings.serviceCommunities.join(" · ")}</p>
              {settings.plannedExpansion.length > 0 && (
                <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
                  <Navigation className="h-4 w-4 text-brand" aria-hidden />
                  <span>
                    <span className="font-semibold text-brand">Planned expansion:</span> {settings.plannedExpansion.join(", ")}
                  </span>
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <InquiryForm />
          </Reveal>
        </div>
      </section>

      {/* Partnership */}
      <section id="partnership" aria-labelledby="partnership-heading" className="bg-charcoal relative scroll-mt-24 py-16 sm:py-20">
        <GlowRule className="absolute top-0 left-0 right-0" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <span className="grid h-14 w-14 place-items-center rounded-lg border border-brand/60 text-brand">
              <Handshake className="h-7 w-7" aria-hidden />
            </span>
            <h2 id="partnership-heading" className="heading-display mt-5 text-4xl sm:text-5xl">
              <Accent text={c.partnership.heading} />
            </h2>
            <p className="mt-4 text-white/75">{c.partnership.description}</p>
            <div className="mt-8">
              <InquiryForm defaultType="Business Partnership" idPrefix="partner" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6">
            <div
              className="relative aspect-[4/3] overflow-hidden border border-brand/40"
              style={{ clipPath: "polygon(8% 0, 100% 0, 100% 90%, 92% 100%, 0 100%, 0 10%)" }}
            >
              <SafeImage src={c.partnership.image} alt="Loader moving material on a jobsite" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>
            <div className="card-glow overflow-hidden">
              <iframe
                title="Map showing Edmonton, Alberta — general service location"
                src="https://www.google.com/maps?q=Edmonton,+Alberta,+Canada&z=10&output=embed"
                className="h-72 w-full grayscale-[60%] invert-[0.9] hue-rotate-180"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        heading={c.quoteCta.heading}
        description={c.quoteCta.description}
        image={c.quoteCta.image}
        ctaLabel={c.quoteCta.ctaLabel}
        ctaUrl={c.quoteCta.ctaUrl}
        phone={settings.phone}
      />
    </>
  );
}
