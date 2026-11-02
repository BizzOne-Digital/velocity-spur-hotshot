import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: [string, number][] = [
    ["/", 1],
    ["/services", 0.9],
    ["/request-quote", 0.9],
    ["/packages", 0.8],
    ["/about", 0.7],
    ["/contact", 0.7],
  ];
  return routes.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
