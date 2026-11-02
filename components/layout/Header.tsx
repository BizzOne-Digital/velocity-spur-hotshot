"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Menu, Phone, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/Button";
import Logo from "./Logo";

type Props = { logoUrl?: string; phone: string; email: string };

export default function Header({ logoUrl, phone, email }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and allow Escape to close the mobile menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const tel = phone.replace(/[^\d+]/g, "");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-brand/40 bg-ink/90 shadow-[0_6px_30px_rgba(0,0,0,0.6)] backdrop-blur-md"
          : "border-b border-white/5 bg-gradient-to-b from-ink/90 to-ink/20 backdrop-blur-[2px]"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo
          src={logoUrl}
          priority
          className={`w-auto transition-all duration-300 ${scrolled ? "h-14 py-1" : "h-16 py-1.5 sm:h-20"}`}
        />

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`relative block px-3 py-2 font-display text-[15px] font-bold italic uppercase tracking-wide transition-colors ${
                    isActive(l.href) ? "text-white" : "text-white/75 hover:text-brand"
                  }`}
                >
                  {l.label}
                  {isActive(l.href) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-3 -bottom-0.5 h-[3px] bg-brand shadow-[0_0_10px_rgba(255,121,0,.9)]"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink href="/request-quote" size="sm" className="hidden sm:inline-flex">
            Get a Quote
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-md border border-brand/50 text-white transition hover:bg-brand/10 xl:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[60] xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="bg-industrial absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-brand/50 shadow-[-10px_0_40px_rgba(255,121,0,0.15)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <Logo src={logoUrl} className="h-16 w-auto" onClick={() => setOpen(false)} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-md border border-white/15 text-white hover:border-brand hover:text-brand"
                  aria-label="Close menu"
                  autoFocus
                >
                  <X className="h-6 w-6" aria-hidden />
                </button>
              </div>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
                <ul className="space-y-1">
                  {NAV_LINKS.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i + 0.1 }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive(l.href) ? "page" : undefined}
                        className={`flex items-center justify-between border-l-[3px] px-4 py-3.5 font-display text-2xl font-bold italic uppercase tracking-wide transition ${
                          isActive(l.href)
                            ? "border-brand bg-brand/10 text-white"
                            : "border-transparent text-white/80 hover:border-brand/50 hover:text-brand"
                        }`}
                      >
                        {l.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="space-y-4 border-t border-white/10 px-5 py-6">
                <ButtonLink href="/request-quote" className="w-full" onClick={() => setOpen(false)}>
                  Request a Quote
                </ButtonLink>
                <a href={`tel:${tel}`} className="flex items-center gap-3 text-white/85 hover:text-brand">
                  <Phone className="h-5 w-5 text-brand" aria-hidden /> {phone}
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-3 break-all text-white/85 hover:text-brand">
                  <Mail className="h-5 w-5 shrink-0 text-brand" aria-hidden /> {email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
