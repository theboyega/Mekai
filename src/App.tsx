import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CoreCapabilities } from './components/CoreCapabilities';
import { WorkflowArchitecture } from './components/WorkflowArchitecture';
import { FloorValidation } from './components/FloorValidation';
import { MobileAppSection } from './components/MobileAppSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AppDashboard } from './components/AppDashboard';

// Dedicated Sub-Pages
import { DocsPage } from './pages/DocsPage';
import { CareersPage } from './pages/CareersPage';
import { PressPage } from './pages/PressPage';
import { HelpPage } from './pages/HelpPage';
import { StatusPage } from './pages/StatusPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { LicensesPage } from './pages/LicensesPage';

export type AppPage =
  | 'home'
  | 'docs'
  | 'careers'
  | 'press'
  | 'help'
  | 'status'
  | 'terms'
  | 'privacy'
  | 'licenses';

const VALID_PAGES: AppPage[] = [
  'docs',
  'careers',
  'press',
  'help',
  'status',
  'terms',
  'privacy',
  'licenses',
];

export default function App() {
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    mode: 'signup' | 'login';
  }>({
    isOpen: false,
    mode: 'signup',
  });

  const [activeAccessCode, setActiveAccessCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mekai_workshop_code') || null;
    } catch {
      return null;
    }
  });

  const [technicianName, setTechnicianName] = useState<string>(() => {
    try {
      return localStorage.getItem('mekai_technician_name') || 'Adeyemi Tomiwa';
    } catch {
      return 'Adeyemi Tomiwa';
    }
  });

  // Controls view mode: 'app' (main dashboard) or 'landing' (marketing & info pages)
  const [viewMode, setViewMode] = useState<'app' | 'landing'>('landing');

  // Active page routing based on URL hash
  const [activePage, setActivePage] = useState<AppPage>(() => {
    try {
      const hash = window.location.hash.replace('#', '').toLowerCase() as AppPage;
      if (VALID_PAGES.includes(hash)) {
        return hash;
      }
    } catch {
      // ignore
    }
    return 'home';
  });

  // Listen to hash changes for forward/back browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase() as AppPage;
      if (VALID_PAGES.includes(hash)) {
        setActivePage(hash);
        setViewMode('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash || hash === 'home') {
        setActivePage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    try {
      if (activeAccessCode) {
        localStorage.setItem('mekai_workshop_code', activeAccessCode);
      } else {
        localStorage.removeItem('mekai_workshop_code');
      }
    } catch {
      // ignore storage exceptions
    }
  }, [activeAccessCode]);

  const handleNavigatePage = (page: string) => {
    const targetPage = page.toLowerCase() as AppPage;
    if (VALID_PAGES.includes(targetPage)) {
      setActivePage(targetPage);
      setViewMode('landing');
      window.location.hash = targetPage;
    } else {
      setActivePage('home');
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setActivePage('home');
    setViewMode('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuth = (mode: 'signup' | 'login') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const closeAuth = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAuthenticated = (code: string, name?: string) => {
    setActiveAccessCode(code);
    if (name) {
      setTechnicianName(name);
    }
    setViewMode('app');
    closeAuth();
  };

  const handleViewHomepage = () => {
    setActivePage('home');
    setViewMode('landing');
    if (window.location.hash) {
      window.location.hash = '';
    }
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    setActiveAccessCode(null);
    try {
      localStorage.removeItem('mekai_workshop_code');
    } catch {
      // ignore
    }
    handleViewHomepage();
  };

  const [dashboardInitialPrompt, setDashboardInitialPrompt] = useState<string>('');

  const handleGetStarted = (query?: string) => {
    if (query && query.trim()) {
      setDashboardInitialPrompt(query.trim());
    }
    // If the technician is already authenticated, take them directly to the dashboard
    if (activeAccessCode) {
      setViewMode('app');
      return;
    }
    // If not authenticated, open auth modal so the user inputs their workshop access code and name
    openAuth('signup');
  };

  const handleLearnMore = () => {
    handleNavigatePage('docs');
  };

  // When authenticated and in app mode, render the App Dashboard
  if (activeAccessCode && viewMode === 'app') {
    return (
      <div className="fixed inset-0 h-screen h-[100dvh] w-full overflow-hidden bg-[#0E1111] text-[#FFFFFF] font-sans selection:bg-[#A3B18A]/30 selection:text-[#FFFFFF]">
        <AppDashboard
          activeCode={activeAccessCode}
          technicianName={technicianName}
          onSignOut={handleSignOut}
          onViewLanding={handleViewHomepage}
          initialPrompt={dashboardInitialPrompt}
        />
      </div>
    );
  }

  // Common props for subpages
  const subPageProps = {
    onNavigateHome: handleNavigateHome,
    onNavigatePage: handleNavigatePage,
    onOpenDashboard: () => setViewMode('app'),
    onOpenAuth: openAuth,
    activeCode: activeAccessCode,
  };

  // Render individual pages based on activePage
  if (activePage === 'docs') {
    return (
      <>
        <DocsPage {...subPageProps} />
        <AuthModal
          isOpen={authModalState.isOpen}
          mode={authModalState.mode}
          onClose={closeAuth}
          onAuthenticated={handleAuthenticated}
          activeCode={activeAccessCode}
        />
      </>
    );
  }

  if (activePage === 'careers') {
    return (
      <>
        <CareersPage {...subPageProps} />
        <AuthModal
          isOpen={authModalState.isOpen}
          mode={authModalState.mode}
          onClose={closeAuth}
          onAuthenticated={handleAuthenticated}
          activeCode={activeAccessCode}
        />
      </>
    );
  }

  if (activePage === 'press') {
    return (
      <>
        <PressPage {...subPageProps} />
        <AuthModal
          isOpen={authModalState.isOpen}
          mode={authModalState.mode}
          onClose={closeAuth}
          onAuthenticated={handleAuthenticated}
          activeCode={activeAccessCode}
        />
      </>
    );
  }

  if (activePage === 'help') {
    return (
      <>
        <HelpPage {...subPageProps} />
        <AuthModal
          isOpen={authModalState.isOpen}
          mode={authModalState.mode}
          onClose={closeAuth}
          onAuthenticated={handleAuthenticated}
          activeCode={activeAccessCode}
        />
      </>
    );
  }

  if (activePage === 'status') {
    return (
      <>
        <StatusPage {...subPageProps} />
        <AuthModal
          isOpen={authModalState.isOpen}
          mode={authModalState.mode}
          onClose={closeAuth}
          onAuthenticated={handleAuthenticated}
          activeCode={activeAccessCode}
        />
      </>
    );
  }

  if (activePage === 'terms') {
    return (
      <>
        <TermsPage {...subPageProps} />
        <AuthModal
          isOpen={authModalState.isOpen}
          mode={authModalState.mode}
          onClose={closeAuth}
          onAuthenticated={handleAuthenticated}
          activeCode={activeAccessCode}
        />
      </>
    );
  }

  if (activePage === 'privacy') {
    return (
      <>
        <PrivacyPage {...subPageProps} />
        <AuthModal
          isOpen={authModalState.isOpen}
          mode={authModalState.mode}
          onClose={closeAuth}
          onAuthenticated={handleAuthenticated}
          activeCode={activeAccessCode}
        />
      </>
    );
  }

  if (activePage === 'licenses') {
    return (
      <>
        <LicensesPage {...subPageProps} />
        <AuthModal
          isOpen={authModalState.isOpen}
          mode={authModalState.mode}
          onClose={closeAuth}
          onAuthenticated={handleAuthenticated}
          activeCode={activeAccessCode}
        />
      </>
    );
  }

  // Default: Homepage / Landing Page
  return (
    <div className="min-h-screen bg-[#0E1111] text-[#FFFFFF] font-sans selection:bg-[#A3B18A]/30 selection:text-[#FFFFFF] flex flex-col relative overflow-x-clip">
      {/* 1. Global Navigation Bar */}
      <Navbar
        onSignUpClick={() => openAuth('signup')}
        onLoginClick={() => openAuth('login')}
        activeCode={activeAccessCode}
        onSignOut={handleSignOut}
        onOpenDashboard={() => setViewMode('app')}
        onNavigateHome={handleNavigateHome}
        onNavigatePage={handleNavigatePage}
      />

      {/* Main Semantic Page Content */}
      <main className="flex-1">
        {/* 2. Hero Section with Diagnostic Session Chat UI Representation */}
        <HeroSection
          onGetStarted={handleGetStarted}
          onLearnMore={handleLearnMore}
          isAuthenticated={!!activeAccessCode}
        />

        {/* 3. Core Capabilities: 3 Cards (Sage OBD-II, White Acoustic, Dark Vision) */}
        <CoreCapabilities />

        {/* 4. Workflow Architecture: Capture → Reason → Execute */}
        <WorkflowArchitecture />

        {/* 5. Floor Validation: 3 Metric Cards + Sage Green CTA Card */}
        <FloorValidation
          onSignUpClick={() => openAuth('signup')}
          isAuthenticated={!!activeAccessCode}
        />

        {/* 6. Mobile App Download & Dual Phone Mockup View */}
        <MobileAppSection
          onAppStoreClick={activeAccessCode ? () => setViewMode('app') : () => openAuth('signup')}
          onPlayStoreClick={activeAccessCode ? () => setViewMode('app') : () => openAuth('signup')}
        />
      </main>

      {/* 7. Global Footer with Linked Pages */}
      <Footer onNavigatePage={handleNavigatePage} />

      {/* Authentication & Access Code Validation Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        mode={authModalState.mode}
        onClose={closeAuth}
        onAuthenticated={handleAuthenticated}
        activeCode={activeAccessCode}
      />
    </div>
  );
}
