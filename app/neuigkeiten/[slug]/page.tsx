import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChatoDonationBox from "@/components/ChatoDonationBox";
import { getNewsPost, getNewsSlugs } from "@/lib/news";
import { pageMetadata } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: `${post.title} - Behringer & Partner`,
    path: `/neuigkeiten/${slug}`,
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsPost(slug);
  if (!post) notFound();

  return (
    <main>
      <section className="page-header-section">
        <div className="container">
          <h1 className="page-title" style={{ textAlign: "left" }}>
            {post.title}
          </h1>
          <div
            className="meta-info"
            style={{
              color: "#666",
              fontSize: "0.9rem",
              marginTop: "var(--space-xs)",
            }}
          >
            <i className="far fa-calendar-alt"></i> {post.date}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="entry-content">
            {post.image && (
              <div
                className="featured-image-wrapper"
                style={{ marginBottom: "var(--space-md)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: "100%",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                />
              </div>
            )}

            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.category === "chato" && <ChatoDonationBox />}
          </div>
        </div>
      </section>
    </main>
  );
}
