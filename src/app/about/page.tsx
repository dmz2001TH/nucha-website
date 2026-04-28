'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedSection from '@/components/AnimatedSection';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-hero-text', {
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
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 bg-gradient-to-br from-primary-red to-dark-red"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="about-hero-text text-5xl md:text-6xl font-bold text-white mb-4">
            About Us
          </h1>
          <p className="about-hero-text text-white/80 text-lg max-w-2xl mx-auto">
            Building dreams, creating spaces, transforming lives since 2009.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="slideRight">
              <div className="aspect-[4/3] bg-gradient-to-br from-light-red to-red-50 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-6xl">🏢</span>
                  </div>
                  <span className="text-primary-red font-medium">Est. 2009</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideLeft">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-gradient">Story</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Nucha Innovation Co., Ltd. was founded with a simple yet powerful vision: 
                to transform the way people experience their spaces. What started as a small 
                construction firm has grown into a comprehensive design and build company 
                serving clients across Thailand.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                Over the years, we&apos;ve built a reputation for excellence, combining 
                innovative design with superior craftsmanship. Our team of skilled 
                professionals brings together diverse expertise in construction, interior 
                design, and project management.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Today, we&apos;re proud to have completed over 150 projects, each one a 
                testament to our commitment to quality and client satisfaction.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-light-red/20">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Excellence',
                desc: 'We strive for perfection in every detail, ensuring the highest quality in all our work.',
              },
              {
                icon: '🤝',
                title: 'Integrity',
                desc: 'We build trust through transparency, honesty, and ethical business practices.',
              },
              {
                icon: '💡',
                title: 'Innovation',
                desc: 'We embrace new ideas and technologies to deliver cutting-edge solutions.',
              },
            ].map((value, i) => (
              <AnimatedSection key={i} animation="slideUp" delay={i * 0.15}>
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-20 h-20 bg-light-red rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">{value.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-500 text-sm">{value.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Meet the experts behind Nucha Innovation
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Somchai Patel', role: 'Founder & CEO', emoji: '👨‍💼' },
              { name: 'Nisa Wong', role: 'Design Director', emoji: '👩‍🎨' },
              { name: 'Krit Somsak', role: 'Construction Lead', emoji: '👷' },
              { name: 'Ploy Chai', role: 'Client Relations', emoji: '👩‍💼' },
            ].map((member, i) => (
              <AnimatedSection key={i} animation="scale" delay={i * 0.1}>
                <div className="text-center group">
                  <div className="aspect-square bg-gradient-to-br from-light-red to-red-50 rounded-2xl mb-4 flex items-center justify-center group-hover:shadow-lg transition-all">
                    <span className="text-7xl group-hover:scale-110 transition-transform">
                      {member.emoji}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-primary-red">{member.role}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
