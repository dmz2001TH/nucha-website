'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'parallax';
  delay?: number;
  scrub?: boolean;
}

export default function AnimatedSection({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  scrub = false,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const animations: Record<string, gsap.TweenVars> = {
        fadeIn: { opacity: 0, y: 30 },
        slideUp: { opacity: 0, y: 80 },
        slideLeft: { opacity: 0, x: 80 },
        slideRight: { opacity: 0, x: -80 },
        scale: { opacity: 0, scale: 0.8 },
        parallax: { yPercent: -20 },
      };

      const fromVars = animations[animation];

      if (scrub) {
        gsap.from(el, {
          ...fromVars,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
        });
      } else {
        gsap.from(el, {
          ...fromVars,
          duration: 1,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [animation, delay, scrub]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
