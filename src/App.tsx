import { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CoreCapabilities } from './components/CoreCapabilities';
import { WorkflowArchitecture } from './components/WorkflowArchitecture';
import { FloorValidation } from './components/FloorValidation';
import { MobileAppSection } from './components/MobileAppSection';
import { Footer } from './components/Footer';

// Lazy-loaded heavy dashboard & dedicated sub-pages for fast initial homepage load
const AppDashboard = lazy(() =>
  import('./components/AppDashboard').then((m) => ({ default: m.AppDashboard }))
);
const AuthPage = lazy(() =>
  import('./pages/AuthPage').then((m) => ({ default: m.AuthPage }))
);
const DocsPage = lazy(() =>
  import('./pages/DocsPage').then((m) => ({ default: m.DocsPage }))
);
const CareersPage = lazy(() =>
  import('./pages/CareersPage').then((m) => ({ default: m.CareersPage }))
);
const PressPage = lazy(() =>
  import('./pages/PressPage').then((m) => ({ default: m.PressPage }))
);
const HelpPage = lazy(() =>
  import('./pages/HelpPage').then((m) => ({ default: m.HelpPage }))
);
const StatusPage = lazy(() =>
  import('./pages/StatusPage').then((m) => ({ default: m.StatusPage }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage }))
);
const LicensesPage = lazy(() =>
  import('./pages/LicensesPage').then((m) => ({ default: m.LicensesPage }))
);

export type AppPage =
  | 'home'
  | 'auth'
  | 'docs'
  | 'careers'
  | 'press'
  | 'help'
  | 'status'
  | 'terms'
  | 'privacy'
  | 'licenses';

const VALID_PAGES: AppPage[] = [
  'auth',
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
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');

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
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'signup' || hash === 'login' || hash === 'auth') {
        return 'auth';
      }
      if (VALID_PAGES.includes(hash as AppPage)) {
        return hash as AppPage;
      }
    } catch {
      // ignore
    }
    return 'home';
  });

  // Listen to hash changes for forward/back browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'signup' || hash === 'login' || hash === 'auth') {
        setAuthMode(hash === 'login' ? 'login' : 'signup');
        setActivePage('auth');
        setViewMode('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (VALID_PAGES.includes(hash as AppPage)) {
        setActivePage(hash as AppPage);
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
    setAuthMode(mode);
    setActivePage('auth');
    setViewMode('landing');
    window.location.hash = mode;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticated = (code: string, name?: string) => {
    setActiveAccessCode(code);
    if (name) {
      setTechnicianName(name);
    }
    setActivePage('home');
    setViewMode('app');
    if (window.location.hash) {
      window.location.hash = '';
    }
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
    // If not authenticated, navigate to the dedicated Auth Page
    openAuth('signup');
  };

  const handleLearnMore = () => {
    handleNavigatePage('docs');
  };

  // When authenticated and in app mode, render the App Dashboard
  if (activeAccessCode && viewMode === 'app') {
    return (
      <Suspense fallback={<div className="fixed inset-0 bg-[#0E1111]" />}>
        <div className="fixed inset-0 h-screen h-[100dvh] w-full overflow-hidden bg-[#0E1111] text-[#FFFFFF] font-sans selection:bg-[#A3B18A]/30 selection:text-[#FFFFFF]">
          <AppDashboard
            activeCode={activeAccessCode}
            technicianName={technicianName}
            onSignOut={handleSignOut}
            onViewLanding={handleViewHomepage}
            initialPrompt={dashboardInitialPrompt}
          />
        </div>
      </Suspense>
    );
  }

  // Dedicated Auth Page
  if (activePage === 'auth') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0E1111]" />}>
        <AuthPage
          mode={authMode}
          onBack={handleNavigateHome}
          onAuthenticated={handleAuthenticated}
          activeCode={activeAccessCode}
        />
      </Suspense>
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
      <Suspense fallback={<div className="min-h-screen bg-[#0E1111]" />}>
        <DocsPage {...subPageProps} />
      </Suspense>
    );
  }

  if (activePage === 'careers') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0E1111]" />}>
        <CareersPage {...subPageProps} />
      </Suspense>
    );
  }

  if (activePage === 'press') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0E1111]" />}>
        <PressPage {...subPageProps} />
      </Suspense>
    );
  }

  if (activePage === 'help') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0E1111]" />}>
        <HelpPage {...subPageProps} />
      </Suspense>
    );
  }

  if (activePage === 'status') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0E1111]" />}>
        <StatusPage {...subPageProps} />
      </Suspense>
    );
  }

  if (activePage === 'terms') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0E1111]" />}>
        <TermsPage {...subPageProps} />
      </Suspense>
    );
  }

  if (activePage === 'privacy') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0E1111]" />}>
        <PrivacyPage {...subPageProps} />
      </Suspense>
    );
  }

  if (activePage === 'licenses') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0E1111]" />}>
        <LicensesPage {...subPageProps} />
      </Suspense>
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
    </div>
  );
}
