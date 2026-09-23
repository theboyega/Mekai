import React from 'react';
import { PageHeader } from './PageHeader';
import { Footer } from '../components/Footer';

interface DocsPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (page: string) => void;
  onOpenDashboard?: () => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  activeCode?: string | null;
}

export function DocsPage({
  onNavigateHome,
  onNavigatePage,
  onOpenDashboard,
  onOpenAuth,
  activeCode,
}: DocsPageProps) {
  return (
    <div className="min-h-screen bg-[#0E1111] text-white font-sans flex flex-col selection:bg-[#A3B18A]/30">
      <PageHeader
        title="Docs"
        onNavigateHome={onNavigateHome}
        onOpenDashboard={onOpenDashboard}
        onOpenAuth={onOpenAuth}
        activeCode={activeCode}
      />

      <main className="flex-1 w-full px-6 sm:px-10 lg:px-14 xl:px-20 max-w-7xl mx-auto py-12 animate-fade-in-up">
        {/* Content placeholder - ready for your custom content */}
      </main>

      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
