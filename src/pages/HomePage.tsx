import { HeroSection } from '../components/HeroSection';
import { CoreCapabilities } from '../components/CoreCapabilities';
import { WorkflowArchitecture } from '../components/WorkflowArchitecture';
import { FloorValidation } from '../components/FloorValidation';
import { MobileAppSection } from '../components/MobileAppSection';
import { FaqSection } from '../components/FaqSection';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { navigate } = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = (query?: string) => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      const target = query ? `/auth?mode=signup&prompt=${encodeURIComponent(query)}` : '/auth?mode=signup';
      navigate(target);
    }
  };

  const handleLearnMore = () => {
    navigate('/docs');
  };

  return (
    <>
      {/* 1. Hero Section with Diagnostic Session Chat UI Representation */}
      <HeroSection
        onGetStarted={handleGetStarted}
        onLearnMore={handleLearnMore}
        isAuthenticated={isAuthenticated}
      />

      {/* 2. Core Capabilities: OBD-II, Acoustic Analysis & Computer Vision */}
      <CoreCapabilities />

      {/* 3. Workflow Architecture: Capture → Reason → Execute */}
      <WorkflowArchitecture />

      {/* 4. Floor Validation: Operational metrics & Shop Trial CTA */}
      <FloorValidation
        onSignUpClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth?mode=signup')}
        isAuthenticated={isAuthenticated}
      />

      {/* 5. Mobile App Download & Dual Phone Mockup View */}
      <MobileAppSection />

      {/* 6. Frequently Asked Questions */}
      <FaqSection />
    </>
  );
}
