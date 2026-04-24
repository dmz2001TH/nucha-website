import prisma from '@/lib/prisma'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import MapClient from './MapClient'

async function getMapData() {
  try {
    const [villas, portfolios] = await Promise.all([
      prisma.villa.findMany({ where: { status: 'AVAILABLE' } }),
      prisma.portfolio.findMany({ where: { status: 'PUBLISHED' } })
    ])
    const locations: Array<{ id: string; name: string; lat: number; lng: number; type: 'villa' | 'portfolio'; image?: string; price?: number; location?: string; link: string }> = []

    villas.forEach(v => {
      if (v.latitude && v.longitude) {
        locations.push({ id: v.id, name: v.name, lat: v.latitude, lng: v.longitude, type: 'villa', image: v.coverImage, price: v.price, location: v.location, link: `/villas/${v.slug}` })
      }
    })
    portfolios.forEach(p => {
      // Portfolio model doesn't have lat/lng in schema, skip if null
      if ((p as Record<string, unknown>).latitude && (p as Record<string, unknown>).longitude) {
        locations.push({ id: p.id, name: p.title, lat: (p as Record<string, unknown>).latitude as number, lng: (p as Record<string, unknown>).longitude as number, type: 'portfolio', image: p.coverImage, location: p.location, link: '/portfolio' })
      }
    })
    return locations
  } catch { return [] }
}

export default async function MapPage() {
  const locations = await getMapData()
  const villaCount = locations.filter(l => l.type === 'villa').length
  const portfolioCount = locations.filter(l => l.type === 'portfolio').length

  return (
    <>
      <Navigation currentPage="map" />
      <main className="pt-20 sm:pt-24 md:pt-32 min-h-screen">
        {/* Hero Section */}
        <section className="px-5 sm:px-8 md:px-12 mb-8 sm:mb-12">
          <div className="max-w-[1400px] mx-auto">
            <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline">แผนที่</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter text-gray-900 font-headline mb-4 sm:mb-6">
              แผนที่ของเรา
            </h1>
            <p className="max-w-2xl text-gray-600 font-body text-base sm:text-lg leading-relaxed">
              ค้นหาวิลล่าและผลงานของเราบนแผนที่ คลิกที่หมุดเพื่อดูรายละเอียด
            </p>
          </div>
        </section>

        <MapClient locations={locations} />

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
            <p className="text-gray-600 font-body mb-6 sm:mb-8 text-sm sm:text-base">ติดต่อเราเพื่อนัดชมสถานที่จริง</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/villas" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 font-headline font-bold text-sm tracking-widest rounded-lg hover:bg-primary-dark transition-all shadow-xl shadow-red-500/20">
                <span className="material-symbols-outlined text-lg">home</span>ดูวิลล่าทั้งหมด
              </Link>
              <Link href="/booking" className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-8 py-4 font-headline font-bold text-sm tracking-widest rounded-lg hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined text-lg">event</span>จองคิวนัดชม
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
