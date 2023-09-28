from flask import *

bp = Blueprint('explore', __name__, url_prefix='/explore')

@bp.route('/')
def explore():
    return render_template('explore.html')