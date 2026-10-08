import { Scan, Cpu, AudioLines } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function CoreCapabilities() {
  return (
    <section id="capabilities-section" className="py-16 sm:py-20 lg:py-24 border-t border-[#1C2121]/60">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
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

        {/* 3-Card Grid: Full width on mobile, tablet, desktop, and ultra-wide */}
        <div id="capabilities-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 w-full items-stretch">
          
          {/* Card 1: OBD-II Fault Analysis (Sage Green Background) */}
          <ScrollReveal animation="fade-up" duration={480} delay={80} className="h-full">
            <div
              id="capability-card-obd"
              className="h-full rounded-[22px] md:rounded-[26px] bg-[#A3B18A] text-[#0E1111] border border-transparent p-6 sm:p-7 md:p-8 lg:px-5 lg:py-7 xl:p-8 2xl:p-9 flex flex-col justify-start min-h-[260px] md:min-h-[290px] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              {/* OBD-II CPU / Chip Diagnostic Icon */}
              <div className="w-11 h-11 md:w-12 md:h-12 mb-6 md:mb-8 flex items-center justify-center text-[#0E1111]" aria-hidden="true">
                <Cpu className="w-8 h-8 md:w-9 md:h-9 stroke-2 shrink-0" />
              </div>

              <h3 className="text-lg sm:text-xl lg:text-[17px] xl:text-[20px] 2xl:text-2xl font-bold text-[#0E1111] mb-3 tracking-tight font-heading whitespace-nowrap">
                OBD-II Fault Analysis
              </h3>
              <p className="text-sm md:text-base text-[#202724] leading-relaxed font-normal">
                Instantly interpret diagnostic trouble codes, trace root causes, and return clear, actionable diagnostics.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 2: Acoustic Engine Diagnostics (Crisp White Background) */}
          <ScrollReveal animation="fade-up" duration={480} delay={160} className="h-full">
            <div
              id="capability-card-acoustic"
              className="h-full rounded-[22px] md:rounded-[26px] bg-[#FFFFFF] text-[#0E1111] border border-transparent p-6 sm:p-7 md:p-8 lg:px-5 lg:py-7 xl:p-8 2xl:p-9 flex flex-col justify-start min-h-[260px] md:min-h-[290px] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              {/* Acoustic Soundwave Icon */}
              <div className="w-11 h-11 md:w-12 md:h-12 mb-6 md:mb-8 flex items-center justify-center text-[#0E1111]" aria-hidden="true">
                <AudioLines className="w-8 h-8 md:w-9 md:h-9 stroke-2 shrink-0" />
              </div>

              <h3 className="text-lg sm:text-xl lg:text-[17px] xl:text-[20px] 2xl:text-2xl font-bold text-[#0E1111] mb-3 tracking-tight font-heading whitespace-nowrap">
                Acoustic Engine Diagnostics
              </h3>
              <p className="text-sm md:text-base text-[#3E4545] leading-relaxed font-normal">
                Analyze recordings of engine operating sounds to pinpoint the precise source of mechanical anomalies or wear.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 3: Component Image Analysis (Obsidian Dark Background) */}
          <ScrollReveal animation="fade-up" duration={480} delay={240} className="h-full">
            <div
              id="capability-card-vision"
              className="h-full rounded-[22px] md:rounded-[26px] bg-[#131616] border border-[#232828] text-white p-6 sm:p-7 md:p-8 lg:px-5 lg:py-7 xl:p-8 2xl:p-9 flex flex-col justify-start min-h-[260px] md:min-h-[290px] transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl"
            >
              {/* Component Scan Icon */}
              <div className="w-11 h-11 md:w-12 md:h-12 mb-6 md:mb-8 flex items-center justify-center text-white" aria-hidden="true">
                <Scan className="w-8 h-8 md:w-9 md:h-9 stroke-2 shrink-0" />
              </div>

              <h3 className="text-lg sm:text-xl lg:text-[17px] xl:text-[20px] 2xl:text-2xl font-bold text-white mb-3 tracking-tight font-heading whitespace-nowrap">
                Component Image Analysis
              </h3>
              <p className="text-sm md:text-base text-[#8F9999] leading-relaxed font-normal">
                Evaluate photographs of mechanical parts and engine components to detect wear, damage, or failure points.
              </p>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}

