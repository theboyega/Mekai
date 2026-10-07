import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { navigate } = useRouter();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0E1111] text-[#FFFFFF] font-sans selection:bg-[#A3B18A]/30 selection:text-[#FFFFFF] flex flex-col relative overflow-x-clip">
      {/* 1. Global Navigation Bar */}
      <Navbar
        onSignUpClick={() => navigate('/auth?mode=signup')}
        onLoginClick={() => navigate('/auth?mode=login')}
        activeCode={isAuthenticated ? 'CST-ACTIVE-WORKSHOP' : null}
        onSignOut={logout}
        onOpenDashboard={() => navigate('/dashboard')}
        onNavigateHome={() => navigate('/')}
        onNavigatePage={(page) => {
          if (page === 'home') navigate('/');
          else navigate(`/${page}`);
        }}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* 3. Global Footer with Multi-page Router Integration */}
      <Footer
        onNavigatePage={(page) => {
          if (page === 'home') navigate('/');
          else navigate(`/${page}`);
        }}
      />
    </div>
  );
}
