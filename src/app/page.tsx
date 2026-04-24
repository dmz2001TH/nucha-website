import Link from 'next/link'
import prisma from '@/lib/prisma'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

// Server-side data fetching
async function getHeroSettings() {
  try {
    const settings = await prisma.setting.findMany({ where: { group: 'hero' } })
    const map: Record<string, string> = {}
    settings.forEach(s => { map[s.key] = s.value })
    return map
  } catch { return {} }
}

async function getServices() {
  try {
    const data = await prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      take: 4
    })
    return data.map(s => ({
      title: s.title,
      slug: s.slug,
      description: s.description || '',
      image: s.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800'
    }))
  } catch { return [] }
}

async function getPortfolios() {
  try {
    const data = await prisma.portfolio.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      take: 4
    })
    const gridStyles = [
      { gridColumn: 'span 4', gridRow: 'span 2' },
      { gridColumn: 'span 8', gridRow: 'span 1' },
      { gridColumn: 'span 4', gridRow: 'span 1' },
      { gridColumn: 'span 4', gridRow: 'span 1' },
    ]
    return data.map((p, i) => ({
      title: p.title,
      location: `${p.location}, ${p.year}`,
      image: p.coverImage,
      slug: p.slug,
      gridStyle: gridStyles[i] || { gridColumn: 'span 4', gridRow: 'span 1' }
    }))
  } catch { return [] }
}

// ISR cache: revalidate every 1 hour (3600s)
export const revalidate = 3600

// Hero Section
function HeroSection({ heroSettings }: { heroSettings: Record<string, string> }) {
  const heroBrand = heroSettings.hero_brand || 'NUCHA VILL.'
  const heroBrandHighlight = heroSettings.hero_brand_highlight || 'VILL.'
  const heroBrandPrefix = heroBrand.replace(heroBrandHighlight, '').trim()
  const tagline = heroSettings.hero_tagline || 'สถาปัตยกรรมแห่งอนาคต'
  const description = heroSettings.hero_description || 'การผสมผสานความหรูหราเข้ากับความแม่นยำทางวิศวกรรม สร้างสรรค์พื้นที่อยู่อาศัยที่อยู่เหนือความคาดหมายในพัทยา'
  const stat1Value = heroSettings.hero_stat1_value || '10+'
  const stat1Label = heroSettings.hero_stat1_label || 'ปีประสบการณ์'
  const stat2Value = heroSettings.hero_stat2_value || '50+'
  const stat2Label = heroSettings.hero_stat2_label || 'โครงการสำเร็จ'
  const sidebarProject = heroSettings.hero_sidebar_project || 'เดอะ โมโนลิธ เฮาส์'
  const sidebarStatus = heroSettings.hero_sidebar_status || 'เสร็จสิ้น 2024'
  const heroImage = heroSettings.hero_image || 'https://console.baanmaevilla.com/uploads/LINE_ALBUM_6_Type_B_18_182a78a5c2.jpg'

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-16 md:pt-20 bg-white">
      <div className="absolute inset-0 z-0">
        <img
          alt="Luxury Villa Architectural View"
          className="w-full h-full object-cover opacity-50 sm:opacity-55 grayscale"
          src={heroImage}
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-white/80 sm:via-white/70 to-transparent" />
      </div>

      <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-end pb-12 md:pb-0">
        <div className="lg:col-span-7 xl:col-span-8">
          <span className="text-primary text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline" style={{textShadow: '2px 2px 0px white'}}>
            {tagline}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[8rem] font-black leading-[0.9] tracking-tighter text-gray-900 font-headline" style={{textShadow: '3px 3px 0px white'}}>
            {heroBrandPrefix} <br /> <span className="text-primary">{heroBrandHighlight}</span>
          </h1>
          <p className="max-w-xl text-gray-900 font-body font-semibold text-base sm:text-lg mt-6 sm:mt-8 leading-relaxed" style={{textShadow: '2px 2px 0px white'}}>
            {description}
          </p>

          {/* Mobile Stats */}
          <div className="flex gap-6 mt-8 lg:hidden">
            <div>
              <p className="text-2xl font-headline font-black text-primary" style={{textShadow: '2px 2px 0px white'}}>{stat1Value}</p>
              <p className="text-xs text-gray-900 font-body font-semibold" style={{textShadow: '2px 2px 0px white'}}>{stat1Label}</p>
            </div>
            <div>
              <p className="text-2xl font-headline font-black text-primary" style={{textShadow: '2px 2px 0px white'}}>{stat2Value}</p>
              <p className="text-xs text-gray-900 font-body font-semibold" style={{textShadow: '2px 2px 0px white'}}>{stat2Label}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 hidden lg:block">
          <div className="border-l-2 border-primary/20 pl-8 space-y-6">
            <Link href="/portfolio" className="group cursor-pointer block">
              <span className="block text-[0.65rem] tracking-widest text-primary font-bold uppercase mb-1 font-headline">แบบ</span>
              <h3 className="text-xl font-headline text-gray-900 group-hover:text-primary transition-colors">{sidebarProject}</h3>
            </Link>
            <Link href="/portfolio" className="group cursor-pointer block">
              <span className="block text-[0.65rem] tracking-widest text-primary font-bold uppercase mb-1 font-headline">สถานะ</span>
              <h3 className="text-xl font-headline text-gray-900 group-hover:text-primary transition-colors">{sidebarStatus}</h3>
            </Link>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-4xl font-headline font-black text-primary" style={{textShadow: '2px 2px 0px white'}}>{stat1Value}</p>
              <p className="text-sm text-gray-900 font-body font-semibold" style={{textShadow: '2px 2px 0px white'}}>{stat1Label}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}

