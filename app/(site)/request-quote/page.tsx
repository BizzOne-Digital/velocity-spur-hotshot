import { Mail, Phone } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Accent from "@/components/ui/Accent";
import QuoteForm from "@/components/forms/QuoteForm";
import { Reveal } from "@/components/ui/Reveal";
import { dataList, getPageContent, getSettings } from "@/lib/data";
import { FREIGHT_TYPES } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const metadata = pageMetadata({
  title: "Request a Quote | Hotshot Delivery Edmonton & Alberta",
  description:
    "Request a transportation quote for construction materials, equipment, machinery or industrial freight. Edmonton-based hotshot trucking serving Alberta.",
  path: "/request-quote",
  image: IMG.quoteHero,
});

// Maps a ?service=slug link from the services page to a sensible freight type.
const SERVICE_TO_FREIGHT: [RegExp, (typeof FREIGHT_TYPES)[number]][] = [
  [/construction/, "Construction Materials"],
  [/heavy|machinery/, "Machinery"],
  [/rental/, "Equipment Rental"],
  [/manufacturing|industrial|oilfield|energy/, "Industrial Freight"],
  [/agricultur/, "Agricultural Equipment"],
  [/time-sensitive|priority/, "Priority Delivery"],
];

type Step = { title: string; description?: string };

export default async function RequestQuotePage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const [{ service }, c, settings] = await Promise.all([searchParams, getPageContent("quote"), getSettings()]);
  const defaultFreight = service ? (SERVICE_TO_FREIGHT.find(([re]) => re.test(service))?.[1] ?? "") : "";
  const steps = dataList<Step>(c.sidebar, "items");
  const tel = settings.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <PageHero heading={c.hero.heading} subheading={c.hero.subheading} image={c.hero.image} crumb="Request a Quote" />

      <section className="bg-industrial py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-8">
            <QuoteForm defaultFreight={defaultFreight} />
          </div>

          <aside className="space-y-6 lg:col-span-4" aria-label="Quote process and contact">
            <Reveal className="card-glow p-6 lg:sticky lg:top-28">
              <h2 className="heading-display text-3xl">
                <Accent text={c.sidebar.heading} />
              </h2>
              <ol className="mt-6 space-y-5">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-brand/60 font-display text-lg font-black italic text-brand">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold italic uppercase tracking-wide text-white">{s.title}</h3>
                      {s.description && <p className="text-sm text-white/65">{s.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-steel">Prefer to talk?</p>
                <a href={`tel:${tel}`} className="flex items-center gap-3 font-display text-2xl font-bold italic text-white hover:text-brand">
                  <Phone className="h-5 w-5 text-brand" aria-hidden /> {settings.phone}
                </a>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 break-all text-sm text-white/80 hover:text-brand">
                  <Mail className="h-4 w-4 shrink-0 text-brand" aria-hidden /> {settings.email}
                </a>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
