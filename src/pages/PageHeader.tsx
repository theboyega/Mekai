import React from 'react';
import { MekaiLogo } from '../components/MekaiLogo';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

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
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 h-20 sm:h-24 flex items-center justify-between">
        {/* Left: Brand Logo & Breadcrumb */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] rounded-lg"
            aria-label="Back to Homepage"
          >
            <MekaiLogo iconSize={32} textSize="text-xl tracking-widest font-heading font-extrabold" />
          </a>

          <div className="hidden sm:flex items-center gap-2 text-xs font-heading font-medium text-[#707D7D]">
            <span>/</span>
            <span className="text-[#A3B18A] font-semibold">{title}</span>
            {badge && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#A3B18A]/10 text-[#A3B18A] border border-[#A3B18A]/30 text-[10px] font-bold">
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-heading text-[#9EA8A8] hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-[#181D1D]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Back to</span> Home
          </button>

          {activeCode ? (
            onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="px-4 py-2 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          ) : (
            onOpenAuth && (
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-2 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
