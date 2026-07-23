"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const IMAGES = Array.from(
  { length: 23 },
  (_, i) => `/images/maedchenschule-chato/chato${i + 1}.webp`
);

export default function ChatoSlideshow() {
  const [index, setIndex] = useState(1); // 1-basiert wie im Original
  const thumbBarRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLImageElement | null>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = IMAGES.length;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((n) => (n >= total ? 1 : n + 1));
    }, 6000);
  }, [total]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  // Aktives Thumbnail horizontal in die Mitte scrollen
  useEffect(() => {
    const bar = thumbBarRef.current;
    const thumb = thumbRefs.current[index - 1];
    if (bar && thumb) {
      bar.scrollTo({
        left: thumb.offsetLeft - bar.offsetWidth / 2 + thumb.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }, [index]);

  const plus = (n: number) =>
    setIndex((cur) => {
      const next = cur + n;
      if (next > total) return 1;
      if (next < 1) return total;
      return next;
    });

  return (
    <section
      className="section slideshow-section"
      style={{ backgroundColor: "#f9f9f9", padding: "4rem 0" }}
    >
      <div className="container" style={{ maxWidth: 1000 }}>
        <h2
          style={{ textAlign: "center", marginBottom: "2rem", color: "#5d8a66" }}
        >
          Eindrücke aus Chato
        </h2>

        <div
          className="chato-slideshow-container"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "8px 8px 0 0",
            boxShadow: "var(--shadow-lg)",
            lineHeight: 0,
          }}
          onMouseEnter={stopTimer}
        >
          {IMAGES.map((src, i) => (
            <div
              key={src}
              className="chato-slide fade"
              style={{ display: i === index - 1 ? "block" : "none" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                }}
                alt={`Eindruck aus Chato Bild ${i + 1}`}
              />
            </div>
          ))}

          <a
            className="prev"
            onClick={() => plus(-1)}
            style={arrowStyle("left")}
          >
            ❮
          </a>
          <a
            className="next"
            onClick={() => plus(1)}
            style={arrowStyle("right")}
          >
            ❯
          </a>
        </div>

        <div
          className="thumbnail-bar"
          ref={thumbBarRef}
          style={{
            display: "flex",
            overflowX: "auto",
            gap: 10,
            padding: 15,
            background: "#333",
            borderRadius: "0 0 8px 8px",
            scrollBehavior: "smooth",
          }}
          onMouseEnter={stopTimer}
        >
          {IMAGES.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              className={`chato-thumb${i === index - 1 ? " active" : ""}`}
              src={src}
              onClick={() => setIndex(i + 1)}
              style={{
                height: 60,
                aspectRatio: "16/9",
                objectFit: "cover",
                cursor: "pointer",
                opacity: i === index - 1 ? 1 : 0.5,
                transition: "0.3s",
                borderRadius: 2,
                flexShrink: 0,
              }}
              alt={`Vorschau ${i + 1}`}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <span id="slide-counter" style={{ fontSize: "0.9rem", color: "#666" }}>
            Bild {index} von {total}
          </span>
        </div>
      </div>
    </section>
  );
}

function arrowStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    [side]: 10,
    transform: "translateY(-50%)",
    cursor: "pointer",
    background: "rgba(0,0,0,0.5)",
    color: "white",
    padding: 15,
    borderRadius: "50%",
    textDecoration: "none",
    fontWeight: "bold",
    zIndex: 2,
    lineHeight: 1,
  };
}
