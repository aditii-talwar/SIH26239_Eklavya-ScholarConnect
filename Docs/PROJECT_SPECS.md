# SIH26239 — Project Specification: MoTA ScholarConnect

## Project Title
**MoTA ScholarConnect** — Unified AI-Powered Scholarship & Fellowship Governance, Verification & Direct Benefit Transfer (DBT) Management System

## Organization & Ministry
- **Ministry:** Ministry of Tribal Affairs (MoTA), Government of India
- **Problem Statement ID:** SIH26239
- **Compliance Standards:** GIGW 3.0 (Guidelines for Indian Government Websites), UIDAI Aadhaar Data Vault Circulars, PFMS SNA SPARSH Just-In-Time DBT Mandate, NSP 2.0 One-Time Registration (OTR)

---

## Objective
Design and deploy a centralized, multilingual, AI-assisted national scholarship and fellowship governance portal for Scheduled Tribe (ST) students, Level-1 Institute Nodal Officers (INOs), and Ministry of Tribal Affairs (MoTA) Nodal Administrators. The platform eliminates manual verification delays, prevents duplicate cross-portal claims via SHA-256 Aadhaar tokenization, automates document scrutiny using Google Cloud Vision OCR, and enables real-time multilingual guidance in 12 Indian and Tribal languages via MeitY Bhashini.

---

## Technology Stack

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (GIGW 3.0 High-Contrast Light Theme — `#1E3A8A` Navy, `#2563EB` Royal Blue, `#D97706` Amber Gold, `#16A34A` Emerald Green)
- **Accessibility & Localization:** MeitY Bhashini ULCA NMT + Native Script & Phonetic Devanagari Voice Synthesis (`window.speechSynthesis`) across 12 languages (English, Hindi, Santali `Ol Chiki`, Gondi, Bhili, Ho, Mundari, Odia, Telugu, Marathi, Gujarati, Tamil)

### Backend
- **Framework:** Python 3 + Flask 3 (Modular Blueprint Architecture)
- **Production Server:** Gunicorn WSGI serving REST API (`/api/*`) and SPA static bundle (`Frontend/dist`)

### Database
- **Engine:** SQLite 3 with Foreign Key Enforcement (`PRAGMA foreign_keys = ON`)
- **Core Tables (16):** `st_applicants`, `mota_admins`, `scrutiny_officers`, `partner_universities`, `applicant_documents`, `scholarship_schemes`, `scheme_applications`, `eligibility_verifications`, `scheme_rule_configs`, `ai_scrutiny_cache`, `fellowship_disbursements`, `deficiency_communications`, `mota_guideline_schemes`, `guideline_pdf_updates`, `student_checklist_progress`, `ino_deficiency_chats`

### Digital Public Infrastructure (DPI) & AI Integrations
- **Google Cloud Vision API (`DOCUMENT_TEXT_DETECTION`):** Real Base64 PDF/Image OCR parsing for barcoded State e-District ST Caste Certificates, Revenue Officer Income Certificates, Marks Sheets, and Official MoTA Circular PDFs
- **UIDAI Aadhaar e-KYC & SHA-256 Data Vault:** 12-digit Verhoeff-validated Aadhaar OTP + FaceRD Biometric authentication, generating SHA-256 Vault Tokens (`ADV-SHA256-...`), 14-digit NSP 2.0 OTR IDs (`NSP-OTR-2026-...`), and NPCI Bank Mapper seeding checks
- **MeitY Bhashini (ULCA NMT + TTS):** Real-time translation and native Indian voice read-aloud

### Authentication & Security
- **Session Management:** Flask `HttpOnly` signed session cookies with Role-Based Access Control (`@role_required`)
- **Password Cryptography:** Werkzeug PBKDF2 / Scrypt password hashing with strict duplicate-account protection (`409 Conflict` on existing email signup attempts)

---

## 5 Central ST Schemes & Varying Statutory Income Criteria

| Scheme Code | Official MoTA Scheme Name | Target Group | Statutory Family Income Ceiling | Key Entitlements & DBT Mode |
| :--- | :--- | :--- | :--- | :--- |
| **`PRE_MATRIC`** | Pre-Matric Scholarship for ST Students | Classes IX & X (UDISE+ Schools) | **≤ ₹2.25 Lakh / Annum** | ₹3,500/yr (Day) · ₹7,000/yr (Hosteller) + Book Grant via State SNA SPARSH |
| **`POST_MATRIC`** | Post-Matric Scholarship for ST Students | Class XI–XII, Diploma, UG & PG | **≤ ₹2.50 Lakh / Annum** | 100% Non-Refundable Tuition + ₹1,200–₹4,000/mo Allowance (75:25 / 90:10 Split) |
| **`TOP_CLASS`** | Central Sector Scheme of Top Class Education | Premier IITs, IIMs, NITs, AIIMS, NLUs (250+ Institutes) | **≤ ₹4.50 Lakh / Annum** | Full Tuition + ₹86,000/yr Living + ₹45,000 Laptop + ₹3,000 Books via SNA SPARSH |
| **`NOS`** | National Overseas Scholarship for ST Candidates | Master's, Ph.D. & Post-Doc Abroad (Top-1000 QS) | **≤ ₹6.00 Lakh / Annum** | 100% Foreign Tuition + $15,400 USD / £9,900 GBP Maintenance + Airfare |
| **`NFST`** | National Fellowship for ST Students | M.Phil. & Ph.D. Scholars in India (750 Slots/Yr) | **No Income Ceiling (Open Merit)** | ₹37,000/mo (JRF) · ₹42,000/mo (SRF) + up to 27% HRA + ₹20,500/yr Contingency |

---

## End-to-End 8-Stage Digital Governance Workflow

```
Stage 1: NSP 2.0 OTR & UIDAI Aadhaar FaceRD e-KYC
        ↓
Stage 2: Scheme Selection & Varying Income Pre-Check
        ↓
Stage 3: DigiLocker / State e-District Certificate Upload (Base64 PDF/Image)
        ↓
Stage 4: Google Cloud Vision OCR & Statutory Rule Engine Audit
        ↓
Stage 5: Level-1 Institute Nodal Officer (INO) Scrutiny & Auto-Opened Deficiency Chat
        ↓
Stage 6: Level-2 State Nodal & SHA-256 Cross-Portal Deduplication
        ↓
Stage 7: Digital Sanction Order & Merit List Generation
        ↓
Stage 8: PFMS SNA SPARSH Just-In-Time Direct Bank Transfer (NPCI APB)
```