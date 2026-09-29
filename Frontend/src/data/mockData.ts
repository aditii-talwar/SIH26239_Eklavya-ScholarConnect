import {
  University,
  Company,
  AITool,
  FieldUpdate,
  Student,
  Opportunity,
  RoadmapItem,
  ResearchPaper,
  Academician,
  NotificationItem,
  SchemeRuleQuestionnaire,
  HomepageUpdateItem,
  CourseFeedbackItem,
} from '../types';

export const UNIVERSITIES: University[] = [
  { id: 'u1', name: 'Jawaharlal Nehru University (JNU) — Nodal NFST Host', students: 420, avgSkill: 91, improvement: 16, city: 'New Delhi' },
  { id: 'u2', name: 'Indian Institute of Science (IISc) — STEM Fellowship Host', students: 310, avgSkill: 94, improvement: 18, city: 'Bengaluru' },
  { id: 'u3', name: 'Tata Institute of Social Sciences (TISS) — Tribal Studies Host', students: 385, avgSkill: 89, improvement: 15, city: 'Mumbai' },
  { id: 'u4', name: 'Central University of Jharkhand (CUJ) — Regional ST Hub', students: 510, avgSkill: 87, improvement: 14, city: 'Ranchi' },
];

export const COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'MoTA National Fellowship for ST (NFST) Division',
    field: 'Doctoral & M.Phil. Research in India',
    roles: [
      {
        id: 'r1',
        title: 'NFST Junior / Senior Research Fellow (JRF/SRF)',
        skills: [
          { name: 'ST Certificate Verification', min: 95 },
          { name: 'Post-Graduation Marks', min: 55 },
        ],
      },
      {
        id: 'r2',
        title: 'NFST PVTG Priority Doctoral Track',
        skills: [
          { name: 'ST Certificate Verification', min: 95 },
          { name: 'Research Proposal Merit', min: 70 },
        ],
      },
    ],
  },
  {
    id: 'c2',
    name: 'MoTA National Overseas Scholarship (NOS) Wing',
    field: "Master's & Ph.D. Programmes Abroad (QS Top 500)",
    roles: [
      {
        id: 'r3',
        title: 'NOS Overseas Scholar (Master’s / Ph.D.)',
        skills: [
          { name: 'Income Ceiling Compliance', min: 90 },
          { name: 'Post-Graduation Marks', min: 60 },
        ],
      },
    ],
  },
  {
    id: 'c3',
    name: 'MoTA Top Class Education & Post-Matric DBT Cell',
    field: 'Premier Institutes (IIT / IIM / AIIMS / NIT)',
    roles: [
      {
        id: 'r4',
        title: 'Top Class Education ST Scholar',
        skills: [
          { name: 'ST Certificate Verification', min: 95 },
          { name: 'Income Ceiling Compliance', min: 90 },
        ],
      },
    ],
  },
];

export const AI_TOOLS: AITool[] = [
  {
    id: 'a1',
    name: 'MoTA Vision-OCR Certificate Authenticity Engine',
    category: 'Document Intelligence',
    desc: 'Extracts Issuing Authority, Barcode/QR seal, Sub-Tribe/PVTG classification, and Issue Date from uploaded Scheduled Tribe (ST) certificates.',
    use: 'Instant 99.2% accuracy pre-verification before Nodal Scrutiny Officer review.',
  },
  {
    id: 'a2',
    name: 'DigiLocker & e-District Income Cross-Verifier',
    category: 'Eligibility Automation',
    desc: 'Cross-verifies Tehsildar/Revenue Officer annual family income certificates and ITR acknowledgments against the ₹6.00 LPA ceiling.',
    use: 'Automatically flags expired income certificates or missing signature seals.',
  },
  {
    id: 'a3',
    name: 'Configurable Scheme Eligibility Rule Engine',
    category: 'Scheme Rule Engine',
    desc: 'Executes dynamic scheme-specific rules (PG >= 55% for NFST, UG/PG >= 60% & age < 35 yrs for NOS, QS World Ranking <= 500 check).',
    use: 'Computes deterministic pass/fail eligibility across all MoTA schemes.',
  },
  {
    id: 'a4',
    name: 'Composite Merit & Human-in-the-Loop Ranking AI',
    category: 'Merit Screening',
    desc: 'Combines academic score, research proposal originality, PVTG/women reservation weightage, and university rank into an auditable merit score.',
    use: 'Assists the MoTA Selection Committee while preserving 100% human oversight.',
  },
];

