import { Plus, Mic, ArrowUp } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  return (
    <section id="hero-section" className="relative pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-24 lg:pb-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Hero Narrative & CTAs */}
          <div id="hero-content" className="lg:col-span-6 flex flex-col justify-center">
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-[-0.03em] leading-[1.08] mb-6"
            >
              Diagnostic<br className="hidden sm:inline" /> intelligence for the<br className="hidden sm:inline" /> modern workshop
            </h1>

            <p
              id="hero-description"
              className="text-base sm:text-lg text-[#9EA8A8] font-normal leading-relaxed mb-8 sm:mb-10 max-w-xl"
            >
              Mekai is an automotive diagnostic assistant designed to analyze OBD-II trouble codes,
              engine acoustic signatures, and component images to deliver instant repair guidance.
              Just type or speak naturally.
            </p>

            <div id="hero-cta-group" className="flex flex-wrap items-center gap-4">
              <button
                id="hero-get-started-btn"
                type="button"
                onClick={onGetStarted}
                className="px-7 py-3.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-bold text-sm font-heading transition-all duration-200 inline-flex items-center gap-2 group shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Get started</span>
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </button>

              <button
                id="hero-learn-more-btn"
                type="button"
                onClick={onLearnMore}
                className="px-7 py-3.5 rounded-full bg-transparent border border-[#2E3636] hover:border-[#A3B18A]/60 hover:bg-white/[0.03] active:scale-95 text-white font-semibold text-sm font-heading transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A]"
              >
                Learn more
              </button>
            </div>
          </div>

          {/* Right Column: Diagnostic Session Design Mockup */}
          <div id="hero-mockup-wrapper" className="lg:col-span-6">
            <div
              id="diagnostic-session-card"
              className="w-full bg-[#121515] border border-[#222828] rounded-[24px] p-6 sm:p-7 shadow-2xl transition-all duration-300 hover:border-[#2C3434]"
            >
              {/* Session Card Header */}
              <div id="session-card-header" className="flex items-center gap-3 pb-6 border-b border-[#1E2323]">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="w-2 h-2 rounded-full bg-[#525D5D]" />
                  <span className="w-2 h-2 rounded-full bg-[#525D5D]" />
                  <span className="w-2 h-2 rounded-full bg-[#525D5D]" />
                </div>
                <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#A3B18A] font-heading">
                  Diagnostic Session
                </span>
              </div>

              {/* Chat Session Messages Container */}
              <div id="session-card-messages" className="py-7 flex flex-col gap-6">
                {/* User Message Bubble */}
                <div id="session-user-bubble" className="self-end max-w-[85%]">
                  <div className="bg-[#A3B18A] text-[#0E1111] text-sm font-semibold px-4 py-2.5 rounded-2xl rounded-tr-xs shadow-sm">
                    Hey, Mekai.
                  </div>
                </div>

                {/* Assistant Message Content */}
                <div id="session-assistant-message" className="self-start max-w-[95%] space-y-3.5 text-[#DDE3E3] text-sm sm:text-[14.5px] leading-relaxed">
                  <p>
                    Hello! I am Mekai, your automotive diagnostic assistant from Cestcore Limited.
                  </p>
                  <p>
                    It is great to connect with you. How are you doing today, and what vehicle or issue are we looking at in the workshop?
                  </p>
                </div>
              </div>

              {/* Input Bar Design Representation */}
              <div id="session-input-container" className="pt-2">
                <div
                  id="session-input-bar"
                  className="bg-[#1A1F1F] border border-[#2B3232] rounded-full px-4 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#778383] select-none"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      aria-label="Add attachment"
                      className="w-5 h-5 flex items-center justify-center text-[#7E8B8B] hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="truncate text-[#707C7C]">
                      Describe the symptom, paste a code or attach evidence...
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label="Voice input"
                      className="p-1 text-[#7E8B8B] hover:text-white transition-colors"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Send message"
                      className="w-7 h-7 rounded-full bg-[#272E2E] border border-[#3A4545] flex items-center justify-center text-white hover:bg-[#A3B18A] hover:text-[#0E1111] transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Micro Disclaimer */}
                <p id="session-disclaimer" className="text-[11px] text-[#5A6363] text-center mt-3 font-normal">
                  Mekai is AI and can make mistakes.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
