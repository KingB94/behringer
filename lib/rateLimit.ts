/**
 * In-Memory-Rate-Limit (Sliding Window), Parität zu Flask-Limiter.
 * Gilt pro Prozess/Instanz — bei Deploy/Neustart wird zurückgesetzt
 * (identisch zum bisherigen Verhalten mit storage_uri="memory://").
 */
const hits = new Map<string, number[]>();

export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  hits.set(key, timestamps);

  // Gelegentliches Aufräumen alter Einträge, damit die Map nicht wächst
  if (hits.size > 1000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return false;
}
