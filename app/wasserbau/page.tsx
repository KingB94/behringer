import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Wasserbau - Behringer & Partner",
  path: "/wasserbau",
  description: "Naturnaher Wasserbau & Hochwasserschutz in Bayern. Wir planen Hochwasserschutzmaßnahmen, 2D-Simulationen, Fischaufstiegsanlagen und integrale Gewässerkonzepte – ökologisch und sicher.",
});

export default function Page() {
  const html = loadFragment("leistungen/wasserbau.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
