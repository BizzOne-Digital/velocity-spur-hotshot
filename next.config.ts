import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // /api/uploads/** images render with `unoptimized` (see lib/imageFallback.ts).
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/logo.svg", search: "" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
