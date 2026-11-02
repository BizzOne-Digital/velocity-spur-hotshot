import { Phone } from "lucide-react";
import Accent from "./Accent";
import { ButtonLink } from "./Button";
import SafeImage from "./SafeImage";
import { GlowRule, Reveal } from "./Reveal";

type Props = {
  heading: string;
  description?: string;
  image?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  phone?: string;
};

/** Full-width closing call to action used at the bottom of pages. */
export default function CtaBand({ heading, description, image, ctaLabel, ctaUrl, phone }: Props) {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28">
      <GlowRule className="absolute top-0 left-0 right-0" />
      <div className="absolute inset-0 -z-10">
        <SafeImage src={image} alt="" fill sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/70" />
        <div className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand/25 blur-3xl" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="heading-display text-5xl sm:text-6xl lg:text-7xl">
            <Accent text={heading} />
          </h2>
          {description && <p className="mt-5 text-lg text-white/80">{description}</p>}
        </Reveal>
        <Reveal delay={0.15} className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:flex-col">
          {ctaLabel && ctaUrl && (
            <ButtonLink href={ctaUrl} size="lg">
              {ctaLabel}
            </ButtonLink>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center justify-center gap-3 font-display text-2xl font-bold italic tracking-wide text-white transition hover:text-brand"
            >
              <Phone className="h-6 w-6 text-brand" aria-hidden />
              {phone}
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
