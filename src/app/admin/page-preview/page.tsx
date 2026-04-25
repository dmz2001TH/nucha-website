'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import {
  Eye,
  Download,
  Loader2,
  Monitor,
  Smartphone,
  ExternalLink,
  Check,
  RefreshCw,
  Maximize2,
  X,
  LayoutGrid,
  Lock,
} from 'lucide-react'

// ─── All public pages to preview ─────────────────────────────────
interface PageEntry {
  name: string
  nameTh: string
  path: string
  category: string
  description?: string
  features?: string[]
  requiresAuth?: boolean
}

const ALL_PAGES: PageEntry[] = [
  // ─── Main pages ───
  {
    name: 'Homepage', nameTh: 'หน้าแรก', path: '/', category: 'หน้าหลัก',
    description: 'หน้าแรกของเว็บไซต์ แสดง Hero Slideshow, โครงการแนะนำ, โปรโมชั่น, ข่าวสาร และแผนที่',
    features: ['Hero Slideshow', 'โครงการแนะนำ (Featured Villas)', 'โปรโมชั่นล่าสุด', 'Quick Search', 'แผนที่โครงการ', 'บริการ'],
  },
  {
    name: 'Villas', nameTh: 'วิลล่าทั้งหมด', path: '/villas', category: 'หน้าหลัก',
    description: 'รายการวิลล่าทั้งหมด รองรับการค้นหา, กรองตามสถานะ/ราคา/ทำเล, และเรียงลำดับ',
    features: ['ค้นหาวิลล่า', 'กรองตามสถานะ/ราคา/ทำเล', 'เรียงลำดับ', 'แสดงแบบ Grid/List', 'Pagination'],
  },
  {
    name: 'Contact', nameTh: 'ติดต่อเรา', path: '/contact', category: 'หน้าหลัก',
    description: 'ฟอร์มติดต่อเรา, ข้อมูลติดต่อบริษัท, แผนที่สำนักงาน',
    features: ['ฟอร์มติดต่อ (ส่ง Lead)', 'แผนที่ Google Maps', 'ข้อมูลที่อยู่/โทรศัพท์/อีเมล', 'LINE QR Code'],
  },
  {
    name: 'Services', nameTh: 'บริการ', path: '/services', category: 'หน้าหลัก',
    description: 'รายการบริการทั้งหมด รองรับหมวดหมู่และ Pagination',
    features: ['รายการบริการ', 'หมวดหมู่', 'รูปภาพ Cover', 'Pagination'],
  },
  {
    name: 'Portfolio', nameTh: 'ผลงาน', path: '/portfolio', category: 'หน้าหลัก',
    description: 'แสดงผลงานโครงการที่สำเร็จแล้ว',
    features: ['แกลเลอรีผลงาน', 'รายละเอียดโครงการ', 'Filter ตามหมวดหมู่'],
  },
  {
    name: 'Booking', nameTh: 'จองคิว', path: '/booking', category: 'หน้าหลัก',
    description: 'ฟอร์มจองคิวปรึกษา',
    features: ['ฟอร์มจองคิว', 'เลือกวันที่', 'เลือกบริการ'],
  },
  {
    name: 'Map', nameTh: 'แผนที่', path: '/map', category: 'หน้าหลัก',
    description: 'แผนที่แสดงตำแหน่งโครงการทั้งหมด',
    features: ['Interactive Map', 'Pin โครงการทั้งหมด', 'Popup ข้อมูลโครงการ'],
  },

  // ─── Info pages ───
  {
    name: 'Philosophy', nameTh: 'ปรัชญา', path: '/philosophy', category: 'ข้อมูลบริษัท',
    description: 'ปรัชญาและค่านิยมของบริษัท',
    features: ['ข้อมูลปรัชญา', 'ค่านิยม', 'รูปภาพประกอบ'],
  },

  // ─── Admin / Backend pages ───
  {
    name: 'Admin Dashboard', nameTh: 'แดชบอร์ดแอดมิน', path: '/admin', category: 'หลังบ้าน (Admin)',
    description: 'หน้าหลักของระบบหลังบ้าน แสดงสรุปข้อมูลสำคัญ',
    features: ['สรุปจำนวนวิลล่า/ลูกค้า', 'สถิติการเข้าชม', 'ลิงก์ด่วนไปหน้าต่างๆ'],
    requiresAuth: true,
  },
  {
    name: 'Admin Villas', nameTh: 'จัดการวิลล่า', path: '/admin/villas', category: 'หลังบ้าน (Admin)',
    description: 'จัดการวิลล่าทั้งหมด — เพิ่ม/แก้ไข/ลบ/เรียงลำดับ',
    features: ['รายการวิลล่า', 'เพิ่ม/แก้ไข/ลบวิลล่า', 'อัปโหลดรูปภาพ/แกลเลอรี', 'จัดการ Features', 'สถานะวิลล่า'],
    requiresAuth: true,
  },
  {
    name: 'Admin Services', nameTh: 'จัดการบริการ', path: '/admin/services', category: 'หลังบ้าน (Admin)',
    description: 'จัดการบริการ — เพิ่ม/แก้ไข/ลบ',
    features: ['รายการบริการ', 'Rich Text Editor', 'อัปโหลดรูปภาพ', 'ตั้งค่าหมวดหมู่'],
    requiresAuth: true,
  },
  {
    name: 'Admin Portfolio', nameTh: 'จัดการผลงาน', path: '/admin/portfolio', category: 'หลังบ้าน (Admin)',
    description: 'จัดการผลงาน',
    features: ['รายการผลงาน', 'อัปโหลดรูปภาพ', 'ตั้งค่าหมวดหมู่'],
    requiresAuth: true,
  },
  {
    name: 'Admin Bookings', nameTh: 'ข้อมูลการจอง', path: '/admin/bookings', category: 'หลังบ้าน (Admin)',
    description: 'ดูรายการการจองคิวปรึกษา',
    features: ['รายการการจอง', 'ข้อมูลติดต่อลูกค้า', 'สถานะการจอง', 'กรองข้อมูล'],
    requiresAuth: true,
  },
  {
    name: 'Admin Inquiries', nameTh: 'ข้อมูลการสอบถาม', path: '/admin/inquiries', category: 'หลังบ้าน (Admin)',
    description: 'ดูรายการข้อสอบถามที่ส่งเข้ามา',
    features: ['รายการข้อสอบถาม', 'ข้อมูลติดต่อลูกค้า', 'สถานะ', 'กรองข้อมูล'],
    requiresAuth: true,
  },
  {
    name: 'Admin Users', nameTh: 'จัดการผู้ใช้', path: '/admin/users', category: 'หลังบ้าน (Admin)',
    description: 'จัดการบัญชีผู้ใช้และสิทธิ Admin',
    features: ['รายการผู้ใช้', 'เพิ่ม/แก้ไข/ลบผู้ใช้', 'กำหนดสิทธิ์'],
    requiresAuth: true,
  },
  {
    name: 'Admin Pages', nameTh: 'จัดการหน้าเว็บ', path: '/admin/pages', category: 'หลังบ้าน (Admin)',
    description: 'จัดการหน้าเว็บแบบ Drag & Drop ด้วย Puck Editor',
    features: ['Drag & Drop Page Builder', 'สร้างหน้าใหม่', 'แก้ไขเนื้อหา'],
    requiresAuth: true,
  },
  {
    name: 'Admin Settings', nameTh: 'ตั้งค่าเว็บไซต์', path: '/admin/settings', category: 'หลังบ้าน (Admin)',
    description: 'ตั้งค่าทั่วไปของเว็บไซต์ — โลโก้, สี, ข้อมูลติดต่อ, SEO',
    features: ['โลโก้/Favicon', 'สี Theme', 'ข้อมูลบริษัท', 'Social Media Links', 'SEO Settings'],
    requiresAuth: true,
  },
  {
    name: 'Admin Media', nameTh: 'จัดการไฟล์', path: '/admin/media', category: 'หลังบ้าน (Admin)',
    description: 'จัดการไฟล์รูปภาพและเอกสาร',
    features: ['อัปโหลดไฟล์', 'จัดการโฟลเดอร์', 'ลบไฟล์'],
    requiresAuth: true,
  },
]

