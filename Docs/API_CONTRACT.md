# SIH26239 — MoTA ScholarConnect REST API Contract

Base URL: `/api`

---

## 1. Public MoTA Informant, Bhashini & Google Vision OCR (`/api/informant`)

### `GET /api/informant/guidelines?lang={code}`
Returns all 5 Central ST Scholarship & Fellowship schemes (`POST_MATRIC`, `NFST`, `TOP_CLASS`, `NOS`, `PRE_MATRIC`) with their varying statutory income caps, 8-step checklists, universal MoTA rules, and recent circular audit logs translated via Bhashini NMT.

### `POST /api/informant/guidelines/scan-pdf`
Accepts either a real Base64-encoded PDF/Image circular (`file_base64`, `file_name`, `mime_type`) or circular text for a target `scheme_code`, extracts text via **Google Cloud Vision API (`DOCUMENT_TEXT_DETECTION`)**, computes the diff against the current database rules in `mota_guideline_schemes`, updates the scheme's statutory parameters, and records an immutable audit log in `guideline_pdf_updates`.

**Request Body:**
```json
{
  "scheme_code": "POST_MATRIC",
  "pdf_title": "MoTA_PMS_Revised_Guidelines_2026_27.pdf",
  "circular_ref": "F.No. 11016/08/2026-Sch-Rev",
  "file_base64": "data:application/pdf;base64,JVBERi0xLjQK...",
  "file_name": "MoTA_Circular.pdf",
  "mime_type": "application/pdf"
}
```

### `POST /api/informant/vision/scan-document`
Verifies an uploaded student certificate (`income_certificate`, `st_certificate`, `marksheet`, `bonafide_aishe`) via Base64 image/PDF upload (`file_base64`) or OCR text using **Google Cloud Vision API**. If a deficiency is detected at Stage 5/6, automatically creates or updates a two-way resolution thread in `ino_deficiency_chats`.

### `POST /api/informant/bhashini/translate`
Translates an array of UI or guideline strings from `source_lang` (`en`) into `target_lang` (`hi`, `sat`, `gon`, `bhb`, `hoc`, `unr`, `or`, `te`, `mr`, `gu`, `ta`).

### `GET /api/informant/student-progress?scheme_code={code}` & `POST /api/informant/student-progress`
Reads and persists the student's completed checklist steps (`1–8`) in `student_checklist_progress`.

### `GET /api/informant/ino-chats` & `POST /api/informant/ino-chats/{chat_id}/message`
Retrieves and posts messages (with optional Google Vision re-scan verification badges) in the Level-1 INO Deficiency Resolution thread.

---

## 2. Authentication & UIDAI Aadhaar e-KYC (`/api/auth`)

### `POST /api/auth/aadhaar/send-otp`
Validates a 12-digit Aadhaar number (Verhoeff format check) and dispatches a 6-digit UIDAI e-KYC OTP alongside a transaction ID (`UIDAI-EKYC-...`).

### `POST /api/auth/aadhaar/verify-ekyc`
Verifies the UIDAI OTP or FaceRD Biometric capture and returns:
- `masked_aadhaar` (`XXXX-XXXX-9012`)
- `aadhaar_vault_token` (`ADV-SHA256-...`)
- `nsp_otr_id` (`NSP-OTR-2026-...`)
- `npci_seeded_bank` & `dbt_status` (`ACTIVE_FOR_SNA_SPARSH_DBT`)

### `POST /api/auth/students/signup` & `POST /api/auth/students/login`
Registers or authenticates a Scheduled Tribe Scholarship Beneficiary (`st_applicants`). Duplicate email signups with mismatched credentials return `409 Conflict` to prevent unauthorized account takeover.

### `POST /api/auth/academicians/signup` & `POST /api/auth/academicians/login`
Registers or authenticates a Level-1 Institute Nodal Officer / Scrutiny Officer (`scrutiny_officers`).

### `POST /api/auth/institutes/signup` & `POST /api/auth/institutes/login`
Registers or authenticates a MoTA Ministry / State Nodal Administrator (`mota_admins`).

### `GET /api/auth/me` & `POST /api/auth/logout`
Returns or clears the active authenticated session.

---

## 3. ST Student Beneficiary Portal (`/api/student`)

- `GET /api/student/profile` & `PUT /api/student/profile`: Retrieve and update beneficiary profile, Aadhaar OTR ID, and verified certificates.
- `POST /api/student/documents`: Upload statutory certificate metadata (`applicant_documents`).
- `GET /api/student/postings`: List active MoTA Central ST Scholarship & Fellowship schemes (`scholarship_schemes`).
- `POST /api/student/apply/{scheme_id}`: Submit a scholarship application (`scheme_applications`).
- `GET /api/student/applications/{scheme_id}/analysis`: Run AI statutory eligibility and rule compliance audit (`ai_scrutiny_cache`).
- `GET /api/student/applications/{scheme_id}/courses`: Retrieve PFMS SNA SPARSH quarterly disbursement & continuation schedule (`fellowship_disbursements`).
- `GET /api/student/test/{topic}` & `POST /api/student/test/submit`: Generate and evaluate MoTA Statutory Rule & Eligibility Verification assessments (`scheme_rule_configs`, `eligibility_verifications`).

---

## 4. Level-1 INO Scrutiny Officer Portal (`/api/academician`)

- `GET /api/academician/postings` & `POST /api/academician/postings`: Manage institutional scholarship verification batches.
- `POST /api/academician/students/{student_id}/feedback` & `GET /api/academician/feedbacks`: Issue and track Level-1 INO scrutiny remarks and deficiency memos (`deficiency_communications`).

---

## 5. MoTA Ministry & State Nodal Admin Portal (`/api/institute`)

- `GET /api/institute/list`: Public directory of empaneled MoTA divisions and AISHE nodal cells.
- `GET /api/institute/verifications/pending` & `POST /api/institute/verifications/{student_id}`: Inspect and approve/reject pending ST scholar institutional verifications.
- `GET /api/institute/dashboard`: Real-time ministry telemetry (total enrolled ST scholars, verified beneficiaries, sanction counts, and rule compliance averages).