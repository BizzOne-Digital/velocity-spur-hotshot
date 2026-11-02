import Link from "next/link";
import { Check, ChevronsRight } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { getIcon } from "@/lib/icons";
import type { PackageItem } from "@/lib/types";

type Props = { pkg: PackageItem; compact?: boolean; href?: string };

export default function PackageCard({ pkg, compact = false, href = "/contact#partnership" }: Props) {
  const Icon = getIcon(pkg.icon);
  return (
    <article id={pkg.slug} className="card-glow clip-angle group flex h-full scroll-mt-28 flex-col overflow-hidden">
      <div className={`relative overflow-hidden ${compact ? "h-36" : "h-48"}`}>
        <SafeImage
          src={pkg.image}
          alt={pkg.title}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111216] to-transparent" />
        <span className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-b from-brand to-brand-deep text-white shadow-[0_0_20px_rgba(255,121,0,.5)]">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="heading-display text-[1.7rem] leading-[0.95] text-white">{pkg.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/75">{pkg.description}</p>
        {!compact && pkg.features.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {pkg.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-6">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 font-display text-sm font-bold italic uppercase tracking-wider text-brand transition hover:text-white"
          >
            {pkg.ctaLabel || "Discuss Requirements"}
            <ChevronsRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