export const FIELD_UPDATES: FieldUpdate[] = [
  {
    id: 'lib-1',
    field: 'NFST Scheme Guidelines',
    title: 'National Fellowship for Scheduled Tribes (NFST) 2026-27 — Official Guidelines & JRF/SRF Norms',
    summary: 'Complete MoTA scheme document covering 750 annual fellowship slots, PVTG reservation, JRF (@ ₹37,000/mo) to SRF (@ ₹42,000/mo) upgradation, HRA, and ₹25,000 annual contingency norms.',
    materialType: 'Study Material',
    officerName: 'Dr. Rajeshwar Meena (MoTA NFST Division)',
    durationOrSize: '38 Pages · Official MoTA PDF',
    resourceUrl: 'https://tribal.nic.in/',
    addedDate: 'Sep 24, 2026',
  },
  {
    id: 'lib-2',
    field: 'NOS Overseas Guidelines',
    title: 'National Overseas Scholarship (NOS) 2026-27 — Master’s & Ph.D. Abroad Rulebook',
    summary: 'Detailed eligibility rules for 20 annual awards (17 ST + 3 PVTG), eligible QS Top-500 foreign universities, USD $15,400/yr maintenance allowance, tuition coverage, and visa/surety bond formats.',
    materialType: 'Presentation',
    officerName: 'Shri Vikramaditya Negi (MoTA NOS Wing)',
    durationOrSize: '28 Slides · NOS Briefing Deck',
    resourceUrl: 'https://overseas.tribal.gov.in/',
    addedDate: 'Sep 22, 2026',
  },
  {
    id: 'lib-3',
    field: 'AI OCR & Document Checklist',
    title: 'Standard Operating Procedure: Uploading DigiLocker ST, Income & Domicile Certificates',
    summary: 'Video walkthrough for ST applicants on scanning barcoded caste certificates, valid current-financial-year Tehsildar income certificates (< ₹6.00 LPA), and resolving AI OCR deficiency flags.',
    materialType: 'Recorded Lecture',
    officerName: 'Dr. Anusuya Korram (Scrutiny & Verification Cell)',
    durationOrSize: '24 mins · Applicant Walkthrough Video',
    resourceUrl: 'https://fellowship.tribal.gov.in/',
    addedDate: 'Sep 20, 2026',
  },
  {
    id: 'lib-4',
    field: 'PFMS DBT & Continuance',
    title: 'Post-Selection Fellowship Management: Annexures I–VI, HRA, Contingency & QPR Submission',
    summary: 'Step-by-step guide for selected NFST/NOS fellows on uploading Verification & Continuation Certificates, Quarterly Progress Reports (QPR), and tracking Aadhaar-seeded PFMS DBT tranches.',
    materialType: 'Study Material',
    officerName: 'Dr. ChuniBala Tudu (MoTA PFMS DBT Cell)',
    durationOrSize: '44 Pages · Fellow Handbook PDF',
    resourceUrl: 'https://pfms.nic.in/',
    addedDate: 'Sep 18, 2026',
  },
  {
    id: 'lib-5',
    field: 'Deficiency Resolution',
    title: 'How to Respond to Scrutiny Deficiency Memos & Resubmit Clarified Documents',
    summary: 'Presentation guide explaining common scrutiny queries (blurred Tehsildar seal, CGPA-to-percentage conversion formula sheet missing, Ph.D. synopsis format) and 7-day SLA resubmission.',
    materialType: 'Presentation',
    officerName: 'Dr. Rajeshwar Meena (MoTA NFST Division)',
    durationOrSize: '22 Slides · Deficiency Guide',
    resourceUrl: 'https://tribal.nic.in/',
    addedDate: 'Sep 15, 2026',
  },
];

