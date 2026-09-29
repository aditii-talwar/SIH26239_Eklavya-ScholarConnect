# Eklavya ScholarConnect — MoTA Scholarship & Fellowship Portal (SIH26239)

**AI-Enabled Scholarship & Fellowship Management System for Scheduled Tribes (ST)** under the **Ministry of Tribal Affairs (MoTA), Government of India** (`tribal.nic.in` · `dbttribal.gov.in`).

---

## 1. Overview

**Eklavya ScholarConnect** is an end-to-end digital governance, multilingual informant, and Direct Benefit Transfer (DBT) lifecycle platform built for Scheduled Tribe (ST) students, **Level-1 Institute Nodal Officers (INOs)**, and **Ministry / State Nodal Administrators**.

It unifies **MeitY Bhashini NMT & Neural TTS**, **UIDAI Aadhaar e-KYC & NPCI Bank Mapper**, **API Setu State e-District Verification**, **Google Cloud Vision API Document & Circular Intelligence**, **Autonomous MoTA Guideline Diff & Sync**, and **Direct Student–INO Deficiency Resolution Conversations** across all **5 Central MoTA ST Schemes**.

---

## 2. Core Features

### A. MeitY Bhashini Multilingual NMT & Neural Voice (TTS) Engine
- **Full-Site Multilingual Translation (`9 Languages`)**: Instantaneous translation across **English**, **Hindi (`हिन्दी`)**, **Santhali (`संताली / ᱥᱟᱱᱛᱟᱲᱤ` — authentic Ol Chiki `ᱚᱞ ᱪᱤᱠᱤ` Unicode `U+1C50..U+1C7F`)**, **Odia (`ଓଡ଼ିଆ`)**, **Marathi / Gondi (`मराठी / गोंडी`)**, **Bengali (`বাংলা`)**, **Gujarati / Bhili (`ગુજરાતી / ભીલી`)**, **Telugu / Koya (`తెలుగు / కోయ`)**, and **Tamil (`தமிழ்`)** via MeitY Bhashini ULCA NMT (`/api/informant/bhashini/translate`), backed by a single-batch deduplicated NMT cache and a full-page DOM translation observer (`bhashiniDomTranslator.ts`).
- **Native Indian-Language Voice Read-Aloud (`/api/informant/bhashini/tts`)**: Every checklist step and general statutory rule includes **🔊 Listen** and **⏹ Stop Listening** controls powered by MeitY Bhashini ULCA TTS when `BHASHINI_INFERENCE_KEY` is configured, with an automatic **Indic Phonetic TTS Bridge** (`odiaToDevanagariPhonetic` & `olChikiToDevanagariPhonetic`) that maps Odia (`U+0B00..U+0B7F`) and Santhali Ol Chiki (`U+1C50..U+1C7F`) graphemes into phonetic Indo-Aryan/Munda syllables when falling back to cloud/browser TTS engines that lack standalone `or`/`sat` voice models.

### B. Landing-Page MoTA Informant Portal & Interactive 8-Step Checklists
Accessible directly from the public landing page without requiring prior login:
- **Part A — General MoTA Statutory Mandates (Applies to All Schemes)**:
  1. **Mandatory NSP 2.0 14-Digit OTR ID & UIDAI FaceRD e-KYC**
  2. **State e-District & DigiLocker Barcoded ST & Income Certificates Only**
  3. **NPCI Aadhaar-Seeded Bank Account (Active on NPCI Mapper for SNA SPARSH DBT)**
  4. **Single Central/State Scholarship Rule (SHA-256 Aadhaar Data Vault Deduplication)**
  5. **Level-1 INO Verification & 7-Day Deficiency Resolution Window**
- **Part B — Scholarship-Specific 8-Step Checklists & Varying Income Ceilings**:
  Each of the **5 Central MoTA ST Schemes** has its own dedicated 8-step checklist, statutory citations, and **varying parental/family income ceiling**:

