import React from 'react';
import { Icon } from '../common/Icon';

export const FlowDiagram: React.FC<{ inverted?: boolean }> = ({ inverted = false }) => {
  const heroSteps = [
    { key: 'apply', label: 'Apply & Upload', sub: 'NFST & NOS Online Dossier', icon: 'upload' },
    { key: 'ocr', label: 'AI OCR & Rules', sub: 'Auto Eligibility & Doc Check', icon: 'zap' },
    { key: 'scrutiny', label: 'Scrutiny & Merit', sub: 'Screening & Deficiency Flow', icon: 'target' },
    { key: 'dbt', label: 'Award & DBT', sub: 'Fellowship Release & Tracking', icon: 'award' },
  ];

  const eightStages = [
    { key: 's1', label: 'Applicant Registration', sub: 'ST Digilocker & Aadhaar KYC Profile', icon: 'user' },
    { key: 's2', label: 'Online Scheme Apply', sub: 'NFST, NOS, Top Class & Post-Matric', icon: 'file' },
    { key: 's3', label: 'Document Submission', sub: 'ST Tribe, Income & Academic Proofs', icon: 'upload' },
    { key: 's4', label: 'AI OCR & Rule Check', sub: 'Automated Eligibility Verification', icon: 'zap' },
    { key: 's5', label: 'Nodal Officer Scrutiny', sub: 'Human-in-the-Loop Dossier Audit', icon: 'shield' },
    { key: 's6', label: 'Deficiency Resolution', sub: 'Instant Query Alert & Resubmission', icon: 'msg' },
    { key: 's7', label: 'Merit-Based Selection', sub: 'Composite Ranking & Committee Approval', icon: 'target' },
    { key: 's8', label: 'Award & PFMS DBT', sub: 'Sanction Letter & Fellowship Disbursal', icon: 'award' },
  ];

  const steps = inverted ? heroSteps : eightStages;

  const cardBg = inverted
    ? 'bg-white/10 border-white/15 text-cream'
    : 'bg-white border-deepblue/12 text-deepblue shadow-sm';
  const subCol = inverted ? 'text-cream/75' : 'text-deepblue/65';
  const badgeCol = inverted
    ? 'bg-white/10 text-cream/85 border-white/15'
    : 'bg-mutedsage/35 text-deepblue/80 border-deepblue/10';

  return (
    <div className="w-full max-w-full">
      <div
        className={
          inverted
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch w-full'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch w-full'
        }
      >
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={`rounded-xl border p-3.5 sm:p-4 ${cardBg} backdrop-blur-sm flex flex-col justify-between text-left min-w-0 w-full`}
          >
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="w-8 h-8 rounded-lg bg-sagedeep text-pcream flex items-center justify-center shrink-0">
                <Icon name={s.icon} className="w-4 h-4" />
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeCol}`}>
                Stage 0{i + 1} {i < steps.length - 1 ? '→' : ''}
              </span>
            </div>
            <div>
              <div className="font-display font-semibold text-sm sm:text-base leading-snug break-words">
                {s.label}
              </div>
              <div className={`text-xs ${subCol} mt-1 leading-relaxed break-words`}>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EcosystemFlow: React.FC = () => {
  return (
    <div className="rounded-lg border border-deepblue/12 bg-white p-6 sm:p-8">
      <div className="grid md:grid-cols-3 gap-6 items-center">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-sagedeep">Applicant Portal</div>
          <div className="rounded-xl p-4 bg-pcream border border-sagedeep/20">
            <div className="font-display font-semibold">ST Scholarship & Fellowship Applicants</div>
            <p className="text-xs text-deepblue/70 mt-1">
              Submit online applications for NFST, NOS, Top Class & Post-Matric schemes, upload ST/Income certificates, respond to deficiencies, and track fellowship DBT.
            </p>
          </div>
          <div className="rounded-xl p-4 bg-cream border border-deepblue/10">
            <div className="font-display font-semibold">Nodal Scrutiny & Screening Officers</div>
            <p className="text-xs text-deepblue/70 mt-1">
              Configure scheme-specific eligibility rules, verify documents with AI OCR intelligence, communicate deficiencies, and generate merit lists with human oversight.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-2">
          <div className="w-28 h-28 rounded-full bg-deepblue text-cream flex flex-col items-center justify-center text-center p-3 shadow-lg">
            <Icon name="compass" className="w-6 h-6 text-mutedsage mb-1" />
            <div className="font-display text-sm font-semibold leading-tight">MoTA ScholarConnect</div>
            <div className="text-[10px] text-cream/70 mt-0.5">AI OCR & Rule Engine</div>
          </div>
          <div className="text-xs text-deepblue/60 mt-3 text-center max-w-[200px]">
            Automated eligibility verification, deficiency tracking, and transparent merit selection.
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-deepblue/70">Ministry Governance</div>
          <div className="rounded-xl p-4 bg-cream border border-deepblue/10">
            <div className="font-display font-semibold">MoTA Ministry Administrators</div>
            <p className="text-xs text-deepblue/70 mt-1">
              Monitor scheme performance dashboards, state/scheme analytics, verification bottlenecks, final selection approvals, and post-selection DBT fellowship releases.
            </p>
          </div>
          <div className="rounded-xl p-4 bg-pcream border border-sagedeep/20">
            <div className="font-display font-semibold">Post-Selection Fellowship & DBT</div>
            <p className="text-xs text-deepblue/70 mt-1">
              Seamless post-award tracking for JRF/SRF/NOS fellows including quarterly progress reports, HRA/contingency claims, and direct benefit transfers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
