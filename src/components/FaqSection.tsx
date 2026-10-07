import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'what-is-mekai',
    question: 'What is Mekai?',
    answer:
      'Mekai is a proprietary multimodal AI automotive diagnostic assistant that diagnoses vehicle issues by analyzing acoustic engine sounds, component images, and OBD-II trouble codes.',
  },
  {
    id: 'acoustic-anomaly-detection',
    question: 'How does Mekai’s acoustic anomaly detection work?',
    answer:
      'You can record or upload audio clips of your engine or running components. Mekai\'s AI analyzes acoustic signatures to pinpoint mechanical issues like valve train noise, belt wear, or internal knocks before they cause major failures.',
  },
  {
    id: 'analyze-photos',
    question: 'Can Mekai analyze photos of damaged car parts?',
    answer:
      'Yes. Mekai features multimodal image processing, allowing you to upload photos of worn belts, fluid leaks, damaged gaskets, or engine bays for instant visual identification and wear assessment.',
  },
  {
    id: 'step-by-step-guides',
    question: 'Does Mekai provide step-by-step repair guides?',
    answer:
      'Yes. Once an issue is diagnosed, Mekai generates clear, step-by-step repair instructions tailored to the specific fault code or component failure to guide you safely through the fix.',
  },
  {
    id: 'documents-generated',
    question: 'What documents can Mekai generate?',
    answer:
      'Upon request, Mekai compiles comprehensive technical reports for engineers, vehicle inspection report (MPI) for customers, combining trouble codes, acoustic inspection data, visual analyses, and repair procedures. It can also generate on-demand cost estimates and customer invoices.',
  },
  {
    id: 'internet-connection',
    question: 'Do I need an internet connection to use Mekai?',
    answer:
      'Yes, an internet connection is required to run Mekai, process multimodal diagnostic requests, and sync live data with your workspace and ecosystem integrations.',
  },
  {
    id: 'torkara-integration',
    question: 'How does the Torkara integration bridge with Mekai?',
    answer:
      'Once Mekai diagnoses a faulty component and outlines the required repair steps, it automatically connects with your linked Torkara account to queue and procure the exact replacement parts.',
  },
  {
    id: 'obd-ii-dtcs',
    question: 'How does Mekai handle OBD-II diagnostic trouble codes (DTCs)?',
    answer:
      'Mekai reads, decodes, and contextualizes standard and manufacturer-specific DTCs, translating raw error codes into clear explanations paired with actionable repair steps.',
  },
  {
    id: 'who-develops-maintains',
    question: 'Who develops and maintains Mekai?',
    answer:
      'Mekai is engineered and maintained by Cestcore Inc. as part of an integrated ecosystem alongside the Torkara spare parts marketplace.',
  },
];

export function FaqSection() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faq-section" className="py-16 sm:py-20 lg:py-24 border-t border-[#1C2121]/60">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={480} delay={0}>
          <div id="faq-header" className="mb-10 sm:mb-12 max-w-3xl">
            <p className="text-xs md:text-sm font-bold tracking-[0.18em] uppercase text-[#A3B18A] mb-3 font-heading">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-[-0.02em] leading-tight font-heading">
              Common questions<br className="hidden sm:inline" /> about Mekai.
            </h2>
          </div>
        </ScrollReveal>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl space-y-3.5 sm:space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = Boolean(openItems[item.id]);

            return (
              <ScrollReveal
                key={item.id}
                animation="fade-up"
                duration={450}
                delay={Math.min(index * 40, 240)}
              >
                <div
                  className={`rounded-[20px] md:rounded-[24px] bg-[#131616] border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-[#A3B18A]/35 bg-[#151919] shadow-lg'
                      : 'border-[#222828] hover:border-[#333C3C]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-btn-${item.id}`}
                    className="w-full p-5 sm:p-6 md:p-7 flex items-center justify-between text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A]/50 gap-4"
                  >
                    <span className="font-heading font-bold text-base sm:text-lg md:text-xl text-white tracking-tight leading-snug">
                      {item.question}
                    </span>
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-[#A3B18A] text-[#0E1111] rotate-180'
                          : 'bg-[#1C2222] text-[#8F9999]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${item.id}`}
                      className="px-5 pb-5 sm:px-6 sm:pb-6 md:px-7 md:pb-7 pt-0 text-sm sm:text-base text-[#9EA8A8] leading-relaxed border-t border-[#1F2525]/80 mt-1"
                    >
                      <p className="pt-4">{item.answer}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
