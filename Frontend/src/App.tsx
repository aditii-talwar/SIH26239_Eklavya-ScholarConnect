import React, { useState, useEffect, Fragment } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/landing/AuthModal';
import { StudentPortal } from './components/student/StudentPortal';
import { AcademicianPortal } from './components/academician/AcademicianPortal';
import { UniversityPortal } from './components/university/UniversityPortal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BHASHINI_LANGUAGES } from './api/informant';
import { useBhashiniDomTranslator } from './utils/bhashiniDomTranslator';
import { UserRole } from './types';
import './App.css';

function MainContent() {
  const [page, setPage] = useState('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [siteLang, setSiteLangState] = useState<string>(() => {
    try {
      return localStorage.getItem('scholarconnect_site_lang') || 'en';
    } catch {
      return 'en';
    }
  });
  const { currentUser } = useAuth();

  const setSiteLang = (lang: string) => {
    setSiteLangState(lang);
    try {
      localStorage.setItem('scholarconnect_site_lang', lang);
    } catch {
      // ignore storage errors
    }
  };

  // Global Bhashini DOM & NMT translator across all tabs, modals, and portals
  useBhashiniDomTranslator(siteLang);

  const go = (p: string) => {
    if (p === 'landing') {
      window.location.hash = '';
      setPage('landing');
      window.scrollTo(0, 0);
      return;
    }

    if (currentUser) {
      const allowed = currentUser.role === 'institute' ? 'university' : currentUser.role;
      setPage(allowed);
    } else {
      // Unauthenticated users are redirected to landing with login modal
      window.location.hash = '';
      setPage('landing');
      setAuthMode('login');
    }
    window.scrollTo(0, 0);
  };

  // Sync state whenever login or logout occurs
  useEffect(() => {
    if (currentUser) {
      const allowed = currentUser.role === 'institute' ? 'university' : currentUser.role;
      setPage(allowed);
    } else {
      window.location.hash = '';
      setPage('landing');
    }
  }, [currentUser]);

  useEffect(() => {
    const map: Record<string, string> = {
      landing: '',
      student: 'student',
      academician: 'academician',
      university: 'university',
    };
    const h = '#' + (map[page] || '');
    if (window.location.hash !== h) {
      window.history.replaceState(null, '', h || '#');
    }
  }, [page]);

  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash.replace('#', '');
      if (!h || h === 'landing') {
        setPage('landing');
        return;
      }
      if (currentUser) {
        const allowed = currentUser.role === 'institute' ? 'university' : currentUser.role;
        setPage(allowed);
      } else {
        // Logged-out users cannot access portals by typing hash URLs
        window.location.hash = '';
        setPage('landing');
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [currentUser]);

  const openAuth = (mode: 'login' | 'register') => setAuthMode(mode);

  const handleAuthSuccess = (userRole: UserRole) => {
    if (userRole === 'institute') {
      setPage('university');
    } else {
      setPage(userRole);
    }
  };

  let body;
  if (page === 'landing') {
    body = (
      <LandingPage
        go={go}
        openAuth={openAuth}
        siteLang={siteLang}
        setSiteLang={setSiteLang}
      />
    );
  } else if (page === 'student') {
    body = <StudentPortal go={go} />;
  } else if (page === 'academician') {
    body = <AcademicianPortal go={go} />;
  } else if (page === 'university') {
    body = <UniversityPortal go={go} />;
  }

  return (
    <Fragment>
      {body}
      {page !== 'landing' && (
        <div
          data-no-translate="true"
          className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#0F172A]/95 backdrop-blur text-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-xl border border-slate-700 text-[11px] sm:text-xs"
        >
          <span className="font-bold text-amber-400">🌐 Bhashini:</span>
          <select
            value={siteLang}
            onChange={(e) => setSiteLang(e.target.value)}
            className="bg-slate-800 text-white font-semibold rounded px-2 py-0.5 border border-slate-600 focus:outline-none text-xs"
          >
            {BHASHINI_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native}
              </option>
            ))}
          </select>
        </div>
      )}
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        setMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </Fragment>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
