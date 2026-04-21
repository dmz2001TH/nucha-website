import { PrismaClient, SettingType, PortfolioCategory, VillaStatus, Role, ContentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@nucha-innovation.com' },
    update: {},
    create: { email: 'admin@nucha-innovation.com', password: hashedPassword, name: 'Admin Nucha', role: Role.ADMIN }
  })
  console.log('Admin user created')

  const editorPassword = await bcrypt.hash('editor123', 12)
  await prisma.user.upsert({
    where: { email: 'editor@nucha-innovation.com' },
    update: {},
    create: { email: 'editor@nucha-innovation.com', password: editorPassword, name: 'Editor Nucha', role: Role.EDITOR }
  })
  console.log('Editor user created')

  const services = [
    { title: 'รับเหมาก่อสร้าง', titleEn: 'Construction', slug: 'รับเหมาก่อสร้าง', description: 'บริการรับเหมาก่อสร้างครบวงจร สำหรับบ้าน วิลล่า และโครงการพาณิชย์ ด้วยทีมงานมืออาชีพและมาตรฐานการก่อสร้างระดับสากล', descriptionEn: 'Full-service construction for homes, villas, and commercial projects.', icon: 'construction', sortOrder: 1, coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', status: ContentStatus.PUBLISHED },
    { title: 'งานเฟอร์นิเจอร์ built-in', titleEn: 'Built-in Furniture', slug: 'งานเฟอร์นิเจอร์ built-in', description: 'ออกแบบและติดตั้งเฟอร์นิเจอร์ built-in ตามความต้องการ ไม่ว่าจะเป็นครัว ตู้เสื้อผ้า ชั้นวาง ด้วยวัสดุคุณภาพสูง', descriptionEn: 'Custom built-in furniture design and installation.', icon: 'chair', sortOrder: 2, coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', status: ContentStatus.PUBLISHED },
    { title: 'งานผ้าม่าน วอลเปเปอร์', titleEn: 'Curtains & Wallpaper', slug: 'งานผ้าม่าน วอลเปเปอร์', description: 'บริการติดตั้งผ้าม่านและวอลเปเปอร์หลากหลายลาย พร้อมให้คำปรึกษาการเลือกแบบฟรี', descriptionEn: 'Curtain and wallpaper installation with free consultation.', icon: 'curtains', sortOrder: 3, coverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f56d0?w=800', status: ContentStatus.PUBLISHED },
    { title: 'งานปูกระเบื้อง', titleEn: 'Tiling', slug: 'งานปูกระเบื้อง', description: 'บริการปูกระเบื้องทุกประเภท ทั้งกระเบื้องยาง หินอ่อน หินแกรนิต ด้วยช่างผู้เชี่ยวชาญ', descriptionEn: 'Professional tiling services for all types of tiles.', icon: 'grid_on', sortOrder: 4, coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', status: ContentStatus.PUBLISHED },
    { title: 'ทำโครงการขาย', titleEn: 'Sales Projects', slug: 'ทำโครงการขาย', description: 'พัฒนาและบริหารโครงการอสังหาริมทรัพย์ ตั้งแต่ขั้นตอนการวางแผน ออกแบบ จนถึงการขาย', descriptionEn: 'Real estate project development from planning to sales.', icon: 'trending_up', sortOrder: 5, coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', status: ContentStatus.PUBLISHED },
    { title: 'รับบริหารงานขายโครงการ', titleEn: 'Sales Project Management', slug: 'รับบริหารงานขายโครงการ', description: 'บริหารจัดการทีมขายและการตลาดสำหรับโครงการอสังหาริมทรัพย์', descriptionEn: 'Sales team and marketing management for real estate projects.', icon: 'business', sortOrder: 6, coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800', status: ContentStatus.PUBLISHED },
    { title: 'งานออกแบบ งานก่อสร้าง ครบวงจร', titleEn: 'Comprehensive Design & Construction', slug: 'งานออกแบบ งานก่อสร้าง ครบวงจร', description: 'บริการออกแบบและก่อสร้างครบวงจร ตั้งแต่ไอเดียจนถึงสิ่งที่คุณได้รับ', descriptionEn: 'Full-service design and construction from concept to completion.', icon: 'architecture', sortOrder: 7, coverImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800', status: ContentStatus.PUBLISHED },
    { title: 'งานกราฟิกดีไซน์', titleEn: 'Graphic Design', slug: 'งานกราฟิกดีไซน์', description: 'บริการออกแบบกราฟิกสำหรับธุรกิจ ไม่ว่าจะเป็นโลโก้ แบรนด์ สื่อสิ่งพิมพ์', descriptionEn: 'Graphic design services for business branding and print media.', icon: 'design_services', sortOrder: 8, coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800', status: ContentStatus.PUBLISHED },
    { title: 'งานออกแบบภายใน-ภายนอก ตกแต่ง', titleEn: 'Interior & Exterior Design', slug: 'งานออกแบบภายใน-ภายนอก ตกแต่ง', description: 'ออกแบบตกแต่งภายในและภายนอก สร้างสรรค์พื้นที่ที่สวยงามและใช้งานได้จริง', descriptionEn: 'Interior and exterior design creating beautiful functional spaces.', icon: 'interior_design', sortOrder: 9, coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', status: ContentStatus.PUBLISHED }
  ]
  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: s })
  }
  console.log('Services created')

  await prisma.page.upsert({
    where: { slug: 'philosophy' },
    update: {},
    create: { title: 'ปรัชญาของเรา', titleEn: 'Our Philosophy', slug: 'philosophy', content: '<h2>สถาปัตยกรรมแห่งอนาคต</h2><p>ที่ NUCHA INNOVATION VILL PATTAYA เราเชื่อว่าบ้านไม่ใช่แค่ที่อยู่อาศัย</p>', contentEn: '<h2>Architecture of the Future</h2><p>At NUCHA we believe a home is not just a residence.</p>', status: ContentStatus.PUBLISHED }
  })
  console.log('Pages created')

  const settings = [
    { key: 'site_name', value: 'NUCHA INNOVATION VILL PATTAYA', type: SettingType.TEXT, group: 'general', label: 'ชื่อเว็บไซต์' },
    { key: 'site_tagline', value: 'สถาปัตยกรรมแห่งอนาคต', type: SettingType.TEXT, group: 'general', label: 'สโลแกน' },
    { key: 'site_description', value: 'ออกแบบบ้านหรูในพัทยา ด้วยมาตรฐานระดับสากล', type: SettingType.TEXTAREA, group: 'general', label: 'คำอธิบายเว็บไซต์' },
    { key: 'logo_url', value: '', type: SettingType.IMAGE, group: 'branding', label: 'โลโก้' },
    { key: 'logo_text', value: 'NUCHA', type: SettingType.TEXT, group: 'branding', label: 'ข้อความโลโก้' },
    { key: 'favicon_url', value: '/favicon.ico', type: SettingType.IMAGE, group: 'branding', label: 'Favicon' },
    { key: 'og_image', value: '', type: SettingType.IMAGE, group: 'branding', label: 'รูป OG (แชร์ลิงก์)' },
    { key: 'primary_color', value: '#D32F2F', type: SettingType.COLOR, group: 'branding', label: 'สีหลัก' },
    { key: 'secondary_color', value: '#1a1a1a', type: SettingType.COLOR, group: 'branding', label: 'สีรอง' },
    { key: 'contact_phone', value: '+66 (0) 81-234-5678', type: SettingType.TEXT, group: 'contact', label: 'เบอร์โทร' },
    { key: 'contact_email', value: 'concierge@nucha-innovation.com', type: SettingType.TEXT, group: 'contact', label: 'อีเมล' },
    { key: 'contact_address', value: '123 ถนนพัทยาสาย 3, ชลบุรี 20150', type: SettingType.TEXTAREA, group: 'contact', label: 'ที่อยู่' },
    { key: 'contact_line', value: '', type: SettingType.TEXT, group: 'contact', label: 'LINE ID' },
    { key: 'contact_whatsapp', value: '', type: SettingType.TEXT, group: 'contact', label: 'WhatsApp' },
    { key: 'social_facebook', value: '#', type: SettingType.TEXT, group: 'social', label: 'Facebook' },
    { key: 'social_instagram', value: '#', type: SettingType.TEXT, group: 'social', label: 'Instagram' },
    { key: 'social_line', value: '#', type: SettingType.TEXT, group: 'social', label: 'LINE' },
    { key: 'social_youtube', value: '', type: SettingType.TEXT, group: 'social', label: 'YouTube' },
    { key: 'social_tiktok', value: '', type: SettingType.TEXT, group: 'social', label: 'TikTok' },
    { key: 'seo_title', value: 'NUCHA INNOVATION - วิลล่าหรูพัทยา', type: SettingType.TEXT, group: 'seo', label: 'SEO Title' },
    { key: 'seo_description', value: 'ออกแบบและสร้างบ้านหรูในพัทยา', type: SettingType.TEXTAREA, group: 'seo', label: 'SEO Description' },
    { key: 'google_analytics', value: '', type: SettingType.TEXT, group: 'seo', label: 'Google Analytics ID' },
    { key: 'google_map_url', value: '', type: SettingType.TEXT, group: 'contact', label: 'Google Maps URL' },
    { key: 'business_hours', value: 'จันทร์-ศุกร์ 9:00-18:00, เสาร์ 10:00-16:00', type: SettingType.TEXTAREA, group: 'contact', label: 'เวลาทำการ' },
  ]
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s })
  }
  console.log('Settings created')

  const portfolios = [
    { title: 'THE WHITE CUBE', titleEn: 'THE WHITE CUBE', slug: 'the-white-cube', description: 'วิลล่าสไตล์มินิมอลสีขาวบริสุทธิ์ ออกแบบให้กลมกลืนกับธรรมชาติ ด้วยโครงสร้างคอนกรีตเปลือย ผสมกระจกใสขนาดใหญ่ที่รับแสงธรรมชาติได้ตลอดวัน พื้นที่ใช้สอย 450 ตร.ม. 4 ห้องนอน 5 ห้องน้ำ พร้อมสระว่ายน้ำส่วนตัวและสวนภูมิทัศน์', descriptionEn: 'A minimalist white villa blending seamlessly with nature. Exposed concrete structure with floor-to-ceiling glass panels. 450 sqm, 4 bedrooms, 5 bathrooms, private pool and landscaped garden.', location: 'พัทยา, ชลบุรี', year: 2023, category: PortfolioCategory.RESIDENTIAL, featured: true, coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', status: ContentStatus.PUBLISHED },
    { title: 'CRIMSON OASIS', titleEn: 'CRIMSON OASIS', slug: 'crimson-oasis', description: 'พูลวิลล่าหรูสไตล์ทรอปิคัล ออกแบบเพื่อการพักผ่อนที่สมบูรณ์แบบ ล้อมรอบด้วยต้นไม้เขตร้อน สระว่ายน้ำอินฟินิตี้วิวทะเล ห้องนั่งเล่นกลางแจ้ง และครัวกลางแจ้งครบครัน พื้นที่ใช้สอย 380 ตร.ม. 3 ห้องนอน 4 ห้องน้ำ', descriptionEn: 'A tropical luxury pool villa designed for ultimate relaxation. Surrounded by lush tropical greenery, infinity pool with sea views, outdoor living and fully equipped outdoor kitchen. 380 sqm, 3 bedrooms, 4 bathrooms.', location: 'พัทยา, ชลบุรี', year: 2024, category: PortfolioCategory.RESIDENTIAL, featured: true, coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', status: ContentStatus.PUBLISHED },
    { title: 'URBAN LOFT STUDIO', titleEn: 'URBAN LOFT STUDIO', slug: 'urban-loft-studio', description: 'พื้นที่ทำงานสไตล์ลอฟต์ในใจกลางเมือง ออกแบบให้ได้บรรยากาศสร้างสรรค์และทันสมัย ผสมผสานวัสดุอุตสาหกรรม เช่น เหล็ก อิฐเปลือย และไม้ เหมาะสำหรับออฟฟิศสร้างสรรค์และสตูดิโอ', descriptionEn: 'A creative loft workspace in the heart of the city. Industrial materials including steel, exposed brick, and wood. Designed for creative agencies and studios.', location: 'กรุงเทพมหานคร', year: 2023, category: PortfolioCategory.COMMERCIAL, featured: false, coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', status: ContentStatus.PUBLISHED },
    { title: 'ZEN GARDEN HOUSE', titleEn: 'ZEN GARDEN HOUSE', slug: 'zen-garden-house', description: 'บ้านพักอาศัยสไตล์ญี่ปุ่นผสมไทยร่วมสมัย ออกแบบพื้นที่ภายในและภายนอกให้เชื่อมต่อกันอย่างลื่นไหล สวนหินแบบญี่ปุ่น บ่อน้ำ และระเบียงไม้ สร้างความสงบให้ผู้อยู่อาศัย', descriptionEn: 'A Japanese-Thai contemporary residence. Seamlessly connected indoor and outdoor spaces. Japanese rock garden, koi pond, and wooden deck creating tranquility.', location: 'เชียงใหม่', year: 2022, category: PortfolioCategory.INTERIOR, featured: false, coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', status: ContentStatus.PUBLISHED },
    { title: 'THE BLACK DIAMOND', titleEn: 'THE BLACK DIAMOND', slug: 'the-black-diamond', description: 'อาคารพาณิชย์สไตล์ Contemporary ด้วยผิวอาคารสีดำโดดเด่น รูปทรงเรขาคณิตที่แหลมคม ภายในออกแบบให้ใช้งานได้อย่างมีประสิทธิภาพ เหมาะสำหรับบริษัทที่ต้องการภาพลักษณ์ที่แข็งแกร่ง', descriptionEn: 'A bold contemporary commercial building with striking black exterior. Sharp geometric form. Interior designed for maximum efficiency. Ideal for companies seeking a strong brand image.', location: 'พัทยา, ชลบุรี', year: 2024, category: PortfolioCategory.ARCHITECTURE, featured: false, coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800', status: ContentStatus.PUBLISHED },
    { title: 'SUNSET VILLA PATTAYA', titleEn: 'SUNSET VILLA PATTAYA', slug: 'sunset-villa-pattaya', description: 'วิลล่าวิวพระอาทิตย์ตก ออกแบบให้ทุกห้องมองเห็นวิวทะเลอ่าวไทย เพดานสูง 4 เมตร ดาดฟ้าสระว่ายน้ำ 360 องศา พื้นที่ใช้สอย 520 ตร.ม. 5 ห้องนอน ตกแต่งภายในด้วยวัสดุนำเข้าจากอิตาลี', descriptionEn: 'A sunset-view villa with panoramic Gulf of Thailand vistas from every room. 4m ceilings, 360-degree rooftop infinity pool. 520 sqm, 5 bedrooms, Italian imported materials throughout.', location: 'นาจอมเทียน, ชลบุรี', year: 2024, category: PortfolioCategory.RESIDENTIAL, featured: false, coverImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', status: ContentStatus.PUBLISHED },
  ]
  for (const p of portfolios) {
    await prisma.portfolio.upsert({ where: { slug: p.slug }, update: { description: p.description, descriptionEn: p.descriptionEn, location: p.location, coverImage: p.coverImage, status: p.status }, create: p })
  }
  console.log('Portfolios created')

  const villas = [
    { name: 'THE MONOLITH HOUSE', nameEn: 'THE MONOLITH HOUSE', slug: 'the-monolith-house', description: 'วิลล่าระดับพรีเมียม 4 ห้องนอน', descriptionEn: 'Premium 4-bedroom villa.', location: 'พัทยาเหนือ', price: 35000000, bedrooms: 4, bathrooms: 5, area: 450, landArea: 800, floors: 2, parking: 3, status: VillaStatus.AVAILABLE, featured: true, coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', latitude: 12.9276, longitude: 100.8772 },
    { name: 'OCEAN VIEW RESIDENCE', nameEn: 'OCEAN VIEW RESIDENCE', slug: 'ocean-view-residence', description: 'วิลล่าวิวทะเล 3 ห้องนอน', descriptionEn: 'Ocean view 3-bedroom villa.', location: 'นาจอมเทียน', price: 28000000, bedrooms: 3, bathrooms: 4, area: 380, landArea: 600, floors: 2, parking: 2, status: VillaStatus.RESERVED, featured: true, coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', latitude: 12.7833, longitude: 100.8833 },
  ]
  for (const v of villas) {
    await prisma.villa.upsert({ where: { slug: v.slug }, update: {}, create: v })
  }
  console.log('Villas created')

  console.log('\nDatabase seed completed!')
  console.log('Admin: admin@nucha-innovation.com / admin123')
  console.log('Editor: editor@nucha-innovation.com / editor123')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
