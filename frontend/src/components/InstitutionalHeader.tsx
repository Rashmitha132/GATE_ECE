import React from 'react';

export const InstitutionalHeader: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-rose-100/80 py-1.5 px-2 sm:px-6">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left Section: Official College Logo & Affiliations */}
        <div className="flex-1 flex items-center max-w-[70%]">
          <img
            src="/images/gsss-header-left-2x.png"
            alt="GSSS Institute of Engineering and Technology for Women"
            className="w-full max-w-2xl lg:max-w-3xl h-auto object-contain object-left select-none"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </div>

        {/* Right Section: Official College Contact Information */}
        <div className="flex items-center shrink-0">
          <img
            src="/images/gsss-header-right-2x.png"
            alt="GSSSIETW Contact Information"
            className="hidden sm:block h-16 sm:h-20 md:h-22 w-auto object-contain select-none"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </div>
      </div>
    </header>
  );
};