| Scheme Code | Official MoTA Scheme Name | Target Group | Baseline Income Ceiling (Varies via Circular Sync) | Min Marks & Age Limit | Financial Entitlement & DBT Mode |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`PRE_MATRIC`** | Pre-Matric Scholarship for ST Students (Classes IX & X) | School Pupils (Class 9 & 10) | **`≤ ₹2.25 Lakh/yr`** *(revises to `₹2.50L` / `₹2.70L`)* | Pass Class VIII · `≤ 18 Yrs` | Day Scholar: `₹3,500/yr` · Hosteller: `₹7,000/yr` + Book Grant (SNA SPARSH) |
| **`POST_MATRIC`** | Post-Matric Scholarship for ST Students (Centrally Sponsored) | Class XI, XII, Diploma, UG, PG | **`≤ ₹2.50 Lakh/yr`** *(revises to `₹2.80L` / `₹3.00L`)* | `≥ 45%–50%` · `≤ 30–32 Yrs` | 100% Non-Refundable Tuition + `₹24,000–₹48,000/yr` Maintenance (75:25 / 90:10 DBT) |
| **`TOP_CLASS`** | Central Sector Scheme of Top Class Education for ST Students | 250+ Premier Institutes (IIT, NIT, IIM, AIIMS, NLU) | **`≤ ₹4.50 Lakh/yr`** *(revises to `₹5.00L` / `₹5.50L`)* | `≥ 58%–60%` · `≤ 25–26 Yrs` | Full Tuition + `₹86,000/yr` Living + `₹45,000` Laptop + `₹3,000/yr` Books |
| **`NOS`** | National Overseas Scholarship (NOS) for ST Candidates | Master's, Ph.D. & Post-Doc in Top-1000 QS Foreign Universities | **`≤ ₹6.00 Lakh/yr`** *(revises to `₹6.50L` / `₹7.20L`)* | `≥ 55%–60%` · `≤ 35–36 Yrs` | 100% Foreign Tuition + `$15,400 USD/yr` (`£9,900 GBP`) Living + Airfare & Visa |
| **`NFST`** | National Fellowship for Higher Education of ST Students (NFST) | Full-Time M.Phil / Ph.D. Research Scholars in India | **Open Merit — No Income Limit** | `≥ 52%–55% PG` · `≤ 35–37 Yrs` | JRF: `₹37,000/mo` · SRF: `₹42,000/mo` + `27% HRA` + `₹20,500–₹25,000/yr` Contingency |

- **Interactive Eligibility & Entitlement Calculator + Cross-Scheme Varying Income Matrix**: Students can adjust sliders for Annual Family Income (`₹0.50L – ₹10.00L/yr`), Qualifying Marks (`%`), Age, and Hosteller/Day-Scholar status to compute their exact annual DBT entitlement and see live qualification across all 5 MoTA schemes simultaneously.
- **Bidirectional Student Dashboard Sync**: Checking off steps on the landing page automatically syncs with the logged-in **Student Beneficiary Dashboard**, displaying `"You Are Currently on Step X of 8"` with a visual stepper and next-action prompt.

### C. Autonomous MoTA Circular PDF Scanner, Diff Comparator & Auto-Updater (`Google Cloud Vision API`)
- Whenever a new MoTA circular PDF is published on `tribal.nic.in` or `dbttribal.gov.in`, the backend pipeline (`POST /api/informant/guidelines/scan-pdf`) automatically:
  1. Extracts text and tables using **Google Cloud Vision API (`DOCUMENT_TEXT_DETECTION`)**,
  2. Compares the extracted **income ceiling**, **minimum qualifying marks (%)**, **age limit**, **fellowship/stipend rates**, and **mandatory clauses** against the current SQLite scheme rules,
  3. Automatically updates the scheme's live parameters and 8-step checklist items, and
  4. Records a side-by-side **`Previous Value → Auto-Updated Value`** audit log.

