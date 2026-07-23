import newsData from "@/data/news.json";

export type NewsPost = {
  title: string;
  date: string; // "DD.MM.YYYY"
  category: string;
  image: string;
  summary: string;
  content: string; // vertrautes Erste-Partei-HTML
};

const news = newsData as Record<string, NewsPost>;

/** Alle News in JSON-Reihenfolge (bereits nach Datum sortiert). */
export function getAllNews(): Array<[string, NewsPost]> {
  return Object.entries(news);
}

export function getNewsPost(slug: string): NewsPost | undefined {
  return news[slug];
}

export function getNewsSlugs(): string[] {
  return Object.keys(news);
}

export function getLatestNews(count: number): Array<[string, NewsPost]> {
  return getAllNews().slice(0, count);
}
