import React from 'react';
import { PageHeader } from './PageHeader';
import { Footer } from '../components/Footer';

interface TermsPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (page: string) => void;
  onOpenDashboard?: () => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  activeCode?: string | null;
}

export function TermsPage({
  onNavigateHome,
  onNavigatePage,
  onOpenDashboard,
  onOpenAuth,
  activeCode,
}: TermsPageProps) {
  return (
    <div className="min-h-screen bg-[#0E1111] text-white font-sans flex flex-col selection:bg-[#A3B18A]/30">
      <PageHeader
        title="Terms"
        onNavigateHome={onNavigateHome}
        onOpenDashboard={onOpenDashboard}
        onOpenAuth={onOpenAuth}
        activeCode={activeCode}
      />

      <main className="flex-1 w-full px-6 sm:px-10 lg:px-14 xl:px-20 max-w-4xl mx-auto py-12 sm:py-16">
        {/* Document Header */}
        <div className="border-b border-[#1E2525] pb-8 mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] font-heading mb-4">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-[#7E8B8B] font-medium font-heading">
            Last updated 23 September 2026
          </p>
          <div className="mt-6 p-5 rounded-2xl bg-[#121616] border border-[#1E2525] text-[#9EA8A8] text-sm sm:text-base leading-relaxed">
            These Terms of Service (“Terms”) govern your access to and use of Mekai, operated by Cestcore Limited (“Mekai”, “we”, “us”). By creating an account or using the service, you agree to these Terms. If you do not agree, do not use Mekai.
          </div>
        </div>

        {/* 11 Numbered Sections */}
        <div className="space-y-10 sm:space-y-12">
          {/* Section 1 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              1
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                What Mekai is
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                Mekai is an AI-powered automotive diagnostic assistant platform, not an auto repair shop, not a licensed mechanic garage, and not a certified vehicle inspection center. Mekai provides conversational and multimodal analysis of OBD-II trouble codes, acoustic engine signatures, and component images to deliver diagnostic insights and potential repair guidance. We do not perform physical repairs or take physical custody of vehicles.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              2
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                Eligibility
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                You must be at least 18 years old and legally able to enter into a contract. You are responsible for complying with the laws of the country you use Mekai from. Access may be restricted in certain jurisdictions.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              3
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                Your accounts and data
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                Your account and diagnostic history are secured via your login credentials. You are solely responsible for safeguarding your device and account access. Mekai maintains your saved diagnostic sessions and vehicle garage history to provide seamless continuity across your devices.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              4
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                AI diagnostics and vehicle data
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                AI-generated diagnostic outputs are probabilistic and provided for informational and reference purposes only. On-chain or digital logs of your vehicle diagnostics are processed based on the information you provide. Mekai is not responsible for diagnostic inaccuracies resulting from faulty OBD-II data, improper user input, or underlying mechanical failures.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              5
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                Third-party parts and local partners
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                Automotive spare parts procurement, merchant listings, or third-party vendor services (such as integration with marketplaces like Torqara) are provided by independent third parties. Those services are subject to the respective partner’s own terms, pricing, and operating conditions.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              6
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                Fees
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                Mekai may charge subscription or feature-based fees for advanced diagnostic capabilities, which will be clearly disclosed to you before you confirm any transaction. Third-party parts purchases or external garage services will incur separate costs determined by those providers.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              7
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                Acceptable use
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                You agree not to use Mekai for fraudulent vehicle reporting, malicious system manipulation, or any unlawful activity. We may suspend or terminate accounts that violate these Terms or applicable law.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              8
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                Disclaimers and liability
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                The service is provided “as is” without warranties of any kind. To the fullest extent permitted by law, Mekai is not liable for indirect, incidental, or consequential damages, or for any vehicle damage, personal injury, or loss arising from your use of AI diagnostic recommendations, self-performed mechanical repairs, or third-party partners.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              9
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                Changes
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                We may update these Terms from time to time. Material changes will be communicated in-app or by email. Continued use after changes take effect constitutes acceptance.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              10
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                Governing law
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict of law principles.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="flex gap-4 sm:gap-6">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2121] border border-[#263131] text-[#A3B18A] font-heading font-bold text-sm shrink-0">
              11
            </span>
            <div className="space-y-2 pt-0.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                Contact
              </h2>
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                Questions about these Terms? Email{' '}
                <a
                  href="mailto:legal@mekai.ai"
                  className="text-[#A3B18A] hover:underline font-medium"
                >
                  legal@mekai.ai
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
