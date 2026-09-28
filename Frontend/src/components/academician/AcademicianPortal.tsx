import React, { useState, useEffect } from 'react';
import { PortalShell } from '../common/PortalShell';
import {
  AcademicianOverview,
  AcademicianOpportunities,
  AcademicianPublish,
  AcademicianPapers,
  AcademicianDiscuss,
} from './AcademicianComponents';
import { ACADEMICIANS, getStoredLibrary, saveStoredLibrary } from '../../data/mockData';
import { Academician, ResearchPaper } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { academicianApi } from '../../api/academician';

const ACAD_TABS = [
  { key: 'overview',      label: 'Level-1 INO Scrutiny Queue', icon: 'shieldcheck' },
  { key: 'opportunities', label: 'Scheme Eligibility Rules',   icon: 'briefcase' },
  { key: 'publish',       label: 'Publish MoTA SOPs',          icon: 'upload' },
  { key: 'papers',        label: 'Scheme Guidelines Repo',     icon: 'book' },
  { key: 'discuss',       label: 'Deficiency Adjudication',    icon: 'msg' },
];

export const AcademicianPortal: React.FC<{ go: (page: string) => void }> = ({ go }) => {
  const [active, setActive] = useState('overview');
  const { currentUser } = useAuth();
  const [papers, setPapers] = useState<ResearchPaper[]>(() => getStoredLibrary());

  useEffect(() => {
    const fetchPostings = async () => {
      if (currentUser && currentUser.role === 'academician') {
        try {
          const res = await academicianApi.getMyPostings();
          if (res && res.postings && res.postings.length > 0) {
            const stored = getStoredLibrary();
            const existingTitles = new Set(stored.map((s) => s.title.toLowerCase()));
            const fromApi: ResearchPaper[] = res.postings
              .filter((p) => !existingTitles.has(p.title.toLowerCase()))
              .map((p) => ({
                id: p.id,
                title: p.title,
                field: p.required_skills || 'MoTA Scheme Guidelines',
                materialType: 'Study Material',
                durationOrSize: 'Official MoTA Circular',
                trainerName: currentUser.name || 'Dr. Rajeshwar Meena (Nodal Scrutiny Officer)',
                uploadedAt: 'Sep 2026',
                desc: p.description,
                discussions: [],
              }));
            if (fromApi.length > 0) {
              const merged = [...stored, ...fromApi];
              setPapers(merged);
              saveStoredLibrary(merged);
            }
          }
        } catch {
          // fallback
        }
      }
    };

    fetchPostings();
  }, [currentUser]);

  const handleSetPapers: React.Dispatch<React.SetStateAction<ResearchPaper[]>> = (updater) => {
    setPapers((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveStoredLibrary(next);
      return next;
    });
  };

  const acad: Academician = {
    ...ACADEMICIANS[0],
    name: currentUser?.name || ACADEMICIANS[0].name,
    field: currentUser?.expertise_domain || ACADEMICIANS[0].field,
    papers,
  };

  const renderView = () => {
    switch (active) {
      case 'overview':
        return <AcademicianOverview acad={acad} />;
      case 'opportunities':
        return <AcademicianOpportunities />;
      case 'publish':
        return <AcademicianPublish papers={papers} setPapers={handleSetPapers} />;
      case 'papers':
        return <AcademicianPapers papers={papers} />;
      case 'discuss':
        return <AcademicianDiscuss papers={papers} setPapers={handleSetPapers} />;
      default:
        return <AcademicianOverview acad={acad} />;
    }
  };

  return (
    <PortalShell
      portalKey="academician"
      tabs={ACAD_TABS}
      active={active}
      setActive={setActive}
      go={go}
      subtitle={`${acad.name} · MoTA Nodal Scrutiny & Screening Officer`}
    >
      {renderView()}
    </PortalShell>
  );
};
