import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Footer } from '../components/Footer';
import {
  Mail,
  Users,
  Zap,
  Target,
  Award,
  ArrowRight,
  Sparkles,
  Check,
  Copy,
} from 'lucide-react';

interface CareersPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (page: string) => void;
  onOpenDashboard?: () => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  activeCode?: string | null;
}

const principles = [
  {
    title: 'Users first',
    description: 'Every decision starts with the person on the other side of the screen.',
    icon: Users,
    color: '#A3B18A',
  },
  {
    title: 'Ship and learn',
    description: 'We move fast, put things in front of real users, and improve relentlessly.',
    icon: Zap,
    color: '#E0A96D',
  },
  {
    title: 'Own the outcome',
    description: 'Small team, big surface area. You own problems end to end.',
    icon: Target,
    color: '#7FB3D5',
  },
  {
    title: 'Excellence-driven',
    description: 'We build for practical realities with world-class engineering standards.',
    icon: Award,
    color: '#A3B18A',
  },
];

export function CareersPage({
  onNavigateHome,
  onNavigatePage,
  onOpenDashboard,
  onOpenAuth,
  activeCode,
}: CareersPageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('careers@mekai.ai');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0E1111] text-white font-sans flex flex-col selection:bg-[#A3B18A]/30">
      <PageHeader
        title="Careers"
        onNavigateHome={onNavigateHome}
        onOpenDashboard={onOpenDashboard}
        onOpenAuth={onOpenAuth}
        activeCode={activeCode}
      />

      <main className="flex-1 w-full px-6 sm:px-10 lg:px-14 xl:px-20 max-w-4xl mx-auto py-12 sm:py-16">
        {/* Document Header */}
        <div className="border-b border-[#1E2525] pb-10 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A3B18A]/10 border border-[#A3B18A]/20 text-[#A3B18A] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Mekai</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] font-heading mb-4">
            Careers
          </h1>

          <p className="text-base sm:text-lg text-[#9EA8A8] max-w-3xl leading-relaxed">
            We’re building the technology platform that transforms how people interact with vehicles, machinery, and technical systems through intuitive conversational AI. If that excites you, let’s talk.
          </p>

          {/* Quick Contact Card */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#121616] border border-[#1E2525] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#A3B18A]/10 border border-[#A3B18A]/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#A3B18A]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#7E8B8B] font-heading">
                  Careers & Talent
                </p>
                <a
                  href="mailto:careers@mekai.ai?subject=Exploring%20Opportunities%20at%20Mekai"
                  className="text-base sm:text-lg font-semibold text-white hover:text-[#A3B18A] transition-colors"
                >
                  careers@mekai.ai
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3.5 py-2.5 rounded-full bg-[#161C1C] hover:bg-[#1E2525] border border-[#242D2D] text-xs font-medium text-[#9EA8A8] hover:text-white transition-colors inline-flex items-center gap-1.5"
                title="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#A3B18A]" />
                    <span className="text-[#A3B18A]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <a
                href="mailto:careers@mekai.ai?subject=Exploring%20Opportunities%20at%20Mekai"
                className="px-5 py-2.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] text-[#0E1111] font-bold text-xs sm:text-sm font-heading transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Send us a note</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12 sm:space-y-14">
          {/* Section: How we work */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
                How we work
              </h2>
              <p className="text-sm text-[#7E8B8B] mt-1 pl-5.5">
                Our core operational principles and team culture
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {principles.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="p-5 sm:p-6 rounded-2xl bg-[#121616] border border-[#1E2525] hover:border-[#2B3535] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#182020] border border-[#242E2E] flex items-center justify-center mb-4 text-[#A3B18A] group-hover:scale-105 transition-transform">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white font-heading tracking-tight mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#9EA8A8] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section: Open roles */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Open roles
            </h2>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#121616] border border-[#1E2525] space-y-4">
              <p className="text-sm sm:text-[15px] text-[#9EA8A8] leading-relaxed">
                We don’t have public listings right now, but we’re always keen to meet exceptional engineers, designers, and operators. Tell us what you’d want to build.
              </p>
            </div>
          </section>

          {/* Section: Send us a note */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A]" />
              Send us a note
            </h2>

            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#121717] to-[#161D1D] border border-[#232D2D] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-base sm:text-lg font-semibold text-white">
                  Interested in joining our team?
                </p>
                <p className="text-sm text-[#8D9898] max-w-md">
                  Send your portfolio, GitHub, or a note detailing what technical systems or features you’d like to build with us.
                </p>
                <div className="pt-1">
                  <a
                    href="mailto:careers@mekai.ai"
                    className="text-base sm:text-lg font-mono font-bold text-[#A3B18A] hover:underline"
                  >
                    careers@mekai.ai
                  </a>
                </div>
              </div>

              <a
                href="mailto:careers@mekai.ai?subject=Application%20/%20Introduction%20-%20Mekai"
                className="px-6 py-3.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-[0.99] text-[#0E1111] font-bold text-sm font-heading transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-md shrink-0 self-start sm:self-auto"
              >
                <Mail className="w-4 h-4" />
                <span>Email careers@mekai.ai</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
