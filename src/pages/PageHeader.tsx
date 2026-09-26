import React from 'react';
import { MekaiLogo } from '../components/MekaiLogo';

interface PageHeaderProps {
  title: string;
  badge?: string;
  onNavigateHome: () => void;
  onOpenDashboard?: () => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  activeCode?: string | null;
}

export function PageHeader({
  title,
  badge,
  onNavigateHome,
  onOpenDashboard,
  onOpenAuth,
  activeCode,
}: PageHeaderProps) {
  return (
    <header className="w-full bg-[#0E1111]/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#1C2121]/80">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 h-20 sm:h-24 flex items-center justify-between">
        {/* Left: Brand Logo (Navigates to Homepage) */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] rounded-lg cursor-pointer"
            aria-label="Return to Homepage"
          >
            <MekaiLogo iconSize={32} textSize="text-xl tracking-widest font-heading font-extrabold" />
          </a>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {activeCode ? (
            onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="px-5 py-2.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>Launch App</span>
              </button>
            )
          ) : (
            onOpenAuth && (
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="px-5 py-2.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>Get Started</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
