import { PhoneMockups } from './PhoneMockup';
import { ScrollReveal } from './ScrollReveal';

interface MobileAppSectionProps {
  onAppStoreClick?: () => void;
  onPlayStoreClick?: () => void;
}

export function MobileAppSection({ onAppStoreClick, onPlayStoreClick }: MobileAppSectionProps) {
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
                  onClick={onAppStoreClick}
                  className="px-6 py-3 md:px-7 md:py-3.5 min-h-[44px] md:min-h-[48px] rounded-full bg-[#131616] border border-[#2B3232] hover:border-[#A3B18A] hover:bg-[#181D1D] hover:-translate-y-0.5 active:scale-95 text-white font-medium text-sm md:text-base transition-all duration-200 inline-flex items-center gap-2.5 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] cursor-pointer"
                >
                  {/* Apple Logo SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white shrink-0">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.13.65-2.8 1.43-.58.67-1.1 1.74-1.02 2.81 1.08.08 2.2-.62 2.81-1.37z" />
                  </svg>
                  <span>App Store</span>
                </button>

                {/* Google Play Store Button */}
                <button
                  id="btn-play-store"
                  type="button"
                  onClick={onPlayStoreClick}
                  className="px-6 py-3 md:px-7 md:py-3.5 min-h-[44px] md:min-h-[48px] rounded-full bg-[#131616] border border-[#2B3232] hover:border-[#A3B18A] hover:bg-[#181D1D] hover:-translate-y-0.5 active:scale-95 text-white font-medium text-sm md:text-base transition-all duration-200 inline-flex items-center gap-2.5 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] cursor-pointer"
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

