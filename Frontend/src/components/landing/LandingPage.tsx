import React, { useState } from 'react';
import { LandingNav, GovTabKey } from './LandingNav';
import { InformantPortalSection } from './InformantPortalSection';
import { getPortalUiStrings } from '../../api/informant';
import { Icon } from '../common/Icon';
import { useAuth } from '../../context/AuthContext';

interface LandingPageProps {
  go: (page: string) => void;
  openAuth: (mode: 'login' | 'register') => void;
}

/* ==========================================================================
   PUBLIC DIRECTORY: AISHE & UDISE+ EMPANELED INSTITUTIONS
   (Strictly institutional directory and contact details; zero applicant data)
   ========================================================================== */
interface InstituteRegistryItem {
  code: string;
  type: string;
  name: string;
  state: string;
  inoOfficer: string;
  inoContact: string;
  kycStatus: string;
}

const AISHE_INSTITUTE_REGISTRY: InstituteRegistryItem[] = [
  {
    code: 'AISHE C-35728',
    type: 'Higher Education (IIT / National Importance)',
    name: 'Indian Institute of Technology (IIT) Bombay',
    state: 'Maharashtra / National Host',
    inoOfficer: 'Prof. S. K. Deshmukh (Level-1 INO)',
    inoContact: 'ino.scholarship@iitb.ac.in | +91-22-2576-7042',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0357',
    type: 'Higher Education (NIT / Central Institution)',
    name: 'National Institute of Technology (NIT) Rourkela',
    state: 'Odisha (Fifth Schedule)',
    inoOfficer: 'Dr. P. K. Rout (Level-1 INO)',
    inoContact: 'ino.stcell@nitrkl.ac.in | +91-661-246-2021',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0281',
    type: 'Higher Education (Central Tribal University)',
    name: 'Indira Gandhi National Tribal University (IGNTU) Amarkantak',
    state: 'Madhya Pradesh (Fifth Schedule)',
    inoOfficer: 'Prof. A. K. Shukla (Level-1 INO)',
    inoContact: 'ino.dbt@igntu.ac.in | +91-7629-269701',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0284',
    type: 'Higher Education (NIT / Central Institution)',
    name: 'Maulana Azad National Institute of Technology (MANIT) Bhopal',
    state: 'Madhya Pradesh (Fifth Schedule)',
    inoOfficer: 'Dr. R. K. Mandloi (Level-1 INO)',
    inoContact: 'nodalofficer.nsp@manit.ac.in | +91-755-405-1000',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'UDISE+ 22140501204',
    type: 'Secondary / Senior Secondary (EMRS Model School)',
    name: 'Eklavya Model Residential School (EMRS) Bastar',
    state: 'Chhattisgarh (Fifth Schedule)',
    inoOfficer: 'Shri V. K. Kashyap (Principal / INO)',
    inoContact: 'emrs.bastar@tribal.cg.gov.in | +91-7782-224109',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0202',
    type: 'Higher Education (Deemed University / Engineering)',
    name: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
    state: 'Jharkhand (Fifth Schedule)',
    inoOfficer: 'Dr. A. K. Tiwary (Level-1 INO)',
    inoContact: 'ino.welfare@bitmesra.ac.in | +91-651-227-5444',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0688',
    type: 'Higher Education (AIIMS / Medical Sciences)',
    name: 'All India Institute of Medical Sciences (AIIMS) Bhubaneswar',
    state: 'Odisha (Fifth Schedule)',
    inoOfficer: 'Dr. S. Mohapatra (Dean & Level-1 INO)',
    inoContact: 'dean.academic@aiimsbhubaneswar.edu.in | +91-674-247-6789',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0345',
    type: 'Higher Education (Central University · 90:10 NE Split)',
    name: 'North-Eastern Hill University (NEHU), Shillong',
    state: 'Meghalaya (Sixth Schedule)',
    inoOfficer: 'Prof. B. Myrboh (Level-1 INO)',
    inoContact: 'ino.scholarship@nehu.ac.in | +91-364-272-1012',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0053',
    type: 'Higher Education (IIT / National Importance · 90:10 NE Split)',
    name: 'Indian Institute of Technology (IIT) Guwahati',
    state: 'Assam (Sixth Schedule / NE)',
    inoOfficer: 'Dr. D. Sharma (Level-1 INO)',
    inoContact: 'ino.acad@iitg.ac.in | +91-361-258-2190',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0346',
    type: 'Higher Education (Central University · 90:10 NE Split)',
    name: 'Mizoram University (MZU), Aizawl',
    state: 'Mizoram (Sixth Schedule)',
    inoOfficer: 'Prof. L. Z. Chhangte (Level-1 INO)',
    inoContact: 'ino.mzu@mzu.edu.in | +91-389-233-0654',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0348',
    type: 'Higher Education (Central University · 90:10 NE Split)',
    name: 'Nagaland University, Lumami / Kohima',
    state: 'Nagaland (Article 371A ST Region)',
    inoOfficer: 'Dr. T. Zeliang (Level-1 INO)',
    inoContact: 'ino.stfellowship@nagalanduniversity.ac.in | +91-369-226-8270',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0041',
    type: 'Higher Education (Central University · 90:10 NE Split)',
    name: 'Rajiv Gandhi University (RGU), Doimukh, Itanagar',
    state: 'Arunachal Pradesh (NE Region)',
    inoOfficer: 'Prof. N. T. Rikam (Level-1 INO)',
    inoContact: 'ino.rgu@rgu.ac.in | +91-360-227-7253',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0493',
    type: 'Higher Education (NIT / Central Institution · 90:10 NE Split)',
    name: 'National Institute of Technology (NIT) Agartala',
    state: 'Tripura (Sixth Schedule)',
    inoOfficer: 'Dr. A. Debbarma (Level-1 INO)',
    inoContact: 'ino.nsp@nita.ac.in | +91-381-254-6630',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0338',
    type: 'Higher Education (Central University · 90:10 NE Split)',
    name: 'Manipur University, Canchipur, Imphal',
    state: 'Manipur (Hill & Valley ST)',
    inoOfficer: 'Dr. R. K. Kamei (Level-1 INO)',
    inoContact: 'ino.welfare@manipuruniv.ac.in | +91-385-243-5143',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0428',
    type: 'Higher Education (Central University · 90:10 Himalayan Split)',
    name: 'Sikkim University, Gangtok',
    state: 'Sikkim (Himalayan ST Region)',
    inoOfficer: 'Dr. K. T. Lepcha (Level-1 INO)',
    inoContact: 'ino.scholarships@cus.ac.in | +91-3592-251-438',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0891',
    type: 'Higher Education (State Tribal University)',
    name: 'Govind Guru Tribal University (GGTU), Banswara',
    state: 'Rajasthan (Fifth Schedule)',
    inoOfficer: 'Prof. M. L. Meena (Level-1 INO)',
    inoContact: 'ino.tribal@ggtu.ac.in | +91-2962-256-552',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0149',
    type: 'Higher Education (NIT / Central Institution)',
    name: 'Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat',
    state: 'Gujarat (Fifth Schedule)',
    inoOfficer: 'Dr. H. B. Rathod (Level-1 INO)',
    inoContact: 'ino.svnit@svnit.ac.in | +91-261-220-1545',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0184',
    type: 'Higher Education (IIT / National Importance · 90:10 Himalayan Split)',
    name: 'Indian Institute of Technology (IIT) Mandi',
    state: 'Himachal Pradesh (Fifth Schedule)',
    inoOfficer: 'Dr. V. S. Negi (Level-1 INO)',
    inoContact: 'ino.dean@iitmandi.ac.in | +91-1905-267-015',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0560',
    type: 'Higher Education (IIT / National Importance · 90:10 Himalayan Split)',
    name: 'Indian Institute of Technology (IIT) Roorkee',
    state: 'Uttarakhand (Himalayan Region)',
    inoOfficer: 'Prof. R. S. Tolia (Level-1 INO)',
    inoContact: 'ino.dosa@iitr.ac.in | +91-1332-285-245',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-1048',
    type: 'Higher Education (Central Tribal University)',
    name: 'Central Tribal University of Andhra Pradesh (CTUAP), Vizianagaram',
    state: 'Andhra Pradesh (Fifth Schedule)',
    inoOfficer: 'Prof. T. V. Kattimani (Level-1 INO)',
    inoContact: 'ino.ctuap@ctuap.ac.in | +91-8922-296-052',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0025',
    type: 'Higher Education (NIT / Central Institution)',
    name: 'National Institute of Technology (NIT) Warangal',
    state: 'Telangana (Fifth Schedule)',
    inoOfficer: 'Dr. K. Venkata Rao (Level-1 INO)',
    inoContact: 'ino.scholarships@nitw.ac.in | +91-870-246-2010',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0220',
    type: 'Higher Education (Research Institute of Eminence)',
    name: 'Indian Institute of Science (IISc) Bengaluru',
    state: 'Karnataka',
    inoOfficer: 'Prof. G. Rangarajan (Level-1 INO)',
    inoContact: 'ino.nfst@iisc.ac.in | +91-80-2293-2210',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0456',
    type: 'Higher Education (IIT / National Importance)',
    name: 'Indian Institute of Technology (IIT) Madras',
    state: 'Tamil Nadu',
    inoOfficer: 'Prof. M. S. Sivakumar (Level-1 INO)',
    inoContact: 'ino.deanstudents@iitm.ac.in | +91-44-2257-8050',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0263',
    type: 'Higher Education (NIT / Central Institution)',
    name: 'National Institute of Technology (NIT) Calicut',
    state: 'Kerala',
    inoOfficer: 'Dr. S. Chandran (Level-1 INO)',
    inoContact: 'ino.welfare@nitc.ac.in | +91-495-228-6106',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0573',
    type: 'Higher Education (IIT / National Importance)',
    name: 'Indian Institute of Technology (IIT) Kharagpur',
    state: 'West Bengal',
    inoOfficer: 'Prof. B. Murmu (Level-1 INO)',
    inoContact: 'ino.acad@iitkgp.ac.in | +91-3222-282-052',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-0109',
    type: 'Higher Education (Central University / NFST Nodal Host)',
    name: 'Jawaharlal Nehru University (JNU), New Delhi',
    state: 'Delhi (NCT) / National Host',
    inoOfficer: 'Prof. R. K. Meena (Level-1 INO)',
    inoContact: 'ino.fellowship@jnu.ac.in | +91-11-2670-4055',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
  {
    code: 'AISHE U-1102',
    type: 'Higher Education (UT Public University)',
    name: 'University of Ladakh (Leh & Kargil Campuses)',
    state: 'Ladakh / Jammu & Kashmir (UT)',
    inoOfficer: 'Dr. T. Namgyal (Level-1 INO)',
    inoContact: 'ino.ladakh@universityofladakh.org.in | +91-1982-260-812',
    kycStatus: 'Active & Aadhaar e-Signed',
  },
];

/* ==========================================================================
   CENTRAL SCHEMES DIRECTORY (MINISTRY OF TRIBAL AFFAIRS)
   ========================================================================== */
interface SchemeInfo {
  code: string;
  name: string;
  targetGroup: string;
  incomeLimit: string;
  benefits: string;
  slots: string;
  dbtMode: string;
  keyRequirements: string[];
}

const CENTRAL_ST_SCHEMES: SchemeInfo[] = [
  {
    code: 'NFST',
    name: 'National Fellowship for Higher Education of ST Students',
    targetGroup: 'M.Phil / Ph.D. Research Scholars in Indian Universities',
    incomeLimit: 'No Income Ceiling (Open Merit for ST Scholars)',
    benefits: 'JRF: ₹37,000/mo | SRF: ₹42,000/mo + HRA & Contingency (up to ₹20,500/yr)',
    slots: '750 Fresh Fellowships Annually',
    dbtMode: 'Direct Monthly Fellowship via PFMS / Canara Bank Portal',
    keyRequirements: [
      'Admitted into regular full-time M.Phil / Ph.D. degree',
      'Valid ST Certificate recognized under Presidential Orders',
      'Post-Graduate degree with minimum 55% marks',
      'Quarterly progress report endorsed by University Research Guide',
    ],
  },
  {
    code: 'NOS',
    name: 'National Overseas Scholarship for ST Candidates',
    targetGroup: 'Master’s, Ph.D., and Post-Doctoral studies in Foreign Universities',
    incomeLimit: 'Gross Family Income ≤ ₹6.00 Lakh per annum',
    benefits: '100% Tuition Fees + Living Allowance ($15,400 USD / £9,900 GBP) + Airfare & Medical Insurance',
    slots: '20 Fresh Awards per Year',
    dbtMode: 'Direct Disbursal via Indian High Commissions / Embassies',
    keyRequirements: [
      'Unconditional admission offer from top 1,000 QS ranked foreign university',
      'Minimum 55% or equivalent grade in qualifying examination',
      'Age below 35 years as on 1st April of selection year',
      'One scholarship per family member statutory guideline',
    ],
  },
  {
    code: 'TOP_CLASS',
    name: 'Scheme of Top Class Education for ST Students',
    targetGroup: 'Undergraduate & Postgraduate Scholars in 250+ Premier Institutes (IITs, IIMs, NITs, AIIMS, NLUs)',
    incomeLimit: 'Gross Annual Family Income ≤ ₹4.50 Lakh (Central Sector Premier Tier)',
    benefits: 'Full Tuition Fee Reimbursement + ₹86,000/yr Living Allowance + ₹45,000 One-time Computer Grant + ₹3,000/yr Books',
    slots: '1,000 Fresh Scholarships per Year',
    dbtMode: 'SNA SPARSH Just-In-Time Direct Bank Transfer (NPCI Aadhaar-Seeded)',
    keyRequirements: [
      'Admission secured in notified premier institute (AISHE empaneled)',
      'Valid State e-District ST Certificate',
      'Income Certificate issued by Revenue Authority under ₹4.50L cap',
      'Active Aadhaar-seeded NPCI bank account',
    ],
  },
  {
    code: 'POST_MATRIC',
    name: 'Post-Matric Scholarship for ST Students (Centrally Sponsored)',
    targetGroup: 'ST Students pursuing Class XI, XII, Diploma, Degree, and Postgraduate Courses',
    incomeLimit: 'Gross Annual Family Income ≤ ₹2.50 Lakh (Auto-revises via MoTA Circulars)',
    benefits: 'Compulsory Non-Refundable Course Fees + Monthly Maintenance Allowance (₹1,200 to ₹4,000/mo)',
    slots: 'Open to All Eligible Enrolled ST Students',
    dbtMode: 'PFMS SNA SPARSH Merged Central (75%/90%) & State (25%/10%) DBT',
    keyRequirements: [
      'Studying in recognized school, college, or university with valid AISHE/UDISE+ code',
      'Annual Income Certificate issued by competent Revenue Officer',
      'Attendance above 75% certified by Institute Nodal Officer',
      'Single scholarship undertaking (deduplicated across Central & State portals)',
    ],
  },
  {
    code: 'PRE_MATRIC',
    name: 'Pre-Matric Scholarship for ST Students (Classes IX & X)',
    targetGroup: 'ST Students enrolled in Classes IX & X in Government / Aided Schools',
    incomeLimit: 'Gross Annual Family Income ≤ ₹2.25 Lakh',
    benefits: 'Day Scholars: ₹3,500/year | Hostellers: ₹7,000/year + Book & Disability Allowances',
    slots: 'Universal Coverage for Eligible ST Pupils',
    dbtMode: 'State Treasury / SNA SPARSH Direct Bank Credit',
    keyRequirements: [
      'Enrolled in full-time recognized school with valid UDISE+ code',
      'Tribe Certificate & Domicile Proof',
      'Parental Gross Income below ₹2.25 Lakh ceiling',
      'Aadhaar seeded bank account in student or joint parental name',
    ],
  },
];

/* ==========================================================================
   PLATFORM CAPABILITIES & FEATURES DIRECTORY
   ========================================================================== */
interface CapabilityCard {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  keyBenefits: string[];
  stakeholderTag: string;
}

const PLATFORM_CAPABILITIES: CapabilityCard[] = [
  {
    id: 'ai_ocr',
    icon: 'zap',
    title: 'AI OCR Document Intelligence',
    subtitle: 'Automated extraction & state revenue API cross-checks',
    description:
      'Computer vision engine trained on Indian multilingual government certificates. Extracts applicant name, father’s name, caste category, income figures, and issue dates while cross-validating with DigiLocker and State e-District APIs (Odisha e-District, Jharkhand JharSewa, MP e-District, CG e-District).',
    keyBenefits: [
      'Sub-second text parsing from scanned PDFs, images, and mobile photos',
      'Automated tamper and digital signature authenticity verification',
      'Proactive blur and resolution quality check during upload',
      'Flags expired or non-statutory certificates before nodal submission',
    ],
    stakeholderTag: 'Institutions & Scholars',
  },
  {
    id: 'rule_engine',
    icon: 'shieldcheck',
    title: 'Explainable Statutory Rule Engine',
    subtitle: 'Deterministic eligibility compliance with full audit trails',
    description:
      'Evaluates statutory rules set by Ministry of Tribal Affairs guidelines. Verifies the ₹2.50 Lakh income ceiling, matches college/school codes against the AISHE/UDISE+ registry, and checks applicant tribe validity against Presidential Orders for each state.',
    keyBenefits: [
      'Transparent rule-by-rule breakdown with pass/warn/fail explanations',
      'Zero black-box decisions — complete reasoning available to reviewing officers',
      'Automatic course level and fee slab validation according to scheme schedules',
      'Dynamic threshold updates issued through digital Ministry circulars',
    ],
    stakeholderTag: 'Governance & Auditing',
  },
  {
    id: 'dedup',
    icon: 'target',
    title: 'Cross-Scheme Tokenized Deduplication',
    subtitle: 'Aadhaar Data Vault hashing to eliminate duplicate claims',
    description:
      'Cross-checks scholarship applications across Central schemes (NSP, UGC, CSIR, MoTA) and State scholarship databases (e-Kalyan, Medhabruti, OASIS). Uses SHA-256 tokenized Aadhaar hashing so that no raw 12-digit Aadhaar numbers are ever stored or exposed.',
    keyBenefits: [
      'Stops dual scholarship claiming across Central and State portals',
      'Zero raw PII exposure — fully compliant with UIDAI & DPDP Act 2023',
      'Eliminates duplicate and ineligible registrations at submission',
      'Preserves multi-scheme portability without compromising data security',
    ],
    stakeholderTag: 'Ministry & State Departments',
  },
  {
    id: 'npci',
    icon: 'checkc',
    title: 'Aadhaar NPCI Seeding Validation',
    subtitle: 'Pre-sanction bank linkage audit to prevent DBT failures',
    description:
      'Integrates directly with the National Payments Corporation of India (NPCI) mapper to verify bank account seeding before payment orders are drafted. Immediately alerts students if their bank account is dormant, inactive, or unlinked to Aadhaar.',
    keyBenefits: [
      'Pre-sanction validation eliminates DBT payment rejection bounce-backs',
      'Automated SMS notifications guide students on bank branch seeding',
      'Direct integration with India Post Payments Bank (IPPB) facilitation',
      'Guarantees 99%+ first-time credit success rate via RBI e-Kuber',
    ],
    stakeholderTag: 'ST Scholars & PFMS',
  },
  {
    id: 'sna_sparsh',
    icon: 'spreadsheet',
    title: 'PFMS SNA SPARSH Just-In-Time DBT',
    subtitle: 'Zero idle fund parking with merged Central & State transfers',
    description:
      'Unified payment orchestration integrating the Public Financial Management System (PFMS) and Single Nodal Account (SNA) SPARSH model. Automatically merges the Central share (75% or 90%) and State share (25% or 10%) into a single seamless electronic sanction.',
    keyBenefits: [
      'Funds stay in the Consolidated Fund until the moment of direct scholar transfer',
      'Eliminates multi-month idle float in state and institutional bank accounts',
      'Real-time transaction reconciliation via RBI e-Kuber gateway',
      'End-to-end digital tracking from sanction order generation to student account',
    ],
    stakeholderTag: 'MoTA & State Treasuries',
  },
  {
    id: 'human_loop',
    icon: 'user',
    title: 'Human-in-the-Loop Scrutiny & Deficiency Workflow',
    subtitle: 'Empowering Level-1 INOs with structured deficiency memos',
    description:
      'AI assists, but authorized human officers make final verification determinations. Institute Nodal Officers (INOs) and District Nodal Officers (DNOs) can review pre-extracted certificates, request document corrections, and issue standardized deficiency memos.',
    keyBenefits: [
      '70% reduction in manual file-checking time for college and school staff',
      '15-day defect cure window prevents outright rejections for minor defects',
      'Pre-populated deficiency reasons sent directly via SMS and WhatsApp',
      'Full timestamped audit trail of every officer approval, query, and sanction',
    ],
    stakeholderTag: 'Institute Nodal Officers (INOs)',
  },
];

/* ==========================================================================
   8-STAGE END-TO-END DIGITAL WORKFLOW
   ========================================================================== */
interface WorkflowStage {
  stage: string;
  title: string;
  actor: string;
  timeline: string;
  description: string;
  checks: string[];
}

const EIGHT_STAGE_WORKFLOW: WorkflowStage[] = [
  {
    stage: '01',
    title: 'One-Time Registration (OTR) & DigiLocker KYC',
    actor: 'ST Student',
    timeline: 'Day 1 (Instant)',
    description:
      'The student registers on the national portal using Aadhaar-based OTP or MeriPehchaan SSO. Demographics and family identifiers are fetched securely via DigiLocker, creating a verified digital profile.',
    checks: ['Aadhaar KYC authentication', 'DigiLocker token linkage', 'Mobile & Email verification'],
  },
  {
    stage: '02',
    title: 'Online Scheme Selection & Course Enrollment',
    actor: 'ST Student',
    timeline: 'Day 1–2',
    description:
      'The student selects their applicable scheme (Post-Matric ST, Top Class, NFST, or NOS) and selects their empaneled institution by searching the verified AISHE/UDISE+ directory.',
    checks: ['AISHE/UDISE+ code validation', 'Course level match', 'Previous qualification check'],
  },
  {
    stage: '03',
    title: 'Digital Certificate & Academic Proof Submission',
    actor: 'ST Student',
    timeline: 'Day 2–3',
    description:
      'Student uploads Caste Certificate, Revenue Income Certificate, and previous year academic marksheets. Certificates fetched from DigiLocker are automatically marked pre-verified.',
    checks: ['ST Certificate upload', 'Income Certificate upload', 'Fee receipt / Bonafide certificate'],
  },
  {
    stage: '04',
    title: 'AI OCR Extraction & Statutory Rule Screening',
    actor: 'AI Rule Engine',
    timeline: '< 10 Seconds',
    description:
      'The automated rule engine analyzes document images, extracts metadata, verifies digital signatures, and cross-checks the ₹2.50L income ceiling and state tribal classification list.',
    checks: ['Gross income ceiling check (₹2.50L)', 'State e-District API lookup', 'NPCI Aadhaar-seeding status check'],
  },
  {
    stage: '05',
    title: 'Level-1 INO Institutional Scrutiny & Verification',
    actor: 'Institute Nodal Officer (INO)',
    timeline: 'Day 3–7',
    description:
      'The designated INO at the student’s college or school opens their scrutiny workbench, inspects the pre-parsed documents, confirms campus enrollment, and approves the dossier or flags deficiencies.',
    checks: ['Physical enrollment confirmation', 'Fee structure validation', 'Attendance verification (>75%)'],
  },
  {
    stage: '06',
    title: 'Deficiency Resolution & Query Rectification',
    actor: 'Student & INO Loop',
    timeline: 'Within 15 Days',
    description:
      'If a certificate is blurred or expired, the student receives an instant SMS alert detailing the deficiency. The student re-uploads the corrected document without losing their place in the queue.',
    checks: ['Deficiency memo generation', 'SMS alert dispatch', 'Re-submission re-verification'],
  },
  {
    stage: '07',
    title: 'Level-2 District / State Nodal Approval & Merit Compilation',
    actor: 'DNO / State Department',
    timeline: 'Day 8–14',
    description:
      'Cleared Level-1 dossiers advance to District/State Nodal Officers for quota validation, cross-scheme deduplication check, and statutory sanction list compilation.',
    checks: ['Cross-scheme deduplication scan', 'Budget ceiling verification', 'Digital sanction order sign-off'],
  },
  {
    stage: '08',
    title: 'PFMS SNA SPARSH Just-In-Time DBT Disbursal',
    actor: 'PFMS & RBI e-Kuber',
    timeline: 'Day 15–20',
    description:
      'Merged Central and State funds are released directly to the student’s active Aadhaar-seeded bank account via RBI e-Kuber with zero intermediary delay or manual drafts.',
    checks: ['NPCI active mapper validation', 'Merged 75:25 / 90:10 JIT credit', 'Automated credit confirmation SMS'],
  },
];

/* ==========================================================================
   WHO IT HELPS: VALUE PROPOSITIONS FOR STAKEHOLDERS
   ========================================================================== */
const WHO_IT_HELPS = [
  {
    title: 'For Scheduled Tribe Scholars & Families',
    icon: 'student',
    tag: 'Empowering Tribal Youth',
    color: 'from-blue-900 to-indigo-950',
    borderColor: 'border-blue-200',
    accentColor: 'text-[#1E3A8A]',
    bulletColor: 'bg-[#2563EB]',
    points: [
      'Single-window application for all Central & State ST schemes without repetitive form-filling.',
      'Instant document pulling from DigiLocker eliminates repeated visits to revenue and tehsil offices.',
      'Deficiency alerts via SMS give a 15-day cure window, preventing arbitrary rejections.',
      'Guaranteed direct credit to Aadhaar-seeded accounts via NPCI eliminates middlemen and commission cuts.',
    ],
  },
  {
    title: 'For Institute Nodal Officers (INOs) & Colleges',
    icon: 'building2',
    tag: '70% Workload Reduction',
    color: 'from-slate-900 to-slate-950',
    borderColor: 'border-slate-300',
    accentColor: 'text-[#0F172A]',
    bulletColor: 'bg-[#D97706]',
    points: [
      'AI OCR pre-extracts income numbers, caste details, and validity dates, cutting review time by 70%.',
      'Automated AISHE / UDISE+ validation ensures applications belong strictly to authorized institutions.',
      'One-click deficiency memo issuance with standardized defect codes saves hours of manual drafting.',
      'Clear compliance dashboards ensure colleges meet all Ministry verification audit timelines.',
    ],
  },
  {
    title: 'For Ministry of Tribal Affairs & State Governments',
    icon: 'landmark',
    tag: 'Zero Fund Leakages',
    color: 'from-emerald-950 to-slate-950',
    borderColor: 'border-emerald-300',
    accentColor: 'text-[#16A34A]',
    bulletColor: 'bg-[#16A34A]',
    points: [
      'Tokenized deduplication across central and state schemes permanently prevents double-claiming.',
      'PFMS SNA SPARSH just-in-time disbursement prevents billions of rupees from idling in bank accounts.',
      'Real-time geographic dashboards highlight underserved tribal blocks, PVTGs, and regional gaps.',
      'Strict adherence to DPDP Act 2023 with full encryption and Aadhaar Data Vault tokenization.',
    ],
  },
];

/* ==========================================================================
   MAIN COMPONENT: LANDING PAGE
   ========================================================================== */
export const LandingPage: React.FC<
  LandingPageProps & { siteLang?: string; setSiteLang?: (lang: string) => void }
> = ({ go, openAuth, siteLang: propLang, setSiteLang: propSetLang }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<GovTabKey>('overview');
  const [informantScheme, setInformantScheme] = useState<string>('POST_MATRIC');
  const [localLang, setLocalLang] = useState<string>('en');
  const siteLang = propLang !== undefined ? propLang : localLang;
  const setSiteLang = propSetLang || setLocalLang;
  const ui = getPortalUiStrings(siteLang);

  // Interactive Overview 8-Stage Preview State
  const [selectedOverviewStage, setSelectedOverviewStage] = useState<string>('04');

  // Interactive 8-Stage Workflow Explorer State
  const [activeWorkflowStageIdx, setActiveWorkflowStageIdx] = useState<number>(4);

  // Interactive Central ST Schemes Matcher State
  const [schemeLevelFilter, setSchemeLevelFilter] = useState<string>('ALL');
  const [schemeUserIncome, setSchemeUserIncome] = useState<number>(2.1);

  // Search & Filter State for Public Directory + Interactive Selected Institute
  const [aisheSearch, setAisheSearch] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [selectedInstitute, setSelectedInstitute] = useState<InstituteRegistryItem | null>(
    AISHE_INSTITUTE_REGISTRY[0]
  );
  const [footerModal, setFooterModal] = useState<{ title: string; body: string } | null>(null);

  // Handle Tab Change and Smooth Scroll directly to top of active tab content
  const handleTabChange = (tab: GovTabKey, autoScroll: boolean = true) => {
    setActiveTab(tab);
    if (!autoScroll) return;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const openSchemeInInformant = (schemeCode: string) => {
    setInformantScheme(schemeCode);
    handleTabChange('informant');
  };

  // Filtered AISHE Directory (Pure Institutional Data)
  const filteredInstitutes = AISHE_INSTITUTE_REGISTRY.filter((inst) => {
    const q = aisheSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      inst.name.toLowerCase().includes(q) ||
      inst.code.toLowerCase().includes(q) ||
      inst.state.toLowerCase().includes(q);
    const matchesState = stateFilter === 'All' || inst.state.toLowerCase().includes(stateFilter.toLowerCase());
    return matchesQuery && matchesState;
  });

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen flex flex-col w-full">
      {/* 1. NATIONAL PORTAL NAVIGATION BAR */}
      <LandingNav
        go={go}
        openAuth={openAuth}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        siteLang={siteLang}
        setSiteLang={setSiteLang}
      />

      {/* 2. MAIN CONTENT AREA */}
      <main id="main-content-section" className="flex-1 w-full flex flex-col">
        {/* ====================================================================
            TAB: MOTA INFORMANT PORTAL & SIMPLIFIED CHECKLIST (BHASHINI + VISION)
            ==================================================================== */}
        {activeTab === 'informant' && (
          <InformantPortalSection
            openAuth={openAuth}
            initialSchemeCode={informantScheme}
            siteLang={siteLang}
            setSiteLang={setSiteLang}
          />
        )}

        {/* ====================================================================
            TAB 1: PLATFORM OVERVIEW & WHO IT HELPS
            ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="w-full flex flex-col space-y-8">
            {/* OFFICIAL STATUTORY NOTICE BANNER */}
            <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-4 w-full">
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-medium">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#D97706] text-white shrink-0 font-bold text-[10px]">
                    !
                  </span>
                  <span>
                    <strong>Ministry Circular (MoTA/DBT/2025-26/104):</strong> FY 2025–26 Central ST Schemes Institutional Scrutiny Window is active. All empaneled colleges and schools must complete verification per statutory GIGW 3.0 guidelines.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTabChange('informant')}
                    className="text-xs font-bold text-[#1E3A8A] hover:underline"
                  >
                    {ui.tabs.informant} →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('schemes')}
                    className="text-xs font-bold text-[#D97706] hover:underline"
                  >
                    {ui.tabs.schemes} →
                  </button>
                </div>
              </div>
            </div>

            {/* HERO SECTION WITH THE ONLY AUTHORIZED STAKEHOLDER PORTALS GATEWAY */}
            <section className="bg-gradient-to-b from-[#1E3A8A] via-[#172554] to-[#0F172A] text-white py-12 lg:py-16 border-b border-slate-800 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Heading & Informational Action Buttons */}
                  <div className="lg:col-span-8 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
                      <Icon name="landmark" className="w-3.5 h-3.5" />
                      <span>{ui.ministryHeader}</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#16A34A] text-white text-[10px] font-bold">SIH26239</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                      {ui.heroTitle}
                    </h1>

                    <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
                      {ui.heroSubtitle}
                    </p>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-blue-200">
                      <span className="inline-flex items-center gap-1.5 bg-blue-950/70 border border-blue-800/80 px-3 py-1.5 rounded-md">
                        <Icon name="shieldcheck" className="w-4 h-4 text-[#16A34A]" />
                        <span>UIDAI Aadhaar e-KYC &amp; NSP OTR Verified</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-blue-950/70 border border-blue-800/80 px-3 py-1.5 rounded-md">
                        <Icon name="checkc" className="w-4 h-4 text-[#16A34A]" />
                        <span>Bhashini Multilingual &amp; Google Vision OCR</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-blue-950/70 border border-blue-800/80 px-3 py-1.5 rounded-md">
                        <Icon name="zap" className="w-4 h-4 text-[#D97706]" />
                        <span>100% PFMS &amp; NPCI e-Kuber Integrated</span>
                      </span>
                    </div>

                    {/* Informative Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => handleTabChange('informant')}
                        className="px-5 py-3 rounded-lg bg-[#D97706] hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                      >
                        <Icon name="checkc" className="w-4 h-4" />
                        <span>{ui.tabs.informant}</span>
                        <span className="text-xs font-normal text-amber-100">→</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTabChange('schemes')}
                        className="px-5 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                      >
                        <Icon name="award" className="w-4 h-4" />
                        <span>{ui.tabs.schemes}</span>
                        <span className="text-xs font-normal text-blue-200">→</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTabChange('workflow')}
                        className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                      >
                        <Icon name="gitpull" className="w-4 h-4" />
                        <span>{ui.tabs.workflow}</span>
                        <span className="text-xs font-normal text-blue-200">→</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: THE ONLY AUTHORIZED STAKEHOLDER PORTALS GATEWAY */}
                  <div className="lg:col-span-4 bg-slate-900/90 border border-blue-800/60 rounded-xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                          Stakeholder Gateway
                        </span>
                        <span className="text-[11px] text-slate-400">Single Gateway for Portals</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#16A34A] text-white">
                        Authorized Access
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* 1. ST Student Portal */}
                      <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-3 hover:border-blue-500 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            <Icon name="student" className="w-4 h-4 text-blue-400" />
                            <span>ST Student Portal</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => go('student')}
                            className="px-2.5 py-1 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold"
                          >
                            Login
                          </button>
                        </div>
                        <p className="text-xs text-slate-300">
                          Apply for schemes, upload DigiLocker documents, track application progress, and verify bank NPCI seeding.
                        </p>
                      </div>

                      {/* 2. Level-1 INO Officer Portal */}
                      <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-3 hover:border-amber-500 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            <Icon name="shieldcheck" className="w-4 h-4 text-amber-400" />
                            <span>Level-1 INO Scrutiny</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => go('academician')}
                            className="px-2.5 py-1 rounded bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold"
                          >
                            Login
                          </button>
                        </div>
                        <p className="text-xs text-slate-300">
                          Institute Nodal Officers review pre-extracted certificates, issue deficiency memos, and verify campus enrollment.
                        </p>
                      </div>

                      {/* 3. MoTA Ministry Division Portal */}
                      <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-3 hover:border-emerald-500 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            <Icon name="landmark" className="w-4 h-4 text-emerald-400" />
                            <span>MoTA Ministry Nodal</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => go('university')}
                            className="px-2.5 py-1 rounded bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold"
                          >
                            Login
                          </button>
                        </div>
                        <p className="text-xs text-slate-300">
                          Ministry Administrators manage state allocations, generate SNA SPARSH sanction batches, and monitor DBT releases.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 text-center border-t border-slate-800">
                      <span className="text-[11px] text-slate-400">
                        New ST Scholar?{' '}
                        <button
                          type="button"
                          onClick={() => openAuth('register')}
                          className="text-amber-400 font-semibold hover:underline"
                        >
                          Register One-Time Profile (OTR)
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PLATFORM CAPABILITY MILESTONES */}
            <section className="bg-white border-b border-slate-200 py-6 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A]">5 Central Schemes</div>
                    <div className="text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                      Unified Governance
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Pre-Matric, Post-Matric, Top Class, NFST &amp; NOS</div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#16A34A]">42,000+ Campuses</div>
                    <div className="text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                      Empaneled Institutions
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">AISHE &amp; UDISE+ Synchronized Directory</div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#D97706]">100% Digital</div>
                    <div className="text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                      Paperless Verification
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">DigiLocker &amp; State e-District API Powered</div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">Zero Idle Float</div>
                    <div className="text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                      SNA SPARSH Model
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Just-In-Time Transfer to Bank Accounts</div>
                  </div>
                </div>
              </div>
            </section>

            {/* OVERVIEW CONTENT: WHO IT HELPS & SNAPSHOTS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 pb-8">
              {/* 1A. Who It Helps & Platform Value Proposition */}
              <div>
                <div className="text-center max-w-3xl mx-auto space-y-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Target Stakeholders &amp; Who It Helps
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Who Does ScholarConnect Help &amp; How?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Designed specifically to resolve the acute delays, administrative bottlenecks, and fund leakage risks across India’s tribal scholarship administration.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {WHO_IT_HELPS.map((persona, idx) => (
                    <div
                      key={idx}
                      className={`bg-white rounded-xl border ${persona.borderColor} p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                          <Icon name={persona.icon} className="w-5 h-5" />
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {persona.tag}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{persona.title}</h3>

                      <ul className="space-y-2 pt-1 text-xs text-slate-600">
                        {persona.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${persona.bulletColor} mt-1.5 shrink-0`} />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            {/* 1B. Key Platform Capabilities Grid */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Platform Features &amp; Technical Capabilities
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Engineered to meet Ministry of Tribal Affairs (MoTA) statutory compliance and digital governance mandates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('informant')}
                  className="px-3.5 py-1.5 rounded-md bg-[#1E3A8A] hover:bg-[#0F172A] text-white text-xs font-semibold shrink-0"
                >
                  Open Student Informant &amp; Checklist →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {PLATFORM_CAPABILITIES.map((cap) => (
                  <div
                    key={cap.id}
                    onClick={() => handleTabChange('informant')}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#2563EB] hover:shadow-md cursor-pointer transition-all space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-md bg-blue-100 text-[#1E3A8A] flex items-center justify-center">
                          <Icon name={cap.icon} className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                          {cap.stakeholderTag}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{cap.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{cap.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                      <div className="text-[11px] font-semibold text-[#1E3A8A] flex items-center gap-1">
                        <Icon name="check" className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>{cap.subtitle}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 1C. Interactive 8-Stage Digital Roadmap Preview */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0F172A] text-white rounded-xl p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Statutory Governance Pipeline
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    End-to-End 8-Stage Digital Scholarship Lifecycle
                  </h2>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Select any stage below to view its responsible nodal authority, SLA timeline, and statutory compliance checks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('workflow')}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shrink-0 shadow-sm"
                >
                  View Full 8-Stage Workflow →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
                {EIGHT_STAGE_WORKFLOW.map((stg) => {
                  const isSel = selectedOverviewStage === stg.stage;
                  return (
                    <button
                      key={stg.stage}
                      type="button"
                      onClick={() => setSelectedOverviewStage(stg.stage)}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition ${
                        isSel
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
                          : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                      }`}
                    >
                      <div>
                        <span
                          className={`text-[11px] font-extrabold ${
                            isSel ? 'text-slate-900' : 'text-amber-300'
                          }`}
                        >
                          Stage {stg.stage}
                        </span>
                        <div
                          className={`text-xs font-bold mt-1 leading-snug line-clamp-2 ${
                            isSel ? 'text-slate-950' : 'text-white'
                          }`}
                        >
                          {stg.title}
                        </div>
                      </div>
                      <div
                        className={`text-[10px] mt-2 font-semibold ${
                          isSel ? 'text-slate-800' : 'text-blue-200'
                        }`}
                      >
                        {stg.timeline}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Stage Detail Card */}
              {(() => {
                const stg =
                  EIGHT_STAGE_WORKFLOW.find((s) => s.stage === selectedOverviewStage) ||
                  EIGHT_STAGE_WORKFLOW[3];
                return (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-700/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-extrabold text-xs">
                          Stage {stg.stage}
                        </span>
                        <span className="font-bold text-sm text-white">{stg.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-950 border border-blue-700 text-blue-200">
                          Actor: {stg.actor} · SLA: {stg.timeline}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{stg.description}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {stg.checks.map((c, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-700 text-emerald-300"
                          >
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('informant')}
                      className="px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold shrink-0"
                    >
                      Open Step {parseInt(stg.stage, 10)} in Checklist →
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* 1D. Central Schemes Snapshot */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Central ST Scholarship &amp; Fellowship Schemes
                  </h2>
                  <p className="text-xs text-slate-600">
                    Financial assistance programs administered under the Ministry of Tribal Affairs (MoTA)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('schemes')}
                  className="text-xs font-bold text-[#2563EB] hover:underline"
                >
                  View All Central ST Schemes →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CENTRAL_ST_SCHEMES.map((scm) => (
                  <div
                    key={scm.code}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#2563EB] hover:shadow-md transition flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#1E3A8A]">
                          {scm.code}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">{scm.slots}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {scm.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">{scm.targetGroup}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-xs space-y-2">
                      <div>
                        <div className="font-semibold text-[#16A34A]">{scm.benefits}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{scm.incomeLimit}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openSchemeInInformant(scm.code)}
                        className="w-full py-1.5 px-2.5 rounded bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-[11px] transition flex items-center justify-between"
                      >
                        <span>Open {scm.code} 8-Step Checklist</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

        {/* ====================================================================
            TAB 2: CORE FEATURES & STATUTORY GOVERNANCE CAPABILITIES
            ==================================================================== */}
        {activeTab === 'features' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="max-w-3xl space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                  Enterprise Architecture &amp; Statutory Governance
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  Core Platform Features &amp; Verification Engines
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Built on Google Cloud Vision API document verification, MeitY Bhashini multilingual translation, UIDAI Aadhaar Data Vault deduplication, and PFMS SNA SPARSH just-in-time direct benefit transfers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTabChange('informant')}
                className="px-4 py-2.5 rounded-lg bg-[#D97706] hover:bg-amber-600 text-white text-xs font-bold shrink-0"
              >
                Open Student Informant Checklist →
              </button>
            </div>

            <div className="space-y-6">
              {PLATFORM_CAPABILITIES.map((cap, idx) => (
                <div
                  key={cap.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col lg:flex-row gap-6 items-start"
                >
                  <div className="lg:w-1/3 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-blue-50 text-[#1E3A8A] border border-blue-200 flex items-center justify-center shrink-0">
                        <Icon name={cap.icon} className="w-5 h-5" />
                      </span>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Governance Module 0{idx + 1}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">{cap.title}</h3>
                      </div>
                    </div>
                    <div className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                      Primary Stakeholders: {cap.stakeholderTag}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{cap.description}</p>
                  </div>

                  <div className="lg:w-2/3 bg-slate-50 border border-slate-200 rounded-lg p-5 w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Key Technical Capabilities &amp; Statutory Safeguards
                      </div>
                      <span className="text-xs font-semibold text-[#16A34A]">
                        ● Active in Production
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cap.keyBenefits.map((bnf, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Icon name="checkc" className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>{bnf}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Architecture Safeguards Summary */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Icon name="shield" className="w-5 h-5 text-amber-400" />
                <span>Statutory Compliance &amp; Security Baseline</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="font-bold text-white">Digital Personal Data Protection (DPDP 2023)</div>
                  <div className="text-slate-400">
                    Zero public exposure of student dossiers. All sensitive records encrypted at rest with AES-256 and in transit with TLS 1.3.
                  </div>
                </div>
                <div className="p-3.5 rounded bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="font-bold text-white">Aadhaar Data Vault &amp; Tokenization</div>
                  <div className="text-slate-400">
                    Compliant with UIDAI regulations. 12-digit Aadhaar numbers are securely hashed into SHA-256 tokens for deduplication.
                  </div>
                </div>
                <div className="p-3.5 rounded bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="font-bold text-white">GIGW 3.0 &amp; WCAG 2.1 AA Standard</div>
                  <div className="text-slate-400">
                    Compliant with Guidelines for Indian Government Websites, including multilingual toggle, font scaling, and screen reader labels.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: 8-STAGE DIGITAL VERIFICATION & DISBURSAL LIFECYCLE
            ==================================================================== */}
        {activeTab === 'workflow' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Official 8-Stage Lifecycle Header */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Ministry of Tribal Affairs · Standard Operating Procedure
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    8-Stage Digital Verification &amp; DBT Disbursal Lifecycle
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveWorkflowStageIdx((prev) => (prev > 0 ? prev - 1 : 7))
                    }
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-slate-700"
                  >
                    ◀ Previous Stage
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveWorkflowStageIdx((prev) => (prev < 7 ? prev + 1 : 0))
                    }
                    className="px-3 py-1.5 rounded bg-[#2563EB] hover:bg-blue-500 text-xs font-bold"
                  >
                    Next Stage ▶
                  </button>
                </div>
              </div>

              {/* 8-Stage Progress Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {EIGHT_STAGE_WORKFLOW.map((st, idx) => {
                  const isCurrent = idx === activeWorkflowStageIdx;
                  const isPassed = idx < activeWorkflowStageIdx;
                  return (
                    <button
                      key={st.stage}
                      type="button"
                      onClick={() => setActiveWorkflowStageIdx(idx)}
                      className={`p-2.5 rounded-lg border text-left transition ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-md'
                          : isPassed
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="text-[10px] font-bold">
                        {isPassed ? `✓ Stage ${st.stage}` : `Stage ${st.stage}`}
                      </div>
                      <div className="text-xs font-bold truncate mt-0.5">{st.title}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Stage Detail Panel */}
              {(() => {
                const st = EIGHT_STAGE_WORKFLOW[activeWorkflowStageIdx] || EIGHT_STAGE_WORKFLOW[0];
                return (
                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#2563EB] text-white text-xs font-bold">
                          Stage {st.stage} of 08
                        </span>
                        <h3 className="text-base font-bold text-white">{st.title}</h3>
                        <span className="text-xs text-amber-300 font-semibold">
                          Authority: {st.actor} ({st.timeline})
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 max-w-3xl">{st.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('informant')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0"
                    >
                      Open Step {activeWorkflowStageIdx + 1} in Student Checklist →
                    </button>
                  </div>
                );
              })()}
            </div>

            <div className="space-y-4">
              {EIGHT_STAGE_WORKFLOW.map((step, idx) => {
                const isSelected = idx === activeWorkflowStageIdx;
                return (
                  <div
                    key={step.stage}
                    onClick={() => setActiveWorkflowStageIdx(idx)}
                    className={`bg-white border rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row gap-5 items-start cursor-pointer transition ${
                      isSelected
                        ? 'border-[#2563EB] ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {/* Left Badge */}
                    <div className="flex md:flex-col items-center justify-between md:justify-center w-full md:w-28 shrink-0 pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-slate-200 pr-0 md:pr-4">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A]">
                        Stage {step.stage}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1E3A8A] mt-1">
                        {step.timeline}
                      </span>
                    </div>

                    {/* Middle Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          Responsible: {step.actor}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2563EB] text-white">
                            ● Active Stage
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Right Checkpoints */}
                    <div className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Key Verification Checks
                      </div>
                      {step.checks.map((chk, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Icon name="checkc" className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                          <span>{chk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: INTERACTIVE CENTRAL ST SCHEMES MATCHER & ELIGIBILITY
            ==================================================================== */}
        {activeTab === 'schemes' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Interactive Scheme Matcher & Income Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="max-w-2xl space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                    Interactive Ministry Scheme Finder
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Find Your Eligible MoTA Scholarship &amp; Open Its Checklist
                  </h2>
                  <p className="text-xs text-slate-600">
                    Filter by your current study level and adjust the family income slider to see which Central ST schemes you qualify for.
                  </p>
                </div>

                {/* Live Family Income Slider */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 w-full lg:w-80 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>Your Annual Family Income:</span>
                    <span className="text-[#1E3A8A] font-mono">₹{schemeUserIncome.toFixed(2)} Lakh/yr</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="9.0"
                    step="0.25"
                    value={schemeUserIncome}
                    onChange={(e) => setSchemeUserIncome(parseFloat(e.target.value))}
                    className="w-full accent-[#1E3A8A]"
                  />
                  <div className="text-[11px] text-slate-500">
                    {schemeUserIncome <= 2.25
                      ? '✓ Qualifies for ALL 5 MoTA Central ST Schemes (≤ ₹2.25L)'
                      : schemeUserIncome <= 2.5
                      ? '✓ Qualifies for 4 Schemes: POST-MATRIC, TOP-CLASS, NOS & NFST'
                      : schemeUserIncome <= 4.5
                      ? '✓ Qualifies for 3 Schemes: TOP-CLASS (≤ ₹4.50L), NOS (≤ ₹6.00L) & NFST'
                      : schemeUserIncome <= 6.0
                      ? '✓ Qualifies for 2 Schemes: NOS (≤ ₹6.00L) & NFST (Open Merit)'
                      : '✓ Qualifies for NFST Doctoral Fellowship (No Income Cap)'}
                  </div>
                </div>
              </div>

              {/* Study Level Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ALL', label: 'All 5 Central Schemes' },
                  { id: 'PRE_MATRIC', label: 'Classes IX & X (School)' },
                  { id: 'POST_MATRIC', label: 'Class XI–XII, Diploma, UG & PG' },
                  { id: 'TOP_CLASS', label: 'Premier IIT / NIT / IIM / AIIMS' },
                  { id: 'NFST', label: 'M.Phil / Ph.D. Doctoral Research' },
                  { id: 'NOS', label: 'Foreign University (Master’s / Ph.D. Abroad)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSchemeLevelFilter(f.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                      schemeLevelFilter === f.id
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {CENTRAL_ST_SCHEMES.filter(
                (s) => schemeLevelFilter === 'ALL' || s.code === schemeLevelFilter
              ).map((scheme) => {
                const cap =
                  scheme.code === 'NFST'
                    ? 99
                    : scheme.code === 'NOS'
                    ? 6.0
                    : scheme.code === 'TOP_CLASS'
                    ? 4.5
                    : scheme.code === 'POST_MATRIC'
                    ? 2.5
                    : 2.25;
                const incomeEligible = schemeUserIncome <= cap;
                return (
                  <div
                    key={scheme.code}
                    className={`bg-white border rounded-xl p-6 shadow-sm space-y-4 transition ${
                      incomeEligible ? 'border-slate-200' : 'border-amber-300 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded bg-[#1E3A8A] text-white font-mono font-bold text-xs">
                            {scheme.code}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            {scheme.name}
                          </h3>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${
                              incomeEligible
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {incomeEligible
                              ? `✓ Income Eligible (₹${schemeUserIncome.toFixed(2)}L)`
                              : `⚠ Above ₹${cap.toFixed(2)}L Cap`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{scheme.targetGroup}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {scheme.slots}
                        </span>
                        <button
                          type="button"
                          onClick={() => openSchemeInInformant(scheme.code)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#D97706] hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
                        >
                          Open Interactive {scheme.code} Checklist →
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 font-medium block">Statutory Income Ceiling</span>
                        <strong className="text-slate-900 text-sm mt-0.5 block">{scheme.incomeLimit}</strong>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 font-medium block">Financial Benefits &amp; Allowances</span>
                        <strong className="text-[#16A34A] text-sm mt-0.5 block">{scheme.benefits}</strong>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 font-medium block">DBT Mode &amp; Transfer Mechanism</span>
                        <strong className="text-slate-900 text-sm mt-0.5 block">{scheme.dbtMode}</strong>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Mandatory Statutory Eligibility Documents
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                        {scheme.keyRequirements.map((req, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                            <Icon name="checkc" className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 5: EMPANELED INSTITUTES DIRECTORY (AISHE / UDISE+)
            ==================================================================== */}
        {activeTab === 'institutes' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="max-w-3xl space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                    Interactive Public Directory
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    AISHE &amp; UDISE+ Empaneled Institutional Registry
                  </h2>
                  <p className="text-xs text-slate-600">
                    Click any institution row below to inspect its live Level-1 INO Nodal Officer KYC status and supported MoTA schemes.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#16A34A] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md shrink-0">
                  100% AISHE / UDISE+ API Synchronized
                </span>
              </div>

              {/* Search & State Filter Controls */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                  <Icon
                    name="search"
                    className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  <input
                    type="text"
                    value={aisheSearch}
                    onChange={(e) => setAisheSearch(e.target.value)}
                    placeholder="Search by AISHE Code (e.g. C-35728) or College / School Name..."
                    className="w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus-ring"
                  />
                </div>
                <div>
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 focus-ring"
                  >
                    <option value="All">All 36 States / UTs (Pan-India AISHE &amp; UDISE+)</option>
                    <optgroup label="Fifth Schedule Heartland &amp; Central Belt (75:25 Split)">
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh (90:10 Split)</option>
                    </optgroup>
                    <optgroup label="North-East &amp; Sixth Schedule States (90:10 Split)">
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Assam">Assam</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Sikkim">Sikkim</option>
                    </optgroup>
                    <optgroup label="Southern, Eastern, Northern &amp; Union Territories">
                      <option value="Uttarakhand">Uttarakhand (90:10 Split)</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Delhi">Delhi (NCT)</option>
                      <option value="Ladakh">Ladakh &amp; Jammu &amp; Kashmir (UT)</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            {/* Interactive Selected Institute Live KYC Inspector */}
            {selectedInstitute && (
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-bold text-xs">
                      {selectedInstitute.code}
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedInstitute.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300">
                      ✓ {selectedInstitute.kycStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Designated Level-1 INO:</strong> {selectedInstitute.inoOfficer} ·{' '}
                    <span className="font-mono">{selectedInstitute.inoContact}</span>
                  </p>
                  <p className="text-[11px] text-blue-300">
                    Supported MoTA Schemes: Post-Matric ST, Top Class Education, NFST Doctoral Fellowship · Average INO Verification SLA: 3.2 Days
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('informant')}
                  className="px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold shrink-0"
                >
                  Open Student Checklist for This Institute →
                </button>
              </div>
            )}

            {/* Public Institute Directory Table (Purely Institutional) */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">AISHE / UDISE+ Code</th>
                      <th className="py-3 px-4">Institution Name &amp; Category</th>
                      <th className="py-3 px-4">State / Jurisdiction</th>
                      <th className="py-3 px-4">Level-1 INO (Nodal Officer)</th>
                      <th className="py-3 px-4">Official Contact</th>
                      <th className="py-3 px-4 text-right">KYC e-Sign Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredInstitutes.length > 0 ? (
                      filteredInstitutes.map((inst) => {
                        const isSel = selectedInstitute?.code === inst.code;
                        return (
                          <tr
                            key={inst.code}
                            onClick={() => setSelectedInstitute(inst)}
                            className={`cursor-pointer transition-colors ${
                              isSel ? 'bg-blue-50/80' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-[#1E3A8A]">
                              {inst.code}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{inst.name}</div>
                              <div className="text-[11px] text-slate-500">{inst.type}</div>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-800">{inst.state}</td>
                            <td className="py-3.5 px-4 font-semibold text-slate-900">{inst.inoOfficer}</td>
                            <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{inst.inoContact}</td>
                            <td className="py-3.5 px-4 text-right">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-[#16A34A] border border-emerald-200 font-semibold text-[11px]">
                                <Icon name="checkc" className="w-3 h-3" />
                                {inst.kycStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                          No institutions match your search filter &ldquo;{aisheSearch}&rdquo;.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 7. COMPLIANCE & HELP MODAL */}
      {footerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setFooterModal(null)} />
          <div className="relative bg-white border border-slate-200 rounded-lg shadow-xl max-w-lg w-full p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h4 className="font-bold text-slate-900 text-base">{footerModal.title}</h4>
              <button
                type="button"
                onClick={() => setFooterModal(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Close ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{footerModal.body}</p>
          </div>
        </div>
      )}

      {/* 8. FOOTER & COMPLIANCE */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#0F172A] border border-blue-700 text-[#D97706] flex items-center justify-center shrink-0">
                <Icon name="landmark" className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  MoTA ScholarConnect — Scholarship &amp; Fellowship Management System
                </div>
                <div className="text-xs text-slate-400">
                  Ministry of Tribal Affairs · Government of India (SIH26239)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                <Icon name="shieldcheck" className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Single Central ST Governance Portal</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {[
                {
                  label: 'NIC Portal Disclaimer',
                  body: 'This portal is maintained for the Ministry of Tribal Affairs (MoTA), Government of India. All scholarship and fellowship sanctions are subject to statutory Level-1 INO institutional verification, State e-District authentication, and PFMS SNA SPARSH validation.',
                },
                {
                  label: 'CPGRAMS Grievance Redressal',
                  body: 'Scholars, students, and Institute Nodal Officers may lodge grievances regarding delayed Level-1 INO verification or NPCI Aadhaar-seeding failures via the Centralized Public Grievance Redress and Monitoring System (pgportal.gov.in).',
                },
                {
                  label: 'NSP & MoTA Helpdesk',
                  body: 'National Scholarship Portal (NSP) & MoTA Technical Helpdesk: 0120-6619540 | helpdesk@nsp.gov.in (Monday to Friday, 09:00 AM to 05:30 PM IST).',
                },
                {
                  label: 'Privacy Policy (DPDP Act)',
                  body: 'Aadhaar numbers are processed strictly through the Aadhaar Data Vault and NPCI Mapper tokenisation in compliance with UIDAI and Digital Personal Data Protection Act 2023 regulations.',
                },
                {
                  label: 'Accessibility Statement',
                  body: 'Compliant with Guidelines for Indian Government Websites (GIGW 3.0) and WCAG 2.1 Level AA standards, including screen-reader compatibility and font-size scaling controls.',
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setFooterModal({ title: item.label, body: item.body })}
                  className="hover:text-white underline-offset-4 hover:underline transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="text-slate-400 font-medium">
              Designed &amp; Maintained for Ministry of Tribal Affairs (MoTA) — Smart India Hackathon.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
