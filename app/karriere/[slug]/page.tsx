import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JobDateCode from "@/components/JobDateCode";
import { JOB_SLUGS, isJobSlug } from "@/data/jobs";
import { pageMetadata } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return JOB_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({
    title: "Praktikum für Studenten (m/w/d) - Behringer & Partner",
    path: `/karriere/${slug}`,
  });
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isJobSlug(slug)) notFound();

  return (
    <main>
      <section className="page-header-section">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/stellenangebote">Stellenangebote</Link>{" "}
            <span className="arrow">&gt;</span>
            <span>Praktikum</span>
          </div>
          <h1 className="page-title" style={{ textAlign: "left" }}>
            Praktikum für Studenten (m/w/d)
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="entry-content article-body">
            <p className="intro-text">
              In unserem Hauptsitz Mühldorf freuen wir uns auf Studenten (m/w/d)
              aus dem Fachbereich <strong>Bauingenieurwesen</strong>, die im
              Rahmen ihres Praktikumssemesters erste praktische Erfahrungen bei
              uns sammeln wollen.
            </p>

            <h3>Aufgabenbereich</h3>
            <p>
              Mitwirkung bei der Abwicklung von Projekten im Rahmen unseres
              Leistungsspektrums (Leistungsphasen 1 bis 9 nach HOAI).
            </p>

            <h3>Wir bieten Ihnen</h3>
            <ul>
              <li>Ein kollegiales Team</li>
              <li>Eine moderne Bürostruktur</li>
              <li>Interessante Projekte</li>
              <li>Selbständiges Arbeiten</li>
              <li>Faire Vergütung</li>
            </ul>

            <h3>Von Ihnen erwarten wir</h3>
            <ul>
              <li>Engagement und Flexibilität</li>
              <li>
                Laufendes Studium im Bereich Bauingenieurwesen oder
                vergleichbaren Studiengängen
              </li>
            </ul>

            <hr className="wp-block-separator" style={{ margin: "3rem 0" }} />

            <div
              className="job-application-info"
              style={{
                backgroundColor: "var(--clr-bg-alt)",
                padding: "2rem",
                borderRadius: "var(--radius-md)",
                borderLeft: "5px solid var(--clr-primary)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Jetzt bewerben</h3>
              <p>
                Senden Sie Ihre aussagekräftige Bewerbung bitte per E-Mail an:
                <br />
                <a
                  href="mailto:reindl@ib-behringer.de"
                  style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                >
                  reindl@ib-behringer.de
                </a>
              </p>

              <p style={{ fontSize: "0.9rem" }}>
                Aus Sicherheitsgründen bitten wir Sie, im Betreff Folgendes
                anzugeben:
                <br />
                <JobDateCode />
                <br />
                <em>
                  (Mails, die diesen Betreff nicht enthalten, werden vom
                  Spam-Filter u.U. aussortiert.)
                </em>
              </p>
            </div>

            <p style={{ color: "#999", fontSize: "0.8rem", marginTop: "2rem" }}>
              aktualisiert am 11.01.2024
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
