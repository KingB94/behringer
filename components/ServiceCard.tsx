"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/** Service-Karte der Startseite: die ganze Karte ist klickbar (wie im alten Inline-JS). */
export default function ServiceCard({
  id,
  href,
  icon,
  title,
}: {
  id: string;
  href: string;
  icon: string;
  title: string;
}) {
  const router = useRouter();

  return (
    <div
      className="service-card"
      id={id}
      style={{ cursor: "pointer" }}
      onClick={() => router.push(href)}
    >
      <Link
        href={href}
        className="service-link-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" loading="lazy" />
        <h3>{title}</h3>
      </Link>
    </div>
  );
}
