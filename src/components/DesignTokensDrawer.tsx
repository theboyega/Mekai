import { useState } from 'react';
import { Sliders, X, Check, Copy } from 'lucide-react';

export function DesignTokensDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const tokens = {
    colors: [
      { name: 'Obsidian Black (Canvas)', hex: '#0E1111', role: 'Primary background canvas' },
      { name: 'Crisp White', hex: '#FFFFFF', role: 'Headlines, primary copy, card 2 bg' },
      { name: 'Muted Sage Green', hex: '#A3B18A', role: 'Brand accent, primary CTAs, card 1 bg' },
      { name: 'Surface Dark', hex: '#121515', role: 'Cards, mockup chassis, dropdowns' },
      { name: 'Surface Elevated', hex: '#1A1F1F', role: 'Input bars, pill controls' },
      { name: 'Border Subdued', hex: '#222828', role: 'Structural dividing borders' },
      { name: 'Text Secondary', hex: '#8F9999', role: 'Body copy, descriptions' },
      { name: 'Text Muted', hex: '#5A6363', role: 'Disclaimers, copyright, micro-copy' },
    ],
    typography: [
      { level: 'Font Pairing', spec: 'Headings & CTAs: Montserrat | Descriptions & Body: Inter' },
      { level: 'Hero H1 (Montserrat)', spec: '54px (desktop) / 36px (mobile) | Weight 800 | Leading 1.08 | Tracking -0.03em' },
      { level: 'Section H2 (Montserrat)', spec: '40px–44px | Weight 800 | Leading 1.15 | Tracking -0.02em' },
      { level: 'Card Title H3 (Montserrat)', spec: '20px–22px | Weight 700 | Leading 1.25 | Tracking -0.01em' },
      { level: 'Metric Displays (Montserrat)', spec: '44px–48px | Weight 800 | Tracking -0.02em' },
      { level: 'Eyebrows / Overlines (Montserrat)', spec: '12px | Weight 700 | Tracking 0.18em (Uppercase)' },
      { level: 'Body Regular (Inter)', spec: '14px–16px | Weight 400–500 | Leading 1.6' },
      { level: 'Micro Disclaimers (Inter)', spec: '11px | Weight 400 | Text-center' },
    ],
    spacing: [
      { name: 'Section Vertical Padding', value: 'py-16 sm:py-20 lg:py-24 (80px–96px)' },
      { name: 'Container Width', value: 'w-full (Full Width Edge-to-Edge)' },
      { name: 'Container Horizontal Padding', value: 'px-6 sm:px-10 lg:px-14 xl:px-20 (24px–80px)' },
      { name: 'Card Internal Padding', value: 'p-7 sm:p-8 (28px–32px)' },
      { name: 'Grid Gaps', value: 'gap-6 lg:gap-7 (24px–28px)' },
      { name: 'Corner Radii', value: 'Cards: rounded-[22px] (22px) | Buttons: rounded-full' },
    ],
    structure: [
      { section: '1. Navigation Header', desc: 'Sticky top-0 with subtle blur, logo, sign-up link & login pill.' },
      { section: '2. Hero Section', desc: 'Left headline + subtext + CTAs; Right Diagnostic Session chat mockup.' },
      { section: '3. Core Capabilities', desc: 'Sage Green (OBD-II), Crisp White (Acoustic), Obsidian (Vision).' },
      { section: '4. Workflow Architecture', desc: '3-stage pipeline: CAPTURE → REASON → EXECUTE.' },
      { section: '5. Floor Validation', desc: 'Efficiency (5★), Accuracy (99.4%), Velocity (<30s) + Sign-up CTA card.' },
      { section: '6. Mobile App Download', desc: 'Store download buttons + two realistic smartphone UI mockups.' },
      { section: '7. Global Footer', desc: 'Brand info, social channels, Company links, Legal links, & copyright.' },
    ],
  };

  return (
    <>
      {/* Floating Inspector Toggle Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#121515] border border-[#2B3333] hover:border-[#A3B18A] text-xs font-semibold text-[#A3B18A] shadow-xl hover:shadow-[#A3B18A]/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A]"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Tokens & Architecture</span>
        </button>
      </div>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tokens-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
        >
          <div
            className="w-full max-w-xl h-full bg-[#0E1111] border-l border-[#222828] p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#1C2121]">
                <div>
                  <h3 id="tokens-drawer-title" className="text-lg font-bold text-white">
                    Design Tokens & Architecture
                  </h3>
                  <p className="text-xs text-[#8F9999] mt-0.5">
                    Minimalist, high-contrast dark aesthetic specifications
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close drawer"
                  className="w-8 h-8 rounded-full bg-[#161A1A] border border-[#252B2B] flex items-center justify-center text-[#8F9999] hover:text-white hover:border-[#A3B18A] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Color Tokens */}
              <div className="py-6 border-b border-[#1C2121]">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#A3B18A] mb-4">
                  Exact Color Palette
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {tokens.colors.map((c) => (
                    <div
                      key={c.hex + c.name}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#141818] border border-[#1E2424] text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-md border border-white/20 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div>
                          <span className="font-semibold text-white block">{c.name}</span>
                          <span className="text-[#7A8585] text-[11px]">{c.role}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(c.hex, c.hex)}
                        className="flex items-center gap-1 font-mono text-[#A3B18A] hover:text-white px-2 py-1 rounded bg-[#1A2020]"
                      >
                        <span>{c.hex}</span>
                        {copiedKey === c.hex ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography Tokens */}
              <div className="py-6 border-b border-[#1C2121]">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#A3B18A] mb-4">
                  Typography Hierarchy (Montserrat + Inter)
                </h4>
                <div className="space-y-3">
                  {tokens.typography.map((t) => (
                    <div key={t.level} className="p-3 rounded-xl bg-[#141818] border border-[#1E2424]">
                      <span className="text-xs font-bold text-white block mb-0.5">{t.level}</span>
                      <span className="text-[11px] text-[#8F9999] font-mono leading-relaxed block">{t.spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spacing & Geometry */}
              <div className="py-6 border-b border-[#1C2121]">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#A3B18A] mb-4">
                  Spacing Matrix & Geometry
                </h4>
                <div className="space-y-2.5">
                  {tokens.spacing.map((s) => (
                    <div key={s.name} className="flex justify-between items-center p-2.5 rounded-xl bg-[#141818] border border-[#1E2424] text-xs">
                      <span className="font-medium text-white">{s.name}</span>
                      <span className="font-mono text-[#8F9999] text-[11px]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout Grid & Structure */}
              <div className="py-6">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#A3B18A] mb-4">
                  Sectional Layout Breakdown
                </h4>
                <div className="space-y-2">
                  {tokens.structure.map((item) => (
                    <div key={item.section} className="p-2.5 rounded-xl bg-[#141818] border border-[#1E2424] text-xs">
                      <span className="font-semibold text-white block">{item.section}</span>
                      <span className="text-[#8F9999] text-[11px]">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-[#1C2121] flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-full bg-[#A3B18A] text-[#0E1111] font-semibold text-xs hover:bg-[#92A177]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
