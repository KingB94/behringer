import type { Metadata } from "next";
import Link from "next/link";
import { getAllNews } from "@/lib/news";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Neuigkeiten - Behringer & Partner",
  path: "/neuigkeiten",
});

export default function NewsPage() {
  const news = getAllNews();

  return (
    <main>
      <section className="page-header-section">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Startseite</Link>
            <span className="arrow">&gt;</span>
            <span>Neuigkeiten</span>
          </div>
          <h1 className="page-title">Aktuelle Neuigkeiten</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="news-grid">
            {news.map(([slug, item]) => (
              <div className="news-card" key={slug}>
                {item.image && (
                  <Link href={`/neuigkeiten/${slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </Link>
                )}
                <div className="news-card-content">
                  <small className="news-date">{item.date}</small>
                  <h3>
                    <Link href={`/neuigkeiten/${slug}`}>{item.title}</Link>
                  </h3>
                  <p>{item.summary}</p>
                  <Link
                    href={`/neuigkeiten/${slug}`}
                    className="btn btn-primary btn-sm"
                  >
                    Mehr lesen
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
