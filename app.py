from flask import Flask, render_template

app = Flask(__name__)

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


if __name__ == '__main__':
    app.run(debug=True)
