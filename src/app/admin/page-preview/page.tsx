'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import {
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Check,
  RefreshCw,
  X,
  LayoutGrid,
  Lock,
  ChevronRight,
  Pencil,
  Plus,
  Layers,
  MousePointerClick,
  Type,
  Image,
  Link2,
  Navigation,
  Grid3X3,
  MessageSquare,
  MapPin,
  Code,
  Palette,
  Accessibility,
  Tag,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { allPageAnnotations, pageList } from '@/lib/ui-docs/sample-data'
import type { AnnotatedElement, PageAnnotation, ElementType } from '@/lib/ui-docs/types'

// ─── All public pages to preview ─────────────────────────────────
interface PageEntry {
  name: string
  nameTh: string
  path: string
  category: string
  description?: string
  features?: string[]
  requiresAuth?: boolean
  annotationPageId?: string
}

const ALL_PAGES: PageEntry[] = [
  { name: 'Homepage', nameTh: 'หน้าแรก', path: '/', category: 'หน้าหลัก', description: 'หน้าแรกของเว็บไซต์ แสดง Hero, โครงการแนะนำ, โปรโมชั่น', features: ['Hero Slideshow', 'โครงการแนะนำ', 'โปรโมชั่นล่าสุด'], annotationPageId: 'homepage' },
  { name: 'Villas', nameTh: 'วิลล่าทั้งหมด', path: '/villas', category: 'หน้าหลัก', description: 'รายการวิลล่าทั้งหมด รองรับการค้นหาและกรอง', features: ['ค้นหาวิลล่า', 'กรองสถานะ', 'เรียงลำดับ'], annotationPageId: 'villas' },
  { name: 'Contact', nameTh: 'ติดต่อเรา', path: '/contact', category: 'หน้าหลัก', description: 'ฟอร์มติดต่อ, ข้อมูลบริษัท, แผนที่', features: ['ฟอร์มติดต่อ', 'แผนที่', 'ข้อมูลติดต่อ'], annotationPageId: 'contact' },
  { name: 'Services', nameTh: 'บริการ', path: '/services', category: 'หน้าหลัก', description: 'รายการบริการทั้งหมด', features: ['รายการบริการ', 'รายละเอียดบริการ'], annotationPageId: 'services' },
  { name: 'Portfolio', nameTh: 'ผลงาน', path: '/portfolio', category: 'หน้าหลัก', description: 'แสดงผลงานโครงการ', features: ['แกลเลอรีผลงาน', 'Filter หมวดหมู่'], annotationPageId: 'portfolio' },
  { name: 'Booking', nameTh: 'จองคิว', path: '/booking', category: 'หน้าหลัก', description: 'ฟอร์มจองคิวปรึกษา', features: ['ปฏิทิน', 'เลือกเวลา', 'ฟอร์มจอง'], annotationPageId: 'booking' },
  { name: 'Philosophy', nameTh: 'ปรัชญา', path: '/philosophy', category: 'ข้อมูลบริษัท', description: 'ปรัชญาและค่านิยมบริษัท', features: ['ปรัชญา', 'ค่านิยม'], annotationPageId: 'philosophy' },
  { name: 'Map', nameTh: 'แผนที่', path: '/map', category: 'หน้าหลัก', description: 'แผนที่แสดงตำแหน่งโครงการ', features: ['Interactive Map'] },
]

// ─── Element type icon mapping ───────────────────────────────────
const ELEMENT_ICONS: Record<ElementType, typeof MousePointerClick> = {
  button: MousePointerClick,
  heading: Type,
  section: LayoutGrid,
  image: Image,
  link: Link2,
  input: Type,
  card: Grid3X3,
  navigation: Navigation,
  footer: LayoutGrid,
  hero: Image,
  text: Type,
  icon: Tag,
  badge: Tag,
  form: MessageSquare,
  list: LayoutGrid,
  other: Layers,
}

const ELEMENT_TYPE_LABELS: Record<ElementType, string> = {
  button: 'Button',
  heading: 'Heading',
  section: 'Section',
  image: 'Image',
  link: 'Link',
  input: 'Input',
  card: 'Card',
  navigation: 'Navigation',
  footer: 'Footer',
  hero: 'Hero',
  text: 'Text',
  icon: 'Icon',
  badge: 'Badge',
  form: 'Form',
  list: 'List',
  other: 'Other',
}

