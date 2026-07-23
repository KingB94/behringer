import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden - Behringer & Partner",
};

export default function NotFound() {
  return (
    <main>
      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h1>Seite nicht gefunden</h1>
          <p style={{ margin: "var(--space-md) 0" }}>
            Die angeforderte Seite existiert nicht oder wurde verschoben.
          </p>
          <Link href="/" className="btn btn-primary">
            Zur Startseite
          </Link>
        </div>
      </section>
    </main>
  );
}
