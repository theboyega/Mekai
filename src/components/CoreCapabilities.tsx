import { Scan, CircleGauge } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function CoreCapabilities() {
  return (
    <section id="capabilities-section" className="py-16 sm:py-20 lg:py-24 border-t border-[#1C2121]/60">
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={480} delay={0}>
          <div id="capabilities-header" className="mb-10 sm:mb-12">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#A3B18A] mb-3 font-heading">
              Core Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-[-0.02em] leading-tight">
              Engineered for<br className="hidden sm:inline" /> precision diagnostics.
            </h2>
          </div>
        </ScrollReveal>

        {/* 3-Card Grid: Single column for mobile and tablet, 3-column on desktop */}
        <div id="capabilities-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 max-w-xl md:max-w-2xl lg:max-w-none mx-auto">
          
          {/* Card 1: OBD-II Fault Analysis (Sage Green Background) */}
          <ScrollReveal animation="fade-up" duration={480} delay={80} className="h-full">
            <div
              id="capability-card-obd"
              className="h-full rounded-[22px] md:rounded-[26px] bg-[#A3B18A] text-[#0E1111] p-7 sm:p-8 md:p-9 flex flex-col justify-between min-h-[260px] md:min-h-[290px] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <div>
                {/* OBD-II Diagnostic Telemetry / Fault Icon */}
                <div className="w-11 h-11 md:w-13 md:h-13 mb-6 md:mb-8 flex items-center justify-center text-[#0E1111]" aria-hidden="true">
                  <CircleGauge className="w-8 h-8 md:w-9 md:h-9 stroke-2" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-[#0E1111] mb-3 tracking-tight font-heading">
                  OBD-II Fault Analysis
                </h3>
                <p className="text-sm md:text-base text-[#202724] leading-relaxed font-medium">
                  Instantly interpret diagnostic trouble codes, trace root causes, and return clear, actionable diagnostics.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Acoustic Engine Diagnostics (Crisp White Background) */}
          <ScrollReveal animation="fade-up" duration={480} delay={160} className="h-full">
            <div
              id="capability-card-acoustic"
              className="h-full rounded-[22px] md:rounded-[26px] bg-[#FFFFFF] text-[#0E1111] p-7 sm:p-8 md:p-9 flex flex-col justify-between min-h-[260px] md:min-h-[290px] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <div>
                {/* Acoustic Soundwave Icon */}
                <div className="w-11 h-11 md:w-13 md:h-13 mb-6 md:mb-8 flex items-center justify-center text-[#0E1111]" aria-hidden="true">
                  <svg
                    className="w-8 h-8 md:w-9 md:h-9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12h2" />
                    <path d="M6 8v8" />
                    <path d="M10 4v16" />
                    <path d="M14 6v12" />
                    <path d="M18 9v6" />
                    <path d="M22 12h-2" />
                  </svg>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-[#0E1111] mb-3 tracking-tight font-heading">
                  Acoustic Engine Diagnostics
                </h3>
                <p className="text-sm md:text-base text-[#3E4545] leading-relaxed font-medium">
                  Analyze recordings of engine operating sounds to pinpoint the precise source of mechanical anomalies or wear.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Component image analysis (Obsidian Dark Background) */}
          <ScrollReveal animation="fade-up" duration={480} delay={240} className="h-full">
            <div
              id="capability-card-vision"
              className="h-full rounded-[22px] md:rounded-[26px] bg-[#131616] border border-[#232828] text-white p-7 sm:p-8 md:p-9 flex flex-col justify-between min-h-[260px] md:min-h-[290px] transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl"
            >
              <div>
                {/* Component Scan Icon */}
                <div className="w-11 h-11 md:w-13 md:h-13 mb-6 md:mb-8 flex items-center justify-center text-[#6A7676]" aria-hidden="true">
                  <Scan className="w-8 h-8 md:w-9 md:h-9 stroke-2" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight font-heading">
                  Component image analysis
                </h3>
                <p className="text-sm md:text-base text-[#8F9999] leading-relaxed font-normal">
                  Evaluate photographs of mechanical parts and engine components to detect wear, damage, or failure points.
                </p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}

