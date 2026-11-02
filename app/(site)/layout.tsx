import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";
import { getServices, getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/constants";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: settings.companyName,
    description:
      "Alberta-based hotshot trucking and transportation for construction materials, equipment and commercial freight.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/logo.svg`,
    telephone: settings.phone,
    email: settings.email,
    slogan: settings.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Edmonton",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    areaServed: [
      { "@type": "State", name: settings.primaryServiceArea },
      ...settings.serviceCommunities.map((c) => ({ "@type": "City", name: c })),
    ],
    knowsAbout: services.map((s) => s.title),
    sameAs: Object.values(settings.socials).filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Skip the intro screen for the rest of the session once it has played. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("vsh_preloader_seen"))document.documentElement.dataset.preloaderSeen="1"}catch(e){}`,
        }}
      />
      <Preloader />
      <Header logoUrl={settings.logoUrl} phone={settings.phone} email={settings.email} />
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <Footer settings={settings} services={services} />
    </>
  );
}
