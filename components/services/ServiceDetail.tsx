import { AlertTriangle, Check } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getIcon } from "@/lib/icons";
import type { ServiceItem } from "@/lib/types";

/** Full-width alternating service block used on /services. */
export default function ServiceDetail({ service, index }: { service: ServiceItem; index: number }) {
  const Icon = getIcon(service.icon);
  const flip = index % 2 === 1;

  return (
    <article id={service.slug} aria-labelledby={`${service.slug}-title`} className="scroll-mt-28">
      <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-14 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <Reveal className="relative">
          <div
            className="relative aspect-[16/11] overflow-hidden border border-brand/40 shadow-[0_0_40px_rgba(255,121,0,.15)]"
            style={{
              clipPath: flip
                ? "polygon(0 0, 92% 0, 100% 10%, 100% 100%, 8% 100%, 0 90%)"
                : "polygon(8% 0, 100% 0, 100% 90%, 92% 100%, 0 100%, 0 10%)",
            }}
          >
            <SafeImage src={service.image} alt={service.title} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/70 via-transparent to-brand/10" />
          </div>
          <span
            aria-hidden
            className="absolute -bottom-6 font-display text-[7rem] font-black italic leading-none text-white/[0.06] sm:text-[9rem] lg:-bottom-10"
            style={{ [flip ? "left" : "right"]: "1rem" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <span className="inline-grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-b from-brand to-brand-deep text-white shadow-[0_0_24px_rgba(255,121,0,.45)]">
            <Icon className="h-7 w-7" aria-hidden />
          </span>
          <h2 id={`${service.slug}-title`} className="heading-display mt-5 text-4xl text-metal sm:text-5xl">
            {service.title}
          </h2>
          <p className="mt-5 text-white/80">{service.description}</p>

          {service.features.length > 0 && (
            <>
              <h3 className="mt-7 font-display text-lg font-bold italic uppercase tracking-wide text-brand">Capabilities</h3>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}

          {service.disclaimer && (
            <p className="mt-6 flex items-start gap-2.5 rounded-md border border-brand/30 bg-brand/5 p-3 text-xs leading-relaxed text-white/70">
              <AlertTriangle className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              {service.disclaimer}
            </p>
          )}

          <div className="mt-8">
            <ButtonLink href={`/request-quote?service=${encodeURIComponent(service.slug)}`}>Request a Quote</ButtonLink>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