export function mkStudent(p: Partial<Student> & { id: string; name: string; university: string; field: string; role: string }): Student {
  return {
    verified: true,
    resumeHistory: [78, 82, 86, 90, 93, 96],
    discipline: 94,
    punctuality: 96,
    consistency: 92,
    potential: 95,
    weeklyImprovement: 12,
    resumeScore: 9.4,
    qualification: 'M.A. / M.Sc. (82.4% Marks) · UGC-NET Qualified · Registered Ph.D. Scholar',
    priorExperience: 'Scheduled Tribe (Santhal) · Annual Family Income: ₹2,45,000 (< ₹6.00 LPA Ceiling) · Research Topic: AI-Driven Forest Rights & Livelihood Mapping in Fifth Schedule Areas.',
    interests: 'NFST Doctoral Fellowship, Indigenous Socio-Economic Policy, Geospatial Tribal Welfare Analytics, Forest Rights Act (FRA) Digitization',
    certificates: [
      {
        id: 'cert-1',
        title: 'Scheduled Tribe (ST) Caste Certificate — e-District / DigiLocker Verified',
        issuer: 'Sub-Divisional Magistrate (SDM), Dumka, Jharkhand',
        issueDate: 'Verified · Barcode #JH-ST-2026-88412',
        credentialUrl: 'https://digilocker.gov.in',
        skills: ['ST Certificate Verification', 'Domicile & Category Verified'],
      },
      {
        id: 'cert-2',
        title: 'Annual Family Income Certificate (₹2.45 LPA — Within ₹6.00 LPA Ceiling)',
        issuer: 'Circle Officer / Tehsildar Revenue Department',
        issueDate: 'FY 2025-26 · OCR Confidence 98.8%',
        credentialUrl: 'https://digilocker.gov.in',
        skills: ['Income Ceiling Compliance'],
      },
      {
        id: 'cert-3',
        title: 'Post-Graduate Degree Marksheet (82.4% Aggregate) & Ph.D. Admission Letter',
        issuer: 'Jawaharlal Nehru University (JNU), New Delhi',
        issueDate: 'Jul 2026 · Verified by Host Registrar',
        credentialUrl: 'https://jnu.ac.in',
        skills: ['Post-Graduation Marks', 'Research Proposal Merit'],
      },
    ],
    dailyLog: [
      { date: 'Stage 7', topic: 'PFMS DBT Quarter-1 JRF Fellowship Tranche (₹1,31,490) Credited', hours: 'Completed' },
      { date: 'Stage 6', topic: 'MoTA NFST Award Letter #MOTA/NFST/2026/1042 Digitally Issued', hours: 'Completed' },
      { date: 'Stage 5', topic: 'Cleared Nodal Officer Scrutiny & Composite Merit Screening (94.2/100)', hours: 'Verified' },
      { date: 'Stage 3', topic: 'AI OCR Document Intelligence Verification (ST, Income & PG Marksheet)', hours: '99.1% Match' },
    ],
    projects: [
      {
        id: 'p1',
        name: 'ST Caste Certificate & Annual Family Income Certificate (DigiLocker + AI OCR)',
        tech: ['ST Certificate Verification', 'Income Ceiling Compliance', 'OCR 99.2%'],
        review: 'AI OCR Verified: Valid ST (Santhal) certificate issued by Competent Authority; Family income ₹2,45,000/yr verified below ₹6.00 LPA threshold.',
      },
      {
        id: 'p2',
        name: 'Ph.D. Research Synopsis, Host University Bonafide & Continuation Certificate (Annexure-III)',
        tech: ['Post-Graduation Marks', 'Research Proposal Merit', 'PFMS DBT Ready'],
        review: 'Countersigned by Head of Department & Registrar, JNU New Delhi. Approved for Q1 & Q2 JRF + HRA + Contingency release.',
      },
    ],
    skills: [],
    ...p,
  };
}

