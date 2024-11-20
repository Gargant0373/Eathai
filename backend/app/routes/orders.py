from datetime import datetime
from flask import Blueprint, jsonify, request
from app.utils.token_service import token_required
from app import db

orders_blueprint = Blueprint('orders', __name__)

@orders_blueprint.route('/order', methods=['POST'])
@token_required
def place_order():
    from app.models import Order, Food
    user_id = request.user['user_id']
    data = request.json
    food_id = data.get('food_id')
    quantity = data.get('quantity')

    food = Food.query.get(food_id)
    
    timestamp = datetime.now().timestamp();
    
    if not food:
        return jsonify({"error": "Food item not found"}), 404

    if food.quantity_available and food.quantity_available < quantity:
        return jsonify({"error": "Insufficient quantity available"}), 400
    
    if food.registration_closing and food.registration_closing < timestamp:
        return jsonify({"error": "Registration date closed already"}), 400

    if food.quantity_available:
        food.quantity_available -= quantity
    order = Order(user_id=user_id, food_id=food_id, quantity=quantity)
    db.session.add(order)
    db.session.commit()

    return jsonify({"message": "Order placed successfully"}), 201

@orders_blueprint.route('/order/<int:order_id>', methods=['DELETE'])
@token_required
def cancel_order(order_id):
    from app.models import Order, Food
    user_id = request.user['user_id']
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()

    if not order:
        return jsonify({"error": "Order not found"}), 404

    if order.status != 'pending':
        return jsonify({"error": "Only pending orders can be canceled"}), 400

    food = Food.query.get(order.food_id)
    food.quantity_available += order.quantity

    db.session.delete(order)
    db.session.commit()

    return jsonify({"message": "Order canceled successfully"}), 200

@orders_blueprint.route('/orders', methods=['GET'])
@token_required
def get_user_orders():
    from app.models import Order, Food
    user_id = request.user['user_id']
    orders = Order.query.filter_by(user_id=user_id).all()

    order_list = [
        {
            "id": order.id,
            "food": {
                "id": order.food.id,
                "name": order.food.name,
                "description": order.food.description,
                "price": order.food.price,
            },
            "quantity": order.quantity,
            "status": order.status,
            "timestamp": order.timestamp
        } for order in orders
    ]

    return jsonify({"orders": order_list}), 200

@orders_blueprint.route('/admin/orders', methods=['GET'])
@token_required
def get_all_orders():
    from app.models import Order, Food, User
    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    orders = Order.query.all()
    order_list = [
        {
            "id": order.id,
            "user": {"id": order.user.id, "email": order.user.email},
            "food": {"id": order.food.id, "name": order.food.name},
            "quantity": order.quantity,
            "status": order.status,
            "timestamp": order.timestamp
        } for order in orders
    ]

    return jsonify({"orders": order_list}), 200

@orders_blueprint.route('/admin/orders/<int:order_id>', methods=['PATCH'])
@token_required
def update_order_status(order_id):
    from app.models import Order
    if not request.user['is_admin']:
        return jsonify({"error": "Access forbidden"}), 403

    data = request.json
    new_status = data.get('status')

    if new_status not in ['pending', 'confirmed', 'completed']:
        return jsonify({"error": "Invalid status"}), 400

    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    order.status = new_status
    db.session.commit()

    return jsonify({"message": "Order status updated successfully"}), 200
