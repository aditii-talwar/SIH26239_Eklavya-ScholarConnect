import React, { useState, useEffect } from 'react';
import { Card, StatBlock, SkillBar, PageHeader, VerifiedBadge, Tag, Button } from '../common/UIComponents';
import { Student } from '../../types';
import {
  informantApi,
  MotaGuidelineScheme,
  InoDeficiencyChat,
  getActiveSchemeCode,
  getLocalChecklistProgress,
} from '../../api/informant';

export const GrowthJourney: React.FC = () => {
  const steps = [
    {
      t: '1. NSP OTR Registration & e-District Upload',
      d: 'Register with NSP OTR ID, select Post-Matric ST, NFST, or NOS scheme, and link DigiLocker ST Caste Certificate and Income Certificate (under ₹2.50L ceiling).',
    },
    {
      t: '2. Level-1 INO & State Nodal Scrutiny',
      d: 'Google Vision API & Rule Engine validates AISHE / UDISE+ institution codes and income limits; Level-1 Institute Nodal Officer (INO) verifies bonafide enrollment.',
    },
    {
      t: '3. Sanction Order & SNA SPARSH DBT',
      d: 'State Nodal / MoTA Ministry approves sanction list and initiates Just-In-Time DBT disbursement via PFMS SNA SPARSH to NPCI Aadhaar-seeded bank accounts.',
    },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {steps.map((s, i) => (
        <Card key={s.t} className="p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1.5">Phase {i + 1}</div>
          <div className="font-bold text-sm text-slate-900 mb-1.5">{s.t}</div>
          <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
        </Card>
      ))}
    </div>
  );
};

export const ResumeScoreCard: React.FC<{ student: Student; onNavigate?: (tab: string) => void }> = ({
  student,
  onNavigate,
}) => {
  const hasAudit = Boolean(student.resumeReview && student.resumeScore > 0);
  const review = student.resumeReview;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base text-slate-900">
              Google Vision OCR &amp; Multi-Rule Eligibility Breakdown
            </span>
            <Tag tone="sage">{hasAudit ? 'Vision OCR Audited' : 'Google Vision Verified'}</Tag>
          </div>
          {student.desiredRole && (
            <div className="text-xs text-slate-600 mt-0.5">Scheme Applied: {student.desiredRole}</div>
          )}
        </div>

        <span className="text-xl font-bold text-[#1E3A8A]">
          4/4 <span className="text-xs font-semibold text-slate-500">Rules Passed</span>
        </span>
      </div>

      <div className="space-y-2 mb-3 text-xs">
        <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">AISHE Institution Code:</span>
          <span className="font-bold text-emerald-700">Matched (JNU New Delhi - AISHE U-0109)</span>
        </div>
        <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">Income Certificate (Google Vision OCR):</span>
          <span className="font-bold text-emerald-700">₹1,80,000 / Annum (Under Ceiling)</span>
        </div>
        <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">Caste Certificate Validation:</span>
          <span className="font-bold text-emerald-700">State e-District API Verified (#JH-ST-2026-88412)</span>
        </div>
        <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">Aadhaar NPCI Seeding Status:</span>
          <span className="font-bold text-emerald-700">Active Bank Account (SNA SPARSH Ready)</span>
        </div>
      </div>

      {hasAudit && review?.verdict ? (
        <div className="p-3 rounded-md bg-blue-50 border border-blue-200 text-xs text-slate-900 mb-3">
          <span className="font-bold text-[#1E3A8A] mr-1">Scrutiny Rule Verdict:</span>
          <span>"{review.verdict}"</span>
        </div>
      ) : (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mb-3">
          <span className="font-bold text-emerald-800 mr-1">[CLEARED] Google Vision &amp; Level-1 INO Summary:</span>
          <span>
            ST Caste Certificate Barcode (#JH-ST-2026-88412), Tehsildar Income Certificate (₹1,80,000), and AISHE Institution Code (U-0109) verified.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Scanned via Google Cloud Vision API (DOCUMENT_TEXT_DETECTION) &amp; NPCI Mapper.
        </p>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('aitools')}
            className="text-xs font-bold text-[#2563EB] hover:underline shrink-0 ml-2"
          >
            Open Document OCR Verifier →
          </button>
        )}
      </div>
    </Card>
  );
};