export const STUDENTS: Student[] = [
  mkStudent({
    id: 's1',
    name: 'Kareena Murmu',
    university: 'Jawaharlal Nehru University (JNU) — Nodal NFST Host',
    field: 'NFST Doctoral Fellowship (Social Sciences & AI Policy)',
    role: 'NFST Ph.D. Fellow · ID: MOTA-NFST-2026-1042',
    resumeScore: 9.4,
    potential: 95,
    discipline: 96,
    consistency: 94,
    weeklyImprovement: 14,
    skills: [
      { name: 'ST Certificate Verification', score: 99, min: 95 },
      { name: 'Income Ceiling Compliance', score: 98, min: 90 },
      { name: 'Post-Graduation Marks', score: 82, min: 55 },
      { name: 'Research Proposal Merit', score: 91, min: 70 },
    ],
  }),
  mkStudent({
    id: 's2',
    name: 'Birsa Oraon',
    university: 'Indian Institute of Science (IISc) — STEM Fellowship Host',
    field: 'National Overseas Scholarship (NOS) — Ph.D. Abroad',
    role: 'NOS Ph.D. Applicant · ID: MOTA-NOS-2026-2089',
    resumeScore: 9.1,
    potential: 93,
    weeklyImprovement: 12,
    skills: [
      { name: 'ST Certificate Verification', score: 98, min: 95 },
      { name: 'Income Ceiling Compliance', score: 95, min: 90 },
      { name: 'Post-Graduation Marks', score: 79, min: 60 },
      { name: 'Research Proposal Merit', score: 88, min: 70 },
    ],
  }),
  mkStudent({
    id: 's3',
    name: 'Jaipal Munda',
    university: 'Tata Institute of Social Sciences (TISS) — Tribal Studies Host',
    field: 'NFST Doctoral Fellowship (Indigenous Public Health)',
    role: 'NFST JRF Scholar · ID: MOTA-NFST-2026-1108',
    resumeScore: 8.9,
    potential: 91,
    weeklyImprovement: 15,
    skills: [
      { name: 'ST Certificate Verification', score: 97, min: 95 },
      { name: 'Income Ceiling Compliance', score: 94, min: 90 },
      { name: 'Post-Graduation Marks', score: 76, min: 55 },
      { name: 'Research Proposal Merit', score: 86, min: 70 },
    ],
  }),
  mkStudent({
    id: 's4',
    name: 'Phulo Baskey',
    university: 'Central University of Jharkhand (CUJ) — Regional ST Hub',
    field: 'NFST PVTG Priority Doctoral Track',
    role: 'NFST PVTG Applicant · ID: MOTA-NFST-2026-1192',
    resumeScore: 8.6,
    potential: 90,
    weeklyImprovement: 11,
    skills: [
      { name: 'ST Certificate Verification', score: 99, min: 95 },
      { name: 'Income Ceiling Compliance', score: 96, min: 90 },
      { name: 'Post-Graduation Marks', score: 71, min: 55 },
      { name: 'Research Proposal Merit', score: 84, min: 70 },
    ],
  }),
  mkStudent({
    id: 's5',
    name: 'Sidhu Kisku',
    university: 'Indian Institute of Science (IISc) — STEM Fellowship Host',
    field: 'Top Class Education for ST Students (M.Tech AI)',
    role: 'Top Class ST Scholar · ID: MOTA-TCE-2026-3014',
    resumeScore: 8.8,
    potential: 89,
    weeklyImprovement: 13,
    skills: [
      { name: 'ST Certificate Verification', score: 98, min: 95 },
      { name: 'Income Ceiling Compliance', score: 92, min: 90 },
      { name: 'Post-Graduation Marks', score: 78, min: 60 },
    ],
  }),
  mkStudent({
    id: 's6',
    name: 'Rani Hansda',
    university: 'Jawaharlal Nehru University (JNU) — Nodal NFST Host',
    field: 'National Overseas Scholarship (NOS) — Master’s Abroad',
    role: 'NOS Master’s Applicant · ID: MOTA-NOS-2026-2140',
    resumeScore: 9.0,
    potential: 92,
    weeklyImprovement: 10,
    skills: [
      { name: 'ST Certificate Verification', score: 97, min: 95 },
      { name: 'Income Ceiling Compliance', score: 93, min: 90 },
      { name: 'Post-Graduation Marks', score: 81, min: 60 },
      { name: 'Research Proposal Merit', score: 85, min: 70 },
    ],
  }),
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'o1',
    title: 'National Fellowship for Scheduled Tribes (NFST) — Ph.D. & M.Phil. (2026-27 Cycle)',
    company: 'Ministry of Tribal Affairs (MoTA) — NFST Division',
    field: 'Doctoral Fellowship (India)',
    skills: ['ST Certificate Verification', 'Post-Graduation Marks', 'Research Proposal Merit', 'Income Ceiling Compliance'],
    match: 98,
    posting_type: 'fellowship_scheme',
    duration: '5 Years (2 Yrs JRF @ ₹37,000/mo + 3 Yrs SRF @ ₹42,000/mo + HRA)',
    mode: '750 Annual Awards · Direct PFMS DBT',
    description: 'Flagship Central Sector Fellowship for Scheduled Tribe scholars pursuing regular, full-time M.Phil. and Ph.D. degrees in Universities/Institutions recognized by UGC. Includes ₹25,000/yr Contingency & Escort/Reader assistance for PwD scholars.',
  },
  {
    id: 'o2',
    title: 'National Overseas Scholarship (NOS) for ST Students — Master’s & Ph.D. Abroad',
    company: 'Ministry of Tribal Affairs (MoTA) — Overseas Wing',
    field: 'Overseas Scholarship (QS Top 500)',
    skills: ['ST Certificate Verification', 'Income Ceiling Compliance', 'Post-Graduation Marks', 'Unconditional Foreign Offer'],
    match: 94,
    posting_type: 'overseas_scholarship',
    duration: 'Up to 4 Years (Ph.D.) / 2 Years (Master’s) · USD $15,400/yr + Full Tuition',
    mode: '20 Annual Awards (17 ST + 3 PVTG)',
    description: 'Financial assistance to meritorious Scheduled Tribe students for pursuing Master’s, Ph.D., and Post-Doctoral courses abroad in accredited top-ranked foreign universities. Covers 100% tuition fee, maintenance allowance, contingency, visa & air passage.',
  },
  {
    id: 'o3',
    title: 'MoTA Top Class Education Scheme for Scheduled Tribe Students (Premier Institutes)',
    company: 'Ministry of Tribal Affairs (MoTA) — Higher Education Cell',
    field: 'UG / PG Scholarship (IIT / IIM / AIIMS / NIT)',
    skills: ['ST Certificate Verification', 'Income Ceiling Compliance', 'Premier Institute Admission'],
    match: 91,
    posting_type: 'scholarship_scheme',
    duration: 'Full Course Duration · Tuition up to ₹2.00L/yr + Stipend + Computer Grant',
    mode: '265 Notified Premier Institutes · PFMS DBT',
    description: 'Supports meritorious ST students who secure admission in notified premier institutes (IITs, IIMs, AIIMS, NITs, NLUs, IISERs). Covers full tuition fee, living expenses (@ ₹3,000/mo), books (@ ₹5,000/yr), and a one-time computer grant.',
  },
  {
    id: 'o4',
    title: 'Post-Matric Scholarship for Scheduled Tribe Students (Higher & Professional Education)',
    company: 'Ministry of Tribal Affairs (MoTA) & State Tribal Welfare Depts',
    field: 'Post-Matric DBT Scheme',
    skills: ['ST Certificate Verification', 'Income Ceiling Compliance', 'Aadhaar-Seeded Bank Account'],
    match: 96,
    posting_type: 'scholarship_scheme',
    duration: 'Annual Renewal · 100% Compulsory Non-Refundable Fees + Maintenance',
    mode: 'National Scholarship Portal (NSP) & MoTA State Bridge',
    description: 'Centrally Sponsored Scheme providing compulsory non-refundable fee reimbursement and monthly academic maintenance allowance to ST students pursuing post-matriculation or post-secondary courses in recognized institutions.',
  },
  {
    id: 'o5',
    title: 'National Overseas Scholarship (NOS) — Post-Doctoral Research Fellowship Abroad',
    company: 'Ministry of Tribal Affairs (MoTA) — Overseas Wing',
    field: 'Post-Doctoral Overseas Track',
    skills: ['ST Certificate Verification', 'Post-Graduation Marks', 'Research Proposal Merit', 'Income Ceiling Compliance'],
    match: 89,
    posting_type: 'overseas_scholarship',
    duration: '1.5 to 2 Years · USD $15,400/yr + USD $1,532 Contingency + Airfare',
    mode: 'QS Top-500 Global Research Labs',
    description: 'Dedicated overseas post-doctoral fellowship enabling Scheduled Tribe Ph.D. holders to conduct advanced STEM, climate, medical, and public policy research at leading international institutions.',
  },
  {
    id: 'o6',
    title: 'MoTA Tribal Research Institute (TRI) Action-Research Doctoral Grant',
    company: 'Ministry of Tribal Affairs (MoTA) — TRI Research Division',
    field: 'Tribal Policy & Indigenous Knowledge',
    skills: ['ST Certificate Verification', 'Research Proposal Merit', 'Post-Graduation Marks'],
    match: 92,
    posting_type: 'fellowship_scheme',
    duration: '2 Years · Action Research Grant + Fieldwork Allowance',
    mode: '27 State Tribal Research Institutes (TRIs)',
    description: 'Special fellowship grant for ST scholars conducting empirical research on Van Dhan Vikas, Forest Rights Act (FRA), Sickle Cell Anemia elimination, and preservation of indigenous tribal languages.',
  },
];

