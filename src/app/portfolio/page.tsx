'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedSection from '@/components/AnimatedSection';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'Residential', 'Commercial', 'Hospitality', 'Renovation'];

const projects = [
  { id: 1, title: 'Modern Villa', category: 'Residential', gradient: 'from-red-200 to-red-100', emoji: '🏠' },
  { id: 2, title: 'Office Complex', category: 'Commercial', gradient: 'from-red-100 to-red-50', emoji: '🏢' },
  { id: 3, title: 'Luxury Hotel', category: 'Hospitality', gradient: 'from-red-50 to-white', emoji: '🏨' },
  { id: 4, title: 'Kitchen Renovation', category: 'Renovation', gradient: 'from-white to-red-50', emoji: '🍳' },
  { id: 5, title: 'Penthouse Suite', category: 'Residential', gradient: 'from-red-100 to-red-200', emoji: '🌆' },
  { id: 6, title: 'Retail Store', category: 'Commercial', gradient: 'from-red-200 to-red-100', emoji: '🛍️' },
  { id: 7, title: 'Beach Resort', category: 'Hospitality', gradient: 'from-red-100 to-red-50', emoji: '🏖️' },
  { id: 8, title: 'Bathroom Remodel', category: 'Renovation', gradient: 'from-red-50 to-white', emoji: '🚿' },
  { id: 9, title: 'Garden Terrace', category: 'Residential', gradient: 'from-white to-red-50', emoji: '🌿' },
];

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.portfolio-hero', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-20 bg-gradient-to-br from-primary-red to-dark-red">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="portfolio-hero text-5xl md:text-6xl font-bold text-white mb-4">
            Our Portfolio
          </h1>
          <p className="portfolio-hero text-white/80 text-lg max-w-2xl mx-auto">
            Explore our collection of completed projects that showcase our expertise
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-primary-red text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, i) => (
              <AnimatedSection key={project.id} animation="scale" delay={i * 0.05}>
                <div className="group relative overflow-hidden rounded-2xl cursor-pointer">
                  <div className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                      {project.emoji}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-red/90 via-primary-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                    <div>
                      <span className="text-white/70 text-sm">{project.category}</span>
                      <h3 className="text-white text-xl font-bold">{project.title}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-24 bg-light-red/20">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Before & <span className="text-gradient">After</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              See the dramatic transformations we achieve for our clients
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { before: '🏚️', after: '🏠', title: 'Villa Renovation' },
              { before: '📦', after: '🛋️', title: 'Living Room Redesign' },
            ].map((item, i) => (
              <AnimatedSection key={i} animation="slideUp" delay={i * 0.2}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="grid grid-cols-2">
                    <div className="aspect-square bg-gray-100 flex flex-col items-center justify-center p-8">
                      <span className="text-6xl mb-4">{item.before}</span>
                      <span className="text-sm text-gray-500 font-medium">Before</span>
                    </div>
                    <div className="aspect-square bg-light-red flex flex-col items-center justify-center p-8">
                      <span className="text-6xl mb-4">{item.after}</span>
                      <span className="text-sm text-primary-red font-medium">After</span>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
