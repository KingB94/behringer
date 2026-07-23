import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Kommunales GIS - Behringer & Partner",
  path: "/kommunales-gis",
  description: "Ihr Partner für Kommunales GIS in Mühldorf & Bayern. Wir digitalisieren Ihre Infrastruktur: Leitungskataster, Kanal-TV-Daten und Baumkataster für effiziente Verwaltung.",
});

export default function Page() {
  const html = loadFragment("leistungen/kommunales-gis.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