export const ROADMAP: RoadmapItem[] = [
  {
    skill: 'Stage 1–3: NSP OTR Registration, AISHE Mapping & Document OCR Rule Check',
    from: 100,
    to: 100,
    weeks: 1,
    free: 'DigiLocker ST Caste & Tehsildar Income Certificate (< ₹2.50L Ceiling) Auto-Fetch',
    paid: 'AISHE Code Matched, Income OCR Verified & State e-District Barcode Validated',
  },
  {
    skill: 'Stage 4–5: Nodal Scrutiny, Deficiency Resolution & Merit Screening',
    from: 85,
    to: 100,
    weeks: 2,
    free: 'Configurable Scheme Rule Engine Pass + Scrutiny Officer Sign-Off',
    paid: 'Composite Merit Score: 94.2/100 (Human Oversight Approved)',
  },
  {
    skill: 'Stage 6–8: Award Letter Issuance, QPR Upload & PFMS DBT Disbursal',
    from: 75,
    to: 100,
    weeks: 1,
    free: 'Download Digital MoTA Award Letter & Submit Host University Annexure-III',
    paid: 'Aadhaar Payment Bridge (APB) Quarterly JRF/SRF Direct Benefit Transfer',
  },
];

export const PAPERS: ResearchPaper[] = [
  {
    id: 'pp1',
    title: 'National Fellowship for Scheduled Tribes (NFST) 2026-27 — Complete Scheme Guidelines',
    field: 'NFST Scheme Guidelines',
    materialType: 'Study Material',
    durationOrSize: '38 Pages · Official MoTA PDF',
    resourceUrl: 'https://tribal.nic.in/',
    officerName: 'Dr. Rajeshwar Meena (Nodal Scrutiny Officer)',
    uploadedAt: 'Sep 24, 2026',
    desc: 'Official Ministry of Tribal Affairs guidelines detailing eligibility (ST category, PG >= 55%, Ph.D. admission), 750 slots, PVTG priority, and JRF/SRF PFMS disbursement norms.',
    discussions: [
      {
        student: 'Kareena Murmu',
        q: 'If my university uses a 10-point CGPA scale, should I upload the Registrar conversion formula sheet along with the PG marksheet?',
        rating: 5,
        courseOrMaterial: 'NFST 2026-27 Scheme Guidelines',
        date: 'Sep 24, 2026',
        reply: 'Yes, Kareena. Uploading the university CGPA-to-percentage conversion formula prevents a scrutiny deficiency memo during Stage-4 verification.',
      },
    ],
  },
  {
    id: 'pp2',
    title: 'National Overseas Scholarship (NOS) 2026-27 — Foreign University & Income Verification Norms',
    field: 'NOS Overseas Guidelines',
    materialType: 'Presentation',
    durationOrSize: '28 Slides · NOS Scrutiny Deck',
    resourceUrl: 'https://overseas.tribal.gov.in/',
    officerName: 'Dr. Rajeshwar Meena (Nodal Scrutiny Officer)',
    uploadedAt: 'Sep 22, 2026',
    desc: 'Comprehensive deck on NOS eligibility: minimum 60% marks, age < 35 years, total family income from all sources <= ₹6.00 LPA, and unconditional offer from QS Top-500 university.',
    discussions: [
      {
        student: 'Birsa Oraon',
        q: 'Does the ₹6.00 LPA family income ceiling require ITR acknowledgments in addition to the Tehsildar Income Certificate for NOS?',
        rating: 5,
        courseOrMaterial: 'NOS 2026-27 Verification Norms',
        date: 'Sep 23, 2026',
        reply: 'Yes, for NOS overseas awards, both the current-FY Tehsildar Income Certificate and last 2 years ITR/Form-16 (if salaried family member) are cross-verified.',
      },
    ],
  },
  {
    id: 'pp3',
    title: 'Post-Selection PFMS DBT & Quarterly Progress Report (QPR) Annexures I to VI',
    field: 'PFMS DBT & Continuance',
    materialType: 'Study Material',
    durationOrSize: '44 Pages · Fellow DBT Manual',
    resourceUrl: 'https://fellowship.tribal.gov.in/',
    officerName: 'Dr. ChuniBala Tudu (PFMS DBT Officer)',
    uploadedAt: 'Sep 20, 2026',
    desc: 'Templates and instructions for submitting Verification-cum-Continuation Certificate, HRA Certificate, and Annual Contingency Utilization Certificate for uninterrupted DBT.',
    discussions: [
      {
        student: 'Jaipal Munda',
        q: 'Once the Host University Nodal Officer e-signs Annexure-III, how many days does PFMS take to credit the quarterly JRF stipend?',
        rating: 5,
        courseOrMaterial: 'Post-Selection PFMS DBT Manual',
        date: 'Sep 21, 2026',
        reply: 'Once e-signed by your University Registrar and approved by MoTA, the PFMS payment file is generated within 3–5 working days.',
      },
    ],
  },
];

