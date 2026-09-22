import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CoreCapabilities } from './components/CoreCapabilities';
import { WorkflowArchitecture } from './components/WorkflowArchitecture';
import { FloorValidation } from './components/FloorValidation';
import { MobileAppSection } from './components/MobileAppSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { DesignTokensDrawer } from './components/DesignTokensDrawer';

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

  const openAuth = (mode: 'signup' | 'login') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const closeAuth = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAuthenticated = (code: string) => {
    setActiveAccessCode(code);
  };

  const handleSignOut = () => {
    setActiveAccessCode(null);
  };

  const handleLearnMore = () => {
    const el = document.getElementById('capabilities-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1111] text-[#FFFFFF] font-sans selection:bg-[#A3B18A]/30 selection:text-[#FFFFFF] flex flex-col relative overflow-x-hidden">
      {/* 1. Global Navigation Bar */}
      <Navbar
        onSignUpClick={() => openAuth('signup')}
        onLoginClick={() => openAuth('login')}
        activeCode={activeAccessCode}
        onSignOut={handleSignOut}
      />

      {/* Main Semantic Page Content */}
      <main className="flex-1">
        {/* 2. Hero Section with Diagnostic Session Chat UI Representation */}
        <HeroSection
          onGetStarted={() => openAuth('signup')}
          onLearnMore={handleLearnMore}
        />

        {/* 3. Core Capabilities: 3 Cards (Sage OBD-II, White Acoustic, Dark Vision) */}
        <CoreCapabilities />

        {/* 4. Workflow Architecture: Capture → Reason → Execute */}
        <WorkflowArchitecture />

        {/* 5. Floor Validation: 3 Metric Cards + Sage Green CTA Card */}
        <FloorValidation onSignUpClick={() => openAuth('signup')} />

        {/* 6. Mobile App Download & Dual Phone Mockup View */}
        <MobileAppSection
          onAppStoreClick={() => openAuth('signup')}
          onPlayStoreClick={() => openAuth('signup')}
        />
      </main>

      {/* 7. Global Footer */}
      <Footer />

      {/* Authentication & Access Code Validation Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        mode={authModalState.mode}
        onClose={closeAuth}
        onAuthenticated={handleAuthenticated}
        activeCode={activeAccessCode}
      />

      {/* Design System & Tokens Inspector (Toggleable drawer) */}
      <DesignTokensDrawer />
    </div>
  );
}
