import React, { useState } from 'react';
import { PortalShell } from '../common/PortalShell';
import {
  UniversityOverview,
  UniversityDirectory,
  UniversityCompetencyMapping,
  UniversityGuidance,
} from './UniversityComponents';
import { UNIVERSITIES, STUDENTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const UNI_TABS = [
  { key: 'overview',   label: 'MoTA Nodal Overview',         icon: 'home' },
  { key: 'directory',  label: 'SNA SPARSH Sanction Queue',   icon: 'users' },
  { key: 'competency', label: 'AISHE & INO Officer Mapping', icon: 'target' },
  { key: 'guidance',   label: 'MoTA Circular Publisher',     icon: 'compass' },
];

export const UniversityPortal: React.FC<{ go: (page: string) => void }> = ({ go }) => {
  const [active, setActive] = useState('overview');
  const { currentUser } = useAuth();
  const baseUni = UNIVERSITIES[0];

  const uni = {
    ...baseUni,
    name: currentUser?.name || 'Ministry of Tribal Affairs (MoTA) — Scholarship & Fellowship Division',
  };

  const renderView = () => {
    switch (active) {
      case 'overview':
        return <UniversityOverview uni={uni} students={STUDENTS} />;
      case 'directory':
        return <UniversityDirectory students={STUDENTS} />;
      case 'competency':
        return <UniversityCompetencyMapping />;
      case 'guidance':
        return <UniversityGuidance students={STUDENTS} />;
      default:
        return <UniversityOverview uni={uni} students={STUDENTS} />;
    }
  };

  return (
    <PortalShell
      portalKey="university"
      tabs={UNI_TABS}
      active={active}
      setActive={setActive}
      go={go}
      subtitle={uni.name}
    >
      {renderView()}
    </PortalShell>
  );
};