### D. UIDAI Aadhaar e-KYC, SHA-256 Data Vault, NPCI Bank Mapper & API Setu Onboarding
- **UIDAI Aadhaar e-KYC (`/api/auth/aadhaar/send-otp` & `/api/auth/aadhaar/verify-ekyc`)**:
  - Available in both the **Registration Modal** (`AuthModal.tsx`) and the **ST Beneficiary Profile** (`StudentProfile.tsx`).
  - Supports **📱 UIDAI Aadhaar Mobile OTP e-KYC** and **👤 UIDAI FaceRD Biometric e-KYC**.
  - Masks the 12-digit Aadhaar (`XXXX-XXXX-8492`), generates a **SHA-256 Aadhaar Data Vault Token** (`ADV-...`) for cross-portal deduplication, issues a **14-Digit NSP OTR ID** (`OTR2026...`), and verifies **NPCI Aadhaar Payment Bridge (APB) Bank Seeding** for SNA SPARSH Just-In-Time DBT.
- **API Setu State e-District ST Caste Certificate Gatekeeper**:
  - Real-time verification of Scheduled Tribe status (Article 342 Presidential Orders) against State e-District repositories (`Jharkhand`, `Odisha`, `Madhya Pradesh`, `Chhattisgarh`, `Maharashtra`, `Rajasthan`, `Gujarat`, `Assam`, etc.).
  - Automatically blocks non-ST (`OBC` / `SC` / `General`) certificates from registering on MoTA ScholarConnect.

### E. Google Cloud Vision Document OCR & Direct Level-1 INO Deficiency Resolution Chat
- **Certificate OCR Pre-Scanner (`POST /api/informant/vision/scan-document`)**:
  - Verifies ST Caste Certificates, Current-FY Revenue Officer Income Certificates, Marksheets, and AISHE/UDISE+ Bonafide Certificates for valid e-District barcodes, issuing authority seals, and income ceiling compliance.
- **Automated Level-1 INO Conversation on Document Rejection (`/api/informant/ino-chats` · `/api/informant/ino-convo`)**:
  - If a document is flagged or rejected during later verification stages (Stages 3–7 — e.g., expired income certificate, missing e-District barcode, or unattested Annexure-III), the system **automatically opens a live two-way resolution conversation thread** with the assigned **Level-1 Institute Nodal Officer (INO)**.
  - Students and INOs can exchange messages in real time (`/api/informant/ino-chats/<id>/message` or `/api/informant/ino-convo/reply`), and the student can re-scan the corrected certificate via **Google Cloud Vision API** directly inside the chat (`/api/informant/ino-chats/<id>/resolve` or `/api/informant/ino-convo/resolve`) to immediately clear the stage hold and advance to **Stage 8 (PFMS SNA SPARSH DBT Sanction)**.

---

## 3. Stakeholder Portals

1. **Public Landing & MoTA Informant Portal (`LandingPage.tsx`, `InformantPortalSection.tsx`)**:
   - Platform Overview & Impact, Bhashini Multilingual MoTA Informant & 8-Step Checklists, 8-Stage Digital Workflow Explorer, Central ST Schemes Matcher, and AISHE/UDISE+ Empaneled Institutes Directory.
2. **ST Applicant / Research Scholar Portal (`StudentPortal.tsx`)**:
   - Live 8-Step Checklist Progress Banner (`Step X of 8`), UIDAI Aadhaar e-KYC & NPCI Mapper Dossier, Google Cloud Vision Document OCR Verifier, Level-1 INO Deficiency Resolution Chat, DigiLocker Vault & QPR Upload, and SNA SPARSH Just-In-Time DBT Ledger.
3. **Level-1 INO / Scrutiny Officer Portal (`AcademicianPortal.tsx`)**:
   - Applicant Dossier Scrutiny Queue, Live **Student–INO Document Rejection & Resolution Desk** (reply to scholars or approve & clear stage holds in one click), Configurable Scheme Rule Engine, and Circular Publishing.
4. **MoTA Ministry / State Nodal Admin Portal (`UniversityPortal.tsx`)**:
   - Scheme-wise Sanction & SNA SPARSH Disbursal Analytics, Level-1 INO & Beneficiary Role Management, and Empaneled Institution Governance.

---

