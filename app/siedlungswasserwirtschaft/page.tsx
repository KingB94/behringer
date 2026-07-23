import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Siedlungswasserwirtschaft - Behringer & Partner",
  path: "/siedlungswasserwirtschaft",
  description: "Experten für Wasser & Abwasser in Mühldorf. Wir planen Trinkwassernetze, Kläranlagen und Kanalsanierungen – wirtschaftlich, nachhaltig & zukunftssicher.",
});

export default function Page() {
  const html = loadFragment("leistungen/siedlungswasserwirtschaft.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
