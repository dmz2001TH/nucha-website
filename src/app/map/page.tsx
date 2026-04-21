'use client'

import Link from 'next/link'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import InteractiveMap from '@/components/InteractiveMap'

interface Villa {
  id: string
  name: string
  slug: string
  location: string
  price: number
  coverImage: string
  latitude?: number
  longitude?: number
}

interface Portfolio {
  id: string
  title: string
  location: string
  coverImage: string
  latitude?: number
  longitude?: number
}

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: 'villa' | 'portfolio'
  image?: string
  price?: number
  location?: string
  link: string
}

export default function MapPage() {
  const [locations, setLocations] = useState<MapLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'villa' | 'portfolio'>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [villasRes, portfolioRes] = await Promise.all([
        fetch('/api/villas?status=AVAILABLE'),
        fetch('/api/portfolio?status=PUBLISHED')
      ])

      const villasData = await villasRes.json()
      const portfolioData = await portfolioRes.json()

      const mapLocations: MapLocation[] = []

      // Add villas with coordinates
      if (villasData.data) {
        villasData.data.forEach((villa: Villa) => {
          if (villa.latitude && villa.longitude) {
            mapLocations.push({
              id: villa.id,
              name: villa.name,
              lat: villa.latitude,
              lng: villa.longitude,
              type: 'villa',
              image: villa.coverImage,
              price: villa.price,
              location: villa.location,
              link: `/villas/${villa.slug}`
            })
          }
        })
      }

      // Add portfolios with coordinates
      if (portfolioData.data) {
        portfolioData.data.forEach((portfolio: Portfolio) => {
          if (portfolio.latitude && portfolio.longitude) {
            mapLocations.push({
              id: portfolio.id,
              name: portfolio.title,
              lat: portfolio.latitude,
              lng: portfolio.longitude,
              type: 'portfolio',
              image: portfolio.coverImage,
              location: portfolio.location,
              link: '/portfolio'
            })
          }
        })
      }

      setLocations(mapLocations)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLocations = filter === 'all'
    ? locations
    : locations.filter(loc => loc.type === filter)

  const villaCount = locations.filter(l => l.type === 'villa').length
  const portfolioCount = locations.filter(l => l.type === 'portfolio').length

  return (
    <>
      <Navigation currentPage="map" />
      <main className="pt-20 sm:pt-24 md:pt-32 min-h-screen">
        {/* Hero Section */}
        <section className="px-5 sm:px-8 md:px-12 mb-8 sm:mb-12">
          <div className="max-w-[1400px] mx-auto">
            <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline">
              แผนที่
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter text-gray-900 font-headline mb-4 sm:mb-6">
              แผนที่ของเรา
            </h1>
            <p className="max-w-2xl text-gray-600 font-body text-base sm:text-lg leading-relaxed">
              ค้นหาวิลล่าและผลงานของเราบนแผนที่ คลิกที่หมุดเพื่อดูรายละเอียด
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="px-5 sm:px-8 md:px-12 mb-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`font-headline text-xs tracking-wider font-bold px-5 py-2.5 rounded-lg transition-all ${
                  filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ทั้งหมด ({locations.length})
              </button>
              <button
                onClick={() => setFilter('villa')}
                className={`font-headline text-xs tracking-wider font-bold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                  filter === 'villa' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${filter === 'villa' ? 'bg-white' : 'bg-[#C41E3A]'}`}></div>
                วิลล่า ({villaCount})
              </button>
              <button
                onClick={() => setFilter('portfolio')}
                className={`font-headline text-xs tracking-wider font-bold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                  filter === 'portfolio' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${filter === 'portfolio' ? 'bg-white' : 'bg-[#D32F2F]'}`}></div>
                ผลงาน ({portfolioCount})
              </button>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="px-5 sm:px-8 md:px-12 pb-16 sm:pb-24">
          <div className="max-w-[1400px] mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-xl">
                <div className="text-center">
                  <span className="material-symbols-outlined animate-spin text-primary text-4xl mb-2 block">progress_activity</span>
                  <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                </div>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-xl">
                <div className="text-center">
                  <span className="material-symbols-outlined text-gray-300 text-6xl mb-4 block">location_on</span>
                  <p className="text-gray-500 font-body">ยังไม่มีข้อมูลตำแหน่ง</p>
                  <p className="text-gray-400 text-sm mt-2">เพิ่ม latitude/longitude ในหน้าแอดมินเพื่อแสดงหมุดบนแผนที่</p>
                </div>
              </div>
            ) : (
              <InteractiveMap
                locations={filteredLocations}
                height="600px"
                className="rounded-xl overflow-hidden shadow-lg"
              />
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-gray-50 py-16 sm:py-24 px-5 sm:px-8 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary">home</span>
                </div>
                <h3 className="text-lg font-headline font-bold text-gray-900 mb-2">วิลล่าทั้งหมด</h3>
                <p className="text-3xl font-headline font-black text-primary">{villaCount}</p>
                <p className="text-sm text-gray-500 mt-1">พร้อมขาย</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary">photo_library</span>
                </div>
                <h3 className="text-lg font-headline font-bold text-gray-900 mb-2">ผลงานทั้งหมด</h3>
                <p className="text-3xl font-headline font-black text-primary">{portfolioCount}</p>
                <p className="text-sm text-gray-500 mt-1">โปรเจกต์ที่เสร็จสิ้น</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                </div>
                <h3 className="text-lg font-headline font-bold text-gray-900 mb-2">ตำแหน่งทั้งหมด</h3>
                <p className="text-3xl font-headline font-black text-primary">{locations.length}</p>
                <p className="text-sm text-gray-500 mt-1">จุดบนแผนที่</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 md:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-black text-gray-900 mb-4 sm:mb-6">
              สนใจวิลล่าหรือผลงานของเรา?
            </h2>
            <p className="text-gray-600 font-body mb-6 sm:mb-8 text-sm sm:text-base">
              ติดต่อเราเพื่อนัดชมสถานที่จริง
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/villas"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 font-headline font-bold text-sm tracking-widest rounded-lg hover:bg-primary-dark transition-all shadow-xl shadow-red-500/20"
              >
                <span className="material-symbols-outlined text-lg">home</span>
                ดูวิลล่าทั้งหมด
              </Link>
              <Link href="/booking"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-8 py-4 font-headline font-bold text-sm tracking-widest rounded-lg hover:border-primary hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-lg">event</span>
                จองคิวนัดชม
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
