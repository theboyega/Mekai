import React from 'react';
import { PageHeader } from './PageHeader';
import { Footer } from '../components/Footer';
import { ScrollReveal } from '../components/ScrollReveal';
import { Mail, Newspaper, FolderDown, Building2 } from 'lucide-react';

interface PressPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (page: string) => void;
  onOpenDashboard?: () => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  activeCode?: string | null;
}

export function PressPage({
  onNavigateHome,
  onNavigatePage,
  onOpenDashboard,
  onOpenAuth,
  activeCode,
}: PressPageProps) {
  return (
    <div className="min-h-screen bg-[#0E1111] text-white font-sans flex flex-col selection:bg-[#A3B18A]/30">
      <PageHeader
        title="Press"
        onNavigateHome={onNavigateHome}
        onOpenDashboard={onOpenDashboard}
        onOpenAuth={onOpenAuth}
        activeCode={activeCode}
      />

      <main className="flex-1 w-full px-6 sm:px-10 lg:px-14 xl:px-20 max-w-4xl mx-auto py-12 sm:py-16">
        {/* Document Header */}
        <ScrollReveal animation="fade-up" duration={480} delay={0}>
          <div className="border-b border-[#1E2525] pb-8 mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] font-heading mb-4">
              Press
            </h1>
            <p className="text-base sm:text-lg text-[#9EA8A8] max-w-2xl leading-relaxed">
              For interviews, quotes, or media enquiries, we’d love to hear from you.
            </p>

            {/* Media Contact Card */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#121616] border border-[#1E2525] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#A3B18A]/10 border border-[#A3B18A]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#A3B18A]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7E8B8B] font-heading">
                    Media Contact
                  </p>
                  <a
                    href="mailto:press@mekai.ai"
                    className="text-base sm:text-lg font-semibold text-white hover:text-[#A3B18A] transition-colors"
                  >
                    press@mekai.ai
                  </a>
                </div>
              </div>

              <a
                href="mailto:press@mekai.ai?subject=Media%20Enquiry"
                className="px-5 py-2.5 rounded-full bg-[#1A2121] hover:bg-[#242D2D] text-[#A3B18A] hover:text-white border border-[#263131] text-xs sm:text-sm font-semibold font-heading transition-colors inline-flex items-center justify-center self-start sm:self-auto shrink-0 cursor-pointer"
              >
                Send Media Enquiry
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Content Sections */}
        <div className="space-y-10 sm:space-y-12">
          {/* Section: About Mekai */}
          <ScrollReveal animation="fade-up" duration={480} delay={60}>
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
                About Mekai
              </h2>
              <div className="space-y-4 pl-5 sm:pl-6 border-l border-[#1E2525] text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                <p>
                  Mekai is an AI-powered diagnostic and assistant platform built to transform how users interact with vehicles, machinery, and technical systems. Through a single conversational interface, users can interpret troubleshooting data, analyze acoustic signatures, manage vehicle garages, and coordinate part procurement, all by chat.
                </p>
                <p>
                  Mekai combines advanced language models with trusted technical integrations to give users one place for intelligent diagnostics and seamless workflow execution.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Section: Brand Assets */}
          <ScrollReveal animation="fade-up" duration={480} delay={120}>
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
                Brand assets
              </h2>
              <div className="pl-5 sm:pl-6 border-l border-[#1E2525] space-y-3">
                <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                  Logos and brand guidelines are available on request. Email{' '}
                  <a
                    href="mailto:press@mekai.ai?subject=Press%20Kit%20Request"
                    className="text-[#A3B18A] hover:underline font-medium"
                  >
                    press@mekai.ai
                  </a>{' '}
                  and we’ll send over our press kit.
                </p>
                <div className="pt-2">
                  <a
                    href="mailto:press@mekai.ai?subject=Press%20Kit%20Request"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121616] hover:bg-[#1A2121] border border-[#1E2525] text-xs font-semibold text-[#A3B18A] hover:text-white transition-colors cursor-pointer"
                  >
                    <FolderDown className="w-4 h-4" />
                    <span>Request Press Kit</span>
                  </a>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Section: Company */}
          <ScrollReveal animation="fade-up" duration={480} delay={180}>
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
                Company
              </h2>
              <div className="pl-5 sm:pl-6 border-l border-[#1E2525]">
                <div className="p-4 rounded-xl bg-[#121616] border border-[#1E2525] flex items-center gap-3 text-sm text-[#9EA8A8]">
                  <Building2 className="w-5 h-5 text-[#A3B18A] shrink-0" />
                  <span>
                    <strong className="text-white font-semibold">Cestcore Limited</strong> · © 2026 · All rights reserved.
                  </span>
                </div>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </main>

      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
