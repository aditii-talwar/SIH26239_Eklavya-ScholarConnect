import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import { NotificationItem } from '../../types';

export const PORTAL_META: Record<string, { label: string; icon: string; blurb: string }> = {
  student: {
    label: 'ST Applicant Portal',
    icon: 'student',
    blurb: 'Submit Post-Matric, Pre-Matric, NFST & NOS applications, upload certificates for OCR verification, verify NPCI Aadhaar-seeding status, and track SNA SPARSH DBT disbursement.',
  },
  academician: {
    label: 'Level-1 INO & Scrutiny Console',
    icon: 'shieldcheck',
    blurb: 'Perform Level-1 INO (Institute Nodal Officer) verification, validate AISHE / UDISE+ institution codes, inspect Income Certificate OCR (₹2.50L ceiling), and issue deficiency memos.',
  },
  university: {
    label: 'MoTA Ministry & State Nodal Console',
    icon: 'landmark',
    blurb: 'Authorize Level-2 State Nodal sanctions, oversee SNA SPARSH Just-In-Time DBT disbursement batches, audit deduplication & NPCI seeding flags, and publish MoTA circulars.',
  },
};

interface PortalTab {
  key: string;
  label: string;
  icon: string;
}

interface PortalShellProps {
  portalKey: string;
  tabs: PortalTab[];
  active: string;
  setActive: (tab: string) => void;
  go: (page: string) => void;
  children: React.ReactNode;
  subtitle?: string;
}

