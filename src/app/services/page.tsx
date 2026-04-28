'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedSection from '@/components/AnimatedSection';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: '🏗️',
    title: 'Construction',
    desc: 'Full-scale construction services from foundation to finishing. We handle residential, commercial, and renovation projects with precision and care.',
    features: [
      'Residential Construction',
      'Commercial Building',
      'Renovation & Remodeling',
      'Structural Engineering',
      'Project Management',
      'Quality Assurance',
    ],
    gradient: 'from-red-100 to-red-50',
  },
  {
    icon: '🛋️',
    title: 'Built-in Furniture',
    desc: 'Custom built-in furniture designed specifically for your space. Maximize functionality while maintaining aesthetic appeal.',
    features: [
      'Kitchen Cabinets',
      'Wardrobes & Closets',
      'TV Units & Entertainment Centers',
      'Shelving Systems',
      'Study Desks',
      'Storage Solutions',
    ],
    gradient: 'from-red-50 to-white',
  },
  {
    icon: '🎨',
    title: 'Decoration',
    desc: 'Complete decoration solutions to transform your walls and floors. From curtains to vinyl flooring, we handle it all.',
    features: [
      'Curtains & Drapes',
      'Wallpaper Installation',
      'Vinyl Flooring',
      'Wall Panels',
      'Decorative Molding',
      'Accent Walls',
    ],
    gradient: 'from-white to-red-50',
  },
  {
    icon: '✏️',
    title: 'Design & Graphics',
    desc: 'Creative design and visual communication services to bring your vision to life with stunning visual representations.',
    features: [
      'Interior Design',
      '3D Visualization',
      'Brand Identity',
      'Marketing Materials',
      'Space Planning',
      'Color Consultation',
    ],
    gradient: 'from-red-100 to-red-50',
  },
];

export default function Services() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services-hero', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-20 bg-gradient-to-br from-primary-red to-dark-red">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="services-hero text-5xl md:text-6xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="services-hero text-white/80 text-lg max-w-2xl mx-auto">
            Comprehensive solutions for all your construction and design needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-24">
            {services.map((service, i) => (
              <AnimatedSection key={i} animation={i % 2 === 0 ? 'slideRight' : 'slideLeft'}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  i % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className={i % 2 !== 0 ? 'lg:order-2' : ''}>
                    <div className={`aspect-[4/3] bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center`}>
                      <div className="text-center">
                        <div className="w-24 h-24 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-5xl">{service.icon}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={i % 2 !== 0 ? 'lg:order-1' : ''}>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-8">{service.desc}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {service.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-primary-red rounded-full flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/booking" className="btn-primary inline-block mt-8">
                      Book This Service
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-light-red/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Need a Custom Solution?
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              We specialize in creating tailored solutions for unique projects. 
              Contact us to discuss your specific requirements.
            </p>
            <Link href="/contact" className="btn-primary text-lg px-10 py-4">
              Get in Touch
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
