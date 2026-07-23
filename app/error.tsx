"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main>
      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h1>Es ist ein Fehler aufgetreten</h1>
          <p style={{ margin: "var(--space-md) 0" }}>
            Bitte versuchen Sie es später erneut.
          </p>
          <button className="btn btn-primary" onClick={() => reset()}>
            Erneut versuchen
          </button>
        </div>
      </section>
    </main>
  );
}
