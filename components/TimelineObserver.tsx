"use client";

import { useEffect } from "react";

/**
 * Timeline-Animation der Firmengeschichte: fügt .visible zu .timeline-item
 * hinzu, sobald es in den Viewport scrollt (Parität zum Inline-Script).
 */
export default function TimelineObserver() {
  useEffect(() => {
    const items = document.querySelectorAll(".timeline-item");
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return null;
}
