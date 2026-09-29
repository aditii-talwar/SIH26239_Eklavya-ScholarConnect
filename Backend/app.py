import os
from pathlib import Path
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from models import init_db

# Import MoTA ScholarConnect (SIH26239) Blueprints
from blueprints.auth_routes import auth_bp
from blueprints.student_routes import student_bp
from blueprints.academician_routes import academician_bp
from blueprints.institute_routes import institute_bp
from blueprints.informant_routes import informant_bp, ensure_mota_guidelines_seeded

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, supports_credentials=True, origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:5174",
        "http://192.168.29.194:5173"
    ])

    # Initialize the SQLite tables and ensure default seed data exists
    init_db()
    ensure_mota_guidelines_seeded()
    try:
        from seed_data import seed
        seed()
    except Exception as e:
        print(f"[Seed Warning] Auto-seeding skipped: {e}")

    # Register MoTA ScholarConnect Auth & Stakeholder Portal Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(academician_bp)
    app.register_blueprint(institute_bp)
    app.register_blueprint(informant_bp)

    # Serve React frontend build in production
    frontend_dist = Path(__file__).resolve().parent.parent / "Frontend" / "dist"

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path == "api" or path.startswith("api/"):
            return jsonify({
                "error": f"API endpoint '/{path}' not found.",
                "available_informant_endpoints": [
                    "/api/informant/guidelines?lang=en|hi|sat|or|mr|bn|gu|te|ta",
                    "/api/informant/bhashini/translate",
                    "/api/informant/bhashini/tts",
                    "/api/informant/guidelines/scan-pdf",
                    "/api/informant/vision/scan-document",
                    "/api/informant/student-progress (alias: /api/informant/progress)",
                    "/api/informant/ino-chats (alias: /api/informant/ino-convo)",
                    "/api/informant/ino-chats/<id>/message (alias: /api/informant/ino-convo/reply)",
                    "/api/informant/ino-chats/<id>/resolve (alias: /api/informant/ino-convo/resolve)"
                ]
            }), 404
        if path != "" and frontend_dist.exists() and (frontend_dist / path).exists():
            return send_from_directory(str(frontend_dist), path)
        elif frontend_dist.exists() and (frontend_dist / "index.html").exists():
            return send_from_directory(str(frontend_dist), "index.html")
        else:
            return jsonify({
                'name': 'MoTA ScholarConnect API (SIH26239)',
                'status': 'online',
                'endpoints': {
                    'health': '/api/health',
                    'auth': '/api/auth',
                    'st_applicant': '/api/student',
                    'level1_ino': '/api/academician',
                    'mota_admin': '/api/institute',
                    'informant': '/api/informant/guidelines'
                }
            }), 200

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'MoTA ScholarConnect Backend (SIH26239) is live!', 
            'database_path': app.config['DATABASE_PATH'],
            'author': 'Adi'
        }), 200

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    print(f"Server starting on http://127.0.0.1:{port} (debug={debug_mode})")
    app.run(host='127.0.0.1', port=port, debug=debug_mode)