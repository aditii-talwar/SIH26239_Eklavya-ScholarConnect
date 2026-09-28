import json
from config import Config
from models import init_db, get_db
from auth_utils import hash_password


def seed():
    print("[Seed] Initializing MoTA Scholarship & Fellowship (SIH26239) database tables...")
    init_db()

    conn = get_db()
    cursor = conn.cursor()
    default_pw = hash_password("Password123!")

    # 1. Seed MoTA Ministry Administrator
    cursor.execute(
        """
        INSERT OR IGNORE INTO mota_admins (name, email, password_hash, admin_tpo_contact)
        VALUES (?, ?, ?, ?)
        """,
        ("Ministry of Tribal Affairs (MoTA) — Scholarship & Fellowship Division", "admin@mota.gov.in", default_pw, "+91-11-23389888 (MoTA Nodal Cell)")
    )
    cursor.execute("SELECT id FROM mota_admins WHERE email = 'admin@mota.gov.in'")
    inst_id = cursor.fetchone()["id"]

    # 2. Seed Nodal Scrutiny & Screening Officer
    cursor.execute(
        """
        INSERT OR IGNORE INTO scrutiny_officers (name, email, password_hash, institute_id, expertise_domain)
        VALUES (?, ?, ?, ?, ?)
        """,
        ("Dr. Rajeshwar Meena (Nodal Scrutiny Officer)", "scrutiny@mota.gov.in", default_pw, inst_id, "NFST & NOS Eligibility & Document Scrutiny")
    )
    cursor.execute("SELECT id FROM scrutiny_officers WHERE email = 'scrutiny@mota.gov.in'")
    acad_id = cursor.fetchone()["id"]

    # 3. Seed Empaneled University / Division
    cursor.execute(
        """
        INSERT OR IGNORE INTO partner_universities (company_name, email, password_hash)
        VALUES (?, ?, ?)
        """,
        ("Ministry of Tribal Affairs — National Fellowship & Overseas Cell", "fellowship@mota.gov.in", default_pw)
    )
    cursor.execute("SELECT id FROM partner_universities WHERE email = 'fellowship@mota.gov.in'")
    ind_id = cursor.fetchone()["id"]

    # 4. Seed Verified ST Applicant (Kareena)
    cursor.execute(
        """
        INSERT OR IGNORE INTO st_applicants (
            name, email, password_hash, college, skills,
            github_url, university_roll_no, verification_status, verified_at, institute_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'verified', CURRENT_TIMESTAMP, ?)
        """,
        (
            "Kareena Murmu", "applicant@mota.gov.in", default_pw,
            "Indian Institute of Technology (IIT) Delhi",
            "ST Caste Certificate, Income Certificate, PG Marksheet, Research Proposal",
            "https://tribal.nic.in", "MOTA-NFST-2026-1042", inst_id
        )
    )
    cursor.execute("SELECT id FROM st_applicants WHERE email = 'applicant@mota.gov.in'")
    student_id = cursor.fetchone()["id"]

    cursor.execute(
        "INSERT OR IGNORE INTO eligibility_verifications (student_id, skill_name, percentage) VALUES (?, ?, ?)",
        (student_id, "ST Caste Certificate (OCR)", 98.0)
    )
    cursor.execute(
        "INSERT OR IGNORE INTO eligibility_verifications (student_id, skill_name, percentage) VALUES (?, ?, ?)",
        (student_id, "Income & Academic Eligibility", 94.0)
    )

    # 4b. Seed ST Applicant Dhyana
    cursor.execute(
        """
        INSERT INTO st_applicants (
            name, email, password_hash, college, skills,
            github_url, university_roll_no, verification_status, verified_at, institute_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'verified', CURRENT_TIMESTAMP, ?)
        ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash
        """,
        (
            "Dhyana Oraon", "dhyana.mayur7e@gmail.com", default_pw,
            "Jawaharlal Nehru University (JNU) New Delhi",
            "ST Caste Certificate, Income Certificate, Unconditional Offer Letter",
            "https://tribal.nic.in", "MOTA-NOS-2026-2089", inst_id
        )
    )

    # 4c. Seed ST Applicant Aditi
    cursor.execute(
        """
        INSERT INTO st_applicants (
            name, email, password_hash, college, skills,
            github_url, university_roll_no, verification_status, verified_at, institute_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'verified', CURRENT_TIMESTAMP, ?)
        ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash
        """,
        (
            "Aditi Kisku", "aditi.talwar3@gmail.com", default_pw,
            "Indian Institute of Science (IISc) Bengaluru",
            "ST Caste Certificate, Income Certificate, Research Proposal, NET-JRF",
            "https://tribal.nic.in", "MOTA-NFST-2026-1108", inst_id
        )
    )

    # 5. Seed MoTA Scholarship & Fellowship Schemes
    cursor.execute(
        """
        INSERT OR IGNORE INTO scholarship_schemes (industry_id, title, description, required_skills, posting_type)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            ind_id,
            "National Fellowship for Scheduled Tribes (NFST) — Ph.D. / M.Phil. in India",
            "Provides 750 fellowships annually to Scheduled Tribe students pursuing M.Phil. and Ph.D. in Indian Universities (₹37,000/month JRF & ₹42,000/month SRF + HRA + Contingency).",
            "ST Caste Certificate, PG Marks >= 55%, Research Proposal, Age <= 35 Yrs",
            "nfst_fellowship"
        )
    )
    cursor.execute("SELECT id FROM scholarship_schemes WHERE title LIKE 'National Fellowship for Scheduled Tribes%'")
    job_id = cursor.fetchone()["id"]

    cursor.execute(
        """
        INSERT OR IGNORE INTO scholarship_schemes (academician_id, title, description, required_skills, posting_type)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            acad_id,
            "National Overseas Scholarship (NOS) for ST Candidates — Master's & Ph.D. Abroad",
            "Financial assistance to meritorious Scheduled Tribe students for pursuing Master's and Ph.D. at Top-1000 QS/THE accredited foreign universities (Full Tuition + $15,400/yr Maintenance + Airfare).",
            "ST Caste Certificate, Family Income <= 6.0 LPA, Top-1000 Foreign Univ Offer, Marks >= 60%",
            "nos_overseas"
        )
    )

    # 6. Seed Scheme Application
    cursor.execute(
        "INSERT OR IGNORE INTO scheme_applications (student_id, posting_id, status) VALUES (?, ?, 'shortlisted')",
        (student_id, job_id)
    )

    # 7. Seed Deficiency / Scrutiny Communication
    cursor.execute(
        """
        INSERT OR IGNORE INTO deficiency_communications (student_id, academician_id, feedback_text)
        VALUES (?, ?, ?)
        """,
        (student_id, acad_id, "AI OCR & Nodal Scrutiny Complete: ST Caste Certificate (98% confidence) and Income Certificate verified. Application cleared for Merit Selection Committee.")
    )

    # 8. Seed AI Scrutiny Cache & Fellowship Disbursement Schedule
    cursor.execute(
        """
        INSERT OR IGNORE INTO ai_scrutiny_cache (student_id, posting_id, fit_score, gap_analysis_text)
        VALUES (?, ?, ?, ?)
        """,
        (
            student_id, job_id, 96.0,
            "AI Document Intelligence verified ST Certificate barcode, PG CGPA (8.7/10 >= 55% threshold), and Ph.D. Research Proposal. Zero deficiencies detected."
        )
    )

    disbursement_sample = json.dumps([
        {"title": "Quarter 1 JRF Stipend + Contingency Release", "platform": "PFMS / DBT Portal", "difficulty": "Disbursed"},
        {"title": "Quarter 2 Continuation & HRA Verification", "platform": "MoTA Fellowship Cell", "difficulty": "Scheduled"}
    ])
    cursor.execute(
        """
        INSERT OR IGNORE INTO fellowship_disbursements (student_id, posting_id, recommended_courses)
        VALUES (?, ?, ?)
        """,
        (student_id, job_id, disbursement_sample)
    )

    conn.commit()
    conn.close()
    print("[Seed] MoTA Scholarship & Fellowship (SIH26239) database seeded successfully!")


if __name__ == "__main__":
    seed()