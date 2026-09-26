import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FloorValidationProps {
  onSignUpClick?: () => void;
  isAuthenticated?: boolean;
}

export function FloorValidation({ onSignUpClick, isAuthenticated = false }: FloorValidationProps) {
  const metrics = [
    {
      id: 'efficiency',
      value: '5★',
      label: 'Shop floor efficiency',
    },
    {
      id: 'accuracy',
      value: '99.4%',
      label: 'Root-cause accuracy',
    },
    {
      id: 'velocity',
      value: '<30s',
      label: 'Diagnostic velocity',
    },
  ];

  return (
    <section id="validation-section" className="py-16 sm:py-20 lg:py-24 border-t border-[#1C2121]/60">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={480} delay={0}>
          <div id="validation-header" className="mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-[-0.02em] leading-tight">
              Validated on the<br className="hidden sm:inline" /> shop floor.
            </h2>
          </div>
        </ScrollReveal>

        {/* 4 Cards Grid: Full width across mobile, tablet, desktop, and ultra-wide */}
        <div id="validation-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 w-full">
          {/* 3 Metrics Cards */}
          {metrics.map((item, index) => (
            <ScrollReveal
              key={item.id}
              animation="fade-up"
              duration={480}
              delay={index * 80}
              className="h-full"
            >
              <div
                id={`stat-card-${item.id}`}
                className="h-full rounded-[22px] md:rounded-[26px] bg-[#131616] border border-[#222828] p-7 sm:p-8 md:p-9 flex flex-col justify-between min-h-[260px] md:min-h-[290px] transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl sm:text-[46px] md:text-5xl font-extrabold text-white tracking-tight font-heading">
                  {item.value}
                </div>
                <div className="text-sm md:text-base font-medium text-[#8F9999]">
                  {item.label}
                </div>
              </div>
            </ScrollReveal>
          ))}

          {/* 4th Card: Sage Green CTA Card */}
          <ScrollReveal animation="fade-up" duration={480} delay={240} className="h-full">
            <button
              id="stat-cta-card-signup"
              type="button"
              onClick={onSignUpClick}
              className="w-full h-full rounded-[22px] md:rounded-[26px] bg-[#A3B18A] p-7 sm:p-8 md:p-9 flex flex-col justify-between min-h-[260px] md:min-h-[290px] text-left transition-all duration-300 hover:bg-[#94A27B] hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] group shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E1111] leading-tight tracking-tight font-heading">
                Sign up now
              </div>

              <div className="self-start mt-6 md:mt-8">
                <div className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#0E1111] flex items-center justify-center text-[#A3B18A] transition-transform duration-200 group-hover:translate-x-1.5 shadow-sm">
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 stroke-[2.4]" />
                </div>
              </div>
            </button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

