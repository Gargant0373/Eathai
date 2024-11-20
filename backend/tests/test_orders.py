from datetime import datetime
from app.models import User, Food, Order
from app.utils.token_service import generate_token
from app import db

def test_place_order_success(client, app):
    with app.app_context():
        user = User(email="user@example.com", password="password", is_approved=True)
        food = Food(name="Pasta", description="Delicious pasta", price=10.0, quantity_available=10, available_date=1)
        db.session.add_all([user, food])
        db.session.commit()

        db.session.refresh(food)
        token = generate_token(user.id, user.is_admin)

    response = client.post('/orders/order', json={
        "food_id": food.id,
        "quantity": 2
    }, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 201
    assert response.json["message"] == "Order placed successfully"


def test_place_order_insufficient_quantity(client, app):
    with app.app_context():
        user = User(email="user@example.com", password="password", is_approved=True)
        food = Food(name="Pasta", description="Delicious pasta", price=10.0, quantity_available=1, available_date=1)
        db.session.add_all([user, food])
        db.session.commit()

        db.session.refresh(food)
        token = generate_token(user.id, user.is_admin)

    response = client.post('/orders/order', json={
        "food_id": food.id,
        "quantity": 5
    }, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 400
    assert response.json["error"] == "Insufficient quantity available"

def test_cancel_order_success(client, app):
    with app.app_context():
        user = User(email="user@example.com", password="password", is_approved=True)
        food = Food(name="Pasta", description="Delicious pasta", price=10.0, quantity_available=10, available_date=1)
        db.session.add_all([user, food])
        db.session.commit()
        db.session.refresh(user)
        db.session.refresh(food)
        order = Order(user_id=user.id, food_id=food.id, quantity=2)
        db.session.add(order)
        db.session.commit()

        db.session.refresh(order)
        token = generate_token(user.id, user.is_admin)

    response = client.delete(f'/orders/order/{order.id}', headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json["message"] == "Order canceled successfully"

def test_place_order_food_not_found(client, app):
    with app.app_context():
        user = User(email="user@example.com", password="password", is_approved=True)
        db.session.add(user)
        db.session.commit()
        
        db.session.refresh(user)
        token = generate_token(user.id, user.is_admin)

    response = client.post('/orders/order', json={
        "food_id": 999,
        "quantity": 1
    }, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 404
    assert response.json["error"] == "Food item not found"

import time

def test_place_order_registration_closed(client, app):
    with app.app_context():
        user = User(email="user@example.com", password="password", is_approved=True)
        
        food = Food(
            name="Pasta", description="Delicious pasta", price=10.0, quantity_available=10,
            available_date=1, registration_closing=datetime.now().timestamp() - 1000
        )
        db.session.add_all([user, food])
        db.session.commit()
        
        db.session.refresh(user)
        db.session.refresh(food)
        token = generate_token(user.id, user.is_admin)

    response = client.post('/orders/order', json={
        "food_id": food.id,
        "quantity": 2
    }, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 400
    assert response.json["error"] == "Registration date closed already"

def test_cancel_order_unauthorized_user(client, app):
    with app.app_context():
        user1 = User(email="user1@example.com", password="password", is_approved=True)
        user2 = User(email="user2@example.com", password="password", is_approved=True)
        food = Food(name="Pasta", description="Delicious pasta", price=10.0, quantity_available=10, available_date=1)
        
        db.session.add_all([user1, user2, food])
        db.session.commit()
        
        db.session.refresh(user1)
        db.session.refresh(user2)
        db.session.refresh(food)
        
        order = Order(user_id=user1.id, food_id=food.id, quantity=2)
        db.session.add(order)
        db.session.commit()
        db.session.refresh(order)
        
        token = generate_token(user2.id, user2.is_admin)

    response = client.delete(f'/orders/order/{order.id}', headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 404
    assert response.json["error"] == "Order not found"

def test_cancel_order_non_pending_status(client, app):
    with app.app_context():
        user = User(email="user@example.com", password="password", is_approved=True)
        food = Food(name="Pasta", description="Delicious pasta", price=10.0, quantity_available=10, available_date=1)

        db.session.add_all([user, food])
        db.session.commit()
        
        db.session.refresh(user)
        db.session.refresh(food)
        
        order = Order(user_id=user.id, food_id=food.id, quantity=2, status='confirmed')
        db.session.add(order)
        db.session.commit()
        db.session.refresh(order)
        
        token = generate_token(user.id, user.is_admin)

    response = client.delete(f'/orders/order/{order.id}', headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 400
    assert response.json["error"] == "Only pending orders can be canceled"
