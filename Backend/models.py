import sqlite3
from config import Config


def get_db():
    """Opens a new database connection with Row factory and Foreign Key enforcement."""
    conn = sqlite3.connect(Config.DATABASE_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def _ensure_column(cursor, table_name: str, col_name: str, col_def: str):
    """Safely adds a column to an existing SQLite table if it does not already exist."""
    cursor.execute(f"PRAGMA table_info({table_name})")
    existing_cols = {row[1] for row in cursor.fetchall()}
    if col_name not in existing_cols:
        cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_def}")


def init_db():
    """Creates all 16 MoTA Scholarship & Fellowship (SIH26239) tables if they do not already exist."""
    conn = get_db()
    cursor = conn.cursor()

    # =========================================================================
    # 1. CORE STAKEHOLDER TABLES (ST Applicants, Scrutiny Officers, MoTA Admins)
    # =========================================================================

    # 1. ST_APPLICANTS (Scheduled Tribe Scholarship & Fellowship Beneficiaries)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS st_applicants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        college TEXT,
        skills TEXT DEFAULT '',
        nsp_otr_id TEXT,
        aadhaar_vault_token TEXT,
        npci_seeded_bank TEXT,
        digilocker_url TEXT,
        dossier_url TEXT,
        prior_experience TEXT,
        desired_role TEXT DEFAULT 'Post-Matric ST Scholarship',
        resume_score REAL DEFAULT 0.0,
        resume_review TEXT,
        resume_text TEXT,
        university_roll_no TEXT,
        verification_status TEXT DEFAULT 'unverified',
        verified_at TIMESTAMP,
        institute_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (institute_id) REFERENCES mota_admins(id) ON DELETE SET NULL
    );
    """)

    for col_name, col_def in [
        ("nsp_otr_id", "TEXT"),
        ("aadhaar_vault_token", "TEXT"),
        ("npci_seeded_bank", "TEXT"),
        ("digilocker_url", "TEXT"),
        ("dossier_url", "TEXT"),
        ("prior_experience", "TEXT"),
        ("desired_role", "TEXT DEFAULT 'Post-Matric ST Scholarship'"),
        ("resume_score", "REAL DEFAULT 0.0"),
        ("resume_review", "TEXT"),
        ("resume_text", "TEXT"),
    ]:
        _ensure_column(cursor, "st_applicants", col_name, col_def)

    # 2. PARTNER_UNIVERSITIES (Empaneled Universities & MoTA Fellowship Divisions)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS partner_universities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        aishe_code TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    _ensure_column(cursor, "partner_universities", "aishe_code", "TEXT")

    # 3. MOTA_ADMINS (Ministry of Tribal Affairs Administrators & State Nodal Cells)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mota_admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        aishe_code TEXT,
        nodal_contact TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    _ensure_column(cursor, "mota_admins", "nodal_contact", "TEXT")

    # 4. SCRUTINY_OFFICERS (Level-1 Institute Nodal Officers / INO Scrutiny Committee)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scrutiny_officers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        institute_id INTEGER,
        expertise_domain TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (institute_id) REFERENCES mota_admins(id) ON DELETE SET NULL
    );
    """)

    # =========================================================================
    # 2. DOCUMENTS, SCHEMES, APPLICATIONS & AI VERIFICATION TABLES
    # =========================================================================

    # 5. APPLICANT_DOCUMENTS (ST Caste Certificate, Income Certificate, Marksheets, Research Proposal, Offer Letter)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applicant_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        document_type TEXT NOT NULL,
        file_url TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES st_applicants(id) ON DELETE CASCADE
    );
    """)

    # 6. SCHOLARSHIP_SCHEMES (NFST, NOS, Top Class Education, Post-Matric & Pre-Matric Scholarship Schemes)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scholarship_schemes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        industry_id INTEGER,
        academician_id INTEGER,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        required_skills TEXT NOT NULL,
        posting_type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (industry_id) REFERENCES partner_universities(id) ON DELETE CASCADE,
        FOREIGN KEY (academician_id) REFERENCES scrutiny_officers(id) ON DELETE CASCADE
    );
    """)

    # 7. SCHEME_APPLICATIONS (Applicant Scheme Submissions & Multi-Stage Workflow Status)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scheme_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        posting_id INTEGER NOT NULL,
        status TEXT DEFAULT 'applied',
        applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, posting_id),
        FOREIGN KEY (student_id) REFERENCES st_applicants(id) ON DELETE CASCADE,
        FOREIGN KEY (posting_id) REFERENCES scholarship_schemes(id) ON DELETE CASCADE
    );
    """)

    # 8. ELIGIBILITY_VERIFICATIONS (Automated Rule & AI Document Verification Scores)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS eligibility_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        skill_name TEXT NOT NULL,
        percentage REAL NOT NULL,
        assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES st_applicants(id) ON DELETE CASCADE
    );
    """)

    # 9. SCHEME_RULE_CONFIGS (Statutory Scheme-Specific Eligibility & Screening Rules)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scheme_rule_configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        skill_name TEXT NOT NULL,
        question_text TEXT NOT NULL,
        options TEXT,
        correct_answer TEXT,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct_option TEXT
    );
    """)
    _ensure_column(cursor, "scheme_rule_configs", "options", "TEXT")
    _ensure_column(cursor, "scheme_rule_configs", "correct_answer", "TEXT")

    # =========================================================================
    # 3. AI SCRUTINY, FELLOWSHIP DISBURSEMENT & DEFICIENCY COMMUNICATION TABLES
    # =========================================================================

    # 10. AI_SCRUTINY_CACHE (Google Vision OCR & Statutory Eligibility Verification Cache)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_scrutiny_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        posting_id INTEGER NOT NULL,
        fit_score REAL DEFAULT 0.0,
        gap_analysis_text TEXT NOT NULL,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, posting_id),
        FOREIGN KEY (student_id) REFERENCES st_applicants(id) ON DELETE CASCADE,
        FOREIGN KEY (posting_id) REFERENCES scholarship_schemes(id) ON DELETE CASCADE
    );
    """)

    # 11. FELLOWSHIP_DISBURSEMENTS (PFMS SNA SPARSH Fellowship Tranches & Continuation Roadmaps)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fellowship_disbursements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        posting_id INTEGER,
        recommended_courses TEXT NOT NULL,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, posting_id),
        FOREIGN KEY (student_id) REFERENCES st_applicants(id) ON DELETE CASCADE,
        FOREIGN KEY (posting_id) REFERENCES scholarship_schemes(id) ON DELETE CASCADE
    );
    """)

    # 12. DEFICIENCY_COMMUNICATIONS (Level-1 INO Deficiency Memos & Official Scrutiny Remarks)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS deficiency_communications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        academician_id INTEGER,
        industry_id INTEGER,
        feedback_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES st_applicants(id) ON DELETE CASCADE,
        FOREIGN KEY (academician_id) REFERENCES scrutiny_officers(id) ON DELETE SET NULL,
        FOREIGN KEY (industry_id) REFERENCES partner_universities(id) ON DELETE SET NULL
    );
    """)

    # 13. MOTA_GUIDELINE_SCHEMES (Dynamic Scholarship-Specific & General Checklists from tribal.nic.in & dbttribal.gov.in)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mota_guideline_schemes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scheme_code TEXT UNIQUE NOT NULL,
        scheme_name TEXT NOT NULL,
        category TEXT NOT NULL,
        source_url TEXT NOT NULL,
        version_tag TEXT DEFAULT 'FY 2025-26 v1.0',
        income_ceiling_lakhs REAL DEFAULT 2.50,
        min_marks_percent REAL DEFAULT 50.0,
        age_limit_years INTEGER DEFAULT 35,
        stipend_summary TEXT NOT NULL,
        dbt_mode TEXT NOT NULL,
        checklist_json TEXT NOT NULL,
        general_info_json TEXT NOT NULL,
        last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 14. GUIDELINE_PDF_UPDATES (Audit Trail of Google Vision PDF Scans & Diff Comparisons)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS guideline_pdf_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scheme_code TEXT NOT NULL,
        pdf_title TEXT NOT NULL,
        circular_ref TEXT,
        vision_confidence REAL DEFAULT 99.2,
        extracted_summary TEXT NOT NULL,
        changes_detected_json TEXT NOT NULL,
        scanned_by TEXT DEFAULT 'Google Cloud Vision API (DOCUMENT_TEXT_DETECTION)',
        scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 15. STUDENT_CHECKLIST_PROGRESS (Per-Student Scholarship-Specific Step & Checklist Tracker)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_checklist_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        scheme_code TEXT NOT NULL,
        current_step INTEGER DEFAULT 1,
        completed_steps_json TEXT DEFAULT '[]',
        document_scans_json TEXT DEFAULT '{}',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, scheme_code),
        FOREIGN KEY (student_id) REFERENCES st_applicants(id) ON DELETE CASCADE
    );
    """)

    # 16. INO_DEFICIENCY_CHATS (Two-Way Conversation Threads Opened Automatically on Document Rejection)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ino_deficiency_chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        student_name TEXT NOT NULL,
        scheme_code TEXT NOT NULL,
        document_type TEXT NOT NULL,
        stage_number INTEGER DEFAULT 5,
        stage_name TEXT DEFAULT 'Level-1 INO Scrutiny',
        rejection_reason TEXT NOT NULL,
        ino_officer_name TEXT DEFAULT 'Dr. Rajeshwar Meena (Level-1 INO)',
        status TEXT DEFAULT 'open',
        messages_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES st_applicants(id) ON DELETE CASCADE
    );
    """)

    conn.commit()
    conn.close()
    print("[Database] All 16 MoTA Scholarship & Fellowship (SIH26239) tables initialized successfully!")


if __name__ == "__main__":
    init_db()