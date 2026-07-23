import type { Metadata } from "next";
import ChatoSlideshow from "@/components/ChatoSlideshow";
import ChatoVideoLoader from "@/components/ChatoVideoLoader";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Mädchenschule Chato, Tansania - Behringer & Partner",
  path: "/maedchenschule-chato",
});

export default function Page() {
  const html = loadFragment("maedchenschule-chato.html");
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <ChatoSlideshow />
      <ChatoVideoLoader />
    </>
  );
}