export const ACADEMICIANS: Academician[] = [
  {
    id: 'ac1',
    name: 'Dr. Rajeshwar Meena',
    field: 'NFST & NOS Document Scrutiny & Rule Engine',
    designation: 'Principal Nodal Scrutiny Officer (Director Level)',
    division: 'MoTA Scholarship & Fellowship Scrutiny Cell',
    subjects: ['ST Certificate Verification', 'Post-Graduation Marks', 'Research Proposal Merit', 'Deficiency Adjudication'],
    experienceYears: 16,
    rating: 4.9,
    dossiersAudited: 1420,
    papers: [PAPERS[0], PAPERS[1]],
  },
  {
    id: 'ac2',
    name: 'Dr. Anusuya Korram',
    field: 'DigiLocker, e-District & Income Verification',
    designation: 'Senior Verification & Screening Officer',
    division: 'MoTA AI Document Intelligence & Revenue Audit Wing',
    subjects: ['Income Ceiling Compliance', 'ST Certificate Verification', 'DigiLocker API Audit', 'Duplicate Detection'],
    experienceYears: 12,
    rating: 4.9,
    dossiersAudited: 1180,
    papers: [],
  },
  {
    id: 'ac3',
    name: 'Shri Vikramaditya Negi',
    field: 'Merit Screening & Overseas University Accreditation',
    designation: 'Joint Director — NOS & Selection Committee',
    division: 'MoTA National Overseas Scholarship (NOS) Wing',
    subjects: ['Unconditional Foreign Offer', 'QS Top-500 Verification', 'PVTG Priority Quota', 'Composite Merit Index'],
    experienceYears: 14,
    rating: 4.8,
    dossiersAudited: 890,
    papers: [],
  },
  {
    id: 'ac4',
    name: 'Dr. ChuniBala Tudu',
    field: 'Post-Selection Fellowship & PFMS Direct Benefit Transfer',
    designation: 'Deputy Secretary — Fellowship Disbursal & DBT',
    division: 'MoTA PFMS & Canara/SBI Nodal Disbursal Cell',
    subjects: ['PFMS DBT Ready', 'Quarterly Progress Report (QPR)', 'JRF to SRF Upgradation', 'Contingency & HRA Audit'],
    experienceYears: 11,
    rating: 4.9,
    dossiersAudited: 1650,
    papers: [PAPERS[2]],
  },
];

