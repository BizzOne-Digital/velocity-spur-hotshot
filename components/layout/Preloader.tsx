"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Truck } from "lucide-react";

const SEEN_KEY = "vsh_preloader_seen";
const MIN_MS = 1600;
const MAX_MS = 3500;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Branded intro screen shown once per browser session. It stays for at least
 * MIN_MS so the animation can play, and never longer than MAX_MS.
 * The inline script in the site layout hides it instantly on repeat visits.
 */
export default function Preloader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (document.documentElement.dataset.preloaderSeen) {
      setVisible(false);
      return;
    }
    const start = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      window.setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
      }, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const cap = window.setTimeout(finish, MAX_MS);
    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = visible ? "hidden" : "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading Velocity Spur Hotshot"
          className="preloader fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-ink"
          exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
          initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          transition={{ duration: 0.7, ease }}
        >
          <div aria-hidden className="absolute inset-0 speed-lines opacity-60" />
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl" />

          <div className="relative flex w-[min(22rem,80vw)] flex-col items-center">
            <motion.img
              src="/images/logo.webp?v=2"
              alt=""
              width={640}
              height={475}
              className="h-28 w-auto drop-shadow-[0_0_24px_rgba(255,121,0,0.45)] sm:h-32"
              initial={reduce ? false : { opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            />

            {/* Road with a truck driving across */}
            <div className="relative mt-10 h-10 w-full">
              <div className="absolute inset-x-0 bottom-1 h-[3px] bg-white/10" />
              <motion.div
                className="absolute bottom-1 left-0 h-[3px] bg-gradient-to-r from-brand-deep via-brand to-[#ffb15c] shadow-[0_0_14px_rgba(255,121,0,0.9)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: MIN_MS / 1000, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-2 -translate-x-1/2"
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: MIN_MS / 1000, ease: "easeInOut" }}
              >
                <motion.span
                  className="block"
                  animate={reduce ? undefined : { y: [0, -2, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  <Truck className="h-7 w-7 text-brand drop-shadow-[0_0_8px_rgba(255,121,0,0.9)]" aria-hidden />
                </motion.span>
              </motion.div>
            </div>

            <motion.p
              className="mt-5 font-display text-sm font-bold italic uppercase tracking-[0.35em] text-steel"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              Loading
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
