import React, { useState, useEffect } from 'react';
import { Card, Button, PageHeader, Tag } from '../common/UIComponents';
import { EligibilityCheckModal } from './EligibilityCheckModal';
import { Student, SchemeRuleQuestionnaire } from '../../types';
import { getStoredQuestionnaires } from '../../data/mockData';

export const StudentEligibilityEngine: React.FC<{
  student: Student;
  onUpdateSkill?: (skillName: string, score: number) => void;
}> = ({ student, onUpdateSkill }) => {
  const [role, setRole] = useState(
    student.desiredRole || student.role || 'NFST — Ph.D. Research Fellowship (India)'
  );
  const [testSkill, setTestSkill] = useState<string | null>(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [questionnaires, setQuestionnaires] = useState<SchemeRuleQuestionnaire[]>([]);

  useEffect(() => {
    setQuestionnaires(getStoredQuestionnaires());
  }, []);

  const handleTestPassed = (skillName: string, score: number) => {
    if (onUpdateSkill) {
      onUpdateSkill(skillName, score);
    }
  };

  const verifiedCount = student.skills.filter((s) => s.isVerified || s.score >= 70).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automated Scheme Eligibility Verification & Rule Engine Check"
        desc="Verify your eligibility against configurable MoTA scheme-specific rules (NFST, NOS, Top Class Education & Post-Matric) before Nodal Scrutiny Officer review."
      />

      {/* Configurable Scheme-Specific Eligibility Rule Sets (SIH26239 Explicit Requirement) */}
      <Card className="p-5 space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
          <div>
            <div className="font-display font-semibold text-base">
              Active MoTA Scheme-Specific Eligibility Rule Checklists
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Configured by MoTA Nodal Scrutiny Officers — run an interactive eligibility verification check for your target scheme.
            </p>
          </div>
          <Tag tone="amber">{questionnaires.length} Active Scheme Rule-Sets</Tag>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {questionnaires.map((q) => (
            <div
              key={q.id}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Tag tone="blue">{q.subject}</Tag>
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                     Cycle Close: {q.deadline}
                  </span>
                </div>
                <div className="font-display font-semibold text-sm text-black mb-1">{q.title}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  Nodal Officer: <span className="font-medium text-black">{q.officerName}</span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-1">
                  {q.questionCount} Rule Checks · {q.durationMins} mins · Threshold: {q.passingScore}%
                </div>
              </div>
              <Button
                variant="primary"
                className="w-full text-xs py-2"
                onClick={() => setTestSkill(q.subject)}
              >
                Run Eligibility Rule Check →
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Target Scheme Card */}
      <Card className="p-5">
        <label className="text-xs font-semibold text-[var(--text-muted)]">
          Target MoTA Scholarship / Fellowship Scheme for Automated Rule Evaluation
        </label>
        <div className="flex flex-col sm:flex-row gap-3 mt-1.5">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="flex-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring"
            placeholder="e.g. National Fellowship for Scheduled Tribes (NFST) / National Overseas Scholarship (NOS)"
          />
          <Button variant="sagesolid" className="text-xs sm:text-sm">Save Target Scheme</Button>
        </div>
      </Card>

      {/* Eligibility Parameters List with Verification Status */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
          <div>
            <div className="font-display font-semibold text-base">
              Applicant Eligibility & Document Verification Parameters
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Each parameter is validated via AI OCR + MoTA Scheme Rule Engine before forwarding to the Screening Committee.
            </p>
          </div>
          <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-deepblue/10 text-deepblue shrink-0">
            {verifiedCount} of {student.skills.length} Cleared
          </div>
        </div>

        {student.skills.map((s) => {
          const isVerified = s.isVerified || s.score >= 70;
          return (
            <div
              key={s.name}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 mb-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] dark:bg-white/5"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-sm text-[var(--text-main)]">{s.name}</span>
                  {isVerified ? (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                       Rule Cleared ({s.score}%)
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Pending Verification
                    </span>
                  )}
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden max-w-md">
                  <div
                    className={`h-full rounded-full transition-all ${isVerified ? 'bg-sagedeep' : 'bg-amber-500'}`}
                    style={{ width: `${s.score || 0}%` }}
                  />
                </div>
              </div>

              <Button
                variant={isVerified ? 'outline' : 'primary'}
                className={`text-xs px-3.5 py-2 shrink-0 ${!isVerified ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
                onClick={() => setTestSkill(s.name)}
              >
                {isVerified ? 'Re-Verify Rule' : `Verify ${s.name} →`}
              </Button>
            </div>
          );
        })}

        {/* Add & Verify Additional Scheme Parameter */}
        <div className="mt-4 pt-3.5 border-t border-[#E2E8F0]">
          <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">
            Verify additional scheme-specific parameter (e.g. Unconditional Foreign Offer, QS Top-500 Ranking, PVTG Priority Certificate, Aadhaar-PFMS Seeding)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter eligibility rule or certificate type…"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              className="flex-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm focus-ring bg-white text-black"
            />
            <Button
              variant="sagesolid"
              className="text-xs sm:text-sm px-4 py-2 shrink-0"
              disabled={!newSkillInput.trim()}
              onClick={() => {
                const trimmed = newSkillInput.trim();
                if (trimmed) {
                  setTestSkill(trimmed);
                  setNewSkillInput('');
                }
              }}
            >
              Run Rule Check →
            </Button>
          </div>
        </div>
      </Card>

      <EligibilityCheckModal
        open={!!testSkill}
        onClose={() => setTestSkill(null)}
        skill={testSkill}
        onSuccess={handleTestPassed}
      />
    </div>
  );
};
