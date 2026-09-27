import { PageHeader } from './PageHeader';
import { Footer } from '../components/Footer';
import { ScrollReveal } from '../components/ScrollReveal';

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
        onNavigateHome={onNavigateHome}
        onOpenDashboard={onOpenDashboard}
        onOpenAuth={onOpenAuth}
        activeCode={activeCode}
      />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-12 sm:py-16">
        <ScrollReveal animation="fade-up" duration={480} delay={0}>
          <section className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Documentation status
            </h1>
            <p className="text-sm sm:text-base text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525] max-w-3xl">
              Technical architecture, API references, and diagnostic workflow guides for Mekai are currently being finalized for the beta preview release.
            </p>
          </section>
        </ScrollReveal>
      </main>

      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
