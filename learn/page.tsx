'use client'

import dynamic from 'next/dynamic'

const MapAllLocation = dynamic(
  () => import('@/components/map/MapAllLocation'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 80px)', background: '#0a0a0a' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(198,151,63,0.2)', borderTopColor: '#C6973F' }}></div>
          <p className="thai-text" style={{ color: 'rgba(160,160,160,0.5)' }}>กำลังโหลดแผนที่...</p>
        </div>
      </div>
    ),
  }
)

export default function MapAllLocationPage() {
  return <MapAllLocation />
}
