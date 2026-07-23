import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Stellenangebote - Behringer & Partner",
  path: "/stellenangebote",
});

export default function Page() {
  const html = loadFragment("unternehmen/stellenangebote.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
