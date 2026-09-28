import React, { useState, useEffect } from 'react';
import { Card, Button, PageHeader, Tag, VerifiedBadge, ProgressBar, SkillBar, Modal } from '../common/UIComponents';
import { ResumeScoreCard } from './StudentOverview';
import { Student } from '../../types';
import { studentApi } from '../../api/student';
import { useAuth } from '../../context/AuthContext';

export const StudentProfile: React.FC<{
  student: Student;
  onUpdateProfile?: (updated: Partial<Student>) => void;
  onNavigate?: (tab: string) => void;
}> = ({ student, onUpdateProfile, onNavigate }) => {
  const [editing, setEditing] = useState(false);
  const [college, setCollege] = useState(student.university);
  const [targetRole, setTargetRole] = useState(student.desiredRole || student.role);
  const [qualification, setQualification] = useState(
    student.qualification || student.field || 'M.A. / M.Sc. (82.4% Aggregate) · UGC-NET · Ph.D. Registered'
  );
  const [universityRollNo, setUniversityRollNo] = useState(student.universityRollNo || 'MOTA-NFST-2026-1042');
  const [resumeUrl, setResumeUrl] = useState(student.resumeUrl || 'https://digilocker.gov.in/mota-nfst-dossier');
  const [priorExperience, setPriorExperience] = useState(
    student.priorExperience ||
      'Scheduled Tribe (Santhal) · Annual Family Income: ₹2,45,000 (< ₹6.00 LPA Ceiling) · DigiLocker ST Certificate #JH-ST-2026-88412 · Research Topic: AI-Driven Forest Rights & Livelihood Mapping in Fifth Schedule Areas.'
  );
  const [interests, setInterests] = useState(
    student.interests ||
      'National Fellowship for ST (NFST), National Overseas Scholarship (NOS), Indigenous Socio-Economic Policy, Forest Rights Act (FRA) Digitization'
  );
  const [githubUrl, setGithubUrl] = useState(student.githubUrl || 'https://pfms.nic.in/dbt-tracker');
  const [leetcodeUrl, setLeetcodeUrl] = useState(student.leetcodeUrl || '');
  const [skillsStr, setSkillsStr] = useState(student.skills.map((s) => s.name).join(', '));
  const [apps, setApps] = useState<any[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    let isMounted = true;
    studentApi
      .getMyApplications()
      .then((res) => {
        if (isMounted && res?.my_applications) {
          setApps(res.my_applications);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (currentUser && currentUser.role === 'student') {
      try {
        await studentApi.updateProfile({
          college,
          desired_role: targetRole,
          qualification,
          university_roll_no: universityRollNo,
          resume_url: resumeUrl,
          prior_experience: priorExperience,
          github_url: githubUrl,
          leetcode_url: leetcodeUrl,
          skills: skillsStr,
        });
      } catch {
        // fallback
      }
    }
    if (onUpdateProfile) {
      onUpdateProfile({
        university: college,
        role: targetRole,
        desiredRole: targetRole,
        field: qualification,
        qualification,
        universityRollNo,
        resumeUrl,
        priorExperience,
        interests,
        githubUrl,
        leetcodeUrl,
      });
    }
    setEditing(false);
  };

  const certificates = student.certificates || [
    {
      id: 'cert-1',
      title: 'Scheduled Tribe (ST) Caste Certificate — e-District / DigiLocker Verified',
      issuer: 'Sub-Divisional Magistrate (SDM), Dumka, Jharkhand',
      issueDate: 'Barcode #JH-ST-2026-88412 · AI OCR 99.4%',
      skills: ['ST Certificate Verification', 'Domicile & Category Verified'],
    },
    {
      id: 'cert-2',
      title: 'Annual Family Income Certificate (₹2,45,000/yr — Within ₹6.00 LPA Ceiling)',
      issuer: 'Circle Officer / Tehsildar Revenue Department',
      issueDate: 'FY 2025-26 · AI OCR 98.8%',
      skills: ['Income Ceiling Compliance'],
    },
    {
      id: 'cert-3',
      title: 'Post-Graduate Degree Marksheet (82.4% Aggregate) & Ph.D. Admission Letter',
      issuer: 'Jawaharlal Nehru University (JNU), New Delhi',
      issueDate: 'Verified by Host Registrar',
      skills: ['Post-Graduation Marks', 'Research Proposal Merit'],
    },
  ];

  const interestTags = (student.interests || interests)
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title="ST Applicant & Research Fellow Dossier"
        desc="Your verified Scheduled Tribe (ST) scholarship profile including DigiLocker caste/income credentials, academic marks, research proposal, and PFMS DBT bank linkage."
      />
      <Card className="p-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-full bg-mutedsage/70 flex items-center justify-center font-display text-xl">
            {student.name[0]}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-display text-xl font-semibold">{student.name}</div>
              {student.verified && <VerifiedBadge small />}
              <Tag tone="sage">ST Category Verified (DigiLocker)</Tag>
            </div>
            <div className="text-sm text-[var(--text-muted)]">{student.university}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
              MoTA / NSP Application ID: {student.universityRollNo || universityRollNo}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Tag>{student.qualification || qualification}</Tag>
              <Tag tone="blue">Target Scheme: {student.desiredRole || student.role}</Tag>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-[#E2E8F0] text-xs font-semibold">
              {student.resumeUrl && (
                <a
                  href={student.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sagedeep hover:underline"
                >
                   View DigiLocker e-Dossier ↗
                </a>
              )}
              {student.githubUrl && (
                <a
                  href={student.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-deepblue hover:underline"
                >
                   PFMS Aadhaar DBT Linkage Status ↗
                </a>
              )}
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="inline-flex items-center gap-1 text-amber-700 hover:underline"
                >
                   Open Document Vault & QPR ({certificates.length}) →
                </button>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="border-sagedeep text-sagedeep"
            onClick={() => setEditing(true)}
          >
            Edit ST Dossier
          </Button>
        </div>
      </Card>

      {/* Tribal Category, Family Income, Academic Qualifications & Research Synopsis Block */}
      <Card className="p-5">
        <div className="font-display font-semibold mb-3">
          Scheduled Tribe (ST) Eligibility Attributes, Family Income & Research Synopsis
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
              Academic Qualification & PG Percentage
            </span>
            <p className="text-sm font-medium">{student.qualification || qualification}</p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
              Primary MoTA Scheme & Fellowship Track
            </span>
            <p className="text-sm font-medium">{student.desiredRole || student.role}</p>
          </div>
          <div className="sm:col-span-2 space-y-1 pt-2 border-t border-[#E2E8F0]">
            <span className="font-semibold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
              Tribe / Sub-Tribe Details, Annual Family Income & Doctoral Research Topic
            </span>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {student.priorExperience || priorExperience}
            </p>
          </div>
          <div className="sm:col-span-2 space-y-1.5 pt-2 border-t border-[#E2E8F0]">
            <span className="font-semibold text-[var(--text-muted)] uppercase tracking-wider text-[10px] block">
              Eligible Schemes & Research Focus Areas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {interestTags.map((tag) => (
                <Tag key={tag} tone="sage">{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Uploaded & AI-OCR Verified Certificates */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-display font-semibold">AI-OCR Verified Certificates & Mandatory Annexures</div>
            <p className="text-xs text-[var(--text-muted)]">
              DigiLocker & e-District verified ST Caste Certificate, Annual Family Income Certificate, and University Marksheets.
            </p>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="text-xs text-sagedeep font-semibold hover:underline"
            >
              + Upload Document / QPR Annexure →
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {certificates.map((c) => (
            <div key={c.id} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-emerald-800"> AI OCR Verified</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{c.issueDate}</span>
                </div>
                <div className="text-sm font-semibold text-black">{c.title}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{c.issuer}</div>
              </div>
              {c.skills && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {c.skills.map((sk) => (
                    <Tag key={sk} tone="blue">{sk}</Tag>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <ResumeScoreCard student={student} onNavigate={onNavigate} />

      {/* Active MoTA Scheme Applications */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-display font-semibold">Submitted MoTA Scholarship & Fellowship Applications</div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('applications')}
              className="text-xs text-sagedeep font-semibold hover:underline"
            >
              Open 8-Stage Tracker & Deficiency Memos ({apps.length}) →
            </button>
          )}
        </div>
        {apps.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">
            No scheme applications found. Browse MoTA Schemes to submit your NFST or NOS application!
          </p>
        ) : (
          <div className="space-y-2.5">
            {apps.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
              >
                <div>
                  <div className="text-sm font-semibold text-black">{a.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {a.company_name || a.professor_name || 'Ministry of Tribal Affairs (MoTA)'} · Submitted {a.applied_date || 'Sep 2026'}
                  </div>
                </div>
                <Tag tone={a.status === 'shortlisted' || a.status === 'selected' ? 'sage' : 'blue'}>
                  {a.status === 'shortlisted'
                    ? 'Scrutiny Cleared '
                    : a.status === 'selected'
                    ? 'Award Letter Issued '
                    : 'Under AI Scrutiny'}
                </Tag>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="font-display font-semibold mb-3">Automated Screening & Merit Breakdown</div>
          {[
            ['Document OCR Authenticity Score', student.discipline],
            ['SLA & Annexure Compliance', student.punctuality],
            ['Quarterly Progress Report (QPR) Continuity', student.consistency],
            ['Composite Selection Merit Index', student.potential],
          ].map(([l, v]) => (
            <div key={l as string} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{l}</span>
                <span className="text-[var(--text-muted)]">{v}/100</span>
              </div>
              <ProgressBar value={v as number} />
            </div>
          ))}
        </Card>

        <Card className="p-5">
          <div className="font-display font-semibold mb-3">Verified Scheme Eligibility Parameters</div>
          {student.skills.map((s) => (
            <SkillBar key={s.name} {...s} />
          ))}
          {student.skills.length === 0 && (
            <p className="text-xs text-[var(--text-muted)]">No verified parameters recorded yet.</p>
          )}
        </Card>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} wide={true} title="Edit ST Applicant Dossier">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">Host University / Institution</label>
              <input
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus-ring bg-white text-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">MoTA / NSP Application ID</label>
              <input
                value={universityRollNo}
                onChange={(e) => setUniversityRollNo(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus-ring bg-white text-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">Academic Qualification & PG %</label>
              <input
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus-ring bg-white text-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">Target MoTA Scheme (NFST / NOS / Top Class)</label>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus-ring bg-white text-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">Verified Eligibility Attributes (comma-separated)</label>
              <input
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus-ring bg-white text-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">Research Areas & Schemes (comma-separated)</label>
              <input
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus-ring bg-white text-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">DigiLocker e-Dossier URL</label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus-ring bg-white text-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">PFMS / Bank Mandate Verification URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus-ring bg-white text-black"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)]">
              Tribe / Sub-Tribe Details, Annual Family Income & Research Proposal Summary
            </label>
            <textarea
              rows={2}
              value={priorExperience}
              onChange={(e) => setPriorExperience(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus-ring bg-white text-black"
            />
          </div>
          <Button variant="primary" className="w-full mt-2" onClick={handleSave}>
            Save ST Applicant Profile
          </Button>
        </div>
      </Modal>
    </div>
  );
};
