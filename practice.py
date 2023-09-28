import functools
from flask import *

bp = Blueprint('practice', __name__, url_prefix='/practice')

@bp.route('/')
def practice():
    return render_template('practice.html')

@bp.route('/land-allocation')
def land_allocation():
    return render_template('land-allocation.html')

@bp.route('/feed-mix')
def feed_mix():
    return render_template('feed-mix.html')