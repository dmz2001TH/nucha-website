'use client'

import Link from 'next/link'
import Image from 'next/image'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface PortfolioImage {
  id: string
  url: string
  alt: string | null
}

interface Portfolio {
  id: string
  slug: string
  title: string
  titleEn: string | null
  description: string
  descriptionEn: string | null
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

export default function PortfolioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [related, setRelated] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (!slug) return
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`/api/portfolio/slug/${encodeURIComponent(slug)}`)
        if (!res.ok) { router.push('/portfolio'); return }
        const data = await res.json()
        setPortfolio(data.data)
        setActiveImageIndex(0)
        // Fetch related
        const relRes = await fetch(`/api/portfolio?status=PUBLISHED`)
        const relData = await relRes.json()
        if (relData.data) {
          setRelated((relData.data as Portfolio[]).filter((p: Portfolio) => p.slug !== slug).slice(0, 3))
        }
      } catch {
        router.push('/portfolio')
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [slug, router])

  const allImages = portfolio ? [
    { id: 'cover', url: portfolio.coverImage, alt: portfolio.title },
    ...portfolio.images
  ] : []

  const prevImage = useCallback(() => setActiveImageIndex(i => (i - 1 + allImages.length) % allImages.length), [allImages.length])
  const nextImage = useCallback(() => setActiveImageIndex(i => (i + 1) % allImages.length), [allImages.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, prevImage, nextImage])

  if (loading) {
    return (
      <>
        <Navigation currentPage="portfolio" />
        <main className="pt-20 sm:pt-24 md:pt-32 min-h-screen">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-[500px] bg-gray-200 rounded-xl"></div>
              <div className="grid grid-cols-4 gap-3">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>)}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!portfolio) return null

  return (
    <>
      <Navigation currentPage="portfolio" />

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          {allImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevImage() }} className="absolute left-4 text-white/70 hover:text-white">
                <span className="material-symbols-outlined text-5xl">chevron_left</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextImage() }} className="absolute right-4 text-white/70 hover:text-white">
                <span className="material-symbols-outlined text-5xl">chevron_right</span>
              </button>
            </>
          )}
          <Image
            src={allImages[activeImageIndex]?.url}
            alt={allImages[activeImageIndex]?.alt || portfolio.title}
            width={1200}
            height={800}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={e => e.stopPropagation()}
          />
          <p className="absolute bottom-4 text-white/50 text-sm font-headline">{activeImageIndex + 1} / {allImages.length}</p>
        </div>
      )}

      <main className="pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-24">

        {/* Hero image full-width */}
        <div className="relative w-full h-[40vh] sm:h-[55vh] md:h-[65vh] mb-12 sm:mb-16 overflow-hidden cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
          <Image
            src={allImages[activeImageIndex]?.url || portfolio.coverImage}
            alt={portfolio.title}
            fill
            sizes="100vw"
            className="object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10">
            {portfolio.featured && (
              <span className="bg-primary text-white text-[0.6rem] font-headline font-bold px-3 py-1 rounded tracking-widest uppercase mb-3 inline-block">
                Featured
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tighter text-white font-headline">
              {portfolio.title}
            </h1>
            {portfolio.titleEn && (
              <p className="text-white/60 font-headline text-sm tracking-widest uppercase mt-1">{portfolio.titleEn}</p>
            )}
          </div>
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex items-center gap-2 text-white/70 text-xs font-headline">
            <span className="material-symbols-outlined text-[16px]">zoom_in</span>
            คลิกเพื่อขยาย
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">

          {/* Back */}
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-headline font-bold text-gray-400 hover:text-primary transition-colors mb-10">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            กลับ
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mb-16">

            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-10">

              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-white p-5 sm:p-6 text-center">
                  <span className="material-symbols-outlined text-primary text-2xl mb-2 block">location_on</span>
                  <p className="text-[0.6rem] tracking-widest uppercase font-bold text-gray-400 font-headline mb-1">สถานที่</p>
                  <p className="text-gray-900 font-headline font-black text-sm">{portfolio.location}</p>
                </div>
                <div className="bg-white p-5 sm:p-6 text-center">
                  <span className="material-symbols-outlined text-primary text-2xl mb-2 block">calendar_month</span>
                  <p className="text-[0.6rem] tracking-widest uppercase font-bold text-gray-400 font-headline mb-1">ปีที่แล้วเสร็จ</p>
                  <p className="text-gray-900 font-headline font-black text-sm">{portfolio.year}</p>
                </div>
                <div className="bg-white p-5 sm:p-6 text-center">
                  <span className="material-symbols-outlined text-primary text-2xl mb-2 block">category</span>
                  <p className="text-[0.6rem] tracking-widest uppercase font-bold text-gray-400 font-headline mb-1">ประเภท</p>
                  <p className="text-gray-900 font-headline font-black text-sm">{categoryLabels[portfolio.category] || portfolio.category}</p>
                </div>
              </div>

              {/* About */}
              <div>
                <h2 className="text-xs tracking-[0.3em] uppercase font-bold text-gray-400 mb-4 font-headline">เกี่ยวกับโครงการ</h2>
                <p className="text-gray-700 font-body text-base sm:text-lg leading-relaxed">{portfolio.description}</p>
                {portfolio.descriptionEn && (
                  <p className="text-gray-400 font-body text-sm leading-relaxed mt-4 italic border-l-2 border-gray-200 pl-4">{portfolio.descriptionEn}</p>
                )}
              </div>

              {/* Gallery thumbnails */}
              {allImages.length > 1 && (
                <div>
                  <h2 className="text-xs tracking-[0.3em] uppercase font-bold text-gray-400 mb-4 font-headline">แกลเลอรี่</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                    {allImages.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => { setActiveImageIndex(index); setLightboxOpen(true) }}
                        className={`relative overflow-hidden rounded-xl aspect-square border-2 transition-all duration-200 hover:scale-105 ${
                          activeImageIndex === index ? 'border-primary shadow-lg shadow-red-500/20' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <Image src={img.url} alt={img.alt || portfolio.title} fill sizes="150px" className="object-cover" />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                          <span className="material-symbols-outlined text-white text-2xl">zoom_in</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">

              {/* Category badge */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-[0.6rem] tracking-widest uppercase font-bold text-gray-400 font-headline mb-2">ประเภทผลงาน</p>
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-headline font-bold">
                  <span className="material-symbols-outlined text-[18px]">architecture</span>
                  {categoryLabels[portfolio.category] || portfolio.category}
                </span>
              </div>

              {/* CTA */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white">
                <h3 className="font-headline font-black text-lg mb-2">สนใจโครงการนี้?</h3>
                <p className="text-white/60 font-body text-sm mb-5 leading-relaxed">ติดต่อทีมงานของเราเพื่อรับข้อมูลเพิ่มเติมและขอรับใบเสนอราคา</p>
                <Link href="/contact" className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 font-headline font-bold text-sm tracking-wider rounded-xl hover:bg-red-700 transition-all w-full mb-3">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  ติดต่อเรา
                </Link>
                <Link href="/booking" className="flex items-center justify-center gap-2 border border-white/20 text-white/80 px-6 py-3 font-headline font-bold text-sm tracking-wider rounded-xl hover:border-white hover:text-white transition-all w-full">
                  <span className="material-symbols-outlined text-[18px]">event</span>
                  นัดปรึกษา
                </Link>
              </div>

              {/* Share */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-[0.6rem] tracking-widest uppercase font-bold text-gray-400 font-headline mb-3">แชร์ผลงาน</p>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-3 py-2.5 rounded-xl text-xs font-headline font-bold hover:border-primary hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-[16px]">link</span>
                    คัดลอกลิงก์
                  </button>
                </div>
              </div>

              {/* Back to portfolio */}
              <Link href="/portfolio" className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-6 py-3 font-headline font-bold text-sm tracking-wider rounded-xl hover:border-primary hover:text-primary transition-all w-full">
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                ดูผลงานทั้งหมด
              </Link>
            </div>
          </div>

          {/* Related Projects */}
          {related.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-1 block font-headline">ดูเพิ่มเติม</span>
                  <h2 className="text-2xl sm:text-3xl font-headline font-black text-gray-900">ผลงานที่เกี่ยวข้อง</h2>
                </div>
                <Link href="/portfolio" className="text-sm font-headline font-bold text-primary hover:underline hidden sm:block">ดูทั้งหมด →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {related.map((p) => (
                  <a key={p.id} href={`/portfolio/${encodeURIComponent(p.slug)}`} className="group relative overflow-hidden rounded-xl editorial-shadow block">
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover sm:opacity-80 sm:grayscale-[30%] sm:group-hover:opacity-100 sm:group-hover:grayscale-0 sm:group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white/70 text-[0.6rem] tracking-widest uppercase font-headline mb-1">{categoryLabels[p.category]}</p>
                      <h3 className="text-white font-headline font-black text-base sm:text-lg">{p.title}</h3>
                      <p className="text-white/60 text-xs font-headline mt-0.5">{p.location}, {p.year}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
