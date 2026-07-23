import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Hydraulische Nachweise - Behringer & Partner",
  path: "/hydraulische-nachweise",
  description: "Ingenieurbüro für hydraulische Nachweise in Mühldorf & Bayern. Wir bieten Kanalnetzberechnungen, Starkregensimulationen (2D) und Generalentwässerungspläne (GEP).",
});

export default function Page() {
  const html = loadFragment("leistungen/hydraulische-nachweise.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
