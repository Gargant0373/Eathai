import jwt
from datetime import datetime, timedelta
from flask import current_app

def generate_token(user_id, is_admin):
    """Generate a JWT token."""
    payload = {
        "user_id": user_id,
        "is_admin": is_admin,
        "exp": datetime.now() + timedelta(hours=1)
    }
    token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
    return token

def verify_token(token):
    """Verify and decode a JWT token."""
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}
    
from functools import wraps
from flask import request, jsonify
from app.utils.token_service import verify_token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing"}), 401

        token = token.split(" ")[1]
        decoded = verify_token(token)
        if "error" in decoded:
            return jsonify(decoded), 401

        request.user = decoded
        return f(*args, **kwargs)
    return decorated

