import { Plus, Mic, ArrowUp } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface HeroSectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
  isAuthenticated?: boolean;
}

export function HeroSection({ onGetStarted, onLearnMore, isAuthenticated = false }: HeroSectionProps) {
  return (
    <section id="hero-section" className="relative pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-24 lg:pb-28">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Hero Narrative & CTAs */}
          <div id="hero-content" className="lg:col-span-6 flex flex-col justify-center w-full">
            <ScrollReveal animation="fade-up" duration={480} delay={60}>
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-[52px] lg:text-[54px] font-extrabold text-white tracking-[-0.03em] leading-[1.08] mb-6 font-heading"
              >
                Diagnostic<br className="hidden sm:inline" /> intelligence for the<br className="hidden sm:inline" /> modern workshop.
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" duration={480} delay={120}>
              <p
                id="hero-description"
                className="text-base sm:text-lg md:text-xl text-[#9EA8A8] font-normal leading-relaxed mb-8 sm:mb-10 max-w-2xl"
              >
                Mekai is an automotive diagnostic assistant designed to analyze OBD-II trouble codes,
                engine acoustic signatures, and component images to deliver instant repair guidance.
                Just type or speak naturally.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" duration={480} delay={180}>
              <div id="hero-cta-group" className="flex flex-wrap items-center gap-4">
                <button
                  id="hero-get-started-btn"
                  type="button"
                  onClick={() => onGetStarted?.()}
                  className="px-7 py-3.5 md:px-8 md:py-4 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-bold text-sm md:text-base font-heading transition-all duration-200 inline-flex items-center gap-2 group shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer min-h-[44px] md:min-h-[48px]"
                >
                  <span>{isAuthenticated ? 'Open Dashboard' : 'Get started'}</span>
                  <svg
                    className="w-4 h-4 md:w-[18px] md:h-[18px] transition-transform group-hover:translate-x-1 shrink-0"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 10H16.5M16.5 10L11.75 5.25M16.5 10L11.75 14.75"
                      stroke="currentColor"
                      strokeWidth="2.45"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  id="hero-learn-more-btn"
                  type="button"
                  onClick={onLearnMore}
                  className="px-7 py-3.5 md:px-8 md:py-4 rounded-full bg-transparent border border-[#2E3636] hover:border-[#A3B18A]/60 hover:bg-white/[0.03] active:scale-95 text-white font-semibold text-sm md:text-base font-heading transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] cursor-pointer min-h-[44px] md:min-h-[48px]"
                >
                  Learn more
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Diagnostic Session Mockup (Purely for design, non-clickable) */}
          <div id="hero-mockup-wrapper" className="lg:col-span-6 pointer-events-none select-none w-full">
            <ScrollReveal animation="scale-up" duration={550} delay={150}>
              <div
                id="diagnostic-session-card"
                className="w-full bg-[#101414] border border-[#202727] rounded-[24px] md:rounded-[28px] p-6 sm:p-7 md:p-8 shadow-2xl"
                aria-hidden="true"
              >
                {/* Session Card Header */}
                <div id="session-card-header" className="flex items-center gap-2.5 pb-6">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-2 h-2 rounded-full bg-[#4A5555] animate-dot-1" />
                    <span className="w-2 h-2 rounded-full bg-[#4A5555] animate-dot-2" />
                    <span className="w-2 h-2 rounded-full bg-[#4A5555] animate-dot-3" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#A3B18A] font-heading ml-1">
                    Diagnostic Session
                  </span>
                </div>

                {/* Chat Session Messages Container */}
                <div id="session-card-messages" className="py-4 sm:py-6 flex flex-col gap-6">
                  {/* User Message Bubble */}
                  <div id="session-user-bubble" className="self-end max-w-[85%]">
                    <div className="bg-[#A3B18A] text-[#0E1111] text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm">
                      Hey, Mekai.
                    </div>
                  </div>

                  {/* Assistant Message Content (Exact text from design) */}
                  <div id="session-assistant-message" className="self-start max-w-[95%] space-y-3.5 text-[#A3B18A] text-xs sm:text-[13.5px] leading-relaxed">
                    <p>
                      Hello! I am Mekai, your automotive diagnostic assistant from Cestcore Limited.
                    </p>
                    <p>
                      It is great to connect with you. How are you doing today, and what vehicle or issue are we looking at in the workshop?
                    </p>
                  </div>
                </div>

                {/* Static Design Mockup Input Bar (Purely visual, non-clickable) */}
                <div id="session-input-container" className="pt-2">
                  <div
                    id="session-input-bar"
                    className="bg-[#0E1312] border border-[#23312C] rounded-full px-4 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm shadow-lg"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-5 h-5 flex items-center justify-center text-[#8A9A78] shrink-0">
                        <Plus className="w-4 h-4 stroke-[2]" />
                      </span>
                      <span className="text-[#5A6964] text-[11px] sm:text-xs truncate font-sans font-normal">
                        Ask Mekai (e.g. Ford Explorer 2014)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="p-1 text-[#8A9A78] flex items-center justify-center">
                        <Mic className="w-4 h-4 stroke-[2]" />
                      </span>
                      <span className="w-6 h-6 rounded-full bg-[#A3B18A] flex items-center justify-center text-[#0E1111] shadow-sm">
                        <ArrowUp className="w-3.5 h-3.5 stroke-[2.8]" />
                      </span>
                    </div>
                  </div>

                  {/* Micro Disclaimer */}
                  <p id="session-disclaimer" className="text-xs md:text-[13px] text-[#707D7A] text-center mt-2.5 font-normal select-none">
                    Mekai is AI and can make mistakes.
                  </p>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}

