import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Accent, { plain } from "./Accent";
import SafeImage from "./SafeImage";
import { GlowRule, Reveal } from "./Reveal";
import type { ReactNode } from "react";

type Props = {
  heading: string;
  subheading?: string;
  image?: string;
  crumb: string;
  children?: ReactNode;
};

/** Cinematic header used on every inner page. */
export default function PageHero({ heading, subheading, image, crumb, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="absolute inset-0 -z-10">
        <SafeImage src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        <div className="absolute inset-0 speed-lines opacity-60" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-[60%] rounded-full bg-brand/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-steel">
            <li>
              <Link href="/" className="hover:text-brand">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 text-brand" />
            </li>
            <li aria-current="page" className="text-brand">
              {crumb}
            </li>
          </ol>
        </nav>
        <Reveal>
          <h1 className="heading-display max-w-4xl text-5xl sm:text-6xl lg:text-7xl" aria-label={plain(heading)}>
            <Accent text={heading} />
          </h1>
        </Reveal>
        {subheading && (
          <Reveal delay={0.1}>
            <p className="mt-6 flex max-w-2xl gap-3 text-base text-white/85 sm:text-lg">
              <span aria-hidden className="mt-1 font-display text-2xl font-black italic leading-none text-brand">
                //
              </span>
              <span>{subheading}</span>
            </p>
          </Reveal>
        )}
        {children && <Reveal delay={0.2}>{children}</Reveal>}
      </div>
      <GlowRule className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}
