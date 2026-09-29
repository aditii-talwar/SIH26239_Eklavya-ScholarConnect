import React, { useState } from 'react';
import { Icon } from '../common/Icon';
import { useAuth } from '../../context/AuthContext';
import { BHASHINI_LANGUAGES, getPortalUiStrings } from '../../api/informant';

export type GovTabKey =
  | 'overview'
  | 'informant'
  | 'features'
  | 'workflow'
  | 'schemes'
  | 'institutes';

export const GOV_NAV_TABS: { key: GovTabKey; label: string; icon: string }[] = [
  { key: 'overview',   label: 'Platform Overview & Impact',          icon: 'home' },
  { key: 'informant',  label: 'MoTA Informant & Checklist (Bhashini)', icon: 'checkc' },
  { key: 'workflow',   label: '8-Stage Digital Workflow',            icon: 'target' },
  { key: 'schemes',    label: 'Central ST Schemes',                  icon: 'award' },
  { key: 'institutes', label: 'Empaneled Institutes',                icon: 'building2' },
];

interface LandingNavProps {
  go: (page: string) => void;
  openAuth: (mode: 'login' | 'register') => void;
  activeTab?: GovTabKey;
  setActiveTab?: (tab: GovTabKey, autoScroll?: boolean) => void;
  siteLang?: string;
  setSiteLang?: (lang: string) => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  go,
  openAuth,
  activeTab = 'overview',
  setActiveTab,
  siteLang = 'en',
  setSiteLang,
}) => {
  const { currentUser, logout } = useAuth();
  const [localLang, setLocalLang] = useState<string>('en');
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLang = setSiteLang ? siteLang : localLang;
  const handleLangChange = (newLang: string) => {
    if (setSiteLang) {
      setSiteLang(newLang);
    } else {
      setLocalLang(newLang);
    }
    try {
      localStorage.setItem('scholarconnect_site_lang', newLang);
    } catch {
      // ignore
    }
  };

  const ui = getPortalUiStrings(currentLang);

  const adjustFontSize = (scale: number) => {
    document.documentElement.style.fontSize = `${scale}px`;
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* TIER 1: TOP UTILITY BAR (#0F172A) */}
      <div className="bg-[#0F172A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[36px] py-1 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
          {/* Left: Emblem of India placeholder + Ministry Branding */}
          <div className="flex items-center gap-2.5 font-medium">
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-[#D97706] text-white font-bold text-[10px] shrink-0">
              GoI
            </span>
            <span className="tracking-wide font-semibold text-white">
              {ui.ministryHeader}
            </span>
          </div>

          {/* Right: Quick Links, Accessibility Controls (A- A A+), and Bhashini Language Toggle */}
          <div className="flex flex-wrap items-center gap-3 text-slate-300">
            <div className="hidden lg:flex items-center gap-2 text-[11px]">
              <a
                href="#schemes"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab && setActiveTab('schemes');
                }}
                className="hover:text-white transition-colors"
              >
                {ui.tabs.schemes}
              </a>
              <span className="text-slate-600">|</span>
              <a
                href="#informant"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab && setActiveTab('informant');
                }}
                className="hover:text-white transition-colors"
              >
                {ui.tabs.informant}
              </a>
              <span className="text-slate-600">|</span>
              <a
                href="#workflow"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab && setActiveTab('workflow');
                }}
                className="hover:text-white transition-colors"
              >
                {ui.tabs.workflow}
              </a>
            </div>

            <span className="hidden lg:inline text-slate-700">|</span>

            {/* Accessibility Controls: A- A A+ */}
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5">
              <button
                type="button"
                onClick={() => adjustFontSize(14)}
                className="px-1 text-[11px] font-semibold text-slate-200 hover:text-white"
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => adjustFontSize(16)}
                className="px-1 text-[11px] font-semibold text-white bg-slate-700 rounded"
                title="Default Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => adjustFontSize(17.5)}
                className="px-1 text-[11px] font-semibold text-slate-200 hover:text-white"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Unified Bhashini Language Selector + Quick Toggle: English | हिंदी */}
            <div
              data-no-translate="true"
              className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-[11px]"
            >
              <button
                type="button"
                onClick={() => handleLangChange('en')}
                className={currentLang === 'en' ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'}
              >
                English
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => handleLangChange('hi')}
                className={currentLang === 'hi' ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'}
              >
                हिंदी
              </button>
              <span className="text-slate-600">|</span>
              <select
                value={currentLang}
                onChange={(e) => handleLangChange(e.target.value)}
                aria-label="Select Language (Bhashini)"
                className="bg-slate-900 text-white text-[11px] font-semibold rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none"
              >
                {BHASHINI_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TIER 2: PRIMARY NAVIGATION BAR (Deep Navy #1E3A8A) */}
      <div className="bg-[#1E3A8A] text-white border-b border-[#0F172A]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          {/* Portal Branding */}
          <button
            type="button"
            onClick={() => {
              if (setActiveTab) setActiveTab('overview', false);
              go('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus-ring rounded-md min-w-0 flex-1 sm:flex-initial"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-[#0F172A] border border-blue-700 text-[#D97706] flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="landmark" className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-lg font-bold text-white leading-tight flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="truncate">{ui.portalTitle}</span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#16A34A] text-white shrink-0">
                  {ui.officialBadge}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-blue-100 font-medium mt-0.5 line-clamp-1">
                {ui.portalSubtitle}
              </div>
            </div>
          </button>

          {/* Role Access & Auth Controls (Always Visible on Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] sm:text-xs font-semibold text-white bg-[#16A34A] px-2 sm:px-2.5 py-1 rounded-md max-w-[130px] sm:max-w-none truncate">
                  {currentUser.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="px-2.5 sm:px-3 py-1.5 rounded-md border border-blue-600 bg-[#0F172A] text-[11px] sm:text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  {ui.signOutBtn}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] sm:text-xs font-semibold shadow-sm border border-blue-400 transition-colors"
                >
                  {ui.loginBtn}
                </button>
                <button
                  type="button"
                  onClick={() => openAuth('register')}
                  className="inline-flex px-2.5 sm:px-3 py-1.5 rounded-md bg-[#D97706] hover:bg-amber-700 text-white text-[11px] sm:text-xs font-semibold transition-colors"
                >
                  {ui.registerBtn}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-md border border-blue-700 text-white bg-[#0F172A]/60"
              aria-label="Toggle Menu"
            >
              <Icon name={mobileOpen ? 'x' : 'menu'} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Navigation Tabs Bar (#0F172A / #1E3A8A) — Always visible & horizontally scrollable on mobile */}
        {setActiveTab && (
          <div className="bg-[#0F172A] text-white border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <nav
                className={`${
                  mobileOpen ? 'flex flex-col py-2' : 'flex flex-row'
                } items-stretch md:items-center gap-1 overflow-x-auto no-scrollbar`}
              >
                {GOV_NAV_TABS.map((tab) => {
                  const isActive = activeTab === tab.key;
                  const translatedLabel = ui.tabs[tab.key] || tab.label;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.key);
                        setMobileOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                        isActive
                          ? 'bg-[#1E3A8A] text-white border-[#D97706]'
                          : 'text-slate-300 border-transparent hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon name={tab.icon} className="w-3.5 h-3.5 shrink-0" />
                      <span>{translatedLabel}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
