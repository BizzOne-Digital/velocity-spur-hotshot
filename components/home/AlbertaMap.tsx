"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
 * Stylised map of Alberta with neighbouring provinces. Coordinates are a
 * simple linear projection (49–60°N, 110–120°W → 220×420 units) offset by
 * (150, 20) so the provinces sit side by side. Not to survey scale.
 */
const AB = "M150 20 L370 20 L370 440 L282 440 L270 415 L262 392 L248 370 L238 350 L220 332 L206 312 L190 296 L176 282 L162 268 L150 256 Z";
const BC = "M30 20 L150 20 L150 256 L162 268 L176 282 L190 296 L206 312 L220 332 L238 350 L248 370 L262 392 L270 415 L282 440 L40 440 L22 380 L34 330 L10 270 L26 200 L8 130 Z";
const SK = "M370 20 L540 20 L540 440 L370 440 Z";

const px = (lng: number) => 150 + ((120 - Math.abs(lng)) / 10) * 220;
const py = (lat: number) => 20 + ((60 - lat) / 11) * 420;

type City = { name: string; lat: number; lng: number; major?: boolean; labelDx?: number; labelDy?: number; anchor?: "start" | "end" };

const CITIES: City[] = [
  { name: "Edmonton", lat: 53.55, lng: -113.49, major: true, labelDx: 14, labelDy: -10 },
  { name: "Red Deer", lat: 52.27, lng: -113.81, major: true, labelDx: 14, labelDy: 5 },
  { name: "Calgary", lat: 51.05, lng: -114.07, major: true, labelDx: -14, labelDy: 5, anchor: "end" },
  { name: "Spruce Grove", lat: 53.54, lng: -113.91 },
  { name: "Acheson", lat: 53.55, lng: -113.76 },
  { name: "Sherwood Park", lat: 53.52, lng: -113.32 },
  { name: "Leduc", lat: 53.27, lng: -113.55 },
  { name: "Nisku", lat: 53.33, lng: -113.53 },
];

export default function AlbertaMap({ planned }: { planned: string[] }) {
  const reduce = useReducedMotion();
  const pt = (c: City) => ({ x: px(c.lng), y: py(c.lat) });
  const edm = pt(CITIES[0]);
  const rd = pt(CITIES[1]);
  const cal = pt(CITIES[2]);
  const showBC = planned.some((p) => /british/i.test(p));
  const showSK = planned.some((p) => /saskat/i.test(p));

  return (
    <svg
      viewBox="0 0 560 460"
      className="h-auto w-full"
      role="img"
      aria-labelledby="map-title map-desc"
    >
      <title id="map-title">Velocity Spur Hotshot service area map</title>
      <desc id="map-desc">
        Primary service area is Alberta, including Edmonton, Acheson, Spruce Grove, Sherwood Park, Leduc, Nisku, Red Deer
        and Calgary. {planned.length ? `Planned future expansion: ${planned.join(" and ")}.` : ""}
      </desc>
      <defs>
        <linearGradient id="abFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1408" />
          <stop offset="1" stopColor="#140a05" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="560" height="460" fill="url(#grid)" />

      {/* Planned provinces */}
      <g>
        <path d={BC} fill="rgba(37,41,50,0.35)" stroke="#5b6069" strokeWidth="1.5" strokeDasharray="6 6" />
        <path d={SK} fill="rgba(37,41,50,0.35)" stroke="#5b6069" strokeWidth="1.5" strokeDasharray="6 6" />
        <text x="80" y="170" textAnchor="middle" className="fill-[#9ea2a8] font-display text-[15px] font-bold italic uppercase">
          British
        </text>
        <text x="80" y="188" textAnchor="middle" className="fill-[#9ea2a8] font-display text-[15px] font-bold italic uppercase">
          Columbia
        </text>
        {showBC && (
          <g>
            <rect x="38" y="198" width="84" height="20" rx="3" fill="rgba(255,121,0,0.12)" stroke="rgba(255,121,0,0.6)" />
            <text x="80" y="212" textAnchor="middle" className="fill-brand text-[10px] font-bold uppercase tracking-widest">
              Planned
            </text>
          </g>
        )}
        <text x="455" y="210" textAnchor="middle" className="fill-[#9ea2a8] font-display text-[15px] font-bold italic uppercase">
          Saskatchewan
        </text>
        {showSK && (
          <g>
            <rect x="413" y="220" width="84" height="20" rx="3" fill="rgba(255,121,0,0.12)" stroke="rgba(255,121,0,0.6)" />
            <text x="455" y="234" textAnchor="middle" className="fill-brand text-[10px] font-bold uppercase tracking-widest">
              Planned
            </text>
          </g>
        )}
      </g>

      {/* Alberta */}
      <path d={AB} fill="url(#abFill)" />
      <motion.path
        d={AB}
        fill="none"
        stroke="#FF7900"
        strokeWidth="2.5"
        filter="url(#glow)"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <text x="260" y="120" textAnchor="middle" className="fill-white font-display text-[34px] font-black italic uppercase tracking-wide">
        Alberta
      </text>
      <text x="260" y="140" textAnchor="middle" className="fill-brand text-[10px] font-bold uppercase tracking-[0.3em]">
        Primary Service Area
      </text>

      {/* QE2 corridor route */}
      <motion.path
        d={`M${edm.x} ${edm.y} L${rd.x} ${rd.y} L${cal.x} ${cal.y}`}
        fill="none"
        stroke="#FFB15C"
        strokeWidth="2"
        strokeDasharray="5 5"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 1.2 }}
      />

      {/* Communities */}
      {CITIES.map((c, i) => {
        const p = pt(c);
        return (
          <g key={c.name}>
            {c.major && (
              <circle cx={p.x} cy={p.y} r="6" fill="none" stroke="#FF7900" strokeWidth="2" className="origin-center animate-pulse-ring [transform-box:fill-box]" style={{ animationDelay: `${i * 0.4}s` }} />
            )}
            <circle cx={p.x} cy={p.y} r={c.major ? 5 : 2.6} fill={c.major ? "#FF7900" : "#FFD3A6"} filter={c.major ? "url(#glow)" : undefined} />
            {c.major && (
              <text
                x={p.x + (c.labelDx ?? 12)}
                y={p.y + (c.labelDy ?? 4)}
                textAnchor={c.anchor ?? "start"}
                className="fill-white font-display text-[16px] font-bold italic uppercase"
              >
                {c.name}
              </text>
            )}
          </g>
        );
      })}
      <text x={edm.x + 14} y={edm.y + 8} className="fill-[#c4c7cb] text-[9px] uppercase tracking-wider">
        + Region
      </text>
    </svg>
  );
}
