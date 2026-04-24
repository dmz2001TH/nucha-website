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
} from 'lucide-react'

// ─── All public pages to preview ─────────────────────────────────
interface PageEntry {
  name: string
  nameTh: string
  path: string
  category: string
  description?: string
  features?: string[]
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
  },
  {
    name: 'Admin Villas', nameTh: 'จัดการวิลล่า', path: '/admin/villas', category: 'หลังบ้าน (Admin)',
    description: 'จัดการวิลล่าทั้งหมด — เพิ่ม/แก้ไข/ลบ/เรียงลำดับ',
    features: ['รายการวิลล่า', 'เพิ่ม/แก้ไข/ลบวิลล่า', 'อัปโหลดรูปภาพ/แกลเลอรี', 'จัดการ Features', 'สถานะวิลล่า'],
  },
  {
    name: 'Admin Services', nameTh: 'จัดการบริการ', path: '/admin/services', category: 'หลังบ้าน (Admin)',
    description: 'จัดการบริการ — เพิ่ม/แก้ไข/ลบ',
    features: ['รายการบริการ', 'Rich Text Editor', 'อัปโหลดรูปภาพ', 'ตั้งค่าหมวดหมู่'],
  },
  {
    name: 'Admin Portfolio', nameTh: 'จัดการผลงาน', path: '/admin/portfolio', category: 'หลังบ้าน (Admin)',
    description: 'จัดการผลงาน',
    features: ['รายการผลงาน', 'อัปโหลดรูปภาพ', 'ตั้งค่าหมวดหมู่'],
  },
  {
    name: 'Admin Bookings', nameTh: 'ข้อมูลการจอง', path: '/admin/bookings', category: 'หลังบ้าน (Admin)',
    description: 'ดูรายการการจองคิวปรึกษา',
    features: ['รายการการจอง', 'ข้อมูลติดต่อลูกค้า', 'สถานะการจอง', 'กรองข้อมูล'],
  },
  {
    name: 'Admin Inquiries', nameTh: 'ข้อมูลการสอบถาม', path: '/admin/inquiries', category: 'หลังบ้าน (Admin)',
    description: 'ดูรายการข้อสอบถามที่ส่งเข้ามา',
    features: ['รายการข้อสอบถาม', 'ข้อมูลติดต่อลูกค้า', 'สถานะ', 'กรองข้อมูล'],
  },
  {
    name: 'Admin Users', nameTh: 'จัดการผู้ใช้', path: '/admin/users', category: 'หลังบ้าน (Admin)',
    description: 'จัดการบัญชีผู้ใช้และสิทธิ Admin',
    features: ['รายการผู้ใช้', 'เพิ่ม/แก้ไข/ลบผู้ใช้', 'กำหนดสิทธิ์'],
  },
  {
    name: 'Admin Pages', nameTh: 'จัดการหน้าเว็บ', path: '/admin/pages', category: 'หลังบ้าน (Admin)',
    description: 'จัดการหน้าเว็บแบบ Drag & Drop ด้วย Puck Editor',
    features: ['Drag & Drop Page Builder', 'สร้างหน้าใหม่', 'แก้ไขเนื้อหา'],
  },
  {
    name: 'Admin Settings', nameTh: 'ตั้งค่าเว็บไซต์', path: '/admin/settings', category: 'หลังบ้าน (Admin)',
    description: 'ตั้งค่าทั่วไปของเว็บไซต์ — โลโก้, สี, ข้อมูลติดต่อ, SEO',
    features: ['โลโก้/Favicon', 'สี Theme', 'ข้อมูลบริษัท', 'Social Media Links', 'SEO Settings'],
  },
  {
    name: 'Admin Media', nameTh: 'จัดการไฟล์', path: '/admin/media', category: 'หลังบ้าน (Admin)',
    description: 'จัดการไฟล์รูปภาพและเอกสาร',
    features: ['อัปโหลดไฟล์', 'จัดการโฟลเดอร์', 'ลบไฟล์'],
  },
]

const CATEGORIES = [...new Set(ALL_PAGES.map((p) => p.category))]
const CATEGORY_ALL = 'ทั้งหมด'

