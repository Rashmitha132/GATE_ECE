import React from 'react';

interface FooterProps {
  variant?: 'light' | 'dark' | 'transparent';
  className?: string;
}

export const InstitutionalFooter: React.FC<FooterProps> = ({ variant = 'light', className = '' }) => {
  const year = new Date().getFullYear();

  if (variant === 'dark') {
    return (
      <footer className={`w-full py-3 px-4 text-center text-xs text-rose-200/90 z-10 ${className}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
          <p className="text-[11px] text-white/80">
            &copy; {year} GSSSIETW &bull; Department of Electronics &amp; Communication Engineering
          </p>
          <p className="text-[11px] text-rose-200">
            <span>Under the guidance of <strong className="text-amber-300 font-semibold">Smt. Rashmi H C</strong></span>
            <span className="mx-2 text-rose-400/80">|</span>
            <span>Developed by <strong className="text-white font-semibold">Rashmitha S, Mahadevamma V P, Rashmitha K N</strong></span>
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`w-full py-3.5 px-6 border-t border-rose-100 bg-white/80 backdrop-blur-xs text-stone-600 mt-auto shrink-0 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div>
          <p className="text-xs text-stone-700 font-medium">
            &copy; {year} <span className="text-[#701a2b] font-bold">GSSSIETW</span> &bull; Department of Electronics &amp; Communication Engineering
          </p>
          <p className="text-[10px] text-stone-500">
            GATE ECE Learning &amp; Assessment Platform &bull; Institutional Intranet System
          </p>
        </div>
        <div className="text-xs text-stone-600 bg-rose-50/70 border border-rose-100/90 rounded-full px-3.5 py-1 flex flex-wrap items-center justify-center gap-1.5 shadow-2xs">
          <span>Under the guidance of <strong className="text-[#701a2b] font-semibold">Smt. Rashmi H C</strong></span>
          <span className="text-rose-300 font-bold hidden sm:inline">&bull;</span>
          <span>Made by <strong className="text-stone-900 font-semibold">Rashmitha S, Mahadevamma V P, Rashmitha K N</strong></span>
        </div>
      </div>
    </footer>
  );
};
