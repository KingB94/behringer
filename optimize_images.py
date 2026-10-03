"""
Bilder für den Web-Einsatz optimieren (nur lokal, nicht Teil des Betriebs).

Hintergrund: Die Originalbilder liegen in Kamera-Auflösung (bis 24 MP) vor,
werden im Layout aber nur wenige hundert Pixel groß dargestellt. Das kostet
unnötig Bandbreite und Ladezeit.

Regel: lange Kante auf das Maß begrenzen, das die Anzeige inkl. Retina (2x)
tatsächlich braucht. Bilder, die schon klein genug sind, bleiben unangetastet.

Aufruf:
    venv/bin/python optimize_images.py --dry-run   # nur anzeigen, nichts ändern
    venv/bin/python optimize_images.py             # wirklich überschreiben
"""

import argparse
import os

from PIL import Image, ImageOps

BASIS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "images")

# (Pfad-Präfix relativ zu public/images, max. lange Kante in px, WebP-Qualität)
# Die erste passende Regel gewinnt, daher speziell vor allgemein.
REGELN = [
    # Briefkopf: enthält feine Linien und Text -> hohe Qualität halten,
    # nur die Auflösung reduzieren.
    ("home/hero/slide5.webp", 1920, 92),
    # Hero-Slideshow: vollflächig, mit dunklem Overlay und Text darüber.
    ("home/hero", 1920, 85),
    # Leistungs-Kacheln: Anzeige 400x220 px -> 900 px reicht auch auf Retina.
    ("leistungen/icons", 900, 82),
    # Team-Kopfbilder vollflächig, Porträts nur wenige hundert Pixel breit.
    ("team/team-header", 1920, 85),
    ("team", 900, 85),
    # Galerien mit Lightbox (max-width: 90%) -> 1800 px bleibt auch groß scharf.
    ("referenzen", 1800, 82),
    ("maedchenschule-chato", 1800, 82),
    # Neuigkeiten: Karten 220 px hoch, Detailseite deutlich größer.
    ("news", 1200, 82),
    # Kleine Logos/Platzhalter nicht anfassen.
    ("netzwerk", 0, 0),
    ("map-placeholder.webp", 0, 0),
]

STANDARD = (1600, 82)


def regel_fuer(relpfad):
    """Liefert (max_kante, qualitaet) für einen Pfad relativ zu public/images."""
    for praefix, kante, qualitaet in REGELN:
        if relpfad == praefix or relpfad.startswith(praefix + os.sep) or relpfad.startswith(praefix):
            return kante, qualitaet
    return STANDARD


def mb(zahl):
    return zahl / (1024 * 1024)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="nur anzeigen, nichts schreiben")
    args = parser.parse_args()

    vorher_gesamt = 0
    nachher_gesamt = 0
    geaendert = 0
    uebersprungen = 0

    for wurzel, _, dateien in os.walk(BASIS):
        for name in sorted(dateien):
            if not name.lower().endswith(".webp"):
                continue

            pfad = os.path.join(wurzel, name)
            relpfad = os.path.relpath(pfad, BASIS)
            max_kante, qualitaet = regel_fuer(relpfad)

            vorher = os.path.getsize(pfad)
            vorher_gesamt += vorher

            if max_kante == 0:
                nachher_gesamt += vorher
                uebersprungen += 1
                continue

            with Image.open(pfad) as bild:
                bild = ImageOps.exif_transpose(bild)
                breite, hoehe = bild.size

                if max(breite, hoehe) > max_kante:
                    bild.thumbnail((max_kante, max_kante), Image.LANCZOS)

                neue_groesse = bild.size
                if bild.mode not in ("RGB", "RGBA"):
                    bild = bild.convert("RGB")

                # Immer erst temporär schreiben, damit das Original erhalten
                # bleibt, falls das Ergebnis nicht kleiner ausfällt.
                ziel = pfad + ".tmp"
                bild.save(ziel, "webp", quality=qualitaet, method=6)

            nachher = os.path.getsize(ziel)

            # Nie verschlechtern: wenn das Ergebnis größer wäre, Original behalten.
            if nachher >= vorher:
                os.remove(ziel)
                nachher_gesamt += vorher
                uebersprungen += 1
                continue

            if args.dry_run:
                os.remove(ziel)
            else:
                os.replace(ziel, pfad)

            nachher_gesamt += nachher
            geaendert += 1
            print(
                f"{relpfad:<70} {breite}x{hoehe} -> {neue_groesse[0]}x{neue_groesse[1]}  "
                f"{mb(vorher):6.2f} MB -> {mb(nachher):5.2f} MB"
            )

    print()
    print(f"Bearbeitet: {geaendert}, unverändert: {uebersprungen}")
    print(f"Gesamt: {mb(vorher_gesamt):.1f} MB -> {mb(nachher_gesamt):.1f} MB "
          f"({100 - nachher_gesamt / vorher_gesamt * 100:.1f} % gespart)")
    if args.dry_run:
        print("(Probelauf - es wurde nichts überschrieben)")


if __name__ == "__main__":
    main()
