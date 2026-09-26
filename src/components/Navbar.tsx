import { useState, useEffect } from 'react';
import { MekaiLogo } from './MekaiLogo';
import { LogOut, ArrowRight, Layers, BarChart3, Smartphone, Cpu } from 'lucide-react';

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

  // Prevent background scrolling when mobile menu drawer is open without causing scrollbar width jump
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
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
        className={`w-full ${
          isMobileMenuOpen ? 'bg-[#0E1111]' : 'bg-[#0E1111]/80 backdrop-blur-md'
        } sticky top-0 z-[60] border-b border-[#1C2121]/80 transition-colors shadow-sm`}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 h-20 sm:h-24 flex items-center justify-between">
          {/* Brand Logo - Full generous size */}
          <a
            id="nav-logo-link"
            href="#"
            className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] rounded-lg shrink-0 leading-none"
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

          {/* Right Navigation Actions */}
          <div id="nav-actions" className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* ───────── MOBILE & TABLET VIEW (< lg:) ───────── */}
            <div className="flex lg:hidden items-center gap-4 md:gap-6">
              {activeCode ? (
                /* Mobile/tablet authenticated state: Open App button + Hamburger */
                <>
                  {onOpenDashboard && (
                    <button
                      type="button"
                      onClick={onOpenDashboard}
                      className={`px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-bold text-xs md:text-sm transition-all shadow-sm min-h-[36px] md:min-h-[44px] ${
                        isMobileMenuOpen ? 'invisible pointer-events-none' : ''
                      }`}
                    >
                      Open App
                    </button>
                  )}
                </>
              ) : (
                /* Mobile/tablet unauthenticated state: Original "Sign up →" arrow link beside Hamburger */
                <a
                  id="mobile-nav-signup-link"
                  href="#signup"
                  onClick={(e) => {
                    if (onSignUpClick) {
                      e.preventDefault();
                      onSignUpClick();
                    }
                  }}
                  className={`text-sm md:text-base font-semibold text-[#A3B18A] hover:text-[#92A177] transition-colors inline-flex items-center gap-1.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#A3B18A] font-heading cursor-pointer leading-none ${
                    isMobileMenuOpen ? 'invisible pointer-events-none' : ''
                  }`}
                >
                  <span className="leading-none">Sign up</span>
                  <svg
                    className="w-4 h-4 md:w-[17px] md:h-[17px] transition-transform group-hover:translate-x-1 text-[#A3B18A] shrink-0"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 10H16.5M16.5 10L11.75 5.25M16.5 10L11.75 14.75"
                      stroke="currentColor"
                      strokeWidth="2.35"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}

              {/* Exact App Dashboard UI Hamburger Toggle Button (open / close) */}
              <button
                id="mobile-nav-hamburger-btn"
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="w-10 h-10 md:w-12 md:h-12 min-h-[40px] md:min-h-[48px] rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 flex items-center justify-center shrink-0 transition-transform shadow-md focus:outline-none text-[#0E1111]"
                aria-label={isMobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="4.5" y1="12" x2="19.5" y2="12" transform="rotate(45 12 12)" />
                    <line x1="4.5" y1="12" x2="19.5" y2="12" transform="rotate(-45 12 12)" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="4.5" y1="7.5" x2="19.5" y2="7.5" />
                    <line x1="4.5" y1="16.5" x2="19.5" y2="16.5" />
                  </svg>
                )}
              </button>
            </div>

            {/* ───────── DESKTOP VIEW (≥ lg:) ───────── */}
            <div className="hidden lg:flex items-center gap-4 sm:gap-6">
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
                    className="text-sm font-semibold text-[#A3B18A] hover:text-[#92A177] transition-colors inline-flex items-center gap-1.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#A3B18A] font-heading cursor-pointer leading-none"
                  >
                    <span className="leading-none">Sign up</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#A3B18A] shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 10H16.5M16.5 10L11.75 5.25M16.5 10L11.75 14.75"
                        stroke="currentColor"
                        strokeWidth="2.35"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
          MOBILE & TABLET FULL-SCREEN DRAWER (Anchored below persistent header)
      ───────────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          id="homepage-mobile-drawer"
          className="lg:hidden fixed inset-x-0 top-20 sm:top-24 bottom-0 z-50 bg-[#0E1111] flex flex-col justify-between animate-fadeIn select-none"
        >
          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 md:px-8 md:py-8 flex flex-col justify-between w-full mx-auto">
            {/* Navigation Section Links */}
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#697474] font-bold px-1 mb-3 md:mb-4 font-heading">
                Workshop Architecture
              </p>
              
              <nav className="space-y-3 md:space-y-4 mb-6">
                <button
                  type="button"
                  onClick={() => handleScrollToSection('capabilities-section')}
                  className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-[#141818] border border-[#202727] text-left hover:border-[#A3B18A]/50 hover:bg-[#181D1D] transition-all duration-200 min-h-[52px] md:min-h-[60px] group cursor-pointer"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#A3B18A]/10 text-[#A3B18A] flex items-center justify-center shrink-0">
                      <Cpu className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-sm md:text-base text-white block">Core Capabilities</span>
                      <span className="text-xs md:text-sm text-[#7F8D8D]">OBD-II, acoustics & vision</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-[#A3B18A] transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handleScrollToSection('workflow-section')}
                  className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-[#141818] border border-[#202727] text-left hover:border-[#A3B18A]/50 hover:bg-[#181D1D] transition-all duration-200 min-h-[52px] md:min-h-[60px] group cursor-pointer"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#A3B18A]/10 text-[#A3B18A] flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-sm md:text-base text-white block">Diagnostic Workflow</span>
                      <span className="text-xs md:text-sm text-[#7F8D8D]">Capture → Reason → Execute</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-[#A3B18A] transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handleScrollToSection('validation-section')}
                  className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-[#141818] border border-[#202727] text-left hover:border-[#A3B18A]/50 hover:bg-[#181D1D] transition-all duration-200 min-h-[52px] md:min-h-[60px] group cursor-pointer"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#A3B18A]/10 text-[#A3B18A] flex items-center justify-center shrink-0">
                      <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-sm md:text-base text-white block">Floor Validation</span>
                      <span className="text-xs md:text-sm text-[#7F8D8D]">Speed, accuracy & efficiency</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-[#A3B18A] transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handleScrollToSection('download-section')}
                  className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-[#141818] border border-[#202727] text-left hover:border-[#A3B18A]/50 hover:bg-[#181D1D] transition-all duration-200 min-h-[52px] md:min-h-[60px] group cursor-pointer"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#A3B18A]/10 text-[#A3B18A] flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-sm md:text-base text-white block">Mobile App</span>
                      <span className="text-xs md:text-sm text-[#7F8D8D]">Available on iOS & Android</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-[#A3B18A]" />
                </button>
              </nav>
            </div>

            {/* Drawer Footer Actions (Sign In / Sign Up / Profile) */}
            <div className="pt-4 md:pt-6 border-t border-[#1C2121] space-y-3 md:space-y-4">
              {activeCode ? (
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#141818] border border-[#222828] text-xs md:text-sm">
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
                      className="text-[#8F9999] hover:text-red-400 text-xs md:text-sm font-semibold p-1"
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
                      className="w-full py-3.5 md:py-4 rounded-full bg-[#A3B18A] hover:bg-[#92A177] text-[#0E1111] font-heading font-bold text-sm md:text-base transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px] md:min-h-[50px]"
                    >
                      <span>Launch Diagnostic Dashboard</span>
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onLoginClick) onLoginClick();
                    }}
                    className="w-full py-3 md:py-3.5 rounded-full text-xs md:text-sm font-semibold font-heading text-[#A3B18A] border border-[#A3B18A]/50 hover:bg-[#A3B18A]/10 active:scale-95 transition-all text-center min-h-[44px] md:min-h-[48px]"
                  >
                    Log In
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onSignUpClick) onSignUpClick();
                    }}
                    className="w-full py-3 md:py-3.5 rounded-full text-xs md:text-sm font-bold font-heading text-[#0E1111] bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 transition-all text-center shadow-md flex items-center justify-center gap-1.5 min-h-[44px] md:min-h-[48px]"
                  >
                    <span>Sign Up</span>
                    <svg
                      className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 10H16.5M16.5 10L11.75 5.25M16.5 10L11.75 14.75"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
