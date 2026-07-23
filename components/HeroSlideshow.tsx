"use client";

import { useEffect, useState } from "react";

export type HeroSlide = { src: string; alt: string };

export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="hero-slideshow">
      {slides.map((slide, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`hero-img${i === active ? " active" : ""}`}
          loading={i === 0 ? undefined : "lazy"}
        />
      ))}
    </div>
  );
}
