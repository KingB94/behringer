import type { Metadata } from "next";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";
import TimelineObserver from "@/components/TimelineObserver";

export const metadata: Metadata = pageMetadata({
  title: "Firmengeschichte - Behringer & Partner",
  path: "/firmengeschichte",
});

export default function Page() {
  const html = loadFragment("unternehmen/firmengeschichte.html");
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <TimelineObserver />
    </>
  );
}
