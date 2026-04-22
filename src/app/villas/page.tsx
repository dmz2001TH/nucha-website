import prisma from '@/lib/prisma'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import VillasClient from './VillasClient'

async function getVillas() {
  try {
    const data = await prisma.villa.findMany({
      include: { images: true },
      orderBy: { sortOrder: 'asc' }
    })
    return data.map(v => ({
      id: v.id, name: v.name, nameEn: v.nameEn ?? undefined, slug: v.slug,
      description: v.description, location: v.location, price: v.price,
      bedrooms: v.bedrooms, bathrooms: v.bathrooms, area: v.area,
      status: v.status, featured: v.featured, coverImage: v.coverImage,
      images: v.images.map(img => ({ id: img.id, url: img.url, alt: img.alt ?? '' }))
    }))
  } catch { return [] }
}

export default async function VillasPage() {
  const villas = await getVillas()

  return (
    <>
      <Navigation currentPage="villas" />
      <main className="pt-20 sm:pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="px-5 sm:px-8 md:px-12 mb-12 sm:mb-16">
          <div className="max-w-[1400px] mx-auto">
            <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline">
              อสังหาริมทรัพย์ระดับพรีเมียม
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter text-gray-900 font-headline mb-4 sm:mb-6">
              วิลล่า
            </h1>
            <p className="max-w-2xl text-gray-600 font-body text-base sm:text-lg leading-relaxed">
              ค้นพบวิลล่าสุดหรูของเราในพัทยา แต่ละหลังได้รับการออกแบบด้วยความใส่ใจในทุกรายละเอียด
            </p>
          </div>
        </section>

        <VillasClient villas={villas} />
      </main>
      <Footer />
    </>
  )
}
