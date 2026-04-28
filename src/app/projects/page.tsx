'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedSection from '@/components/AnimatedSection';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'Modern Luxury Villa',
    description: 'Contemporary 4-bedroom villa with panoramic views and premium finishes',
    price: '$850,000',
    location: 'Bangkok, Thailand',
    gradient: 'from-red-200 to-red-100',
    emoji: '🏡',
    status: 'Available',
    beds: 4,
    baths: 3,
    area: '350 sqm',
  },
  {
    id: 2,
    title: 'Urban Penthouse',
    description: 'Sky-high living with premium finishes and city views',
    price: '$1,200,000',
    location: 'Sukhumvit, Bangkok',
    gradient: 'from-red-100 to-red-50',
    emoji: '🌆',
    status: 'Available',
    beds: 3,
    baths: 2,
    area: '280 sqm',
  },
  {
    id: 3,
    title: 'Commercial Office Space',
    description: 'Modern office space designed for productivity and collaboration',
    price: '$500,000',
    location: 'Silom, Bangkok',
    gradient: 'from-red-50 to-white',
    emoji: '🏢',
    status: 'Available',
    beds: 0,
    baths: 2,
    area: '500 sqm',
  },
  {
    id: 4,
    title: 'Beachfront Resort',
    description: 'Luxury resort with stunning ocean views and world-class amenities',
    price: '$2,500,000',
    location: 'Phuket, Thailand',
    gradient: 'from-white to-red-50',
    emoji: '🏖️',
    status: 'Available',
    beds: 12,
    baths: 14,
    area: '2000 sqm',
  },
  {
    id: 5,
    title: 'Garden Residence',
    description: 'Peaceful family home surrounded by lush tropical gardens',
    price: '$650,000',
    location: 'Chiang Mai, Thailand',
    gradient: 'from-red-100 to-red-200',
    emoji: '🌿',
    status: 'Available',
    beds: 3,
    baths: 2,
    area: '220 sqm',
  },
  {
    id: 6,
    title: 'Studio Apartment',
    description: 'Compact and modern studio in the heart of the city',
    price: '$280,000',
    location: 'Asoke, Bangkok',
    gradient: 'from-red-200 to-red-100',
    emoji: '🏠',
    status: 'Available',
    beds: 1,
    baths: 1,
    area: '45 sqm',
  },
];

export default function Projects() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.projects-hero', {
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
          <h1 className="projects-hero text-5xl md:text-6xl font-bold text-white mb-4">
            Projects for Sale
          </h1>
          <p className="projects-hero text-white/80 text-lg max-w-2xl mx-auto">
            Discover our premium properties available for purchase
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <AnimatedSection key={project.id} animation="scale" delay={i * 0.08}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group card-glow border border-gray-100">
                  {/* Image */}
                  <div className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                        {project.emoji}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-red transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">{project.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>📍 {project.location}</span>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                      {project.beds > 0 && <span>🛏️ {project.beds} Beds</span>}
                      <span>🚿 {project.baths} Baths</span>
                      <span>📐 {project.area}</span>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-red">{project.price}</span>
                      <div className="flex gap-2">
                        <Link
                          href={`/projects/${project.id}`}
                          className="px-4 py-2 text-sm border border-primary-red text-primary-red rounded-lg hover:bg-primary-red hover:text-white transition-all"
                        >
                          View
                        </Link>
                        <Link
                          href={`/booking?project=${project.id}`}
                          className="px-4 py-2 text-sm bg-primary-red text-white rounded-lg hover:bg-dark-red transition-all"
                        >
                          Book
                        </Link>
                      </div>
                    </div>
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