// ─── Page Component ──────────────────────────────────────────────
export default function PagePreviewPage() {
  const [selectedPage, setSelectedPage] = useState<PageEntry>(ALL_PAGES[0])
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null)
  const [iframeKey, setIframeKey] = useState(0)
  const [showOverlay, setShowOverlay] = useState(true)
  const [elementPositions, setElementPositions] = useState<Record<string, DOMRect | null>>({})
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true)

  // Get annotation for current page
  const currentAnnotation: PageAnnotation | undefined = useMemo(() => {
    if (!selectedPage.annotationPageId) return undefined
    return allPageAnnotations.find((a) => a.pageId === selectedPage.annotationPageId)
  }, [selectedPage.annotationPageId])

  const elements: AnnotatedElement[] = currentAnnotation?.elements || []
  const selectedElement = elements.find((e) => e.id === selectedElementId) || null

  // Viewport widths
  const viewportWidth = viewMode === 'desktop' ? 1440 : viewMode === 'tablet' ? 768 : 375
  const viewportHeight = viewMode === 'desktop' ? 900 : viewMode === 'tablet' ? 1024 : 812

  // Update element positions from iframe
  useEffect(() => {
    if (!iframeRef.current || !currentAnnotation || !showOverlay) return
    const iframe = iframeRef.current

    function updatePositions() {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return
        const positions: Record<string, DOMRect | null> = {}
        currentAnnotation!.elements.forEach((el) => {
          const target = doc.querySelector(el.selector)
          if (target) {
            positions[el.id] = target.getBoundingClientRect()
          }
        })
        setElementPositions(positions)
      } catch {
        // cross-origin
      }
    }

    iframe.onload = updatePositions
    const interval = setInterval(updatePositions, 2000)
    updatePositions()

    return () => clearInterval(interval)
  }, [currentAnnotation, iframeKey, showOverlay, selectedPage.path])

  const handlePageSelect = (page: PageEntry) => {
    setSelectedPage(page)
    setSelectedElementId(null)
    setHoveredElementId(null)
    setElementPositions({})
  }

  const handleElementNavigate = (direction: 'next' | 'prev') => {
    if (elements.length === 0) return
    if (!selectedElementId) {
      setSelectedElementId(direction === 'next' ? elements[0].id : elements[elements.length - 1].id)
      return
    }
    const idx = elements.findIndex((e) => e.id === selectedElementId)
    if (direction === 'next' && idx < elements.length - 1) {
      setSelectedElementId(elements[idx + 1].id)
    } else if (direction === 'prev' && idx > 0) {
      setSelectedElementId(elements[idx - 1].id)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        handleElementNavigate('next')
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        handleElementNavigate('prev')
      }
      if (e.key === 'Escape') {
        setSelectedElementId(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedElementId, elements])

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      {/* ─── Top Bar ─── */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Breadcrumb + Page info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>หน้าเว็บไซต์</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-700 font-medium">{selectedPage.nameTh}</span>
              <span className="text-gray-400">({selectedPage.name})</span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded">
              Published
            </span>
            <a
              href={selectedPage.path}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-500 hover:underline flex items-center gap-1 truncate"
            >
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              {selectedPage.path}
            </a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <a
              href={selectedPage.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              ดูหน้าเว็บไซต์
            </a>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              สร้างข้อมูล
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors shadow-sm">
              <Pencil className="w-3.5 h-3.5" />
              แก้ไขหน้าเว็บไซต์
            </button>
          </div>
        </div>

        {/* Device toggle + controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {([
              { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
              { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
              { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
            ]).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                showOverlay ? 'bg-red-50 text-red-600 border border-red-200' : 'text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Markers {showOverlay ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => { setIframeKey((k) => k + 1); setElementPositions({}) }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              รีเฟรช
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ─── Preview Area ─── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Iframe container */}
          <div className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center">
            <div
              className="relative bg-white shadow-lg rounded-lg overflow-hidden"
              style={{
                width: viewportWidth,
                maxWidth: '100%',
                transform: viewMode !== 'desktop' ? `scale(${Math.min(1, (700) / viewportWidth)})` : undefined,
                transformOrigin: 'top center',
              }}
            >
              <iframe
                key={`${selectedPage.path}-${iframeKey}`}
                ref={iframeRef}
                src={selectedPage.path}
                className="w-full border-0"
                style={{ height: viewportHeight, width: viewportWidth }}
                sandbox="allow-same-origin allow-scripts"
                title={`${selectedPage.name} Preview`}
              />

              {/* Annotation Overlay */}
              {showOverlay && currentAnnotation && (
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                  {elements.map((el, idx) => {
                    const pos = elementPositions[el.id]
                    if (!pos) return null

                    const isSelected = selectedElementId === el.id
                    const isHovered = hoveredElementId === el.id

                    // Scale positions for non-desktop viewports
                    const scale = viewMode === 'desktop' ? 1 : Math.min(1, 700 / viewportWidth)
                    const left = pos.left * scale
                    const top = pos.top * scale
                    const width = pos.width * scale
                    const height = pos.height * scale

                    return (
                      <div
                        key={el.id}
                        className="absolute pointer-events-auto cursor-pointer transition-all duration-150"
                        style={{ left, top, width, height }}
                        onClick={() => setSelectedElementId(el.id)}
                        onMouseEnter={() => setHoveredElementId(el.id)}
                        onMouseLeave={() => setHoveredElementId(null)}
                      >
                        <div
                          className={`absolute inset-0 border-2 rounded-sm transition-colors ${
                            isSelected
                              ? 'border-red-500 bg-red-500/10'
                              : isHovered
                                ? 'border-red-400 bg-red-400/5'
                                : 'border-transparent'
                          }`}
                        />
                        {showOverlay && (
                          <div
                            className={`absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow transition-transform ${
                              isSelected ? 'bg-red-600 scale-110' : 'bg-gray-700 hover:bg-red-500'
                            }`}
                          >
                            {idx + 1}
                          </div>
                        )}
                        {(isHovered || isSelected) && (
                          <div className="absolute -top-7 left-0 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-20 shadow-lg">
                            {el.name}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ─── Bottom Panel: Component List ─── */}
          {bottomPanelOpen && elements.length > 0 && (
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    รายการองค์ประกอบในหน้านี้ ({elements.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleElementNavigate('prev')}
                    disabled={!selectedElementId}
                    className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleElementNavigate('next')}
                    disabled={!selectedElementId}
                    className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setBottomPanelOpen(false)}
                    className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {elements.map((el, idx) => {
                  const isSelected = selectedElementId === el.id
                  const Icon = ELEMENT_ICONS[el.type] || Layers
                  return (
                    <button
                      key={el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                        isSelected
                          ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          isSelected ? 'bg-red-500 text-white' : 'bg-gray-300 text-white'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{el.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {ELEMENT_TYPE_LABELS[el.type]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── Right Sidebar: Element Inspector ─── */}
        {sidebarOpen && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
            {/* Sidebar header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-gray-900">ตัวแก้ไของค์ประกอบ</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Page selector */}
            <div className="px-4 py-3 border-b border-gray-100">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">เลือกหน้า</label>
              <select
                value={selectedPage.path}
                onChange={(e) => {
                  const page = ALL_PAGES.find((p) => p.path === e.target.value)
                  if (page) handlePageSelect(page)
                }}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
              >
                {ALL_PAGES.map((p) => (
                  <option key={p.path} value={p.path}>{p.nameTh} ({p.path})</option>
                ))}
              </select>
            </div>

            {!selectedElement ? (
              /* Empty state */
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-6">
                <div className="text-center">
                  <MousePointerClick className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-medium">คลิกบนหน้าเว็บ</p>
                  <p className="text-xs mt-1 opacity-60">หรือเลือกจากรายการด้านล่าง</p>
                  <p className="text-[10px] mt-2 text-gray-300">↑ ↓ นำทาง element</p>
                </div>
              </div>
            ) : (
              <>
                {/* Element header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase">
                      {ELEMENT_TYPE_LABELS[selectedElement.type]}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      selectedElement.status === 'active'
                        ? 'bg-green-50 text-green-600'
                        : selectedElement.status === 'disabled'
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {selectedElement.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{selectedElement.name}</h3>
                  {selectedElement.nameTh && (
                    <p className="text-xs text-gray-500">{selectedElement.nameTh}</p>
                  )}
                  {selectedElement.description && (
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{selectedElement.description}</p>
                  )}
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">
                  {/* ข้อมูลทั่วไป (General Info) */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">ข้อมูลทั่วไป</h4>
                    <div className="space-y-2">
                      <InfoRow label="Type" value={`${selectedElement.type === 'heading' ? 'Heading (H1)' : ELEMENT_TYPE_LABELS[selectedElement.type]}`} />
                      {selectedElement.textContent && (
                        <InfoRow label="Text" value={selectedElement.textContent} mono />
                      )}
                      <InfoRow label="Position" value={selectedElement.component || currentAnnotation?.pageName || '—'} />
                      {selectedElement.variant && (
                        <InfoRow label="Variant" value={selectedElement.variant} />
                      )}
                      <InfoRow label="Data Source" value={selectedElement.technical.dataSource} />
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Responsive</span>
                        <div className="flex gap-2">
                          <ResponsiveDot active={selectedElement.technical.responsive.desktop} label="Desktop" />
                          <ResponsiveDot active={selectedElement.technical.responsive.tablet} label="Tablet" />
                          <ResponsiveDot active={selectedElement.technical.responsive.mobile} label="Mobile" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* การกระทำ (Action) */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">การกระทำ</h4>
                    <div className="space-y-2">
                      <InfoRow label="Type" value={selectedElement.behavior?.clickAction || '—'} />
                      <InfoRow label="Link" value={selectedElement.behavior?.route || selectedElement.behavior?.externalUrl || '—'} mono />
                      <InfoRow label="Event" value={selectedElement.behavior?.eventName || '—'} mono />
                    </div>
                  </div>

                  {/* วัตถุประสงค์ (Purpose) */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">วัตถุประสงค์</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {selectedElement.ux.goal || '—'}
                    </p>
                    {selectedElement.ux.kpi && (
                      <p className="text-[11px] text-gray-400 mt-1">KPI: {selectedElement.ux.kpi}</p>
                    )}
                    <div className="flex items-center gap-0.5 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < selectedElement.ux.priority ? 'bg-red-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-gray-400 ml-1">Priority {selectedElement.ux.priority}/5</span>
                    </div>
                  </div>

                  {/* ข้อมูลทางเทคนิค (Technical) */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Code className="w-3 h-3" />
                      ข้อมูลทางเทคนิค
                    </h4>
                    <div className="space-y-2">
                      <InfoRow label="CSS Selector" value={selectedElement.technical.cssSelector} mono />
                      {selectedElement.component && (
                        <InfoRow label="Component" value={selectedElement.component} mono />
                      )}
                      {selectedElement.technical.tailwindClasses && selectedElement.technical.tailwindClasses.length > 0 && (
                        <div>
                          <span className="text-[10px] text-gray-400 block mb-1">Tailwind Classes</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedElement.technical.tailwindClasses.map((cls) => (
                              <span key={cls} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded font-mono">
                                {cls}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accessibility */}
                  {selectedElement.accessibility && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Accessibility className="w-3 h-3" />
                        การเข้าถึง
                      </h4>
                      <div className="space-y-2">
                        {selectedElement.accessibility.ariaLabel && (
                          <InfoRow label="ARIA Label" value={selectedElement.accessibility.ariaLabel} />
                        )}
                        {selectedElement.accessibility.role && (
                          <InfoRow label="Role" value={selectedElement.accessibility.role} />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedElement.tags && selectedElement.tags.length > 0 && (
                    <div className="px-4 py-3">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedElement.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer nav */}
                <div className="px-4 py-2.5 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                  <button
                    onClick={() => handleElementNavigate('prev')}
                    className="text-[11px] text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    ← ก่อนหน้า
                  </button>
                  <span className="text-[10px] text-gray-400 font-mono">{selectedElement.id}</span>
                  <button
                    onClick={() => handleElementNavigate('next')}
                    className="text-[11px] text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    ถัดไป →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Sidebar toggle when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-16 bg-white rounded-l-lg shadow-lg border border-r-0 border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Helper Components ───────────────────────────────────────────
function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span className="text-[10px] text-gray-400 block">{label}</span>
      <p className={`text-xs text-gray-800 ${mono ? 'font-mono text-[11px]' : ''}`}>{value}</p>
    </div>
  )
}

function ResponsiveDot({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`flex items-center gap-1 text-[10px] ${active ? 'text-green-600' : 'text-gray-300'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-gray-300'}`} />
      {label}
    </span>
  )
}