// Services Accordion Section
function ServicesSection({ services }: { services: Array<{ title: string; description: string; image: string; slug: string }> }) {
  return (
    <section className="bg-white pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 px-5 sm:px-8 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-gray-900 uppercase tracking-tighter">
            บริการ
          </h2>
          <p className="text-primary font-body mt-2 tracking-widest text-xs sm:text-sm font-bold">
            บริการออกแบบครบวงจร
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div
                key={index}
                className="accordion-item group relative overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
              >
                <img
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-70 sm:group-hover:opacity-100"
                  src={service.image}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3" style={{textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>
                  <h3 className="text-sm sm:text-base font-headline font-black text-white drop-shadow-lg leading-tight">
                    {service.title}
                  </h3>
                  <div className="overflow-hidden transition-all duration-500 max-h-0 opacity-0 sm:group-hover:max-h-40 sm:group-hover:opacity-100 sm:group-hover:mt-2">
                    <p className="text-xs text-white/90 leading-relaxed line-clamp-2 drop-shadow-md">
                      {service.description}
                    </p>
                    <a
                      href={`/services/${encodeURIComponent(service.slug)}`}
                      className="mt-2 inline-block font-headline text-[0.6rem] tracking-[0.2em] uppercase font-bold transition-all duration-300 px-3 py-1.5 border rounded text-white border-white hover:bg-white hover:text-primary"
                    >
                      เรียนรู้เพิ่มเติม
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-gray-400">ยังไม่มีบริการ</span>
            </div>
          )}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <Link href="/services"
            className="inline-flex items-center gap-3 bg-primary text-white px-8 sm:px-10 py-4 font-headline font-bold text-sm tracking-wider rounded-xl hover:bg-primary-dark transition-all shadow-xl shadow-red-500/20"
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            ดูบริการทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  )
}

