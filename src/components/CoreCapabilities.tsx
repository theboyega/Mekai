import { Scan } from 'lucide-react';

export function CoreCapabilities() {
  return (
    <section id="capabilities-section" className="py-16 sm:py-20 lg:py-24 border-t border-[#1C2121]/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div id="capabilities-header" className="mb-10 sm:mb-12">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#A3B18A] mb-3 font-heading">
            Core Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-[-0.02em] leading-tight">
            Engineered for<br className="hidden sm:inline" /> precision diagnostics.
          </h2>
        </div>

        {/* 3-Card Grid */}
        <div id="capabilities-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          
          {/* Card 1: OBD-II Fault Analysis (Sage Green Background) */}
          <div
            id="capability-card-obd"
            className="rounded-[22px] bg-[#A3B18A] text-[#0E1111] p-7 sm:p-8 flex flex-col justify-between min-h-[290px] transition-transform duration-300 hover:-translate-y-1 shadow-lg"
          >
            <div>
              {/* OBD-II Chip Icon */}
              <div className="w-11 h-11 mb-8 flex items-center justify-center text-[#0E1111]" aria-hidden="true">
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

          {/* Card 2: Acoustic Engine Diagnostics (Crisp White Background) */}
          <div
            id="capability-card-acoustic"
            className="rounded-[22px] bg-[#FFFFFF] text-[#0E1111] p-7 sm:p-8 flex flex-col justify-between min-h-[290px] transition-transform duration-300 hover:-translate-y-1 shadow-lg"
          >
            <div>
              {/* Acoustic Soundwave Icon */}
              <div className="w-11 h-11 mb-8 flex items-center justify-center text-[#0E1111]" aria-hidden="true">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h2" />
                  <path d="M6 8v8" />
                  <path d="M10 4v16" />
                  <path d="M14 6v12" />
                  <path d="M18 9v6" />
                  <path d="M22 12h-2" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-[#0E1111] mb-3 tracking-tight">
                Acoustic Engine Diagnostics
              </h3>
              <p className="text-sm text-[#3E4545] leading-relaxed font-medium">
                Analyze recordings of engine operating sounds to pinpoint the precise source of mechanical anomalies or wear.
              </p>
            </div>
          </div>

          {/* Card 3: Component image analysis (Obsidian Dark Background) */}
          <div
            id="capability-card-vision"
            className="rounded-[22px] bg-[#131616] border border-[#232828] text-white p-7 sm:p-8 flex flex-col justify-between min-h-[290px] transition-transform duration-300 hover:-translate-y-1 hover:border-[#313939] shadow-lg"
          >
            <div>
              {/* Component Scan Icon */}
              <div className="w-11 h-11 mb-8 flex items-center justify-center text-[#6A7676]" aria-hidden="true">
                <Scan className="w-8 h-8 stroke-[1.8]" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                Component image analysis
              </h3>
              <p className="text-sm text-[#8F9999] leading-relaxed font-normal">
                Evaluate photographs of mechanical parts and engine components to detect wear, damage, or failure points.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
