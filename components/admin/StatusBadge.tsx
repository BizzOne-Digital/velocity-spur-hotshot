const COLORS: Record<string, string> = {
  New: "bg-brand/15 text-brand ring-brand/40",
  Contacted: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  Reviewing: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  Quoted: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  Booked: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  Resolved: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  Closed: "bg-white/10 text-white/60 ring-white/20",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${COLORS[status] ?? COLORS.Closed}`}>
      {status}
    </span>
  );
}
