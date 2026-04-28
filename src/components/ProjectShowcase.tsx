'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll animation
      if (sliderRef.current) {
        const cards = sliderRef.current.children;
        gsap.to(sliderRef.current, {
          x: () => -(sliderRef.current!.scrollWidth - window.innerWidth + 100),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${sliderRef.current!.scrollWidth - window.innerWidth + 100}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const projects = [
    {
      title: 'Modern Luxury Villa',
      location: 'Bangkok, Thailand',
      price: '$850,000',
      gradient: 'from-red-200 to-red-100',
    },
    {
      title: 'Urban Penthouse',
      location: 'Sukhumvit, Bangkok',
      price: '$1,200,000',
      gradient: 'from-red-100 to-red-50',
    },
    {
      title: 'Beachfront Resort',
      location: 'Phuket, Thailand',
      price: '$2,500,000',
      gradient: 'from-red-50 to-white',
    },
    {
      title: 'Commercial Tower',
      location: 'Silom, Bangkok',
      price: '$3,000,000',
      gradient: 'from-white to-red-50',
    },
    {
      title: 'Garden Residence',
      location: 'Chiang Mai, Thailand',
      price: '$650,000',
      gradient: 'from-red-100 to-red-200',
    },
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-light-red/20">
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Explore our latest projects that showcase innovation and excellence in every detail.
          </p>
        </div>
      </div>

      {/* Horizontal scrolling cards */}
      <div
        ref={sliderRef}
        className="flex gap-8 px-8 pb-32"
        style={{ width: 'max-content' }}
      >
        {projects.map((project, i) => (
          <div
            key={i}
            className="w-[400px] flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group card-glow"
          >
            <div className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform">
                    <span className="text-4xl">🏗️</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-primary-red text-white text-xs px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-red transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                <span>📍</span> {project.location}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-red">{project.price}</span>
                <Link
                  href="/projects"
                  className="text-sm text-primary-red hover:underline font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
