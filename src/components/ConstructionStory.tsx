'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ConstructionStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal animation
      gsap.from(textRef.current, {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Line animation
      gsap.from(lineRef.current, {
        scaleX: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Parallax for the section
      gsap.to(sectionRef.current, {
        backgroundPositionY: '30%',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-32 bg-gradient-to-b from-white to-light-red/30"
    >
      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Decorative line */}
        <div
          ref={lineRef}
          className="w-24 h-1 bg-primary-red mx-auto mb-12 origin-left"
        />

        <div ref={textRef}>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Every project begins
            <span className="block text-gradient">from nothing</span>
          </h2>
          
          <p className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
            We transform empty lots into stunning architectural masterpieces. 
            From the first blueprint to the final brick, every detail is crafted 
            with precision and passion.
          </p>

          {/* Construction phases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { phase: '01', title: 'Planning', desc: 'Blueprint design and site analysis' },
              { phase: '02', title: 'Construction', desc: 'Building with precision and care' },
              { phase: '03', title: 'Completion', desc: 'Final touches and handover' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <span className="text-5xl font-bold text-primary-red/20 group-hover:text-primary-red/40 transition-colors">
                  {item.phase}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
