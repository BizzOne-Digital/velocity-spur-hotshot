import Link from "next/link";
import { AlertTriangle, ArrowRight, FileText, Images, Inbox, MessageSquare, Truck } from "lucide-react";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/data";
import StatusBadge from "@/components/admin/StatusBadge";
import QuoteRequest from "@/models/QuoteRequest";
import Inquiry from "@/models/Inquiry";
import Service from "@/models/Service";
import GalleryItem from "@/models/GalleryItem";
import PageContent from "@/models/PageContent";

export const metadata = { title: "Dashboard" };

type Recent = { _id: { toString(): string }; contactName: string; companyName?: string; freightType: string; status: string; createdAt: Date };

async function loadStats() {
  await connectDB();
  await ensureSeeded();
  const [quotes, newQuotes, inquiries, newInquiries, services, gallery, pages, recent] = await Promise.all([
    QuoteRequest.countDocuments(),
    QuoteRequest.countDocuments({ status: "New" }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "New" }),
    Service.countDocuments(),
    GalleryItem.countDocuments(),
    PageContent.countDocuments(),
    QuoteRequest.find().sort({ createdAt: -1 }).limit(5).lean<Recent[]>(),
  ]);
  return { quotes, newQuotes, inquiries, newInquiries, services, gallery, pages, recent };
}

export default async function DashboardPage() {
  if (!isDbConfigured()) {
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-200">
        <AlertTriangle className="mb-2 h-6 w-6" aria-hidden />
        MONGODB_URI is not configured. Add it to your environment variables to enable the admin portal.
      </div>
    );
  }

  let stats: Awaited<ReturnType<typeof loadStats>>;
  try {
    stats = await loadStats();
  } catch {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
        Could not connect to the database. Check the MongoDB Atlas connection string and network access settings.
      </div>
    );
  }

  const cards = [
    { href: "/admin/quotes", label: "Quote Requests", value: stats.quotes, badge: stats.newQuotes ? `${stats.newQuotes} new` : "", icon: Inbox },
    { href: "/admin/inquiries", label: "General Inquiries", value: stats.inquiries, badge: stats.newInquiries ? `${stats.newInquiries} new` : "", icon: MessageSquare },
    { href: "/admin/services", label: "Service Entries", value: stats.services, badge: "", icon: Truck },
    { href: "/admin/gallery", label: "Gallery Images", value: stats.gallery, badge: "", icon: Images },
    { href: "/admin/pages", label: "Page Content", value: `${stats.pages}/6`, badge: "customized", icon: FileText },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-sm text-white/55">Overview of submissions and website content.</p>

      {stats.newQuotes > 0 && (
        <Link href="/admin/quotes" className="mt-6 flex items-center gap-3 rounded-xl border border-brand/50 bg-brand/10 p-4 text-sm hover:bg-brand/15">
          <AlertTriangle className="h-5 w-5 text-brand" aria-hidden />
          <span>
            <strong>{stats.newQuotes}</strong> new quote {stats.newQuotes === 1 ? "request needs" : "requests need"} a response.
          </span>
          <ArrowRight className="ml-auto h-4 w-4" aria-hidden />
        </Link>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ href, label, value, badge, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="group block rounded-xl border border-white/10 bg-[#16181d] p-5 transition hover:border-brand/50">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-brand" aria-hidden />
                {badge && <span className="rounded-full bg-brand/15 px-2 py-0.5 text-xs font-semibold text-brand">{badge}</span>}
              </div>
              <p className="mt-4 text-3xl font-bold">{value}</p>
              <p className="text-sm text-white/55 group-hover:text-white">{label}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-xl border border-white/10 bg-[#16181d]">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="font-semibold">Latest Quote Requests</h2>
          <Link href="/admin/quotes" className="text-sm text-brand hover:underline">
            View all
          </Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="p-6 text-sm text-white/55">No quote requests yet. Submissions from the website will appear here.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {stats.recent.map((q) => (
              <li key={q._id.toString()} className="flex flex-wrap items-center gap-3 p-4 text-sm">
                <span className="font-medium">{q.contactName}</span>
                {q.companyName && <span className="text-white/50">· {q.companyName}</span>}
                <span className="text-white/50">· {q.freightType}</span>
                <span className="ml-auto flex items-center gap-3">
                  <StatusBadge status={q.status} />
                  <span className="text-xs text-white/40">
                    {new Date(q.createdAt).toLocaleDateString("en-CA", { timeZone: "America/Edmonton" })}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
