import React from 'react';
import { PageHeader } from './PageHeader';
import { Footer } from '../components/Footer';
import { ScrollReveal } from '../components/ScrollReveal';
import { Mail, Phone, Clock, MessageSquare, Sparkles } from 'lucide-react';

interface HelpPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (page: string) => void;
  onOpenDashboard?: () => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  activeCode?: string | null;
}

export function HelpPage({
  onNavigateHome,
  onNavigatePage,
  onOpenDashboard,
  onOpenAuth,
  activeCode,
}: HelpPageProps) {
  const handleAskMekai = () => {
    if (activeCode && onOpenDashboard) {
      onOpenDashboard();
    } else if (onOpenAuth) {
      onOpenAuth('signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1111] text-white font-sans flex flex-col selection:bg-[#A3B18A]/30">
      <PageHeader
        title="Help"
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
              Help &amp; Support
            </h1>
            <p className="text-base sm:text-lg text-[#9EA8A8] max-w-2xl leading-relaxed">
              We’re here to help. Reach the team directly, or ask Mekai in-app — the assistant can answer most questions instantly.
            </p>

            {/* Quick Assistant Launch Card */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#121616] border border-[#1E2525] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#A3B18A]/10 border border-[#A3B18A]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#A3B18A]" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-white font-heading">
                    Ask Mekai In-App
                  </p>
                  <p className="text-xs sm:text-sm text-[#8F9999]">
                    Get instant AI automotive answers, DTC error code breakdowns, and repair guidance.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAskMekai}
                className="px-5 py-2.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
              >
                {activeCode ? 'Open Assistant' : 'Launch In-App'}
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Contact Us Section */}
        <div className="space-y-6">
          <ScrollReveal animation="fade-up" duration={480} delay={60}>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight">
              Contact us
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Email support */}
            <ScrollReveal animation="fade-up" duration={480} delay={80}>
              <div className="h-full p-6 rounded-2xl bg-[#121616] border border-[#1E2525] hover:border-[#2C3636] transition-colors space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#1A2121] border border-[#263131] flex items-center justify-center text-[#A3B18A] mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E8B8B] font-heading">
                  Email support
                </h3>
                <div>
                  <a
                    href="mailto:support@mekai.ai"
                    className="text-base sm:text-lg font-semibold text-white hover:text-[#A3B18A] transition-colors break-all"
                  >
                    support@mekai.ai
                  </a>
                </div>
                <p className="text-xs text-[#707D7D] pt-1">
                  For account assistance, app issues, and diagnostic queries.
                </p>
              </div>
            </ScrollReveal>

            {/* General enquiries */}
            <ScrollReveal animation="fade-up" duration={480} delay={120}>
              <div className="h-full p-6 rounded-2xl bg-[#121616] border border-[#1E2525] hover:border-[#2C3636] transition-colors space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#1A2121] border border-[#263131] flex items-center justify-center text-[#A3B18A] mb-4">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E8B8B] font-heading">
                  General enquiries
                </h3>
                <div>
                  <a
                    href="mailto:contact@mekai.ai"
                    className="text-base sm:text-lg font-semibold text-white hover:text-[#A3B18A] transition-colors break-all"
                  >
                    contact@mekai.ai
                  </a>
                </div>
                <p className="text-xs text-[#707D7D] pt-1">
                  For partnerships, automotive fleet questions, and general info.
                </p>
              </div>
            </ScrollReveal>

            {/* Phone */}
            <ScrollReveal animation="fade-up" duration={480} delay={160}>
              <div className="h-full p-6 rounded-2xl bg-[#121616] border border-[#1E2525] hover:border-[#2C3636] transition-colors space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#1A2121] border border-[#263131] flex items-center justify-center text-[#A3B18A] mb-4">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E8B8B] font-heading">
                  Phone
                </h3>
                <div>
                  <a
                    href="tel:+23480063524"
                    className="text-base sm:text-lg font-semibold text-white hover:text-[#A3B18A] transition-colors"
                  >
                    +234 (0) 800 MEKAI
                  </a>
                </div>
                <p className="text-xs text-[#707D7D] pt-1">
                  Direct phone line for urgent technical and enterprise support.
                </p>
              </div>
            </ScrollReveal>

            {/* Operating Hours */}
            <ScrollReveal animation="fade-up" duration={480} delay={200}>
              <div className="h-full p-6 rounded-2xl bg-[#121616] border border-[#1E2525] hover:border-[#2C3636] transition-colors space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#1A2121] border border-[#263131] flex items-center justify-center text-[#A3B18A] mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E8B8B] font-heading">
                  Availability
                </h3>
                <p className="text-base sm:text-lg font-semibold text-white">
                  Available daily
                </p>
                <p className="text-sm text-[#A3B18A] font-medium">
                  8:00 AM to 9:30 PM WAT
                </p>
                <p className="text-xs text-[#707D7D] pt-1">
                  West Africa Time (UTC+1).
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
