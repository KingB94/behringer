import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Baulanderschließung - Behringer & Partner",
  path: "/baulanderschliessung",
  description: "Baulanderschließung aus einer Hand: Von der Bauleitplanung bis zur Erschließung. Wir schaffen baureife Grundstücke für Wohn- & Gewerbegebiete in Bayern.",
});

export default function Page() {
  const html = loadFragment("leistungen/baulanderschliessung.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
