import { MekaiLogo } from './MekaiLogo';
import { KeyRound, LogOut } from 'lucide-react';

interface NavbarProps {
  onSignUpClick?: () => void;
  onLoginClick?: () => void;
  activeCode?: string | null;
  onSignOut?: () => void;
  onOpenDashboard?: () => void;
}

export function Navbar({ onSignUpClick, onLoginClick, activeCode, onSignOut, onOpenDashboard }: NavbarProps) {
  return (
    <header id="main-navigation" className="w-full bg-[#0E1111]/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#1C2121]/50">
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          id="nav-logo-link"
          href="#"
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] rounded-lg"
          aria-label="Mekai Homepage"
        >
          <MekaiLogo iconSize={30} textSize="text-xl tracking-widest" />
        </a>

        {/* Right Navigation Actions */}
        <div id="nav-actions" className="flex items-center gap-4 sm:gap-6">
          {activeCode ? (
            <div className="flex items-center gap-3">
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="px-4 py-1.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] text-[#0E1111] font-heading font-bold text-xs transition-all shadow-sm"
                >
                  Open App
                </button>
              )}

              {/* Authenticated Code Badge */}
              <button
                type="button"
                onClick={onLoginClick}
                title="View Active Workshop Key"
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181D1D] border border-[#2B3333] hover:border-[#A3B18A] text-xs text-white transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#A3B18A] animate-pulse" />
                <KeyRound className="w-3 h-3 text-[#A3B18A]" />
                <span className="font-mono font-semibold text-[#D2DADA]">{activeCode}</span>
              </button>

              <button
                id="nav-logout-btn"
                type="button"
                onClick={onSignOut}
                title="Sign out of workshop"
                className="p-2 rounded-full text-[#8F9999] hover:text-white hover:bg-[#1A1F1F] transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <a
                id="nav-signup-link"
                href="#signup"
                onClick={(e) => {
                  if (onSignUpClick) {
                    e.preventDefault();
                    onSignUpClick();
                  }
                }}
                className="text-sm font-semibold text-[#A3B18A] hover:text-[#92A177] transition-colors inline-flex items-center gap-1.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#A3B18A] font-heading"
              >
                <span>Sign up</span>
                <span className="transition-transform group-hover:translate-x-1 text-[#A3B18A]" aria-hidden="true">→</span>
              </a>

              <button
                id="nav-login-btn"
                type="button"
                onClick={onLoginClick}
                className="px-5 py-2 rounded-full text-sm font-semibold text-[#A3B18A] border border-[#A3B18A]/50 hover:border-[#A3B18A] hover:bg-[#A3B18A]/10 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] font-heading"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
