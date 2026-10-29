import type { Metadata } from "next";

export const SITE_URL = "https://ib-behringer.de";

export const DEFAULT_TITLE =
  "Ingenieurbüro Behringer & Partner – kommunaler Tiefbau in Mühldorf a. Inn";
export const DEFAULT_DESCRIPTION =
  
  "Ingenieurbüro für kommunalen Tiefbau aus Mühldorf a. Inn. Planung, Ausschreibung und Bauüberwachung für Kommunen, öffentliche und private Auftraggeber in Ober- und Niederbayern und der Oberpfalz.";

export const OG_TITLE = "Behringer & Partner mbB";
export const OG_DESCRIPTION =
  "Ingenieurbüro für kommunalen Tiefbau und Infrastruktur, seit 1968.";

/**
 * Repliziert das Meta-Verhalten von base.html: canonical + og:url zeigen auf
 * den jeweiligen Pfad, og:title/og:description sind seitenweit konstant.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description?: string;
  path: string;
}): Metadata {
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph: {
      title: OG_TITLE,
      description: OG_DESCRIPTION,
      url: path,
      type: "website",
      images: ["/images/layout/logo.png"],
    },
  };
}
