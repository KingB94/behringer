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
      // www -> nackte Domain (kanonisch: https://ib-behringer.de).
      // Host-Ausdruck mit ^…$ verankert, sonst träfe er auch sich selbst.
      // Zwei Regeln, weil "/:pfad*" bei der Startseite wörtlich im
      // Location-Kopf landen würde.
      {
        source: "/",
        has: [{ type: "host", value: "^www\\.ib-behringer\\.de$" }],
        destination: "https://ib-behringer.de/",
        statusCode: 301,
      },
      {
        source: "/:pfad+",
        has: [{ type: "host", value: "^www\\.ib-behringer\\.de$" }],
        destination: "https://ib-behringer.de/:pfad+",
        statusCode: 301,
      },
      ...leistungRedirects,
      // Fallback für tiefere /leistung/<slug>/... Pfade
      { source: "/leistung/:slug*", destination: "/", permanent: true },
      { source: "/leistungen", destination: "/", permanent: true },
      ...jobRedirects,
      { source: "/unternehmen", destination: "/firmengeschichte", permanent: true },
      { source: "/gesellschafter", destination: "/firmengeschichte", permanent: true },
      // Alte Kontaktseite -> Kontaktbereich der Startseite
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
