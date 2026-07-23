import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Netzwerk - Behringer & Partner",
  path: "/netzwerk",
});

export default function Page() {
  const html = loadFragment("unternehmen/netzwerk.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
