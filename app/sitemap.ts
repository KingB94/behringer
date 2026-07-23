import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";
import { getNewsSlugs } from "@/lib/news";
import { SITE_URL } from "@/lib/meta";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: Array<[string, number, Freq]> = [
    // Hauptseiten
    ["/", 1.0, "weekly"],
    ["/neuigkeiten", 0.9, "weekly"],
    // Leistungen
    ["/siedlungswasserwirtschaft", 0.8, "monthly"],
    ["/strassenbau-brueckenbau", 0.8, "monthly"],
    ["/fernwaerme", 0.8, "monthly"],
    ["/hydraulische-nachweise", 0.8, "monthly"],
    ["/baulanderschliessung", 0.8, "monthly"],
    ["/kommunales-gis", 0.8, "monthly"],
    ["/sanierungen", 0.8, "monthly"],
    ["/wasserbau", 0.8, "monthly"],
    // Unternehmen
    ["/team", 0.7, "monthly"],
    ["/firmengeschichte", 0.7, "monthly"],
    ["/netzwerk", 0.7, "monthly"],
    ["/stellenangebote", 0.7, "monthly"],
    ["/standorte", 0.7, "monthly"],
    // Karriere
    ["/karriere/azubi-cad", 0.6, "monthly"],
    ["/karriere/bauzeichner", 0.6, "monthly"],
    ["/karriere/buerokraft", 0.6, "monthly"],
    ["/karriere/duales-studium-bauingenieurwesen", 0.6, "monthly"],
    ["/karriere/praktikant", 0.6, "monthly"],
    // Sonstige
    ["/impressum", 0.3, "yearly"],
  ];

  const entries: MetadataRoute.Sitemap = staticPages.map(
    ([path, priority, changeFrequency]) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })
  );

  // Projekte
  for (const p of PROJECTS) {
    entries.push({
      url: `${SITE_URL}/projekt/${p.bereich}/${p.slug}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  // News-Artikel
  for (const slug of getNewsSlugs()) {
    entries.push({
      url: `${SITE_URL}/neuigkeiten/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
