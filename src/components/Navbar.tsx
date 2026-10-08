import { useState, useEffect } from 'react';
import { MekaiLogo } from './MekaiLogo';
import { LogOut, Activity, AudioLines, Search, Camera, Package, FileText } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

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
  const router = useRouter();
  const auth = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const resolvedActiveCode = activeCode !== undefined ? activeCode : (auth.isAuthenticated ? auth.activeCode : null);

  const handleOpenAuth = (mode: 'signup' | 'login') => {
    setIsMobileMenuOpen(false);
    if (mode === 'signup' && onSignUpClick) onSignUpClick();
    else if (mode === 'login' && onLoginClick) onLoginClick();
    else router.navigate(`/auth?mode=${mode}`);
  };

  const handleDashboard = () => {
    setIsMobileMenuOpen(false);
    if (onOpenDashboard) onOpenDashboard();
    else router.navigate('/dashboard');
  };

  const handleSignOutAction = () => {
    setIsMobileMenuOpen(false);
    if (onSignOut) onSignOut();
    else auth.logout();
  };

  const handleHomeClick = () => {
    setIsMobileMenuOpen(false);
    if (onNavigateHome) onNavigateHome();
    else router.navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageClick = (pageId: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigatePage) onNavigatePage(pageId);
    else router.navigate(pageId === 'home' ? '/' : `/${pageId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    if (router.currentPath !== '/') {
      router.navigate(`/#${id}`);
      return;
    }
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
            href="/"
            className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] rounded-lg shrink-0 leading-none"
            aria-label="Mekai Homepage"
            onClick={(e) => {
              e.preventDefault();
              handleHomeClick();
            }}
          >
            <MekaiLogo iconSize={32} textSize="text-xl tracking-widest font-heading font-extrabold" />
          </a>

          {/* Right Navigation Actions */}
          <div id="nav-actions" className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* ───────── MOBILE & TABLET VIEW (< lg:) ───────── */}
            <div className="flex lg:hidden items-center gap-4 md:gap-6">
              {resolvedActiveCode ? (
                <button
                  id="mobile-nav-dashboard-link"
                  type="button"
                  onClick={handleDashboard}
                  className="text-sm md:text-base font-semibold text-[#A3B18A] hover:text-[#92A177] transition-colors inline-flex items-center gap-1.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#A3B18A] font-heading cursor-pointer leading-none"
                >
                  <span className="leading-none">App</span>
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
                </button>
              ) : (
                <a
                  id="mobile-nav-signup-link"
                  href="/auth?mode=signup"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenAuth('signup');
                  }}
                  className="text-sm md:text-base font-semibold text-[#A3B18A] hover:text-[#92A177] transition-colors inline-flex items-center gap-1.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#A3B18A] font-heading cursor-pointer leading-none"
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
              {resolvedActiveCode ? (
                <>
                  <button
                    id="nav-dashboard-link"
                    type="button"
                    onClick={handleDashboard}
                    className="text-sm font-semibold text-[#A3B18A] hover:text-[#92A177] transition-colors inline-flex items-center gap-1.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#A3B18A] font-heading cursor-pointer leading-none"
                  >
                    <span className="leading-none">App</span>
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
                  </button>

                  <button
                    id="nav-signout-btn"
                    type="button"
                    onClick={handleSignOutAction}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-[#A3B18A] border border-[#A3B18A]/50 hover:border-[#A3B18A] hover:bg-[#A3B18A]/10 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] font-heading cursor-pointer inline-flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <a
                    id="nav-signup-link"
                    href="/auth?mode=signup"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenAuth('signup');
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
                    onClick={() => handleOpenAuth('login')}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-[#A3B18A] border border-[#A3B18A]/50 hover:border-[#A3B18A] hover:bg-[#A3B18A]/10 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] font-heading cursor-pointer"
                  >
                    Sign in
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
            {/* 4 Cards Grid - Styled like 'Validated on the shop floor' cards on the homepage */}
            <div>
              <nav aria-label="Workshop sections" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-8">
                {/* Card 1: Core Capabilities */}
                <button
                  type="button"
                  onClick={() => handleScrollToSection('capabilities-section')}
                  className="w-full rounded-[20px] md:rounded-[24px] bg-[#131616] border border-[#222828] p-6 sm:p-7 flex flex-col justify-between h-[195px] min-h-[195px] sm:h-[210px] sm:min-h-[210px] text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl group cursor-pointer"
                >
                  <div className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight font-heading leading-tight">
                    Core Capabilities
                  </div>
                  <div className="text-sm md:text-base font-medium text-[#8F9999]">
                    Precision diagnostics &amp; telemetry
                  </div>
                </button>

                {/* Card 2: Workflow Architecture */}
                <button
                  type="button"
                  onClick={() => handleScrollToSection('workflow-section')}
                  className="w-full rounded-[20px] md:rounded-[24px] bg-[#131616] border border-[#222828] p-6 sm:p-7 flex flex-col justify-between h-[195px] min-h-[195px] sm:h-[210px] sm:min-h-[210px] text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl group cursor-pointer"
                >
                  <div className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight font-heading leading-tight">
                    Workflow Architecture
                  </div>
                  <div className="text-sm md:text-base font-medium text-[#8F9999]">
                    From data to repair directive
                  </div>
                </button>

                {/* Card 3: Floor Validation */}
                <button
                  type="button"
                  onClick={() => handleScrollToSection('validation-section')}
                  className="w-full rounded-[20px] md:rounded-[24px] bg-[#131616] border border-[#222828] p-6 sm:p-7 flex flex-col justify-between h-[195px] min-h-[195px] sm:h-[210px] sm:min-h-[210px] text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl group cursor-pointer"
                >
                  <div className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight font-heading leading-tight">
                    Floor Validation
                  </div>
                  <div className="text-sm md:text-base font-medium text-[#8F9999]">
                    Shop floor efficiency &amp; accuracy
                  </div>
                </button>

                {/* Card 4: Mobile App */}
                <button
                  type="button"
                  onClick={() => handleScrollToSection('download-section')}
                  className="w-full rounded-[20px] md:rounded-[24px] bg-[#A3B18A] p-6 sm:p-7 flex flex-col justify-between h-[195px] min-h-[195px] sm:h-[210px] sm:min-h-[210px] text-left transition-all duration-300 hover:bg-[#94A27B] hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] group shadow-lg text-[#0E1111] cursor-pointer"
                >
                  <div className="text-2xl sm:text-[28px] font-extrabold text-[#0E1111] leading-tight tracking-tight font-heading">
                    Mobile App
                  </div>
                  <div className="text-sm md:text-base font-semibold text-[#1C261C]">
                    iOS &amp; Android companion
                  </div>
                </button>
              </nav>

              {/* Feature Capabilities List (links to sign up page) */}
              <div className="space-y-6 sm:space-y-7 pl-1 pt-4">
                <a
                  href="/auth?mode=signup"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenAuth('signup');
                  }}
                  className="flex items-center gap-4 text-[#A0ABAB] hover:text-white transition-colors cursor-pointer group text-left w-full py-0.5"
                >
                  <Activity className="w-5 h-5 text-[#8E9B9B] group-hover:text-[#A3B18A] transition-colors shrink-0" strokeWidth={1.8} />
                  <span className="text-sm sm:text-base font-normal tracking-wide">Live OBD-II telemetry</span>
                </a>

                <a
                  href="/auth?mode=signup"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenAuth('signup');
                  }}
                  className="flex items-center gap-4 text-[#A0ABAB] hover:text-white transition-colors cursor-pointer group text-left w-full py-0.5"
                >
                  <AudioLines className="w-5 h-5 text-[#8E9B9B] group-hover:text-[#A3B18A] transition-colors shrink-0" strokeWidth={1.8} />
                  <span className="text-sm sm:text-base font-normal tracking-wide">Acoustic engine diagnostics</span>
                </a>

                <a
                  href="/auth?mode=signup"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenAuth('signup');
                  }}
                  className="flex items-center gap-4 text-[#A0ABAB] hover:text-white transition-colors cursor-pointer group text-left w-full py-0.5"
                >
                  <Search className="w-5 h-5 text-[#8E9B9B] group-hover:text-[#A3B18A] transition-colors shrink-0" strokeWidth={1.8} />
                  <span className="text-sm sm:text-base font-normal tracking-wide">OBD-II fault analysis</span>
                </a>

                <a
                  href="/auth?mode=signup"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenAuth('signup');
                  }}
                  className="flex items-center gap-4 text-[#A0ABAB] hover:text-white transition-colors cursor-pointer group text-left w-full py-0.5"
                >
                  <Camera className="w-5 h-5 text-[#8E9B9B] group-hover:text-[#A3B18A] transition-colors shrink-0" strokeWidth={1.8} />
                  <span className="text-sm sm:text-base font-normal tracking-wide">Component image analysis</span>
                </a>

                <a
                  href="/auth?mode=signup"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenAuth('signup');
                  }}
                  className="flex items-center gap-4 text-[#A0ABAB] hover:text-white transition-colors cursor-pointer group text-left w-full py-0.5"
                >
                  <Package className="w-5 h-5 text-[#8E9B9B] group-hover:text-[#A3B18A] transition-colors shrink-0" strokeWidth={1.8} />
                  <span className="text-sm sm:text-base font-normal tracking-wide">Part sourcing &amp; procurement</span>
                </a>

                <a
                  href="/auth?mode=signup"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenAuth('signup');
                  }}
                  className="flex items-center gap-4 text-[#A0ABAB] hover:text-white transition-colors cursor-pointer group text-left w-full py-0.5"
                >
                  <FileText className="w-5 h-5 text-[#8E9B9B] group-hover:text-[#A3B18A] transition-colors shrink-0" strokeWidth={1.8} />
                  <span className="text-sm sm:text-base font-normal tracking-wide">Generate diagnostic reports</span>
                </a>
              </div>

              {/* LEARN MORE Section */}
              <div className="mt-12 sm:mt-14 pl-1">
                <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-[#A3B18A] font-heading mb-4 sm:mb-5">
                  LEARN MORE
                </h4>
                <div className="space-y-3 sm:space-y-3.5">
                  <a
                    href="/docs"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageClick('docs');
                    }}
                    className="text-sm sm:text-base text-[#8E9B9B] hover:text-[#A3B18A] transition-colors block cursor-pointer"
                  >
                    Documentation
                  </a>
                  <a
                    href="/careers"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageClick('careers');
                    }}
                    className="text-sm sm:text-base text-[#8E9B9B] hover:text-[#A3B18A] transition-colors block cursor-pointer"
                  >
                    Career
                  </a>
                  <a
                    href="/press"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageClick('press');
                    }}
                    className="text-sm sm:text-base text-[#8E9B9B] hover:text-[#A3B18A] transition-colors block cursor-pointer"
                  >
                    Press
                  </a>
                  <a
                    href="/help"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageClick('help');
                    }}
                    className="text-sm sm:text-base text-[#8E9B9B] hover:text-[#A3B18A] transition-colors block cursor-pointer"
                  >
                    Help
                  </a>
                </div>
              </div>

              {/* STAY IN TOUCH Section */}
              <div className="mt-12 sm:mt-14 pl-1 pb-3 sm:pb-4">
                <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-[#A3B18A] font-heading mb-4 sm:mb-5">
                  STAY IN TOUCH
                </h4>
                <div className="flex flex-row flex-nowrap items-center gap-6 sm:gap-7 text-[#8E9B9B]">
                  {/* X / Twitter */}
                  <a
                    href="https://x.com/mekai_ai?s=11"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Mekai on X"
                    className="hover:text-white transition-colors inline-flex items-center justify-center shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/mekai_ai_?stkn=Yzh6c2FkZDN2MGho&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Mekai on Instagram"
                    className="hover:text-white transition-colors inline-flex items-center justify-center shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/company/mekai-ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with Mekai on LinkedIn"
                    className="hover:text-white transition-colors inline-flex items-center justify-center shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="-translate-y-[1.5px]">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Mekai on TikTok"
                    className="hover:text-white transition-colors inline-flex items-center justify-center shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.02 2.9-.01 5.8-.02 8.7a7.6 7.6 0 0 1-2.15 5.28c-1.4 1.36-3.32 2.13-5.27 2.14-3.56.09-6.84-2.31-7.66-5.78-.96-3.95 1.51-7.98 5.48-8.77.72-.15 1.46-.2 2.2-.18.01 1.46.01 2.91.01 4.37-.36-.07-.74-.08-1.11-.04-1.68.17-3.09 1.37-3.41 3.01-.41 2.04 1.05 4.09 3.08 4.35 1.72.23 3.42-.76 3.96-2.39.18-.55.24-1.13.24-1.7V.02h-2.48z" />
                    </svg>
                  </a>
                </div>

                {resolvedActiveCode && (
                  <button
                    type="button"
                    onClick={handleSignOutAction}
                    className="text-sm md:text-base font-heading font-semibold text-[#A3B18A] hover:underline cursor-pointer flex items-center gap-2 pt-4"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
