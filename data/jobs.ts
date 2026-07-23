// Alle Karriere-Detailseiten. Inhaltlich zeigen aktuell alle denselben
// Praktikums-Text (1:1 aus dem Flask-Stand übernommen). Echte Stellentexte
// können hier später je Slug ergänzt werden.
export const JOB_SLUGS = [
  "bauzeichner",
  "buerokraft",
  "azubi-cad",
  "duales-studium-bauingenieurwesen",
  "praktikant",
] as const;

export type JobSlug = (typeof JOB_SLUGS)[number];

export function isJobSlug(slug: string): slug is JobSlug {
  return (JOB_SLUGS as readonly string[]).includes(slug);
}
