'use client'

import { useState, useEffect } from 'react'
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

export default function MapAllLocation() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 80px)', background: '#0a0a0a' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(198,151,63,0.2)', borderTopColor: '#C6973F' }}></div>
          <p className="thai-text" style={{ color: 'rgba(160,160,160,0.5)' }}>กำลังโหลดแผนที่...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="px-5 sm:px-8 md:px-12 py-8 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[0.9] tracking-tighter text-[#F8F5F0] font-headline mb-4">
            แผนที่โครงการทั้งหมด
          </h1>
          <p className="max-w-2xl text-[rgba(248,245,240,0.6)] font-body text-base sm:text-lg leading-relaxed">
            สำรวจโครงการบ้านเดี่ยว พูลวิลล่า BAANMAE VILLA ทั้งหมดได้ในหน้าเดียว ค้นหาโครงการผ่านแผนที่แบบ Interactive ใช้งานง่าย ครบทุกทำเลพัทยา จอมเทียน ห้วยใหญ่ บางเสร่
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="px-5 sm:px-8 md:px-12 mb-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`font-headline text-xs tracking-wider font-bold px-5 py-2.5 rounded-lg transition-all ${
                filter === 'all' ? 'bg-[#C6973F] text-white' : 'bg-[rgba(248,245,240,0.1)] text-[rgba(248,245,240,0.6)] hover:bg-[rgba(248,245,240,0.2)]'
              }`}
            >
              ทั้งหมด ({locations.length})
            </button>
            <button
              onClick={() => setFilter('villa')}
              className={`font-headline text-xs tracking-wider font-bold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                filter === 'villa' ? 'bg-[#C6973F] text-white' : 'bg-[rgba(248,245,240,0.1)] text-[rgba(248,245,240,0.6)] hover:bg-[rgba(248,245,240,0.2)]'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${filter === 'villa' ? 'bg-white' : 'bg-[#C41E3A]'}`}></div>
              วิลล่า ({villaCount})
            </button>
            <button
              onClick={() => setFilter('portfolio')}
              className={`font-headline text-xs tracking-wider font-bold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                filter === 'portfolio' ? 'bg-[#C6973F] text-white' : 'bg-[rgba(248,245,240,0.1)] text-[rgba(248,245,240,0.6)] hover:bg-[rgba(248,245,240,0.2)]'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${filter === 'portfolio' ? 'bg-white' : 'bg-[#D32F2F]'}`}></div>
              ผลงาน ({portfolioCount})
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="px-5 sm:px-8 md:px-12 pb-16 sm:pb-24">
        <div className="max-w-[1400px] mx-auto">
          {filteredLocations.length === 0 ? (
            <div className="flex items-center justify-center h-[500px] bg-[rgba(248,245,240,0.05)] rounded-xl">
              <div className="text-center">
                <span className="material-symbols-outlined text-[rgba(248,245,240,0.3)] text-6xl mb-4 block">location_on</span>
                <p className="text-[rgba(248,245,240,0.6)] font-body">ยังไม่มีข้อมูลตำแหน่ง</p>
                <p className="text-[rgba(248,245,240,0.4)] text-sm mt-2">เพิ่ม latitude/longitude ในหน้าแอดมินเพื่อแสดงหมุดบนแผนที่</p>
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
      </div>

      {/* Info Section */}
      <div className="bg-[rgba(248,245,240,0.03)] py-16 sm:py-24 px-5 sm:px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[rgba(248,245,240,0.05)] p-6 rounded-xl border border-[rgba(248,245,240,0.1)]">
              <div className="w-12 h-12 bg-[#C6973F]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#C6973F]">home</span>
              </div>
              <h3 className="text-lg font-headline font-bold text-[#F8F5F0] mb-2">วิลล่าทั้งหมด</h3>
              <p className="text-3xl font-headline font-black text-[#C6973F]">{villaCount}</p>
              <p className="text-sm text-[rgba(248,245,240,0.5)] mt-1">พร้อมขาย</p>
            </div>

            <div className="bg-[rgba(248,245,240,0.05)] p-6 rounded-xl border border-[rgba(248,245,240,0.1)]">
              <div className="w-12 h-12 bg-[#C6973F]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#C6973F]">photo_library</span>
              </div>
              <h3 className="text-lg font-headline font-bold text-[#F8F5F0] mb-2">ผลงานทั้งหมด</h3>
              <p className="text-3xl font-headline font-black text-[#C6973F]">{portfolioCount}</p>
              <p className="text-sm text-[rgba(248,245,240,0.5)] mt-1">โปรเจกต์ที่เสร็จสิ้น</p>
            </div>

            <div className="bg-[rgba(248,245,240,0.05)] p-6 rounded-xl border border-[rgba(248,245,240,0.1)]">
              <div className="w-12 h-12 bg-[#C6973F]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#C6973F]">location_on</span>
              </div>
              <h3 className="text-lg font-headline font-bold text-[#F8F5F0] mb-2">ตำแหน่งทั้งหมด</h3>
              <p className="text-3xl font-headline font-black text-[#C6973F]">{locations.length}</p>
              <p className="text-sm text-[rgba(248,245,240,0.5)] mt-1">จุดบนแผนที่</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
