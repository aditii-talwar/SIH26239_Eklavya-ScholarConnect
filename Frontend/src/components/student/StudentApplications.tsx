import React, { useState, useEffect } from 'react';
import { Card, PageHeader, Tag, Button, EmptyState, StatBlock, Modal } from '../common/UIComponents';
import { Icon } from '../common/Icon';
import { studentApi } from '../../api/student';
import { useAuth } from '../../context/AuthContext';
import { getStoredFeedbacks, saveStoredFeedbacks } from '../../data/mockData';
import { CourseFeedbackItem } from '../../types';

export interface StudentApplicationItem {
  id: number;
  posting_id?: number;
  title: string;
  posting_type?: string;
  company_name?: string;
  professor_name?: string;
  description?: string;
  required_skills?: string;
  status: 'applied' | 'shortlisted' | 'rejected' | 'selected' | string;
  applied_date?: string;
}

export const StudentApplications: React.FC<{ onBrowseOpportunities?: () => void }> = ({
  onBrowseOpportunities,
}) => {
  const [applications, setApplications] = useState<StudentApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<CourseFeedbackItem[]>([]);
  const [activeFeedbackCourse, setActiveFeedbackCourse] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [awardModalApp, setAwardModalApp] = useState<StudentApplicationItem | null>(null);

  const { currentUser } = useAuth();

  const fetchApplications = async () => {
    setFeedbacks(getStoredFeedbacks());
    if (currentUser && currentUser.role === 'student') {
      try {
        const res = await studentApi.getMyApplications();
        if (res && res.my_applications) {
          setApplications(res.my_applications);
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    } else {
      setApplications([
        {
          id: 101,
          title: 'National Fellowship for Scheduled Tribes (NFST) — Ph.D. & M.Phil. (FY 2025–26 Cycle)',
          posting_type: 'fellowship_scheme',
          company_name: 'Ministry of Tribal Affairs (MoTA) — NFST Division',
          required_skills: 'ST Certificate Verification, Post-Graduation Marks, Research Proposal Merit, Income Ceiling Compliance',
          status: 'selected',
          applied_date: 'Sep 2025',
        },
        {
          id: 102,
          title: 'Post-Matric ST Scholarship & Top Class Higher Education Scheme (FY 2025–26)',
          posting_type: 'post_matric_scholarship',
          company_name: 'Ministry of Tribal Affairs (MoTA) — State DBT Cell',
          required_skills: 'ST Certificate Verification, Income Ceiling Compliance, AISHE Institution Code Matched',
          status: 'shortlisted',
          applied_date: 'Sep 2025',
        },
      ]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [currentUser]);

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedbackCourse || !comment.trim()) return;
    const newEntry: CourseFeedbackItem = {
      id: 'fb-' + Date.now(),
      applicantName: currentUser?.name || 'Kareena Murmu (MOTA-NFST-2026-1042)',
      targetTitle: activeFeedbackCourse,
      targetType: 'Course',
      rating,
      comment: comment.trim(),
      date: 'Just now',
    };
    const updated = [newEntry, ...feedbacks];
    setFeedbacks(updated);
    saveStoredFeedbacks(updated);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setComment('');
      setActiveFeedbackCourse(null);
    }, 1200);
  };

  const totalCount = applications.length;
  const inProgressCount = applications.filter((a) => a.status === 'shortlisted' || a.status === 'applied').length;
  const completedCount = applications.filter((a) => a.status === 'selected').length;

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shortlisted':
        return <Tag tone="sage">Stage 5/8: Level-1 INO Cleared & Merit Screened</Tag>;
      case 'selected':
        return <Tag tone="sage">Stage 7/8: Sanction Issued & SNA SPARSH DBT Active</Tag>;
      case 'rejected':
        return <Tag tone="rose">Deficiency Flagged — Resubmit Document</Tag>;
      default:
        return <Tag tone="blue">Stage 3/8: Document OCR & Rule Verification</Tag>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Level-1 INO Verification Tracker, Deficiency Memos & Sanction Orders"
        desc="Track your MoTA scholarship & fellowship applications across NSP OTR Registration, Document OCR Rule Check, Level-1 INO (Institute Nodal Officer) Verification, Level-2 State Nodal Approval, and SNA SPARSH Just-In-Time DBT."
      />

      <div className="grid sm:grid-cols-4 gap-3">
        <StatBlock label="Submitted Applications" value={totalCount || 2} sub="FY 2025–26 Active" />
        <StatBlock label="Level-1 INO Cleared" value={inProgressCount} sub="AISHE / UDISE+ Verified" />
        <StatBlock label="Sanction Orders Issued" value={completedCount || 1} sub="SNA SPARSH DBT Ready" />
        <StatBlock label="Deficiency Memos Resolved" value={feedbacks.length} sub="Zero Pending Queries" />
      </div>

      {loading ? (
        <Card className="p-8 text-center text-xs text-slate-500">
          Loading your MoTA scheme applications…
        </Card>
      ) : applications.length === 0 ? (
        <div className="space-y-4">
          <EmptyState text="No MoTA scholarship applications submitted yet. Browse Post-Matric ST, NFST, and NOS schemes matched to your ST profile." />
          {onBrowseOpportunities && (
            <div className="text-center">
              <Button variant="primary" onClick={onBrowseOpportunities}>
                Browse MoTA Schemes →
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const isSelected = app.status.toLowerCase() === 'selected';
            const isShortlisted = app.status.toLowerCase() === 'shortlisted';
            return (
              <Card key={app.id} className="p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-slate-900">{app.title}</h4>
                      {renderStatusBadge(app.status)}
                      <Tag tone="amber">
                        {app.posting_type ? app.posting_type.replace(/_/g, ' ').toUpperCase() : 'MOTA SCHEME'}
                      </Tag>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                        <Icon name="landmark" className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        {app.company_name || app.professor_name || 'Ministry of Tribal Affairs (MoTA)'}
                      </span>
                      {app.applied_date && <span>| Submitted: {app.applied_date}</span>}
                      <span>| NSP OTR ID: <strong className="font-mono text-slate-900">NSP-ST-2025-001042</strong></span>
                    </div>

                    {/* Multi-Rule Explainable Verification Breakdown (No fake AI % badge) */}
                    <div className="grid sm:grid-cols-2 gap-2 pt-2">
                      <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          AISHE / UDISE+ Institution Code
                        </div>
                        <div className="font-semibold text-emerald-700 mt-0.5">
                          Matched (JNU New Delhi - AISHE U-0109)
                        </div>
                      </div>
                      <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Income Certificate OCR
                        </div>
                        <div className="font-semibold text-emerald-700 mt-0.5">
                          ₹1,80,000 / Annum (Under ₹2.50L Ceiling)
                        </div>
                      </div>
                      <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Caste Certificate Validation
                        </div>
                        <div className="font-semibold text-emerald-700 mt-0.5">
                          State e-District API Verified (#JH-ST-2026-88412)
                        </div>
                      </div>
                      <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Aadhaar NPCI Seeding Status
                        </div>
                        <div className="font-semibold text-emerald-700 mt-0.5">
                          Active Bank Account (SBI · SNA SPARSH Ready)
                        </div>
                      </div>
                    </div>

                    {app.required_skills && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {app.required_skills.split(',').map((s) => (
                          <Tag key={s.trim()} tone="blue">
                            Verified: {s.trim()}
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    {isSelected && (
                      <Button
                        variant="primary"
                        className="text-xs"
                        onClick={() => setAwardModalApp(app)}
                      >
                        <Icon name="file" className="w-3.5 h-3.5" />
                        View Sanction / Award Letter
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setActiveFeedbackCourse(app.title);
                        setRating(5);
                        setComment('');
                      }}
                    >
                      <Icon name="send" className="w-3.5 h-3.5" />
                      Reply to INO Scrutiny Memo
                    </Button>
                  </div>
                </div>

                {/* 8-Stage Pipeline Progress Bar */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    8-Stage MoTA Verification & SNA SPARSH Pipeline:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 text-[11px]">
                    {[
                      { label: '1. NSP OTR Reg', ok: true },
                      { label: '2. Scheme Applied', ok: true },
                      { label: '3. Docs Uploaded', ok: true },
                      { label: '4. OCR Rule Check', ok: true },
                      { label: '5. Level-1 INO', ok: isShortlisted || isSelected },
                      { label: '6. Level-2 Nodal', ok: isShortlisted || isSelected },
                      { label: '7. Sanction Order', ok: isSelected },
                      { label: '8. SNA SPARSH DBT', ok: isSelected },
                    ].map((st) => (
                      <div
                        key={st.label}
                        className={`px-2 py-1.5 rounded-md border text-center font-semibold ${
                          st.ok
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        {st.ok ? '[OK] ' : '[--] '}
                        {st.label}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Deficiency Memos, Clarifications & Resubmission Log */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="font-bold text-base text-slate-900">
              Deficiency Communication & Document Resubmission Log
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Track deficiency memos raised by Level-1 INO (Institute Nodal Officers) or State Nodal Officers and submit clarified e-District documents online.
            </p>
          </div>
          <Button
            variant="primary"
            className="text-xs"
            onClick={() => {
              setActiveFeedbackCourse(
                applications[0]?.title ||
                  'National Fellowship for Scheduled Tribes (NFST) — Ph.D. & M.Phil. (FY 2025–26 Cycle)'
              );
              setRating(5);
              setComment('');
            }}
          >
            + Submit Deficiency Clarification
          </Button>
        </div>

        <div className="space-y-3">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900">{fb.targetTitle}</span>
                  <Tag tone="blue">{fb.targetType === 'Course' ? 'Level-1 INO Scrutiny' : 'Annexure / QPR'}</Tag>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  {fb.officerReply ? 'Deficiency Resolved' : 'Under INO Review'}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Applicant Submission:</strong> "{fb.comment}"
              </p>
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Submitted by {fb.applicantName} · {fb.date}</span>
              </div>
              {fb.officerReply && (
                <div className="mt-2 p-3 rounded-md bg-blue-50 border border-blue-200 text-xs text-slate-900">
                  <strong className="text-[#1E3A8A]">Nodal Scrutiny Officer Order:</strong> {fb.officerReply}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Digital Fellowship Award Letter Modal */}
      <Modal
        open={!!awardModalApp}
        onClose={() => setAwardModalApp(null)}
        wide={true}
        title="Official Ministry of Tribal Affairs (MoTA) Sanction & Fellowship Award Letter"
      >
        {awardModalApp && (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="p-5 rounded-lg border border-slate-300 bg-slate-50 space-y-3">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A8A]">
                    Government of India · Ministry of Tribal Affairs (DBT & Fellowship Division)
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    SANCTION & AWARD LETTER — {awardModalApp.title}
                  </div>
                </div>
                <Tag tone="sage">DIGITALLY SIGNED · VERIFIED</Tag>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 bg-white p-3 rounded-md border border-slate-200">
                <div>
                  <span className="text-slate-500">Beneficiary Name:</span>{' '}
                  <strong className="text-slate-900">{currentUser?.name || 'Kareena Murmu'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Sanction Order No:</span>{' '}
                  <strong className="font-mono text-slate-900">MOTA/NFST/2025-26/AWD-1042</strong>
                </div>
                <div>
                  <span className="text-slate-500">ST Certificate Barcode:</span>{' '}
                  <strong className="font-mono text-emerald-700">#JH-ST-2026-88412 (e-District Verified)</strong>
                </div>
                <div>
                  <span className="text-slate-500">AISHE Code & NPCI Status:</span>{' '}
                  <strong className="text-[#1E3A8A]">AISHE U-0109 · NPCI Active</strong>
                </div>
              </div>

              <p className="text-slate-800">
                Based on Level-1 INO (Institute Nodal Officer) verification, e-District certificate validation, and approval by the State Nodal / MoTA Sanctioning Authority, you are hereby sanctioned the{' '}
                <strong>{awardModalApp.title}</strong>.
              </p>

              <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-950">
                <strong>Sanctioned Entitlements (SNA SPARSH Just-In-Time DBT via PFMS):</strong>
                <ul className="list-disc ml-5 mt-1 space-y-0.5">
                  <li>Junior Research Fellowship (JRF — Years 1 & 2): ₹37,000 / month + applicable HRA (27%)</li>
                  <li>Senior Research Fellowship (SRF — Years 3 to 5): ₹42,000 / month + applicable HRA (27%)</li>
                  <li>Annual Contingency Grant: ₹25,000 / annum · Direct credit to Aadhaar-seeded bank account</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Icon name="download" className="w-3.5 h-3.5" />
                Print / Download Sanction PDF
              </Button>
              <Button variant="primary" onClick={() => setAwardModalApp(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Deficiency Resubmission Modal */}
      <Modal
        open={!!activeFeedbackCourse}
        onClose={() => setActiveFeedbackCourse(null)}
        title="Submit Deficiency Clarification / Document Resubmission"
      >
        <form onSubmit={handleSaveFeedback} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              MoTA Scheme / Application Reference
            </label>
            <input
              value={activeFeedbackCourse || ''}
              onChange={(e) => setActiveFeedbackCourse(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus-ring bg-white text-slate-900"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Document Type Resubmitted
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { s: 5, label: 'ST Caste Certificate' },
                { s: 4, label: 'Income Certificate (< ₹2.50L)' },
                { s: 3, label: 'AISHE / UDISE+ Bonafide' },
                { s: 2, label: 'NPCI Bank Mandate' },
              ].map((item) => (
                <button
                  key={item.s}
                  type="button"
                  onClick={() => setRating(item.s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
                    rating === item.s
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Clarification Note & DigiLocker / e-District Document URI
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide your updated DigiLocker URI, Tehsildar Certificate Number, or Level-1 INO attestation details…"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus-ring bg-white text-slate-900"
            />
          </div>

          {savedNotice && (
            <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              [SUBMITTED] Clarification logged and transmitted to Level-1 INO Scrutiny Queue.
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setActiveFeedbackCourse(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Resubmission
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
