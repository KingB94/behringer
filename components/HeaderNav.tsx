"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LEISTUNGEN: Array<[string, React.ReactNode]> = [
  ["/siedlungswasserwirtschaft", "Siedlungswasserwirtschaft"],
  ["/strassenbau-brueckenbau", <>Straße&shy;bau &amp; Brücken&shy;bau</>],
  ["/fernwaerme", "Fernwärme"],
  ["/hydraulische-nachweise", "Hydraulische Nachweise"],
  ["/baulanderschliessung", "Baulanderschließung"],
  ["/kommunales-gis", "Kommunales GIS"],
  ["/sanierungen", "Sanierungen"],
  ["/wasserbau", "Wasserbau"],
];

const UNTERNEHMEN: Array<[string, string]> = [
  ["/team", "Team"],
  ["/firmengeschichte", "Firmengeschichte"],
  ["/standorte", "Standorte"],
  ["/netzwerk", "Netzwerk"],
  ["/stellenangebote", "Stellenangebote"],
];

type BackMode = { url: string; text: string } | null;

export default function HeaderNav() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Back-Modus für /projekt/* hängt an ?back=&back_text= — Query-Params sind
  // beim statischen Prerender nicht verfügbar, daher erst nach Hydration lesen.
  const [projektBack, setProjektBack] = useState<BackMode>(null);
  const navRef = useRef<HTMLElement>(null);

  const isNewsDetail = /^\/neuigkeiten\/.+/.test(pathname);
  const isProjekt = pathname.startsWith("/projekt/");

  /* eslint-disable react-hooks/set-state-in-effect -- Back-Modus aus Query-Params erst nach Hydration */
  useEffect(() => {
    if (!isProjekt) {
      setProjektBack(null);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const back = params.get("back");
    const backText = params.get("back_text");
    if (back && backText && back.startsWith("/")) {
      setProjektBack({ url: back, text: backText });
    } else {
      setProjektBack(null);
    }
  }, [isProjekt, pathname]);

  // Menü bei Routenwechsel schließen
  useEffect(() => {
    setNavOpen(false);
    setOpenDropdown(null);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Klick außerhalb der Navigation schließt offene Dropdowns
  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Escape schließt offene Dropdowns
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Globaler Smooth-Scroll mit Header-Offset für reine #-Anker (Parität zu base.html)
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href")!;
      if (href === "#") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        const header = document.querySelector<HTMLElement>(".site-header");
        const headerOffset = header ? header.offsetHeight : 0;
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const closeMobileNav = () => {
    setNavOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((current) => (current === name ? null : name));
  };

  const backMode: BackMode = isNewsDetail
    ? { url: "/neuigkeiten", text: "Neuigkeiten" }
    : projektBack;

  return (
    <>
      <nav className="main-nav" ref={navRef}>
        {backMode ? (
          <ul className={`nav-list${navOpen ? " open" : ""}`}>
            <li>
              <Link href={backMode.url} className="btn btn-primary btn-sm">
                ❮ Zurück zu {backMode.text}
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="btn btn-primary btn-sm">
                Kontakt
              </Link>
            </li>
          </ul>
        ) : (
          <ul className={`nav-list${navOpen ? " open" : ""}`}>
            <li>
              <Link href="/#about" onClick={closeMobileNav}>
                Über uns
              </Link>
            </li>
            <li>
              <Link href="/neuigkeiten" onClick={closeMobileNav}>
                Neuigkeiten
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                href="/#services"
                aria-haspopup="true"
                aria-expanded={openDropdown === "leistungen"}
                className={openDropdown === "leistungen" ? "active" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("leistungen");
                }}
              >
                <span>
                  Leistungen <span className="dropdown-arrow">▼</span>
                </span>
              </Link>
              <ul
                className={`dropdown-menu${
                  openDropdown === "leistungen" ? " submenu-open" : ""
                }`}
              >
                {LEISTUNGEN.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} onClick={closeMobileNav}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link
                href="/#company"
                aria-haspopup="true"
                aria-expanded={openDropdown === "unternehmen"}
                className={openDropdown === "unternehmen" ? "active" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("unternehmen");
                }}
              >
                <span>
                  Unternehmen <span className="dropdown-arrow">▼</span>
                </span>
              </Link>
              <ul
                className={`dropdown-menu${
                  openDropdown === "unternehmen" ? " submenu-open" : ""
                }`}
              >
                {UNTERNEHMEN.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} onClick={closeMobileNav}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link
                href="/#contact"
                className="btn btn-primary"
                onClick={closeMobileNav}
              >
                Kontakt
              </Link>
            </li>
          </ul>
        )}
      </nav>
      <button
        className="nav-toggle"
        aria-label="Menü öffnen"
        aria-expanded={navOpen}
        onClick={() => {
          setNavOpen((open) => {
            if (open) setOpenDropdown(null);
            return !open;
          });
        }}
      >
        {navOpen ? "×" : "☰"}
      </button>
    </>
  );
}
