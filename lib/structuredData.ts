import { SITE_URL } from "@/lib/meta";

/**
 * Schema.org-Daten (JSON-LD) für Suchmaschinen und KI-Suchen: wer das Büro ist,
 * was es macht, wo es sitzt und für welche Region es arbeitet. Wird im Layout
 * auf jeder Seite ausgegeben. Adressen/Telefonnummern wie auf /standorte.
 */

const ORG_ID = `${SITE_URL}/#organisation`;

const LANDKREISE = [
  "Landkreis Mühldorf a. Inn",
  "Landkreis Altötting",
  "Landkreis Rottal-Inn",
  "Landkreis Rosenheim",
  "Landkreis Ebersberg",
  "Landkreis Traunstein",
];

const REGIERUNGSBEZIRKE = ["Oberbayern", "Niederbayern", "Oberpfalz"];

const FACHGEBIETE = [
  "Siedlungswasserwirtschaft",
  "Kanalbau und Kanalsanierung",
  "Wasserversorgung",
  "Straßenbau",
  "Brückenbau",
  "Wasserbau",
  "Hochwasserschutz",
  "Starkregen- und Sturzflutvorsorge",
  "Baulanderschließung",
  "Fernwärme",
  "Hydraulische Berechnungen",
  "Kommunales GIS und Kanalkataster",
];

const STANDORTE = [
  {
    id: "muehldorf",
    name: "Ingenieurbüro Behringer & Partner mbB – Hauptsitz Mühldorf a. Inn",
    street: "Luitpoldallee 32",
    zip: "84453",
    city: "Mühldorf a. Inn",
    phone: "+49 8631 98679-00",
    fax: "+49 8631 98679-99",
  },
  {
    id: "simbach",
    name: "Ingenieurbüro Behringer & Partner mbB – Zweigstelle Simbach a. Inn",
    street: "Bahnhofplatz 4",
    zip: "84359",
    city: "Simbach a. Inn",
    phone: "+49 8571 9250415",
    fax: "+49 8571 921384",
  },
  {
    id: "rossbach",
    name: "Ingenieurbüro Behringer & Partner mbB – Zweigstelle Roßbach",
    street: "Haselbach 6",
    zip: "94439",
    city: "Roßbach",
    phone: "+49 8564 962959",
    fax: "+49 8564 96296",
  },
];

function address(s: (typeof STANDORTE)[number]) {
  return {
    "@type": "PostalAddress",
    streetAddress: s.street,
    postalCode: s.zip,
    addressLocality: s.city,
    addressRegion: "Bayern",
    addressCountry: "DE",
  };
}

const areaServed = [
  ...LANDKREISE.map((name) => ({ "@type": "AdministrativeArea", name })),
  ...REGIERUNGSBEZIRKE.map((name) => ({ "@type": "AdministrativeArea", name })),
];

export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Behringer & Partner",
      legalName: "Ingenieurbüro Behringer & Partner mbB",
      url: SITE_URL,
      logo: `${SITE_URL}/images/layout/logo.png`,
      email: "info@ib-behringer.de",
      telephone: STANDORTE[0].phone,
      faxNumber: STANDORTE[0].fax,
      foundingDate: "1968",
      address: address(STANDORTE[0]),
      description:
        "Ingenieurbüro für kommunalen Tiefbau und Infrastrukturplanung aus Mühldorf a. Inn. " +
        "Planung, Ausschreibung und Bauüberwachung für Städte, Gemeinden, Zweckverbände, " +
        "Stadtwerke, Landkreise, Ämter und weitere öffentliche sowie private Auftraggeber " +
        "in Oberbayern, Niederbayern und der Oberpfalz.",
      knowsAbout: FACHGEBIETE,
      areaServed,
      sameAs: ["https://www.instagram.com/ibb_mue/"],
      location: STANDORTE.map((s) => ({ "@id": `${SITE_URL}/standorte#${s.id}` })),
    },
    ...STANDORTE.map((s) => ({
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/standorte#${s.id}`,
      name: s.name,
      parentOrganization: { "@id": ORG_ID },
      url: `${SITE_URL}/standorte`,
      image: `${SITE_URL}/images/layout/logo.png`,
      telephone: s.phone,
      faxNumber: s.fax,
      email: "info@ib-behringer.de",
      address: address(s),
      areaServed,
    })),
  ],
};
