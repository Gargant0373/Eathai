from flask import Blueprint, request, jsonify
from app import db
from app.utils.token_service import generate_token, token_required
from app.utils.email_service import send_registration_email, send_user_email
from uuid import uuid4

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    from app.models import User
    data = request.json
    email = data.get('email')
    password = data.get('password')
    url = data.get('url')
    print(url)
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    is_first_user = User.query.first() is None

    is_admin = request.args.get('admin') == 'true'

    new_user = User(email=email, password=password, is_admin=is_admin, is_approved=is_admin)
    db.session.add(new_user)
    db.session.commit()

    if is_first_user and is_admin:
        message = "Registration successful. You are the first user and an admin."
    else:
        message = "Registration requested successfully. Await approval."

    send_registration_email(email, new_user.email_confirmation_code, url)

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

@auth_blueprint.route('/users/unverified', methods=['GET'])
@token_required
def get_unverified_users():
    """Get all unverified users."""
    from app.models import User

    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    unverified_users = User.query.filter_by(is_approved=False).all()
    users_data = [{"id": user.id, "email": user.email} for user in unverified_users]

    return jsonify({"unverified_users": users_data}), 200

@auth_blueprint.route('/verify', methods=['POST'])
def verify_user_email():
    from app.models import User
    code = request.args.get('code')
    email = request.args.get('email')
    user = User.query.filter_by(email=email, email_confirmation_code=code).first()
    
    if not user:
        return "Invalid confirmation code", 400

    user.email_confirmation = True
    db.session.commit()

    return "User verified successfully", 200

@auth_blueprint.route('/users/<int:user_id>/verify', methods=['PATCH'])
@token_required
def verify_user(user_id):
    """Verify (approve) a user."""
    from app.models import User

    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.is_approved = True
    db.session.commit()

    send_user_email(user.email, "Congratulations! Your registration has been approved.")

    return jsonify({"message": f"User with ID {user_id} has been approved."}), 200


@auth_blueprint.route('/users/<int:user_id>/make-admin', methods=['PATCH'])
@token_required
def make_user_admin(user_id):
    """Make a user an admin."""
    from app.models import User

    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.is_admin = True
    db.session.commit()

    send_user_email(user.email, "Congratulations! You are now an admin.")
    return jsonify({"message": f"User with ID {user_id} is now an admin."}), 200


@auth_blueprint.route('/users/<int:user_id>', methods=['DELETE'])
@token_required
def delete_user(user_id):
    """Delete a user."""
    from app.models import User

    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    send_user_email(user.email, "Your account has been deleted.")
    return jsonify({"message": f"User with ID {user_id} has been deleted."}), 200

@auth_blueprint.route('/users', methods=['GET'])
@token_required
def get_all_users():
    """Get all users with pagination (Admin only)."""
    from app.models import User

    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    try:
        page = int(request.args.get('page', 1)) 
        per_page = 10  

        users_query = User.query.order_by(User.is_approved.asc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        users = users_query.items

        users_data = [
            {
                "id": user.id,
                "email": user.email,
                "is_approved": user.is_approved,
                "is_admin": user.is_admin
            } for user in users
        ]

        return jsonify({
            "users": users_data,
            "total": users_query.total,
            "page": users_query.page,
            "pages": users_query.pages
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500