from app.models import User, Food
from app.utils.token_service import generate_token
from app import db

def test_add_food_success(client, app):
    with app.app_context():
        admin = User(email="admin@example.com", password="adminpass", is_admin=True, is_approved=True)
        db.session.add(admin)
        db.session.commit()
        
        token = generate_token(admin.id, admin.is_admin)

    response = client.post('/admin/food', json={
        "name": "Pasta",
        "description": "Delicious homemade pasta",
        "price": 10.5,
        "quantity": 20,
        "available_date": 1
    }, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 201
    assert response.json["message"] == "Food item added successfully"


def test_add_food_unauthorized(client, app):
    with app.app_context():
        user = User(email="user@example.com", password="password", is_approved=True)
        db.session.add(user)
        db.session.commit()

        token = generate_token(user.id, user.is_admin)

    response = client.post('/admin/food', json={
        "name": "Pasta",
        "description": "Delicious homemade pasta",
        "price": 10.5,
        "quantity": 20,
        "available_date": 1
    }, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 403
    assert response.json["error"] == "Access forbidden"
