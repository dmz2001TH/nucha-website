'use client'

import Link from 'next/link'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface PortfolioImage {
  id: string
  url: string
  alt: string
}

interface Portfolio {
  id: string
  slug: string
  title: string
  titleEn?: string
  description: string
  location: string
  year: number
  category: string
  status: string
  featured: boolean
  coverImage: string
  images: PortfolioImage[]
}

const categoryLabels: Record<string, string> = {
  'RESIDENTIAL': 'บ้านพักอาศัย',
  'COMMERCIAL': 'พาณิชย์',
  'INTERIOR': 'ออกแบบภายใน',
  'ARCHITECTURE': 'สถาปัตยกรรม'
}

const categories = ['ทั้งหมด', 'RESIDENTIAL', 'COMMERCIAL', 'INTERIOR', 'ARCHITECTURE']

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [projects, setProjects] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCard, setActiveCard] = useState<string | null>(null)

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const res = await fetch('/api/portfolio')
      const data = await res.json()
      if (data.data) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = (e: React.MouseEvent, projectId: string) => {
    // Desktop: ใช้ hover ปกติ ไม่ต้องจัดการ
    if (window.matchMedia('(hover: hover)').matches) {
      return
    }

    // Mobile: double tap
    if (activeCard === projectId) {
      // Double tap: ไปหน้า portfolio (หรือ detail page ถ้ามี)
      setActiveCard(null)
    } else {
      // Single tap: แสดง effect
      e.preventDefault()
      setActiveCard(projectId)
    }
  }

  const filteredProjects = activeCategory === 'ทั้งหมด'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <>
      <Navigation currentPage="portfolio" />
      <main className="pt-20 sm:pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="px-5 sm:px-8 md:px-12 mb-12 sm:mb-16">
          <div className="max-w-[1400px] mx-auto">
            <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline">
              ผลงานของเรา
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter text-gray-900 font-headline mb-4 sm:mb-6">
              ผลงาน
            </h1>
            <p className="max-w-2xl text-gray-600 font-body text-base sm:text-lg leading-relaxed">
              ผลงานการออกแบบที่โดดเด่น สะท้อนถึงความเชี่ยวชาญและวิสัยทัศน์ของเรา
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="px-5 sm:px-8 md:px-12 mb-8 sm:mb-12">
          <div className="max-w-[1400px] mx-auto flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`font-headline text-[0.6rem] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-red-500/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category === 'ทั้งหมด' ? 'ทั้งหมด' : categoryLabels[category]}
              </button>
            ))}
          </div>
        </section>

        {/* Projects Grid */}
        <section className="px-5 sm:px-8 md:px-12 pb-16 sm:pb-24">
          <div className="max-w-[1400px] mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-gray-300 text-6xl mb-4 block">folder_open</span>
                <p className="text-gray-500 font-body">ยังไม่มีผลงานในขณะนี้</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {filteredProjects.map((project) => (
                  <a
                    key={project.id}
                    href={`/portfolio/${encodeURIComponent(project.slug)}`}
                    onClick={(e) => handleProjectClick(e, project.id)}
                    className={`group relative overflow-hidden rounded-xl editorial-shadow cursor-pointer block ${activeCard === project.id ? 'mobile-active' : ''}`}
                  >
                    <img
                      alt={project.title}
                      className={`w-full object-cover transition-all duration-700 ${
                        'h-[220px] sm:h-[280px] lg:h-[320px]'
                      } ${
                        activeCard === project.id
                          ? 'grayscale-0 scale-105'
                          : 'grayscale-0 sm:opacity-70 sm:grayscale-[40%] sm:group-hover:opacity-100 sm:group-hover:grayscale-0 sm:group-hover:scale-110'
                      }`}
                      src={project.coverImage || (project.images?.[0]?.url) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent transition-opacity duration-500 flex flex-col justify-end p-5 sm:p-6 md:p-8 ${
                      activeCard === project.id ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
                    }`}>
                      <div className={`transform transition-transform duration-500 ${
                        activeCard === project.id ? 'translate-y-0' : 'translate-y-4 sm:group-hover:translate-y-0'
                      }`}>
                        <span className="text-white/80 text-[0.6rem] sm:text-xs tracking-widest font-bold mb-1 sm:mb-2 block font-headline">
                          {project.location}, {project.year}
                        </span>
                        <h4 className="text-white text-xl sm:text-2xl md:text-3xl font-headline font-black mb-1 sm:mb-2">
                          {project.title}
                        </h4>
                        <p className={`text-white/90 text-xs sm:text-sm font-body ${
                          activeCard === project.id ? 'block' : 'hidden sm:block'
                        }`}>
                          {project.description}
                        </p>
                        <span className="mt-3 sm:mt-4 inline-flex items-center gap-1 font-headline text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-bold text-white border-b border-white pb-1">
                          ดูโปรเจกต์ <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 py-16 sm:py-24 px-5 sm:px-8 md:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-black text-gray-900 mb-4 sm:mb-6">
              พร้อมเริ่มโปรเจกต์ของคุณ?
            </h2>
            <p className="text-gray-600 font-body mb-6 sm:mb-8 text-sm sm:text-base">
              ติดต่อเราเพื่อปรึกษาเกี่ยวกับโปรเจกต์ในฝันของคุณ
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-8 sm:px-12 py-3 sm:py-4 font-headline font-bold text-xs sm:text-sm tracking-widest rounded-lg hover:bg-primary-dark transition-all shadow-xl shadow-red-500/20">
              <span className="material-symbols-outlined text-[18px]">mail</span>
              ติดต่อเรา
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
