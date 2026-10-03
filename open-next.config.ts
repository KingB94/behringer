// ---------------------------------------------------------------
// Übersetzt den Next.js-Build in einen Cloudflare Worker.
//
// Die Website hat keine Seiten, die im Betrieb neu entstehen (kein ISR,
// kein revalidate). Ohne incrementalCache findet der Worker die
// vorgerenderten Seiten trotzdem nicht und versucht, sie bei jedem Aufruf
// neu zu bauen („fs.readFile is not implemented"). staticAssetsIncrementalCache
// legt sie zu den übrigen statischen Dateien — kein R2, kein KV nötig.
// ---------------------------------------------------------------
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
