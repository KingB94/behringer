"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type NewsSliderItem = {
  slug: string;
  title: string;
  date: string;
  image: string;
  summary: string;
};

export default function NewsSlider({ items }: { items: NewsSliderItem[] }) {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 7000);
  };

  useEffect(() => {
    if (items.length === 0) return;
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return (
    <>
      <div className="news-slider-wrapper">
        <div className="news-slider">
          {items.map((item, i) => (
            <div
              key={item.slug}
              className={`news-item${i === active ? " active" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} loading="lazy" />
              <small className="news-date">{item.date}</small>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <Link
                href={`/neuigkeiten/${item.slug}`}
                className="btn btn-primary btn-sm"
              >
                Mehr lesen
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="news-dots">
        {items.map((item, i) => (
          <span
            key={item.slug}
            className={`news-dot${i === active ? " active" : ""}`}
            data-index={i}
            onClick={() => {
              setActive(i);
              startInterval();
            }}
          />
        ))}
      </div>
    </>
  );
}
