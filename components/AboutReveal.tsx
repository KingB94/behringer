"use client";

import { useEffect, useRef } from "react";

/**
 * IntersectionObserver-Reveal aus base.html: beobachtet die #about-Sektion und
 * blendet .about-reveal-content beim ersten Sichtbarwerden ein.
 */
export default function AboutReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const section = el.closest("section") ?? el;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-reveal-content" ref={ref}>
      {children}
    </div>
  );
}
