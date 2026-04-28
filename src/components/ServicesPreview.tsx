'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: '🏗️',
    title: 'Construction',
    desc: 'Full-scale construction from foundation to finishing',
    features: ['Residential', 'Commercial', 'Renovation'],
  },
  {
    icon: '🛋️',
    title: 'Built-in Furniture',
    desc: 'Custom built-in furniture designed for your space',
    features: ['Kitchen', 'Wardrobes', 'TV Units'],
  },
  {
    icon: '🎨',
    title: 'Decoration',
    desc: 'Complete decoration solutions for walls and floors',
    features: ['Curtains', 'Wallpaper', 'Vinyl'],
  },
  {
    icon: '✏️',
    title: 'Design & Graphics',
    desc: 'Creative design and visual communication',
    features: ['Interior Design', '3D Viz', 'Branding'],
  },
];

export default function ServicesPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Comprehensive solutions for all your construction and design needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group p-8 bg-white border border-gray-100 rounded-2xl hover:border-primary-red/30 transition-all hover:-translate-y-2 card-glow cursor-pointer"
            >
              <div className="w-16 h-16 bg-light-red rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">{service.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-red transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{service.desc}</p>
              <ul className="space-y-2">
                {service.features.map((feature, j) => (
                  <li key={j} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary-red rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-outline">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
