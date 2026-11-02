"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Boxes, Construction, Factory, Forklift } from "lucide-react";
import Accent, { plain } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import SafeImage from "@/components/ui/SafeImage";

type Props = {
  heading: string;
  subheading: string;
  description: string;
  image: string;
  backgroundImage: string;
  ctaLabel: string;
  ctaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  indicators: string[];
  companyName: string;
};

const INDICATOR_ICONS = [Construction, Forklift, Factory, Boxes];
const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero(p: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const truckY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "8%"]);
  const lines = p.heading.split("\n");

  return (
    <section ref={ref} className="relative isolate overflow-hidden pt-24 sm:pt-28">
      {/* Mountain / sunset backdrop */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20">
        <SafeImage src={p.backgroundImage} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3a1405]/40 via-[#1a0b05]/50 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 speed-lines opacity-70" />
      <div aria-hidden className="absolute -left-40 top-1/3 -z-10 h-96 w-96 rounded-full bg-brand/15 blur-3xl" />
      <div aria-hidden className="absolute bottom-10 right-0 -z-10 h-80 w-[50%] rounded-full bg-brand-deep/25 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-8 lg:pb-24">
        {/* Copy */}
        <div className="relative z-10 min-w-0 lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-5 inline-flex items-center gap-3 border-l-[3px] border-brand bg-brand/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-brand"
          >
            {p.companyName}
          </motion.p>

          <h1 className="heading-display break-words text-[2.6rem] leading-[0.9] sm:text-6xl lg:text-[4.1rem] xl:text-[4.8rem]" aria-label={plain(p.heading)}>
            {lines.map((line, i) => (
              <motion.span
                key={i}
                className="block"
                initial={reduce ? false : { opacity: 0, y: 40, skewX: -6 }}
                animate={{ opacity: 1, y: 0, skewX: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease }}
              >
                <Accent text={line} />
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
          >
            <p className="mt-7 flex max-w-xl gap-3 text-base leading-relaxed text-white/85 sm:text-lg">
              <span aria-hidden className="font-display text-3xl font-black italic leading-none text-brand">
                //
              </span>
              <span>{p.description}</span>
            </p>
            <p className="mt-4 pl-9 font-display text-lg font-bold italic uppercase tracking-wide text-steel">
              {p.subheading}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href={p.ctaUrl} size="lg">
                {p.ctaLabel}
              </ButtonLink>
              <ButtonLink href={p.secondaryCtaUrl} size="lg" variant="outline">
                {p.secondaryCtaLabel}
              </ButtonLink>
            </div>
          </motion.div>
        </div>

        {/* Truck visual */}
        <motion.div
          style={{ y: truckY }}
          initial={reduce ? false : { opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.25, ease }}
          className="relative lg:col-span-5"
        >
          <div className="relative aspect-[4/3] w-full lg:aspect-[4/5] xl:aspect-square">
            <div
              className="absolute inset-0 overflow-hidden border border-brand/50 shadow-[0_0_40px_rgba(255,121,0,0.25)]"
              style={{ clipPath: "polygon(10% 0, 100% 0, 100% 88%, 90% 100%, 0 100%, 0 12%)" }}
            >
              <SafeImage
                src={p.image}
                alt="Commercial truck hauling freight on an Alberta mountain highway"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-[45%_center] saturate-[0.8] contrast-[1.1]"
              />
              <div className="absolute inset-0 bg-[#ff7900]/25 mix-blend-soft-light" />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink/75 via-[#3a1405]/20 to-brand/25" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
              {/* moving light streak */}
              <div aria-hidden className="absolute bottom-[18%] left-0 h-[2px] w-1/3 animate-speed bg-gradient-to-r from-transparent via-brand to-transparent" />
            </div>
            {/* angled frame accents */}
            <span aria-hidden className="absolute -left-3 top-6 h-24 w-[3px] bg-brand shadow-[0_0_12px_rgba(255,121,0,.9)]" />
            <span aria-hidden className="absolute -bottom-3 right-10 h-[3px] w-40 bg-brand shadow-[0_0_12px_rgba(255,121,0,.9)]" />
          </div>
        </motion.div>
      </div>

      {/* Industry indicators */}
      <div className="relative border-y border-brand/30 bg-ink/80 backdrop-blur">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {p.indicators.slice(0, 4).map((label, i) => {
            const Icon = INDICATOR_ICONS[i % INDICATOR_ICONS.length];
            return (
              <motion.li
                key={label}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                className={`flex items-center justify-center gap-3 py-4 font-display text-sm font-bold italic uppercase tracking-[0.15em] text-white sm:text-base ${
                  i % 2 === 0 ? "border-r border-white/10" : "md:border-r md:border-white/10"
                } ${i === 3 ? "md:border-r-0" : ""} ${i < 2 ? "border-b border-white/10 md:border-b-0" : ""}`}
              >
                <Icon className="h-5 w-5 text-brand" aria-hidden />
                {label}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
