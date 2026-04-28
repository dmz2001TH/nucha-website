'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { ToastProvider } from '@/components/Toast'
import SessionProvider from '@/components/SessionProvider'

interface AdminLayoutProps {
  children: React.ReactNode
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (
      status === 'unauthenticated' &&
      pathname !== '/admin/login' &&
      pathname !== '/admin/register'
    ) {
      router.replace('/admin/login')
    }
  }, [status, pathname, router])

  const menuItems: ({ href: string; label: string; icon: string; external?: boolean; divider?: false } | { divider: true })[] = [
    { href: '/admin', label: 'แดชบอร์ด', icon: 'dashboard' },
    { href: '/admin/portfolio', label: 'ผลงาน', icon: 'photo_library' },
    { href: '/admin/villas', label: 'วิลล่า', icon: 'home' },
    { href: '/admin/services', label: 'บริการ', icon: 'design_services' },
    { href: '/admin/pages', label: 'หน้า', icon: 'description' },
    { href: '/admin/bookings', label: 'จองคิว', icon: 'event' },
    { href: '/admin/inquiries', label: 'คำถาม', icon: 'mail' },
    { href: '/admin/media', label: 'มีเดีย', icon: 'perm_media' },
    { href: '/admin/users', label: 'ผู้ใช้งาน', icon: 'group' },
    { href: '/admin/settings', label: 'ตั้งค่า', icon: 'settings' },
    { href: '/admin/page-preview', label: 'ดูตัวอย่างหน้าเว็บ', icon: 'preview' },
    { href: '/admin/ui-docs', label: 'เอกสาร UI', icon: 'code' },
    { divider: true },
    { href: '/', label: 'ดูเว็บไซต์', icon: 'open_in_new', external: true }
  ]

  if (pathname === '/admin/login' || pathname === '/admin/register') {
    return <>{children}</>
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 w-64 flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link href="/admin" className="text-xl font-black tracking-tight text-primary font-headline uppercase">
            NUCHA CMS
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            if ('divider' in item && item.divider) {
              return <div key={`divider-${index}`} className="my-3 border-t border-gray-100" />
            }

            const href = 'href' in item ? item.href : ''
            const label = 'label' in item ? item.label : ''
            const icon = 'icon' in item ? item.icon : ''
            const external = 'external' in item ? item.external : false
            const isActive = !external && (pathname === href || 
              (href !== '/admin' && pathname.startsWith(href)))
            
            return (
              <Link
                key={href}
                href={href}
                target={external ? '_blank' : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-red-500/20'
                    : external
                    ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 border border-dashed border-gray-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{icon}</span>
                <span className="font-headline text-sm font-bold">{label}</span>
                {external && <span className="material-symbols-outlined text-[14px] ml-auto">north_east</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
          >
            <span className="material-symbols-outlined text-xl">open_in_new</span>
            <span className="font-headline text-sm font-bold">ดูเว็บ</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-all w-full"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="font-headline text-sm font-bold">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-center gap-4">
              <Link href="/" target="_blank" className="text-gray-500 hover:text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">open_in_new</span>
                <span className="text-sm font-headline">ดูเว็บ</span>
              </Link>
              {session?.user && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="material-symbols-outlined text-[18px] text-primary">manage_accounts</span>
                  <span className="font-headline font-bold">{session.user.name || session.user.email}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">{session.user.role}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ToastProvider>
    </SessionProvider>
  )
}
