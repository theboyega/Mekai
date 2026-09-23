import React from 'react';
import { PageHeader } from './PageHeader';
import { Footer } from '../components/Footer';

interface PrivacyPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (page: string) => void;
  onOpenDashboard?: () => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  activeCode?: string | null;
}

export function PrivacyPage({
  onNavigateHome,
  onNavigatePage,
  onOpenDashboard,
  onOpenAuth,
  activeCode,
}: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-[#0E1111] text-white font-sans flex flex-col selection:bg-[#A3B18A]/30">
      <PageHeader
        title="Privacy"
        onNavigateHome={onNavigateHome}
        onOpenDashboard={onOpenDashboard}
        onOpenAuth={onOpenAuth}
        activeCode={activeCode}
      />

      <main className="flex-1 w-full px-6 sm:px-10 lg:px-14 xl:px-20 max-w-4xl mx-auto py-12 sm:py-16 animate-fade-in-up">
        {/* Document Header */}
        <div className="border-b border-[#1E2525] pb-8 mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] font-heading mb-4">
            Privacy Notice
          </h1>
          <p className="text-sm sm:text-base text-[#7E8B8B] font-medium font-heading">
            Last updated 23 September 2026
          </p>
          <div className="mt-6 p-5 rounded-2xl bg-[#121616] border border-[#1E2525] text-[#9EA8A8] text-sm sm:text-base leading-relaxed">
            This notice explains how Cestcore Limited (“Mekai”, “we”, “us”) collects, uses, and protects your personal data when you use our app and services. We are the data controller for the information described below.
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 sm:space-y-12">
          {/* Section: Information we collect */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Information we collect
            </h2>
            <div className="space-y-3 pl-5 sm:pl-6 border-l border-[#1E2525]">
              <div className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                <strong className="text-white font-semibold">Account data</strong> — your name, email, phone number, country, and username.
              </div>
              <div className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                <strong className="text-white font-semibold">Vehicle garage & diagnostic data</strong> — your vehicle details (year, make, model, mileage, vin etc), entered OBD-II trouble codes, acoustic recordings, and uploaded component images.
              </div>
              <div className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                <strong className="text-white font-semibold">Conversation data</strong> — messages and diagnostic queries you send the Mekai assistant, used to fulfil your requests and improve diagnostic reasoning.
              </div>
              <div className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                <strong className="text-white font-semibold">Device & usage data</strong> — IP address, device type, and app interactions for security and analytics.
              </div>
            </div>
          </section>

          {/* Section: How we use your data */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              How we use your data
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              To provide and secure the service, process diagnostic queries, prevent fraudulent vehicle reporting, comply with legal obligations, personalise your automotive workshop experience, and communicate with you about your account.
            </p>
          </section>

          {/* Section: Service providers we share with */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Service providers we share with
            </h2>
            <div className="space-y-3 pl-5 sm:pl-6 border-l border-[#1E2525]">
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                We share the minimum data necessary with trusted processors, including:
              </p>
              <ul className="space-y-2 mt-2">
                <li className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed flex items-start gap-2.5">
                  <span className="text-[#A3B18A] mt-1 text-xs">•</span>
                  <span><strong className="text-white font-semibold">Supabase</strong> — encrypted database and authentication.</span>
                </li>
                <li className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed flex items-start gap-2.5">
                  <span className="text-[#A3B18A] mt-1 text-xs">•</span>
                  <span><strong className="text-white font-semibold">OpenAI</strong> — language-model processing of your assistant and diagnostic messages.</span>
                </li>
                <li className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed flex items-start gap-2.5">
                  <span className="text-[#A3B18A] mt-1 text-xs">•</span>
                  <span><strong className="text-white font-semibold">Upstash</strong> — session memory and rate limiting.</span>
                </li>
                <li className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed flex items-start gap-2.5">
                  <span className="text-[#A3B18A] mt-1 text-xs">•</span>
                  <span><strong className="text-white font-semibold">Torkara or related automotive spare parts partners</strong> — when you initiate parts procurement or merchant lookups through supported integrations.</span>
                </li>
              </ul>
              <div className="mt-4 p-3.5 rounded-xl bg-[#131717] border border-[#232B2B] text-sm text-[#A3B18A] font-medium">
                We do not sell your personal data.
              </div>
            </div>
          </section>

          {/* Section: Data retention */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Data retention
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              We keep personal data for as long as your account is active and as required to meet legal, tax, and regulatory obligations. Diagnostic conversation history is retained to provide continuity across your workshop sessions and can be cleared on request.
            </p>
          </section>

          {/* Section: Security */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Security
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              We use encryption in transit and at rest, secure authentication protocols, and access controls. No system is perfectly secure, so please protect your device and credentials.
            </p>
          </section>

          {/* Section: Your rights */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Your rights
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              Subject to applicable law, you may request access to, correction of, or deletion of your personal data, and you may object to certain processing. To exercise these rights, contact us below.
            </p>
          </section>

          {/* Section: Contact */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Contact
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed pl-5 sm:pl-6 border-l border-[#1E2525]">
              For privacy questions or requests, email{' '}
              <a
                href="mailto:privacy@mekai.ai"
                className="text-[#A3B18A] hover:underline font-medium"
              >
                privacy@mekai.ai
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
