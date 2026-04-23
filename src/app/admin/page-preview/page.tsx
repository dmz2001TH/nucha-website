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
  Globe,
  Maximize2,
  X,
  Layers,
  ChevronDown,
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
  const [selectionOpen, setSelectionOpen] = useState(false)
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
    <div className="space-y-0">
      {/* ─── Professional Header ─── */}
      <div className="relative -mx-6 -mt-6 mb-6 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-8 py-8">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Page Preview
                </h1>
                <p className="text-sm text-zinc-400">
                  ดูตัวอย่างหน้าเว็บทั้งหมดและส่งออกเป็น PDF
                </p>
              </div>
            </div>
            {/* Stats row */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2 ring-1 ring-white/10">
                <Layers className="w-4 h-4 text-zinc-300" />
                <span className="text-sm font-semibold text-white">{ALL_PAGES.length}</span>
                <span className="text-xs text-zinc-400">หน้าทั้งหมด</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 backdrop-blur-sm px-4 py-2 ring-1 ring-emerald-400/20">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300">{selectedPages.size}</span>
                <span className="text-xs text-emerald-400/70">เลือกแล้ว</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2 ring-1 ring-white/10">
                <Globe className="w-4 h-4 text-zinc-300" />
                <span className="text-xs text-zinc-400">{CATEGORIES.length} หมวดหมู่</span>
              </div>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            {/* Device toggle */}
            <div className="flex rounded-xl bg-white/10 backdrop-blur-sm p-1 ring-1 ring-white/10">
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>

            <button
              onClick={refreshAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white text-xs font-medium ring-1 ring-white/10 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              รีเฟรช
            </button>

            <button
              onClick={handleExportPDF}
              disabled={exporting || selectedPages.size === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/20"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังส่งออก...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>ส่งออก PDF</span>
                  <span className="ml-1 px-1.5 py-0.5 rounded-md bg-zinc-900 text-white text-[10px] font-bold">
                    {selectedPages.size}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Export Progress Overlay ─── */}
      {exporting && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center mb-5">
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">กำลังสร้าง PDF</h3>
              <p className="text-sm text-zinc-500 mb-5">{exportProgress}</p>
              <div className="w-full bg-zinc-100 rounded-full h-2.5 mb-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-zinc-700 to-zinc-900 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: exportTotal > 0 ? `${(exportCurrent / exportTotal) * 100}%` : '0%' }}
                />
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                {exportCurrent} / {exportTotal} หน้า
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Selection Panel (collapsible) ─── */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <button
          onClick={() => setSelectionOpen(!selectionOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-zinc-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-semibold text-zinc-700">เลือกหน้าที่ต้องการแสดง</span>
            <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
              {selectedPages.size}/{ALL_PAGES.length}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${selectionOpen ? 'rotate-180' : ''}`} />
        </button>

        {selectionOpen && (
          <div className="px-5 pb-5 border-t border-zinc-100">
            {/* Quick actions */}
            <div className="flex items-center gap-2 pt-3 pb-4">
              <button
                onClick={selectAll}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300 rounded-lg px-3 py-1.5 transition-colors"
              >
                เลือกทั้งหมด
              </button>
              <button
                onClick={deselectAll}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300 rounded-lg px-3 py-1.5 transition-colors"
              >
                ยกเลิกทั้งหมด
              </button>
            </div>

            {/* Category groups */}
            <div className="space-y-4">
              {CATEGORIES.map((cat) => {
                const pagesInCat = ALL_PAGES.filter((p) => p.category === cat)
                const allInCatSelected = pagesInCat.every((p) => selectedPages.has(p.path))
                const someInCatSelected = pagesInCat.some((p) => selectedPages.has(p.path))
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => toggleCategory(cat)}
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          allInCatSelected
                            ? 'bg-zinc-900 border-zinc-900'
                            : someInCatSelected
                            ? 'bg-zinc-300 border-zinc-300'
                            : 'border-zinc-300 hover:border-zinc-400'
                        }`}
                      >
                        {(allInCatSelected || someInCatSelected) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{cat}</span>
                      <span className="text-[10px] text-zinc-400">({pagesInCat.filter((p) => selectedPages.has(p.path)).length}/{pagesInCat.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-6">
                      {pagesInCat.map((page) => {
                        const selected = selectedPages.has(page.path)
                        return (
                          <button
                            key={page.path}
                            onClick={() => togglePage(page.path)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                              selected
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                                : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100'
                            }`}
                          >
                            {selected && <Check className="w-3 h-3" />}
                            {page.nameTh}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── Category Tabs ─── */}
      <div className="flex items-center gap-1.5 pt-5 pb-1 overflow-x-auto scrollbar-none">
        {[CATEGORY_ALL, ...CATEGORIES].map((cat) => {
          const count = categoryCount[cat] ?? 0
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/20'
                  : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-700'
              }`}
            >
              {cat}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-400'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ─── Page Preview Grid ─── */}
      <div
        className={`grid gap-5 pt-4 ${
          viewMode === 'desktop'
            ? 'grid-cols-1 xl:grid-cols-2'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {visiblePages.map((page) => (
          <div
            key={page.path}
            className="group bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-300 transition-all duration-300"
          >
            {/* Browser-style chrome header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-zinc-50 to-zinc-100/50 border-b border-zinc-200/60">
              <div className="flex items-center gap-3">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                {/* URL bar */}
                <div className="flex items-center gap-1.5 bg-white/80 rounded-lg px-3 py-1 border border-zinc-200/80 min-w-0">
                  <Globe className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                  <span className="text-[11px] text-zinc-500 font-medium truncate">
                    nucha-villa.com{page.path === '/' ? '' : page.path}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => { setFullscreenPage(page); setFullscreenDevice(viewMode) }}
                  className="p-1.5 rounded-lg hover:bg-white text-zinc-400 hover:text-zinc-700 transition-colors"
                  title="ดูแบบเต็มจอ"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <a
                  href={page.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-white text-zinc-400 hover:text-zinc-700 transition-colors"
                  title="เปิดในแท็บใหม่"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Page info strip */}
            <div className="px-4 py-2.5 bg-white border-b border-zinc-100">
              <div className="flex items-center justify-between mb-1">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-800 truncate">{page.nameTh}</p>
                  <p className="text-[11px] text-zinc-400">{page.name}</p>
                </div>
                <span className="text-[10px] font-medium text-zinc-400 bg-zinc-50 border border-zinc-100 rounded-md px-2 py-0.5 flex-shrink-0">
                  {page.category}
                </span>
              </div>
              {page.description && (
                <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">{page.description}</p>
              )}
              {page.features && page.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {page.features.map((f, fi) => (
                    <span key={fi} className="inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-100 text-[10px] font-medium text-zinc-500">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Iframe preview — dynamically scaled to fill card width */}
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
                  className="relative bg-gradient-to-b from-zinc-50 to-zinc-100/30 overflow-hidden"
                  style={{ height: `${Math.min(visibleH, viewMode === 'desktop' ? 420 : 520)}px` }}
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

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-10">
                    <button
                      onClick={() => { setFullscreenPage(page); setFullscreenDevice(viewMode) }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-sm text-zinc-800 text-xs font-semibold shadow-lg hover:bg-white transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      ดูแบบเต็มจอ
                    </button>
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg hover:bg-zinc-900 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      เปิดหน้าเว็บ
                    </a>
                  </div>
                </div>
              )
            })()}
          </div>
        ))}
      </div>

      {/* ─── Empty State ─── */}
      {visiblePages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-20 h-20 rounded-3xl bg-zinc-100 flex items-center justify-center mb-5">
            <Eye className="w-9 h-9 text-zinc-300" />
          </div>
          <h3 className="text-lg font-bold text-zinc-700 mb-1">
            {selectedPages.size === 0 ? 'ยังไม่ได้เลือกหน้า' : 'ไม่มีหน้าในหมวดนี้'}
          </h3>
          <p className="text-sm text-zinc-400 mb-5 text-center max-w-xs">
            {selectedPages.size === 0
              ? 'กรุณาเลือกหน้าที่ต้องการดูตัวอย่างจากด้านบน'
              : 'ลองเลือกหมวดหมู่อื่น หรือเลือกหน้าเพิ่มเติม'
            }
          </p>
          <div className="flex items-center gap-2">
            {selectedPages.size === 0 && (
              <button
                onClick={selectAll}
                className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
              >
                เลือกทั้งหมด
              </button>
            )}
            {activeCategory !== CATEGORY_ALL && (
              <button
                onClick={() => setActiveCategory(CATEGORY_ALL)}
                className="px-5 py-2.5 bg-white text-zinc-700 border border-zinc-200 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors"
              >
                ดูทั้งหมด
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Fullscreen Modal ─── */}
      {fullscreenPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white">
              <div className="flex items-center gap-4">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" onClick={() => setFullscreenPage(null)} />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-800">
                    {fullscreenPage.nameTh}
                    <span className="font-normal text-zinc-400 ml-2">— {fullscreenPage.name}</span>
                  </h3>
                  <p className="text-xs text-zinc-400">{fullscreenPage.path}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Device toggle in modal */}
                <div className="flex rounded-lg bg-zinc-100 p-0.5">
                  <button
                    onClick={() => setFullscreenDevice('desktop')}
                    className={`p-1.5 rounded-md transition-colors ${
                      fullscreenDevice === 'desktop' ? 'bg-white text-zinc-800 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setFullscreenDevice('mobile')}
                    className={`p-1.5 rounded-md transition-colors ${
                      fullscreenDevice === 'mobile' ? 'bg-white text-zinc-800 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
                <a
                  href={fullscreenPage.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  เปิดในแท็บใหม่
                </a>
                <button
                  onClick={() => setFullscreenPage(null)}
                  className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Modal iframe */}
            <div className="flex-1 overflow-hidden bg-zinc-100 flex items-start justify-center">
              <div className={`bg-white h-full transition-all duration-300 shadow-xl ${
                fullscreenDevice === 'desktop' ? 'w-full' : 'w-[420px] rounded-b-xl border-x border-b border-zinc-200'
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
