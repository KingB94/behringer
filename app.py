from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# ─── Routes for “other” (root-level) templates ─────────────────────────────────

@app.route('/firmengeschichte')
def firmengeschichte():
    # If firmengeschichte.html lives in “templates/sonstiges/”
    return render_template('sonstiges/firmengeschichte.html')

@app.route('/impressum')
def impressum():
    # If impressum.html is in “templates/”
    return render_template('sonstiges/impressum.html')

@app.route('/maedchenschule-chato')
def maedchenschule_chato():
    # If maedchenschule-chato.html is in “templates/”
    return render_template('sonstiges/maedchenschule-chato.html')

# ─── Routes for “leistungen” subfolder ──────────────────────────────────────────

@app.route('/leistungen/fernwaerme')
def fernwaerme():
    return render_template('leistungen/fernwaerme.html')

@app.route('/leistungen/siedlungswasserwirtschaft')
def siedlungswasserwirtschaft():
    return render_template('leistungen/siedlungswasserwirtschaft.html')

@app.route('/leistungen/strassenbau-brueckenbau')
def strassenbau_brueckenbau():
    return render_template('leistungen/strassenbau-brueckenbau.html')


if __name__ == '__main__':
    app.run(debug=True)
