interface MekaiLogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  textSize?: string;
  iconColor?: string;
  textColor?: string;
}

export function MekaiLogo({
  className = '',
  iconSize = 32,
  showText = true,
  textSize = 'text-xl tracking-wider',
  iconColor = '#A3B18A',
  textColor = 'text-[#A3B18A]',
}: MekaiLogoProps) {
  return (
    <div id="mekai-brand-logo" className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Mechanical Nut Hexagonal Symbol with Center Cutout */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:rotate-12"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.5 5.25a5 5 0 0 1 5 0l12.99 7.5a5 5 0 0 1 2.5 4.33v15a5 5 0 0 1-2.5 4.33L26.5 43.91a5 5 0 0 1-5 0l-12.99-7.5A5 5 0 0 1 6 32.08v-15a5 5 0 0 1 2.5-4.33L21.5 5.25ZM24 17a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z"
          fill={iconColor}
        />
      </svg>

      {showText && (
        <span className={`font-extrabold uppercase font-heading tracking-widest ${textColor} ${textSize}`}>
          MEKAI
        </span>
      )}
    </div>
  );
}
