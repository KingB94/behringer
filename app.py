from dotenv import load_dotenv
import os
from flask_mail import Mail, Message
from flask import Flask, render_template, request, redirect, url_for, flash

load_dotenv() 

app = Flask(__name__)

# --- Konfiguration für Flask-Mail ---
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
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

# ─── Back Routen für Projekte ───────────────────────────────────
@app.route('/projekt/<project_slug>')
def projekt(project_slug):
    """ Diese eine Route verarbeitet alle deine Projektseiten. """
    back_path = request.args.get('back')
    back_text = request.args.get('back_text')

    # Erstellt den Dateipfad zur HTML-Datei dynamisch
    template_name = f"projekte/{project_slug}.html"

    return render_template(
        template_name,
        back_url=back_path,
        back_text=back_text
    )

# ─── Routen für Kontaktformular ───────────────────────────────────
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
        sender=("Kontaktformular Webseite", app.config['MAIL_USERNAME']),
        # HIER legst du fest, wo die E-Mail ankommen soll!
        recipients=['info@ib-behringer.de']
    )

    # 1. Plain-Text-Version für E-Mail-Clients, die kein HTML unterstützen
    msg.body = f"""
    Du hast eine neue Nachricht über das Kontaktformular erhalten:
    -----------------------------------
    Name: {name}
    E-Mail: {email}
    -----------------------------------
    Nachricht:
    {nachricht}
    -----------------------------------
    """

    # 2. Schön formatierte HTML-Version der E-Mail
    msg.html = f"""
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 20px;
            }}
            .container {{
                background-color: #ffffff;
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            }}
            h2 {{
                color: #005a9c; /* Hauptfarbe Ihrer Webseite */
                margin-top: 0;
                border-bottom: 2px solid #e0e0e0;
                padding-bottom: 10px;
            }}
            .info-grid {{
                display: grid;
                grid-template-columns: 100px 1fr;
                gap: 10px;
                margin-bottom: 20px;
            }}
            .info-grid strong {{
                color: #333;
            }}
            blockquote {{
                background-color: #f4f4f4;
                border-left: 4px solid #005a9c;
                margin: 20px 0;
                padding: 15px;
                font-style: italic;
                color: #555;
            }}
            a {{
                color: #007bff;
                text-decoration: none;
            }}
            .footer {{
                text-align: center;
                font-size: 12px;
                color: #999;
                margin-top: 30px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Neue Kontaktanfrage</h2>
            <div class="info-grid">
                <strong>Von:</strong>
                <span>{name}</span>
                
                <strong>E-Mail:</strong>
                <span><a href="mailto:{email}">{email}</a></span>
            </div>
            
            <h3>Nachricht:</h3>
            <blockquote>
                <p>{nachricht.replace(chr(10), '<br>')}</p>
            </blockquote>
        </div>
        <div class="footer">
            <p>Diese E-Mail wurde automatisch vom Kontaktformular der Webseite gesendet.</p>
        </div>
    </body>
    </html>
    """
    
    try:
        mail.send(msg)
        # Erfolgsnachricht für den Benutzer setzen
        flash('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success')
    except Exception as e:
        print(f"Fehler beim Senden der E-Mail: {e}")
        # Fehlernachricht für den Benutzer setzen
        flash('Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 'error')

    # Leitet den Benutzer immer zurück zur Startseite zum Kontaktbereich
    return redirect(url_for('index') + '#contact')

if __name__ == '__main__':
    app.run(debug=True)
