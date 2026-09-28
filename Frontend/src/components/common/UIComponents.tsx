import React from 'react';
import { Icon } from './Icon';

export const VerifiedBadge: React.FC<{ small?: boolean }> = ({ small }) => {
  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded-md bg-emerald-50 text-[#16A34A] border border-emerald-200 ' +
        (small ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs') +
        ' font-semibold'
      }
    >
      <Icon name="checkc" className={small ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      INO Verified
    </span>
  );
};

export const Tag: React.FC<{ children: React.ReactNode; tone?: 'sage' | 'blue' | 'amber' | 'rose' }> = ({
  children,
  tone = 'blue',
}) => {
  const tones = {
    sage: 'bg-emerald-50 text-[#16A34A] border-emerald-200',
    blue: 'bg-blue-50 text-[#1E3A8A] border-blue-200',
    amber: 'bg-amber-50 text-[#D97706] border-amber-200',
    rose: 'bg-red-50 text-[#DC2626] border-red-200',
  };
  return (
    <span className={'inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ' + tones[tone]}>
      {children}
    </span>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'sagesolid' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-150 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm',
    sagesolid: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm',
    outline: 'border border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] hover:bg-[#F8FAFC]',
    ghost: 'bg-transparent text-[#0F172A] hover:bg-slate-100',
  };
  return (
    <button className={base + ' ' + variants[variant] + ' ' + className} {...rest}>
      {children}
    </button>
  );
};

export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  colorClass?: string;
  trackClass?: string;
  height?: string;
}> = ({ value, max = 100, colorClass = 'bg-[#16A34A]', trackClass = 'bg-slate-200', height = 'h-2' }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`w-full ${trackClass} rounded-full ${height} overflow-hidden`}>
      <div className={`${colorClass} ${height} rounded-full`} style={{ width: pct + '%' }} />
    </div>
  );
};

export const SkillBar: React.FC<{ name: string; score: number; min: number }> = ({ name, score, min }) => {
  const gap = Math.max(0, min - score);
  const ok = score >= min;
  return (
    <div className="mb-3.5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-semibold text-[#0F172A]">{name}</span>
        <span className="text-xs text-slate-500">
          {score}/100 <span className="opacity-75">| required {min}</span>
        </span>
      </div>
      <div className="relative w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className="absolute top-0 bottom-0 w-px bg-slate-600 z-10" style={{ left: min + '%' }} />
        <div
          className={`h-2 rounded-full ${ok ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`}
          style={{ width: score + '%' }}
        />
      </div>
      {!ok && <div className="text-[11px] text-[#D97706] mt-1">{gap} points below threshold</div>}
    </div>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  as?: any;
  [key: string]: any;
}> = ({ children, className = '', as: Comp = 'div', ...rest }) => {
  return (
    <Comp className={'bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg shadow-sm ' + className} {...rest}>
      {children}
    </Comp>
  );
};

export const StatBlock: React.FC<{ label: string; value: string | number; sub?: string }> = ({
  label,
  value,
  sub,
}) => {
  return (
    <Card className="p-4">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-2xl font-bold text-[#0F172A] mt-1">{value}</div>
      {sub && <div className="text-xs text-[#16A34A] mt-1 font-semibold">{sub}</div>}
    </Card>
  );
};

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}> = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div
        className={
          'relative bg-[#FFFFFF] border border-[#E2E8F0] rounded-t-lg sm:rounded-lg w-full shadow-xl ' +
          (wide ? 'sm:max-w-3xl' : 'sm:max-w-md') +
          ' max-h-[88vh] overflow-y-auto p-5 sm:p-6'
        }
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E8F0]">
          <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 focus-ring">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const SearchInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] pl-9 pr-3 py-2 text-sm text-[#0F172A] focus-ring"
      />
    </div>
  );
};

export const EmptyState: React.FC<{ text: string }> = ({ text }) => {
  return <div className="text-center py-10 text-sm text-slate-500">{text}</div>;
};

export const PageHeader: React.FC<{
  title: string;
  desc?: string;
  action?: React.ReactNode;
}> = ({ title, desc, action }) => {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap pb-4 mb-5 border-b border-[#E2E8F0]">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">{title}</h1>
        {desc && <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">{desc}</p>}
      </div>
      {action}
    </div>
  );
};
