import { Scan } from 'lucide-react';
import { Reveal } from './Reveal';

export function CoreCapabilities() {
  return (
    <section id="capabilities-section" className="py-16 sm:py-20 lg:py-24 border-t border-[#1C2121]/60">
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20">
        {/* Section Header */}
        <Reveal>
          <div id="capabilities-header" className="mb-10 sm:mb-12">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#A3B18A] mb-3 font-heading">
              Core Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-[-0.02em] leading-tight">
              Engineered for<br className="hidden sm:inline" /> precision diagnostics.
            </h2>
          </div>
        </Reveal>

        {/* 3-Card Grid */}
        <div id="capabilities-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          
          {/* Card 1: OBD-II Fault Analysis (Sage Green Background) */}
          <Reveal delay={0}>
            <div
              id="capability-card-obd"
              className="rounded-[22px] bg-[#A3B18A] text-[#0E1111] p-7 sm:p-8 flex flex-col justify-between min-h-[290px] h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(163,177,138,0.3)] shadow-lg group cursor-default"
            >
              <div>
                {/* OBD-II Chip Icon with micro pulse */}
                <div className="w-11 h-11 mb-8 flex items-center justify-center text-[#0E1111] transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="5" y="5" rx="3" />
                    <path d="M12 2v3" />
                    <path d="M12 19v3" />
                    <path d="M2 12h3" />
                    <path d="M19 12h3" />
                    <path d="m10 10 4 4" />
                    <path d="m14 10-4 4" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-[#0E1111] mb-3 tracking-tight">
                  OBD-II Fault Analysis
                </h3>
                <p className="text-sm text-[#202724] leading-relaxed font-medium">
                  Instantly interpret diagnostic trouble codes, trace root causes, and return clear, actionable diagnostics.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Acoustic Engine Diagnostics (Crisp White Background) */}
          <Reveal delay={120}>
            <div
              id="capability-card-acoustic"
              className="rounded-[22px] bg-[#FFFFFF] text-[#0E1111] p-7 sm:p-8 flex flex-col justify-between min-h-[290px] h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(255,255,255,0.2)] shadow-lg group cursor-default"
            >
              <div>
                {/* Acoustic Soundwave Icon with animated active waveform bars */}
                <div className="w-11 h-11 mb-8 flex items-center justify-center text-[#0E1111] transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
                  <div className="flex items-center gap-[3px] h-7">
                    <span className="w-[3px] bg-[#0E1111] rounded-full animate-wave-1 h-[25%]" />
                    <span className="w-[3px] bg-[#0E1111] rounded-full animate-wave-2 h-[75%]" />
                    <span className="w-[3px] bg-[#0E1111] rounded-full animate-wave-3 h-[40%]" />
                    <span className="w-[3px] bg-[#0E1111] rounded-full animate-wave-4 h-[90%]" />
                    <span className="w-[3px] bg-[#0E1111] rounded-full animate-wave-5 h-[30%]" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#0E1111] mb-3 tracking-tight">
                  Acoustic Engine Diagnostics
                </h3>
                <p className="text-sm text-[#3E4545] leading-relaxed font-medium">
                  Analyze recordings of engine operating sounds to pinpoint the precise source of mechanical anomalies or wear.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Card 3: Component image analysis (Obsidian Dark Background) */}
          <Reveal delay={240}>
            <div
              id="capability-card-vision"
              className="rounded-[22px] bg-[#131616] border border-[#232828] text-white p-7 sm:p-8 flex flex-col justify-between min-h-[290px] h-full transition-all duration-300 hover:-translate-y-1.5 hover:border-[#384343] hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] shadow-lg group cursor-default relative overflow-hidden"
            >
              <div>
                {/* Component Scan Icon with subtle laser reticle effect */}
                <div className="w-11 h-11 mb-8 flex items-center justify-center text-[#6A7676] group-hover:text-[#A3B18A] transition-all duration-300 group-hover:scale-105 relative" aria-hidden="true">
                  <Scan className="w-8 h-8 stroke-[1.8]" />
                  <span className="absolute inset-0 border-t border-[#A3B18A]/60 animate-scan-line pointer-events-none" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
                  Component image analysis
                </h3>
                <p className="text-sm text-[#8F9999] leading-relaxed font-normal">
                  Evaluate photographs of mechanical parts and engine components to detect wear, damage, or failure points.
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
