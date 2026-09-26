import React from 'react';
import { PageHeader } from './PageHeader';
import { Footer } from '../components/Footer';
import { ScrollReveal } from '../components/ScrollReveal';

interface CareersPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (page: string) => void;
  onOpenDashboard?: () => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  activeCode?: string | null;
}

export function CareersPage({
  onNavigateHome,
  onNavigatePage,
  onOpenDashboard,
  onOpenAuth,
  activeCode,
}: CareersPageProps) {
  return (
    <div className="min-h-screen bg-[#0E1111] text-white font-sans flex flex-col selection:bg-[#A3B18A]/30">
      <PageHeader
        title="Careers"
        onNavigateHome={onNavigateHome}
        onOpenDashboard={onOpenDashboard}
        onOpenAuth={onOpenAuth}
        activeCode={activeCode}
      />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-12 sm:py-16">
        {/* Document Header */}
        <ScrollReveal animation="fade-up" duration={480} delay={0}>
          <div className="border-b border-[#1E2525] pb-8 mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] font-heading mb-4">
              Careers
            </h1>
            <div className="p-5 rounded-2xl bg-[#121616] border border-[#1E2525] text-[#9EA8A8] text-sm sm:text-base leading-relaxed">
              We’re building the technology platform that transforms how people interact with vehicles, machinery, and technical systems through intuitive conversational AI. If that excites you, let’s talk.
            </div>
          </div>
        </ScrollReveal>

        {/* Content Sections */}
        <div className="space-y-10 sm:space-y-12">
          {/* Section: How we work */}
          <ScrollReveal animation="fade-up" duration={480} delay={60}>
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
                How we work
              </h2>
              <div className="space-y-3 pl-5 sm:pl-6 border-l border-[#1E2525]">
                <div className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                  <strong className="text-white font-semibold">Users first</strong> — Every decision starts with the person on the other side of the screen.
                </div>
                <div className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                  <strong className="text-white font-semibold">Ship and learn</strong> — We move fast, put things in front of real users, and improve relentlessly.
                </div>
                <div className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                  <strong className="text-white font-semibold">Own the outcome</strong> — Small team, big surface area. You own problems end to end.
                </div>
                <div className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                  <strong className="text-white font-semibold">Excellence-driven</strong> — We build for practical realities with world-class engineering standards.
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Section: Open roles */}
          <ScrollReveal animation="fade-up" duration={480} delay={120}>
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
                Open roles
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
                We don’t have public listings right now, but we’re always keen to meet exceptional engineers, designers, and operators. Tell us what you’d want to build.
              </p>
            </section>
          </ScrollReveal>

          {/* Section: Send us a note */}
          <ScrollReveal animation="fade-up" duration={480} delay={180}>
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
                Send us a note
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
                <a
                  href="mailto:careers@mekai.ai"
                  className="text-[#A3B18A] hover:underline font-medium"
                >
                  careers@mekai.ai
                </a>
              </p>
            </section>
          </ScrollReveal>
        </div>
      </main>

      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
