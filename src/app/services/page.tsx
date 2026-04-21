'use client'

import Link from 'next/link'
import Image from 'next/image'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface Service {
  id: string
  title: string
  titleEn: string | null
  description: string | null
  icon: string | null
  coverImage: string | null
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services?status=PUBLISHED')
      const data = await res.json()
      if (data.data && data.data.length > 0) {
        setServices(data.data)
      } else {
        // Fallback to default services
        setServices([
          { id: '1', title: 'รับเหมาก่อสร้าง', titleEn: 'Construction', description: 'บริการรับเหมาก่อสร้างครบวงจร สำหรับบ้าน วิลล่า และโครงการพาณิชย์ ด้วยทีมงานมืออาชีพและมาตรฐานการก่อสร้างระดับสากล', icon: 'construction', coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800' },
          { id: '2', title: 'งานเฟอร์นิเจอร์ built-in', titleEn: 'Built-in Furniture', description: 'ออกแบบและติดตั้งเฟอร์นิเจอร์ built-in ตามความต้องการ ไม่ว่าจะเป็นครัว ตู้เสื้อผ้า ชั้นวาง ด้วยวัสดุคุณภาพสูง', icon: 'chair', coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
          { id: '3', title: 'งานผ้าม่าน วอลเปเปอร์', titleEn: 'Curtains & Wallpaper', description: 'บริการติดตั้งผ้าม่านและวอลเปเปอร์หลากหลายลาย พร้อมให้คำปรึกษาการเลือกแบบฟรี', icon: 'curtains', coverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f56d0?w=800' },
          { id: '4', title: 'งานปูกระเบื้อง', titleEn: 'Tiling', description: 'บริการปูกระเบื้องทุกประเภท ทั้งกระเบื้องยาง หินอ่อน หินแกรนิต ด้วยช่างผู้เชี่ยวชาญ', icon: 'grid_on', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800' },
          { id: '5', title: 'ทำโครงการขาย', titleEn: 'Sales Projects', description: 'พัฒนาและบริหารโครงการอสังหาริมทรัพย์ ตั้งแต่ขั้นตอนการวางแผน ออกแบบ จนถึงการขาย', icon: 'trending_up', coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800' },
          { id: '6', title: 'รับบริหารงานขายโครงการ', titleEn: 'Sales Project Management', description: 'บริหารจัดการทีมขายและการตลาดสำหรับโครงการอสังหาริมทรัพย์', icon: 'business', coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800' },
          { id: '7', title: 'งานออกแบบ งานก่อสร้าง ครบวงจร', titleEn: 'Comprehensive Design & Construction', description: 'บริการออกแบบและก่อสร้างครบวงจร ตั้งแต่ไอเดียจนถึงสิ่งที่คุณได้รับ', icon: 'architecture', coverImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800' },
          { id: '8', title: 'งานกราฟิกดีไซน์', titleEn: 'Graphic Design', description: 'บริการออกแบบกราฟิกสำหรับธุรกิจ ไม่ว่าจะเป็นโลโก้ แบรนด์ สื่อสิ่งพิมพ์', icon: 'design_services', coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800' },
          { id: '9', title: 'งานออกแบบภายใน-ภายนอก ตกแต่ง', titleEn: 'Interior & Exterior Design', description: 'ออกแบบตกแต่งภายในและภายนอก สร้างสรรค์พื้นที่ที่สวยงามและใช้งานได้จริง', icon: 'interior_design', coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800' }
        ])
      }
    } catch {
      setServices([
        { id: '1', title: 'รับเหมาก่อสร้าง', titleEn: 'Construction', description: 'บริการรับเหมาก่อสร้างครบวงจร สำหรับบ้าน วิลล่า และโครงการพาณิชย์ ด้วยทีมงานมืออาชีพและมาตรฐานการก่อสร้างระดับสากล', icon: 'construction', coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800' },
        { id: '2', title: 'งานเฟอร์นิเจอร์ built-in', titleEn: 'Built-in Furniture', description: 'ออกแบบและติดตั้งเฟอร์นิเจอร์ built-in ตามความต้องการ ไม่ว่าจะเป็นครัว ตู้เสื้อผ้า ชั้นวาง ด้วยวัสดุคุณภาพสูง', icon: 'chair', coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
        { id: '3', title: 'งานผ้าม่าน วอลเปเปอร์', titleEn: 'Curtains & Wallpaper', description: 'บริการติดตั้งผ้าม่านและวอลเปเปอร์หลากหลายลาย พร้อมให้คำปรึกษาการเลือกแบบฟรี', icon: 'curtains', coverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f56d0?w=800' },
        { id: '4', title: 'งานปูกระเบื้อง', titleEn: 'Tiling', description: 'บริการปูกระเบื้องทุกประเภท ทั้งกระเบื้องยาง หินอ่อน หินแกรนิต ด้วยช่างผู้เชี่ยวชาญ', icon: 'grid_on', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800' },
        { id: '5', title: 'ทำโครงการขาย', titleEn: 'Sales Projects', description: 'พัฒนาและบริหารโครงการอสังหาริมทรัพย์ ตั้งแต่ขั้นตอนการวางแผน ออกแบบ จนถึงการขาย', icon: 'trending_up', coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800' },
        { id: '6', title: 'รับบริหารงานขายโครงการ', titleEn: 'Sales Project Management', description: 'บริหารจัดการทีมขายและการตลาดสำหรับโครงการอสังหาริมทรัพย์', icon: 'business', coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800' },
        { id: '7', title: 'งานออกแบบ งานก่อสร้าง ครบวงจร', titleEn: 'Comprehensive Design & Construction', description: 'บริการออกแบบและก่อสร้างครบวงจร ตั้งแต่ไอเดียจนถึงสิ่งที่คุณได้รับ', icon: 'architecture', coverImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800' },
        { id: '8', title: 'งานกราฟิกดีไซน์', titleEn: 'Graphic Design', description: 'บริการออกแบบกราฟิกสำหรับธุรกิจ ไม่ว่าจะเป็นโลโก้ แบรนด์ สื่อสิ่งพิมพ์', icon: 'design_services', coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800' },
        { id: '9', title: 'งานออกแบบภายใน-ภายนอก ตกแต่ง', titleEn: 'Interior & Exterior Design', description: 'ออกแบบตกแต่งภายในและภายนอก สร้างสรรค์พื้นที่ที่สวยงามและใช้งานได้จริง', icon: 'interior_design', coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const defaultFeatures: Record<string, string[]> = {
    'รับเหมาก่อสร้าง': ['รับเหมาก่อสร้างบ้านเดี่ยว วิลล่า', 'ควบคุมคุณภาพตามมาตรฐาน', 'บริหารงบประมาณและเวลา', 'ทีมงานมืออาชีพ'],
    'งานเฟอร์นิเจอร์ built-in': ['ออกแบบตามสั่ง', 'ใช้วัสดุคุณภาพสูง', 'ผลิตด้วยเครื่องจักร CNC', 'รับประกัน 1 ปี'],
    'งานผ้าม่าน วอลเปเปอร์': ['ผ้าม่านทุกประเภท', 'วอลเปเปอร์หลากหลายลาย', 'ให้คำปรึกษาฟรี', 'วัดและติดตั้งที่บ้าน'],
    'งานปูกระเบื้อง': ['กระเบื้องทุกประเภท', 'ช่างผู้เชี่ยวชาญ', 'วางแผนให้สวยงาม', 'รับประกัน 1 ปี'],
    'ทำโครงการขาย': ['วางแผนโครงการ', 'ออกแบบและก่อสร้าง', 'วางแผนการตลาด', 'บริหารจัดการครบวงจร'],
    'รับบริหารงานขายโครงการ': ['บริหารทีมขาย', 'วางกลยุทธ์การขาย', 'ฝึกอบรมทีม', 'ติดตามและรายงานผล'],
    'งานออกแบบ งานก่อสร้าง ครบวงจร': ['ออกแบบครบวงจร', 'รับเหมาก่อสร้าง', 'ควบคุมคุณภาพ', 'ส่งมอบพร้อมใช้งาน'],
    'งานกราฟิกดีไซน์': ['ออกแบบโลโก้', 'สื่อสิ่งพิมพ์', 'สื่อดิจิทัล', 'แก้ไขจนพอใจ'],
    'งานออกแบบภายใน-ภายนอก ตกแต่ง': ['ออกแบบภายใน', 'ออกแบบภายนอก', 'จัดหาเฟอร์นิเจอร์', '3D ภาพจำลอง']
  }

  const defaultProcess = [
    { step: '01', title: 'ปรึกษา', desc: 'พูดคุยความต้องการ' },
    { step: '02', title: 'ออกแบบ', desc: 'สร้าง concept design' },
    { step: '03', title: 'พัฒนา', desc: 'พัฒนาแบบให้สมบูรณ์' },
    { step: '04', title: 'ดำเนินการ', desc: 'ติดตั้งและควบคุมคุณภาพ' }
  ]

  if (loading) {
    return (
      <>
        <Navigation currentPage="services" />
        <main className="pt-20 sm:pt-24 md:pt-32">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-[400px] bg-gray-200 rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  const currentService = services[0]
  const features = defaultFeatures[currentService?.title] || defaultFeatures['ออกแบบภายใน'] || []

  return (
    <>
      <Navigation currentPage="services" />
      <main className="pt-20 sm:pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="px-5 sm:px-8 md:px-12 mb-12 sm:mb-16">
          <div className="max-w-[1400px] mx-auto">
            <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline">
              สิ่งที่เราทำ
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter text-gray-900 font-headline mb-4 sm:mb-6">
              บริการ
            </h1>
            <p className="max-w-2xl text-gray-600 font-body text-base sm:text-lg leading-relaxed">
              บริการออกแบบครบวงจร ตั้งแต่แนวคิดจนถึงการก่อสร้าง
            </p>
          </div>
        </section>

          {/* Service Tabs */}
        <section className="px-5 sm:px-8 md:px-12 mb-12 sm:mb-16">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <a
                  key={service.id}
                  href={`/services/${encodeURIComponent(service.title)}`}
                  className="group relative overflow-hidden rounded-xl editorial-shadow"
                >
                  <Image
                    src={service.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800'}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover sm:opacity-70 sm:grayscale-[40%] sm:group-hover:opacity-100 sm:group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{textShadow: '0 1px 4px rgba(0,0,0,0.7)'}}>
                    <p className="text-white font-headline font-black text-sm leading-tight mb-1 drop-shadow-lg">{service.title}</p>
                    <p className="text-white/90 font-body text-xs leading-relaxed line-clamp-2 drop-shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">{service.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Active Service Content */}
        {currentService && (
          <section className="px-5 sm:px-8 md:px-12 mb-12 sm:mb-16">
            <div className="max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl editorial-shadow">
                  <Image
                    src={currentService.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800'}
                    alt={currentService.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover grayscale-0 sm:opacity-70 sm:grayscale-[40%] sm:hover:opacity-100 sm:hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-3">
                    {currentService.icon && (
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">{currentService.icon}</span>
                      </div>
                    )}
                    <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-headline font-bold text-gray-900">
                      {currentService.title}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline">
                    บริการของเรา
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-gray-900 mb-2 sm:mb-3">
                    {currentService.title}
                  </h2>
                  <p className="text-gray-600 font-body text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    {currentService.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6 sm:mb-8">
                    <h4 className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase font-bold text-gray-500 mb-3 sm:mb-4 font-headline">
                      สิ่งที่คุณจะได้รับ
                    </h4>
                    <ul className="space-y-2 sm:space-y-3">
                      {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3">
                          <span className="material-symbols-outlined text-primary text-[18px] sm:text-xl mt-0.5">check_circle</span>
                          <span className="text-gray-600 font-body text-sm sm:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 font-headline font-bold text-sm tracking-widest rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-red-500/20">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    สอบถามบริการนี้
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Process Section */}
        <section className="bg-gray-50 py-16 sm:py-24 px-5 sm:px-8 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-gray-900 mb-3 sm:mb-4">
                ขั้นตอนการทำงาน
              </h2>
              <p className="text-gray-600 font-body text-sm sm:text-base">
                กระบวนการที่เป็นระบบเพื่อผลลัพธ์ที่ดีที่สุด
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {defaultProcess.map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl sm:text-4xl font-headline font-black text-primary/20">{step.step}</span>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">{['psychiatry', 'draw', 'auto_awesome', 'verified'][index]}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-headline font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 font-body">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
