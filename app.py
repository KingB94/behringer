from dotenv import load_dotenv
import os
from flask_mail import Mail, Message
from flask import Flask, render_template, request, redirect, url_for, flash, abort
import json
from flask_wtf import FlaskForm
# NEU: BooleanField für die Checkbox hinzugefügt
from wtforms import StringField, TextAreaField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Email, Length
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
from markupsafe import escape

load_dotenv() 

app = Flask(__name__)
csrf = CSRFProtect(app)

# --- Rate Limiter (Schutz vor Spam-Flutung) ---
# Erlaubt max. 5 Anfragen pro Minute pro IP-Adresse auf geschützten Routen
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

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
    # 1. Alle News laden
    news_data = load_news_data()
    
    # 2. In eine Liste umwandeln und einfach die ersten 3 nehmen
    # (Da deine JSON schon sortiert ist, reicht das völlig)
    latest_news = list(news_data.items())[:3]
    
    # 3. An das Template übergeben
    return render_template('index.html', latest_news=latest_news)

# ─── FORMULAR KLASSE (Sicherheit & Validierung) ───────────────────
class KontaktForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(message="Bitte geben Sie Ihren Namen an.")])
    email = StringField('E-Mail', validators=[DataRequired(), Email(message="Ungültige E-Mail-Adresse.")])
    message = TextAreaField('Nachricht', validators=[DataRequired(), Length(min=10, message="Die Nachricht ist zu kurz.")])
    
    # NEU: Datenschutz-Checkbox Validierung im Backend
    privacy_consent = BooleanField('Datenschutz', validators=[DataRequired(message="Bitte akzeptieren Sie die Datenschutzerklärung.")])
    
    # Honeypot-Feld (Für den Nutzer unsichtbar, Bots füllen es oft aus)
    # Wir nennen es "fax" oder "url", damit Bots denken, es sei wichtig.
    fax = StringField('Fax') 

    submit = SubmitField('Nachricht senden')

# ─── HILFSFUNKTION ZUM LADEN DATEN ─────────────────────────────
def load_news_data():
    """Lädt die News-Artikel aus der JSON-Datei."""
    try:
        # Pfad zur JSON Datei bauen
        file_path = os.path.join(app.root_path, 'data', 'news.json')
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Fehler: news.json nicht gefunden.")
        return {}
    except json.JSONDecodeError:
        print("Fehler: news.json ist kein gültiges JSON.")
        return {}

# ─── Routes for “Leistungen” (Services) ───────────────────────────────────
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
@app.route('/team') 
def unternehmen_team():
    return render_template('unternehmen/team.html')

@app.route('/firmengeschichte') 
def firmengeschichte():
    return render_template('unternehmen/firmengeschichte.html') 

@app.route('/netzwerk') 
def unternehmen_netzwerk():
    return render_template('unternehmen/netzwerk.html')

@app.route('/stellenangebote') 
def unternehmen_stellenangebote():
    return render_template('unternehmen/stellenangebote.html')

@app.route('/standorte')
def standorte():
    return render_template('unternehmen/standorte.html')

# ─── Routes für Job-Detailseiten ───────────────────────────────────
@app.route('/karriere/<path:job_slug>')
def karriere_detail(job_slug):
    """
    Lädt dynamisch die HTML-Datei aus templates/jobs/
    """
    try:
        template_name = f"jobs/{job_slug}.html"
        return render_template(template_name)
    except Exception:
        return abort(404)

# ─── Routes for other pages (e.g., Impressum, Special Projects) ───────────
@app.route('/impressum')
def impressum():
    return render_template('impressum.html') 

@app.route('/maedchenschule-chato')
def maedchenschule_chato():
    return render_template('maedchenschule-chato.html')

@app.route('/neuigkeiten')
def news():
    news_data = load_news_data()
    return render_template('news.html', news=news_data)

@app.route('/neuigkeiten/<slug>')
def news_detail(slug):
    news_data = load_news_data()
    post = news_data.get(slug)
    
    if not post:
        abort(404)
    
    return render_template('news_detail.html', post=post, back_url=url_for('news'), back_text='Neuigkeiten')

# ─── Back Routen für Projekte ───────────────────────────────────
@app.route('/projekt/<path:project_slug>')
def projekt(project_slug):
    """ Diese eine Route verarbeitet alle deine Projektseiten. """
    back_path = request.args.get('back')
    back_text = request.args.get('back_text')

    template_name = f"projekte/{project_slug}.html"

    return render_template(
        template_name,
        back_url=back_path,
        back_text=back_text
    )

# ─── Routen für Kontaktformular ───────────────────────────────────
@app.route('/kontakt', methods=['POST'])
@limiter.limit("3 per minute") 
def kontakt():
    form = KontaktForm()
    
    if request.form.get('fax'):
        print("Bot erkannt (Honeypot ausgelöst).")
        return redirect(url_for('index') + '#contact')

    if form.validate_on_submit():
        safe_name = escape(form.name.data)
        safe_email = escape(form.email.data)
        
        message_raw = form.message.data
        safe_message_html = escape(message_raw).replace('\n', '<br>')

        msg = Message(
            subject=f"Neue Kontaktanfrage von {safe_name}",
            sender=("Kontaktformular Webseite", app.config['MAIL_USERNAME']),
            recipients=['info@ib-behringer.de']
        )

        msg.body = f"""
        Du hast eine neue Nachricht über das Kontaktformular erhalten:
        -----------------------------------
        Name: {form.name.data}
        E-Mail: {form.email.data}
        Datenschutz akzeptiert: Ja
        -----------------------------------
        Nachricht:
        {message_raw}
        -----------------------------------
        """

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
                    color: #005a9c;
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
                    line-height: 1.5;
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
                    <span>{safe_name}</span>
                    
                    <strong>E-Mail:</strong>
                    <span><a href="mailto:{safe_email}">{safe_email}</a></span>
                    
                    <strong>Datenschutz:</strong>
                    <span style="color: green;">✔ Akzeptiert</span>
                </div>
                
                <h3>Nachricht:</h3>
                <blockquote>
                    <p>{safe_message_html}</p>
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
            flash('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success')
        except Exception as e:
            print(f"Mail Error: {e}")
            flash('Fehler beim Senden. Bitte versuchen Sie es später.', 'error')
            
        return redirect(url_for('index') + '#contact')

    else:
        for field, errors in form.errors.items():
            for error in errors:
                flash(f"Fehler im Feld {field}: {error}", 'error')
        
        return redirect(url_for('index') + '#contact')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    # WICHTIG: debug=False für das Live-Hosting!
    app.run(debug=False)