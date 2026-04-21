'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface Page {
  id: string
  title: string
  titleEn?: string
  content: string
  contentEn?: string
  coverImage?: string
}

interface Setting {
  key: string
  value: string
  label: string
  group: string
}

export default function PhilosophyPage() {
  const [page, setPage] = useState<Page | null>(null)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [pageRes, settingsRes] = await Promise.all([
        fetch('/api/pages?slug=philosophy&status=PUBLISHED'),
        fetch('/api/settings?group=philosophy,about,general')
      ])

      const pageData = await pageRes.json()
      const settingsData = await settingsRes.json()

      if (pageData.data && pageData.data.length > 0) {
        setPage(pageData.data[0])
      }

      if (settingsData.data) {
        const settingsMap: Record<string, string> = {}
        settingsData.data.forEach((s: Setting) => {
          settingsMap[s.key] = s.value
        })
        setSettings(settingsMap)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const principles = [
    settings['principle_1'] ? {
      parts: settings['principle_1'].split('||'),
      icon: settings['principle_1'].split('||')[3] || 'architecture'
    } : null,
    settings['principle_2'] ? {
      parts: settings['principle_2'].split('||'),
      icon: settings['principle_2'].split('||')[3] || 'eco'
    } : null,
    settings['principle_3'] ? {
      parts: settings['principle_3'].split('||'),
      icon: settings['principle_3'].split('||')[3] || 'fingerprint'
    } : null,
    settings['principle_4'] ? {
      parts: settings['principle_4'].split('||'),
      icon: settings['principle_4'].split('||')[3] || 'verified'
    } : null,
  ].filter(Boolean)

  const defaultPrinciples = [
    {
      number: '01',
      title: 'ความเป็นเลิศทางสถาปัตยกรรม',
      titleEn: 'Architectural Excellence',
      description: 'เราออกแบบด้วยความใส่ใจในทุกรายละเอียด ตั้งแต่การเลือกใช้วัสดุระดับพรีเมียม ไปจนถึงการจัดวางพื้นที่ที่คำนึงถึงการใช้ชีวิตจริง',
      icon: 'architecture'
    },
    {
      number: '02',
      title: 'นวัตกรรมที่ยั่งยืน',
      titleEn: 'Sustainable Innovation',
      description: 'เราผสานเทคโนโลยีสมัยใหม่เข้ากับหลักการออกแบบที่เป็นมิตรต่อสิ่งแวดล้อม เพื่ออนาคตที่ดีกว่า',
      icon: 'eco'
    },
    {
      number: '03',
      title: 'เอกลักษณ์เฉพาะตัว',
      titleEn: 'Unique Identity',
      description: 'แต่ละโครงการของเราไม่เหมือนใคร เพราะเราเชื่อว่าบ้านควรสะท้อนตัวตนและค่านิยมของผู้อยู่อาศัย',
      icon: 'fingerprint'
    },
    {
      number: '04',
      title: 'คุณภาพระดับสากล',
      titleEn: 'International Standards',
      description: 'เรายึดมั่นในมาตรฐานระดับสากล ตั้งแต่การออกแบบไปจนถึงการก่อสร้างและการบริการหลังการขาย',
      icon: 'verified'
    }
  ]

  if (loading) {
    return (
      <>
        <Navigation currentPage="philosophy" />
        <main className="pt-20 sm:pt-24 md:pt-32 min-h-screen">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-2 gap-8 h-[400px]">
                <div className="bg-gray-200 rounded-xl"></div>
                <div className="bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation currentPage="philosophy" />
      <main className="pt-20 sm:pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="relative px-5 sm:px-8 md:px-12 mb-16 sm:mb-24 overflow-hidden">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline">
                วิสัยทัศน์ของเรา
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter text-gray-900 font-headline mb-6 sm:mb-8">
                {page?.title || 'ปรัชญา'} <br />
                <span className="text-primary">{page?.titleEn || 'ของเรา'}</span>
              </h1>
              {page?.content ? (
                <div className="text-gray-600 font-body text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 whitespace-pre-line">
                  {page.content}
                </div>
              ) : (
                <p className="text-gray-600 font-body text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  ที่ NUCHA INNOVATION VILL PATTAYA เราเชื่อว่าบ้านไม่ใช่แค่ที่อยู่อาศัย แต่เป็นสถานที่ที่สะท้อนตัวตนและคุณค่าของผู้อยู่ เราจึงออกแบบด้วยความเข้าใจในความต้องการที่แท้จริงของคุณ
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a href="/contact" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 font-headline font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-dark transition-all">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  ติดต่อเรา
                </a>
                <a href="/portfolio" className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 sm:px-8 py-3 font-headline font-bold text-xs tracking-widest uppercase rounded-lg hover:border-primary hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  ดูผลงาน
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                alt="Our Philosophy"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-xl editorial-shadow"
                src={page?.coverImage || settings['about_image'] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
              />
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-primary text-white p-4 sm:p-6 rounded-xl shadow-xl">
                <p className="text-3xl sm:text-4xl font-headline font-black">{settings['years_experience'] || '10+'}</p>
                <p className="text-xs sm:text-sm font-body">ปีประสบการณ์</p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles Section */}
        <section className="bg-gray-50 py-16 sm:py-24 px-5 sm:px-8 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-gray-900 mb-3 sm:mb-4">
                หลักการของเรา
              </h2>
              <p className="text-gray-600 font-body max-w-2xl mx-auto text-sm sm:text-base">
                หลักการที่เรายึดถือในการทำงานทุกโครงการ
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {principles.length > 0 ? principles.map((p, index) => {
                const parts = p?.parts || []
                const principleData = {
                  number: `0${index + 1}`,
                  title: parts[0] || defaultPrinciples[index]?.title,
                  titleEn: parts[1] || defaultPrinciples[index]?.titleEn,
                  description: parts[2] || defaultPrinciples[index]?.description,
                  icon: p?.icon || defaultPrinciples[index]?.icon
                }
                return (
                  <div key={index} className="bg-white p-6 sm:p-8 rounded-xl editorial-shadow hover:shadow-2xl transition-shadow duration-500 group">
                    <div className="flex gap-4 sm:gap-6">
                      <div className="flex-shrink-0">
                        <span className="text-4xl sm:text-5xl md:text-6xl font-headline font-black text-primary/20 group-hover:text-primary/40 transition-colors">
                          {principleData.number}
                        </span>
                      </div>
                      <div>
                        <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-3 sm:mb-4 block">{principleData.icon}</span>
                        <h3 className="text-lg sm:text-xl font-headline font-black text-gray-900 mb-1 sm:mb-2">{principleData.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-headline mb-2 sm:mb-3">{principleData.titleEn}</p>
                        <p className="text-gray-600 font-body leading-relaxed text-sm sm:text-base">{principleData.description}</p>
                      </div>
                    </div>
                  </div>
                )
              }) : defaultPrinciples.map((principle, index) => (
                <div key={index} className="bg-white p-6 sm:p-8 rounded-xl editorial-shadow hover:shadow-2xl transition-shadow duration-500 group">
                  <div className="flex gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <span className="text-4xl sm:text-5xl md:text-6xl font-headline font-black text-primary/20 group-hover:text-primary/40 transition-colors">
                        {principle.number}
                      </span>
                    </div>
                    <div>
                      <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-3 sm:mb-4 block">{principle.icon}</span>
                      <h3 className="text-lg sm:text-xl font-headline font-black text-gray-900 mb-1 sm:mb-2">{principle.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 font-headline mb-2 sm:mb-3">{principle.titleEn}</p>
                      <p className="text-gray-600 font-body leading-relaxed text-sm sm:text-base">{principle.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <img
                  alt="Our Story"
                  className="w-full h-[300px] sm:h-[400px] object-cover rounded-xl editorial-shadow"
                  src={settings['story_image'] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'}
                />
              </div>
              <div className="order-1 lg:order-2">
                <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline">
                  เรื่องราวของเรา
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-gray-900 mb-4 sm:mb-6">
                  เรื่องราวของเรา
                </h2>
                {settings['story_content'] ? (
                  <div className="space-y-3 sm:space-y-4 text-gray-600 font-body leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {settings['story_content']}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 text-gray-600 font-body leading-relaxed text-sm sm:text-base">
                    <p>
                      NUCHA INNOVATION VILL PATTAYA ก่อตั้งขึ้นจากความเชื่อที่ว่าสถาปัตยกรรมที่ดีควรเป็นมากกว่าแค่อาคาร แต่ควรเป็นสถานที่ที่สร้างแรงบันดาลใจและเติมเต็มชีวิต
                    </p>
                    <p>
                      ด้วยประสบการณ์กว่า 10 ปีในวงการอสังหาริมทรัพย์ระดับพรีเมียมในพัทยา เราได้สร้างสรรค์วิลล่าและโครงการที่อยู่อาศัยที่โดดเด่นมากมาย
                    </p>
                    <p>
                      ทีมงานของเราประกอบด้วยสถาปนิก นักออกแบบ และวิศวกรที่มีความเชี่ยวชาญและหลงใหลในงานสร้างสรรค์
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {settings['team_content'] && (
          <section className="bg-gray-50 py-16 sm:py-24 px-5 sm:px-8 md:px-12">
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center mb-10 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-gray-900 mb-3 sm:mb-4">
                  ทีมของเรา
                </h2>
                <p className="text-gray-600 font-body max-w-2xl mx-auto text-sm sm:text-base">
                  ผู้เชี่ยวชาญที่พร้อมสร้างสรรค์บ้านในฝันของคุณ
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-xl editorial-shadow">
                <div className="prose prose-lg max-w-none text-gray-600 font-body">
                  {settings['team_content']}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 md:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-black text-gray-900 mb-4 sm:mb-6">
              พร้อมเริ่มต้นการเดินทางกับเรา?
            </h2>
            <p className="text-gray-600 font-body mb-6 sm:mb-8 text-sm sm:text-base">
              ติดต่อเราเพื่อปรึกษาเกี่ยวกับบ้านในฝันของคุณ
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-8 sm:px-12 py-3 sm:py-4 font-headline font-bold text-xs sm:text-sm tracking-widest uppercase rounded-lg hover:bg-primary-dark transition-all shadow-xl shadow-red-500/20">
              <span className="material-symbols-outlined text-[18px]">mail</span>
              ติดต่อเรา
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
