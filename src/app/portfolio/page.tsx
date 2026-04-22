import prisma from '@/lib/prisma'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PortfolioClient from './PortfolioClient'

async function getPortfolios() {
  try {
    const data = await prisma.portfolio.findMany({
      include: { images: true },
      orderBy: { sortOrder: 'asc' }
    })
    return data.map(p => ({
      id: p.id, slug: p.slug, title: p.title, titleEn: p.titleEn ?? undefined,
      description: p.description, location: p.location, year: p.year,
      category: p.category, status: p.status, featured: p.featured,
      coverImage: p.coverImage,
      images: p.images.map(img => ({ id: img.id, url: img.url, alt: img.alt ?? '' }))
    }))
  } catch { return [] }
}

export default async function PortfolioPage() {
  const projects = await getPortfolios()

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

        <PortfolioClient projects={projects} />
      </main>
      <Footer />
    </>
  )
}
