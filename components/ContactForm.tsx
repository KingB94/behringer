"use client";

import { useState } from "react";

const EMPFAENGER = "info@ib-behringer.de";

/**
 * Kontaktformular ohne Server: Die Eingaben werden beim Absenden zu einem
 * mailto:-Link zusammengesetzt, der das E-Mail-Programm des Besuchers mit
 * fertigem Betreff und Text öffnet. Die Website selbst überträgt und
 * speichert nichts — verschickt wird erst im Mail-Programm.
 */
export default function ContactForm() {
  const [geoeffnet, setGeoeffnet] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const daten = new FormData(event.currentTarget);
    const feld = (name: string) => String(daten.get(name) ?? "").trim();

    const telefon = feld("telefon");
    // Zeilenumbrüche im mailto:-Link als CRLF (RFC 6068), sonst setzen
    // manche Mail-Programme den Text in eine Zeile.
    const text = [
      feld("message").replace(/\r?\n/g, "\r\n"),
      "",
      "--",
      feld("name"),
      ...(telefon ? [`Telefon: ${telefon}`] : []),
    ].join("\r\n");

    window.location.href =
      `mailto:${EMPFAENGER}` +
      `?subject=${encodeURIComponent(feld("betreff"))}` +
      `&body=${encodeURIComponent(text)}`;
    setGeoeffnet(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label htmlFor="name-input" className="visually-hidden">
        Ihr Name
      </label>
      <input
        type="text"
        id="name-input"
        name="name"
        placeholder="Ihr Name"
        autoComplete="name"
        required
      />

      <label htmlFor="telefon-input" className="visually-hidden">
        Ihre Telefonnummer (optional)
      </label>
      <input
        type="tel"
        id="telefon-input"
        name="telefon"
        placeholder="Ihre Telefonnummer (optional)"
        autoComplete="tel"
      />

      <label htmlFor="betreff-input" className="visually-hidden">
        Betreff
      </label>
      <input
        type="text"
        id="betreff-input"
        name="betreff"
        placeholder="Betreff"
        required
      />

      <label htmlFor="message-input" className="visually-hidden">
        Ihre Nachricht
      </label>
      <textarea
        id="message-input"
        name="message"
        placeholder="Ihre Nachricht"
        rows={6}
        minLength={10}
        required
      />

      <p className="contact-form-hint">
        Beim Senden öffnet sich Ihr E-Mail-Programm mit der fertigen Nachricht.
        Dort nur noch auf „Senden“ klicken.
      </p>

      <button type="submit" className="btn btn-primary">
        Nachricht senden
      </button>

      {geoeffnet && (
        <p className="contact-form-hint" role="status">
          Ihr E-Mail-Programm hat sich nicht geöffnet? Schreiben Sie uns direkt
          an <a href={`mailto:${EMPFAENGER}`}>{EMPFAENGER}</a> oder rufen Sie
          uns an.
        </p>
      )}
    </form>
  );
}
