from flask.cli import load_dotenv
import os

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///data.db'
    SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
