import { ScrollReveal } from './ScrollReveal';

export function WorkflowArchitecture() {
  const steps = [
    {
      step: 'CAPTURE',
      title: 'Feed Mekai the evidence',
      description:
        'Enter trouble codes, record the engine, snap a photo of the component, or just describe the symptom in the chat.',
    },
    {
      step: 'REASON',
      title: 'It thinks like a master tech',
      description:
        'Mekai correlates codes, acoustics, imagery, and prior session history to isolate the most probable root cause.',
    },
    {
      step: 'EXECUTE',
      title: 'Follow the exact procedure',
      description:
        'Receive an ordered repair plan with torque specs and localized parts sourcing, ready for the shop floor.',
    },
  ];

  return (
    <section id="workflow-section" className="py-16 sm:py-20 lg:py-24 border-t border-[#1C2121]/60">
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={480} delay={0}>
          <div id="workflow-header" className="mb-10 sm:mb-12">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#A3B18A] mb-3 font-heading">
              Workflow Architecture
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-[-0.02em] leading-tight">
              From raw data to<br className="hidden sm:inline" /> repair directive.
            </h2>
          </div>
        </ScrollReveal>

        {/* 3 Steps Grid */}
        <div id="workflow-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {steps.map((item, index) => (
            <ScrollReveal
              key={item.step}
              animation="fade-up"
              duration={480}
              delay={index * 90}
              className="h-full"
            >
              <div
                id={`workflow-card-${index + 1}`}
                className="h-full rounded-[22px] bg-[#131616] border border-[#222828] p-7 sm:p-8 flex flex-col justify-start min-h-[220px] transition-all duration-300 hover:border-[#333C3C] hover:bg-[#151919]"
              >
                <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#A3B18A] mb-5 block font-heading">
                  {item.step}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-[#8F9999] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

