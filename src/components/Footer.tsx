import { MekaiLogo } from './MekaiLogo';
import { ScrollReveal } from './ScrollReveal';
import { useRouter } from '../context/RouterContext';

interface FooterProps {
  onNavigatePage?: (page: string) => void;
}

export function Footer({ onNavigatePage }: FooterProps) {
  const router = useRouter();

  const companyLinks = [
    { label: 'Docs', id: 'docs', href: '/docs' },
    { label: 'Careers', id: 'careers', href: '/careers' },
    { label: 'Press', id: 'press', href: '/press' },
    { label: 'Help', id: 'help', href: '/help' },
    { label: 'Status', id: 'status', href: '/status' },
  ];

  const legalLinks = [
    { label: 'Terms', id: 'terms', href: '/terms' },
    { label: 'Privacy', id: 'privacy', href: '/privacy' },
    { label: 'Licenses', id: 'licenses', href: '/licenses' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, pageId: string) => {
    e.preventDefault();
    if (onNavigatePage) {
      onNavigatePage(pageId);
    } else {
      router.navigate(pageId === 'home' ? '/' : `/${pageId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigatePage) {
      onNavigatePage('home');
    } else {
      router.navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="pt-16 sm:pt-20 pb-12 border-t border-[#1C2121] bg-[#0E1111]">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <ScrollReveal animation="fade-up" duration={480} delay={0}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 pb-16 w-full">
            
            {/* Left Column: Brand, Mission, & Socials */}
            <div className="sm:col-span-2 lg:col-span-7">
              <a
                href="#"
                onClick={handleLogoClick}
                className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] rounded cursor-pointer"
                aria-label="Mekai Homepage"
              >
                <MekaiLogo iconSize={32} textSize="text-xl md:text-2xl tracking-widest" />
              </a>

              <p className="mt-4 text-sm md:text-base text-[#8F9999] max-w-sm md:max-w-md leading-relaxed font-normal">
                Intelligent diagnostics powered by acoustic analysis, component imaging, and real-time OBD-II decoding.
              </p>

              {/* Social Icons (X, Instagram, LinkedIn, TikTok) */}
              <div id="social-links" className="flex flex-row flex-nowrap items-center gap-3 sm:gap-4 mt-6 text-[#8F9999]">
                {/* X / Twitter */}
                <a
                  href="https://x.com/mekai_ai?s=11"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Mekai on X"
                  className="hover:text-[#A3B18A] hover:bg-[#A3B18A]/[0.08] rounded-full transition-all duration-200 p-2 hover:-translate-y-0.5 inline-flex items-center justify-center shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/mekai_ai_?stkn=Yzh6c2FkZDN2MGho&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Mekai on Instagram"
                  className="hover:text-[#A3B18A] hover:bg-[#A3B18A]/[0.08] rounded-full transition-all duration-200 p-2 hover:-translate-y-0.5 inline-flex items-center justify-center shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/mekai-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with Mekai on LinkedIn"
                  className="hover:text-[#A3B18A] hover:bg-[#A3B18A]/[0.08] rounded-full transition-all duration-200 p-2 hover:-translate-y-0.5 inline-flex items-center justify-center shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="-translate-y-[1.5px]">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Mekai on TikTok"
                  className="hover:text-[#A3B18A] hover:bg-[#A3B18A]/[0.08] rounded-full transition-all duration-200 p-2 hover:-translate-y-0.5 inline-flex items-center justify-center shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.02 2.9-.01 5.8-.02 8.7a7.6 7.6 0 0 1-2.15 5.28c-1.4 1.36-3.32 2.13-5.27 2.14-3.56.09-6.84-2.31-7.66-5.78-.96-3.95 1.51-7.98 5.48-8.77.72-.15 1.46-.2 2.2-.18.01 1.46.01 2.91.01 4.37-.36-.07-.74-.08-1.11-.04-1.68.17-3.09 1.37-3.41 3.01-.41 2.04 1.05 4.09 3.08 4.35 1.72.23 3.42-.76 3.96-2.39.18-.55.24-1.13.24-1.7V.02h-2.48z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Middle Column: Company */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-[#A3B18A] font-heading mb-4 md:mb-5">
                Company
              </h4>
              <ul className="space-y-3 md:space-y-3.5 text-sm md:text-base text-[#8F9999]">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.id)}
                      className="hover:text-[#A3B18A] transition-colors duration-200 cursor-pointer inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Legal */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-[#A3B18A] font-heading mb-4 md:mb-5">
                Legal
              </h4>
              <ul className="space-y-3 md:space-y-3.5 text-sm md:text-base text-[#8F9999]">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.id)}
                      className="hover:text-[#A3B18A] transition-colors duration-200 cursor-pointer inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </ScrollReveal>

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
