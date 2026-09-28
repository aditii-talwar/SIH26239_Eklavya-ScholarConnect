import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  PageHeader,
  StatBlock,
  Tag,
  EmptyState,
  VerifiedBadge,
  ProgressBar,
  Modal,
} from '../common/UIComponents';
import { Academician, ResearchPaper, TrainerQuestionnaire, CourseFeedbackItem } from '../../types';
import { academicianApi } from '../../api/academician';
import { informantApi, InoDeficiencyChat } from '../../api/informant';
import { useAuth } from '../../context/AuthContext';
import {
  STUDENTS,
  getStoredQuestionnaires,
  saveStoredQuestionnaires,
  getStoredFeedbacks,
  saveStoredFeedbacks,
} from '../../data/mockData';

// ============================================================================
// 1. NODAL SCRUTINY OFFICER PROFILE & AI-ASSISTED DOCUMENT SCRUTINY WORKBENCH
// ============================================================================
export const AcademicianOverview: React.FC<{ acad: Academician }> = ({ acad }) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [trainerName, setTrainerName] = useState(acad.name);
  const [designation, setDesignation] = useState(
    acad.designation || 'Principal Nodal Scrutiny Officer (Director Level)'
  );
  const [division, setDivision] = useState(
    acad.division || 'Ministry of Tribal Affairs (MoTA) — NFST & NOS Scrutiny Cell'
  );
  const [subjectsStr, setSubjectsStr] = useState(
    (
      acad.subjects || [
        'ST Certificate Verification',
        'Income Ceiling Compliance',
        'Post-Graduation Marks',
        'Research Proposal Merit',
      ]
    ).join(', ')
  );
  const [experienceYears, setExperienceYears] = useState(String(acad.experienceYears || 16));
  const [bio, setBio] = useState(
    'Principal Nodal Scrutiny & Screening Officer for Ministry of Tribal Affairs (MoTA) overseeing Google Vision API document verification, DigiLocker barcode validation, deficiency adjudication, and composite merit screening for NFST & NOS schemes.'
  );

  // Track Nodal Officer scrutiny decisions per applicant
  const [scrutinyStatus, setScrutinyStatus] = useState<Record<string, 'cleared' | 'deficiency' | 'pending'>>({
    s1: 'cleared',
    s2: 'cleared',
    s3: 'cleared',
    s4: 'pending',
    s5: 'cleared',
    s6: 'pending',
  });

  // Live INO Deficiency Conversations
  const [inoChats, setInoChats] = useState<InoDeficiencyChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [inoReplyText, setInoReplyText] = useState<string>('');

  useEffect(() => {
    informantApi.getInoChats().then((chats) => {
      setInoChats(chats);
      if (chats.length > 0) setActiveChatId(chats[0].id);
    });
  }, []);

  const handleToggleScrutinyFlag = async (st: any, currentStatus: string) => {
    const nextStatus = currentStatus === 'cleared' ? 'deficiency' : 'cleared';
    setScrutinyStatus((prev) => ({
      ...prev,
      [String(st.id)]: nextStatus,
    }));
    if (nextStatus === 'deficiency') {
      const res = await informantApi.scanStudentDocumentWithVision({
        student_name: st.name,
        scheme_code: 'POST_MATRIC',
        document_type: 'income_certificate',
        stage_number: 5,
        stage_name: 'Stage 5: Level-1 INO Scrutiny',
        simulate_outcome: 'reject',
      });
      const chats = await informantApi.getInoChats();
      setInoChats(chats);
      if (res?.auto_opened_ino_chat?.id) {
        setActiveChatId(res.auto_opened_ino_chat.id);
      }
    }
  };

  const handleSendInoReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !inoReplyText.trim()) return;
    const updated = await informantApi.sendInoChatMessage(
      activeChatId,
      'ino',
      `${trainerName} (Level-1 INO)`,
      inoReplyText.trim(),
      false
    );
    setInoChats(updated);
    setInoReplyText('');
  };

  const selectedChat = inoChats.find((c) => c.id === activeChatId) || inoChats[0];

  const subjectTags = subjectsStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Level-1 INO (Institute Nodal Officer) & Scrutiny Verification Queue"
        desc="Inspect AISHE / UDISE+ institution codes, verify e-District ST & Income certificates (₹2.50L ceiling), resolve deficiency memos, and forward verified applications for State Nodal sanction."
        action={<VerifiedBadge />}
      />

      {/* Nodal Scrutiny Officer Profile Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-mutedsage/70 flex items-center justify-center font-display text-xl font-bold shrink-0">
              {trainerName[0]}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display text-xl font-semibold text-black">{trainerName}</span>
                <Tag tone="sage">{designation}</Tag>
              </div>
              <div className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">{division}</div>
              <p className="text-xs text-[var(--text-muted)] max-w-2xl leading-relaxed pt-1">{bio}</p>
              <div className="pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Assigned Verification & Screening Domains:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subjectTags.map((sub) => (
                    <Tag key={sub} tone="blue">{sub}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-sagedeep text-sagedeep text-xs"
            onClick={() => setEditingProfile(true)}
          >
            Edit Officer Profile
          </Button>
        </div>
      </Card>

      {/* Scrutiny Officer KPI Summary */}
      <div className="grid sm:grid-cols-4 gap-3">
        <StatBlock label="Applications in Queue" value={STUDENTS.length} sub="NFST & NOS 2026-27" />
        <StatBlock label="AI OCR Pre-Verified" value="99.2%" sub="DigiLocker Barcode Match" />
        <StatBlock label="Avg Composite Merit" value="91.4%" sub="PG Marks + Proposal" />
        <StatBlock label="Scrutiny SLA" value="1.4 Days" sub={`${experienceYears} yrs service`} />
      </div>

      {/* AI-Assisted ST Applicant Scrutiny & Screening Queue (SIH26239 Explicit Requirement) */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="font-display font-semibold text-base">
              ST Applicant AI Document Scrutiny & Merit Screening Queue
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Automated AI OCR & Scheme Rule Engine pre-screening with Nodal Officer human-in-the-loop verification.
            </p>
          </div>
          <Tag tone="sage">Human-in-the-Loop Scrutiny Active</Tag>
        </div>

        <div className="space-y-3">
          {STUDENTS.map((st, idx) => {
            const avgRuleScore = st.skills.length
              ? Math.round(st.skills.reduce((a, b) => a + b.score, 0) / st.skills.length)
              : 92;
            const ocrConfidence = 97 + (idx % 3);
            const currentStatus = scrutinyStatus[String(st.id)] || 'pending';

            return (
              <div
                key={st.id}
                className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] grid lg:grid-cols-[1.4fr_1fr_1fr_auto] gap-4 items-center"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-black">{st.name}</span>
                    <Tag tone="blue">{st.role}</Tag>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{st.university}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {st.skills.slice(0, 3).map((sk) => (
                      <Tag key={sk.name}>
                         {sk.name}: {sk.score}%
                      </Tag>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-muted)]">AI OCR Document Match</span>
                    <span className="font-semibold text-sagedeep">{ocrConfidence}%</span>
                  </div>
                  <ProgressBar value={ocrConfidence} />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-muted)]">Composite Merit Index</span>
                    <span className="font-semibold text-deepblue">{avgRuleScore}/100</span>
                  </div>
                  <ProgressBar value={avgRuleScore} colorClass="bg-deepblue" />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {currentStatus === 'cleared' ? (
                    <Tag tone="sage">Scrutiny Cleared </Tag>
                  ) : currentStatus === 'deficiency' ? (
                    <Tag tone="rose">Deficiency Flagged </Tag>
                  ) : (
                    <Tag tone="amber">Awaiting Sign-Off</Tag>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleScrutinyFlag(st, currentStatus)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-sagedeep text-sagedeep hover:bg-sagedeep hover:text-white transition"
                  >
                    {currentStatus === 'cleared' ? 'Flag Deficiency (Open Chat)' : 'Approve & Clear'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Live Two-Way INO <-> Student Document Rejection & Deficiency Resolution Chat */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="font-display font-semibold text-base">
              Live Level-1 INO ↔ Student Document Rejection Resolution Threads
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Automatically opened when a document is rejected by Google Vision API or flagged during Level-1 INO scrutiny.
            </p>
          </div>
          <Tag tone="blue">{inoChats.length} Active Thread(s)</Tag>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {inoChats.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveChatId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap ${
                c.id === selectedChat?.id
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                  : 'bg-slate-50 text-slate-700 border-slate-300'
              }`}
            >
              {c.student_name} · [{c.scheme_code}] {c.document_type.replace(/_/g, ' ')} ({c.status})
            </button>
          ))}
        </div>

        {selectedChat && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-950">
              <strong>Rejection Reason ({selectedChat.stage_name}):</strong> {selectedChat.rejection_reason}
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
              {selectedChat.messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg text-xs ${
                    m.sender_role === 'ino'
                      ? 'bg-[#1E3A8A] text-white ml-8'
                      : m.sender_role === 'system'
                      ? 'bg-amber-50 border border-amber-200 text-amber-950 font-medium'
                      : 'bg-white border border-slate-200 text-slate-900 mr-8'
                  }`}
                >
                  <div className="flex justify-between text-[10px] opacity-80 mb-0.5 font-semibold">
                    <span>{m.sender_name}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p>{m.text}</p>
                  {m.vision_badge && (
                    <div className="mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold inline-block">
                      ✓ {m.vision_badge}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendInoReply} className="flex gap-2">
              <input
                value={inoReplyText}
                onChange={(e) => setInoReplyText(e.target.value)}
                placeholder={`Reply to ${selectedChat.student_name} as Level-1 INO...`}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white text-slate-900"
              />
              <Button variant="primary" type="submit" className="text-xs">
                Send INO Reply
              </Button>
            </form>
          </div>
        )}
      </Card>

      {/* Edit Officer Profile Modal */}
      <Modal open={editingProfile} onClose={() => setEditingProfile(false)} wide title="Manage Nodal Scrutiny Officer Profile">
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">Officer Name</label>
              <input
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">Rank / Designation</label>
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">MoTA Division / Cell</label>
              <input
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)]">Years of Service</label>
              <input
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)]">
              Assigned Scrutiny & Verification Rules (comma-separated)
            </label>
            <input
              value={subjectsStr}
              onChange={(e) => setSubjectsStr(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)]">Official Responsibilities Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black"
            />
          </div>
          <Button variant="primary" className="w-full" onClick={() => setEditingProfile(false)}>
            Save Nodal Officer Profile
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================================
// 2. PUBLISH SCHEME GUIDELINES, SCRUTINY SOPs & ANNEXURE TEMPLATES
// ============================================================================
export const AcademicianPublish: React.FC<{
  papers: ResearchPaper[];
  setPapers: React.Dispatch<React.SetStateAction<ResearchPaper[]>>;
}> = ({ papers, setPapers }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(currentUser?.name || 'Dr. Rajeshwar Meena (Nodal Scrutiny Officer)');
  const [materialType, setMaterialType] = useState<'Recorded Lecture' | 'Presentation' | 'Study Material'>('Study Material');
  const [field, setField] = useState('NFST Scheme Guidelines');
  const [durationOrSize, setDurationOrSize] = useState('38 Pages · Official MoTA PDF');
  const [resourceUrl, setResourceUrl] = useState('https://tribal.nic.in/');
  const [desc, setDesc] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title || !field) return;
    setLoading(true);

    const newMaterial: ResearchPaper = {
      id: 'lib-' + Date.now(),
      title,
      field,
      materialType,
      durationOrSize,
      resourceUrl,
      trainerName: author,
      uploadedAt: 'Just now',
      desc: desc || `${materialType} on ${field} published to the MoTA Scheme Guidelines Repository.`,
      discussions: [],
    };

    if (currentUser && currentUser.role === 'academician') {
      try {
        await academicianApi.createPosting({
          title,
          description: desc || `${materialType} for ${field}`,
          required_skills: field,
          posting_type: 'scheme_guideline',
        });
      } catch {
        // fallback
      }
    }

    setPapers([newMaterial, ...papers]);
    setTitle('');
    setDesc('');
    setDone(true);
    setLoading(false);
    setTimeout(() => setDone(false), 3500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publish Official MoTA Scheme Guidelines, Annexures & Scrutiny SOPs"
        desc="Upload official NFST/NOS rulebooks, PFMS DBT Annexure I–VI formats, and document verification walkthroughs for ST applicants."
      />
      <Card className="p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)]">Document / Circular Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
              placeholder="e.g. NFST 2026-27 Revised JRF/SRF Upgradation & HRA Circular"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)]">Document Format</label>
            <select
              value={materialType}
              onChange={(e) => {
                const val = e.target.value as any;
                setMaterialType(val);
                if (val === 'Recorded Lecture') setDurationOrSize('25 mins · Applicant Walkthrough Video');
                else if (val === 'Presentation') setDurationOrSize('28 Slides · Scrutiny Deck');
                else setDurationOrSize('38 Pages · Official MoTA PDF');
              }}
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black font-medium"
            >
              <option value="Study Material"> Official Scheme Rulebook / Annexure PDF</option>
              <option value="Presentation"> Scrutiny & Eligibility Briefing Deck (PPT)</option>
              <option value="Recorded Lecture"> Applicant Video Walkthrough / SOP</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)]">Issuing Nodal Officer</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)]">Scheme Category</label>
            <input
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="e.g. NFST Scheme Guidelines, NOS Overseas, PFMS DBT"
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)]">Page / Slide Count or Duration</label>
            <input
              value={durationOrSize}
              onChange={(e) => setDurationOrSize(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--text-muted)]">Official MoTA Circular / PDF URL</label>
          <input
            value={resourceUrl}
            onChange={(e) => setResourceUrl(e.target.value)}
            placeholder="https://tribal.nic.in/ or https://fellowship.tribal.gov.in/"
            className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--text-muted)]">
            Key Eligibility Clauses, Mandatory Documents & Disbursal Norms Summary
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            className="w-full mt-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
            placeholder="Summarize ST certificate requirements, family income ceiling, minimum marks, and PFMS DBT rules…"
          />
        </div>

        <Button variant="primary" onClick={submit} disabled={loading}>
          {loading ? 'Publishing…' : 'Publish to MoTA Guidelines Repository'}
        </Button>

        {done && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
             Published to MoTA Scheme Guidelines Repository! ST Applicants can now view and download this document.
          </div>
        )}
      </Card>
    </div>
  );
};

