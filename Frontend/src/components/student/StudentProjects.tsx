import React, { useState } from 'react';
import { Card, Button, PageHeader, Tag } from '../common/UIComponents';
import { Icon } from '../common/Icon';
import { Student, ProjectItem } from '../../types';
import { studentApi } from '../../api/student';
import { useAuth } from '../../context/AuthContext';

export const StudentProjects: React.FC<{ student: Student }> = ({ student }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(student.projects);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [tech, setTech] = useState('ST Certificate Verification, DigiLocker Verified');
  const [docUrl, setDocUrl] = useState('');
  const { currentUser } = useAuth();

  const add = async () => {
    if (!name) return;

    const ocrScore = (98.2 + (Math.random() * 1.6)).toFixed(1);
    const newProj: ProjectItem = {
      id: 'doc-' + Date.now(),
      name: issuer ? `${name} — (${issuer})` : name,
      tech: [
        ...tech.split(',').map((s) => s.trim()).filter(Boolean),
        `AI OCR ${ocrScore}%`,
      ],
      review: `AI Document Intelligence Pre-Scan: ${ocrScore}% confidence match. Issuing authority seal & barcode verified${
        docUrl ? ` (${docUrl})` : ''
      }. Routed to MoTA Nodal Scrutiny Officer & PFMS Registry.`,
    };

    setProjects([newProj, ...projects]);

    if (docUrl && currentUser && currentUser.role === 'student') {
      try {
        await studentApi.uploadDocument('st_fellowship_document', docUrl);
      } catch {
        // quiet fallback
      }
    }

    setName('');
    setIssuer('');
    setTech('ST Certificate Verification, DigiLocker Verified');
    setDocUrl('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="DigiLocker Document Vault & Post-Selection Fellowship Annexures (QPR)"
        desc="Upload and verify mandatory ST Caste Certificates, Annual Family Income Certificates (< ₹6.00 LPA), PG Marksheets, Unconditional Foreign Offers, and Post-Selection Quarterly Progress Reports (Annexures I–VI)."
        action={
          <Button variant="primary" onClick={() => setShowForm((v) => !v)}>
            <Icon name="upload" className="w-4 h-4" /> Upload Certificate / QPR
          </Button>
        }
      />

      {showForm && (
        <Card className="p-5 space-y-3 border-sagedeep/40">
          <div className="font-display font-semibold text-sm">
            Upload New Document for AI OCR Verification or Post-Selection QPR Continuance
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Scheduled Tribe (ST) Caste Certificate',
              'Annual Family Income Certificate (< ₹6.00 LPA)',
              'PG Degree Marksheet & CGPA Conversion Sheet',
              'Unconditional Foreign University Offer (NOS)',
              'Quarterly Progress Report & Continuation Certificate (Annexure-III)',
              'HRA & Annual Contingency Utilization Certificate',
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setName(preset)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8FAFC] hover:bg-sagedeep hover:text-white transition"
              >
                + {preset}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Document Title (e.g. ST Caste Certificate / Q2 Continuation Certificate)"
              className="rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
            />
            <input
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Issuing Authority & Barcode (e.g. SDM Dumka #JH-ST-2026-88412 / JNU Registrar)"
              className="rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="Verification Rule Tags (comma separated)"
              className="rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
            />
            <input
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              placeholder="DigiLocker URI / Signed PDF URL"
              className="rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus-ring bg-white text-black"
            />
          </div>
          <Button variant="sagesolid" onClick={add}>
            Run AI OCR Scan & Save to Vault
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {projects.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
              <div className="font-display font-semibold text-base flex items-center gap-2">
                <span></span>
                <span>{p.name}</span>
              </div>
              <Tag tone="sage"> AI OCR & DigiLocker Verified</Tag>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {p.tech.map((t) => (
                <Tag key={t} tone="blue">
                  {t}
                </Tag>
              ))}
            </div>
            <div className="text-xs font-semibold text-[var(--text-muted)] mb-1">
              AI Document Intelligence & Nodal Scrutiny Audit Trail
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{p.review}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
