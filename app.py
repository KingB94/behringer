from dotenv import load_dotenv
import os
from flask_mail import Mail, Message
from flask import Flask, render_template, request, redirect, url_for

load_dotenv() 

app = Flask(__name__)

# --- Konfiguration für Flask-Mail ---
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS').lower() in ['true', 'on', '1']
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

# ─── Routes for “Leistungen” (Services) ───────────────────────────────────
# Assuming these HTML files are in templates/leistungen/

@app.route('/siedlungswasserwirtschaft')
def siedlungswasserwirtschaft():
    return render_template('leistungen/siedlungswasserwirtschaft.html')

@app.route('/strassenbau-brueckenbau')
def strassenbau_brueckenbau():
    return render_template('leistungen/strassenbau-brueckenbau.html')

@app.route('/fernwaerme')
def fernwaerme():
    return render_template('leistungen/fernwaerme.html')

@app.route('/hydraulische-nachweise')
def hydraulische_nachweise():
    return render_template('leistungen/hydraulische-nachweise.html')

@app.route('/baulanderschliessung')
def baulanderschliessung():
    return render_template('leistungen/baulanderschliessung.html')

@app.route('/kommunales-gis')
def kommunales_gis():
    return render_template('leistungen/kommunales-gis.html')

@app.route('/sanierungen')
def sanierungen():
    return render_template('leistungen/sanierungen.html')

@app.route('/wasserbau')
def wasserbau():
    return render_template('leistungen/wasserbau.html')

# ─── Routes for “Unternehmen” (Company) ───────────────────────────────────
# Assuming these HTML files are in templates/unternehmen/

@app.route('/team') # Changed from /unternehmen/team to match url_for('unternehmen_team')
def unternehmen_team():
    return render_template('unternehmen/team.html')

@app.route('/firmengeschichte') # Changed from /sonstiges/firmengeschichte
def firmengeschichte():
    return render_template('unternehmen/firmengeschichte.html') # Assuming it's in unternehmen/

@app.route('/netzwerk') # Changed from /unternehmen/netzwerk
def unternehmen_netzwerk():
    return render_template('unternehmen/netzwerk.html')

@app.route('/stellenangebote') # Changed from /unternehmen/stellenangebote
def unternehmen_stellenangebote():
    return render_template('unternehmen/stellenangebote.html')

# ─── Routes for other pages (e.g., Impressum, Special Projects) ───────────
# Assuming these HTML files are directly in templates/

@app.route('/impressum')
def impressum():
    return render_template('impressum.html') # Assuming it's in templates/

@app.route('/maedchenschule-chato')
def maedchenschule_chato():
    return render_template('maedchenschule-chato.html') # Assuming it's in templates/


@app.route('/neuigkeiten')
def news():
    return render_template('news.html')


# ─── Statische Routen für Projekte ───────────────────────────────────

@app.route('/projekt/bahnunterfuehrung-klugham')
def projekt_klugham():
    return render_template('projekte/projekt_klugham.html')

# ─── Routen für Kontaktformular ───────────────────────────────────
@app.route('/kontakt', methods=['POST'])
def kontakt():
    """Nimmt die Formulardaten entgegen und sendet die E-Mail."""
    name = request.form.get('name')
    email = request.form.get('email')
    nachricht = request.form.get('message')

    # Erstellt die E-Mail-Nachricht
    msg = Message(
        subject=f"Neue Kontaktanfrage von {name}",
        # Der Absender ist die Adresse aus deiner .env Datei
        sender=("Kontaktformular", app.config['MAIL_USERNAME']),
        # HIER legst du fest, wo die E-Mail ankommen soll!
        recipients=['info@ib-behringer.de'] 
    )
    
    msg.body = f"""
    Du hast eine neue Nachricht über das Kontaktformular erhalten:

    Name: {name}
    E-Mail: {email}

    Nachricht:
    {nachricht}
    """
    
    try:
        mail.send(msg)
    except Exception as e:
        # Im Fehlerfall (z.B. falsches Passwort) passiert erstmal nichts.
        # Für eine Live-Seite könntest du hier einen Fehler loggen.
        print(f"Fehler beim Senden der E-Mail: {e}")
        pass

    # Leitet den Benutzer immer zurück zur Startseite zum Kontaktbereich
    return redirect(url_for('index') + '#contact')

if __name__ == '__main__':
    app.run(debug=True)