// ─── Page Component ──────────────────────────────────────────────
export default function PagePreviewPage() {
  const [selectedPages, setSelectedPages] = useState<Set<string>>(
    new Set(ALL_PAGES.map((p) => p.path))
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

  const selectAll = () => setSelectedPages(new Set(ALL_PAGES.map((p) => p.path)))
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

  // ─── Helper: ArrayBuffer → base64 (chunk-safe) ─────────────────
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    const chunkSize = 8192
    let binary = ''
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize)
      binary += String.fromCharCode.apply(null, Array.from(chunk))
    }
    return btoa(binary)
  }

  // ─── Helper: load Thai font for jsPDF ──────────────────────────
  const loadThaiFont = async (pdf: InstanceType<typeof import('jspdf').jsPDF>) => {
    try {
      setExportProgress('กำลังโหลดฟอนต์ภาษาไทย...')
      // Google Fonts GitHub raw variable TTF (supports all weights)
      const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansthai/NotoSansThai%5Bwdth%2Cwght%5D.ttf'

      const res = await fetch(fontUrl)
      if (!res.ok) throw new Error('Font fetch failed')

      const buf = await res.arrayBuffer()
      const base64 = arrayBufferToBase64(buf)

      // Register same variable font as both normal and bold
      pdf.addFileToVFS('NotoSansThai.ttf', base64)
      pdf.addFont('NotoSansThai.ttf', 'NotoSansThai', 'normal')
      pdf.addFont('NotoSansThai.ttf', 'NotoSansThai', 'bold')
      pdf.setFont('NotoSansThai', 'normal')
      return true
    } catch (err) {
      console.warn('Could not load Thai font, falling back to default:', err)
      return false
    }
  }

  // ─── Export selected pages to a single PDF ────────────────────
  const handleExportPDF = useCallback(async () => {
    const pagesToExport = ALL_PAGES.filter((p) => selectedPages.has(p.path))
    if (pagesToExport.length === 0) {
      alert('กรุณาเลือกอย่างน้อย 1 หน้า')
      return
    }

    setExporting(true)
    setExportTotal(pagesToExport.length)
    setExportCurrent(0)

    try {
      const html2canvas = (await import('html2canvas-pro')).default
      const { jsPDF } = await import('jspdf')

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const W = pdf.internal.pageSize.getWidth()   // 297mm
      const H = pdf.internal.pageSize.getHeight()   // 210mm

      // Load Thai font
      const hasThai = await loadThaiFont(pdf)
      const setFont = (style: 'normal' | 'bold') => {
        if (hasThai) pdf.setFont('NotoSansThai', style)
      }

      // ═══════════════════════════════════════════════
      // COVER PAGE — Professional dark design
      // ═══════════════════════════════════════════════
      // Background
      pdf.setFillColor(24, 24, 27)
      pdf.rect(0, 0, W, H, 'F')

      // Accent line at top
      pdf.setFillColor(145, 20, 34) // brand crimson
      pdf.rect(0, 0, W, 1.5, 'F')

      // Left decorative vertical bar
      pdf.setFillColor(145, 20, 34)
      pdf.rect(20, 50, 1.2, 60, 'F')

      // Title block
      setFont('bold')
      pdf.setFontSize(42)
      pdf.setTextColor(255, 255, 255)
      pdf.text('Website Preview', 28, 75)

      setFont('normal')
      pdf.setFontSize(16)
      pdf.setTextColor(194, 143, 80) // brand gold
      pdf.text('NUCHA VILLA — นุชา วิลล่า', 28, 90)

      // Divider line
      pdf.setDrawColor(60, 60, 65)
      pdf.setLineWidth(0.3)
      pdf.line(28, 98, 180, 98)

      // Date
      setFont('normal')
      pdf.setFontSize(11)
      pdf.setTextColor(140, 140, 150)
      const dateStr = new Date().toLocaleDateString('th-TH', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
      const dateStrEn = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
      pdf.text(dateStrEn, 28, 108)
      pdf.text(dateStr, 28, 115)

      // Page count badge
      pdf.setFillColor(40, 40, 45)
      pdf.roundedRect(28, 125, 55, 12, 3, 3, 'F')
      pdf.setFontSize(10)
      pdf.setTextColor(180, 180, 190)
      pdf.text(`${pagesToExport.length} pages included`, 32, 133)

      // Bottom right branding
      pdf.setFontSize(9)
      pdf.setTextColor(70, 70, 80)
      pdf.text('Generated from Nucha Villa Admin Panel', W - 15, H - 12, { align: 'right' })
      pdf.text('nucha-villa.com', W - 15, H - 7, { align: 'right' })

      // ═══════════════════════════════════════════════
      // TABLE OF CONTENTS
      // ═══════════════════════════════════════════════
      pdf.addPage()
      pdf.setFillColor(250, 250, 252)
      pdf.rect(0, 0, W, H, 'F')

      // Header
      pdf.setFillColor(24, 24, 27)
      pdf.rect(0, 0, W, 22, 'F')
      pdf.setFillColor(145, 20, 34)
      pdf.rect(0, 22, W, 1, 'F')

      setFont('bold')
      pdf.setFontSize(14)
      pdf.setTextColor(255, 255, 255)
      pdf.text('Table of Contents — สารบัญหน้าเว็บ', 15, 15)

      // TOC entries
      let tocY = 35
      const catGroups = CATEGORIES.map(cat => ({
        cat,
        pages: pagesToExport.filter(p => p.category === cat)
      })).filter(g => g.pages.length > 0)

      let pageNum = 2 // start after cover + TOC
      for (const group of catGroups) {
        // Category header
        setFont('bold')
        pdf.setFontSize(10)
        pdf.setTextColor(145, 20, 34)
        pdf.text(group.cat, 15, tocY)
        pdf.setDrawColor(220, 220, 225)
        pdf.setLineWidth(0.2)
        pdf.line(15, tocY + 2, W - 15, tocY + 2)
        tocY += 8

        for (const page of group.pages) {
          pageNum++
          setFont('normal')
          pdf.setFontSize(9)
          pdf.setTextColor(60, 60, 65)
          pdf.text(`${page.nameTh}  (${page.name})`, 20, tocY)

          // Dots leader
          pdf.setTextColor(180, 180, 185)
          const labelW = pdf.getTextWidth(`${page.nameTh}  (${page.name})`) + 22
          const pageNumStr = String(pageNum)
          const pageNumW = pdf.getTextWidth(pageNumStr)
          const dotsStart = labelW + 2
          const dotsEnd = W - 15 - pageNumW - 2
          if (dotsEnd > dotsStart) {
            let dotsStr = ''
            const dotW = pdf.getTextWidth('.')
            const numDots = Math.floor((dotsEnd - dotsStart) / (dotW * 1.5))
            for (let d = 0; d < numDots; d++) dotsStr += ' .'
            pdf.text(dotsStr, dotsStart, tocY)
          }

          // Page number
          pdf.setTextColor(100, 100, 110)
          pdf.text(pageNumStr, W - 15, tocY, { align: 'right' })

          // Path
          pdf.setFontSize(7)
          pdf.setTextColor(160, 160, 170)
          pdf.text(page.path, 20, tocY + 4)

          // Description in TOC
          if (page.description) {
            pdf.setFontSize(6.5)
            pdf.setTextColor(130, 130, 140)
            const tocDescLines = pdf.splitTextToSize(page.description, W - 45)
            pdf.text(tocDescLines.slice(0, 2), 20, tocY + 7.5)
            tocY += Math.min(tocDescLines.length, 2) * 3
          }

          tocY += 10
          if (tocY > H - 15) {
            pdf.addPage()
            pdf.setFillColor(250, 250, 252)
            pdf.rect(0, 0, W, H, 'F')
            tocY = 20
          }
        }
        tocY += 4
      }

      // ═══════════════════════════════════════════════
      // CAPTURE EACH PAGE
      // ═══════════════════════════════════════════════
      setExportProgress('กำลังเตรียมจับภาพหน้าเว็บ...')
      const captureContainer = document.createElement('div')
      captureContainer.style.cssText =
        'position:fixed;top:0;left:0;width:1440px;height:900px;z-index:-9999;opacity:0;pointer-events:none;overflow:hidden;'
      document.body.appendChild(captureContainer)

      const captureIframeEl = document.createElement('iframe')
      captureIframeEl.style.cssText = 'width:1440px;height:900px;border:none;'
      captureContainer.appendChild(captureIframeEl)

      for (let i = 0; i < pagesToExport.length; i++) {
        const page = pagesToExport[i]
        setExportCurrent(i + 1)
        setExportProgress(`กำลังจับภาพ: ${page.nameTh} (${i + 1}/${pagesToExport.length})`)

        await new Promise<void>((resolve) => {
          captureIframeEl.onload = () => setTimeout(resolve, 2000)
          captureIframeEl.src = page.path
        })

        let canvasImg: string | null = null
        let canvasW = 1440
        let canvasH = 900

        try {
          const iframeDoc = captureIframeEl.contentDocument || captureIframeEl.contentWindow?.document
          if (iframeDoc?.body) {
            const canvas = await html2canvas(iframeDoc.body, {
              scale: 1.5, useCORS: true, allowTaint: true,
              backgroundColor: '#ffffff', logging: false,
              width: 1440, windowWidth: 1440,
              height: Math.min(iframeDoc.body.scrollHeight, 4000),
            })
            canvasImg = canvas.toDataURL('image/jpeg', 0.85)
            canvasW = canvas.width
            canvasH = canvas.height
          }
        } catch (err) {
          console.error(`Failed to capture ${page.path}:`, err)
        }

        pdf.addPage()

        // ── Helper to draw page header bar ──
        const drawPageHeader = () => {
          pdf.setFillColor(24, 24, 27)
          pdf.rect(0, 0, W, 14, 'F')
          pdf.setFillColor(145, 20, 34)
          pdf.rect(0, 14, W, 0.5, 'F')

          setFont('bold')
          pdf.setFontSize(9)
          pdf.setTextColor(255, 255, 255)
          pdf.text(`${page.nameTh}  —  ${page.name}`, 8, 9)

          setFont('normal')
          pdf.setFontSize(7)
          pdf.setTextColor(140, 140, 150)
          pdf.text(page.path, 8, 12.5)

          // Page number
          pdf.setFontSize(8)
          pdf.setTextColor(100, 100, 110)
          pdf.text(`${i + 1} / ${pagesToExport.length}`, W - 8, 9, { align: 'right' })

          // Category badge
          pdf.setFillColor(50, 50, 55)
          const catText = page.category
          const catBadgeW = pdf.getTextWidth(catText) + 6
          pdf.roundedRect(W - 8 - catBadgeW, 10.5, catBadgeW, 4.5, 1, 1, 'F')
          pdf.setFontSize(6)
          pdf.setTextColor(180, 180, 190)
          pdf.text(catText, W - 8 - catBadgeW + 3, 13.5)
        }

        if (canvasImg) {
          // ── Screenshot page ──
          drawPageHeader()

          // ── Screenshot area (left ~65%) + Description sidebar (right ~35%) ──
          const hasDesc = page.description || (page.features && page.features.length > 0)
          const margin = 6
          const contentTop = 16
          const contentH = H - contentTop - margin

          if (hasDesc) {
            // Layout: screenshot on left, description on right
            const descPanelW = 82
            const imgAreaW = W - margin * 2 - descPanelW - 4
            const imgAreaH = contentH

            const imgRatio = canvasW / canvasH
            const areaRatio = imgAreaW / imgAreaH
            let drawW: number, drawH: number, drawX: number, drawY: number
            if (imgRatio > areaRatio) {
              drawW = imgAreaW; drawH = imgAreaW / imgRatio
              drawX = margin; drawY = contentTop + (imgAreaH - drawH) / 2
            } else {
              drawH = imgAreaH; drawW = imgAreaH * imgRatio
              drawX = margin + (imgAreaW - drawW) / 2; drawY = contentTop
            }

            // Shadow + Image + Border
            pdf.setFillColor(230, 230, 235)
            pdf.roundedRect(drawX + 1, drawY + 1, drawW, drawH, 1, 1, 'F')
            pdf.addImage(canvasImg, 'JPEG', drawX, drawY, drawW, drawH)
            pdf.setDrawColor(200, 200, 210)
            pdf.setLineWidth(0.3)
            pdf.roundedRect(drawX, drawY, drawW, drawH, 1, 1, 'S')

            // ── Description panel on the right ──
            const descX = W - margin - descPanelW
            let descY = contentTop + 2

            // Description panel background
            pdf.setFillColor(248, 248, 252)
            pdf.roundedRect(descX - 2, contentTop, descPanelW + 2, contentH, 2, 2, 'F')
            pdf.setDrawColor(230, 230, 235)
            pdf.setLineWidth(0.2)
            pdf.roundedRect(descX - 2, contentTop, descPanelW + 2, contentH, 2, 2, 'S')

            // Section title
            setFont('bold')
            pdf.setFontSize(8)
            pdf.setTextColor(145, 20, 34)
            pdf.text('รายละเอียดหน้า', descX + 2, descY + 4)
            descY += 8

            // Divider
            pdf.setDrawColor(220, 220, 225)
            pdf.setLineWidth(0.2)
            pdf.line(descX + 2, descY, descX + descPanelW - 4, descY)
            descY += 4

            // Description text
            if (page.description) {
              setFont('normal')
              pdf.setFontSize(7)
              pdf.setTextColor(70, 70, 80)
              const descLines = pdf.splitTextToSize(page.description, descPanelW - 8)
              pdf.text(descLines, descX + 2, descY)
              descY += descLines.length * 3.2 + 4
            }

            // Features
            if (page.features && page.features.length > 0) {
              setFont('bold')
              pdf.setFontSize(7)
              pdf.setTextColor(145, 20, 34)
              pdf.text('ฟีเจอร์ / ความสามารถ', descX + 2, descY)
              descY += 5

              setFont('normal')
              pdf.setFontSize(6.5)
              for (const feat of page.features) {
                if (descY > H - margin - 4) break
                // Bullet dot
                pdf.setFillColor(145, 20, 34)
                pdf.circle(descX + 4, descY - 0.8, 0.6, 'F')
                // Feature text
                pdf.setTextColor(80, 80, 90)
                pdf.text(feat, descX + 7, descY)
                descY += 4
              }
            }
          } else {
            // No description — full-width screenshot
            const contentW = W - margin * 2
            const imgRatio = canvasW / canvasH
            const areaRatio = contentW / contentH
            let drawW: number, drawH: number, drawX: number, drawY: number
            if (imgRatio > areaRatio) {
              drawW = contentW; drawH = contentW / imgRatio
              drawX = margin; drawY = contentTop + (contentH - drawH) / 2
            } else {
              drawH = contentH; drawW = contentH * imgRatio
              drawX = margin + (contentW - drawW) / 2; drawY = contentTop
            }
            pdf.setFillColor(230, 230, 235)
            pdf.roundedRect(drawX + 1, drawY + 1, drawW, drawH, 1, 1, 'F')
            pdf.addImage(canvasImg, 'JPEG', drawX, drawY, drawW, drawH)
            pdf.setDrawColor(200, 200, 210)
            pdf.setLineWidth(0.3)
            pdf.roundedRect(drawX, drawY, drawW, drawH, 1, 1, 'S')
          }
        } else {
          // Fallback if capture failed
          drawPageHeader()
          pdf.setFillColor(245, 245, 248)
          pdf.rect(0, 16, W, H - 16, 'F')

          setFont('bold')
          pdf.setFontSize(16)
          pdf.setTextColor(100, 100, 110)
          pdf.text(`${page.nameTh}`, W / 2, 60, { align: 'center' })
          setFont('normal')
          pdf.setFontSize(11)
          pdf.setTextColor(150, 150, 160)
          pdf.text(`(${page.name})`, W / 2, 70, { align: 'center' })
          pdf.setFontSize(9)
          pdf.text(`ไม่สามารถจับภาพหน้านี้ได้ — ${page.path}`, W / 2, 80, { align: 'center' })

          // Still show description even if capture failed
          if (page.description) {
            let descFallbackY = 100
            setFont('bold')
            pdf.setFontSize(9)
            pdf.setTextColor(145, 20, 34)
            pdf.text('รายละเอียดหน้า', W / 2 - 60, descFallbackY)
            descFallbackY += 6
            setFont('normal')
            pdf.setFontSize(8)
            pdf.setTextColor(80, 80, 90)
            const descLines = pdf.splitTextToSize(page.description, 160)
            pdf.text(descLines, W / 2 - 60, descFallbackY)
            descFallbackY += descLines.length * 4 + 6

            if (page.features && page.features.length > 0) {
              setFont('bold')
              pdf.setFontSize(8)
              pdf.setTextColor(145, 20, 34)
              pdf.text('ฟีเจอร์:', W / 2 - 60, descFallbackY)
              descFallbackY += 5
              setFont('normal')
              pdf.setFontSize(7)
              pdf.setTextColor(80, 80, 90)
              for (const feat of page.features) {
                pdf.text(`•  ${feat}`, W / 2 - 56, descFallbackY)
                descFallbackY += 4
              }
            }
          }
        }
      }

      // Cleanup
      document.body.removeChild(captureContainer)
      setExportProgress('กำลังสร้าง PDF...')
      pdf.save(`nucha-website-preview-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('เกิดข้อผิดพลาดในการส่งออก PDF')
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
                <p className="text-sm font-medium text-gray-900 truncate">{page.nameTh}</p>
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
