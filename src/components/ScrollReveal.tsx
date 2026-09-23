import React, { useEffect, useRef, useState } from 'react';

export type ScrollAnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'fade'
  | 'scale-up'
  | 'blur-up';

export interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: ScrollAnimationType;
  /** Delay in milliseconds (e.g. 50, 100, 150) for staggered cards */
  delay?: number;
  /** Duration in milliseconds (default 500ms for swift, high-end feel) */
  duration?: number;
  /** Distance in pixels for translate animations (default: 20px for subtle luxury motion) */
  distance?: number;
  /** Threshold percentage of element visibility before trigger (default: 0.12) */
  threshold?: number;
  /** Trigger once and never re-animate (default: true for optimal performance) */
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * ScrollReveal: A high-performance scroll-triggered animation wrapper.
 * Utilizes passive IntersectionObserver + GPU-accelerated CSS transforms/opacity
 * with `will-change` handling and respectful `prefers-reduced-motion` fallbacks.
 */
export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 500,
  distance = 20,
  threshold = 0.12,
  once = true,
  className = '',
  style,
  as: Component = 'div',
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If the browser doesn't support IntersectionObserver or if user prefers reduced motion
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    const currentEl = elementRef.current;
    if (!currentEl) return;

    // Check if element is already within viewport on initial load
    const rect = currentEl.getBoundingClientRect();
    const isInViewportNow =
      rect.top < window.innerHeight && rect.bottom > 0;

    if (isInViewportNow) {
      setIsVisible(true);
      if (once) return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px', // Trigger slightly before it hits the bottom
      }
    );

    observer.observe(currentEl);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Compute CSS transforms based on animation type
  const getInitialTransform = (): string => {
    switch (animation) {
      case 'fade-up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'fade-down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'fade-left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'fade-right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'scale-up':
        return `scale3d(0.96, 0.96, 1) translate3d(0, ${Math.round(distance / 2)}px, 0)`;
      case 'blur-up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'fade':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const getInitialFilter = (): string | undefined => {
    if (animation === 'blur-up') {
      return 'blur(6px)';
    }
    return undefined;
  };

  const animationStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale3d(1, 1, 1)' : getInitialTransform(),
    filter: isVisible ? 'blur(0px)' : getInitialFilter(),
    transitionProperty: 'opacity, transform, filter',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth ease-out cubic
    transitionDelay: `${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
    ...style,
  };

  return React.createElement(
    Component,
    {
      ref: elementRef,
      className,
      style: animationStyle,
    },
    children
  );
}

export default ScrollReveal;
