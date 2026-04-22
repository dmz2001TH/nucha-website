'use client'

import Link from 'next/link'
import { useState } from 'react'

interface VillaImage { id: string; url: string; alt: string }
interface Villa {
  id: string; name: string; nameEn?: string; slug: string; description: string
  location: string; price: number; bedrooms: number; bathrooms: number; area: number
  status: string; featured: boolean; coverImage: string; images: VillaImage[]
}

const statusLabels: Record<string, string> = {
  'AVAILABLE': 'พร้อมขาย', 'RESERVED': 'จองแล้ว', 'SOLD': 'ขายแล้ว', 'UNDER_CONSTRUCTION': 'กำลังก่อสร้าง'
}
const statusColors: Record<string, string> = {
  'AVAILABLE': 'bg-green-100 text-green-800', 'RESERVED': 'bg-yellow-100 text-yellow-800',
  'SOLD': 'bg-gray-100 text-gray-800', 'UNDER_CONSTRUCTION': 'bg-blue-100 text-blue-800'
}

export default function VillasClient({ villas }: { villas: Villa[] }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [activeCard, setActiveCard] = useState<string | null>(null)

  const handleVillaClick = (e: React.MouseEvent, villaId: string) => {
    if (window.matchMedia('(hover: hover)').matches) return
    if (activeCard === villaId) { setActiveCard(null) }
    else { e.preventDefault(); setActiveCard(villaId) }
  }

  const filteredVillas = filterStatus === 'all' ? villas : villas.filter(v => v.status === filterStatus)
  const sortedVillas = [...filteredVillas].sort((a, b) => {
    if (sortBy === 'featured') return b.featured ? 1 : -1
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0
  })

  return (
    <>
      {/* Filters */}
      <section className="px-5 sm:px-8 md:px-12 mb-8 sm:mb-12">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {['all', 'AVAILABLE', 'RESERVED', 'SOLD'].map((status) => (
              <button key={status} onClick={() => setFilterStatus(status)}
                className={`font-headline text-[0.6rem] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all ${
                  filterStatus === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'ทั้งหมด' : statusLabels[status]}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="font-headline text-[0.6rem] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gray-100 text-gray-600 border-0 focus:ring-0 cursor-pointer"
          >
            <option value="featured">แนะนำ</option>
            <option value="price-low">ราคา: ต่ำ - สูง</option>
            <option value="price-high">ราคา: สูง - ต่ำ</option>
          </select>
        </div>
      </section>

      {/* Villas Grid */}
      <section className="px-5 sm:px-8 md:px-12 pb-16 sm:pb-24">
        <div className="max-w-[1400px] mx-auto">
          {sortedVillas.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-gray-300 text-6xl mb-4 block">home</span>
              <p className="text-gray-500 font-body">ยังไม่มีวิลล่าในขณะนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {sortedVillas.map((villa) => (
                <a key={villa.id} href={`/villas/${villa.slug}`} onClick={(e) => handleVillaClick(e, villa.id)}
                  className={`group bg-white rounded-xl overflow-hidden editorial-shadow hover:shadow-2xl transition-shadow duration-500 block ${activeCard === villa.id ? 'mobile-active' : ''}`}
                >
                  <div className="relative overflow-hidden">
                    <img alt={villa.name}
                      className={`w-full h-48 sm:h-56 md:h-64 object-cover transition-all duration-700 ${
                        activeCard === villa.id ? 'scale-105' : 'sm:group-hover:scale-110'
                      }`}
                      src={villa.coverImage || (villa.images?.[0]?.url) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                    />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-[0.6rem] sm:text-xs font-bold font-headline ${statusColors[villa.status]}`}>
                        {statusLabels[villa.status] || villa.status}
                      </span>
                      {villa.featured && (
                        <span className="px-2 sm:px-3 py-1 rounded-full text-[0.6rem] sm:text-xs font-bold font-headline bg-primary text-white">แนะนำ</span>
                      )}
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent transition-opacity duration-500 flex items-center justify-center ${
                      activeCard === villa.id ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
                    }`}>
                      <span className="bg-white text-primary px-6 sm:px-8 py-2.5 sm:py-3 font-headline font-bold text-xs sm:text-sm tracking-widest rounded-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        ดูรายละเอียด
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-headline font-black text-gray-900 mb-0.5 sm:mb-1">{villa.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-body flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] sm:text-[16px]">location_on</span>
                          {villa.location}
                        </p>
                      </div>
                      <p className="text-lg sm:text-xl font-headline font-black text-primary whitespace-nowrap">
                        ฿{(villa.price / 1000000).toFixed(1)}M
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 font-body mb-3 sm:mb-4 line-clamp-2">{villa.description}</p>

                    <div className="flex gap-3 sm:gap-4 text-[0.6rem] sm:text-xs text-gray-500 font-body border-t border-gray-100 pt-3 sm:pt-4">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] sm:text-sm">bed</span>{villa.bedrooms} ห้องนอน
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] sm:text-sm">shower</span>{villa.bathrooms} ห้องน้ำ
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] sm:text-sm">square_foot</span>{villa.area} ตร.ม.
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
            ไม่พบวิลล่าที่ตรงกับความต้องการ?
          </h2>
          <p className="text-gray-600 font-body mb-6 sm:mb-8 text-sm sm:text-base">
            ติดต่อเราเพื่อรับข้อมูลวิลล่าที่กำลังจะเปิดตัว หรือสร้างวิลล่าในฝันตามแบบที่คุณต้องการ
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-8 sm:px-12 py-3 sm:py-4 font-headline font-bold text-xs sm:text-sm tracking-widest rounded-lg hover:bg-primary-dark transition-all shadow-xl shadow-red-500/20">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            ติดต่อเรา
          </Link>
        </div>
      </section>
    </>
  )
}
