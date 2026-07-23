"use client";

import { useEffect, useState } from "react";

/**
 * Globale Lightbox aus base.html: öffnet das Bild aus #team-photo-container
 * (Startseite & Team-Seite) in einem Overlay.
 */
export default function TeamPhotoLightbox() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const container = (event.target as Element | null)?.closest?.(
        "#team-photo-container"
      );
      if (!container) return;
      const img = container.querySelector("img");
      if (img) setSrc(img.currentSrc || img.src);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSrc(null);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      id="lightbox"
      className={`lightbox${src ? " visible" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setSrc(null);
      }}
    >
      <span className="close-lightbox" onClick={() => setSrc(null)}>
        ×
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="lightbox-content"
        id="lightbox-image"
        src={src ?? undefined}
        alt=""
      />
    </div>
  );
}
