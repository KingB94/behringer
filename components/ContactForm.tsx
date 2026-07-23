"use client";

import Link from "next/link";
import { useState } from "react";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "success"; message: string }
  | { state: "error"; messages: string[] };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus({ state: "sending" });

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          privacy_consent: formData.get("privacy_consent") === "on",
          fax: formData.get("fax"),
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        form.reset();
        setStatus({
          state: "success",
          message: "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.",
        });
      } else if (res.status === 429) {
        setStatus({
          state: "error",
          messages: [
            "Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.",
          ],
        });
      } else {
        setStatus({
          state: "error",
          messages: data?.errors?.length
            ? data.errors
            : ["Fehler beim Senden. Bitte versuchen Sie es später."],
        });
      }
    } catch {
      setStatus({
        state: "error",
        messages: ["Fehler beim Senden. Bitte versuchen Sie es später."],
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {status.state === "success" && (
        <div className="alert alert-success">{status.message}</div>
      )}
      {status.state === "error" &&
        status.messages.map((message) => (
          <div key={message} className="alert alert-error">
            {message}
          </div>
        ))}

      <div style={{ display: "none" }}>
        <label htmlFor="fax">Bitte dieses Feld leer lassen</label>
        <input type="text" id="fax" name="fax" defaultValue="" />
      </div>

      <label htmlFor="name-input" className="visually-hidden">
        Ihr Name
      </label>
      <input
        type="text"
        id="name-input"
        name="name"
        placeholder="Ihr Name"
        required
      />

      <label htmlFor="email-input" className="visually-hidden">
        Ihre E-Mail
      </label>
      <input
        type="email"
        id="email-input"
        name="email"
        placeholder="Ihre E-Mail"
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

      <div className="privacy-checkbox-wrapper">
        <input
          type="checkbox"
          id="privacy_consent"
          name="privacy_consent"
          required
        />
        <label htmlFor="privacy_consent">
          Ich habe die{" "}
          <Link
            href="/impressum#datenschutz"
            target="_blank"
            rel="noopener"
            style={{ textDecoration: "underline" }}
          >
            Datenschutzerklärung
          </Link>{" "}
          zur Kenntnis genommen und stimme zu, dass meine Angaben zur
          Kontaktaufnahme verarbeitet werden.
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status.state === "sending"}
      >
        {status.state === "sending" ? "Wird gesendet…" : "Nachricht senden"}
      </button>
    </form>
  );
}
