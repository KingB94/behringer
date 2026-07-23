import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Fernwärme - Behringer & Partner",
  path: "/fernwaerme",
  description: "Ingenieurbüro für Fernwärmeplanung in Bayern. Wir realisieren nachhaltige Wärmenetze, Quartierslösungen und Energiekonzepte für Kommunen & Versorger.",
});

export default function Page() {
  const html = loadFragment("leistungen/fernwaerme.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
