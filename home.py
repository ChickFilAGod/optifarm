from flask import *

bp = Blueprint('home', __name__, url_prefix='/home')

@bp.route('/')
def home():
    return render_template('home.html')
     