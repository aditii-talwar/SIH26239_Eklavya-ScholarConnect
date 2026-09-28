import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  PageHeader,
  StatBlock,
  Tag,
  ProgressBar,
  SkillBar,
  Modal,
  SearchInput,
  EmptyState,
  VerifiedBadge,
} from '../common/UIComponents';
import { University, Student, HomepageUpdateItem } from '../../types';
import { instituteApi } from '../../api/institute';
import { useAuth } from '../../context/AuthContext';
import {
  ACADEMICIANS,
  OPPORTUNITIES,
  getStoredQuestionnaires,
  getStoredLibrary,
  getStoredHomepageUpdates,
  saveStoredHomepageUpdates,
} from '../../data/mockData';

// ============================================================================
// 1. MoTA ADMIN DASHBOARD: MONITOR SCHEMES (NFST/NOS), AI SCRUTINY,
//    AWARD SANCTIONS, MERIT SCREENING & PFMS DBT DISBURSEMENT ANALYTICS
// ============================================================================
export const UniversityOverview: React.FC<{ uni: University; students: Student[] }> = ({
  uni,
  students,
}) => {
  const { currentUser } = useAuth();
  const [liveStats, setLiveStats] = useState<{
    enrolled_students?: number;
    verified_students?: number;
    average_skill_score?: number;
    pfms_disbursed_total?: string;
    avg_processing_days?: string;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (currentUser && currentUser.role === 'institute') {
        try {
          const res = await instituteApi.getDashboard();
          if (res?.institute_stats) {
            setLiveStats(res.institute_stats);
          }
        } catch {
          // fallback
        }
      }
    };
    fetchStats();
  }, [currentUser]);

  const questionnaires = getStoredQuestionnaires();
  const libraryItems = getStoredLibrary();

  const avgAssessmentScore =
    liveStats?.average_skill_score ||
    Math.round(
      students.reduce(
        (a, s) =>
          a + (s.skills.length > 0 ? s.skills.reduce((x, k) => x + k.score, 0) / s.skills.length : 88),
        0
      ) / (students.length || 1)
    );

  const totalApplicants = liveStats?.enrolled_students || students.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={uni.name}
        desc="Centralized Ministry of Tribal Affairs (MoTA) Executive Dashboard for monitoring NFST & NOS fellowship intakes, AI Document Intelligence verification, merit screening, and PFMS Direct Benefit Transfer (DBT) disbursements."
        action={<VerifiedBadge />}
      />

      {/* Primary SIH26239 MoTA Admin Monitoring KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatBlock
          label="Active MoTA Schemes"
          value={OPPORTUNITIES.length}
          sub={`${libraryItems.length} scheme circulars`}
        />
        <StatBlock
          label="ST Applications"
          value={totalApplicants * 145 + 98}
          sub={`${totalApplicants} featured ST dossiers`}
        />
        <StatBlock
          label="AI OCR Verified"
          value="94.2%"
          sub={`${questionnaires.length} automated rule sets`}
        />
        <StatBlock
          label="Avg Merit Score"
          value={`${avgAssessmentScore}%`}
          sub="Human-in-the-loop audited"
        />
        <StatBlock
          label="PFMS DBT Disbursed"
          value={liveStats?.pfms_disbursed_total || '₹48.6 Cr'}
          sub={liveStats?.avg_processing_days || '4.2 days avg turnaround'}
        />
      </div>

      {/* Scheme-wise Application & AI Scrutiny Breakdown */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="font-display font-semibold text-base">
              MoTA Scheme-Wise Application & AI Verification Pipeline
            </div>
            <Tag tone="sage">Live MoTA Telemetry</Tag>
          </div>
          <div className="space-y-3">
            {OPPORTUNITIES.slice(0, 5).map((scheme, idx) => {
              const applicantsCount = 780 - idx * 145;
              const verificationRate = 94 - idx * 4;
              return (
                <div key={scheme.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-black truncate pr-2">{scheme.title}</span>
                    <span className="text-[var(--text-muted)] shrink-0">
                      {applicantsCount} ST applicants · <strong>{verificationRate}% AI verified</strong>
                    </span>
                  </div>
                  <ProgressBar value={verificationRate} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="font-display font-semibold text-base">
              Research Domain-Wise Composite Merit & Scrutiny Readiness
            </div>
            <Tag tone="blue">NFST / NOS Tracks</Tag>
          </div>
          <div className="space-y-3">
            {[...new Set(students.map((s) => s.field))].map((field) => {
              const grp = students.filter((s) => s.field === field);
              const avgScore = Math.round(
                grp.reduce(
                  (x, s) =>
                    x + (s.skills.length > 0 ? s.skills.reduce((y, k) => y + k.score, 0) / s.skills.length : 86),
                  0
                ) / (grp.length || 1)
              );
              return (
                <div key={field} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-black">{field}</span>
                    <span className="text-[var(--text-muted)]">
                      {avgScore}/100 composite merit · {grp.length} ST scholar(s)
                    </span>
                  </div>
                  <ProgressBar value={avgScore} colorClass="bg-deepblue" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// 2. ST APPLICANT, NODAL SCRUTINY OFFICER & ROLE VERIFICATION MODULE
// ============================================================================
interface ManagedUser {
  id: string | number;
  name: string;
  email: string;
  division: string;
  employeeId: string;
  role: 'ST Applicant' | 'Scrutiny Officer' | 'MoTA Admin';
  approvalStatus: 'Verified & Eligible' | 'Pending Scrutiny';
  competencyScore: number;
}

export const UniversityDirectory: React.FC<{ students: Student[] }> = ({ students }) => {
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const [users, setUsers] = useState<ManagedUser[]>(() => {
    const applicantRows: ManagedUser[] = students.map((s, idx) => ({
      id: s.id,
      name: s.name,
      email: idx === 0 ? 'applicant@mota.gov.in' : `${s.name.toLowerCase().replace(/\s+/g, '.')}@stscholar.ac.in`,
      division: s.university,
      employeeId: `MOTA-NFST-2026-104${idx + 2}`,
      role: 'ST Applicant',
      approvalStatus: idx >= 4 ? 'Pending Scrutiny' : 'Verified & Eligible',
      competencyScore: s.potential,
    }));

    const officerRows: ManagedUser[] = ACADEMICIANS.map((t, idx) => ({
      id: t.id,
      name: t.name,
      email: idx === 0 ? 'scrutiny@mota.gov.in' : `${t.name.toLowerCase().replace(/[^a-z]/g, '')}@mota.gov.in`,
      division: t.division || 'MoTA Nodal Scrutiny Cell',
      employeeId: `MOTA-NODAL-20${idx + 1}`,
      role: 'Scrutiny Officer',
      approvalStatus: 'Verified & Eligible',
      competencyScore: 96,
    }));

    return [...applicantRows, ...officerRows];
  });

  useEffect(() => {
    instituteApi
      .getPendingVerifications()
      .then((res: any) => {
        const list = res?.pending_students || res?.students || [];
        if (list.length > 0) {
          const dbApplicants: ManagedUser[] = list.map((st: any) => ({
            id: st.id,
            name: st.name,
            email: st.email,
            division: st.college || 'Central University / IIT Host Institution',
            employeeId: st.university_roll_no || `MOTA-NFST-2026-${st.id}`,
            role: 'ST Applicant',
            approvalStatus: st.verification_status === 'verified' ? 'Verified & Eligible' : 'Pending Scrutiny',
            competencyScore: 91,
          }));
          setUsers((prev) => {
            const officers = prev.filter((u) => u.role !== 'ST Applicant');
            const existingEmails = new Set(dbApplicants.map((d) => d.email.toLowerCase()));
            const extraDemoApplicants = prev.filter(
              (u) => u.role === 'ST Applicant' && !existingEmails.has(u.email.toLowerCase())
            );
            return [...dbApplicants, ...extraDemoApplicants, ...officers];
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleApproveUser = async (u: ManagedUser) => {
    if (typeof u.id === 'number') {
      try {
        await instituteApi.verifyStudent(u.id, 'verified');
      } catch {}
    }
    setUsers((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, approvalStatus: 'Verified & Eligible' } : item))
    );
    setActionToast(`Verified ST Eligibility & Digilocker Dossier for ${u.name} (${u.employeeId})!`);
    setTimeout(() => setActionToast(null), 3000);
  };

  const handleRoleChange = (
    userId: string | number,
    newRole: 'ST Applicant' | 'Scrutiny Officer' | 'MoTA Admin'
  ) => {
    setUsers((prev) =>
      prev.map((item) => {
        if (item.id === userId) {
          setActionToast(`Updated ${item.name}'s MoTA portal role to ${newRole}.`);
          return { ...item, role: newRole };
        }
        return item;
      })
    );
    setTimeout(() => setActionToast(null), 3000);
  };

  const filtered = users.filter((u) => {
    const matchesQ =
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase()) ||
      u.division.toLowerCase().includes(q.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(q.toLowerCase());
    const matchesRole =
      roleFilter === 'All' ||
      u.role === roleFilter ||
      (roleFilter === 'Pending' && u.approvalStatus === 'Pending Scrutiny');
    return matchesQ && matchesRole;
  });

  const pendingCount = users.filter((u) => u.approvalStatus === 'Pending Scrutiny').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="ST Applicant, Nodal Scrutiny Officer & Award Verification"
        desc="Verify ST Tribe/Caste Certificates, Digilocker family income ceilings, and Nodal Scrutiny Officer assignments across MoTA Scholarship & Fellowship schemes."
      />

      {actionToast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <span></span>
          <span>{actionToast}</span>
        </div>
      )}

      <Card className="p-4 space-y-3">
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Search by ST scholar name, Application ID, Host University, or Nodal Officer…"
        />
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {['All', 'ST Applicant', 'Scrutiny Officer', 'MoTA Admin', 'Pending'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRoleFilter(tab)}
                className={
                  'px-3 py-1.5 rounded-full text-xs font-semibold border transition ' +
                  (roleFilter === tab
                    ? 'bg-sagedeep text-pcream border-sagedeep'
                    : 'border-[#E2E8F0] hover:bg-[#F8FAFC]')
                }
              >
                {tab === 'Pending'
                  ? `Pending Scrutiny (${pendingCount})`
                  : tab === 'All'
                  ? 'All Accounts'
                  : `${tab}s`}
              </button>
            ))}
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">
            Showing {filtered.length} MoTA portal accounts
          </span>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((u) => (
          <Card
            key={String(u.id) + u.email}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-mutedsage/60 flex items-center justify-center text-sm font-bold shrink-0">
                {u.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-black">{u.name}</span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">({u.employeeId})</span>
                  <Tag tone={u.approvalStatus === 'Verified & Eligible' ? 'sage' : 'amber'}>
                    {u.approvalStatus === 'Verified & Eligible'
                      ? ' Verified & Eligible'
                      : ' Pending Scrutiny'}
                  </Tag>
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  {u.email} · {u.division}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Role Management Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[var(--text-muted)]">Role:</span>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                  className="rounded-xl border border-[#E2E8F0] px-2.5 py-1.5 text-xs font-semibold bg-white text-black focus-ring"
                >
                  <option value="ST Applicant">ST Applicant</option>
                  <option value="Scrutiny Officer">Scrutiny Officer</option>
                  <option value="MoTA Admin">MoTA Admin</option>
                </select>
              </div>

              {/* Approval Button */}
              {u.approvalStatus === 'Pending Scrutiny' ? (
                <Button
                  variant="primary"
                  className="text-xs py-1.5 px-3"
                  onClick={() => handleApproveUser(u)}
                >
                  Verify ST Eligibility 
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="text-xs py-1.5 px-3 border-sagedeep text-sagedeep"
                  onClick={() => {
                    const found = students.find((s) => s.name === u.name) || students[0];
                    setSelectedStudent(found);
                  }}
                >
                  Inspect Dossier
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && <EmptyState text="No ST applicants or officers match these filters." />}

      <Modal
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent ? `${selectedStudent.name} — ST Fellowship Eligibility & Merit Dossier` : ''}
        wide
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <VerifiedBadge small />
              <Tag>{selectedStudent.field}</Tag>
              <Tag tone="blue">{selectedStudent.university}</Tag>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-[var(--text-muted)] mb-2">
                  AI-Evaluated Research & Eligibility Parameters
                </div>
                {selectedStudent.skills.map((s) => (
                  <SkillBar key={s.name} {...s} />
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--text-muted)] mb-2">
                  Composite Merit & Scrutiny Readiness
                </div>
                {[
                  ['Composite Merit Index', selectedStudent.potential],
                  ['Document Authenticity Score', selectedStudent.discipline],
                  ['Continuation & HRA Compliance', selectedStudent.consistency],
                ].map(([l, v]) => (
                  <div key={l as string} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{l}</span>
                      <span className="text-[var(--text-muted)]">{v}/100</span>
                    </div>
                    <ProgressBar value={v as number} colorClass="bg-deepblue" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ============================================================================
// 3. SCHEME RULE ENGINE & NODAL SCRUTINY OFFICER MAPPING (SIH26239 Requirement)
// ============================================================================
const SCHEME_CATALOG = [
  {
    subject: 'National Fellowship for ST (NFST — Ph.D.)',
    domain: '750 Annual Slots · JRF ₹37,000/mo & SRF ₹42,000/mo in India',
    requiredCompetencies: ['ST Certificate OCR', 'PG >= 55% Verification', 'Ph.D. Synopsis Review'],
  },
  {
    subject: 'National Overseas Scholarship (NOS — Abroad)',
    domain: '20 Annual Slots · Master’s & Ph.D. at Top QS-Ranked Global Universities',
    requiredCompetencies: ['QS Top-500 Offer Verification', 'Family Income < ₹6.0 LPA', 'Age < 35 Check'],
  },
  {
    subject: 'Top Class Education for ST Students',
    domain: 'Premier IIT / IIM / AIIMS / NIT Full Tuition & Living Stipend',
    requiredCompetencies: ['Premier Institute Bonafide', 'Income Ceiling Check', 'PFMS Bank Mandate'],
  },
  {
    subject: 'PVTG Special Doctoral & Research Grant',
    domain: 'Priority Fellowship Track for Particularly Vulnerable Tribal Groups',
    requiredCompetencies: ['PVTG Community Certificate', 'Tribal Research Relevance', 'UGC-NET / JRF'],
  },
  {
    subject: 'Post-Matric ST Scholarship & Continuation DBT',
    domain: 'State-Nodal & PFMS Linked Direct Benefit Transfer',
    requiredCompetencies: ['Digilocker ST Certificate', 'Semester Continuation Report', 'Aadhaar Seeding'],
  },
];

export const UniversityCompetencyMapping: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>(SCHEME_CATALOG[0].subject);
  const [assignedMap, setAssignedMap] = useState<Record<string, string>>({
    'National Fellowship for ST (NFST — Ph.D.)': 'Dr. Rajeshwar Meena',
    'National Overseas Scholarship (NOS — Abroad)': 'Dr. Ananya Soren',
  });

  const activeSubjectObj =
    SCHEME_CATALOG.find((s) => s.subject === selectedSubject) || SCHEME_CATALOG[0];

  // Rank Nodal Scrutiny Officers by domain match with the selected MoTA scheme
  const rankedOfficers = ACADEMICIANS.map((tr, idx) => {
    const trSubjects = (tr.subjects || [tr.field]).map((s) => s.toLowerCase());
    const reqs = activeSubjectObj.requiredCompetencies;
    let matches = 0;
    reqs.forEach((r) => {
      if (
        trSubjects.some(
          (ts) => ts.includes(r.toLowerCase()) || r.toLowerCase().includes(ts)
        )
      ) {
        matches += 1;
      }
    });
    const matchScore = Math.min(99, Math.max(82, Math.round((matches / reqs.length) * 20 + 78 - idx * 3)));
    return {
      ...tr,
      matchScore,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurable Scheme Merit Rules & Nodal Scrutiny Officer Mapping"
        desc="AI-assisted governance to configure scheme-specific eligibility checkpoints and assign Nodal Scrutiny Officers with human-in-the-loop oversight."
      />

      {/* Scheme Selector Pills */}
      <Card className="p-5 space-y-3">
        <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          1. Select MoTA Scheme to Configure Eligibility Checkpoints & Lead Nodal Officer
        </div>
        <div className="flex flex-wrap gap-2">
          {SCHEME_CATALOG.map((item) => (
            <button
              key={item.subject}
              type="button"
              onClick={() => setSelectedSubject(item.subject)}
              className={
                'px-3.5 py-2 rounded-xl text-xs font-semibold border transition ' +
                (selectedSubject === item.subject
                  ? 'bg-sagedeep text-white border-sagedeep shadow-sm'
                  : 'bg-white border-[#E2E8F0] text-black hover:bg-[#F8FAFC]')
              }
            >
              {item.subject}
            </button>
          ))}
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)] border-t border-[#E2E8F0]">
          <span>
            Scheme Scope: <strong className="text-black">{activeSubjectObj.domain}</strong>
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>Mandatory AI Checkpoints:</span>
            {activeSubjectObj.requiredCompetencies.map((rc) => (
              <Tag key={rc} tone="blue">{rc}</Tag>
            ))}
          </div>
        </div>
      </Card>

      {/* Ranked Scrutiny Officers List for Selected Scheme */}
      <div className="space-y-3">
        <div className="font-display font-semibold text-base">
          Recommended Nodal Scrutiny & Screening Officers for "{selectedSubject}"
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {rankedOfficers.map((tr, idx) => {
            const isAssigned = assignedMap[selectedSubject] === tr.name;
            return (
              <Card
                key={tr.id}
                className={`p-5 flex flex-col justify-between gap-4 border ${
                  idx === 0 ? 'border-sagedeep/50' : 'border-[#E2E8F0]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-base text-black">
                          {tr.name}
                        </span>
                        {idx === 0 && <Tag tone="sage">Recommended Lead</Tag>}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {tr.designation} · {tr.division}
                      </div>
                    </div>
                    <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-sagedeep/15 text-sagedeep shrink-0">
                      {tr.matchScore}% Domain Fit
                    </div>
                  </div>

                  <div className="mb-3">
                    <ProgressBar value={tr.matchScore} />
                  </div>

                  <div className="text-xs text-[var(--text-muted)] mb-2">
                    Verified Scrutiny & Screening Specializations:
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(tr.subjects || [tr.field]).map((sub) => (
                      <Tag key={sub} tone="blue">{sub}</Tag>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">
                    {tr.experienceYears || 14} yrs service · {tr.rating || 4.9}  · {tr.traineesTrained || 420}+ dossiers audited
                  </span>
                  <Button
                    variant={isAssigned ? 'sagesolid' : 'primary'}
                    className="text-xs py-1.5 px-3"
                    onClick={() =>
                      setAssignedMap((prev) => ({ ...prev, [selectedSubject]: tr.name }))
                    }
                  >
                    {isAssigned ? 'Assigned Nodal Officer ' : 'Assign Nodal Officer'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. MoTA HOMEPAGE CIRCULAR, MERIT LIST & GUIDELINE PUBLISHER
// ============================================================================
export const UniversityGuidance: React.FC<{ students: Student[] }> = () => {
  const [items, setItems] = useState<HomepageUpdateItem[]>(() => getStoredHomepageUpdates());
  const [category, setCategory] = useState<HomepageUpdateItem['category']>('Announcement');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [division, setDivision] = useState('Ministry of Tribal Affairs (MoTA) — Scholarship Division');
  const [badge, setBadge] = useState('Official MoTA Circular');
  const [publishedBanner, setPublishedBanner] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const newItem: HomepageUpdateItem = {
      id: 'hp-' + Date.now(),
      category,
      title: title.trim(),
      summary: summary.trim(),
      division: division.trim() || 'MoTA Scholarship & Fellowship Division',
      badge: badge.trim() || category,
      date: 'Published Today',
    };

    const next = [newItem, ...items];
    setItems(next);
    saveStoredHomepageUpdates(next);
    setTitle('');
    setSummary('');
    setPublishedBanner(true);
    setTimeout(() => setPublishedBanner(false), 3500);
  };

  const handleDelete = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    saveStoredHomepageUpdates(next);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="MoTA Circulars, Merit Lists & Guideline Publisher"
        desc="Publish official Scheme Notifications, Provisional Merit Lists, Scrutiny SOPs, and PFMS DBT Schedules directly to the MoTA ScholarConnect Homepage."
      />

      <Card className="p-5 space-y-4">
        <div className="font-display font-semibold text-base">
          Publish New Official Circular to MoTA ScholarConnect Homepage
        </div>

        {publishedBanner && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
             Published! This {category} is now live on the MoTA ScholarConnect Homepage.
          </div>
        )}

        <form onSubmit={handlePublish} className="space-y-3.5">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                Circular / Notice Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black font-medium focus-ring"
              >
                <option value="Announcement"> Scheme Announcement / Merit List</option>
                <option value="Notification"> Deficiency / Scrutiny Notice</option>
                <option value="Achievement"> Fellowship Award Milestone</option>
                <option value="New Learning Content"> Updated Scheme Guideline / SOP</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                Issuing MoTA Division / Authority
              </label>
              <input
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black focus-ring"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                Highlight Tag / Scheme Badge
              </label>
              <input
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. NFST 2026-27, NOS Cycle, PFMS DBT"
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black focus-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
              Circular Headline / Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NFST 2026-27 Cycle-I Provisional Merit List & Document Deficiency Window"
              className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm bg-white text-black focus-ring"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
              Detailed Circular Summary (Displayed on Homepage)
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write the official MoTA circular summary, eligibility cutoff details, or PFMS Direct Benefit Transfer instructions…"
              className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm bg-white text-black focus-ring"
            />
          </div>

          <Button variant="primary" type="submit">
            Publish to MoTA Homepage →
          </Button>
        </form>
      </Card>

      {/* Currently Live Homepage Items */}
      <div className="space-y-3">
        <div className="font-display font-semibold text-base">
          Currently Live on MoTA ScholarConnect Homepage ({items.length})
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Tag tone="sage">{item.category}</Tag>
                    {item.badge && <Tag tone="blue">{item.badge}</Tag>}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)]">{item.date}</span>
                </div>
                <div className="font-display font-semibold text-base text-black mb-1">
                  {item.title}
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.summary}</p>
              </div>
              <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] font-medium">{item.division}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-rose-700 font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
