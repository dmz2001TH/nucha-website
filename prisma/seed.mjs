import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'

const libsql = createClient({ url: 'file:./prisma/dev.db' })
const adapter = new PrismaLibSQL(libsql)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting database seed...')

  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@nucha-innovation.com' },
    update: {},
    create: { email: 'admin@nucha-innovation.com', password: hashedPassword, name: 'Admin Nucha', role: 'ADMIN' }
  })
  console.log('Admin user created')

  const editorPassword = await bcrypt.hash('editor123', 12)
  await prisma.user.upsert({
    where: { email: 'editor@nucha-innovation.com' },
    update: {},
    create: { email: 'editor@nucha-innovation.com', password: editorPassword, name: 'Editor Nucha', role: 'EDITOR' }
  })
  console.log('Editor user created')

  const services = [
    { title: 'Interior Design', titleEn: 'Interior Design', slug: 'interior-design', description: 'การออกแบบภายในที่สะท้อนตัวตน ผ่านการเลือกใช้วัสดุระดับพรีเมียม', descriptionEn: 'Interior design that reflects your personality through premium materials.', icon: 'home', sortOrder: 1, coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800' },
    { title: 'Architecture', titleEn: 'Architecture', slug: 'architecture', description: 'นวัตกรรมการออกแบบโครงสร้างที่ท้าทายขีดจำกัด', descriptionEn: 'Architectural innovation that challenges limits.', icon: 'building', sortOrder: 2, coverImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800' },
    { title: 'Development', titleEn: 'Development', slug: 'development', description: 'การบริหารจัดการโครงการก่อสร้างด้วยมาตรฐานระดับสากล', descriptionEn: 'Construction project management with international standards.', icon: 'construction', sortOrder: 3, coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800' }
  ]
  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: s })
  }
  console.log('Services created')

  await prisma.page.upsert({
    where: { slug: 'philosophy' },
    update: {},
    create: { title: 'ปรัชญาของเรา', titleEn: 'Our Philosophy', slug: 'philosophy', content: '<h2>สถาปัตยกรรมแห่งอนาคต</h2><p>ที่ NUCHA INNOVATION VILL PATTAYA เราเชื่อว่าบ้านไม่ใช่แค่ที่อยู่อาศัย</p>', contentEn: '<h2>Architecture of the Future</h2><p>At NUCHA we believe a home is not just a residence.</p>' }
  })
  console.log('Pages created')

  const settings = [
    { key: 'site_name', value: 'NUCHA INNOVATION VILL PATTAYA', type: 'TEXT', group: 'general', label: 'Site Name' },
    { key: 'site_tagline', value: 'สถาปัตยกรรมแห่งอนาคต', type: 'TEXT', group: 'general', label: 'Site Tagline' },
    { key: 'contact_phone', value: '+66 (0) 81-XXX-XXXX', type: 'TEXT', group: 'contact', label: 'Phone Number' },
    { key: 'contact_email', value: 'concierge@nucha-innovation.com', type: 'TEXT', group: 'contact', label: 'Email' },
    { key: 'contact_address', value: 'พัทยา, ชลบุรี, ประเทศไทย', type: 'TEXTAREA', group: 'contact', label: 'Address' },
    { key: 'social_facebook', value: '#', type: 'TEXT', group: 'social', label: 'Facebook URL' },
    { key: 'social_instagram', value: '#', type: 'TEXT', group: 'social', label: 'Instagram URL' },
    { key: 'logo_url', value: '/logo.svg', type: 'IMAGE', group: 'branding', label: 'Logo URL' },
    { key: 'primary_color', value: '#D32F2F', type: 'COLOR', group: 'branding', label: 'Primary Color' },
  ]
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s })
  }
  console.log('Settings created')

  const portfolios = [
    { title: 'THE WHITE CUBE', titleEn: 'THE WHITE CUBE', slug: 'the-white-cube', description: 'วิลล่าสีขาวสไตล์มินิมอล', descriptionEn: 'Minimalist white villa.', location: 'พัทยา', year: 2023, category: 'RESIDENTIAL', featured: true, coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800' },
    { title: 'CRIMSON OASIS', titleEn: 'CRIMSON OASIS', slug: 'crimson-oasis', description: 'พูลวิลล่าหรูยามค่ำคืน', descriptionEn: 'Luxury poolside at night.', location: 'พัทยา', year: 2024, category: 'RESIDENTIAL', featured: true, coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
  ]
  for (const p of portfolios) {
    await prisma.portfolio.upsert({ where: { slug: p.slug }, update: {}, create: p })
  }
  console.log('Portfolios created')

  const villas = [
    { name: 'THE MONOLITH HOUSE', nameEn: 'THE MONOLITH HOUSE', slug: 'the-monolith-house', description: 'วิลล่าระดับพรีเมียม 4 ห้องนอน', descriptionEn: 'Premium 4-bedroom villa.', location: 'พัทยาเหนือ', price: 35000000, bedrooms: 4, bathrooms: 5, area: 450, landArea: 800, floors: 2, parking: 3, status: 'AVAILABLE', featured: true, coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', latitude: 12.9276, longitude: 100.8772 },
    { name: 'OCEAN VIEW RESIDENCE', nameEn: 'OCEAN VIEW RESIDENCE', slug: 'ocean-view-residence', description: 'วิลล่าวิวทะเล 3 ห้องนอน', descriptionEn: 'Ocean view 3-bedroom villa.', location: 'นาจอมเทียน', price: 28000000, bedrooms: 3, bathrooms: 4, area: 380, landArea: 600, floors: 2, parking: 2, status: 'RESERVED', featured: true, coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', latitude: 12.7833, longitude: 100.8833 },
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
