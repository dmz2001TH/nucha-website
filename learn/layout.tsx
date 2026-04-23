import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baanmaevilla.co.th'

export const metadata: Metadata = {
  title: 'แผนที่โครงการทั้งหมด',
  description: 'สำรวจโครงการบ้านเดี่ยว พูลวิลล่า BAANMAE VILLA ทั้งหมดได้ในหน้าเดียว ค้นหาโครงการผ่านแผนที่แบบ Interactive ใช้งานง่าย ครบทุกทำเลพัทยา จอมเทียน ห้วยใหญ่ บางเสร่',
  alternates: {
    canonical: `${baseUrl}/learn`,
  },
  openGraph: {
    title: 'แผนที่โครงการทั้งหมด | BAANMAE VILLA',
    description: 'สำรวจโครงการบ้านเดี่ยว พูลวิลล่า ทั้งหมดผ่านแผนที่แบบ Interactive',
    url: `${baseUrl}/learn`,
    type: 'website',
  },
}

export default function MapAllLocationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