export const DEFAULT_QUESTIONNAIRES: SchemeRuleQuestionnaire[] = [
  {
    id: 'q-1',
    title: 'NFST 2026-27 Mandatory Automated Eligibility & Document Scrutiny Rule-Set',
    subject: 'ST Certificate Verification',
    officerName: 'Dr. Rajeshwar Meena',
    deadline: '2026-10-15',
    questionCount: 8,
    durationMins: 5,
    passingScore: 90,
    submissionsCount: 642,
    avgScore: 94,
  },
  {
    id: 'q-2',
    title: 'National Overseas Scholarship (NOS) Income Ceiling (<= ₹6.00 LPA) & QS-500 Rule-Set',
    subject: 'Income Ceiling Compliance',
    officerName: 'Dr. Anusuya Korram',
    deadline: '2026-10-20',
    questionCount: 8,
    durationMins: 5,
    passingScore: 90,
    submissionsCount: 184,
    avgScore: 91,
  },
  {
    id: 'q-3',
    title: 'Academic Merit (PG >= 55%) & Ph.D. Research Proposal Screening Checklist',
    subject: 'Post-Graduation Marks',
    officerName: 'Shri Vikramaditya Negi',
    deadline: '2026-10-25',
    questionCount: 8,
    durationMins: 5,
    passingScore: 75,
    submissionsCount: 518,
    avgScore: 86,
  },
];

export const DEFAULT_HOMEPAGE_UPDATES: HomepageUpdateItem[] = [
  {
    id: 'hp-1',
    category: 'Announcement',
    title: 'MoTA National Fellowship for Scheduled Tribes (NFST) 2026-27 Application Portal Open (750 Slots)',
    summary: 'Online applications are invited from Scheduled Tribe research scholars pursuing M.Phil./Ph.D. across recognized Indian universities. AI OCR pre-verification of DigiLocker ST & Income certificates is now live.',
    date: 'Sep 25, 2026',
    division: 'Ministry of Tribal Affairs (MoTA) — Fellowship Division',
    badge: 'NFST 2026-27 Open',
  },
  {
    id: 'hp-2',
    category: 'Notification',
    title: 'Scrutiny Deficiency Resubmission Window Open Till Oct 5, 2026 (NFST & NOS Phase-I)',
    summary: 'Applicants who received automated or Nodal Officer deficiency memos regarding blurred Tehsildar income seals or CGPA conversion sheets must upload clarified PDFs via the Document Vault.',
    date: 'Sep 24, 2026',
    division: 'MoTA Nodal Scrutiny & Verification Cell',
    badge: 'Action Required',
  },
  {
    id: 'hp-3',
    category: 'Achievement',
    title: '₹48.6 Crore Disbursed via PFMS Direct Benefit Transfer (DBT) to 3,450 Active NFST & NOS Scholars',
    summary: 'Quarter-1 & Quarter-2 JRF/SRF fellowships, HRA, and annual contingency grants have been credited directly into Aadhaar-seeded bank accounts with zero manual delay.',
    date: 'Sep 22, 2026',
    division: 'MoTA PFMS & DBT Disbursal Cell',
    badge: '100% Digital DBT',
  },
  {
    id: 'hp-4',
    category: 'New Learning Content',
    title: 'Updated NOS 2026-27 Overseas Rulebook & QS Top-500 Foreign University Eligibility Matrix Published',
    summary: 'Download the revised National Overseas Scholarship guidelines covering 20 annual slots (including 3 PVTG slots), USD $15,400 maintenance norms, and AI document pre-scanner instructions.',
    date: 'Sep 20, 2026',
    division: 'MoTA National Overseas Scholarship (NOS) Wing',
    badge: 'Official Rulebook',
  },
];

