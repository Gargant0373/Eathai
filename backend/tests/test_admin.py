from datetime import datetime
from app.models import User, Food
from app import db
from app.utils.token_service import generate_token

def test_approve_user(client, app):
    with app.app_context():
        client.post('/auth/register', json={
           "email": "user1@example.com",
            "password": "password123"
        })
    
        from app.models import User
        user = User.query.filter_by(email="user1@example.com").first()
    
        response = client.post(f'/admin/approve/{user.id}')
        assert response.status_code == 200
        assert response.json["message"] == f"User {user.email} approved successfully."

def test_approve_nonexistent_user(client):
    response = client.post('/admin/approve/999')
    assert response.status_code == 404
    assert response.json["error"] == "User not found"

from app.utils.token_service import generate_token

def test_pending_registrations_success(client, app):
    with app.app_context():
        admin = User(email="admin@example.com", password="adminpass", is_admin=True, is_approved=True)
        user1 = User(email="pending1@example.com", password="password")
        user2 = User(email="pending2@example.com", password="password")
        db.session.add_all([admin, user1, user2])
        db.session.commit()

        token = generate_token(admin.id, admin.is_admin)

    response = client.get('/admin/pending-registrations', headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json["pending_users"]) == 2
    assert response.json["pending_users"][0]["email"] == "pending1@example.com"
    
def test_pending_registrations_no_admin_access(client, app):
    with app.app_context():
        user = User(email="regular@example.com", password="password", is_admin=False, is_approved=True)
        db.session.add(user)
        db.session.commit()

        token = generate_token(user.id, user.is_admin)

    response = client.get('/admin/pending-registrations', headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403
    assert response.json["error"] == "Access forbidden"

def test_pending_registrations_protected(client, app):
    with app.app_context():
        admin = User(email="secureadmin@example.com", password="password", is_admin=True)
        db.session.add(admin)
        db.session.commit()

        token = generate_token(admin.id, admin.is_admin)

    response = client.get('/admin/pending-registrations', headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200

    response = client.get('/admin/pending-registrations')
    assert response.status_code == 401

def test_get_all_food_success(client, app):
    with app.app_context():
        admin = User(email="admin@example.com", password="adminpass", is_admin=True, is_approved=True)
        food1 = Food(name="Pizza", description="Cheese Pizza", price=10.0, quantity_available=5, available_date=1700000000000)
        food2 = Food(name="Burger", description="Beef Burger", price=8.5, quantity_available=10, available_date=1700000000000)
        db.session.add_all([admin, food1, food2])
        db.session.commit()

        token = generate_token(admin.id, admin.is_admin)

    response = client.get('/admin/food', headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json["all_food"]) == 2
    assert response.json["all_food"][0]["name"] == "Pizza"

def test_get_all_food_no_admin_access(client, app):
    with app.app_context():
        user = User(email="user@example.com", password="password", is_approved=True)
        db.session.add(user)
        db.session.commit()

        token = generate_token(user.id, user.is_admin)

    response = client.get('/admin/food', headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403
    assert response.json["error"] == "Access forbidden"
    
def test_get_available_food_success(client, app):
    with app.app_context():
        current_time = datetime.now().timestamp()
        admin = User(email="admin@example.com", password="adminpass", is_admin=True, is_approved=True)
        food1 = Food(name="Pizza", description="Cheese Pizza", price=10.0, quantity_available=5,
                     available_date=current_time - 1000, registration_closing=current_time + 1000)
        food2 = Food(name="Burger", description="Beef Burger", price=8.5, quantity_available=10,
                     available_date=current_time + 1000, registration_closing=current_time + 2000)
        db.session.add_all([admin, food1, food2])
        db.session.commit()

        token = generate_token(admin.id, admin.is_admin)

    response = client.get('/admin/available-food', headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json["available_food"]) == 1
    assert response.json["available_food"][0]["name"] == "Pizza"

def test_get_available_food_no_admin_access(client, app):
    with app.app_context():
        user = User(email="user@example.com", password="password", is_approved=True)
        db.session.add(user)
        db.session.commit()

        token = generate_token(user.id, user.is_admin)

    response = client.get('/admin/available-food', headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403
    assert response.json["error"] == "Access forbidden"