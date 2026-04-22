'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), { ssr: false })

interface MapLocation {
  id: string; name: string; lat: number; lng: number; type: 'villa' | 'portfolio'
  image?: string; price?: number; location?: string; link: string
}

export default function MapClient({ locations }: { locations: MapLocation[] }) {
  const [filter, setFilter] = useState<'all' | 'villa' | 'portfolio'>('all')

  const filteredLocations = filter === 'all' ? locations : locations.filter(loc => loc.type === filter)
  const villaCount = locations.filter(l => l.type === 'villa').length
  const portfolioCount = locations.filter(l => l.type === 'portfolio').length

  return (
    <>
      {/* Filter */}
      <section className="px-5 sm:px-8 md:px-12 mb-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setFilter('all')}
              className={`font-headline text-xs tracking-wider font-bold px-5 py-2.5 rounded-lg transition-all ${
                filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>ทั้งหมด ({locations.length})</button>
            <button onClick={() => setFilter('villa')}
              className={`font-headline text-xs tracking-wider font-bold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                filter === 'villa' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              <div className={`w-3 h-3 rounded-full ${filter === 'villa' ? 'bg-white' : 'bg-[#C41E3A]'}`}></div>
              วิลล่า ({villaCount})
            </button>
            <button onClick={() => setFilter('portfolio')}
              className={`font-headline text-xs tracking-wider font-bold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                filter === 'portfolio' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              <div className={`w-3 h-3 rounded-full ${filter === 'portfolio' ? 'bg-white' : 'bg-[#D32F2F]'}`}></div>
              ผลงาน ({portfolioCount})
            </button>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="px-5 sm:px-8 md:px-12 pb-16 sm:pb-24">
        <div className="max-w-[1400px] mx-auto">
          {filteredLocations.length === 0 ? (
            <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-xl">
              <div className="text-center">
                <span className="material-symbols-outlined text-gray-300 text-6xl mb-4 block">location_on</span>
                <p className="text-gray-500 font-body">ยังไม่มีข้อมูลตำแหน่ง</p>
                <p className="text-gray-400 text-sm mt-2">เพิ่ม latitude/longitude ในหน้าแอดมินเพื่อแสดงหมุดบนแผนที่</p>
              </div>
            </div>
          ) : (
            <InteractiveMap locations={filteredLocations} height="600px" className="rounded-xl overflow-hidden shadow-lg" />
          )}
        </div>
      </section>
    </>
  )
}