## 4. Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Python 3, Flask, SQLite3 (Relational Governance & Audit Schema)
- **AI & National Public Digital Infrastructure (DPI) Integrations**:
  - **Google Cloud Vision API** (`DOCUMENT_TEXT_DETECTION` for Certificate OCR & MoTA Circular PDF Diffing)
  - **MeitY Bhashini ULCA Pipeline** (NMT Multilingual Translation & Neural Indian-Language TTS Audio)
  - **UIDAI Aadhaar e-KYC, SHA-256 Aadhaar Data Vault & NPCI Mapper**
  - **API Setu State e-District Verification & Google Gemini AI Competency/Dossier Analysis**

---

## 5. Key API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/informant/guidelines?lang=<code>` | `GET` | Returns General MoTA Guidelines, all 5 ST scheme checklists (translated via Bhashini, including Ol Chiki `ᱚᱞ ᱪᱤᱠᱤ` for `sat`), and circular diff history |
| `/api/informant/bhashini/translate` | `POST` | Translates batch text strings across 9 Indian & Tribal languages via MeitY Bhashini NMT |
| `/api/informant/bhashini/tts` | `POST` | Synthesizes native Indian-language MP3 speech audio (`hi`, `sat`, `or`, `mr`, `bn`, `gu`, `te`, `ta`, `en`) |
| `/api/informant/guidelines/scan-pdf` | `POST` | Scans a MoTA Circular PDF via Google Vision OCR, diffs rules, and auto-updates the live scheme checklist |
| `/api/informant/vision/scan-document` | `POST` | Verifies student certificates via Google Vision OCR and auto-opens a Level-1 INO chat if rejected |
| `/api/informant/student-progress` *(alias: `/api/informant/progress`)* | `GET` / `POST` | Fetches or updates the student's current checklist step (`Step X of 8`) per scheme |
| `/api/informant/ino-chats` *(alias: `/api/informant/ino-convo`)* | `GET` | Lists active & resolved Student–Level-1 INO document deficiency resolution conversations |
| `/api/informant/ino-chats/<id>/message` *(alias: `/api/informant/ino-convo/reply`)* | `POST` | Posts a student or Level-1 INO message (with optional Google Vision OCR re-scan) to a deficiency thread |
| `/api/informant/ino-chats/<id>/resolve` *(alias: `/api/informant/ino-convo/resolve`)* | `POST` | Marks a deficiency conversation as resolved and clears the application stage hold |
| `/api/auth/aadhaar/send-otp` | `POST` | Dispatches a 6-digit UIDAI Aadhaar e-KYC OTP and computes the SHA-256 Data Vault hash |
| `/api/auth/aadhaar/verify-ekyc` | `POST` | Verifies UIDAI OTP / FaceRD, checks NPCI Bank Mapper status, and generates a 14-digit NSP OTR ID |

---

## 6. Setup & Run Instructions

### 1. Backend (Flask API + Production Static Server)
```powershell
cd Backend
pip install -r requirements.txt
python seed_data.py
python app.py
```
The unified server starts on **`http://127.0.0.1:5001`**.

### 2. Frontend (React + TypeScript + Vite)
```powershell
cd Frontend
npm install
npm run dev
```
Or build the production bundle served automatically by Flask on port `5001`:
```powershell
cd Frontend
npm run build
```

---

## 7. Official Demo Credentials

- **ST Applicant / Research Scholar**: `applicant@mota.gov.in` / `Password123!`
- **Level-1 INO / Scrutiny Officer**: `scrutiny@mota.gov.in` / `Password123!`
- **MoTA Nodal Administrator**: `admin@mota.gov.in` / `Password123!`
- **Sample UIDAI Aadhaar for e-KYC**: `4829 7301 8492` *(Demo OTP: `482910`)*
- **Sample State e-District ST Certificates**:
  - `JH/ST/2023/84920` (*Jharkhand — Santhal ST · Pass*)
  - `OD/ST/2024/49102` (*Odisha — Gond ST · Pass*)
  - `UP/OBC/2023/10294` (*Uttar Pradesh — Non-ST OBC · Blocked by Statutory Gatekeeper*)
