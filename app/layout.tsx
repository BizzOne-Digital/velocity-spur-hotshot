import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hotshot Trucking Edmonton & Alberta | Velocity Spur Hotshot Ltd.",
    template: "%s | Velocity Spur Hotshot Ltd.",
  },
  description:
    "Edmonton-based hotshot trucking for construction materials, heavy equipment and industrial freight throughout Alberta. Request a transportation quote.",
  applicationName: "Velocity Spur Hotshot Ltd.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Velocity Spur Hotshot Ltd.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${barlow.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          richColors
          toastOptions={{ style: { background: "#16181d", border: "1px solid rgba(255,121,0,.35)" } }}
        />
      </body>
    </html>
  );
}
