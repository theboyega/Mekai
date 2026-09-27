import { PhoneMockups } from './PhoneMockup';
import { ScrollReveal } from './ScrollReveal';

export function MobileAppSection() {
  return (
    <section id="download-section" className="py-16 sm:py-20 lg:py-24 border-t border-[#1C2121]/60 overflow-visible w-full max-w-full relative">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Download Narrative & Store Links */}
          <div id="download-content" className="lg:col-span-6 w-full">
            <ScrollReveal animation="fade-up" duration={480} delay={0}>
              <p className="text-xs md:text-sm font-bold tracking-[0.18em] uppercase text-[#A3B18A] mb-3 font-heading">
                Download
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[44px] font-extrabold text-white tracking-[-0.02em] leading-tight mb-4 font-heading">
                Take mekai under<br className="hidden sm:inline" /> the bonnet.
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" duration={480} delay={80}>
              <p className="text-sm sm:text-base md:text-lg text-[#8F9999] leading-relaxed mb-8 max-w-xl">
                Record engine audio, capture components, and pull up repair history from anywhere in the shop.
                Available on iOS and Android.
              </p>
            </ScrollReveal>

            {/* App Store & Play Store Buttons */}
            <ScrollReveal animation="fade-up" duration={480} delay={140}>
              <div id="store-buttons" className="flex flex-wrap items-center gap-3.5 md:gap-4">
                {/* Apple App Store Button */}
                <button
                  id="btn-app-store"
                  type="button"
                  aria-disabled="true"
                  className="px-6 py-3 md:px-7 md:py-3.5 min-h-[44px] md:min-h-[48px] rounded-full bg-[#131616] border border-[#2B3232] hover:border-[#A3B18A] hover:bg-[#181D1D] text-white font-medium text-sm md:text-base transition-all duration-200 inline-flex items-center gap-2.5 shadow-sm focus:outline-none cursor-default"
                >
                  {/* Apple App Store "A" Logo SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-white shrink-0">
                    <path d="M12.95 4.2 5.4 17.28" />
                    <path d="M10.45 4.2 18.6 18.32" />
                    <path d="M4.2 14.5h11.3" />
                    <path d="M18.3 14.5h1.5" />
                    <path d="M4.35 19.1 3.7 20.2" />
                  </svg>
                  <span>App Store</span>
                </button>

                {/* Google Play Store Button */}
                <button
                  id="btn-play-store"
                  type="button"
                  aria-disabled="true"
                  className="px-6 py-3 md:px-7 md:py-3.5 min-h-[44px] md:min-h-[48px] rounded-full bg-[#131616] border border-[#2B3232] hover:border-[#A3B18A] hover:bg-[#181D1D] text-white font-medium text-sm md:text-base transition-all duration-200 inline-flex items-center gap-2.5 shadow-sm focus:outline-none cursor-default"
                >
                  {/* Google Play Logo SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white shrink-0">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a2.404 2.404 0 0 1-.61-.926V2.74c.18-.363.393-.68.609-.926zm11.267 11.268l2.25 2.25-10.748 6.205 8.498-8.455zm2.25-2.25l-2.25 2.25-8.498-8.455 10.748 6.205zm1.536.886l2.91 1.68a1.2 1.2 0 0 1 0 2.08l-2.91 1.68-2.173-2.17 2.173-2.27z" />
                  </svg>
                  <span>Play Store</span>
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: High-Fidelity Phone Mockups */}
          <div id="download-mockup-wrapper" className="lg:col-span-6 flex justify-center lg:justify-end w-full overflow-visible relative z-10">
            <ScrollReveal animation="fade-up" duration={550} delay={160}>
              <PhoneMockups />
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}

