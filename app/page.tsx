import type { Metadata } from "next";
import Link from "next/link";
import AboutReveal from "@/components/AboutReveal";
import HeroSlideshow from "@/components/HeroSlideshow";
import NewsSlider from "@/components/NewsSlider";
import ServiceCard from "@/components/ServiceCard";
import ContactForm from "@/components/ContactForm";
import TwoClickMap from "@/components/TwoClickMap";
import { getLatestNews } from "@/lib/news";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  description:
    "Wir planen und realisieren Infrastrukturprojekte: Straßenbau, Wasserbau, Fernwärme und mehr.",
  path: "/",
});

const HERO_SLIDES = [
  {
    src: "/images/home/hero/slide1.webp",
    alt: "Behringer Bürogebäude in Mühldorf von außen",
  },
  {
    src: "/images/home/hero/slide2.webp",
    alt: "Besprechungsraum von Ingenieurbüro Behringer",
  },
  {
    src: "/images/home/hero/slide3.webp",
    alt: "Behringer Bürogebäude in Mühldorf von oben (Luftaufnahme)",
  },
  {
    src: "/images/home/hero/slide4.webp",
    alt: "Gruppenbild des Teams vor dem Bürogebäude",
  },
  { src: "/images/home/hero/slide5.webp", alt: "Briefkopf von Behringer" },
];

const SERVICES = [
  {
    id: "service-siedlung",
    href: "/siedlungswasserwirtschaft",
    icon: "/images/leistungen/icons/siedlungswasserwirtschaft.webp",
    title: "Siedlungswasserwirtschaft",
  },
  {
    id: "service-strassen",
    href: "/strassenbau-brueckenbau",
    icon: "/images/leistungen/icons/strassenbau.webp",
    title: "Straßenbau & Brückenbau",
  },
  {
    id: "service-fernwaerme",
    href: "/fernwaerme",
    icon: "/images/leistungen/icons/fernwaerme.webp",
    title: "Fernwärme",
  },
  {
    id: "service-hydraulik",
    href: "/hydraulische-nachweise",
    icon: "/images/leistungen/icons/hydraulischenachweise.webp",
    title: "Hydraulische Nachweise",
  },
  {
    id: "service-bauland",
    href: "/baulanderschliessung",
    icon: "/images/leistungen/icons/baulanderschliessung.webp",
    title: "Baulanderschließung",
  },
  {
    id: "service-gis",
    href: "/kommunales-gis",
    icon: "/images/leistungen/icons/kommunalesgis.webp",
    title: "Kommunales GIS",
  },
  {
    id: "service-sanierung",
    href: "/sanierungen",
    icon: "/images/leistungen/icons/sanierungen.webp",
    title: "Sanierungen",
  },
  {
    id: "service-wasserbau",
    href: "/wasserbau",
    icon: "/images/leistungen/icons/wasserbau.webp",
    title: "Wasserbau",
  },
];

export default function Home() {
  const latestNews = getLatestNews(3).map(([slug, item]) => ({
    slug,
    title: item.title,
    date: item.date,
    image: item.image,
    summary: item.summary,
  }));

  return (
    <>
      <section className="hero">
        <HeroSlideshow slides={HERO_SLIDES} />
        <div className="hero-content">
          <h1>Ihr Partner im Tiefbau seit 1968</h1>
          <p>Wirtschaftliche und nachhaltige Lösungen mit modernster Technik.</p>
        </div>
      </section>

      <main>
        <section id="about" className="section">
          <div className="container mx-auto px-4-custom">
            <h2 id="about-headline">Wer wir sind und was uns antreibt</h2>
            <AboutReveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <p className="text-lg mb-4">
                    Seit über 25 Jahren ist das Ingenieurbüro Behringer Ihr
                    verlässlicher Partner für anspruchsvolle Projekte im
                    Bauingenieurwesen. Unser erfahrenes Team steht für
                    Innovation, Präzision und nachhaltige Qualität.
                  </p>
                  <p className="text-lg mb-6">
                    Wir entwickeln maßgeschneiderte, wirtschaftliche Lösungen
                    nach höchsten technischen Standards und begleiten Sie von
                    der Idee bis zur erfolgreichen Realisierung Ihres Projekts.
                  </p>
                </div>
                <div className="order-1 lg:order-2">
                  <div
                    id="team-photo-container"
                    className="relative h-96 overflow-hidden rounded-lg shadow-xl"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/team/team-header.webp"
                      alt="Gruppenbild des Teams vor dem Bürogebäude"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6"></div>
                  </div>
                </div>
              </div>
            </AboutReveal>
          </div>
        </section>

        <section id="news" className="section bg-alternate">
          <div className="container">
            <h2 className="section-title">Aktuelle Neuigkeiten</h2>
            <p className="section-subtitle">
              Bleiben Sie auf dem Laufenden über unsere Projekte und
              Entwicklungen.
            </p>
            <NewsSlider items={latestNews} />
            <div style={{ textAlign: "center", marginTop: "var(--space-lg)" }}>
              <Link href="/neuigkeiten" className="btn btn-primary">
                Alle Neuigkeiten ansehen
              </Link>
            </div>
          </div>
        </section>

        <section id="services" className="section services">
          <div className="container">
            <h2 className="section-title">Leistungen</h2>
            <p className="section-subtitle">
              Entdecken Sie unser breites Spektrum an Ingenieurdienstleistungen.
            </p>
            <div className="services-grid">
              {SERVICES.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </div>
        </section>

        <section id="company" className="section bg-alternate">
          <div className="container">
            <h2 className="section-title">Das Unternehmen</h2>
            <p className="section-subtitle">
              Erfahren Sie mehr über uns, unsere Werte und was uns auszeichnet.
            </p>
            <div className="info-card-grid">
              <div className="info-card" id="company-team">
                <h3>Unser Team</h3>
                <p>
                  Lernen Sie die engagierten Köpfe hinter Behringer &amp;
                  Partner kennen. Erfahrung und Expertise vereint.
                </p>
                <Link href="/team" className="btn btn-primary btn-sm">
                  Team kennenlernen
                </Link>
              </div>
              <div className="info-card" id="company-history">
                <h3>Firmengeschichte</h3>
                <p>
                  Seit 1968 gestalten wir Infrastruktur. Erfahren Sie mehr über
                  unsere Meilensteine und Entwicklung.
                </p>
                <Link href="/firmengeschichte" className="btn btn-primary btn-sm">
                  Unsere Historie
                </Link>
              </div>
              <div className="info-card" id="company-jobs">
                <h3>Karriere &amp; Stellenangebote</h3>
                <p>
                  Werden Sie Teil unseres Teams! Entdecken Sie aktuelle
                  Jobangebote und Karrieremöglichkeiten.
                </p>
                <Link href="/stellenangebote" className="btn btn-primary btn-sm">
                  Zu den Stellen
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="container">
            <h2 className="section-title">Kontakt</h2>
            <p className="section-subtitle">
              Wir freuen uns auf Ihre Nachricht, Ihren Anruf oder Ihren Besuch.
            </p>
            <div className="contact-grid">
              <ContactForm />
              <div className="contact-info">
                <TwoClickMap />
                <address>
                  <p>
                    <strong>Behringer &amp; Partner mbB</strong>
                    <br />
                    Luitpoldallee 32
                    <br />
                    D-84453 Mühldorf a. Inn
                  </p>
                  <p>
                    Tel: <a href="tel:+4986319867900">+49 8631 98679-00</a>
                    <br />
                    E-Mail:{" "}
                    <a href="mailto:info@ib-behringer.de">
                      info@ib-behringer.de
                    </a>
                  </p>
                </address>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