export const StudentOverview: React.FC<{ student: Student; onNavigate?: (tab: string) => void }> = ({
  student,
  onNavigate,
}) => {
  const [schemes, setSchemes] = useState<MotaGuidelineScheme[]>([]);
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>(() => getActiveSchemeCode());
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4]);
  const [currentStep, setCurrentStep] = useState<number>(5);

  // Google Vision API Document Scanner + Rejection Simulator State
  const [docType, setDocType] = useState<string>('income_certificate');
  const [scanStage, setScanStage] = useState<number>(5);
  const [scanningDoc, setScanningDoc] = useState<boolean>(false);
  const [scanOutcome, setScanOutcome] = useState<any>(null);

  // INO Deficiency Conversations State
  const [inoChats, setInoChats] = useState<InoDeficiencyChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [attachVisionRescan, setAttachVisionRescan] = useState<boolean>(true);
  const [sendingMsg, setSendingMsg] = useState<boolean>(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      const gRes = await informantApi.getGuidelines('en');
      setSchemes(gRes.schemes || []);
      const prog = await informantApi.getStudentProgress(selectedSchemeCode);
      setCompletedSteps(prog.completed_steps);
      setCurrentStep(prog.current_step);
      const chats = await informantApi.getInoChats();
      setInoChats(chats);
      if (chats.length > 0 && !activeChatId) {
        setActiveChatId(chats[0].id);
      }
    };
    loadDashboardData();
  }, [selectedSchemeCode]);

  const activeScheme = schemes.find((s) => s.scheme_code === selectedSchemeCode) || schemes[0];
  const currentStepObj =
    activeScheme?.checklist.find((c) => c.step === currentStep) || activeScheme?.checklist[0];

  const handleToggleChecklistStep = async (stepNum: number) => {
    const next = completedSteps.includes(stepNum)
      ? completedSteps.filter((s) => s !== stepNum)
      : [...completedSteps, stepNum].sort((a, b) => a - b);
    setCompletedSteps(next);
    const updated = await informantApi.saveStudentProgress(selectedSchemeCode, next);
    setCurrentStep(updated.current_step);
  };

  const handleTriggerVisionScan = async () => {
    const isDeficientDoc = docType.endsWith('_deficient');
    const cleanDocType = docType.replace('_deficient', '');
    const outcome: 'pass' | 'reject' = isDeficientDoc ? 'reject' : 'pass';
    setScanningDoc(true);
    try {
      const res = await informantApi.scanStudentDocumentWithVision({
        student_name: student.name || 'Kareena Murmu',
        scheme_code: selectedSchemeCode,
        document_type: cleanDocType,
        stage_number: scanStage,
        stage_name: `Stage ${scanStage}: Level-1 INO Document Scrutiny`,
        document_text:
          outcome === 'reject'
            ? 'EXPIRED INCOME CERTIFICATE #REV-2023-1104 | MISSING BARCODE | MISMATCHED INCOME Rs. 3,10,000'
            : 'VALID E-DISTRICT CERTIFICATE #JH-ST-2026-88412 | ANNUAL INCOME Rs. 1,80,000 | TEHSILDAR SIGNED',
        simulate_outcome: outcome,
      });
      setScanOutcome(res);
      if (res.auto_opened_ino_chat) {
        const chats = await informantApi.getInoChats();
        setInoChats(chats);
        setActiveChatId(res.auto_opened_ino_chat.id);
      } else if (res.status === 'verified' && !completedSteps.includes(currentStep)) {
        await handleToggleChecklistStep(currentStep);
      }
    } finally {
      setScanningDoc(false);
    }
  };

  const handleSendInoMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !chatMessage.trim()) return;
    setSendingMsg(true);
    try {
      const updated = await informantApi.sendInoChatMessage(
        activeChatId,
        'student',
        student.name || 'Kareena Murmu',
        chatMessage.trim(),
        attachVisionRescan
      );
      setInoChats(updated);
      setChatMessage('');
    } finally {
      setSendingMsg(false);
    }
  };

  const selectedChat = inoChats.find((c) => c.id === activeChatId) || inoChats[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Beneficiary Record: ${student.name}`}
        desc={`MoTA Scholarship & Fellowship Beneficiary Console · ${student.desiredRole || student.role} · ${student.university}`}
        action={student.verified ? <VerifiedBadge /> : undefined}
      />

      {/* 1. PERSONAL DASHBOARD: LIVE SCHOLARSHIP-SPECIFIC STEP TRACKER (Synced with Informant Portal) */}
      <Card className="p-5 space-y-4 border-2 border-[#1E3A8A]/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-[#1E3A8A] text-white text-[10px] font-bold uppercase">
                LIVE STEP TRACKER
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                Synced with MoTA Informant Checklist · {activeScheme?.version_tag || 'FY 2025–26'}
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 mt-1">
              You Are Currently on Step {currentStep} of 8:{' '}
              <span className="text-[#2563EB]">{currentStepObj?.title || 'Level-1 INO Scrutiny'}</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentStepObj?.detail ||
                'Check off steps below as you complete them. Changes automatically sync with the Landing Page Informant Checklist.'}
            </p>
          </div>

          {/* Scholarship Selector */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <label className="text-xs font-bold text-slate-700">Active Scholarship:</label>
            <select
              value={selectedSchemeCode}
              onChange={(e) => {
                setSelectedSchemeCode(e.target.value);
                const prog = getLocalChecklistProgress(e.target.value);
                setCompletedSteps(prog.completed_steps);
                setCurrentStep(prog.current_step);
              }}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900"
            >
              {schemes.map((sc) => (
                <option key={sc.scheme_code} value={sc.scheme_code}>
                  {sc.scheme_code.replace('_', '-')} — {sc.scheme_name.split('(')[0].trim()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 8-Step Interactive Progress Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-[11px]">
          {(activeScheme?.checklist || []).map((st) => {
            const isDone = completedSteps.includes(st.step);
            const isActive = st.step === currentStep;
            return (
              <button
                key={st.step}
                type="button"
                onClick={() => handleToggleChecklistStep(st.step)}
                title={`${st.title} — Click to toggle completion`}
                className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : isActive
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm ring-2 ring-blue-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-1 font-bold">
                  <span>Step {st.step}</span>
                  <span>{isDone ? '✓' : isActive ? '● NOW' : '○'}</span>
                </div>
                <div className="mt-1 font-semibold leading-snug line-clamp-2 text-[10px]">
                  {st.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Action Box */}
        {currentStepObj && (
          <div className="p-3.5 rounded-lg bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-[#1E3A8A]">
                Next Action Required (Step {currentStepObj.step} — {currentStepObj.stage}):
              </div>
              <div className="text-slate-700 mt-0.5">{currentStepObj.statutory_rule}</div>
            </div>
            <Button
              variant="primary"
              className="text-xs shrink-0"
              onClick={() => handleToggleChecklistStep(currentStepObj.step)}
            >
              Mark Step {currentStepObj.step} Complete ✓
            </Button>
          </div>
        )}
      </Card>

      {/* 2. GOOGLE VISION API DOCUMENT VERIFICATION & AUTO-OPENED INO DEFICIENCY RESOLUTION */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left: Google Cloud Vision API Document Scanner */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
                Google Cloud Vision API (DOCUMENT_TEXT_DETECTION)
              </span>
              <h4 className="font-bold text-base text-slate-900">
                Document Upload &amp; Stage Scrutiny Verification
              </h4>
            </div>
            <Tag tone="blue">Vision OCR Active</Tag>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Uploaded certificates are verified via <strong>Google Cloud Vision API</strong> against State e-District registries. If any deficiency is detected during Stage 5 or Stage 6 scrutiny, a direct resolution thread with your <strong>Institute Nodal Officer (INO)</strong> opens automatically.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Certificate Record</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 font-medium"
              >
                <option value="income_certificate">Income Certificate — FY 2025-26 (#JH-INC-2026 · Barcoded)</option>
                <option value="st_certificate">ST Caste Certificate — e-District (#JH-ST-2026-88412)</option>
                <option value="marksheet">Qualifying Semester Marksheet (CGPA 8.42)</option>
                <option value="bonafide_aishe">AISHE / UDISE+ Institution Bonafide Certificate</option>
                <option value="income_certificate_deficient">Income Certificate — FY 2023-24 (#REV-2023-1104 · Unbarcoded)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Verification Stage</label>
              <select
                value={scanStage}
                onChange={(e) => setScanStage(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 font-medium"
              >
                <option value={3}>Stage 3: Initial Vision OCR Upload</option>
                <option value={5}>Stage 5: Level-1 INO Scrutiny</option>
                <option value={6}>Stage 6: Level-2 State Nodal Audit</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <input type="file" accept="image/*,.pdf" className="text-xs text-slate-600 flex-1" />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              disabled={scanningDoc}
              onClick={handleTriggerVisionScan}
              className="w-full py-2.5 px-3 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold transition"
            >
              {scanningDoc ? 'Verifying via Google Cloud Vision API…' : '📷 Verify Document via Google Cloud Vision API'}
            </button>
          </div>

          {scanOutcome && (
            <div
              className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                scanOutcome.status === 'rejected'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>
                  {scanOutcome.status === 'rejected'
                    ? '✗ Document Rejected — INO Conversation Auto-Opened!'
                    : '✓ Document Verified via Google Cloud Vision API'}
                </span>
                <span>{scanOutcome.vision_confidence}% Confidence</span>
              </div>
              {scanOutcome.rejection_reason && (
                <p className="text-rose-800 font-medium">{scanOutcome.rejection_reason}</p>
              )}
              <div className="space-y-0.5 text-[11px]">
                {Object.entries(scanOutcome.extracted_fields || {}).map(([k, v]) => (
                  <div key={k}>
                    <strong>{k}:</strong> {String(v)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Right: Auto-Opened Level-1 INO Deficiency Resolution Conversation */}
        <Card className="p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A8A]">
                  Direct Nodal Resolution Channel
                </span>
                <h4 className="font-bold text-base text-slate-900">
                  Level-1 INO Document Rejection &amp; Resolution Convo
                </h4>
              </div>
              {selectedChat && (
                <Tag tone={selectedChat.status === 'resolved' ? 'sage' : 'rose'}>
                  {selectedChat.status === 'resolved' ? '✓ Resolved by INO' : '● Action Required'}
                </Tag>
              )}
            </div>

            {inoChats.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {inoChats.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveChatId(c.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold border whitespace-nowrap ${
                      c.id === selectedChat?.id
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    [{c.scheme_code}] {c.document_type.replace(/_/g, ' ')} ({c.status})
                  </button>
                ))}
              </div>
            )}

            {selectedChat ? (
              <>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-700">
                  <strong>Officer:</strong> {selectedChat.ino_officer_name} ·{' '}
                  <strong>Flagged Stage:</strong> {selectedChat.stage_name}
                </div>

                {/* Messages Stream */}
                <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                  {selectedChat.messages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg text-xs ${
                        m.sender_role === 'student'
                          ? 'bg-[#1E3A8A] text-white ml-6'
                          : m.sender_role === 'system'
                          ? 'bg-rose-50 border border-rose-200 text-rose-900 font-medium'
                          : 'bg-slate-100 border border-slate-200 text-slate-900 mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-80 mb-0.5 font-semibold">
                        <span>{m.sender_name}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{m.text}</p>
                      {m.vision_badge && (
                        <div className="mt-1.5 inline-block px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-300 text-[10px] font-bold">
                          ✓ {m.vision_badge}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-500">
                No document rejections flagged. If any document is rejected in later scrutiny stages, a direct conversation with your INO opens here automatically.
              </p>
            )}
          </div>

          {selectedChat && (
            <form onSubmit={handleSendInoMessage} className="pt-2 border-t border-slate-200 space-y-2">
              <textarea
                rows={2}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Reply to your Level-1 INO (e.g., 'Attached updated FY 2025-26 barcoded Income Certificate #JH-INC-2026-9921')…"
                className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-900 bg-white"
              />
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <label className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attachVisionRescan}
                    onChange={(e) => setAttachVisionRescan(e.target.checked)}
                    className="accent-[#16A34A]"
                  />
                  <span>Attach Google Vision Re-Scanned Certificate</span>
                </label>
                <Button variant="primary" type="submit" disabled={sendingMsg} className="text-xs">
                  {sendingMsg ? 'Sending…' : 'Send to INO & Resolve →'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBlock
          label="Current Checklist Step"
          value={`Step ${currentStep}/8`}
          sub={`${selectedSchemeCode.replace('_', '-')} Track`}
        />
        <StatBlock
          label="Income Certificate OCR"
          value="₹1,80,000"
          sub="Google Vision Verified"
        />
        <StatBlock
          label="NPCI Aadhaar Seeding"
          value="Active"
          sub="SBI Account Mapped for DBT"
        />
        <StatBlock
          label="SNA SPARSH Disbursed"
          value="₹1,31,490"
          sub="Q1 Fellowship + HRA Released"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <div className="font-bold text-base text-slate-900">
              Mandatory Eligibility &amp; Rule Engine Compliance
            </div>
            <Tag tone="sage">4/4 Rules Cleared</Tag>
          </div>
          {student.skills.map((s) => (
            <SkillBar key={s.name} {...s} />
          ))}
        </Card>

        <ResumeScoreCard student={student} onNavigate={onNavigate} />
      </div>

      <div>
        <div className="font-bold text-base text-slate-900 mb-3">
          Standard MoTA Scholarship &amp; SNA SPARSH Verification Workflow
        </div>
        <GrowthJourney />
      </div>
    </div>
  );
};
