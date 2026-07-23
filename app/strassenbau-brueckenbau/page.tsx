import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Straßenbau & Brückenbau - Behringer & Partner",
  path: "/strassenbau-brueckenbau",
  description: "Planung von Straßen- & Brückenbau in Bayern. Wir realisieren Verkehrsanlagen, Kreisverkehre und Brückensanierungen für eine sichere Infrastruktur.",
});

export default function Page() {
  const html = loadFragment("leistungen/strassenbau-brueckenbau.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
