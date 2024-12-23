from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
import os

db = SQLAlchemy()
bcrypt = Bcrypt()

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    
    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    api_prefix = '/api' if os.getenv('PRODUCTION') == 'True' else ''

    from app.routes.auth import auth_blueprint
    from app.routes.admin import admin_blueprint
    from app.routes.orders import orders_blueprint

    app.register_blueprint(auth_blueprint, url_prefix=f'{api_prefix}/auth')
    app.register_blueprint(admin_blueprint, url_prefix=f'{api_prefix}/admin')
    app.register_blueprint(orders_blueprint, url_prefix=f'{api_prefix}/orders')

    from app.models import User, Food, Order

    with app.app_context():
        db.create_all()

    return app
