'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function InteriorShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards stagger animation
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          opacity: 0,
          y: 60,
          scale: 0.95,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Parallax for images
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const img = card.querySelector('img');
        if (img) {
          gsap.to(img, {
            yPercent: -10,
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const interiors = [
    {
      title: 'Modern Living Room',
      category: 'Residential',
      gradient: 'from-red-100 to-red-50',
    },
    {
      title: 'Luxury Kitchen',
      category: 'Residential',
      gradient: 'from-red-50 to-white',
    },
    {
      title: 'Office Space',
      category: 'Commercial',
      gradient: 'from-white to-red-50',
    },
    {
      title: 'Hotel Lobby',
      category: 'Hospitality',
      gradient: 'from-red-50 to-red-100',
    },
  ];

  return (
    <section ref={sectionRef} className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Interior <span className="text-gradient">Transformation</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From empty spaces to extraordinary environments. See how we transform interiors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {interiors.map((item, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer img-zoom"
            >
              <div className={`aspect-[4/3] bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <span className="text-sm text-primary-red font-medium">{item.category}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-red/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-8">
                <div>
                  <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/80 text-sm">Click to explore</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
