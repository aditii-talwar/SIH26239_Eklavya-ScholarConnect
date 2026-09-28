import React, { useState } from 'react';
import { Card, Button, StatBlock, PageHeader, Tag, ProgressBar } from '../common/UIComponents';
import { Icon } from '../common/Icon';
import { ROADMAP } from '../../data/mockData';
import { Student, RoadmapItem } from '../../types';

interface StudentRoadmapProps {
  student?: Student;
  onNavigate?: (tab: string) => void;
}

const SCHEME_WORKFLOWS: Record<string, { name: string; tag: string; items: RoadmapItem[] }> = {
  nfst: {
    name: 'National Fellowship for Scheduled Tribes (NFST) — Ph.D. / M.Phil.',
    tag: 'NFST (Doctoral)',
    items: ROADMAP,
  },
  nos: {
    name: 'National Overseas Scholarship (NOS) — Master’s & Ph.D. Abroad',
    tag: 'NOS (Overseas)',
    items: [
      {
        skill: 'Stage 1–3: NSP OTR Registration, Accredited Foreign University Offer & Income Certificate Upload',
        from: 100,
        to: 100,
        weeks: 1,
        free: 'Upload Unconditional Offer Letter from Accredited Foreign University (QS Ranking <= 500)',
        paid: 'Document OCR Verifies ST Certificate, Age < 35 Yrs, UG/PG >= 60% Marks & Tehsildar Income Ceiling',
      },
      {
        skill: 'Stage 4–5: Level-1 Scrutiny, Deficiency Resolution & National Selection Committee Review',
        from: 90,
        to: 100,
        weeks: 2,
        free: 'Respond to any Deficiency Memo within 7 days via DigiLocker Document Vault',
        paid: 'National Selection Committee Merit Ranking (17 ST + 3 PVTG Annual Slots)',
      },
      {
        skill: 'Stage 6–8: Provisional Award Letter, Surety Bond, Visa & Foreign Tuition/Maintenance DBT',
        from: 80,
        to: 100,
        weeks: 2,
        free: 'Execute Solvency/Surety Bond, Passport/Visa Attestation & Air Passage Booking',
        paid: 'USD $15,400/yr Maintenance + 100% Foreign Tuition Fee Disbursed via Indian Mission Abroad',
      },
    ],
  },
  topclass: {
    name: 'Post-Matric ST Scholarship & Top Class Higher Education Scheme',
    tag: 'Post-Matric & Top Class',
    items: [
      {
        skill: 'Stage 1–3: NSP OTR Registration, AISHE / UDISE+ Institution Mapping & Income (< ₹2.50L) Check',
        from: 100,
        to: 100,
        weeks: 1,
        free: 'Link NPCI Aadhaar-Seeded Bank Account & Upload AISHE / UDISE+ Institution Admission Bonafide',
        paid: 'Automated e-District ST Certificate & Gross Annual Family Income (<= ₹2.50 Lakh Ceiling) Validation',
      },
      {
        skill: 'Stage 4–8: Level-1 INO Verification, Level-2 State Nodal Sanction & SNA SPARSH DBT Release',
        from: 95,
        to: 100,
        weeks: 1,
        free: 'Level-1 Institute Nodal Officer (INO) e-Signs Bonafide Enrollment & Fee Structure',
        paid: 'Academic Allowance + Compulsory Non-Refundable Tuition Fee Credited via SNA SPARSH Just-In-Time DBT',
      },
    ],
  },
};

