import React, { useState, useEffect } from 'react';
import { Card, PageHeader, Tag, ProgressBar, Button, Modal } from '../common/UIComponents';
import { OPPORTUNITIES, getStoredFeedbacks, saveStoredFeedbacks } from '../../data/mockData';
import { studentApi } from '../../api/student';
import { Opportunity } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const StudentOpportunities: React.FC = () => {
  const [min, setMin] = useState(0);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(OPPORTUNITIES);
  const [appliedIds, setAppliedIds] = useState<(string | number)[]>([]);
  const [applyingId, setApplyingId] = useState<string | number | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  // Scheme query / deficiency clarification modal state
  const [feedbackCourse, setFeedbackCourse] = useState<Opportunity | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (currentUser && currentUser.role === 'student') {
        try {
          const [postingsRes, appsRes] = await Promise.allSettled([
            studentApi.getPostings(),
            studentApi.getMyApplications(),
          ]);

          if (appsRes.status === 'fulfilled' && appsRes.value?.my_applications) {
            const ids = appsRes.value.my_applications.map((a: any) => a.posting_id || a.id);
            setAppliedIds(ids);
          }

          if (postingsRes.status === 'fulfilled' && postingsRes.value?.postings?.length > 0) {
            const mapped: Opportunity[] = postingsRes.value.postings.map((p) => ({
              id: p.id,
              title: p.title,
              company: p.company || p.professor || 'Ministry of Tribal Affairs (MoTA) — Fellowship Division',
              field: p.posting_type === 'overseas_scholarship' ? 'Overseas Scholarship (NOS)' : 'Central Sector ST Fellowship',
              skills: p.required_skills ? p.required_skills.split(',').map((s) => s.trim()) : [],
              match: 88 + ((p.id * 5) % 11),
              posting_type: p.posting_type || 'fellowship_scheme',
              description: p.description,
              duration: 'Full Programme Duration · Direct PFMS DBT',
              mode: 'Online Application + AI OCR Scrutiny',
            }));
            const existingTitles = new Set(mapped.map((m) => m.title.toLowerCase()));
            const combined = [
              ...mapped,
              ...OPPORTUNITIES.filter((o) => !existingTitles.has(o.title.toLowerCase())),
            ];
            setOpportunities(combined);
          }
        } catch {
          // fallback to default MoTA schemes
        }
      }
    };

    loadData();
  }, [currentUser]);

  const handleEnroll = async (oppId: string | number) => {
    if (typeof oppId === 'number') {
      setApplyingId(oppId);
      try {
        await studentApi.applyToPosting(oppId);
        setAppliedIds((prev) => [...prev, oppId]);
      } catch (err: any) {
        alert(err.message || 'Could not submit scheme application.');
      } finally {
        setApplyingId(null);
      }
    } else {
      setAppliedIds((prev) => [...prev, oppId]);
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackCourse || !comment.trim()) return;
    const list = getStoredFeedbacks();
    const newFb = {
      id: 'fb-' + Date.now(),
      traineeName: currentUser?.name || 'Kareena Murmu (MOTA-NFST-2026-1042)',
      targetTitle: feedbackCourse.title,
      targetType: 'Course' as const,
      rating,
      comment: comment.trim(),
      date: 'Just now',
    };
    saveStoredFeedbacks([newFb, ...list]);
    setFeedbackSaved(true);
    setTimeout(() => {
      setFeedbackSaved(false);
      setComment('');
      setFeedbackCourse(null);
    }, 1500);
  };

  const filtered = opportunities
    .filter((o) => o.match >= min)
    .sort((a, b) => b.match - a.match);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Apply for MoTA Scholarship & Fellowship Schemes (2026-27)"
        desc="Submit online applications for National Fellowship for Scheduled Tribes (NFST), National Overseas Scholarship (NOS), Top Class Education, and Post-Matric DBT schemes."
      />
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[var(--text-muted)]">Filter by Automated Eligibility Match</span>
        {[0, 80, 90, 95].map((v) => (
          <button
            key={v}
            onClick={() => setMin(v)}
            className={
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition ' +
              (min === v
                ? 'bg-sagedeep text-pcream border-sagedeep'
                : 'border-[#E2E8F0] hover:bg-[#F8FAFC]')
            }
          >
            {v === 0 ? 'All MoTA Schemes' : v + '%+ Eligible'}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((o) => {
          const isEnrolled = appliedIds.includes(o.id);
          const isEnrolling = applyingId === o.id;

          return (
            <Card
              key={o.id}
              className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedOpp(o)}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-display font-semibold text-black hover:text-sagedeep">{o.title}</div>
                    <div className="text-xs text-[var(--text-muted)]">{o.company}</div>
                  </div>
                  <div
                    className={
                      'text-xs font-bold rounded-full px-2.5 py-1 shrink-0 ' +
                      (o.match >= 85
                        ? 'bg-sage/25 text-sagedeep'
                        : o.match >= 70
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#F8FAFC] text-[var(--text-muted)]')
                    }
                  >
                    {o.match}% eligible
                  </div>
                </div>
                {o.description && (
                  <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">{o.description}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {o.skills.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
                <div className="mb-4">
                  <ProgressBar
                    value={o.match}
                    colorClass={
                      o.match >= 85
                        ? 'bg-sagedeep'
                        : o.match >= 70
                        ? 'bg-amber-500'
                        : 'bg-black/30'
                    }
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    className="text-xs py-1.5 px-2.5 text-[var(--text-muted)] hover:text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOpp(o);
                    }}
                  >
                    Scheme Rules & Norms
                  </Button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeedbackCourse(o);
                      setRating(5);
                      setComment('');
                    }}
                    className="text-xs font-semibold text-deepblue hover:underline px-2 py-1"
                  >
                     Scrutiny Query
                  </button>
                </div>
                <Button
                  variant={isEnrolled ? 'sagesolid' : 'outline'}
                  className="text-xs py-1.5 px-3 border-sagedeep text-sagedeep"
                  disabled={isEnrolled || isEnrolling}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnroll(o.id);
                  }}
                >
                  {isEnrolled ? 'Application Submitted ' : isEnrolling ? 'Submitting…' : 'Apply Online'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Scheme Details Modal */}
      {selectedOpp && (
        <Modal
          open={!!selectedOpp}
          onClose={() => setSelectedOpp(null)}
          wide={true}
          title="MoTA Scheme Eligibility Criteria, Financial Assistance & Document Checklist"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-black">{selectedOpp.title}</h3>
                <div className="text-sm font-medium text-[var(--text-muted)] mt-0.5">{selectedOpp.company}</div>
              </div>
              <div className="text-xs font-bold rounded-full px-3 py-1 whitespace-nowrap bg-sage/25 text-sagedeep">
                {selectedOpp.match}% Automated Rule Match
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Tag tone="sage">MOTA CENTRAL SECTOR SCHEME</Tag>
              <Tag tone="blue">{selectedOpp.field || 'Scheduled Tribe Fellowship'}</Tag>
              <Tag tone="amber">AI OCR & PFMS DBT Enabled</Tag>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Scheme Objective & Financial Entitlements
              </h4>
              <p className="text-sm text-black/80 leading-relaxed whitespace-pre-line bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                {selectedOpp.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Mandatory Eligibility & Document Rules Checked by AI Engine
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedOpp.skills && selectedOpp.skills.length > 0 ? (
                  selectedOpp.skills.map((s) => (
                    <Tag key={s} tone="sage"> {s}</Tag>
                  ))
                ) : (
                  <span className="text-xs text-[var(--text-muted)]">Standard ST & Income criteria</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0] text-xs">
              <div>
                <span className="text-[var(--text-muted)] font-medium">Annual Slot Intake & Disbursal Mode:</span>
                <p className="font-semibold text-black mt-0.5">{selectedOpp.mode || '750 Slots · Direct PFMS DBT'}</p>
              </div>
              <div>
                <span className="text-[var(--text-muted)] font-medium">Tenure & Fellowship Rates:</span>
                <p className="font-semibold text-black mt-0.5">{selectedOpp.duration || 'Up to 5 Years (JRF + SRF + HRA)'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const course = selectedOpp;
                  setSelectedOpp(null);
                  setFeedbackCourse(course);
                }}
              >
                 Submit Clarification / Query to Scrutiny Cell
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setSelectedOpp(null)}>
                  Close
                </Button>
                <Button
                  variant={appliedIds.includes(selectedOpp.id) ? 'sagesolid' : 'primary'}
                  disabled={appliedIds.includes(selectedOpp.id) || applyingId === selectedOpp.id}
                  onClick={() => handleEnroll(selectedOpp.id)}
                >
                  {appliedIds.includes(selectedOpp.id)
                    ? 'Application Submitted '
                    : applyingId === selectedOpp.id
                    ? 'Submitting…'
                    : 'Submit Online Application'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Submit Scrutiny Clarification / Query Modal */}
      <Modal
        open={!!feedbackCourse}
        onClose={() => setFeedbackCourse(null)}
        title={feedbackCourse ? `Scrutiny Clarification / Query: ${feedbackCourse.title}` : 'Scrutiny Query'}
      >
        {feedbackCourse && (
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <p className="text-xs text-[var(--text-muted)]">
              Submit a document clarification, deficiency response, or eligibility query to the Nodal Scrutiny Officer for{' '}
              <strong className="text-black">{feedbackCourse.title}</strong>.
            </p>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">
                Urgency / Readiness Priority (1 to 5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      rating >= star
                        ? 'bg-amber-400/25 border-amber-500 text-amber-900'
                        : 'bg-white border-[#E2E8F0] text-[var(--text-muted)]'
                    }`}
                  >
                    Priority {star}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                Deficiency Clarification / Document Reference Details
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Mention your DigiLocker Certificate Barcode, Tehsildar Income Certificate #, or CGPA conversion formula details..."
                className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
              />
            </div>

            {feedbackSaved && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                 Your clarification has been logged and routed to the MoTA Nodal Scrutiny Officer!
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="ghost" type="button" onClick={() => setFeedbackCourse(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Send to Scrutiny Officer
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
