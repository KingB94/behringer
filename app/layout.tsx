import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamPhotoLightbox from "@/components/TeamPhotoLightbox";
import {
  SITE_URL,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  OG_TITLE,
  OG_DESCRIPTION,
} from "@/lib/meta";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  verification: { google: "lsrXcCf4D4gC_XeKVALIo-HOD6uQJqhGiiR-sKdMsL8" },
  icons: {
    shortcut: "/favicon/favicon.ico",
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: ["/images/layout/logo.png"],
    type: "website",
  },
  other: { "msapplication-TileColor": "#da532c" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        <Header />
        {children}
        <Footer />
        <TeamPhotoLightbox />
      </body>
    </html>
  );
}
