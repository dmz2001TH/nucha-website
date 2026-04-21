'use client'

import { useState, useEffect, useRef } from 'react'

interface MapLocation {
  id: string
  name: string
  nameEn?: string
  lat: number
  lng: number
  type: 'villa' | 'portfolio'
  image?: string
  price?: number
  location?: string
  link: string
  markerIcon?: string
}

interface InteractiveMapProps {
  locations: MapLocation[]
  center?: { lat: number; lng: number }
  zoom?: number
  className?: string
  height?: string
  defaultMarkerIcon?: string
}

export default function InteractiveMap({
  locations,
  center = { lat: 12.9276, lng: 100.8765 },
  zoom = 12,
  className = '',
  height = '500px',
  defaultMarkerIcon
}: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapRef.current) return

    let map: L.Map | null = null

    const initMap = async () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      if (mapRef.current) {
        mapRef.current.innerHTML = ''
      }

      map = L.map(mapRef.current!, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomAnimation: true,
        markerZoomAnimation: true,
        fadeAnimation: true,
        zoomControl: false
      })

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map)

      const createIcon = (type: 'villa' | 'portfolio', customIcon?: string) => {
        if (customIcon) {
          return L.divIcon({
            html: `
              <div class="custom-marker-wrapper">
                <div class="custom-marker-icon">
                  <img src="${customIcon}" alt="marker" onerror="this.parentElement.innerHTML='📍'" />
                </div>
                <div class="custom-marker-pin"></div>
              </div>
            `,
            className: 'custom-marker-container',
            iconSize: [48, 58],
            iconAnchor: [24, 58],
            popupAnchor: [0, -58]
          })
        }

        const svgVilla = `
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
            <defs><filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
            <path d="M20 2C10.059 2 2 10.059 2 20c0 15 18 28 18 28s18-13 18-28C38 10.059 29.941 2 20 2z" fill="#C41E3A" filter="url(#s)"/>
            <circle cx="20" cy="18" r="11" fill="white"/>
            <path d="M20 9 L27 16 L27 24 L13 24 L13 16 Z" fill="#C41E3A"/>
            <rect x="17" y="19" width="6" height="5" fill="white"/>
          </svg>
        `

        const svgPortfolio = `
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
            <defs><filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
            <path d="M20 2C10.059 2 2 10.059 2 20c0 15 18 28 18 28s18-13 18-28C38 10.059 29.941 2 20 2z" fill="#D32F2F" filter="url(#s)"/>
            <circle cx="20" cy="18" r="11" fill="white"/>
            <rect x="12" y="13" width="16" height="10" rx="2" fill="#D32F2F"/>
            <circle cx="16" cy="20" r="2" fill="white"/>
            <circle cx="24" cy="20" r="2" fill="white"/>
          </svg>
        `

        return L.divIcon({
          html: type === 'villa' ? svgVilla : svgPortfolio,
          className: 'custom-svg-marker',
          iconSize: [40, 50],
          iconAnchor: [20, 50],
          popupAnchor: [0, -50]
        })
      }

      // Create custom popup content
      const createPopupContent = (loc: MapLocation) => {
        const imageHtml = loc.image
          ? `<div class="popup-image">
               <img src="${loc.image}" alt="${loc.name}" />
               <span class="popup-badge ${loc.type === 'villa' ? 'badge-villa' : 'badge-portfolio'}">
                 ${loc.type === 'villa' ? '🏠 วิลล่า' : '📁 ผลงาน'}
               </span>
             </div>`
          : ''

        const locationHtml = loc.location
          ? `<p class="popup-location"><span class="material-symbols-outlined">location_on</span>${loc.location}</p>`
          : ''

        const priceHtml = loc.price
          ? `<div class="popup-price">฿${(loc.price / 1000000).toFixed(1)}M</div>`
          : ''

        return `
          <div class="custom-popup">
            ${imageHtml}
            <div class="popup-content">
              <h3 class="popup-title">${loc.name}</h3>
              ${locationHtml}
              ${priceHtml}
              <a href="${loc.link}" class="popup-btn">
                <span class="material-symbols-outlined">visibility</span>
                ดูรายละเอียด
              </a>
            </div>
          </div>
        `
      }

      const bounds = L.latLngBounds([])
      locations.forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: createIcon(loc.type, loc.markerIcon || defaultMarkerIcon),
          riseOnHover: true
        }).addTo(map!)

        bounds.extend([loc.lat, loc.lng])

        // Bind popup
        marker.bindPopup(createPopupContent(loc), {
          maxWidth: 300,
          minWidth: 280,
          className: 'custom-leaflet-popup',
          closeButton: true,
          autoPan: true,
          autoPanPadding: [50, 50]
        })

        marker.on('click', () => {
          map!.flyTo([loc.lat, loc.lng], map!.getZoom(), { animate: true, duration: 0.5 })
        })
      })

      if (locations.length > 1) {
        map.fitBounds(bounds, { padding: [50, 50], animate: true })
      }

      mapInstanceRef.current = map
    }

    initMap()

    return () => {
      if (map) {
        map.remove()
        map = null
      }
    }
  }, [isClient, locations, center.lat, center.lng, zoom, defaultMarkerIcon])

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`} style={{ height }}>
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl mb-2 block">progress_activity</span>
          <p className="text-gray-500 text-sm">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full rounded-xl z-0" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg z-[999]">
        <div className="flex items-center gap-5 text-xs font-headline font-bold">
          <div className="flex items-center gap-2">
            <svg width="20" height="25" viewBox="0 0 40 50"><path d="M20 2C10.059 2 2 10.059 2 20c0 15 18 28 18 28s18-13 18-28C38 10.059 29.941 2 20 2z" fill="#C41E3A"/><circle cx="20" cy="18" r="11" fill="white"/><path d="M20 9 L27 16 L27 24 L13 24 L13 16 Z" fill="#C41E3A"/></svg>
            <span>วิลล่า</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="25" viewBox="0 0 40 50"><path d="M20 2C10.059 2 2 10.059 2 20c0 15 18 28 18 28s18-13 18-28C38 10.059 29.941 2 20 2z" fill="#D32F2F"/><circle cx="20" cy="18" r="11" fill="white"/><rect x="12" y="13" width="16" height="10" rx="2" fill="#D32F2F"/></svg>
            <span>ผลงาน</span>
          </div>
        </div>
      </div>

      {/* Count */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl px-5 py-3 shadow-lg z-[999]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">location_on</span>
          <p className="text-sm font-headline font-bold"><span className="text-primary text-lg">{locations.length}</span> ตำแหน่ง</p>
        </div>
      </div>

      <style jsx global>{`
        .custom-svg-marker { background: transparent !important; border: none !important; }
        .custom-marker-container { background: transparent !important; border: none !important; }
        .custom-marker-wrapper { display: flex; flex-direction: column; align-items: center; animation: markerDrop 0.5s ease-out; }
        .custom-marker-icon { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .custom-marker-icon img { width: 100%; height: 100%; object-fit: cover; }
        .custom-marker-pin { width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 12px solid white; margin-top: -2px; }
        @keyframes markerDrop { 0% { transform: translateY(-20px); opacity: 0; } 60% { transform: translateY(5px); } 100% { transform: translateY(0); opacity: 1; } }

        /* Custom Popup Styles */
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }

        .custom-leaflet-popup .leaflet-popup-tip {
          background: white;
          box-shadow: none;
        }

        .custom-leaflet-popup .leaflet-popup-close-button {
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          border-radius: 50%;
          color: white;
          font-size: 18px;
          z-index: 10;
        }

        .custom-leaflet-popup .leaflet-popup-close-button:hover {
          background: rgba(0,0,0,0.6);
        }

        .custom-popup {
          width: 280px;
          font-family: 'Manrope', sans-serif;
        }

        .popup-image {
          position: relative;
          height: 140px;
          overflow: hidden;
        }

        .popup-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .popup-image:hover img {
          transform: scale(1.1);
        }

        .popup-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .badge-villa {
          background: #C41E3A;
          color: white;
        }

        .badge-portfolio {
          background: white;
          color: #1a1c1c;
        }

        .popup-content {
          padding: 16px;
        }

        .popup-title {
          font-size: 16px;
          font-weight: 800;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1a1c1c;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .popup-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #757575;
          margin-bottom: 8px;
        }

        .popup-location .material-symbols-outlined {
          font-size: 14px;
          color: #C41E3A;
        }

        .popup-price {
          font-size: 20px;
          font-weight: 800;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #C41E3A;
          margin-bottom: 12px;
        }

        .popup-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 10px;
          background: #C41E3A;
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: bold;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.2s ease;
          box-shadow: 0 4px 12px rgba(196, 30, 58, 0.3);
        }

        .popup-btn:hover {
          background: #930010;
        }

        .popup-btn .material-symbols-outlined {
          font-size: 16px;
        }

        .leaflet-container {
          font-family: 'Manrope', sans-serif;
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }

        .leaflet-control-zoom a {
          background: white !important;
          color: #333 !important;
          border: none !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }

        .leaflet-control-zoom a:hover {
          background: #C41E3A !important;
          color: white !important;
        }
      `}</style>
    </div>
  )
}
