import { Plus, Mic, ArrowUp } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface HeroSectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  return (
    <section id="hero-section" className="relative pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-24 lg:pb-28">
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Hero Narrative & CTAs */}
          <div id="hero-content" className="lg:col-span-6 flex flex-col justify-center">
            <ScrollReveal animation="fade-up" duration={480} delay={60}>
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-[-0.03em] leading-[1.08] mb-6"
              >
                Diagnostic<br className="hidden sm:inline" /> intelligence for the<br className="hidden sm:inline" /> modern workshop.
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" duration={480} delay={120}>
              <p
                id="hero-description"
                className="text-base sm:text-lg text-[#9EA8A8] font-normal leading-relaxed mb-8 sm:mb-10 max-w-2xl"
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
                  className="px-7 py-3.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-bold text-sm font-heading transition-all duration-200 inline-flex items-center gap-2 group shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  <span>Get started</span>
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>

                <button
                  id="hero-learn-more-btn"
                  type="button"
                  onClick={onLearnMore}
                  className="px-7 py-3.5 rounded-full bg-transparent border border-[#2E3636] hover:border-[#A3B18A]/60 hover:bg-white/[0.03] active:scale-95 text-white font-semibold text-sm font-heading transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] cursor-pointer"
                >
                  Learn more
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Diagnostic Session Mockup (Purely for design, non-clickable) */}
          <div id="hero-mockup-wrapper" className="lg:col-span-6 pointer-events-none select-none">
            <ScrollReveal animation="scale-up" duration={550} delay={150}>
              <div
                id="diagnostic-session-card"
                className="w-full bg-[#101414] border border-[#202727] rounded-[24px] p-6 sm:p-7 shadow-2xl"
                aria-hidden="true"
              >
                {/* Session Card Header */}
                <div id="session-card-header" className="flex items-center gap-2.5 pb-6">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-2 h-2 rounded-full bg-[#4A5555]" />
                    <span className="w-2 h-2 rounded-full bg-[#4A5555]" />
                    <span className="w-2 h-2 rounded-full bg-[#4A5555]" />
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
                  <div id="session-assistant-message" className="self-start max-w-[95%] space-y-3.5 text-[#B8C2BF] text-xs sm:text-[13.5px] leading-relaxed">
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
                    className="bg-[#141818] border border-[#242C2C] rounded-full px-4 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#5C6767]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-5 h-5 flex items-center justify-center text-[#6A7777] shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[#5C6767] text-[11px] sm:text-xs truncate font-normal">
                        Describe the symptom, paste a code or attach evidence...
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="p-1 text-[#6A7777]">
                        <Mic className="w-3.5 h-3.5" />
                      </span>
                      <span className="w-6 h-6 rounded-full border border-[#2E3737] flex items-center justify-center text-[#7E8B8B]">
                        <ArrowUp className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Micro Disclaimer */}
                  <p id="session-disclaimer" className="text-[11px] text-[#4A5555] text-center mt-3 font-normal">
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

