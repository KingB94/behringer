import type { NextConfig } from "next";

// 8 Leistungs-Redirects (alte WordPress-URLs /leistung/<slug> -> /<slug>)
const leistungRedirects = [
  "siedlungswasserwirtschaft",
  "strassenbau-brueckenbau",
  "fernwaerme",
  "hydraulische-nachweise",
  "baulanderschliessung",
  "kommunales-gis",
  "sanierungen",
  "wasserbau",
].map((slug) => ({
  source: `/leistung/${slug}`,
  destination: `/${slug}`,
  permanent: true,
}));

const jobRedirects = [
  ["buerokraft-m-w-d", "buerokraft"],
  ["bauzeichner-m-w-d", "bauzeichner"],
  ["azubi-cad", "azubi-cad"],
  ["duales-studium-bauingenieurwesen", "duales-studium-bauingenieurwesen"],
  ["praktikant", "praktikant"],
].map(([from, to]) => ({
  source: `/${from}`,
  destination: `/karriere/${to}`,
  permanent: true,
}));

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2678400, // 31 Tage
  },
  async redirects() {
    return [
      ...leistungRedirects,
      // Fallback für tiefere /leistung/<slug>/... Pfade
      { source: "/leistung/:slug*", destination: "/", permanent: true },
      { source: "/leistungen", destination: "/", permanent: true },
      ...jobRedirects,
      { source: "/unternehmen", destination: "/firmengeschichte", permanent: true },
      { source: "/gesellschafter", destination: "/firmengeschichte", permanent: true },
      // Kontakt (GET): das Formular postet auf /api/kontakt, daher unkritisch
      { source: "/kontakt", destination: "/#contact", permanent: true },
      {
        source: "/alle-beitraege-zur-maedchenschule-chato-tansania",
        destination: "/maedchenschule-chato",
        permanent: true,
      },
      { source: "/downloads", destination: "/", permanent: true },
      { source: "/downloads/:path*", destination: "/", permanent: true },
      { source: "/downloadkat", destination: "/", permanent: true },
      { source: "/downloadkat/:path*", destination: "/", permanent: true },
      { source: "/wp/:path*", destination: "/", permanent: true },
      { source: "/category/:path*", destination: "/neuigkeiten", permanent: true },
      // Alte Blog-Post-URLs /JAHR/... (2000–2030) -> /neuigkeiten
      {
        source: "/:year(20[0-2][0-9]|2030)/:path*",
        destination: "/neuigkeiten",
        permanent: true,
      },
      // Sicherheitsnetz: alte /static/images/... URLs
      { source: "/static/images/:path*", destination: "/images/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
