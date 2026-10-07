import { useEffect } from 'react';
import { AppDashboard } from '../components/AppDashboard';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export function DashboardPage() {
  const { isAuthenticated, activeCode, technicianName, logout } = useAuth();
  const { navigate, searchParams } = useRouter();

  const initialPrompt = searchParams.get('prompt') || '';

  // Route Guard: redirect unauthenticated users to the auth page
  useEffect(() => {
    if (!isAuthenticated) {
      const authUrl = initialPrompt
        ? `/auth?mode=signup&prompt=${encodeURIComponent(initialPrompt)}`
        : '/auth?mode=signup';
      navigate(authUrl, { replace: true });
    }
  }, [isAuthenticated, initialPrompt, navigate]);

  if (!isAuthenticated || !activeCode) {
    return null;
  }

  return (
    <div className="fixed inset-0 h-screen h-[100dvh] w-full overflow-hidden bg-[#0E1111] text-[#FFFFFF] font-sans selection:bg-[#A3B18A]/30 selection:text-[#FFFFFF]">
      <AppDashboard
        activeCode={activeCode}
        technicianName={technicianName}
        onSignOut={() => {
          logout();
          navigate('/');
        }}
        onViewLanding={() => {
          navigate('/');
        }}
        initialPrompt={initialPrompt}
      />
    </div>
  );
}
