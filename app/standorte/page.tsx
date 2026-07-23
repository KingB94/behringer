import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Standorte - Behringer & Partner",
  path: "/standorte",
  description: "Unsere Standorte in Mühldorf a. Inn, Simbach a. Inn und Roßbach. Hier finden Sie Adressen und Kontaktdaten.",
});

export default function Page() {
  const html = loadFragment("unternehmen/standorte.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
