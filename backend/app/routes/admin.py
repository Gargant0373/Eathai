from datetime import datetime
from flask import Blueprint, jsonify
from app import db
from flask import request
from app.utils.token_service import token_required
from app.utils.email_service import send_food_email

admin_blueprint = Blueprint('admin', __name__)

@admin_blueprint.route('/approve/<int:user_id>', methods=['POST'])
def approve_user(user_id):
    from app.models import User
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.is_approved = True
    db.session.commit()

    return jsonify({"message": f"User {user.email} approved successfully."}), 200

@admin_blueprint.route('/pending-registrations', methods=['GET'])
@token_required
def pending_registrations():
    from app.models import User
    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    pending_users = User.query.filter_by(is_approved=False).all()
    pending_list = [{"id": user.id, "email": user.email} for user in pending_users]
    return jsonify({"pending_users": pending_list}), 200

@admin_blueprint.route('/food', methods=['POST'])
@token_required
def add_food():
    from app.models import Food
    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    data = request.json
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    quantity = data.get('quantity')
    available_date = data.get('available_date')

    if not (name and description and price and quantity and available_date):
        return jsonify({"error": "All fields are required"}), 400

    food = Food(
        name=name,
        description=description,
        price=price,
        quantity_available=quantity,
        available_date=available_date
    )
    db.session.add(food)
    db.session.commit()
    
    send_food_email(name, description, price, quantity, available_date)

    return jsonify({"message": "Food item added successfully", "food": food.name}), 201


@admin_blueprint.route('/food/<int:food_id>', methods=['DELETE'])
@token_required
def delete_food(food_id):
    from app.models import Food
    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    food = Food.query.get(food_id)
    if not food:
        return jsonify({"error": "Food item not found"}), 404

    db.session.delete(food)
    db.session.commit()

    return jsonify({"message": f"Food item {food.name} deleted successfully"}), 200

@admin_blueprint.route('/food', methods=['GET'])
@token_required
def get_all_food():
    from app.models import Food
    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    all_food = Food.query.all()
    food_list = [
        {
            "id": food.id,
            "name": food.name,
            "description": food.description,
            "price": food.price,
            "quantity_available": food.quantity_available,
            "available_date": food.available_date,
            "registration_closing": food.registration_closing
        } for food in all_food
    ]

    return jsonify({"all_food": food_list}), 200

@admin_blueprint.route('/user', methods=['GET'])
@token_required
def get_user():
    from app.models import User
    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    user_id = request.user['user_id']
    
    if not user_id:
        return jsonify({"error": "User not found"}), 404
    
    user = User.query.get(request.user['user_id'])
    return jsonify({"user": user.email}), 200

@admin_blueprint.route('/available-food', methods=['GET'])
@token_required
def get_available_food():
    from app.models import Food

    current_time = datetime.now().timestamp()
    available_food = Food.query.filter(
        Food.available_date >= current_time,
        (Food.registration_closing.is_(None) | (Food.registration_closing >= current_time))
    ).all()

    food_list = [
        {
            "id": food.id,
            "name": food.name,
            "description": food.description,
            "price": food.price,
            "quantity_available": food.quantity_available,
            "available_date": food.available_date,
            "registration_closing": food.registration_closing
        } for food in available_food
    ]

    return jsonify({"available_food": food_list}), 200