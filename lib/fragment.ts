import { readFileSync } from "fs";
import { join } from "path";

/**
 * Lädt ein statisches HTML-Content-Fragment (1:1 aus dem alten Jinja-Template
 * extrahiert). Wird zur Build-Zeit gelesen und statisch vorgerendert.
 */
export function loadFragment(relPath: string): string {
  return readFileSync(join(process.cwd(), "content", relPath), "utf8");
}