export const DEFAULT_FEEDBACKS: CourseFeedbackItem[] = [
  {
    id: 'fb-1',
    applicantName: 'Kareena Murmu (MOTA-NFST-2026-1042)',
    targetTitle: 'National Fellowship for Scheduled Tribes (NFST) — Ph.D. & M.Phil. (2026-27 Cycle)',
    targetType: 'Course',
    rating: 5,
    comment: 'Uploaded my JNU Registrar CGPA-to-percentage conversion certificate (82.4%) and DigiLocker-verified Santhal ST certificate. Requesting Stage-4 scrutiny clearance.',
    date: 'Sep 24, 2026',
    officerReply: 'Verified & Cleared by Nodal Scrutiny Officer Dr. Rajeshwar Meena: Both ST Barcode #JH-ST-2026-88412 and JNU conversion sheet match 100%. Application moved to Merit Selected.',
  },
  {
    id: 'fb-2',
    applicantName: 'Birsa Oraon (MOTA-NOS-2026-2089)',
    targetTitle: 'National Overseas Scholarship (NOS) for ST Students — Master’s & Ph.D. Abroad',
    targetType: 'Course',
    rating: 4,
    comment: 'Resubmitted current Financial Year 2025-26 Tehsildar Family Income Certificate (₹3,10,000/yr) along with unconditional Ph.D. offer letter from University of Oxford.',
    date: 'Sep 23, 2026',
    officerReply: 'Deficiency Resolved: Fresh Tehsildar digital signature verified via e-District API. Forwarded to NOS Screening Committee.',
  },
  {
    id: 'fb-3',
    applicantName: 'Phulo Baskey (MOTA-NFST-2026-1192)',
    targetTitle: 'Post-Selection PFMS DBT & Quarterly Progress Report (QPR) Annexures I to VI',
    targetType: 'Scrutiny Circular',
    rating: 5,
    comment: 'Submitted Q2 Continuation Certificate (Annexure-III) signed by HOD & Dean at Central University of Jharkhand for JRF release.',
    date: 'Sep 21, 2026',
  },
];

// Shared persistence helpers scoped to MoTA ScholarConnect (sih3_project3)
const STORAGE_KEYS = {
  LIBRARY: 'mota_scheme_guidelines_v1',
  QUESTIONNAIRES: 'mota_scrutiny_rules_v1',
  HOMEPAGE_UPDATES: 'mota_homepage_circulars_v1',
  FEEDBACKS: 'mota_deficiency_memos_v1',
};

export function getStoredLibrary(): ResearchPaper[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return PAPERS;
}

export function saveStoredLibrary(items: ResearchPaper[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(items));
  } catch {}
}

export function getStoredQuestionnaires(): SchemeRuleQuestionnaire[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_QUESTIONNAIRES;
}

export function saveStoredQuestionnaires(items: SchemeRuleQuestionnaire[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify(items));
  } catch {}
}

export function getStoredHomepageUpdates(): HomepageUpdateItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HOMEPAGE_UPDATES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_HOMEPAGE_UPDATES;
}

export function saveStoredHomepageUpdates(items: HomepageUpdateItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.HOMEPAGE_UPDATES, JSON.stringify(items));
  } catch {}
}

export function getStoredFeedbacks(): CourseFeedbackItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_FEEDBACKS;
}

export function saveStoredFeedbacks(items: CourseFeedbackItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(items));
  } catch {}
}

export const NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', text: 'AI OCR Verification Complete: Your ST Certificate & Income Certificate scored 99.1% authenticity.' },
  { id: 'n2', text: 'Nodal Scrutiny Officer cleared your NFST 2026-27 application for Final Merit Selection.' },
  { id: 'n3', text: 'PFMS DBT Alert: Quarter-1 JRF Fellowship (₹1,31,490) scheduled for credit to Aadhaar-linked account.' },
];
