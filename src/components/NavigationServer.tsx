import NavigationClient from './NavigationClient'

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

async function fetchSettings(): Promise<Record<string, string>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/settings`, {
      cache: 'no-store'
    })
    const data = await res.json()
    if (data.data) {
      const settingsMap: Record<string, string> = {}
      data.data.forEach((s: { key: string; value: string }) => {
        settingsMap[s.key] = s.value
      })
      return settingsMap
    }
  } catch {
    // ใช้ค่า default ถ้าดึงไม่ได้
  }
  return {}
}

export default async function NavigationServer({ currentPage }: { currentPage?: string }) {
  const settings = await fetchSettings()

  const navLabels = {
    home: settings.nav_home || 'หน้าแรก',
    services: settings.nav_services || 'บริการ',
    villas: settings.nav_villas || 'วิลล่า',
    portfolio: settings.nav_portfolio || 'ผลงาน',
    philosophy: settings.nav_philosophy || 'ปรัชญา',
    contact: settings.nav_contact || 'ติดต่อเรา',
    booking: settings.nav_booking || 'จองคิว',
  }

  return <NavigationClient currentPage={currentPage} settings={settings} navLabels={navLabels} />
}
