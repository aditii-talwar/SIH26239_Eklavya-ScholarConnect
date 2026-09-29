from flask import Blueprint, request, jsonify
from models import get_db
from auth_utils import hash_password, verify_password, set_user_session

trainer_auth_bp = Blueprint('trainer_auth', __name__, url_prefix='/api/auth/trainers')

@trainer_auth_bp.route('/signup', methods=['POST'])
def trainer_signup():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    expertise_domain = data.get('expertise_domain', '').strip()
    institute_id = data.get('institute_id')

    if not name or not email or not password:
        return jsonify({'error': 'Trainer name, email, and password are required.'}), 400

    pwd_hash = hash_password(password)
    conn = get_db()
    cursor = conn.cursor()

    valid_institute_id = None
    if institute_id:
        try:
            inst_num = int(institute_id)
            cursor.execute("SELECT id FROM mota_admins WHERE id = ?", (inst_num,))
            if cursor.fetchone():
                valid_institute_id = inst_num
        except (ValueError, TypeError):
            valid_institute_id = None

    try:
        cursor.execute("SELECT id, name, password_hash FROM scrutiny_officers WHERE LOWER(email) = LOWER(?)", (email,))
        existing = cursor.fetchone()
        if existing:
            if not verify_password(existing['password_hash'], password):
                return jsonify({'error': 'A Scrutiny Officer account with this email already exists. Please sign in with your password.'}), 409
            trainer_id = existing['id']
            cursor.execute(
                """
                UPDATE scrutiny_officers
                SET name = COALESCE(NULLIF(?, ''), name), institute_id = COALESCE(?, institute_id), expertise_domain = COALESCE(NULLIF(?, ''), expertise_domain)
                WHERE id = ?
                """,
                (name, valid_institute_id, expertise_domain, trainer_id)
            )
            conn.commit()
            set_user_session(trainer_id, 'academician', email, name or existing['name'])
            return jsonify({
                'message': 'Scrutiny Officer logged in successfully!',
                'user': {'id': trainer_id, 'name': name or existing['name'], 'email': email, 'role': 'academician'}
            }), 200

        cursor.execute(
            "INSERT INTO scrutiny_officers (name, email, password_hash, institute_id, expertise_domain) VALUES (?, ?, ?, ?, ?)",
            (name, email, pwd_hash, valid_institute_id, expertise_domain)
        )
        conn.commit()
        trainer_id = cursor.lastrowid
        set_user_session(trainer_id, 'academician', email, name)
        return jsonify({
            'message': 'Scrutiny Officer registered successfully!',
            'user': {'id': trainer_id, 'name': name, 'email': email, 'role': 'academician'}
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Scrutiny Officer registration failed: {str(e)}'}), 500
    finally:
        conn.close()

@trainer_auth_bp.route('/login', methods=['POST'])
def trainer_login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scrutiny_officers WHERE LOWER(email) = LOWER(?)", (email,))
    trainer = cursor.fetchone()
    conn.close()

    if not trainer or not verify_password(trainer['password_hash'], password):
        return jsonify({'error': 'Invalid Scrutiny Officer email or password.'}), 401

    set_user_session(trainer['id'], 'academician', trainer['email'], trainer['name'])
    return jsonify({
        'message': f"Welcome back, {trainer['name']}!",
        'user': {'id': trainer['id'], 'name': trainer['name'], 'email': trainer['email'], 'role': 'academician'}
    }), 200
