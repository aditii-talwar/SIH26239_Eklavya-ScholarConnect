from flask import Blueprint, request, jsonify
from models import get_db
from auth_utils import hash_password, verify_password, set_user_session

trainee_auth_bp = Blueprint('trainee_auth', __name__, url_prefix='/api/auth/trainees')

@trainee_auth_bp.route('/signup', methods=['POST'])
def trainee_signup():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    college = data.get('college', '').strip() or data.get('organization', '').strip()
    skills = data.get('skills', '').strip()
    university_roll_no = data.get('university_roll_no', '').strip() or data.get('trainee_id', '').strip() or None
    institute_id = data.get('institute_id')
    desired_role = data.get('desired_role', 'Scientific Officer / Trainee').strip()

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required.'}), 400

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
        cursor.execute("SELECT id FROM st_applicants WHERE LOWER(email) = LOWER(?)", (email,))
        existing = cursor.fetchone()
        if existing:
            trainee_id = existing['id']
            cursor.execute(
                """
                UPDATE st_applicants
                SET name = ?, password_hash = ?, college = COALESCE(?, college), skills = COALESCE(?, skills),
                    university_roll_no = COALESCE(?, university_roll_no), institute_id = COALESCE(?, institute_id),
                    desired_role = COALESCE(?, desired_role)
                WHERE id = ?
                """,
                (name, pwd_hash, college, skills, university_roll_no, valid_institute_id, desired_role, trainee_id)
            )
            conn.commit()
            set_user_session(trainee_id, 'student', email, name)
            return jsonify({
                'message': 'Trainee logged in successfully!',
                'user': {
                    'id': trainee_id,
                    'name': name,
                    'email': email,
                    'role': 'student',
                    'university_roll_no': university_roll_no
                }
            }), 200

        cursor.execute(
            """
            INSERT INTO st_applicants (name, email, password_hash, college, skills, university_roll_no, institute_id, desired_role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (name, email, pwd_hash, college, skills, university_roll_no, valid_institute_id, desired_role)
        )
        conn.commit()
        trainee_id = cursor.lastrowid
        set_user_session(trainee_id, 'student', email, name)

        return jsonify({
            'message': 'Trainee registered and logged in successfully!',
            'user': {
                'id': trainee_id,
                'name': name,
                'email': email,
                'role': 'student',
                'university_roll_no': university_roll_no
            }
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Trainee registration failed: {str(e)}'}), 500
    finally:
        conn.close()

@trainee_auth_bp.route('/login', methods=['POST'])
def trainee_login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM st_applicants WHERE LOWER(email) = LOWER(?)", (email,))
    trainee = cursor.fetchone()
    conn.close()

    if not trainee or not verify_password(trainee['password_hash'], password):
        return jsonify({'error': 'Invalid trainee email or password.'}), 401

    set_user_session(trainee['id'], 'student', trainee['email'], trainee['name'])
    return jsonify({
        'message': f"Welcome back, {trainee['name']}!",
        'user': {
            'id': trainee['id'],
            'name': trainee['name'],
            'email': trainee['email'],
            'role': 'student'
        }
    }), 200
