import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { getIcon } from "@/lib/icons";
import type { ServiceItem } from "@/lib/types";

/** Angled service card with image header, icon badge and hover glow. */
export default function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = getIcon(service.icon);
  return (
    <Link
      href={`/services#${service.slug}`}
      className="card-glow clip-angle group flex h-full flex-col overflow-hidden focus-visible:outline-none"
    >
      <div className="relative h-40 sm:h-44">
        <div className="absolute inset-0 overflow-hidden">
          <SafeImage
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover opacity-70 transition duration-700 group-hover:scale-110 group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-[#111216]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/0 to-brand/0 transition duration-500 group-hover:from-brand/10" />
        </div>
        <span className="absolute bottom-0 left-5 grid h-14 w-14 z-10 translate-y-1/2 place-items-center rounded-lg border border-brand/60 bg-ink text-brand shadow-[0_0_20px_rgba(255,121,0,.35)] transition group-hover:bg-brand group-hover:text-ink">
          <Icon className="h-7 w-7" aria-hidden strokeWidth={1.8} />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-10">
        <h3 className="heading-display text-2xl leading-[0.95] text-white">{service.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">{service.shortDescription}</p>
        <span className="mt-5 inline-flex items-center gap-1 font-display text-sm font-bold italic uppercase tracking-wider text-brand">
          Explore Service
          <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
        </span>
      </div>
      <span aria-hidden className="absolute bottom-0 left-0 h-[3px] w-0 bg-brand shadow-[0_0_12px_rgba(255,121,0,.9)] transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
