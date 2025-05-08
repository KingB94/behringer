from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/eins')
def eins():
    return render_template('eins.html')

@app.route('/zwei')
def zwei():
    return render_template('zwei.html')

@app.route('/drei')
def drei():
    return render_template('drei.html')

@app.route('/vier')
def vier():
    return render_template('vier.html')

if __name__ == '__main__':
    app.run(debug=True)
