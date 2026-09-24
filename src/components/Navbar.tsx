import { useState, useEffect } from 'react';
import { MekaiLogo } from './MekaiLogo';
import { LogOut, X, ArrowRight, Layers, BarChart3, Smartphone, Cpu } from 'lucide-react';

interface NavbarProps {
  onSignUpClick?: () => void;
  onLoginClick?: () => void;
  activeCode?: string | null;
  onSignOut?: () => void;
  onOpenDashboard?: () => void;
  onNavigateHome?: () => void;
  onNavigatePage?: (page: string) => void;
}

export function Navbar({
  onSignUpClick,
  onLoginClick,
  activeCode,
  onSignOut,
  onOpenDashboard,
  onNavigateHome,
  onNavigatePage,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleScrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        id="main-navigation"
        className="w-full bg-[#0E1111]/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#1C2121]/80 transition-colors shadow-sm"
      >
        <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 h-20 sm:h-24 flex items-center justify-between">
          {/* Brand Logo - Full generous size */}
          <a
            id="nav-logo-link"
            href="#"
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] rounded-lg"
            aria-label="Mekai Homepage"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateHome) onNavigateHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <MekaiLogo iconSize={32} textSize="text-xl tracking-widest font-heading font-extrabold" />
          </a>

          {/* Right Navigation Actions */}
          <div id="nav-actions" className="flex items-center gap-4 sm:gap-6">
            {/* ───────── MOBILE VIEW (< sm:) ───────── */}
            <div className="flex sm:hidden items-center gap-4">
              {activeCode ? (
                /* Mobile authenticated state: Open App button + Hamburger */
                <>
                  {onOpenDashboard && (
                    <button
                      type="button"
                      onClick={onOpenDashboard}
                      className="px-3.5 py-1.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-bold text-xs transition-all shadow-sm"
                    >
                      Open App
                    </button>
                  )}
                </>
              ) : (
                /* Mobile unauthenticated state: Original "Sign up →" arrow link beside Hamburger */
                <a
                  id="mobile-nav-signup-link"
                  href="#signup"
                  onClick={(e) => {
                    if (onSignUpClick) {
                      e.preventDefault();
                      onSignUpClick();
                    }
                  }}
                  className="text-sm font-semibold text-[#A3B18A] hover:text-[#92A177] transition-colors inline-flex items-center gap-1.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#A3B18A] font-heading cursor-pointer"
                >
                  <span>Sign up</span>
                  <span className="transition-transform group-hover:translate-x-1 text-[#A3B18A]" aria-hidden="true">→</span>
                </a>
              )}

              {/* Exact App Dashboard UI Hamburger Toggle Button (open / close) */}
              <button
                id="mobile-nav-hamburger-btn"
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 flex flex-col items-center justify-center gap-1.5 shrink-0 transition-transform shadow-md focus:outline-none"
                aria-label={isMobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 stroke-[2.5] text-[#0E1111]" />
                ) : (
                  <>
                    <span className="w-4 h-[2.5px] bg-[#0E1111] rounded-full" />
                    <span className="w-4 h-[2.5px] bg-[#0E1111] rounded-full" />
                  </>
                )}
              </button>
            </div>

            {/* ───────── DESKTOP VIEW (≥ sm:) ───────── */}
            <div className="hidden sm:flex items-center gap-4 sm:gap-6">
              {activeCode ? (
                <div className="flex items-center gap-3">
                  {onOpenDashboard && (
                    <button
                      type="button"
                      onClick={onOpenDashboard}
                      className="px-5 py-2 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                    >
                      Open App
                    </button>
                  )}

                  <button
                    id="nav-logout-btn"
                    type="button"
                    onClick={onSignOut}
                    title="Sign out of workshop"
                    className="p-2 rounded-full text-[#8F9999] hover:text-white hover:bg-[#1A1F1F] transition-colors cursor-pointer"
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
                    className="text-sm font-semibold text-[#A3B18A] hover:text-[#92A177] transition-colors inline-flex items-center gap-1.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#A3B18A] font-heading cursor-pointer"
                  >
                    <span>Sign up</span>
                    <span className="transition-transform group-hover:translate-x-1 text-[#A3B18A]" aria-hidden="true">→</span>
                  </a>

                  <button
                    id="nav-login-btn"
                    type="button"
                    onClick={onLoginClick}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-[#A3B18A] border border-[#A3B18A]/50 hover:border-[#A3B18A] hover:bg-[#A3B18A]/10 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] font-heading cursor-pointer"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE FULL-SCREEN DRAWER (Matching App Dashboard UI Drawer)
      ───────────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          id="homepage-mobile-drawer"
          className="sm:hidden fixed inset-0 z-50 bg-[#0E1111] flex flex-col justify-between animate-fadeIn select-none"
        >
          {/* Top Bar: Exact matching horizontal padding, flex properties, and edge alignment */}
          <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 h-20 sm:h-24 flex items-center justify-between shrink-0 border-b border-[#1C2121]/80">
            <a
              id="drawer-logo-link"
              href="#"
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] rounded-lg"
              aria-label="Mekai Homepage"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                if (onNavigateHome) onNavigateHome();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <MekaiLogo iconSize={32} textSize="text-xl tracking-widest font-heading font-extrabold" />
            </a>

            {/* Exact App Dashboard UI Circular Close Button */}
            <button
              id="homepage-mobile-drawer-close-btn"
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] flex items-center justify-center shrink-0 transition-transform shadow-md focus:outline-none"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
            {/* Navigation Section Links */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#697474] font-bold px-1 mb-3 font-heading">
                Workshop Architecture
              </p>
              
              <nav className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleScrollToSection('capabilities-section')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#141818] border border-[#202727] text-left hover:border-[#A3B18A]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#A3B18A]/10 text-[#A3B18A] flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-sm text-white block">Core Capabilities</span>
                      <span className="text-xs text-[#7F8D8D]">OBD-II, acoustics & vision</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A3B18A]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleScrollToSection('workflow-section')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#141818] border border-[#202727] text-left hover:border-[#A3B18A]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#A3B18A]/10 text-[#A3B18A] flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-sm text-white block">Diagnostic Workflow</span>
                      <span className="text-xs text-[#7F8D8D]">Capture → Reason → Execute</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A3B18A]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleScrollToSection('validation-section')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#141818] border border-[#202727] text-left hover:border-[#A3B18A]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#A3B18A]/10 text-[#A3B18A] flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-sm text-white block">Floor Validation</span>
                      <span className="text-xs text-[#7F8D8D]">Speed, accuracy & efficiency</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A3B18A]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleScrollToSection('download-section')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#141818] border border-[#202727] text-left hover:border-[#A3B18A]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#A3B18A]/10 text-[#A3B18A] flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-sm text-white block">Mobile App</span>
                      <span className="text-xs text-[#7F8D8D]">Available on iOS & Android</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A3B18A]" />
                </button>
              </nav>
            </div>

            {/* Drawer Footer Actions (Sign In / Sign Up / Profile) */}
            <div className="pt-4 border-t border-[#1C2121] space-y-3">
              {activeCode ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#141818] border border-[#222828] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#A3B18A] animate-pulse" />
                      <span className="text-[#8F9999]">Workshop Code:</span>
                      <span className="font-mono font-bold text-[#A3B18A]">{activeCode}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (onSignOut) onSignOut();
                      }}
                      className="text-[#8F9999] hover:text-red-400 text-xs font-semibold"
                    >
                      Sign out
                    </button>
                  </div>

                  {onOpenDashboard && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenDashboard();
                      }}
                      className="w-full py-3.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] text-[#0E1111] font-heading font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Launch Diagnostic Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onLoginClick) onLoginClick();
                    }}
                    className="w-full py-3 rounded-full text-xs font-semibold font-heading text-[#A3B18A] border border-[#A3B18A]/50 hover:bg-[#A3B18A]/10 active:scale-95 transition-all text-center"
                  >
                    Log In
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onSignUpClick) onSignUpClick();
                    }}
                    className="w-full py-3 rounded-full text-xs font-bold font-heading text-[#0E1111] bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 transition-all text-center shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Sign Up</span>
                    <span>→</span>
                  </button>
                </div>
              )}

              {/* Bottom Home Indicator Bar */}
              <div className="w-12 h-1 bg-[#2C3434] rounded-full mx-auto mt-4" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
