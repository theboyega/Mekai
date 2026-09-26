import React from 'react';
import { PageHeader } from './PageHeader';
import { Footer } from '../components/Footer';

interface LicensesPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (page: string) => void;
  onOpenDashboard?: () => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  activeCode?: string | null;
}

export function LicensesPage({
  onNavigateHome,
  onNavigatePage,
  onOpenDashboard,
  onOpenAuth,
  activeCode,
}: LicensesPageProps) {
  return (
    <div className="min-h-screen bg-[#0E1111] text-white font-sans flex flex-col selection:bg-[#A3B18A]/30">
      <PageHeader
        title="Licenses"
        onNavigateHome={onNavigateHome}
        onOpenDashboard={onOpenDashboard}
        onOpenAuth={onOpenAuth}
        activeCode={activeCode}
      />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-12 sm:py-16 animate-fade-in-up">
        {/* Document Header */}
        <div className="border-b border-[#1E2525] pb-8 mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] font-heading mb-4">
            Licenses & Disclosures
          </h1>
          <p className="text-sm sm:text-base text-[#7E8B8B] font-medium font-heading">
            Last updated 23 September 2026
          </p>
          <div className="mt-6 p-5 rounded-2xl bg-[#121616] border border-[#1E2525] text-[#9EA8A8] text-sm sm:text-base leading-relaxed">
            Cestcore Limited is an automotive technology and software engineering company. This page explains how our services are provided and by whom.
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 sm:space-y-12">
          {/* Section: Not a repair shop */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Not a repair shop
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              Mekai is not an auto repair shop, not a licensed mechanic garage, and not a certified vehicle inspection center. Mekai provides AI-powered diagnostic insights and repair guidance. Physical repairs and installations must be performed by certified technicians.
            </p>
          </section>

          {/* Section: Self-custodial data and sessions */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Self-custodial data and sessions
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              Your diagnostic sessions, vehicle garage history, and account settings are structured to maintain your privacy and user control. Mekai processes your entered OBD-II trouble codes and acoustic inputs to deliver real-time automotive analysis.
            </p>
          </section>

          {/* Section: AI-model processing */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              AI-model processing
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              Diagnostic reasoning and natural language processing are powered by OpenAI. OpenAI is responsible for the foundational AI models processing your assistant queries and diagnostic inputs.
            </p>
          </section>

          {/* Section: Automotive parts and local partners */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Automotive parts and local partners
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              Automotive spare parts procurement, merchant lookups, and marketplace integrations (such as Torkara) are provided by independent third parties. Those services are subject to the respective partner's commercial terms, pricing, and operating conditions.
            </p>
          </section>

          {/* Section: Open-source software */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Open-source software
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              Mekai is built with open-source software used under their respective licenses. Attributions are available on request at{' '}
              <a
                href="mailto:legal@cestcore.com"
                className="text-[#A3B18A] hover:underline font-medium"
              >
                legal@cestcore.com
              </a>.
            </p>
          </section>

          {/* Section: Contact */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Contact
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              For licensing or compliance enquiries, email{' '}
              <a
                href="mailto:compliance@cestcore.com"
                className="text-[#A3B18A] hover:underline font-medium"
              >
                compliance@cestcore.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
