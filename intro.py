from flask import *

bp = Blueprint('intro', __name__, url_prefix='/intro')

@bp.route('/part-1')
def intro1():
    return render_template('intro-1.html')

@bp.route('/part-2')
def intro2():
    return render_template('intro-2.html')

@bp.route('/part-3')
def intro3():
    return render_template('intro-3.html')

@bp.route('/part-4')
def intro4():
    return render_template('intro-4.html')

@bp.route('/part-5')
def intro5():
    return render_template('intro-5.html')

@bp.route('/part-6')
def intro6():
    return render_template('intro-6.html')
     