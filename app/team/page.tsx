import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Unser Team - Behringer & Partner",
  path: "/team",
});

export default function Page() {
  const html = loadFragment("unternehmen/team.html");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
