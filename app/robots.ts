import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/meta";

export const dynamic = "force-static";

// KI-Crawler (Training / Scraping): bringen keine Besucher, ziehen aber die
// komplette Bildergalerie. Google-Extended und Applebot-Extended betreffen
// NUR das KI-Training, nicht die normale Google- bzw. Apple-Suche — das
// Ranking bleibt davon unberührt.
const KI_CRAWLER = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "meta-externalagent",
  "FacebookBot",
  "Amazonbot",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "YouBot",
];

// SEO-Analysedienste: crawlen sehr gründlich, liefern uns selbst aber
// keinen Mehrwert.
const SEO_CRAWLER = [
  "AhrefsBot",
  "SemrushBot",
  "DataForSeoBot",
  "MJ12bot",
  "DotBot",
  "BLEXBot",
  "PetalBot",
  "SeekportBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Suchmaschinen sind ausdrücklich willkommen.
      { userAgent: "*", allow: "/" },
      { userAgent: [...KI_CRAWLER, ...SEO_CRAWLER], disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
