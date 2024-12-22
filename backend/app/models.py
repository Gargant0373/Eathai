from datetime import datetime
from app import db, bcrypt

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_approved = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    email_confirmation = db.Column(db.Boolean, default=False)
    email_confirmation_code = db.Column(db.String(100), nullable=True)

    def __init__(self, email, password, is_admin=False, is_approved=False):
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        self.is_admin = is_admin
        self.is_approved = is_approved
        self.email_confirmation_code = bcrypt.generate_password_hash(email).decode()[:15]

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Food(db.Model):
    __tablename__ = 'food'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity_available = db.Column(db.Integer, nullable=True)
    available_date = db.Column(db.BigInteger, nullable=False)
    registration_closing = db.Column(db.BigInteger, nullable=True)

    def __repr__(self):
        return f"<Food {self.name} - {self.available_date}>"

class Order(db.Model):
    __tablename__ = 'order'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey('food.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='pending')
    timestamp = db.Column(db.BigInteger, default=datetime.now().timestamp())

    user = db.relationship('User', backref='orders')
    food = db.relationship('Food', backref='orders')

    def __repr__(self):
        return f"<Order {self.id} - {self.status}>"