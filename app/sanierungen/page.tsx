import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Sanierungen - Behringer & Partner",
  path: "/sanierungen",
  description: "Spezialisten für Kanalsanierung, Straßensanierung und Betonschutz in Mühldorf & Bayern. Wir entwickeln wirtschaftliche Sanierungskonzepte für langlebige Infrastruktur.",
});

export default function Page() {
  const html = loadFragment("leistungen/sanierungen.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
