'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple smooth scroll with GSAP ScrollTrigger
    const ctx = gsap.context(() => {
      // Refresh ScrollTrigger on load
      ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} id="smooth-wrapper">
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
}
