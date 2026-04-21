'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SessionUser {
  name?: string | null
  email?: string | null
}


interface SiteSettings {
  logo_url?: string
  logo_text?: string
  site_name?: string
  primary_color?: string
  nav_home?: string
  nav_services?: string
  nav_villas?: string
  nav_portfolio?: string
  nav_philosophy?: string
  nav_contact?: string
  nav_booking?: string
}

export default function Navigation({ currentPage }: { currentPage?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>({})
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (data?.user) {
        setSessionUser(data.user)
      }
    } catch {
      // ไม่มี session
    }
  }

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
    } catch {
      // ใช้ค่า default ถ้าดึงไม่ได้
    }
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  useEffect(() => {
    fetchSettings() // eslint-disable-line react-hooks/set-state-in-effect
    fetchSession() // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return currentPage === 'home'
    return currentPage === href.replace('/', '')
  }

  const logoText = settings.logo_text || 'NUCHA'
  const logoUrl = settings.logo_url

  const navLabels = {
    home: settings.nav_home || 'หน้าแรก',
    services: settings.nav_services || 'บริการ',
    villas: settings.nav_villas || 'วิลล่า',
    portfolio: settings.nav_portfolio || 'ผลงาน',
    philosophy: settings.nav_philosophy || 'ปรัชญา',
    contact: settings.nav_contact || 'ติดต่อเรา',
    booking: settings.nav_booking || 'จองคิว',
  }

  const navLinks = [
    { href: '/', label: navLabels.home },
    { href: '/services', label: navLabels.services, children: [
      { href: '/services/รับเหมาก่อสร้าง', label: 'รับเหมาก่อสร้าง' },
      { href: '/services/งานเฟอร์นิเจอร์%20built-in', label: 'งานเฟอร์นิเจอร์ built-in' },
      { href: '/services/งานผ้าม่าน%20วอลเปเปอร์', label: 'งานผ้าม่าน วอลเปเปอร์' },
      { href: '/services/งานปูกระเบื้อง', label: 'งานปูกระเบื้อง' },
      { href: '/services/ทำโครงการขาย', label: 'ทำโครงการขาย' },
      { href: '/services/รับบริหารงานขายโครงการ', label: 'รับบริหารงานขายโครงการ' },
      { href: '/services/งานออกแบบ%20งานก่อสร้าง%20ครบวงจร', label: 'งานออกแบบ งานก่อสร้าง ครบวงจร' },
      { href: '/services/งานกราฟิกดีไซน์', label: 'งานกราฟิกดีไซน์' },
      { href: '/services/งานออกแบบภายใน-ภายนอก%20ตกแต่ง', label: 'งานออกแบบภายใน-ภายนอก ตกแต่ง' },
    ]},
    { href: '/villas', label: navLabels.villas },
    { href: '/portfolio', label: navLabels.portfolio },
    { href: '/philosophy', label: navLabels.philosophy },
    { href: '/contact', label: navLabels.contact },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 h-24 border-none shadow-none ${
          isScrolled
            ? 'glass-nav'
            : 'bg-gradient-to-b from-white via-white/50 to-transparent backdrop-blur-md'
        }`}
      >
        <div className="flex justify-between items-center px-5 sm:px-8 md:px-12 lg:px-16 pt-2 md:pt-3 pb-4 md:pb-5 max-w-[1920px] mx-auto">
          {logoUrl && (
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                key={logoUrl}
                src={logoUrl}
                alt=""
                width={200}
                height={80}
                className="h-10 sm:h-12 md:h-16 w-auto object-contain"
                loading="eager"
              />
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-6 xl:gap-8 items-center">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                {link.children ? (
                  <>
                    <button
                      className={`font-headline text-xs xl:text-sm tracking-[0.1em] font-bold transition-colors flex items-center gap-1 h-10 ${
                        isActive(link.href)
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-600 hover:text-primary'
                      }`}
                      onMouseEnter={() => setOpenDropdown(link.href)}
                    >
                      {link.label}
                      <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    </button>
                    {openDropdown === link.href && (
                      <div 
                        className="absolute top-full left-0 pt-2"
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px]">
                          {link.children.map((child) => (
                            <a
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    className={`font-headline text-xs xl:text-sm tracking-[0.1em] font-bold transition-colors h-10 flex items-center ${
                      isActive(link.href)
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
            <Link href="/booking"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 xl:px-6 py-2.5 font-headline font-bold text-xs xl:text-sm tracking-wider rounded-lg hover:bg-primary-dark hover:scale-105 duration-200 ease-out transition-all shadow-lg shadow-red-500/20"
            >
              <span className="material-symbols-outlined text-[18px]">event</span>
              จองคิว
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {sessionUser ? (
              <Link href="/admin"
                className="hidden lg:inline-flex items-center gap-2 text-gray-600 hover:text-primary font-headline font-bold text-xs xl:text-sm tracking-wider transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                {sessionUser.name || sessionUser.email}
              </Link>
            ) : (
              <>
                <Link href="/admin/login"
                  className="hidden lg:inline-flex items-center gap-2 text-gray-600 hover:text-primary font-headline font-bold text-xs xl:text-sm tracking-wider transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  เข้าสู่ระบบ
                </Link>
                <Link href="/admin/register"
                  className="hidden lg:inline-flex bg-primary text-white px-5 xl:px-6 py-2.5 font-headline font-bold text-xs xl:text-sm tracking-wider rounded-lg hover:bg-primary-dark hover:scale-105 duration-200 ease-out transition-all shadow-lg shadow-red-500/20 items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  สมัครสมาชิก
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            >
              <span className="material-symbols-outlined text-[28px]">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="absolute top-0 right-0 w-[85%] max-w-[360px] h-full bg-white shadow-2xl animate-slide-in">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                <span className="text-lg font-black text-primary font-headline uppercase tracking-tight">
                  {logoText}
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="ปิดเมนู"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-6">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3.5 rounded-xl font-headline text-sm tracking-[0.1em] font-bold transition-all ${
                        isActive(link.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                  <Link href="/booking"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 mt-4 bg-primary text-white py-4 rounded-xl font-headline font-bold text-sm tracking-wider hover:bg-primary-dark transition-colors shadow-lg shadow-red-500/20"
                  >
                    <span className="material-symbols-outlined text-[20px]">event</span>
                    จองคิวปรึกษา
                  </Link>
                </div>
              </div>

              <div className="px-6 py-6 border-t border-gray-100 space-y-3">
                {sessionUser ? (
                  <Link href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-white text-primary border-2 border-primary py-3.5 rounded-xl font-headline font-bold text-sm tracking-wider hover:bg-primary/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                    {sessionUser.name || sessionUser.email}
                  </Link>
                ) : (
                  <>
                    <Link href="/admin/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-white text-primary border-2 border-primary py-3.5 rounded-xl font-headline font-bold text-sm tracking-wider hover:bg-primary/5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">person</span>
                      เข้าสู่ระบบ
                    </Link>
                    <Link href="/admin/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-xl font-headline font-bold text-sm tracking-wider hover:bg-primary-dark transition-colors shadow-lg shadow-red-500/20"
                    >
                      <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                      สมัครสมาชิก
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
