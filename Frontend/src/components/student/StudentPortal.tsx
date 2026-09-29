import React, { useState, useEffect } from 'react';
import { PortalShell } from '../common/PortalShell';
import { StudentOverview } from './StudentOverview';
import { StudentEligibilityEngine } from './StudentEligibilityEngine';
import { StudentVerificationGuide, StudentDbtLedger } from './StudentVerificationGuide';
import { StudentAITools, StudentField } from './StudentAITools';
import { StudentOpportunities } from './StudentOpportunities';
import { StudentApplications } from './StudentApplications';
import { StudentDigiLockerVault } from './StudentDigiLockerVault';
import { StudentProfile } from './StudentProfile';
import { EligibilityCheckModal } from './EligibilityCheckModal';
import { Student, SkillItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../api/student';

const STUDENT_TABS = [
  { key: 'overview',      label: 'Beneficiary Dashboard',       icon: 'home' },
  { key: 'opportunities', label: 'Apply for MoTA Schemes',      icon: 'briefcase' },
  { key: 'applications',  label: 'Level-1 INO & Stage Tracker', icon: 'checkc' },
  { key: 'projects',      label: 'DigiLocker Vault & QPR',      icon: 'file' },
  { key: 'skills',        label: 'Rule Engine Eligibility',     icon: 'target' },
  { key: 'field',         label: 'MoTA Scheme Guidelines',      icon: 'book' },
  { key: 'roadmap',       label: '8-Stage Verification Guide',  icon: 'compass' },
  { key: 'daily',         label: 'SNA SPARSH DBT Ledger',       icon: 'calendar' },
  { key: 'aitools',       label: 'Document OCR & Verification', icon: 'shieldcheck' },
  { key: 'profile',       label: 'ST Beneficiary Profile',      icon: 'user' },
];

export const StudentPortal: React.FC<{ go: (page: string) => void }> = ({ go }) => {
  const [active, setActive] = useState('overview');
  const { currentUser } = useAuth();

  const [student, setStudent] = useState<Student>({
    id: currentUser?.id || 'new',
    name: currentUser?.name || 'Kareena Murmu',
    university: currentUser?.college || 'Jawaharlal Nehru University (JNU) — AISHE Code: U-0109',
    field: 'Post-Matric ST Scholarship & NFST Doctoral Fellowship',
    role: 'National Fellowship for Scheduled Tribes (NFST — Ph.D.)',
    qualification: 'M.A. / M.Sc. (82.4% Aggregate) · AISHE U-0109 Verified · Registered Ph.D. Scholar',
    priorExperience:
      'Scheduled Tribe (Santhal) · Gross Annual Family Income: ₹1,80,000 (Under ₹2.50 Lakh Ceiling) · e-District ST Certificate #JH-ST-2026-88412 · NPCI Aadhaar-Seeding: Active (State Bank of India).',
    interests:
      'Post-Matric ST Scholarship, National Fellowship for ST (NFST), National Overseas Scholarship (NOS), Tribal Socio-Economic Research',
    certificates: [
      {
        id: 'cert-1',
        title: 'Scheduled Tribe (ST) Caste Certificate — e-District / DigiLocker API Verified',
        issuer: 'Sub-Divisional Magistrate (SDM), Dumka, Jharkhand',
        issueDate: 'Cert #JH-ST-2026-88412 · State API Matched',
        credentialUrl: 'https://digilocker.gov.in',
        skills: ['ST Certificate Verification', 'Domicile & Category Verified'],
      },
      {
        id: 'cert-2',
        title: 'Gross Annual Family Income Certificate (₹1,80,000 / Annum — Under ₹2.50L Ceiling)',
        issuer: 'Circle Officer / Tehsildar Revenue Department',
        issueDate: 'FY 2025–26 · OCR & Barcode Verified',
        credentialUrl: 'https://digilocker.gov.in',
        skills: ['Income Ceiling Compliance'],
      },
      {
        id: 'cert-3',
        title: 'AISHE Institution Bonafide & Host University Continuation Certificate',
        issuer: 'Jawaharlal Nehru University (JNU) — AISHE U-0109',
        issueDate: 'Cleared by Level-1 INO (Institute Nodal Officer)',
        credentialUrl: 'https://jnu.ac.in',
        skills: ['Post-Graduation Marks', 'Research Proposal Merit'],
      },
    ],
    resumeScore: 9.4,
    potential: 95,
    discipline: 96,
    punctuality: 98,
    consistency: 94,
    weeklyImprovement: 14,
    verified: true,
    resumeHistory: [7.8, 8.4, 9.0, 9.4],
    dailyLog: [
      { date: 'Q1 FY 2025–26', topic: 'SNA SPARSH Just-In-Time DBT Disbursed: Fellowship Stipend + HRA (₹1,31,490)', hours: 'Credited' },
      { date: 'Level-2 Nodal', topic: 'MoTA Sanction Order #MOTA/NFST/2026/1042 Digitally Signed', hours: 'Sanctioned' },
      { date: 'Level-1 INO', topic: 'Cleared Level-1 INO (Institute Nodal Officer) & AISHE U-0109 Verification', hours: 'Verified' },
    ],
    projects: [
      {
        id: 'p1',
        name: 'Scheduled Tribe (ST) Caste Certificate & Gross Annual Family Income Certificate (₹1,80,000 / Annum)',
        tech: ['ST Certificate Verification', 'Income Ceiling Compliance', 'Under ₹2.50L Ceiling'],
        review:
          'e-District & OCR Rule Breakdown: Valid Santhal ST Certificate issued by Competent Authority (SDM Dumka); Gross Annual Family Income ₹1,80,000 verified under ₹2.50 Lakh ceiling.',
      },
      {
        id: 'p2',
        name: 'AISHE Institution Bonafide (U-0109), PG Marksheet (82.4%) & NPCI Aadhaar-Seeding Mandate',
        tech: ['Post-Graduation Marks', 'Research Proposal Merit', 'NPCI Seeding Active'],
        review:
          'Countersigned by Level-1 Institute Nodal Officer (INO), JNU New Delhi (AISHE U-0109). NPCI Aadhaar-Seeding status active for SNA SPARSH Just-In-Time DBT.',
      },
    ],
    skills: [
      { name: 'ST Certificate Verification', score: 99, min: 70, isVerified: true },
      { name: 'Income Ceiling Compliance', score: 98, min: 70, isVerified: true },
      { name: 'Post-Graduation Marks', score: 82, min: 70, isVerified: true },
      { name: 'Research Proposal Merit', score: 91, min: 70, isVerified: true },
    ],
  });

  const [onboardingSkill, setOnboardingSkill] = useState<string | null>(null);

  useEffect(() => {
    const fetchRealProfile = async () => {
      if (currentUser && currentUser.role === 'student') {
        try {
          const res = await studentApi.getProfile();
          if (res && res.profile) {
            const p = res.profile;
            const verifiedList = p.verified_skills || [];
            const verifiedMap = new Map<string, number>();
            verifiedList.forEach((s: any) => {
              verifiedMap.set(s.skill_name.toLowerCase(), Math.round(s.percentage));
            });

            const declaredNames: string[] = p.skills
              ? p.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
              : [];

            const combinedSkillMap = new Map<string, SkillItem>();

            declaredNames.forEach((name: string) => {
              const lower = name.toLowerCase();
              const score = verifiedMap.get(lower) ?? 0;
              combinedSkillMap.set(lower, {
                name: name,
                score: score,
                min: 70,
                isVerified: score >= 70,
              });
            });

            verifiedList.forEach((s: any) => {
              const lower = s.skill_name.toLowerCase();
              if (!combinedSkillMap.has(lower)) {
                combinedSkillMap.set(lower, {
                  name: s.skill_name,
                  score: Math.round(s.percentage),
                  min: 70,
                  isVerified: Math.round(s.percentage) >= 70,
                });
              }
            });

            const allSkills = Array.from(combinedSkillMap.values());
            const verifiedSkillsCount = allSkills.filter((s) => s.isVerified).length;

            const realResumeScore =
              p.resume_score && p.resume_score > 0
                ? +Number(p.resume_score).toFixed(1)
                : verifiedSkillsCount > 0
                ? +(Math.min(10, 6.0 + verifiedSkillsCount * 1.1)).toFixed(1)
                : 9.4;

            const realPotential =
              verifiedSkillsCount > 0
                ? Math.min(100, 68 + verifiedSkillsCount * 8)
                : 95;

            setStudent((prev) => ({
              ...prev,
              id: p.id,
              name: p.name || currentUser.name || prev.name,
              university: p.college || prev.university,
              verified: p.is_verified || prev.verified,
              skills: allSkills.length > 0 ? allSkills : prev.skills,
              resumeScore: realResumeScore,
              potential: realPotential,
              qualification: p.qualification || prev.qualification,
              priorExperience: p.prior_experience || prev.priorExperience,
              desiredRole: p.desired_role || prev.desiredRole,
              resumeReview: p.resume_review_parsed || p.resume_review,
              resumeText: p.resume_text || prev.resumeText,
              githubUrl: p.github_url || prev.githubUrl,
              leetcodeUrl: p.leetcode_url || prev.leetcodeUrl,
              resumeUrl: p.resume_url || prev.resumeUrl,
              universityRollNo: p.university_roll_no || prev.universityRollNo,
            }));
          }
        } catch {
          // fallback
        }
      }
    };

    fetchRealProfile();
  }, [currentUser]);

  const handleUpdateSkill = (skillName: string, score: number) => {
    setStudent((prev) => {
      const exists = prev.skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
      const updatedSkills = exists
        ? prev.skills.map((s) =>
            s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, score, isVerified: score >= 70 } : s
          )
        : [...prev.skills, { name: skillName, score, min: 70, isVerified: score >= 70 }];

      const newResumeScore =
        prev.resumeScore > 0
          ? prev.resumeScore
          : +(Math.min(10, 6.0 + updatedSkills.length * 1.1)).toFixed(1);
      const newPotential = Math.min(100, 68 + updatedSkills.length * 8);

      return {
        ...prev,
        skills: updatedSkills,
        resumeScore: newResumeScore,
        potential: newPotential,
        verified: true,
      };
    });
  };

  const handleUpdateResume = (score: number, review: any, text: string, role?: string) => {
    setStudent((prev) => ({
      ...prev,
      resumeScore: score,
      resumeReview: review,
      resumeText: text,
      desiredRole: role || prev.desiredRole,
      resumeHistory: [...prev.resumeHistory.slice(1), score],
    }));
  };

  const handleUpdateProfile = (updates: Partial<Student>) => {
    setStudent((prev) => ({ ...prev, ...updates }));
  };

  const renderView = () => {
    switch (active) {
      case 'overview':
        return <StudentOverview student={student} onNavigate={(t) => setActive(t)} />;
      case 'skills':
        return <StudentEligibilityEngine student={student} onUpdateSkill={handleUpdateSkill} />;
      case 'roadmap':
        return <StudentVerificationGuide student={student} onNavigate={(t) => setActive(t)} />;
      case 'daily':
        return <StudentDbtLedger student={student} />;
      case 'aitools':
        return <StudentAITools student={student} onUpdateResume={handleUpdateResume} />;
      case 'field':
        return <StudentField />;
      case 'opportunities':
        return <StudentOpportunities />;
      case 'applications':
        return <StudentApplications onBrowseOpportunities={() => setActive('opportunities')} />;
      case 'projects':
        return <StudentDigiLockerVault student={student} />;
      case 'profile':
        return (
          <StudentProfile
            student={student}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={(t) => setActive(t)}
          />
        );
      default:
        return <StudentOverview student={student} onNavigate={(t) => setActive(t)} />;
    }
  };

  return (
    <PortalShell
      portalKey="student"
      tabs={STUDENT_TABS}
      active={active}
      setActive={setActive}
      go={go}
      subtitle={student.university}
    >
      {!student.skills.some((s) => s.isVerified || s.score >= 70) && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          <div className="flex-1">
            <div className="text-sm font-bold text-amber-900">
              Notice: Complete Mandatory Rule Engine Eligibility Verification
            </div>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              Execute the MoTA eligibility verification check on any attribute below to clear Level-1 INO (Institute Nodal Officer) scrutiny:
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {[
                'ST Certificate Verification',
                'Income Ceiling Compliance',
                'Post-Graduation Marks',
                'Research Proposal Merit',
              ].map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={() => setOnboardingSkill(sk)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition shadow-sm"
                >
                  Verify {sk} →
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {renderView()}

      <EligibilityCheckModal
        open={!!onboardingSkill}
        skill={onboardingSkill}
        onClose={() => setOnboardingSkill(null)}
        onSuccess={handleUpdateSkill}
      />
    </PortalShell>
  );
};