// ============================================================================
// 3. MOTA SCHEME GUIDELINES & SCRUTINY REPOSITORY VIEW
// ============================================================================
export const AcademicianPapers: React.FC<{ papers: ResearchPaper[] }> = ({ papers }) => {
  const [filter, setFilter] = useState<string>('All');

  const visible =
    filter === 'All'
      ? papers
      : papers.filter((p) => (p.materialType || 'Study Material') === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="MoTA Scheme Guidelines, Annexures & SOP Repository"
        desc="Centralized repository of NFST, NOS, Top Class Education, and Post-Matric guidelines published by Nodal Officers."
      />

      <div className="flex flex-wrap gap-1.5">
        {[
          { key: 'All', label: 'All Documents' },
          { key: 'Study Material', label: 'Official Rulebooks & Annexures' },
          { key: 'Presentation', label: 'Scrutiny Briefing Decks' },
          { key: 'Recorded Lecture', label: 'Video Walkthroughs' },
        ].map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setFilter(cat.key)}
            className={
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition ' +
              (filter === cat.key
                ? 'bg-sagedeep text-pcream border-sagedeep'
                : 'border-[#E2E8F0] hover:bg-[#F8FAFC]')
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visible.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Tag tone="sage">{p.materialType || 'Official Rulebook'}</Tag>
                  <Tag tone="blue">{p.field}</Tag>
                  {p.durationOrSize && (
                    <span className="text-xs text-[var(--text-muted)] font-medium">{p.durationOrSize}</span>
                  )}
                </div>
                <div className="font-display font-semibold text-base text-black">{p.title}</div>
              </div>
              {p.resourceUrl && (
                <a
                  href={p.resourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-sagedeep hover:underline"
                >
                  Open Official Document ↗
                </a>
              )}
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{p.desc}</p>
            <div className="text-xs text-sagedeep font-semibold">
              {p.discussions.length} applicant clarification{p.discussions.length !== 1 ? 's' : ''} logged
            </div>
          </Card>
        ))}
        {visible.length === 0 && <EmptyState text="No documents in this category yet." />}
      </div>
    </div>
  );
};

