import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/meta";

export const dynamic = "force-static";

// KI-Suchen (ChatGPT, Perplexity, Claude, Gemini, Copilot) sind ausdrücklich
// erlaubt: Sie dürfen nur zitieren, was sie lesen können. Gilt auch für die
// Trainings-Crawler (GPTBot, ClaudeBot, Google-Extended …), damit die Modelle
// das Büro langfristig „kennen“. Bandbreite ist auf Cloudflare kein Thema.
//
// Gesperrt bleiben reine Scraper ohne Such- oder Assistenzfunktion.
const SCRAPER = ["Bytespider", "Diffbot", "ImagesiftBot", "Omgilibot"];

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
      // Suchmaschinen und KI-Suchen sind ausdrücklich willkommen.
      { userAgent: "*", allow: "/" },
      { userAgent: [...SCRAPER, ...SEO_CRAWLER], disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
