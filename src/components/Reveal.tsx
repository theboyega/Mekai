import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'up' | 'scale' | 'fade';
  threshold?: number;
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  threshold = 0.12,
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, reveal immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const initClass = variant === 'scale' ? 'reveal-scale-init' : 'reveal-init';
  const visibleClass = variant === 'scale' ? 'reveal-scale-visible' : 'reveal-visible';

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: isVisible && delay ? `${delay}ms` : '0ms',
      }}
      className={`${initClass} ${isVisible ? visibleClass : ''} ${className}`}
    >
      {children}
    </div>
  );
}