// Portfolio Section
function PortfolioSection({ projects }: { projects: Array<{ title: string; location: string; image: string; gridStyle: { gridColumn: string; gridRow: string }; slug: string }> }) {
  return (
    <section className="bg-white pt-0 sm:pt-4 md:pt-8 pb-8 sm:pb-12 px-5 sm:px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 sm:mb-16 border-b border-gray-200 pb-6 sm:pb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-gray-900 uppercase tracking-tighter">
              ผลงาน
            </h2>
            <p className="text-primary font-body mt-2 tracking-widest text-xs sm:text-sm font-bold">
              ผลงานการออกแบบที่โดดเด่น
            </p>
          </div>
          <Link href="/portfolio" className="text-xs font-headline tracking-[0.3em] uppercase font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
            ดูทั้งหมด <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row lg:grid lg:grid-cols-12 gap-4 sm:gap-4 lg:gap-6 lg:auto-rows-[300px]">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div
                key={index}
                className="accordion-item group relative overflow-hidden rounded-xl editorial-shadow cursor-pointer"
              >
                <img
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-700 grayscale-0 sm:opacity-70 sm:grayscale-[40%] sm:group-hover:opacity-100 sm:group-hover:grayscale-0 sm:group-hover:scale-110"
                  src={project.image}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3" style={{textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>
                  <h4 className="text-sm sm:text-base font-headline font-black text-white drop-shadow-lg leading-tight">
                    {project.title}
                  </h4>
                  <div className="overflow-hidden transition-all duration-500 max-h-0 opacity-0 sm:group-hover:max-h-40 sm:group-hover:opacity-100 sm:group-hover:mt-2">
                    <span className="text-white/80 text-[0.6rem] tracking-widest font-bold font-headline block mb-1">
                      {project.location}
                    </span>
                    <a
                      href={`/portfolio/${project.slug}`}
                      className="mt-1 w-fit inline-block font-headline text-[0.6rem] tracking-[0.2em] uppercase font-bold transition-all duration-300 px-3 py-1.5 border rounded text-white border-white hover:bg-white hover:text-primary"
                    >
                      ดูรายละเอียด
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">photo_library</span>
              <p className="text-gray-500">ยังไม่มีผลงาน</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Contact / Booking Section
function ContactSection() {
  return (
    <section className="bg-white pt-12 sm:pt-16 pb-16 sm:pb-24 md:pb-32 px-5 sm:px-8 md:px-12">
      <div className="max-w-[1200px] mx-auto bg-gray-50 p-6 sm:p-8 md:p-12 lg:p-24 relative overflow-hidden rounded-2xl border-t-4 border-primary shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-headline font-black text-gray-900 leading-tight mb-6 sm:mb-8">
              เริ่มสร้าง <br />
              <span className="text-primary underline decoration-2 underline-offset-8">วิสัยทัศน์</span> ของคุณ
            </h2>
            <p className="text-gray-600 font-body mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              รับคำปรึกษาพิเศษจากทีมสถาปนิกและนักออกแบบมืออาชีพของเรา เพื่อสร้างสรรค์บ้านในฝัน
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-900">
                <span className="material-symbols-outlined text-primary">call</span>
                <span className="text-sm font-bold">+66 (0) 81-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-4 text-gray-900">
                <span className="material-symbols-outlined text-primary">mail</span>
                <span className="text-sm font-bold break-all sm:break-normal">concierge@nucha-innovation.com</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[0.65rem] tracking-widest text-primary font-bold uppercase font-headline">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  placeholder="ชื่อเต็มของคุณ"
                  className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-primary focus:ring-0 text-gray-900 placeholder:text-gray-400 transition-all py-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.65rem] tracking-widest text-primary font-bold uppercase font-headline">ความสนใจ</label>
                <select className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-primary focus:ring-0 text-gray-900 transition-all py-3">
                  <option className="bg-white">ออกแบบบ้านพักอาศัย</option>
                  <option className="bg-white">โครงการพาณิชย์</option>
                  <option className="bg-white">ปรึกษาออกแบบภายใน</option>
                </select>
              </div>
              <Link href="/booking"
                className="block w-full bg-primary text-white font-headline font-bold py-3.5 sm:py-4 uppercase tracking-[0.2em] rounded-lg hover:bg-primary-dark transition-all shadow-xl shadow-red-500/20 text-sm sm:text-base text-center"
              >
                จองคิวปรึกษา
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-24 -right-24 w-48 sm:w-64 h-48 sm:h-64 border-[1px] border-primary/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <span className="text-[200px] sm:text-[350px] lg:text-[500px] font-black text-primary font-headline">N</span>
        </div>
      </div>
    </section>
  )
}

// Main Home Page - Server Component
export default async function Home() {
  const [heroSettings, services, projects] = await Promise.all([
    getHeroSettings(),
    getServices(),
    getPortfolios()
  ])

  return (
    <>
      <Navigation currentPage="home" />
      <main>
        <HeroSection heroSettings={heroSettings} />
        <ServicesSection services={services} />
        <PortfolioSection projects={projects} />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