export const PortalShell: React.FC<PortalShellProps> = ({
  portalKey,
  tabs,
  active,
  setActive,
  go,
  children,
  subtitle,
}) => {
  const [mobileNav, setMobileNav] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchNotifs = async () => {
      setLoadingNotifs(true);
      try {
        const res = await authApi.getNotifications();
        if (isMounted && res && res.notifications) {
          setNotifications(res.notifications);
        }
      } catch {
        // fallback gracefully
      } finally {
        if (isMounted) setLoadingNotifs(false);
      }
    };
    fetchNotifs();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const meta = PORTAL_META[portalKey] || PORTAL_META.student;
  const userPortalKey = currentUser
    ? (currentUser.role === 'institute' ? 'university' : currentUser.role)
    : null;
  const items = userPortalKey ? [userPortalKey] : ['student', 'academician', 'university'];

  const roleBadgeLabel = (role?: string) => {
    if (role === 'student') return 'ST Applicant';
    if (role === 'academician') return 'Level-1 INO / Scrutiny Officer';
    if (role === 'institute') return 'MoTA Nodal Admin';
    return role || 'Official Visitor';
  };

  const adjustFontSize = (delta: number) => {
    const root = document.documentElement;
    const current = parseFloat(getComputedStyle(root).fontSize) || 16;
    const next = Math.min(18, Math.max(14, current + delta));
    root.style.fontSize = `${next}px`;
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-[#0F172A] portal-shell flex flex-col"
      style={
        {
          '--bg': '#F8FAFC',
          '--surface': '#FFFFFF',
          '--text': '#0F172A',
          '--text-muted': '#475569',
          '--border': '#E2E8F0',
        } as React.CSSProperties
      }
    >
      {/* TIER 1: Top Utility Bar */}
      <div className="bg-slate-900 text-white text-xs border-b border-slate-800">
        <div className="px-4 sm:px-6 min-h-[36px] py-1 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-sm bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center tracking-tighter shrink-0">
              GoI
            </div>
            <span className="font-semibold tracking-wide text-slate-100">
              Ministry of Tribal Affairs | Government of India
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300 text-[11px]">
              जनजातीय कार्य मंत्रालय • भारत सरकार
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <div className="hidden xl:flex items-center gap-2">
              <a
                href="https://scholarships.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                National Scholarship Portal (NSP)
              </a>
              <span className="text-slate-600">|</span>
              <a
                href="https://pfms.nic.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                PFMS (SNA SPARSH)
              </a>
              <span className="text-slate-600">|</span>
              <a
                href="https://dbtbharat.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                Direct Benefit Transfer
              </a>
            </div>

            <span className="hidden xl:inline text-slate-600">|</span>

            <div className="flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              <button
                type="button"
                onClick={() => adjustFontSize(-1)}
                className="px-1 hover:text-white font-semibold"
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => {
                  document.documentElement.style.fontSize = '16px';
                }}
                className="px-1 hover:text-white font-semibold border-x border-slate-700"
                title="Reset Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => adjustFontSize(1)}
                className="px-1 hover:text-white font-semibold"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            <div className="flex items-center gap-1 font-semibold">
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={lang === 'EN' ? 'text-white underline underline-offset-2' : 'text-slate-400 hover:text-white'}
              >
                English
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setLang('HI')}
                className={lang === 'HI' ? 'text-white underline underline-offset-2' : 'text-slate-400 hover:text-white'}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TIER 2: Primary Portal Header */}
      <header className="sticky top-0 z-40 bg-[#1E3A8A] text-white border-b border-slate-800 shadow-sm">
        <div className="px-4 sm:px-6 h-16 flex items-center gap-3">
          <button
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-blue-800"
            onClick={() => setMobileNav((v) => !v)}
            aria-label="Open sidebar"
          >
            <Icon name="menu" className="w-5 h-5" />
          </button>

          <button
            onClick={() => go('landing')}
            className="flex items-center gap-2.5 text-left shrink-0 focus-ring rounded-md"
          >
            <div className="w-9 h-9 rounded-md bg-slate-900 border border-blue-700 flex items-center justify-center font-bold text-xs text-amber-400 shrink-0">
              MoTA
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold tracking-tight leading-tight text-white">
                MoTA ScholarConnect
              </div>
              <div className="text-[11px] text-blue-200 font-medium hidden sm:block">
                {meta.label}
              </div>
            </div>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* Role Switcher (Demo / Multi-role view) */}
            <div className="hidden md:flex items-center gap-1 mr-1">
              <button
                onClick={() => go('landing')}
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-blue-100 hover:bg-blue-800 transition"
              >
                National Dashboard
              </button>
              {items.map((k) => (
                <button
                  key={k}
                  onClick={() => go(k)}
                  className={
                    'px-3 py-1.5 rounded-md text-xs font-semibold transition ' +
                    (k === portalKey
                      ? 'bg-[#2563EB] text-white border border-blue-400 shadow-sm'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white')
                  }
                >
                  {PORTAL_META[k].label}
                </button>
              ))}
            </div>

            {currentUser && (
              <button
                onClick={async () => {
                  await logout();
                  window.location.hash = '';
                  go('landing');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-red-700 border border-blue-700 transition"
              >
                Sign out
              </button>
            )}

            <div className="relative hidden sm:block w-48">
              <Icon name="search" className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-200" />
              <input
                placeholder="Search Application / AISHE…"
                className="w-full bg-slate-900 border border-blue-700 placeholder-blue-300 rounded-md pl-8 pr-2 py-1.5 text-xs text-white outline-none focus:border-blue-400"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="p-2 rounded-md hover:bg-blue-800 relative focus-ring border border-blue-700 bg-slate-900"
                aria-label="Notifications"
              >
                <Icon name="bell" className="w-[18px] h-[18px]" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white text-slate-900 rounded-lg shadow-lg border border-slate-200 p-2.5 z-50 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-200 mb-1.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>MoTA System Alerts</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {notifications.length}
                      </span>
                    </div>
                    {loadingNotifs && (
                      <span className="text-[10px] text-slate-500">Syncing…</span>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      No new MoTA verification or PFMS alerts.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 text-xs rounded-md hover:bg-slate-50 transition border border-slate-100"
                        >
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            {n.tag && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  n.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : n.type === 'warning'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {n.tag}
                              </span>
                            )}
                            {n.time && (
                              <span className="text-[10px] text-slate-500 ml-auto font-medium">
                                {n.time}
                              </span>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed text-slate-800">{n.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile & Session Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="w-8 h-8 rounded-md bg-[#2563EB] border border-blue-400 text-white flex items-center justify-center text-xs font-bold shrink-0 hover:bg-blue-600 focus-ring"
                title={currentUser ? `${currentUser.name} (${roleBadgeLabel(currentUser.role)})` : 'User Profile'}
              >
                {currentUser ? currentUser.name[0].toUpperCase() : <Icon name="user" className="w-4 h-4" />}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white text-slate-900 rounded-lg shadow-lg border border-slate-200 p-2 z-50">
                  {currentUser ? (
                    <>
                      <div className="px-3 py-2 border-b border-slate-200">
                        <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {roleBadgeLabel(currentUser.role)}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          await logout();
                          setUserMenuOpen(false);
                          window.location.hash = '';
                          go('landing');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-700 hover:bg-red-50 rounded-md mt-1 font-semibold transition"
                      >
                        Sign out of Portal
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-600">
                      <p className="mb-2">Browsing in Official Demo Inspection Mode.</p>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          go('landing');
                        }}
                        className="text-[#2563EB] font-bold underline underline-offset-2"
                      >
                        Return to National Portal Login
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={
            (mobileNav ? 'translate-x-0' : '-translate-x-full') +
            ' lg:translate-x-0 fixed lg:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-3 transition-transform duration-200 overflow-y-auto'
          }
        >
          <div className="px-3 py-2.5 mb-2 bg-slate-50 border border-slate-200 rounded-md">
            <div className="text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider">{meta.label}</div>
            {subtitle && <div className="text-[11px] text-slate-600 mt-0.5 font-medium">{subtitle}</div>}
          </div>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setActive(t.key);
                  setMobileNav(false);
                }}
                className={
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-semibold transition focus-ring ' +
                  (active === t.key
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')
                }
              >
                <Icon name={t.icon} className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-200 px-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Compliance & Integration
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>NSP OTR Sync</span>
                <span className="text-emerald-700 font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AISHE / UDISE+ API</span>
                <span className="text-emerald-700 font-bold">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>SNA SPARSH PFMS</span>
                <span className="text-emerald-700 font-bold">JIT Enabled</span>
              </div>
            </div>
          </div>
        </aside>

        {mobileNav && (
          <div
            className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden"
            onClick={() => setMobileNav(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Standard Government Portal Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span>NIC Portal Disclaimer</span>
            <span>|</span>
            <span>CPGRAMS Grievance Redressal</span>
            <span>|</span>
            <span>NSP Helpdesk</span>
            <span>|</span>
            <span>Privacy Policy</span>
            <span>|</span>
            <span>Accessibility Statement</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Designed & Maintained for Ministry of Tribal Affairs (MoTA) — Smart India Hackathon (SIH26239).
          </div>
        </div>
      </footer>
    </div>
  );
};
