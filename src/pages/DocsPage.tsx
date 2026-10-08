import { useEffect } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';

export function DocsPage() {
  useEffect(() => {
    document.title = 'Mekai | Docs';
  }, []);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-12 sm:py-16">
      {/* Document Header */}
      <ScrollReveal animation="fade-up" duration={480} delay={0}>
        <div className="border-b border-[#1E2525] pb-8 mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] font-heading mb-3">
            Documentation
          </h1>
          <p className="text-sm sm:text-base text-[#7E8B8B] font-medium font-heading mb-6">
            Developer &amp; Technical Reference
          </p>
          <div className="p-5 rounded-2xl bg-[#121616] border border-[#1E2525] text-[#9EA8A8] text-sm sm:text-base leading-relaxed">
            Technical architecture, API references, and diagnostic workflow guides for Mekai are currently being finalized for the beta preview release.
          </div>
        </div>
      </ScrollReveal>

      {/* Notice */}
      <ScrollReveal animation="fade-up" duration={480} delay={60}>
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#121616]/60 border border-[#1E2525] text-[#8F9999] text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight mb-2">
              Coming Soon
            </h2>
            <p>
              Detailed integration guides, OBD-II data protocol schemas, acoustic analysis specifications, and webhook documentation will be published here shortly.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
