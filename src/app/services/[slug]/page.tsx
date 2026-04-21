'use client'

import { useState, useEffect, use } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface Service {
  id: string
  title: string
  titleEn: string | null
  description: string | null
  descriptionEn: string | null
  icon: string | null
  coverImage: string | null
  sortOrder: number
  slug?: string
  features?: string | null
  whyChooseUs?: string | null
}

const defaultServices = [
  { id: '1', title: 'รับเหมาก่อสร้าง', slug: 'รับเหมาก่อสร้าง', titleEn: 'Construction', description: 'บริการรับเหมาก่อสร้างครบวงจร สำหรับบ้าน วิลล่า และโครงการพาณิชย์ ด้วยทีมงานมืออาชีพและมาตรฐานการก่อสร้างระดับสากล', descriptionEn: '', icon: 'construction', coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', sortOrder: 1 },
  { id: '2', title: 'งานเฟอร์นิเจอร์ built-in', slug: 'งานเฟอร์นิเจอร์ built-in', titleEn: 'Built-in Furniture', description: 'ออกแบบและติดตั้งเฟอร์นิเจอร์ built-in ตามความต้องการ ไม่ว่าจะเป็นครัว ตู้เสื้อผ้า ชั้นวาง ด้วยวัสดุคุณภาพสูง', descriptionEn: '', icon: 'chair', coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', sortOrder: 2 },
  { id: '3', title: 'งานผ้าม่าน วอลเปเปอร์', slug: 'งานผ้าม่าน วอลเปเปอร์', titleEn: 'Curtains & Wallpaper', description: 'บริการติดตั้งผ้าม่านและวอลเปเปอร์หลากหลายลาย พร้อมให้คำปรึกษาการเลือกแบบฟรี', descriptionEn: '', icon: 'curtains', coverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f56d0?w=800', sortOrder: 3 },
  { id: '4', title: 'งานปูกระเบื้อง', slug: 'งานปูกระเบื้อง', titleEn: 'Tiling', description: 'บริการปูกระเบื้องทุกประเภท ทั้งกระเบื้องยาง หินอ่อน หินแกรนิต ด้วยช่างผู้เชี่ยวชาญ', descriptionEn: '', icon: 'grid_on', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', sortOrder: 4 },
  { id: '5', title: 'ทำโครงการขาย', slug: 'ทำโครงการขาย', titleEn: 'Sales Projects', description: 'พัฒนาและบริหารโครงการอสังหาริมทรัพย์ ตั้งแต่ขั้นตอนการวางแผน ออกแบบ จนถึงการขาย', descriptionEn: '', icon: 'trending_up', coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', sortOrder: 5 },
  { id: '6', title: 'รับบริหารงานขายโครงการ', slug: 'รับบริหารงานขายโครงการ', titleEn: 'Sales Project Management', description: 'บริหารจัดการทีมขายและการตลาดสำหรับโครงการอสังหาริมทรัพย์', descriptionEn: '', icon: 'business', coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800', sortOrder: 6 },
  { id: '7', title: 'งานออกแบบ งานก่อสร้าง ครบวงจร', slug: 'งานออกแบบ งานก่อสร้าง ครบวงจร', titleEn: 'Comprehensive Design & Construction', description: 'บริการออกแบบและก่อสร้างครบวงจร ตั้งแต่ไอเดียจนถึงสิ่งที่คุณได้รับ', descriptionEn: '', icon: 'architecture', coverImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800', sortOrder: 7 },
  { id: '8', title: 'งานกราฟิกดีไซน์', slug: 'งานกราฟิกดีไซน์', titleEn: 'Graphic Design', description: 'บริการออกแบบกราฟิกสำหรับธุรกิจ ไม่ว่าจะเป็นโลโก้ แบรนด์ สื่อสิ่งพิมพ์', descriptionEn: '', icon: 'design_services', coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800', sortOrder: 8 },
  { id: '9', title: 'งานออกแบบภายใน-ภายนอก ตกแต่ง', slug: 'งานออกแบบภายใน-ภายนอก ตกแต่ง', titleEn: 'Interior & Exterior Design', description: 'ออกแบบตกแต่งภายในและภายนอก สร้างสรรค์พื้นที่ที่สวยงามและใช้งานได้จริง', descriptionEn: '', icon: 'interior_design', coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', sortOrder: 9 }
]

const serviceIcons: Record<string, string> = {
  'รับเหมาก่อสร้าง': 'construction',
  'งานเฟอร์นิเจอร์ built-in': 'chair',
  'งานผ้าม่าน วอลเปเปอร์': 'curtains',
  'งานปูกระเบื้อง': 'grid_on',
  'ทำโครงการขาย': 'trending_up',
  'รับบริหารงานขายโครงการ': 'business',
  'งานออกแบบ งานก่อสร้าง ครบวงจร': 'architecture',
  'งานกราฟิกดีไซน์': 'design_services',
  'งานออกแบบภายใน-ภายนอก ตกแต่ง': 'interior_design'
}

const defaultFeaturesList: Record<string, string[]> = {
  'รับเหมาก่อสร้าง': [
    'รับเหมาก่อสร้างบ้านเดี่ยว วิลล่า คอนโดมิเนียม',
    'รับเหมางานโครงสร้าง งานสถาปัตย์ งานตกแต่ง',
    'ควบคุมคุณภาพการก่อสร้างตามมาตรฐาน',
    'บริหารงบประมาณและระยะเวลาโครงการ',
    'ทีมงานมืออาชีพ ช่างผู้ชำนาญ',
    'ใช้วัสดุคุณภาพมาตรฐาน มีการรับประกัน',
    'รับสร้างทั้งโครงการขนาดเล็กและขนาดใหญ่',
    'ให้คำปรึกษาด้านการก่อสร้างฟรี'
  ],
  'งานเฟอร์นิเจอร์ built-in': [
    'ออกแบบและติดตั้งเฟอร์นิเจอร์ built-in ตามสั่ง',
    'ออกแบบครัว built-in และตู้เสื้อผ้า',
    'ติดตั้งชั้นวาง หิ้ง บานเปิด-ปิด',
    'ใช้วัสดุคุณภาพสูง พีวีซี กระจก อลูมิเนียม',
    'ผลิตด้วยเครื่องจักร CNC ที่ทันสมัย',
    'รับประกันงานติดตั้ง 1 ปี',
    'ให้บริการซ่อมบำรุงหลังการติดตั้ง',
    'ออกแบบตามความต้องการของลูกค้า'
  ],
  'งานผ้าม่าน วอลเปเปอร์': [
    'จำหน่ายและติดตั้งผ้าม่านทุกประเภท',
    'ม่านมู่สี ม่านพับ ม่านตาไก่ ม่านห้อย',
    'วอลเปเปอร์ลายต่างๆ มากมาย',
    'ให้คำปรึกษาการเลือกผ้าและลายฟรี',
    'บริการวัดและประเมินราคาที่บ้านฟรี',
    'สินค้าคุณภาพ ทนทาน และทำความสะอาดง่าย',
    'รับทำผ้าม่านทั้งโครงการ บ้าน คอนโด โรงแรม',
    'มีบริการซักซักและเปลี่ยนผ้าม่าน'
  ],
  'งานปูกระเบื้อง': [
    'ปูกระเบื้องทุกประเภท ทั้งพื้นและผนัง',
    'กระเบื้องยาง กระเบื้องเซรามิก',
    'หินอ่อน หินแกรนิต หินเทียบ',
    'วัสดุกราซูโตป สายน้ำผึ้ง หินธรรมชาติ',
    'ช่างผู้เชี่ยวชาญ มีประสบการณ์สูง',
    'วางแผนการวางกระเบื้องให้สวยงาม',
    'ใช้วัสดุกาวและยาแนวคุณภาพ',
    'รับประกันงานปู 1 ปี'
  ],
  'ทำโครงการขาย': [
    'วางแผนและพัฒนาโครงการอสังหาริมทรัพย์',
    'ออกแบบโครงการ ทำเล การจัดผัง',
    'บริหารจัดการก่อสร้างจนส่งมอบ',
    'วางแผนการตลาดและการขาย',
    'จัดทำสื่อและโบรชัวร์การขาย',
    'บริหารทีมขายและนักการตลาด',
    'ให้คำปรึกษาด้านการลงทุนอสังหาฯ',
    'บริการครบวงจรตั้งแต่ต้นจนจบ'
  ],
  'รับบริหารงานขายโครงการ': [
    'บริหารจัดการทีมขายอสังหาริมทรัพย์',
    'วางแผนกลยุทธ์การขายและการตลาด',
    'ฝึกอบรมทีมขายให้มีประสิทธิภาพ',
    'ติดตามและรายงานผลการขาย',
    'จัดการลูกค้าและการนัดหมาย',
    'ให้คำปรึกษาการเลือกซื้อ-เช่า',
    'บริการหลังการขาย',
    'เพิ่มยอดขายและความพึงพอใจ'
  ],
  'งานออกแบบ งานก่อสร้าง ครบวงจร': [
    'รับออกแบบบ้าน วิลล่า อาคารพาณิชย์',
    'ออกแบบภายในและภายนอก',
    'รับเหมาก่อสร้างหลังจากออกแบบเสร็จ',
    'ประสานงานช่างและวัสดุ',
    'ควบคุมคุณภาพทุกขั้นตอน',
    'ส่งมอบงานพร้อมใช้งาน',
    'ให้คำปรึกษาฟรีตลอดโครงการ',
    'รับประกันงานหลังส่งมอบ'
  ],
  'งานกราฟิกดีไซน์': [
    'ออกแบบโลโก้และอัตลักษณ์องค์กร',
    'ออกแบบสื่อสิ่งพิมพ์ โบรชัวร์ แคตตาล็อก',
    'ออกแบบปกหนังสือ นิตยสาร',
    'ออกแบบสื่อดิจิทัล Banner Post',
    'ออกแบบแพคเกจสินค้า',
    'ออกแบบนิทรรศการและบูธ',
    'ให้คำปรึกษาด้านแบรนด์ดิ้ง',
    'แก้ไขงานจนพอใจ'
  ],
  'งานออกแบบภายใน-ภายนอก ตกแต่ง': [
    'ออกแบบตกแต่งภายในบ้าน คอนโด วิลล่า',
    'ออกแบบตกแต่งภายนอก ลาน สวน',
    'ออกแบบร้านค้า สำนักงาน โรงแรม',
    'จัดหาและติดตั้งเฟอร์นิเจอร์',
    'ออกแบบระบบแสงไฟและสี',
    'ให้คำปรึกษาการเลือกวัสดุ',
    '3D ภาพจำลองก่อนตัดสินใจ',
    'ดูแลติดตั้งจนสมบูรณ์'
  ]
}

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: encodedSlug } = use(params)
  const slug = decodeURIComponent(encodedSlug)
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchService()
  }, [slug])

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services?status=PUBLISHED`)
      const data = await res.json()
      if (data.data && data.data.length > 0) {
        const found = data.data.find((s: Service) => 
          s.title === slug || 
          s.slug === slug || 
          s.titleEn?.toLowerCase() === slug.toLowerCase() ||
          slug.includes(s.title) ||
          s.title.includes(slug)
        )
        if (found) {
          setService(found)
          setLoading(false)
          return
        }
      }
      
      const defaultServices = [
        { id: '1', title: 'รับเหมาก่อสร้าง', slug: 'รับเหมาก่อสร้าง', titleEn: 'Construction', description: 'บริการรับเหมาก่อสร้างครบวงจร สำหรับบ้าน วิลล่า และโครงการพาณิชย์ ด้วยทีมงานมืออาชีพและมาตรฐานการก่อสร้างระดับสากล', descriptionEn: '', icon: 'construction', coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', sortOrder: 1 },
        { id: '2', title: 'งานเฟอร์นิเจอร์ built-in', slug: 'งานเฟอร์นิเจอร์ built-in', titleEn: 'Built-in Furniture', description: 'ออกแบบและติดตั้งเฟอร์นิเจอร์ built-in ตามความต้องการ ไม่ว่าจะเป็นครัว ตู้เสื้อผ้า ชั้นวาง ด้วยวัสดุคุณภาพสูง', descriptionEn: '', icon: 'chair', coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', sortOrder: 2 },
        { id: '3', title: 'งานผ้าม่าน วอลเปเปอร์', slug: 'งานผ้าม่าน วอลเปเปอร์', titleEn: 'Curtains & Wallpaper', description: 'บริการติดตั้งผ้าม่านและวอลเปเปอร์หลากหลายลาย พร้อมให้คำปรึกษาการเลือกแบบฟรี', descriptionEn: '', icon: 'curtains', coverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f56d0?w=800', sortOrder: 3 },
        { id: '4', title: 'งานปูกระเบื้อง', slug: 'งานปูกระเบื้อง', titleEn: 'Tiling', description: 'บริการปูกระเบื้องทุกประเภท ทั้งกระเบื้องยาง หินอ่อน หินแกรนิต ด้วยช่างผู้เชี่ยวชาญ', descriptionEn: '', icon: 'grid_on', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', sortOrder: 4 },
        { id: '5', title: 'ทำโครงการขาย', slug: 'ทำโครงการขาย', titleEn: 'Sales Projects', description: 'พัฒนาและบริหารโครงการอสังหาริมทรัพย์ ตั้งแต่ขั้นตอนการวางแผน ออกแบบ จนถึงการขาย', descriptionEn: '', icon: 'trending_up', coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', sortOrder: 5 },
        { id: '6', title: 'รับบริหารงานขายโครงการ', slug: 'รับบริหารงานขายโครงการ', titleEn: 'Sales Project Management', description: 'บริหารจัดการทีมขายและการตลาดสำหรับโครงการอสังหาริมทรัพย์', descriptionEn: '', icon: 'business', coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800', sortOrder: 6 },
        { id: '7', title: 'งานออกแบบ งานก่อสร้าง ครบวงจร', slug: 'งานออกแบบ งานก่อสร้าง ครบวงจร', titleEn: 'Comprehensive Design & Construction', description: 'บริการออกแบบและก่อสร้างครบวงจร ตั้งแต่ไอเดียจนถึงสิ่งที่คุณได้รับ', descriptionEn: '', icon: 'architecture', coverImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800', sortOrder: 7 },
        { id: '8', title: 'งานกราฟิกดีไซน์', slug: 'งานกราฟิกดีไซน์', titleEn: 'Graphic Design', description: 'บริการออกแบบกราฟิกสำหรับธุรกิจ ไม่ว่าจะเป็นโลโก้ แบรนด์ สื่อสิ่งพิมพ์', descriptionEn: '', icon: 'design_services', coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800', sortOrder: 8 },
        { id: '9', title: 'งานออกแบบภายใน-ภายนอก ตกแต่ง', slug: 'งานออกแบบภายใน-ภายนอก ตกแต่ง', titleEn: 'Interior & Exterior Design', description: 'ออกแบบตกแต่งภายในและภายนอก สร้างสรรค์พื้นที่ที่สวยงามและใช้งานได้จริง', descriptionEn: '', icon: 'interior_design', coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', sortOrder: 9 }
      ]
      
      const foundDefault = defaultServices.find((s: Service) => 
        s.title === slug || 
        s.slug === slug || 
        s.titleEn?.toLowerCase() === slug.toLowerCase() ||
        slug.includes(s.title) ||
        s.title.includes(slug)
      )
      
      if (foundDefault) {
        setService(foundDefault)
      }
    } catch (error) {
      console.error('Error fetching service:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navigation currentPage="services" />
        <main className="pt-20 sm:pt-24 md:pt-32">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded w-1/4"></div>
              <div className="h-[400px] bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!service) {
    return (
      <>
        <Navigation currentPage="services" />
        <main className="pt-20 sm:pt-24 md:pt-32 min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-8xl text-gray-300 mb-4 block">construction</span>
            <h1 className="text-3xl font-headline font-black text-gray-900 mb-2">ไม่พบบริการ</h1>
            <p className="text-gray-500 mb-6">บริการที่คุณค้นหาไม่พบในระบบ</p>
            <a href="/services" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 font-headline font-bold text-sm rounded-lg hover:bg-primary-dark transition-all">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              กลับไปรายการบริการ
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const serviceFeatures = service.features ? service.features.split('\n').filter(f => f.trim()) : defaultFeaturesList[service.title] || []
  const serviceWhyChooseUs = service.whyChooseUs ? service.whyChooseUs.split('\n').filter(w => w.trim()) : null
  const icon = service.icon || serviceIcons[service.title] || 'build'

  const defaultWhyChooseUs = [
    { icon: 'verified', title: 'มาตรฐาน', desc: 'การก่อสร้างตามมาตรฐานสากล' },
    { icon: 'schedule', title: 'ตรงเวลา', desc: 'ส่งมอบงานตรงกำหนด' },
    { icon: 'price_check', title: 'ราคาชัดเจน', desc: 'ไม่มีค่าใช้จ่ายซ่อนเร้น' },
    { icon: 'support_agent', title: 'ดูแลใส่ใจ', desc: 'บริการหลังการขาย' }
  ]

  const whyChooseUsItems = serviceWhyChooseUs ? serviceWhyChooseUs.map((text, i) => ({
    icon: ['verified', 'schedule', 'price_check', 'support_agent'][i % 4],
    title: text,
    desc: ''
  })) : defaultWhyChooseUs

  return (
    <>
      <Navigation currentPage="services" />
      <main className="pt-20 sm:pt-24 md:pt-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 font-body">
            <a href="/" className="hover:text-primary transition-colors">หน้าแรก</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <a href="/services" className="hover:text-primary transition-colors">บริการ</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-gray-900 font-bold">{service.title}</span>
          </div>

          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={service.coverImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="material-symbols-outlined text-primary">{icon}</span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-primary text-xs tracking-[0.3em] uppercase font-bold mb-3 font-headline">
                บริการ
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-gray-900 mb-4">
                {service.title}
              </h1>
              {service.titleEn && (
                <p className="text-lg text-gray-500 font-body mb-6">{service.titleEn}</p>
              )}
              <p className="text-gray-600 font-body text-base leading-relaxed mb-8">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="bg-primary text-white px-8 py-4 font-headline font-bold text-base rounded-xl hover:bg-primary-dark transition-all shadow-xl shadow-red-500/20 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                  สอบถามรายละเอียด
                </a>
                <a
                  href="/booking"
                  className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 font-headline font-bold text-base rounded-xl hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  นัดหารือ
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 md:p-10 mb-16">
            <h2 className="text-2xl font-headline font-black text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-primary rounded-full"></span>
              รายละเอียดบริการ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceFeatures.map((feature: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                  <span className="text-gray-700 font-body">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 md:p-10 mb-16">
            <h2 className="text-2xl font-headline font-black text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-primary rounded-full"></span>
              ทำไมต้องเลือกเรา
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUsItems.map((item: { icon: string; title: string; desc: string }, i: number) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-gray-900 mb-2">{item.title}</h3>
                  {item.desc && <p className="text-sm text-gray-600 font-body">{item.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}