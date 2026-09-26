import { MekaiLogo } from './MekaiLogo';
import { Search, Plus, Mic, X, ExternalLink, Settings } from 'lucide-react';

export function PhoneMockups() {
  return (
    <div
      id="phones-container"
      className="w-full max-w-[430px] sm:max-w-none flex items-center justify-between sm:justify-end gap-3 sm:gap-6 mx-auto lg:mx-0 group/phones"
    >
      {/* Phone 1: Ready For Diagnostics View */}
      <div
        id="phone-mockup-chat"
        className="w-[calc(50%-6px)] sm:w-[200px] md:w-[215px] lg:w-[225px] h-[340px] min-[375px]:h-[365px] min-[400px]:h-[395px] sm:h-[420px] md:h-[450px] bg-[#0E1111] rounded-[26px] min-[375px]:rounded-[30px] sm:rounded-[38px] p-2 sm:p-2.5 border-[1.5px] sm:border-2 border-[#A3B18A]/30 shadow-2xl relative z-10 flex flex-col justify-between shrink-0 transition-colors duration-300 hover:border-[#A3B18A]/60"
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-2.5 sm:h-3 bg-[#1A1F1F] border border-[#A3B18A]/20 rounded-full flex items-center justify-center gap-1 z-20">
          <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#A3B18A]/60" />
        </div>

        {/* Screen Content Wrapper */}
        <div className="w-full h-full bg-[#121515] rounded-[20px] min-[375px]:rounded-[24px] sm:rounded-[30px] flex flex-col justify-between p-2.5 min-[375px]:p-3 sm:p-3.5 pt-4 min-[375px]:pt-5 sm:pt-7 border border-[#A3B18A]/20 overflow-hidden select-none text-[#A3B18A]">
          {/* Top Bar inside Screen */}
          <div className="flex items-center justify-between">
            <MekaiLogo iconSize={13} textSize="text-[8.5px] min-[375px]:text-[9.5px] sm:text-[10px] tracking-wider" />
            <div className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5 rounded-full bg-[#A3B18A] flex items-center justify-center text-[7.5px] sm:text-[9px] text-[#0E1111] font-bold">
              A
            </div>
          </div>

          {/* Centered Greeting */}
          <div className="text-center px-0.5 my-auto">
            <p className="text-[10.5px] min-[375px]:text-xs sm:text-xs text-[#A3B18A] font-medium leading-tight sm:leading-relaxed">
              Ready for diagnostics,<br />
              <span className="text-[#A3B18A] font-semibold">Adeyemi?</span>
            </p>
          </div>

          {/* Bottom Chat Pill Mock */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="bg-[#1A1F1F] border border-[#A3B18A]/30 rounded-full px-2 min-[375px]:px-2.5 py-1 min-[375px]:py-1.5 flex items-center justify-between text-[8px] min-[375px]:text-[9px] sm:text-[10px] text-[#A3B18A]">
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                <Plus className="w-2.5 h-2.5 min-[375px]:w-3 min-[375px]:h-3 text-[#A3B18A] shrink-0" />
                <span className="text-[#A3B18A] truncate">Ask Mekai</span>
              </div>
              <Mic className="w-2.5 h-2.5 min-[375px]:w-3 min-[375px]:h-3 text-[#A3B18A] shrink-0" />
            </div>

            {/* Home Indicator bar */}
            <div className="w-9 sm:w-12 h-0.5 sm:h-1 bg-[#A3B18A]/40 rounded-full mx-auto" />
          </div>
        </div>
      </div>

      {/* Phone 2: Navigation Drawer View */}
      <div
        id="phone-mockup-drawer"
        className="w-[calc(50%-6px)] sm:w-[200px] md:w-[215px] lg:w-[225px] h-[340px] min-[375px]:h-[365px] min-[400px]:h-[395px] sm:h-[420px] md:h-[450px] bg-[#0E1111] rounded-[26px] min-[375px]:rounded-[30px] sm:rounded-[38px] p-2 sm:p-2.5 border-[1.5px] sm:border-2 border-[#A3B18A]/30 shadow-2xl relative z-10 flex flex-col justify-between shrink-0 transition-colors duration-300 hover:border-[#A3B18A]/60"
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-2.5 sm:h-3 bg-[#1A1F1F] border border-[#A3B18A]/20 rounded-full flex items-center justify-center gap-1 z-20">
          <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#A3B18A]/60" />
        </div>

        {/* Screen Content Wrapper */}
        <div className="w-full h-full bg-[#121515] rounded-[20px] min-[375px]:rounded-[24px] sm:rounded-[30px] flex flex-col justify-between p-2.5 min-[375px]:p-3 sm:p-3.5 pt-4 min-[375px]:pt-5 sm:pt-7 border border-[#A3B18A]/20 overflow-hidden select-none text-[#A3B18A]">
          {/* Top Bar with Close Icon */}
          <div>
            <div className="flex items-center justify-between mb-3 min-[375px]:mb-4 sm:mb-5">
              <MekaiLogo iconSize={13} textSize="text-[8.5px] min-[375px]:text-[9.5px] sm:text-[10px] tracking-wider" />
              <button type="button" aria-label="Close" className="text-[#A3B18A]">
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {/* Drawer Menu Items */}
            <div className="space-y-2 sm:space-y-3 text-[8.5px] min-[375px]:text-[9.5px] sm:text-[11px] text-[#A3B18A]">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#A3B18A] font-medium cursor-pointer">
                <ExternalLink className="w-2.5 h-2.5 min-[375px]:w-3 min-[375px]:h-3 text-[#A3B18A] shrink-0" />
                <span className="truncate">New Diagnostics</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#A3B18A] cursor-pointer">
                <Search className="w-2.5 h-2.5 min-[375px]:w-3 min-[375px]:h-3 text-[#A3B18A] shrink-0" />
                <span className="truncate">Search Chats</span>
              </div>

              <div className="pt-1.5 sm:pt-2">
                <p className="text-[7px] min-[375px]:text-[8px] sm:text-[9px] uppercase tracking-wider text-[#A3B18A] font-bold mb-0.5 sm:mb-1">
                  Recents ▾
                </p>
                <div className="text-[8px] min-[375px]:text-[9px] sm:text-[10px] text-[#A3B18A] pl-1.5 sm:pl-2 border-l border-[#A3B18A]/40 space-y-1">
                  <div className="truncate">BMW N55 VANOS fault</div>
                  <div className="truncate">Ford 6.7L Turbo flutter</div>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Footer */}
          <div>
            <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-[#A3B18A]/20 text-[8px] min-[375px]:text-[9px] sm:text-[10px] text-[#A3B18A]">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 rounded-full bg-[#A3B18A] text-[#0E1111] flex items-center justify-center font-bold text-[8.5px] sm:text-[9.5px] shrink-0 leading-none">
                  A
                </div>
                <span className="truncate font-medium text-[#A3B18A]">Adeyemi Tomiwa</span>
              </div>
              <Settings className="w-2.5 h-2.5 min-[375px]:w-3 min-[375px]:h-3 text-[#A3B18A] shrink-0" />
            </div>

            {/* Home Indicator bar */}
            <div className="w-9 sm:w-12 h-0.5 sm:h-1 bg-[#A3B18A]/40 rounded-full mx-auto mt-1.5 sm:mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