// ============================================================================
// 4. DEFICIENCY MEMO ADJUDICATION & APPLICANT RESUBMISSION MANAGEMENT
// ============================================================================
export const AcademicianDiscuss: React.FC<{
  papers: ResearchPaper[];
  setPapers: React.Dispatch<React.SetStateAction<ResearchPaper[]>>;
}> = ({ papers }) => {
  const [feedbacks, setFeedbacks] = useState<CourseFeedbackItem[]>(() => getStoredFeedbacks());
  const [reply, setReply] = useState<Record<string, string>>({});
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});

  const handleSendFeedbackReply = (fbId: string) => {
    const text = reply[fbId]?.trim();
    if (!text) return;
    const updated = feedbacks.map((fb) =>
      fb.id === fbId ? { ...fb, trainerReply: text } : fb
    );
    setFeedbacks(updated);
    saveStoredFeedbacks(updated);
    setSentMap((prev) => ({ ...prev, [fbId]: true }));
    setReply((prev) => ({ ...prev, [fbId]: '' }));
  };

  const discussionsList = papers.flatMap((p) =>
    p.discussions.map((d, i) => ({ ...d, paper: p.title, id: `${p.id}-${i}` }))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deficiency Memo Adjudication & Document Resubmission Queue"
        desc="Review clarified certificates and deficiency responses submitted by ST applicants, and record official Nodal Scrutiny Officer clearance orders."
      />

      {/* Applicant Deficiency Resubmissions */}
      <div className="space-y-4">
        <div className="font-display font-semibold text-base">
          Applicant Deficiency Clarifications & Resubmitted Documents
        </div>
        {feedbacks.map((fb) => (
          <Card key={fb.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-sm text-black">{fb.targetTitle}</span>
                <Tag tone="blue">{fb.targetType === 'Course' ? 'Scheme Scrutiny' : 'Annexure / QPR'}</Tag>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {fb.trainerReply ? ' Deficiency Cleared' : ' Awaiting Officer Order'}
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-mutedsage/60 flex items-center justify-center text-xs font-bold shrink-0">
                {fb.traineeName[0]}
              </div>
              <div>
                <div className="text-xs font-semibold text-black">
                  {fb.traineeName} <span className="text-[var(--text-muted)] font-normal">· {fb.date}</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">"{fb.comment}"</p>
              </div>
            </div>

            {fb.trainerReply && (
              <div className="p-3 rounded-xl bg-sagedeep/10 border border-sagedeep/20 text-xs text-[#0F172A]">
                <strong className="text-sagedeep">Nodal Scrutiny Officer Order:</strong> {fb.trainerReply}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <input
                value={reply[fb.id] || ''}
                onChange={(e) => setReply({ ...reply, [fb.id]: e.target.value })}
                placeholder="Record Nodal Scrutiny Officer verification order or issue follow-up deficiency notice…"
                className="flex-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-xs focus-ring bg-white text-black"
              />
              <Button
                variant="sagesolid"
                className="px-4 text-xs"
                onClick={() => handleSendFeedbackReply(fb.id)}
              >
                {sentMap[fb.id] ? 'Order Recorded ' : 'Issue Clearance Order'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Scheme Guideline Q&A Threads */}
      <div className="space-y-4 pt-2">
        <div className="font-display font-semibold text-base">Applicant Scheme Guideline Queries</div>
        {discussionsList.map((d) => (
          <Card key={d.id} className="p-5">
            <div className="text-xs text-[var(--text-muted)] mb-1">
              Regarding <span className="font-semibold text-black">{d.paper}</span>
            </div>
            <div className="flex items-start gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-mutedsage/60 flex items-center justify-center text-xs font-bold shrink-0">
                {d.student[0]}
              </div>
              <div>
                <div className="text-sm font-semibold">{d.student}</div>
                <p className="text-sm text-[var(--text-muted)]">{d.q}</p>
              </div>
            </div>
            {d.reply && (
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] text-xs text-black mb-2">
                <strong>Nodal Officer Clarification:</strong> {d.reply}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 5. CONFIGURABLE SCHEME-SPECIFIC ELIGIBILITY RULE ENGINE & SCHEME INTAKES
// ============================================================================
export const AcademicianOpportunities: React.FC = () => {
  const { currentUser } = useAuth();
  const [postings, setPostings] = useState<any[]>([]);
  const [questionnaires, setQuestionnaires] = useState<TrainerQuestionnaire[]>(() => getStoredQuestionnaires());
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // New Scheme Intake form states
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('ST Certificate Verification, Income Ceiling Compliance, Post-Graduation Marks');
  const [type, setType] = useState('fellowship_scheme');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Configurable Scheme Rule Checklist form states
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSubject, setQuizSubject] = useState('ST Certificate Verification');
  const [quizDeadline, setQuizDeadline] = useState('2026-10-25');
  const [quizQuestions, setQuizQuestions] = useState(8);
  const [quizDuration, setQuizDuration] = useState(5);
  const [quizPassScore, setQuizPassScore] = useState(90);
  const [quizSaved, setQuizSaved] = useState(false);

  const fetchPostings = async () => {
    try {
      const res = await academicianApi.getMyPostings();
      if (res && res.postings) {
        setPostings(res.postings);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchPostings();
  }, []);

  const handleCreateQuestionnaire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;
    const newQ: TrainerQuestionnaire = {
      id: 'q-' + Date.now(),
      title: quizTitle.trim(),
      subject: quizSubject.trim(),
      trainerName: currentUser?.name || 'Dr. Rajeshwar Meena',
      deadline: quizDeadline,
      questionCount: Number(quizQuestions) || 8,
      durationMins: Number(quizDuration) || 5,
      passingScore: Number(quizPassScore) || 90,
      submissionsCount: 0,
      avgScore: 0,
    };
    const updated = [newQ, ...questionnaires];
    setQuestionnaires(updated);
    saveStoredQuestionnaires(updated);
    setQuizSaved(true);
    setQuizTitle('');
    setTimeout(() => {
      setQuizSaved(false);
      setShowQuizModal(false);
    }, 1400);
  };

  const handleCreateCourse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a MoTA scheme intake title.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await academicianApi.createPosting({
        title: title.trim(),
        description:
          desc.trim() ||
          'Ministry of Tribal Affairs (MoTA) scholarship & fellowship scheme with AI OCR document verification and PFMS DBT.',
        required_skills:
          skills.trim() || 'ST Certificate Verification, Income Ceiling Compliance, Post-Graduation Marks',
        posting_type: type || 'fellowship_scheme',
      });
      setSuccess(true);
      setTitle('');
      setDesc('');
      setTimeout(() => {
        setSuccess(false);
        setShowCourseModal(false);
      }, 1500);
      fetchPostings();
    } catch (err: any) {
      setError(err?.message || 'Failed to publish scheme intake');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurable Scheme-Specific Eligibility Rule Engine & Intakes"
        desc="Configure scheme-specific eligibility criteria, mandatory document rules, and selection weightages for NFST, NOS, Top Class Education, and Post-Matric schemes."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => setShowQuizModal(true)}>
              + Configure New Scheme Rule-Set
            </Button>
            <Button
              variant="outline"
              className="border-sagedeep text-sagedeep"
              onClick={() => setShowCourseModal(true)}
            >
              + Launch New Scheme Intake
            </Button>
          </div>
        }
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <StatBlock label="Active Scheme Rule-Sets" value={questionnaires.length} sub="NFST · NOS · Top Class" />
        <StatBlock label="Published Scheme Intakes" value={postings.length || 4} sub="2026-27 Cycle Open" />
        <StatBlock
          label="Automated Rule Evaluations"
          value={questionnaires.reduce((a, b) => a + b.submissionsCount, 0)}
          sub="92.4% auto-verified"
        />
      </div>

      {/* Configurable Scheme Eligibility Matrix Overview (SIH26239 Explicit Requirement) */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="font-display font-semibold text-base">
              Live Configurable Scheme-Specific Eligibility & Selection Parameters
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Dynamic rule matrix executed by the AI Document Intelligence & Eligibility Engine during Stage-3 & Stage-4 scrutiny.
            </p>
          </div>
          <Tag tone="sage">Dynamic Rule Engine v2.6</Tag>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          {[
            {
              scheme: 'NFST (National Fellowship for ST — Ph.D./M.Phil.)',
              rules: 'ST Cert Mandatory · Min PG Marks >= 55% · Max Age <= 36 Yrs · 750 Slots (PVTG & 33% Women Priority)',
              weights: 'Academic Merit: 50% | Research Synopsis: 30% | Socio-Economic/PVTG: 20%',
            },
            {
              scheme: 'NOS (National Overseas Scholarship — Master’s/Ph.D. Abroad)',
              rules: 'ST Cert Mandatory · Min UG/PG Marks >= 60% · Family Income <= ₹6.00 LPA · Max Age < 35 Yrs · QS Rank <= 500',
              weights: 'QS University Rank: 40% | Academic Merit: 35% | Research/Statement of Purpose: 25%',
            },
            {
              scheme: 'MoTA Top Class Education for ST (IIT/IIM/AIIMS/NIT)',
              rules: 'ST Cert Mandatory · Notified Premier Institute Admission · Family Income <= ₹6.00 LPA',
              weights: 'Premier Institute Admission Verification: 70% | Income Priority: 30%',
            },
            {
              scheme: 'Post-Matric Scholarship for ST Students (Higher Ed)',
              rules: 'ST Cert Mandatory · Family Income <= ₹2.50 LPA · Aadhaar-Seeded Bank Account (NPCI Active)',
              weights: '100% Eligible Entitlement via State/MoTA PFMS Direct Benefit Transfer',
            },
          ].map((cfg) => (
            <div key={cfg.scheme} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1.5">
              <div className="font-display font-semibold text-sm text-black">{cfg.scheme}</div>
              <div className="text-[var(--text-muted)]">{cfg.rules}</div>
              <div className="text-[11px] font-semibold text-sagedeep pt-1 border-t border-[#E2E8F0]">
                Selection Weightage: {cfg.weights}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Popup Modal: Configure New Scheme Rule-Set */}
      <Modal
        open={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        wide
        title="Configure New Scheme-Specific Eligibility and Document Rule-Set"
      >
        <div className="space-y-4">
          {quizSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
               Scheme Rule-Set activated with cycle deadline {quizDeadline}! Applicants can now run pre-verification against this rule-set.
            </div>
          )}

          <form onSubmit={handleCreateQuestionnaire} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                  Rule-Set Title
                </label>
                <input
                  required
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. NFST PVTG Priority Quota & Ph.D. Registration Rule-Set"
                  className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm bg-white text-black"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                  Primary Verification Attribute
                </label>
                <input
                  required
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value)}
                  placeholder="e.g. ST Certificate Verification, Income Ceiling Compliance"
                  className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm bg-white text-black"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                  Cycle Closing Date
                </label>
                <input
                  type="date"
                  required
                  value={quizDeadline}
                  onChange={(e) => setQuizDeadline(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                  Mandatory Rules Count
                </label>
                <input
                  type="number"
                  min={4}
                  max={20}
                  value={quizQuestions}
                  onChange={(e) => setQuizQuestions(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                  Scan SLA (Mins)
                </label>
                <input
                  type="number"
                  min={2}
                  max={30}
                  value={quizDuration}
                  onChange={(e) => setQuizDuration(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                  Min Confidence (%)
                </label>
                <input
                  type="number"
                  min={70}
                  max={100}
                  value={quizPassScore}
                  onChange={(e) => setQuizPassScore(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm bg-white text-black"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" type="button" onClick={() => setShowQuizModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Activate Scheme Rule-Set
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Popup Modal: Launch New Scheme Intake */}
      <Modal
        open={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        wide
        title="Launch New MoTA Scholarship or Fellowship Intake Cycle"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
               MoTA Scheme Intake published! ST Applicants can now apply online.
            </div>
          )}

          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                Scheme Intake Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. National Fellowship for Scheduled Tribes (NFST) — Phase-II 2026-27"
                className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                  Mandatory Eligibility & Document Rules
                </label>
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="ST Certificate Verification, Income Ceiling Compliance, Post-Graduation Marks"
                  className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                  Scheme Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
                >
                  <option value="fellowship_scheme">National Fellowship for ST (NFST — India)</option>
                  <option value="overseas_scholarship">National Overseas Scholarship (NOS — Abroad)</option>
                  <option value="scholarship_scheme">Top Class Education / Post-Matric DBT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                Entitlements, Annual Slots & Selection Criteria
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="Specify JRF/SRF stipend rates, family income ceiling, minimum marks, and PFMS DBT norms..."
                className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" type="button" onClick={() => setShowCourseModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Publishing…' : 'Publish Scheme Intake'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Active Scheme Rule-Sets List */}
      <div className="space-y-3">
        <div className="font-display font-semibold text-base text-[#0F172A]">
          Active Automated Eligibility Rule-Sets & Cycle Deadlines
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionnaires.map((q) => (
            <Card key={q.id} className="p-5 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Tag tone="blue">{q.subject}</Tag>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                     Closes: {q.deadline}
                  </span>
                </div>
                <div className="font-display font-semibold text-base text-black mb-1">{q.title}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  {q.questionCount} Rule Checks · {q.durationMins} mins · Threshold: {q.passingScore}%
                </div>
              </div>
              <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">
                  Applications Evaluated: <strong className="text-black">{q.submissionsCount}</strong>
                </span>
                <span className="font-semibold text-sagedeep">
                  Avg Match: {q.avgScore ? `${q.avgScore}%` : 'Active'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* List of Published Scheme Intakes */}
      <div className="space-y-3 pt-2">
        <div className="font-display font-semibold text-base text-[#0F172A]">
          Active MoTA Scholarship & Fellowship Intake Cycles
        </div>

        {postings.length > 0 ? (
          postings.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-display font-semibold text-base text-[#0F172A]">{p.title}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    Scheme Type:{' '}
                    <span className="capitalize font-medium">
                      {(p.posting_type || 'fellowship_scheme').replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <Tag tone="sage">
                  {p.total_applicants || 14} ST applicant{(p.total_applicants || 14) !== 1 ? 's' : ''}
                </Tag>
              </div>

              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{p.description}</p>

              {p.required_skills && (
                <div className="flex flex-wrap gap-1.5">
                  {p.required_skills.split(',').map((s: string, i: number) => (
                    <Tag key={i} tone="blue">
                       {s.trim()}
                    </Tag>
                  ))}
                </div>
              )}
            </Card>
          ))
        ) : (
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="font-display font-semibold text-base text-[#0F172A]">
                  National Fellowship for Scheduled Tribes (NFST) — Ph.D. & M.Phil. (2026-27 Cycle)
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  Scheme Type: <span className="font-medium">Central Sector Doctoral Fellowship (750 Slots)</span>
                </div>
              </div>
              <Tag tone="sage">642 ST Applicants</Tag>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
              Flagship MoTA fellowship providing JRF (@ ₹37,000/mo), SRF (@ ₹42,000/mo), HRA, and ₹25,000 annual contingency via PFMS Direct Benefit Transfer.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Tag tone="blue"> ST Certificate Verification</Tag>
              <Tag tone="blue"> Post-Graduation Marks &ge; 55%</Tag>
              <Tag tone="blue"> Research Proposal Merit</Tag>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
