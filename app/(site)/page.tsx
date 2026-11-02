import Hero from "@/components/home/Hero";
import ServicesOverview from "@/components/home/ServicesOverview";
import WhyChoose from "@/components/home/WhyChoose";
import Industries from "@/components/home/Industries";
import ServiceArea from "@/components/home/ServiceArea";
import PackagesPreview from "@/components/home/PackagesPreview";
import Partnership from "@/components/home/Partnership";
import CtaBand from "@/components/ui/CtaBand";
import { dataList, dataString, getPackages, getPageContent, getServices, getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Hotshot Trucking Edmonton & Alberta | Construction & Equipment Transportation",
  description:
    "Velocity Spur Hotshot Ltd. provides reliable, time-sensitive hotshot trucking for construction materials, heavy equipment and industrial freight in Edmonton and throughout Alberta.",
  path: "/",
  image: IMG.homeHeroTruck,
});

export default async function HomePage() {
  const [c, services, packages, settings] = await Promise.all([
    getPageContent("home"),
    getServices(),
    getPackages(),
    getSettings(),
  ]);

  const hero = c.hero;
  return (
    <>
      <Hero
        heading={hero.heading}
        subheading={hero.subheading}
        description={hero.description}
        image={hero.image}
        backgroundImage={dataString(hero, "backgroundImage", IMG.homeHeroBackground)}
        ctaLabel={hero.ctaLabel}
        ctaUrl={hero.ctaUrl}
        secondaryCtaLabel={dataString(hero, "secondaryCtaLabel", "Explore Services")}
        secondaryCtaUrl={dataString(hero, "secondaryCtaUrl", "/services")}
        indicators={dataList<string>(hero, "indicators")}
        companyName={settings.companyName}
      />
      <ServicesOverview section={c.services} services={services} />
      <WhyChoose section={c.why} items={dataList(c.why, "items")} />
      <Industries section={c.industries} items={dataList(c.industries, "items")} />
      <ServiceArea section={c.serviceArea} settings={settings} />
      <PackagesPreview section={c.packages} packages={packages} />
      <Partnership section={c.partnership} points={dataList<string>(c.partnership, "points")} />
      <CtaBand
        heading={c.quoteCta.heading}
        description={c.quoteCta.description}
        image={c.quoteCta.image}
        ctaLabel={c.quoteCta.ctaLabel}
        ctaUrl={c.quoteCta.ctaUrl}
        phone={settings.phone}
      />
    </>
  );
}
