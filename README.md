# MoTA ScholarConnect (SIH26239)

AI-Enabled Scholarship and Fellowship Management System for Scheduled Tribes under the Ministry of Tribal Affairs (MoTA).

## Overview
A web portal to manage MoTA schemes like National Fellowship for Scheduled Tribes (NFST) and National Overseas Scholarship (NOS). It covers registration, online application, AI OCR document verification, configurable scheme rules, scrutiny, deficiency resubmission, merit selection, and fellowship tracking.

## Features
- **ST Applicant Portal:** Apply for schemes, upload documents, run AI OCR eligibility checks, resolve deficiencies, and track 8-stage application and fellowship status.
- **Scrutiny Officer Portal:** Verify applicant documents using AI insights, configure scheme eligibility rules, issue deficiency notices, and upload guidelines.
- **MoTA Admin Portal:** Monitor scheme analytics, verify users, assign scrutiny officers, and publish homepage circulars.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python, Flask, SQLAlchemy, JWT
- **Database:** SQLite
- **AI:** Google Gemini API

## Setup and Run

### Backend
```bash
cd Backend
pip install -r requirements.txt
python seed_data.py
python app.py
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## Demo Logins
- **Applicant:** `applicant@mota.gov.in` / `Password123!`
- **Scrutiny Officer:** `scrutiny@mota.gov.in` / `Password123!`
- **Admin:** `admin@mota.gov.in` / `Password123!`