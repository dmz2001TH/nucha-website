'use client'

import Link from 'next/link'

import { useState, useEffect } from 'react'

interface SiteSettings {
  site_name?: string
  site_tagline?: string
  contact_phone?: string
  contact_email?: string
  contact_address?: string
  social_facebook?: string
  social_instagram?: string
  social_line?: string
  business_hours?: string
  footer_description?: string
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({})

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.data) {
        const settingsMap: Record<string, string> = {}
        data.data.forEach((s: { key: string; value: string }) => {
          settingsMap[s.key] = s.value
        })
        setSettings(settingsMap)
      }
    } catch {}
  }

  useEffect(() => {
    fetchSettings() // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const siteName = settings.site_name || 'NUCHA INNOVATION'
  const tagline = settings.site_tagline || 'สถาปัตยกรรมแห่งอนาคต'
  const phone = settings.contact_phone || '+66 (0) 81-234-5678'
  const email = settings.contact_email || 'concierge@nucha-innovation.com'
  const address = settings.contact_address || '123 ถนนพัทยาสาย 3, ชลบุรี 20150'
  const footerDesc = settings.footer_description || `${tagline} ออกแบบบ้านหรูในพัทยา ด้วยมาตรฐานระดับสากล`
  const businessHoursRaw = settings.business_hours || 'จันทร์-ศุกร์ 9:00-18:00, เสาร์ 10:00-16:00'
  const businessHours = businessHoursRaw.split(',').map(h => h.trim()).filter(Boolean)

  const socials = [
    { url: settings.social_facebook, icon: 'public', label: 'Facebook' },
    { url: settings.social_instagram, icon: 'photo_camera', label: 'Instagram' },
    { url: settings.social_line, icon: 'chat', label: 'LINE' },
  ].filter(s => s.url && s.url !== '#')

  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="max-w-[1920px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-black text-primary mb-3 font-headline uppercase tracking-tight">
              {siteName.split(' ').slice(0, 2).join(' ')}
            </h3>
            <p className="font-body text-sm text-gray-400 leading-relaxed mb-6">
              {footerDesc}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    title={social.label}
                  >
                    <span className="material-symbols-outlined text-[20px]">{social.icon}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[0.65rem] tracking-[0.3em] uppercase font-bold text-gray-500 mb-4 font-headline">
              เมนูด่วน
            </h4>
            <ul className="flex flex-row flex-wrap gap-x-4 gap-y-2 sm:flex-col sm:space-y-3 sm:gap-0">
              {[
                { href: '/portfolio', label: 'ผลงาน' },
                { href: '/villas', label: 'วิลล่า' },
                { href: '/services', label: 'บริการ' },
                { href: '/philosophy', label: 'ปรัชญา' },
                { href: '/contact', label: 'ติดต่อ' },
              ].map((link) => (
                <li key={link.href + link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[0.65rem] tracking-[0.3em] uppercase font-bold text-gray-500 mb-5 font-headline">
              ติดต่อ
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">location_on</span>
                <span className="font-body text-sm text-gray-400 leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                <a href={`tel:${phone}`} className="font-body text-sm text-gray-400 hover:text-primary transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
                <a href={`mailto:${email}`} className="font-body text-sm text-gray-400 hover:text-primary transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-[0.65rem] tracking-[0.3em] uppercase font-bold text-gray-500 mb-5 font-headline">
              เวลาทำการ
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1 sm:space-y-3">
              {businessHours.map((hour, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0">schedule</span>
                  <p className="font-body text-sm text-gray-400">{hour}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs tracking-widest uppercase text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} {siteName}. ความเป็นเลิศทางสถาปัตยกรรม
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/contact" className="font-body text-xs tracking-widest uppercase text-gray-500 hover:text-primary transition-colors">
              สำนักงานพัทยา
            </Link>
            <Link href="/contact" className="font-body text-xs tracking-widest uppercase text-gray-500 hover:text-primary transition-colors">
              ติดต่อเรา
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