const CATEGORIES = [...new Set(ALL_PAGES.map((p) => p.category))]
const CATEGORY_ALL = 'ทั้งหมด'

// ─── Page Component ──────────────────────────────────────────────
export default function PagePreviewPage() {
  const [selectedPages, setSelectedPages] = useState<Set<string>>(
    new Set(ALL_PAGES.filter((p) => !p.requiresAuth).map((p) => p.path))
  )
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL)
  const [exporting, setExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState('')
  const [exportCurrent, setExportCurrent] = useState(0)
  const [exportTotal, setExportTotal] = useState(0)
  const [fullscreenPage, setFullscreenPage] = useState<PageEntry | null>(null)
  const [fullscreenDevice, setFullscreenDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [iframeKeys, setIframeKeys] = useState(0)
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map())
  const previewContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [containerWidths, setContainerWidths] = useState<Map<string, number>>(new Map())
  const observerRef = useRef<ResizeObserver | null>(null)

  // Single ResizeObserver instance
  useEffect(() => {
    observerRef.current = new ResizeObserver((entries) => {
      setContainerWidths((prev) => {
        const next = new Map(prev)
        let changed = false
        for (const entry of entries) {
          const key = (entry.target as HTMLElement).dataset.pagePath
          if (key) {
            const w = Math.round(entry.contentRect.width)
            if (next.get(key) !== w) {
              next.set(key, w)
              changed = true
            }
          }
        }
        return changed ? next : prev
      })
    })
    return () => observerRef.current?.disconnect()
  }, [])

  // Helper to register preview container ref + observe
  const setPreviewRef = useCallback((path: string) => (el: HTMLDivElement | null) => {
    if (el) {
      previewContainerRefs.current.set(path, el)
      observerRef.current?.observe(el)
    }
  }, [])

  // Filtered pages based on active category & selection
  const visiblePages = useMemo(() => {
    return ALL_PAGES.filter((p) => {
      const inCategory = activeCategory === CATEGORY_ALL || p.category === activeCategory
      const isSelected = selectedPages.has(p.path)
      return inCategory && isSelected
    })
  }, [activeCategory, selectedPages])

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { [CATEGORY_ALL]: selectedPages.size }
    CATEGORIES.forEach((cat) => {
      counts[cat] = ALL_PAGES.filter((p) => p.category === cat && selectedPages.has(p.path)).length
    })
    return counts
  }, [selectedPages])

  const togglePage = (path: string) => {
    setSelectedPages((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const selectAll = () => setSelectedPages(new Set(ALL_PAGES.filter((p) => !p.requiresAuth).map((p) => p.path)))
  const deselectAll = () => setSelectedPages(new Set())

  const toggleCategory = (cat: string) => {
    const pagesInCat = ALL_PAGES.filter((p) => p.category === cat)
    const allSelected = pagesInCat.every((p) => selectedPages.has(p.path))
    setSelectedPages((prev) => {
      const next = new Set(prev)
      pagesInCat.forEach((p) => {
        if (allSelected) next.delete(p.path)
        else next.add(p.path)
      })
      return next
    })
  }

  const refreshAll = () => setIframeKeys((k) => k + 1)

  // ─── Export selected pages to a single PDF ────────────────────
  const handleExportPDF = useCallback(async () => {
    // Filter: skip auth-required pages for PDF (iframe can't capture authenticated sessions)
    const pagesToExport = ALL_PAGES.filter((p) => selectedPages.has(p.path) && !p.requiresAuth)
    const skippedAuth = ALL_PAGES.filter((p) => selectedPages.has(p.path) && p.requiresAuth)
    
    if (skippedAuth.length > 0) {
      console.warn('Skipped auth pages from PDF export:', skippedAuth.map(p => p.path))
    }
    
    if (pagesToExport.length === 0) {
      alert('กรุณาเลือกอย่างน้อย 1 หน้าที่ไม่ต้อง Login')
      return
    }

    setExporting(true)
    setExportTotal(pagesToExport.length)
    setExportCurrent(0)

    try {
      const html2canvas = (await import('html2canvas-pro')).default
      // Collect page data with screenshots for API
      const exportPages: Array<{
        name: string
        nameTh: string
        path: string
        category: string
        description?: string
        features?: string[]
        screenshot?: string
        requiresAuth?: boolean
      }> = []
      
      setExportProgress('กำลังเตรียมจับภาพหน้าเว็บ...')
      const captureContainer = document.createElement('div')
      captureContainer.style.cssText =
        'position:fixed;top:0;left:0;width:1440px;height:900px;z-index:-9999;pointer-events:none;overflow:hidden;'
      document.body.appendChild(captureContainer)

      for (let i = 0; i < pagesToExport.length; i++) {
        const page = pagesToExport[i]
        setExportCurrent(i + 1)
        setExportProgress(`กำลังจับภาพ: ${page.nameTh} (${i + 1}/${pagesToExport.length})`)

        // Create fresh iframe for each page to avoid state contamination
        const captureIframeEl = document.createElement('iframe')
        captureIframeEl.style.cssText = 'width:1440px;height:900px;border:none;'
        captureContainer.appendChild(captureIframeEl)

        // Wait for page to fully load with smart detection
        await new Promise<void>((resolve) => {
          let loadTimeout: NodeJS.Timeout
          let checkInterval: NodeJS.Timeout
          
          captureIframeEl.onload = () => {
            // Give more time for React hydration and images to load
            loadTimeout = setTimeout(() => {
              const checkReady = () => {
                try {
                  const iframeDoc = captureIframeEl.contentDocument || captureIframeEl.contentWindow?.document
                  const readyState = iframeDoc?.readyState
                  const hasBody = iframeDoc?.body && iframeDoc.body.innerHTML.length > 200
                  
                  // Check if images are loaded (including background images)
                  const images = iframeDoc?.querySelectorAll('img')
                  const imagesLoaded = Array.from(images || []).every((img: HTMLImageElement) => {
                    if (img.complete) return true
                    // Force lazy images to load by setting loading to eager
                    img.setAttribute('loading', 'eager')
                    return false
                  })
                  
                  // Check fonts loaded
                  const fontsReady = iframeDoc?.fonts?.status === 'loaded'
                  
                  if (readyState === 'complete' && hasBody && (imagesLoaded || attempts > 20)) {
                    // Give extra 500ms for any final renders
                    setTimeout(() => {
                      clearInterval(checkInterval)
                      resolve()
                    }, 500)
                  }
                } catch (e) {
                  // Cross-origin or other error, just wait fixed time
                  clearInterval(checkInterval)
                  resolve()
                }
              }
              
              // Check every 500ms, max 25 seconds total
              let attempts = 0
              checkInterval = setInterval(() => {
                attempts++
                checkReady()
                if (attempts > 50) {
                  clearInterval(checkInterval)
                  resolve() // fallback after 25s
                }
              }, 500)
              
              // Initial check
              checkReady()
            }, 3000) // Increased to 3s for React hydration + lazy images
          }
          
          // Fallback in case onload doesn't fire
          setTimeout(() => {
            clearInterval(checkInterval)
            resolve()
          }, 25000) // Max 25 seconds total wait
          
          captureIframeEl.src = page.path
        })

        let canvasImg: string | null = null
        let canvasW = 1440
        let canvasH = 900

        // ── Scroll to trigger lazy loading and get full content ──
        try {
          const iframeWin = captureIframeEl.contentWindow
          if (iframeWin) {
            iframeWin.scrollTo(0, 0)
            await new Promise(r => setTimeout(r, 300))
            // Scroll down to trigger lazy loaded images
            const scrollStep = 800
            const maxScroll = Math.min(iframeWin.document.body.scrollHeight, 4000)
            for (let y = 0; y < maxScroll; y += scrollStep) {
              iframeWin.scrollTo(0, y)
              await new Promise(r => setTimeout(r, 150))
            }
            iframeWin.scrollTo(0, 0)
            await new Promise(r => setTimeout(r, 300))
          }
        } catch (e) {
          console.warn('Scroll trigger failed:', e)
        }

        // ── Detect redirect/login page ──
        let isLoginRedirect = false
        try {
          const iframeDoc = captureIframeEl.contentDocument || captureIframeEl.contentWindow?.document
          if (iframeDoc) {
            const bodyText = iframeDoc.body?.innerText?.toLowerCase() || ''
            const hasLoginForm = iframeDoc.querySelector('input[type="password"]') !== null
            const hasLoginText = /login|เข้าสู่ระบบ|sign in|ลงชื่อเข้าใช้/.test(bodyText)
            const isRedirect = iframeDoc.body?.innerHTML?.length < 500 && hasLoginText
            isLoginRedirect = hasLoginForm || isRedirect
            
            if (isLoginRedirect) {
              console.warn(`Page ${page.path} redirected to login, using fallback`)
            }
          }
        } catch (e) {
          console.warn('Redirect detection failed:', e)
        }

        if (!isLoginRedirect) {
          try {
            const iframeDoc = captureIframeEl.contentDocument || captureIframeEl.contentWindow?.document
            if (iframeDoc?.body && iframeDoc.body.innerHTML.length > 100) {
              const canvas = await html2canvas(iframeDoc.body, {
                scale: 1.5, useCORS: true, allowTaint: true,
                backgroundColor: '#ffffff', logging: false,
                width: 1440, windowWidth: 1440,
                height: Math.min(iframeDoc.body.scrollHeight, 4000),
              })
              canvasImg = canvas.toDataURL('image/jpeg', 0.85)
              canvasW = canvas.width
              canvasH = canvas.height
            } else {
              console.warn(`Page ${page.path} body empty or too small`)
            }
          } catch (err) {
            console.error(`Failed to capture ${page.path}:`, err)
          }
        }

        // Store page data with screenshot for API
        exportPages.push({
          name: page.name,
          nameTh: page.nameTh,
          path: page.path,
          category: page.category,
          description: page.description,
          features: page.features,
          screenshot: canvasImg || undefined,
          requiresAuth: isLoginRedirect
        })
        
        // Clean up iframe after each capture to prevent state contamination
        captureContainer.removeChild(captureIframeEl)
      }

      // Cleanup container
      document.body.removeChild(captureContainer)
      
      // Send to API for PDF generation with Puppeteer
      setExportProgress('กำลังสร้าง PDF ด้วย Puppeteer...')
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pages: exportPages,
          title: 'NUCHA VILLA Website Preview Report'
        })
      })
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(error.error || `HTTP ${response.status}`)
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nucha-website-preview-${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      
      setExportProgress('ส่งออก PDF สำเร็จ!')
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('เกิดข้อผิดพลาดในการส่งออก PDF: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setExporting(false)
      setExportProgress('')
      setExportCurrent(0)
      setExportTotal(0)
    }
  }, [selectedPages])

  return (
    <div className="space-y-5">
      {/* ─── Clean Header ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-500" />
            Page Preview
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {selectedPages.size} หน้าที่เลือก · {ALL_PAGES.length} หน้าทั้งหมด
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                viewMode === 'desktop'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                viewMode === 'mobile'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>

          <button
            onClick={refreshAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors bg-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            รีเฟรช
          </button>

          <button
            onClick={handleExportPDF}
            disabled={exporting || selectedPages.size === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {exporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                กำลังส่งออก...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                ส่งออก PDF ({selectedPages.size})
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── Export Progress Overlay ─── */}
      {exporting && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
            <div className="flex flex-col items-center text-center">
              <Loader2 className="w-6 h-6 text-gray-900 animate-spin mb-3" />
              <h3 className="text-base font-medium text-gray-900">กำลังสร้าง PDF</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">{exportProgress}</p>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: exportTotal > 0 ? `${(exportCurrent / exportTotal) * 100}%` : '0%' }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {exportCurrent} / {exportTotal} หน้า
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Selection Bar ─── */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">เลือกหน้าที่ต้องการแสดง</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="text-xs text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-white transition-colors"
            >
              เลือกทั้งหมด
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={deselectAll}
              className="text-xs text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-white transition-colors"
            >
              ยกเลิกทั้งหมด
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALL_PAGES.map((page) => {
            const selected = selectedPages.has(page.path)
            return (
              <button
                key={page.path}
                onClick={() => togglePage(page.path)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selected
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {selected && <Check className="w-3 h-3" />}
                {page.nameTh}
                {page.requiresAuth && (
                  <span title="ต้อง Login เพื่อเข้าถึง">
                    <Lock className="w-3 h-3 text-amber-500 ml-0.5" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Category Tabs ─── */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {[CATEGORY_ALL, ...CATEGORIES].map((cat) => {
          const count = categoryCount[cat] ?? 0
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ─── Page Preview Grid ─── */}
      <div
        className={`grid gap-4 ${
          viewMode === 'desktop'
            ? 'grid-cols-1 xl:grid-cols-2'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {visiblePages.map((page) => (
          <div
            key={page.path}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
          >
            {/* Clean card header */}
            <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate flex items-center gap-1">
                  {page.nameTh}
                  {page.requiresAuth && (
                    <span title="ต้อง Login เพื่อเข้าถึง">
                      <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-gray-400 truncate">{page.path}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => { setFullscreenPage(page); setFullscreenDevice(viewMode) }}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="ดูแบบเต็มจอ"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <a
                  href={page.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="เปิดในแท็บใหม่"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Iframe preview */}
            {(() => {
              const cw = containerWidths.get(page.path) || 0
              const iframeW = viewMode === 'desktop' ? 1440 : 390
              const iframeH = viewMode === 'desktop' ? 900 : 844
              const scale = cw > 0 ? cw / iframeW : 0.35
              const visibleH = iframeH * scale
              return (
                <div
                  ref={setPreviewRef(page.path)}
                  data-page-path={page.path}
                  className="relative bg-gray-50 overflow-hidden"
                  style={{ height: `${Math.min(visibleH, viewMode === 'desktop' ? 360 : 420)}px` }}
                >
                  <div
                    style={{
                      width: `${iframeW}px`,
                      height: `${iframeH}px`,
                      transformOrigin: 'top left',
                      transform: `scale(${scale})`,
                    }}
                  >
                    <iframe
                      key={`${page.path}-${iframeKeys}`}
                      ref={(el) => { if (el) iframeRefs.current.set(page.path, el) }}
                      src={page.path}
                      className="w-full h-full border-0 bg-white"
                      title={page.name}
                      loading="lazy"
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>

                  {/* Subtle hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setFullscreenPage(page); setFullscreenDevice(viewMode) }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-gray-900 text-xs font-medium hover:bg-gray-50"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      ดูเต็มจอ
                    </button>
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-gray-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      เปิดหน้า
                    </a>
                  </div>
                </div>
              )
            })()}

            {/* Card footer - minimal info */}
            {page.description && (
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                <p className="text-[11px] text-gray-500 line-clamp-1">{page.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── Empty State ─── */}
      {visiblePages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Eye className="w-8 h-8 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-600">
            {selectedPages.size === 0 ? 'ยังไม่ได้เลือกหน้า' : 'ไม่มีหน้าในหมวดนี้'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {selectedPages.size === 0
              ? 'เลือกหน้าที่ต้องการดูตัวอย่างจากด้านบน'
              : 'ลองเลือกหมวดหมู่อื่น'
            }
          </p>
        </div>
      )}

      {/* ─── Fullscreen Modal ─── */}
      {fullscreenPage && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-xl">
            {/* Clean modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {fullscreenPage.nameTh}
                    <span className="text-gray-400 ml-2 text-xs">{fullscreenPage.name}</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">{fullscreenPage.path}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded border border-gray-200 overflow-hidden bg-white">
                  <button
                    onClick={() => setFullscreenDevice('desktop')}
                    className={`p-1.5 transition-colors ${
                      fullscreenDevice === 'desktop' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setFullscreenDevice('mobile')}
                    className={`p-1.5 transition-colors ${
                      fullscreenDevice === 'mobile' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
                <a
                  href={fullscreenPage.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 bg-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  เปิด
                </a>
                <button
                  onClick={() => setFullscreenPage(null)}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Modal iframe */}
            <div className="flex-1 overflow-hidden bg-gray-100 flex items-start justify-center">
              <div className={`bg-white h-full transition-all ${
                fullscreenDevice === 'desktop' ? 'w-full' : 'w-[390px] border-x border-gray-200'
              }`}>
                <iframe
                  src={fullscreenPage.path}
                  className="w-full h-full border-0"
                  title={fullscreenPage.name}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