export const StudentRoadmap: React.FC<StudentRoadmapProps> = ({ onNavigate }) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('nfst');
  const activeTrackData = SCHEME_WORKFLOWS[selectedTrack] || SCHEME_WORKFLOWS.nfst;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader
          title="8-Stage MoTA Verification & SNA SPARSH Compliance Guide"
          desc="Standard operating procedure from NSP OTR registration and Level-1 INO verification to State Nodal sanction and SNA SPARSH Just-In-Time DBT disbursement."
        />
        {onNavigate && (
          <Button
            variant="primary"
            onClick={() => onNavigate('aitools')}
            className="shrink-0 flex items-center gap-2 self-start sm:self-auto"
          >
            <Icon name="shieldcheck" className="w-4 h-4" />
            <span>Open Document OCR Verifier</span>
          </Button>
        )}
      </div>

      {/* Scheme Workflow Selector */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-1">
              Selected MoTA Scheme Operating Procedure
            </div>
            <div className="text-base font-bold text-slate-900 flex items-center gap-2 flex-wrap">
              <span>{activeTrackData.name}</span>
              <Tag tone="blue">{activeTrackData.tag}</Tag>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
            {Object.entries(SCHEME_WORKFLOWS).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSelectedTrack(k)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
                  selectedTrack === k
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                    : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {v.tag}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Workflow Stage Cards */}
      <div className="space-y-4">
        {activeTrackData.items.map((r) => (
          <Card key={r.skill} className="p-5">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="font-bold text-slate-900">{r.skill}</div>
              <Tag tone="sage">SLA: {r.weeks} {r.weeks === 1 ? 'Week' : 'Weeks'}</Tag>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-slate-500 w-10">{r.from}%</span>
              <ProgressBar value={r.from} colorClass="bg-[#D97706]" />
              <Icon name="arrowr" className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <ProgressBar value={r.to} colorClass="bg-[#16A34A]" />
              <span className="text-xs font-semibold text-slate-500 w-10">{r.to}%</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] mb-1">
                  Beneficiary / Institute Action Required
                </div>
                <div className="text-xs text-slate-800">{r.free}</div>
              </div>
              <div className="rounded-md bg-slate-50 border border-slate-200 p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Rule Engine & Nodal Officer Output
                </div>
                <div className="text-xs text-slate-800">{r.paid}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const StudentDaily: React.FC<{ student: Student }> = ({ student }) => {
  const [log, setLog] = useState(student.dailyLog);
  const [topic, setTopic] = useState('');
  const [hours, setHours] = useState('Q2 FY 2025–26');
  const [savedBanner, setSavedBanner] = useState(false);

  const disbursements = [
    {
      quarter: 'Quarter 1 (Apr–Jun 2025)',
      type: 'JRF Stipend (@ ₹37,000/mo) + 27% HRA + Contingency',
      amount: '₹1,31,490',
      pfmsId: 'SPARSH-MOTA-2025-Q1-99812',
      status: 'Credited via SNA SPARSH JIT DBT',
      tone: 'sage' as const,
    },
    {
      quarter: 'Quarter 2 (Jul–Sep 2025)',
      type: 'JRF Stipend (@ ₹37,000/mo) + 27% HRA',
      amount: '₹1,40,990',
      pfmsId: 'SPARSH-MOTA-2025-Q2-44108',
      status: 'Level-1 INO Continuation Verified · Scheduled',
      tone: 'blue' as const,
    },
    {
      quarter: 'Quarter 3 (Oct–Dec 2025)',
      type: 'JRF Stipend (@ ₹37,000/mo) + 27% HRA + Annual Contingency',
      amount: '₹1,65,990',
      pfmsId: 'Awaiting Q3 Annexure-III Continuation Upload',
      status: 'Upcoming Tranche',
      tone: 'amber' as const,
    },
  ];

  const submit = () => {
    if (!topic) return;
    setLog([{ date: hours || 'Q2 FY 2025–26', topic, hours: 'Submitted' }, ...log]);
    setTopic('');
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SNA SPARSH Just-In-Time DBT Ledger & Continuation Certificates"
        desc="Track quarterly fellowship/scholarship tranches via PFMS SNA SPARSH, verify NPCI Aadhaar-Seeding status, and log Quarterly Progress Reports (QPR) attested by your Level-1 INO."
      />

      <div className="grid sm:grid-cols-4 gap-3">
        <StatBlock label="Sanctioned Scheme" value="NFST JRF" sub="₹37,000/mo + 27% HRA" />
        <StatBlock label="Total DBT Credited" value="₹1,31,490" sub="SNA SPARSH JIT Linked" />
        <StatBlock label="Next Tranche (Q2)" value="₹1,40,990" sub="INO Continuation Approved" />
        <StatBlock label="NPCI Seeding Status" value="Active" sub="SBI Aadhaar Mapper Verified" />
      </div>

      {/* SNA SPARSH DBT Schedule Table */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <div className="font-bold text-base text-slate-900">
              SNA SPARSH Just-In-Time Direct Benefit Transfer (DBT) Ledger (FY 2025–26)
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Real-time payment file settlement tracking across Reserve Bank of India (RBI), PFMS, and NPCI Aadhaar Payment Bridge.
            </p>
          </div>
          <Tag tone="sage">NPCI Seeding Active</Tag>
        </div>

        <div className="space-y-2.5">
          {disbursements.map((d) => (
            <div
              key={d.quarter}
              className="p-3.5 rounded-md border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="font-bold text-sm text-slate-900">{d.quarter}</div>
                <div className="text-xs text-slate-600">{d.type}</div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">{d.pfmsId}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-base text-[#1E3A8A]">{d.amount}</span>
                <Tag tone={d.tone}>{d.status}</Tag>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Submit Quarterly Progress Report (QPR) / Continuation Log */}
      <Card className="p-5">
        <div className="font-bold text-base text-slate-900 mb-1">
          Submit Quarterly Progress Report (QPR) & Level-1 INO Continuation Attestation
        </div>
        <p className="text-xs text-slate-600 mb-3">
          Record your quarterly attendance / research continuation certificate signed by your Level-1 Institute Nodal Officer (INO) for the next SNA SPARSH DBT release.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Uploaded JNU INO-signed Q2 Continuation Certificate & HRA Annexure-IV"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus-ring"
          />
          <input
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Quarter (e.g. Q2 FY 2025–26)"
            className="sm:w-44 rounded-md border border-slate-300 px-3 py-2 text-sm focus-ring"
          />
          <Button variant="primary" onClick={submit}>
            Submit Continuation Log
          </Button>
        </div>
        {savedBanner && (
          <div className="mt-3 p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            [RECORDED] Continuation certificate entry logged for SNA SPARSH DBT batch processing.
          </div>
        )}
      </Card>

      <Card className="p-5">
        <div className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Beneficiary Verification & Disbursement Audit Trail
        </div>
        <div className="space-y-3">
          {log.map((l, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 text-sm border-b border-slate-200 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-[#1E3A8A] w-28 shrink-0">{l.date}</span>
                <span className="truncate text-slate-800">{l.topic}</span>
              </div>
              <Tag tone="sage">{String(l.hours)}</Tag>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
