"use client";

import { useState } from "react";

const MAP_SRC =
  "https://maps.google.com/maps?q=Luitpoldallee%2032,%2084453%20M%C3%BChldorf%20a.%20Inn&t=&z=15&ie=UTF8&iwloc=&output=embed";

/** Google-Maps-2-Klick-Lösung: iframe lädt erst nach ausdrücklicher Zustimmung. */
export default function TwoClickMap() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="map-container">
      <iframe
        id="google-map-iframe"
        src={loaded ? MAP_SRC : undefined}
        width="100%"
        height={350}
        style={{ border: 0, display: loaded ? "block" : "none" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Standortkarte Google Maps"
      />
      {!loaded && (
        <div id="map-placeholder" className="map-placeholder">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/map-placeholder.webp"
            alt="Karte Vorschau"
            className="map-preview-img"
          />
          <div className="map-overlay">
            <p>
              <strong>Karte laden</strong>
            </p>
            <p className="map-disclaimer">
              Wir nutzen Google Maps. Mit dem Laden der Karte akzeptieren Sie
              die{" "}
              <a
                href="https://policies.google.com/privacy?hl=de"
                target="_blank"
                rel="noopener"
              >
                Datenschutzerklärung
              </a>{" "}
              von Google.
            </p>
            <button
              id="load-map-btn"
              className="btn btn-primary btn-sm"
              onClick={() => setLoaded(true)}
            >
              Karte anzeigen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
