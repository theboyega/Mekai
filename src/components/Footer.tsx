import { MekaiLogo } from './MekaiLogo';

export function Footer() {
  const companyLinks = [
    { label: 'Docs', href: '#docs' },
    { label: 'Careers', href: '#careers' },
    { label: 'Press', href: '#press' },
    { label: 'Help', href: '#help' },
    { label: 'Status', href: '#status' },
  ];

  const legalLinks = [
    { label: 'Terms', href: '#terms' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'Licenses', href: '#licenses' },
  ];

  return (
    <footer id="main-footer" className="pt-16 sm:pt-20 pb-12 border-t border-[#1C2121]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16">
          
          {/* Left Column: Brand, Mission, & Socials */}
          <div className="md:col-span-6 lg:col-span-7">
            <a href="#" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] rounded">
              <MekaiLogo iconSize={30} textSize="text-xl tracking-widest" />
            </a>

            <p className="mt-4 text-sm text-[#8F9999] max-w-sm leading-relaxed font-normal">
              Diagnostic intelligence for the modern workshop. A product of Cestcore Limited.
            </p>

            {/* Social Icons (X, Instagram, LinkedIn, TikTok) */}
            <div id="social-links" className="flex items-center gap-4 mt-6 text-[#8F9999]">
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Mekai on X"
                className="hover:text-white transition-colors p-1"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Mekai on Instagram"
                className="hover:text-white transition-colors p-1"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Connect with Mekai on LinkedIn"
                className="hover:text-white transition-colors p-1"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Mekai on TikTok"
                className="hover:text-white transition-colors p-1"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.02 2.9-.01 5.8-.02 8.7a7.6 7.6 0 0 1-2.15 5.28c-1.4 1.36-3.32 2.13-5.27 2.14-3.56.09-6.84-2.31-7.66-5.78-.96-3.95 1.51-7.98 5.48-8.77.72-.15 1.46-.2 2.2-.18.01 1.46.01 2.91.01 4.37-.36-.07-.74-.08-1.11-.04-1.68.17-3.09 1.37-3.41 3.01-.41 2.04 1.05 4.09 3.08 4.35 1.72.23 3.42-.76 3.96-2.39.18-.55.24-1.13.24-1.7V.02h-2.48z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Middle Column: Company */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-white/90 mb-5">
              Company
            </h4>
            <ul className="space-y-3.5 text-sm text-[#8F9999]">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Legal */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-white/90 mb-5">
              Legal
            </h4>
            <ul className="space-y-3.5 text-sm text-[#8F9999]">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Horizontal Line and Copyright */}
        <div className="pt-8 border-t border-[#1C2121] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-[#677171] font-normal">
            © 2026 Cestcore Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
