'use client'

import Link from 'next/link'

import { useState, useEffect, use } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface VillaImage {
  id: string
  url: string
  alt: string
}

interface Villa {
  id: string
  name: string
  nameEn: string | null
  slug: string
  description: string
  descriptionEn: string | null
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  landArea: number
  floors: number
  parking: number
  status: string
  featured: boolean
  coverImage: string
  images: VillaImage[]
  latitude: number | null
  longitude: number | null
}

export default function VillaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [villa, setVilla] = useState<Villa | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    fetchVilla()
  }, [slug])

  const fetchVilla = async () => {
    try {
      const res = await fetch(`/api/villas?slug=${slug}`)
      const data = await res.json()
      if (data.data && data.data.length > 0) {
        setVilla(data.data[0])
      }
    } catch (error) {
      console.error('Error fetching villa:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusLabels: Record<string, string> = {
    'AVAILABLE': 'พร้อมขาย',
    'RESERVED': 'จองแล้ว',
    'SOLD': 'ขายแล้ว',
    'UNDER_CONSTRUCTION': 'กำลังก่อสร้าง'
  }

  const statusColors: Record<string, string> = {
    'AVAILABLE': 'bg-green-100 text-green-800 border-green-200',
    'RESERVED': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'SOLD': 'bg-gray-100 text-gray-800 border-gray-200',
    'UNDER_CONSTRUCTION': 'bg-blue-100 text-blue-800 border-blue-200'
  }

  if (loading) {
    return (
      <>
        <Navigation currentPage="villas" />
        <main className="pt-20 sm:pt-24 md:pt-32">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
            <div className="animate-pulse space-y-6">
              <div className="h-[400px] bg-gray-200 rounded-xl"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!villa) {
    return (
      <>
        <Navigation currentPage="villas" />
        <main className="pt-20 sm:pt-24 md:pt-32 min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-8xl text-gray-300 mb-4 block">home</span>
            <h1 className="text-3xl font-headline font-black text-gray-900 mb-2">ไม่พบวิลล่า</h1>
            <p className="text-gray-500 mb-6">วิลล่าที่คุณค้นหาไม่พบในระบบ</p>
            <Link href="/villas" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 font-headline font-bold text-sm rounded-lg hover:bg-primary-dark transition-all">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              กลับไปรายการวิลล่า
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const allImages = villa.coverImage
    ? [{ url: villa.coverImage, alt: villa.name }, ...(villa.images || [])]
    : villa.images || []

  return (
    <>
      <Navigation currentPage="villas" />
      <main className="pt-20 sm:pt-24 md:pt-32">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 font-body">
            <Link href="/" className="hover:text-primary transition-colors">หน้าแรก</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <Link href="/villas" className="hover:text-primary transition-colors">วิลล่า</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-gray-900 font-bold">{villa.name}</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Gallery */}
            <div className="xl:col-span-8">
              {/* Main Image */}
              <div 
                className="relative aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => allImages.length > 0 && setLightboxOpen(true)}
              >
                {allImages.length > 0 ? (
                  <img
                    src={allImages[selectedImage]?.url || villa.coverImage}
                    alt={allImages[selectedImage]?.alt || villa.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-body text-gray-600 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                  คลิกเพื่อดูขนาดใหญ่
                </div>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-24 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden border-2 transition-all hover:opacity-80 ${
                        selectedImage === i ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'
                      }`}
                    >
                      <img src={img.url} alt={img.alt || `${villa.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 md:p-10">
                <h2 className="text-2xl font-headline font-black text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-1 h-8 bg-primary rounded-full"></span>
                  รายละเอียด
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600 font-body">
                  <p className="leading-relaxed whitespace-pre-line">{villa.description}</p>
                  {villa.descriptionEn && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-gray-500 italic">{villa.descriptionEn}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-headline font-black text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-primary rounded-full"></span>
                  ข้อมูลจำเพาะ
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <span className="material-symbols-outlined text-2xl text-primary mb-2 block">bed</span>
                    <p className="text-2xl font-headline font-black text-gray-900">{villa.bedrooms}</p>
                    <p className="text-xs text-gray-500 font-body">ห้องนอน</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <span className="material-symbols-outlined text-2xl text-primary mb-2 block">shower</span>
                    <p className="text-2xl font-headline font-black text-gray-900">{villa.bathrooms}</p>
                    <p className="text-xs text-gray-500 font-body">ห้องน้ำ</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <span className="material-symbols-outlined text-2xl text-primary mb-2 block">square_foot</span>
                    <p className="text-2xl font-headline font-black text-gray-900">{villa.area}</p>
                    <p className="text-xs text-gray-500 font-body">ตร.ม.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <span className="material-symbols-outlined text-2xl text-primary mb-2 block">landscape</span>
                    <p className="text-2xl font-headline font-black text-gray-900">{villa.landArea}</p>
                    <p className="text-xs text-gray-500 font-body">ตร.ม. (ดิน)</p>
                  </div>
                  {villa.floors > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <span className="material-symbols-outlined text-2xl text-primary mb-2 block">stairs</span>
                      <p className="text-2xl font-headline font-black text-gray-900">{villa.floors}</p>
                      <p className="text-xs text-gray-500 font-body">ชั้น</p>
                    </div>
                  )}
                  {villa.parking > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <span className="material-symbols-outlined text-2xl text-primary mb-2 block">directions_car</span>
                      <p className="text-2xl font-headline font-black text-gray-900">{villa.parking}</p>
                      <p className="text-xs text-gray-500 font-body">ที่จอดรถ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-4">
              <div className="sticky top-28 bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${statusColors[villa.status]}`}>
                    {statusLabels[villa.status] || villa.status}
                  </span>
                  {villa.featured && (
                    <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-primary text-white">แนะนำ</span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-headline font-black text-gray-900 mb-1">{villa.name}</h1>
                {villa.nameEn && <p className="text-base text-gray-500 font-body mb-4">{villa.nameEn}</p>}

                <div className="flex items-center gap-2 text-gray-600 mb-6 font-body">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                  <span>{villa.location}</span>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-gray-500 font-body mb-1">ราคา</p>
                  <p className="text-4xl font-headline font-black text-primary">
                    ฿{(villa.price / 1000000).toFixed(1)}M
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <Link href="/contact"
                    className="w-full bg-primary text-white py-4 font-headline font-bold text-base rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-500/20"
                  >
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    สอบถามรายละเอียด
                  </Link>
                  <Link href="/booking"
                    className="w-full bg-white text-gray-900 border-2 border-gray-200 py-4 font-headline font-bold text-base rounded-xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                    นัดชมโครงการ
                  </Link>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-700 mb-3 font-headline">ติดต่อเรา</p>
                  <div className="space-y-2 text-gray-600 font-body text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                      <span>+66 (0) 81-234-5678</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                      <span>concierge@nucha-innovation.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          <button 
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(selectedImage > 0 ? selectedImage - 1 : allImages.length - 1) }}
          >
            <span className="material-symbols-outlined text-4xl">chevron_left</span>
          </button>
          <img 
            src={allImages[selectedImage]?.url} 
            alt={allImages[selectedImage]?.alt || villa.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          <button 
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0) }}
          >
            <span className="material-symbols-outlined text-4xl">chevron_right</span>
          </button>
          <div className="absolute bottom-4 text-white font-body text-sm">
            {selectedImage + 1} / {allImages.length}
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}
