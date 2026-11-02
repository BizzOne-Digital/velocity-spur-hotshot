import Link from "next/link";
import { ChevronsRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 font-display font-bold italic uppercase tracking-wide clip-btn transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-[#ff8f2a] via-brand to-brand-deep text-white shadow-[0_0_0_1px_rgba(255,121,0,.6),0_8px_24px_rgba(217,59,11,.35)] hover:shadow-[0_0_0_1px_rgba(255,160,80,.9),0_0_28px_rgba(255,121,0,.55)] hover:brightness-110",
  outline:
    "bg-ink/40 text-white ring-1 ring-inset ring-steel/70 hover:ring-brand hover:text-brand hover:bg-ink/70 backdrop-blur-sm",
  ghost: "text-steel hover:text-brand",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-base",
  lg: "h-14 px-9 text-lg",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type LinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", size = "md", className = "", arrow = true, children, ...rest }: LinkProps) {
  return (
    <Link {...rest} className={buttonClass(variant, size, className)}>
      <span>{children}</span>
      {arrow && (
        <ChevronsRight aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Link>
  );
}
