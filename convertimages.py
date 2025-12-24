from PIL import Image, ImageOps
import os

# Pfad zu deinem Ordner anpassen
directory = '/Users/benediktholzner/Documents/GitHub/behringer/static/images'

print(f"Starte Konvertierung in: {directory}")

for filename in os.listdir(directory):
    if filename.lower().endswith((".jpg", ".jpeg", ".jpe", ".png", ".heic")):
        try:
            # Bild öffnen
            img_path = os.path.join(directory, filename)
            image = Image.open(img_path)
            
            # WICHTIG: Drehung basierend auf EXIF-Daten anwenden
            image = ImageOps.exif_transpose(image)
            
            # Neuen Dateinamen erstellen
            new_filename = os.path.splitext(filename)[0] + ".webp"
            new_path = os.path.join(directory, new_filename)
            
            # Speichern (exif_transpose entfernt die EXIF-Tags, aber die Pixel sind nun gedreht)
            image.save(new_path, "webp", quality=90) 
            print(f"Korrigiert & Konvertiert: {filename} -> {new_filename}")
            
        except Exception as e:
            print(f"Fehler bei {filename}: {e}")

print("Fertig!")