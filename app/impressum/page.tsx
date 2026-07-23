import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Impressum & Datenschutz - Behringer & Partner",
  path: "/impressum",
});

export default function Page() {
  const html = loadFragment("impressum.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
