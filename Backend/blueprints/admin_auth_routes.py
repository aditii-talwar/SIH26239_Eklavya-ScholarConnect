from flask import Blueprint, request, jsonify
from models import get_db
from auth_utils import hash_password, verify_password, set_user_session

admin_auth_bp = Blueprint('admin_auth', __name__, url_prefix='/api/auth/admins')

@admin_auth_bp.route('/signup', methods=['POST'])
def admin_signup():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    nodal_contact = data.get('nodal_contact', '').strip()

    if not name or not email or not password:
        return jsonify({'error': 'MoTA Nodal Admin name, email, and password are required.'}), 400

    pwd_hash = hash_password(password)
    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id, name, password_hash FROM mota_admins WHERE LOWER(email) = LOWER(?)", (email,))
        existing = cursor.fetchone()
        if existing:
            if not verify_password(existing['password_hash'], password):
                return jsonify({'error': 'A MoTA Nodal Admin account with this email already exists. Please sign in with your password.'}), 409
            admin_id = existing['id']
            cursor.execute(
                "UPDATE mota_admins SET name = COALESCE(NULLIF(?, ''), name), nodal_contact = COALESCE(NULLIF(?, ''), nodal_contact) WHERE id = ?",
                (name, nodal_contact, admin_id)
            )
            conn.commit()
            set_user_session(admin_id, 'institute', email, name or existing['name'])
            return jsonify({
                'message': 'MoTA Nodal Admin logged in successfully!',
                'user': {'id': admin_id, 'name': name or existing['name'], 'email': email, 'role': 'institute'}
            }), 200

        cursor.execute(
            "INSERT INTO mota_admins (name, email, password_hash, nodal_contact) VALUES (?, ?, ?, ?)",
            (name, email, pwd_hash, nodal_contact)
        )
        conn.commit()
        admin_id = cursor.lastrowid
        set_user_session(admin_id, 'institute', email, name)
        return jsonify({
            'message': 'MoTA Nodal Admin registered successfully!',
            'user': {'id': admin_id, 'name': name, 'email': email, 'role': 'institute'}
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'MoTA Nodal Admin registration failed: {str(e)}'}), 500
    finally:
        conn.close()

@admin_auth_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM mota_admins WHERE LOWER(email) = LOWER(?)", (email,))
    admin = cursor.fetchone()
    conn.close()

    if not admin or not verify_password(admin['password_hash'], password):
        return jsonify({'error': 'Invalid admin email or password.'}), 401

    set_user_session(admin['id'], 'institute', admin['email'], admin['name'])
    return jsonify({
        'message': f"Welcome back, {admin['name']}!",
        'user': {'id': admin['id'], 'name': admin['name'], 'email': admin['email'], 'role': 'institute'}
    }), 200
