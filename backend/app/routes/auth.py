from flask import Blueprint, request, jsonify
from app import db
from app.utils.token_service import generate_token

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    from app.models import User
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    is_first_user = User.query.first() is None

    is_admin = is_first_user and request.args.get('admin') == 'true'

    new_user = User(email=email, password=password, is_admin=is_admin, is_approved=is_admin)
    db.session.add(new_user)
    db.session.commit()

    if is_first_user and is_admin:
        message = "Registration successful. You are the first user and an admin."
    elif is_first_user:
        message = "Registration successful. You are the first user but not an admin."
    else:
        message = "Registration requested successfully. Await approval."

    return jsonify({"message": message}), 201

@auth_blueprint.route('/login', methods=['POST'])
def login():
    from app.models import User
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User does not exist"}), 404

    if not user.is_approved:
        return jsonify({"error": "User is not approved yet"}), 403

    if not user.check_password(password):
        return jsonify({"error": "Invalid password"}), 401

    token = generate_token(user.id, user.is_admin)
    return jsonify({"message": "Login successful!", "token": token}), 200

