from app.models import User
from app import db

def test_register_user(client):
    response = client.post('/auth/register', json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 201
    assert response.json["message"] == "Registration requested successfully. Await approval."

def test_register_duplicate_user(client):
    client.post('/auth/register', json={
        "email": "test@example.com",
        "password": "password123"
    })
    response = client.post('/auth/register', json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 400
    assert response.json["error"] == "User already exists"
    
def test_login_success(client, app):
    with app.app_context():
        from app.models import User
        user = User(email="testuser@example.com", password="testpassword")
        user.is_approved = True
        db.session.add(user)
        db.session.commit()

    response = client.post('/auth/login', json={
        "email": "testuser@example.com",
        "password": "testpassword"
    })

    assert response.status_code == 200
    assert response.json["message"] == "Login successful!"


def test_login_unapproved_user(client, app):
    with app.app_context():
        from app.models import User
        user = User(email="unapproved@example.com", password="testpassword")
        db.session.add(user)
        db.session.commit()

    response = client.post('/auth/login', json={
        "email": "unapproved@example.com",
        "password": "testpassword"
    })

    assert response.status_code == 403
    assert response.json["error"] == "User is not approved yet"


def test_login_invalid_password(client, app):
    with app.app_context():
        from app.models import User
        user = User(email="wrongpass@example.com", password="testpassword")
        user.is_approved = True
        db.session.add(user)
        db.session.commit()

    response = client.post('/auth/login', json={
        "email": "wrongpass@example.com",
        "password": "wrongpassword"
    })

    assert response.status_code == 401
    assert response.json["error"] == "Invalid password"


def test_login_nonexistent_user(client):
    response = client.post('/auth/login', json={
        "email": "nonexistent@example.com",
        "password": "testpassword"
    })

    assert response.status_code == 404
    assert response.json["error"] == "User does not exist"

def test_login_returns_token(client, app):
    with app.app_context():
        user = User(email="tokenuser@example.com", password="password", is_approved=True)
        db.session.add(user)
        db.session.commit()

    response = client.post('/auth/login', json={
        "email": "tokenuser@example.com",
        "password": "password"
    })

    assert response.status_code == 200
    assert "token" in response.json

