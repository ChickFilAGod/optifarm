from flask import *

app = Flask(__name__)

@app.route('/')
def start():
    return redirect(url_for("home.home"))

import home, intro, practice, explore
app.register_blueprint(home.bp)
app.register_blueprint(intro.bp)
app.register_blueprint(practice.bp)
app.register_blueprint(explore.bp)
