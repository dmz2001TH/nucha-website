export interface ElementData {
  id: string
  selector: string
  name: string
  nameTh?: string
  type: string
  description: string
  descriptionTh?: string
  textContent?: string
  component?: string
  variant?: string
  status?: string
  ux?: { goal?: string; kpi?: string; priority?: number }
  technical?: {
    cssSelector: string
    dataSource?: string
    responsive?: { desktop?: boolean; tablet?: boolean; mobile?: boolean }
    tailwindClasses?: string[]
  }
  behavior?: { clickAction?: string; route?: string; externalUrl?: string; eventName?: string }
  accessibility?: { ariaLabel?: string; role?: string }
  tags?: string[]
}

export interface PageData {
  name: string
  nameTh: string
  path: string
  category: string
  description?: string
  features?: string[]
  screenshot?: string
  requiresAuth?: boolean
  elements?: ElementData[]
  elementPositions?: Record<string, { x: number; y: number; w: number; h: number }>
  annotationPageId?: string
  version?: string
  lastUpdated?: string
}

// ─── Priority dots ───────────────────────────────────────────────
function priorityDots(n: number) {
  const filled = '<span class="dot-filled"></span>'
  const empty = '<span class="dot-empty"></span>'
  return Array.from({ length: 5 }, (_, i) => (i < n ? filled : empty)).join('')
}

// ─── Status badge ────────────────────────────────────────────────
function statusBadge(status: string) {
  const colors: Record<string, string> = {
    active: 'badge-green',
    disabled: 'badge-gray',
    loading: 'badge-yellow',
    hidden: 'badge-gray',
  }
  return `<span class="badge ${colors[status] || 'badge-gray'}">${status}</span>`
}

// ─── Responsive icons ────────────────────────────────────────────
function responsiveIcons(r: { desktop?: boolean; tablet?: boolean; mobile?: boolean }) {
  const icon = (ok: boolean, label: string) =>
    ok
      ? `<span class="resp-on">✓ ${label}</span>`
      : `<span class="resp-off">✗ ${label}</span>`
  return `${icon(!!r.desktop, 'Desktop')} ${icon(!!r.tablet, 'Tablet')} ${icon(!!r.mobile, 'Mobile')}`
}

// ─── Element marker overlay SVG ──────────────────────────────────
function renderMarkerOverlays(
  elements: ElementData[],
  positions: Record<string, { x: number; y: number; w: number; h: number }> | undefined,
  screenshotWidth: number,
  screenshotHeight: number
) {
  if (!positions) return ''

  // The screenshot is rendered at 1440px width in the browser.
  // In the PDF, the browser-frame content area is about 170mm wide at 72dpi ≈ 642px.
  // We scale positions from the original viewport to fit.
  const originalWidth = 1440
  const scale = screenshotWidth / originalWidth

  return elements
    .map((el, idx) => {
      const pos = positions[el.id]
      if (!pos) return ''

      const left = pos.x * scale
      const top = pos.y * scale
      const width = pos.w * scale
      const height = pos.h * scale
      const num = idx + 1

      return `
      <div class="marker" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px;">
        <div class="marker-outline"></div>
        <div class="marker-badge" style="top:-8px;left:-8px;">${num}</div>
      </div>`
    })
    .join('')
}

// ─── Element Spec Row ────────────────────────────────────────────
function renderElementSpec(el: ElementData, idx: number) {
  const num = idx + 1
  const typeLabel = el.type.charAt(0).toUpperCase() + el.type.slice(1)
  const route = el.behavior?.route || el.behavior?.externalUrl || '—'
  const action = el.behavior?.clickAction || '—'
  const event = el.behavior?.eventName || '—'
  const responsive = el.technical?.responsive
    ? responsiveIcons(el.technical.responsive)
    : '—'
  const dataSource = el.technical?.dataSource || '—'
  const cssSelector = el.technical?.cssSelector || el.selector
  const tailwind = el.technical?.tailwindClasses?.length
    ? el.technical.tailwindClasses.join(' ')
    : ''
  const priority = el.ux?.priority || 0
  const goal = el.ux?.goal || '—'
  const kpi = el.ux?.kpi || '—'
  const ariaLabel = el.accessibility?.ariaLabel || '—'
  const role = el.accessibility?.role || '—'
  const component = el.component || '—'
  const text = el.textContent || '—'
  const status = el.status || 'active'

  return `
  <tr class="spec-row">
    <td class="spec-num">${num}</td>
    <td class="spec-main">
      <div class="spec-name">${el.name}</div>
      ${el.nameTh ? `<div class="spec-name-th">${el.nameTh}</div>` : ''}
      <div class="spec-desc">${el.description}</div>
      ${el.descriptionTh ? `<div class="spec-desc-th">${el.descriptionTh}</div>` : ''}
    </td>
    <td class="spec-meta">
      <div class="spec-meta-grid">
        <div class="spec-label">Type</div>
        <div class="spec-value"><span class="type-badge">${typeLabel}</span></div>

        <div class="spec-label">Status</div>
        <div class="spec-value">${statusBadge(status)}</div>

        <div class="spec-label">Component</div>
        <div class="spec-value code">${component}</div>

        <div class="spec-label">Text Content</div>
        <div class="spec-value">${text}</div>

        <div class="spec-label">CSS Selector</div>
        <div class="spec-value code">${cssSelector}</div>

        ${tailwind ? `
        <div class="spec-label">Tailwind</div>
        <div class="spec-value code small">${tailwind}</div>
        ` : ''}

        <div class="spec-label">Data Source</div>
        <div class="spec-value">${dataSource}</div>

        <div class="spec-label">Responsive</div>
        <div class="spec-value">${responsive}</div>
      </div>
    </td>
    <td class="spec-behavior">
      <div class="spec-meta-grid">
        <div class="spec-label">Action</div>
        <div class="spec-value">${action}</div>

        <div class="spec-label">Route / URL</div>
        <div class="spec-value code">${route}</div>

        <div class="spec-label">Event</div>
        <div class="spec-value code">${event}</div>
      </div>
    </td>
    <td class="spec-ux">
      <div class="spec-meta-grid">
        <div class="spec-label">Goal</div>
        <div class="spec-value">${goal}</div>

        <div class="spec-label">KPI</div>
        <div class="spec-value">${kpi}</div>

        <div class="spec-label">Priority</div>
        <div class="spec-value">${priorityDots(priority)} <span class="priority-num">${priority}/5</span></div>

        <div class="spec-label">ARIA</div>
        <div class="spec-value">${ariaLabel}</div>

        <div class="spec-label">Role</div>
        <div class="spec-value">${role}</div>
      </div>
    </td>
  </tr>`
}

// ─── Render a page's element summary card ────────────────────────
function renderElementSummaryCard(el: ElementData, idx: number) {
  const num = idx + 1
  const type = el.type.charAt(0).toUpperCase() + el.type.slice(1)
  const route = el.behavior?.route || el.behavior?.externalUrl || ''
  const routeLabel = route && route !== '—' ? ` → ${route}` : ''

  return `
  <div class="summary-card">
    <div class="summary-num">${num}</div>
    <div class="summary-body">
      <div class="summary-name">${el.name} <span class="summary-type">${type}</span></div>
      ${el.nameTh ? `<div class="summary-name-th">${el.nameTh}</div>` : ''}
      <div class="summary-desc">${el.description}</div>
      ${routeLabel ? `<div class="summary-route">🔗 ${route}</div>` : ''}
    </div>
  </div>`
}

// ─── Main Template ───────────────────────────────────────────────
export function generateReportHTML(pages: PageData[], title: string) {
  const dateStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const categories = [...new Set(pages.map((p) => p.category))]
  const totalElements = pages.reduce((sum, p) => sum + (p.elements?.length || 0), 0)

  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Thai+Looped:wght@400;500;600;700;800&display=swap');

* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family:'Noto Sans Thai Looped','Inter',-apple-system,sans-serif;
  color:#1a1a2e; background:#ffffff;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}

/* ─── PAGE STRUCTURE ─── */
.page { width:297mm; min-height:210mm; position:relative; page-break-after:always; overflow:hidden; }
.page:last-child { page-break-after:auto; }

/* ─── COVER PAGE ─── */
.cover-page {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display:flex; flex-direction:column; justify-content:center; padding:35mm 40mm;
  position:relative;
}
.cover-accent-line { position:absolute; top:0; left:0; right:0; height:3mm; background:linear-gradient(90deg, #e94560, #c23152, #e94560); }
.cover-grid {
  position:absolute; top:0; left:0; right:0; bottom:0; opacity:0.03;
  background-image:
    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 20mm 20mm;
}
.cover-content { position:relative; z-index:1; max-width:70%; }
.cover-eyebrow {
  font-size:9pt; font-weight:700; letter-spacing:5px; text-transform:uppercase;
  color:#e94560; margin-bottom:10mm;
}
.cover-title {
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:44pt; font-weight:900; color:#ffffff; line-height:1.05;
  margin-bottom:5mm; letter-spacing:-1pt;
}
.cover-title-sub { color:#e94560; }
.cover-divider { width:20mm; height:1.5mm; background:linear-gradient(90deg, #e94560, transparent); margin:10mm 0; }
.cover-subtitle {
  font-size:13pt; font-weight:300; color:rgba(255,255,255,0.6); line-height:1.7;
  margin-bottom:20mm; max-width:80mm;
}
.cover-date { font-size:10pt; color:rgba(255,255,255,0.35); letter-spacing:2px; }
.cover-stats {
  position:absolute; bottom:30mm; left:40mm;
  display:flex; gap:12mm;
}
.stat-box {
  border-left:2.5mm solid #e94560;
  padding:5mm 8mm; min-width:32mm;
  background:rgba(255,255,255,0.04); backdrop-filter:blur(10px);
  border-radius:0 2mm 2mm 0;
}
.stat-number {
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:28pt; font-weight:900; color:#ffffff; line-height:1;
}
.stat-label { font-size:7pt; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:2px; margin-top:2mm; }
.cover-watermark {
  position:absolute; right:15mm; top:50%; transform:translateY(-50%);
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:120pt; font-weight:900; color:rgba(233,69,96,0.04);
  writing-mode:vertical-rl; letter-spacing:6mm;
}
.cover-footer {
  position:absolute; bottom:12mm; left:40mm; right:40mm;
  display:flex; justify-content:space-between; align-items:center;
  font-size:8pt; color:rgba(255,255,255,0.25);
  border-top:0.3mm solid rgba(255,255,255,0.08); padding-top:4mm;
}
.cover-footer-brand { color:#e94560; font-weight:700; letter-spacing:2px; text-transform:uppercase; }

/* ─── TOC PAGE ─── */
.toc-page { background:#ffffff; padding:20mm 30mm; }
.toc-accent { position:absolute; top:0; left:0; right:0; height:1.5mm; background:#e94560; }
.toc-header { margin-bottom:10mm; }
.toc-eyebrow { font-size:8pt; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#e94560; margin-bottom:3mm; }
.toc-title { font-family:'Noto Sans Thai Looped','Inter',sans-serif; font-size:30pt; font-weight:900; color:#1a1a2e; margin-bottom:2mm; }
.toc-subtitle { font-size:10pt; color:#9e9e9e; }
.toc-divider { width:15mm; height:1.2mm; background:#e94560; margin:6mm 0 10mm; }
.toc-list { display:flex; flex-direction:column; gap:5mm; }
.toc-cat-header {
  display:flex; justify-content:space-between; align-items:center;
  padding:3mm 0; border-bottom:0.5mm solid #f0f0f0; margin-bottom:3mm;
}
.toc-cat-name { font-size:9pt; font-weight:700; color:#1a1a2e; text-transform:uppercase; letter-spacing:1.5px; }
.toc-cat-count { font-size:7pt; color:#757575; background:#f5f5f5; padding:1.5mm 3mm; border-radius:1mm; }
.toc-entry {
  display:flex; justify-content:space-between; align-items:baseline;
  padding:2mm 0; border-bottom:0.15mm solid #f8f8f8;
}
.toc-entry-main { display:flex; align-items:baseline; gap:3mm; flex:1; }
.toc-name-th { font-size:9.5pt; font-weight:600; color:#1a1a2e; }
.toc-name-en { font-size:8pt; color:#9e9e9e; }
.toc-dots { flex:1; border-bottom:0.3mm dotted #e0e0e0; margin:0 4mm; height:3mm; }
.toc-page-num { font-family:'Noto Sans Thai Looped','Inter',sans-serif; font-size:10pt; font-weight:700; color:#e94560; min-width:8mm; text-align:right; }
.toc-path { font-size:7pt; color:#bdbdbd; padding-left:2mm; }
.toc-element-count {
  font-size:7pt; color:#e94560; background:rgba(233,69,96,0.08);
  padding:1mm 2.5mm; border-radius:1mm; margin-left:2mm; font-weight:600;
}

/* ─── SCREENSHOT PAGE (with markers) ─── */
.screenshot-page { background:#ffffff; display:flex; flex-direction:column; }
.sp-header {
  display:flex; align-items:center;
  padding:8mm 15mm 5mm; gap:4mm;
}
.sp-red-bar { width:2.5mm; height:14mm; background:#e94560; border-radius:0; }
.sp-info { flex:1; }
.sp-title { font-family:'Noto Sans Thai Looped','Inter',sans-serif; font-size:16pt; font-weight:800; color:#1a1a2e; }
.sp-name { font-size:8pt; color:#9e9e9e; margin-top:1mm; }
.sp-path { font-size:7.5pt; color:#e94560; font-family:'Inter',monospace; margin-top:1mm; }
.sp-badges { display:flex; gap:2mm; align-items:center; }
.sp-badge {
  font-size:7pt; font-weight:600; padding:1.5mm 3mm; border-radius:1mm;
  border:0.3mm solid #e0e0e0; color:#757575; background:#fafafa;
}
.sp-badge-green { color:#16a34a; background:#f0fdf4; border-color:#bbf7d0; }
.sp-elem-count {
  font-size:8pt; font-weight:700; color:#e94560;
  background:rgba(233,69,96,0.08); padding:2mm 4mm; border-radius:1.5mm;
}

/* Browser frame with markers */
.sp-browser {
  flex:1; margin:0 15mm; display:flex; flex-direction:column;
  border-radius:2mm; overflow:hidden;
  box-shadow:0 1mm 4mm rgba(0,0,0,0.06);
  border:0.3mm solid #e8e8e8;
}
.sp-browser-bar {
  display:flex; align-items:center; gap:2mm;
  padding:2.5mm 4mm;
  background:linear-gradient(180deg, #f8f8f8, #f0f0f0);
  border-bottom:0.3mm solid #e0e0e0;
}
.sp-dot { width:2.5mm; height:2.5mm; border-radius:50%; }
.sp-dot-r { background:#ff5f57; }
.sp-dot-y { background:#febc2e; }
.sp-dot-g { background:#28c840; }
.sp-url-bar {
  flex:1; background:#ffffff; border-radius:1.5mm;
  padding:1.5mm 4mm; font-size:7pt; color:#9e9e9e;
  border:0.2mm solid #e0e0e0; margin-left:3mm;
  font-family:'Inter',monospace;
}
.sp-screenshot-wrap {
  flex:1; position:relative; overflow:hidden; background:#f9f9f9;
}
.sp-screenshot-wrap img {
  display:block; width:100%; height:auto; object-fit:contain; object-position:top;
}
.sp-fade {
  position:absolute; bottom:0; left:0; right:0;
  height:20mm;
  background:linear-gradient(transparent, rgba(255,255,255,0.98));
}
.sp-scroll-hint {
  position:absolute; bottom:3mm; left:50%; transform:translateX(-50%);
  font-size:6.5pt; color:#9e9e9e; background:rgba(255,255,255,0.95);
  padding:1.5mm 4mm; border-radius:1.5mm; border:0.2mm solid #e8e8e8;
}
/* Numbered markers on screenshot */
.marker {
  position:absolute; z-index:5; pointer-events:none;
}
.marker-outline {
  position:absolute; inset:0;
  border:1.5mm solid #e94560; border-radius:0.5mm;
  background:rgba(233,69,96,0.05);
}
.marker-badge {
  position:absolute;
  width:6mm; height:6mm; border-radius:50%;
  background:#e94560; color:#ffffff;
  font-size:7pt; font-weight:800;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 0.5mm 2mm rgba(233,69,96,0.4);
  z-index:6;
}

.sp-footer { padding:3mm 15mm 5mm; }
.sp-footer-line { height:0.3mm; background:#f0f0f0; margin-bottom:2mm; }
.sp-footer-content {
  display:flex; justify-content:space-between; align-items:center;
  font-size:7pt; color:#bdbdbd;
}
.sp-footer-brand { font-weight:700; color:#e94560; letter-spacing:1px; text-transform:uppercase; }
.sp-footer-page { font-size:9pt; font-weight:700; color:#e94560; }

/* ─── SPEC TABLE PAGE ─── */
.spec-page { background:#ffffff; display:flex; flex-direction:column; }
.spec-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:8mm 15mm 5mm; border-bottom:0.5mm solid #f0f0f0;
}
.spec-header-left { display:flex; align-items:center; gap:4mm; }
.spec-red-bar { width:2.5mm; height:12mm; background:#e94560; }
.spec-title { font-family:'Noto Sans Thai Looped','Inter',sans-serif; font-size:14pt; font-weight:800; color:#1a1a2e; }
.spec-subtitle { font-size:8pt; color:#9e9e9e; margin-top:1mm; }
.spec-header-right { text-align:right; }
.spec-page-label { font-size:7pt; color:#bdbdbd; text-transform:uppercase; letter-spacing:1.5px; }
.spec-page-path { font-size:8pt; color:#e94560; font-family:'Inter',monospace; }

.spec-table-wrap { flex:1; padding:4mm 15mm; overflow:hidden; }
.spec-table {
  width:100%; border-collapse:collapse; font-size:7pt;
}
.spec-table thead th {
  background:#f8f8fa; color:#757575;
  font-size:6.5pt; font-weight:700; text-transform:uppercase; letter-spacing:1px;
  padding:3mm 2.5mm; text-align:left;
  border-bottom:0.5mm solid #e8e8e8;
  position:sticky; top:0;
}
.spec-table thead th:first-child { width:8mm; text-align:center; }
.spec-table thead th:nth-child(2) { width:35%; }
.spec-table thead th:nth-child(3) { width:22%; }
.spec-table thead th:nth-child(4) { width:20%; }
.spec-table thead th:nth-child(5) { width:23%; }

.spec-row { border-bottom:0.3mm solid #f0f0f0; }
.spec-row:hover { background:rgba(233,69,96,0.01); }
.spec-row td { padding:3mm 2.5mm; vertical-align:top; }
.spec-num {
  text-align:center; font-weight:800; color:#e94560;
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:10pt;
}
.spec-name { font-weight:700; color:#1a1a2e; font-size:8pt; margin-bottom:1mm; }
.spec-name-th { font-size:7pt; color:#9e9e9e; margin-bottom:1.5mm; }
.spec-desc { font-size:6.5pt; color:#616161; line-height:1.5; }
.spec-desc-th { font-size:6pt; color:#9e9e9e; line-height:1.4; margin-top:0.5mm; }

.spec-meta-grid { display:grid; grid-template-columns:auto 1fr; gap:0.5mm 2mm; }
.spec-label { font-size:6pt; color:#9e9e9e; text-transform:uppercase; letter-spacing:0.5px; font-weight:600; white-space:nowrap; }
.spec-value { font-size:6.5pt; color:#1a1a2e; word-break:break-all; }
.spec-value.code { font-family:'Inter','Courier New',monospace; font-size:6pt; color:#c23152; }
.spec-value.code.small { font-size:5.5pt; }

/* Badges */
.badge {
  display:inline-block; padding:0.5mm 2mm; border-radius:0.8mm;
  font-size:5.5pt; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;
}
.badge-green { color:#16a34a; background:#f0fdf4; }
.badge-gray { color:#9e9e9e; background:#f5f5f5; }
.badge-yellow { color:#ca8a04; background:#fefce8; }
.type-badge {
  display:inline-block; padding:0.5mm 2mm; border-radius:0.8mm;
  font-size:6pt; font-weight:600; color:#e94560; background:rgba(233,69,96,0.08);
}
.resp-on { color:#16a34a; font-size:6pt; font-weight:600; }
.resp-off { color:#d1d5db; font-size:6pt; }

/* Priority dots */
.dot-filled { display:inline-block; width:2mm; height:2mm; border-radius:50%; background:#e94560; margin-right:0.5mm; }
.dot-empty { display:inline-block; width:2mm; height:2mm; border-radius:50%; background:#e8e8e8; margin-right:0.5mm; }
.priority-num { font-size:6pt; color:#9e9e9e; margin-left:1mm; }

.spec-footer { padding:3mm 15mm 5mm; }
.spec-footer-line { height:0.3mm; background:#f0f0f0; margin-bottom:2mm; }
.spec-footer-content {
  display:flex; justify-content:space-between; align-items:center;
  font-size:7pt; color:#bdbdbd;
}
.spec-footer-brand { font-weight:700; color:#e94560; letter-spacing:1px; text-transform:uppercase; }
.spec-footer-page { font-size:9pt; font-weight:700; color:#e94560; }

/* ─── ELEMENT SUMMARY CARDS ─── */
.summary-cards { display:flex; flex-direction:column; gap:2mm; margin-top:2mm; }
.summary-card {
  display:flex; gap:3mm; padding:2.5mm 3mm;
  border:0.2mm solid #f0f0f0; border-radius:1.5mm;
  background:#fafafa;
}
.summary-num {
  width:6mm; height:6mm; border-radius:50%;
  background:#e94560; color:#fff;
  font-size:7pt; font-weight:800;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
}
.summary-body { flex:1; min-width:0; }
.summary-name { font-size:7.5pt; font-weight:700; color:#1a1a2e; }
.summary-type { font-size:6pt; color:#e94560; background:rgba(233,69,96,0.08); padding:0.3mm 1.5mm; border-radius:0.5mm; margin-left:1mm; }
.summary-name-th { font-size:6.5pt; color:#9e9e9e; }
.summary-desc { font-size:6pt; color:#616161; line-height:1.4; margin-top:0.5mm; }
.summary-route { font-size:6pt; color:#e94560; font-family:'Inter',monospace; margin-top:0.5mm; }

/* ─── PAGE 2: ELEMENT OVERVIEW ─── */
.overview-page { background:#ffffff; padding:15mm 20mm; display:flex; flex-direction:column; }
.ov-header { margin-bottom:6mm; }
.ov-eyebrow { font-size:8pt; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#e94560; margin-bottom:2mm; }
.ov-title { font-family:'Noto Sans Thai Looped','Inter',sans-serif; font-size:22pt; font-weight:900; color:#1a1a2e; }
.ov-subtitle { font-size:9pt; color:#9e9e9e; margin-top:1mm; }
.ov-divider { width:12mm; height:1mm; background:#e94560; margin:4mm 0 6mm; }
.ov-grid { display:grid; grid-template-columns:1fr 1fr; gap:3mm; flex:1; overflow:hidden; }
.ov-column { display:flex; flex-direction:column; gap:2mm; }
.ov-page-block { background:#f8f8fa; border-radius:2mm; padding:4mm; border:0.3mm solid #f0f0f0; }
.ov-page-title { font-size:9pt; font-weight:700; color:#1a1a2e; margin-bottom:1mm; }
.ov-page-path { font-size:6.5pt; color:#e94560; font-family:'Inter',monospace; margin-bottom:2mm; }
.ov-elem-count { font-size:7pt; color:#e94560; font-weight:600; }

</style>
</head>
<body>

${/* ─── COVER ─── */ ''}
<div class="page cover-page">
  <div class="cover-accent-line"></div>
  <div class="cover-grid"></div>
  <div class="cover-content">
    <div class="cover-eyebrow">Interactive UI Documentation</div>
    <h1 class="cover-title">NUCHA <span class="cover-title-sub">VILLA</span></h1>
    <div class="cover-divider"></div>
    <p class="cover-subtitle">UI Specification Document — รายละเอียดองค์ประกอบทุก Element<br/>สำหรับทีม Developer & Designer</p>
    <p class="cover-date">${dateStr}</p>
  </div>
  <div class="cover-stats">
    <div class="stat-box">
      <div class="stat-number">${pages.length}</div>
      <div class="stat-label">Pages</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">${totalElements}</div>
      <div class="stat-label">Elements</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">${categories.length}</div>
      <div class="stat-label">Categories</div>
    </div>
  </div>
  <div class="cover-watermark">SPEC</div>
  <div class="cover-footer">
    <span class="cover-footer-brand">nucha-villa.com</span>
    <span>Generated from Admin System · ${dateStr}</span>
  </div>
</div>

${/* ─── TABLE OF CONTENTS ─── */ ''}
<div class="page toc-page">
  <div class="toc-accent"></div>
  <div class="toc-header">
    <div class="toc-eyebrow">Contents</div>
    <h2 class="toc-title">Table of Contents</h2>
    <p class="toc-subtitle">สารบัญ — รายการหน้าและจำนวน Element ที่ documented</p>
  </div>
  <div class="toc-divider"></div>
  <div class="toc-list">
    ${categories
      .map((cat) => {
        const catPages = pages.filter((p) => p.category === cat)
        return `<div class="toc-category">
          <div class="toc-cat-header">
            <span class="toc-cat-name">${cat}</span>
            <span class="toc-cat-count">${catPages.length} pages</span>
          </div>
          ${catPages
            .map((p) => {
              const elemCount = p.elements?.length || 0
              return `<div class="toc-entry">
                <div class="toc-entry-main">
                  <span class="toc-name-th">${p.nameTh}</span>
                  <span class="toc-name-en">${p.name}</span>
                  ${elemCount > 0 ? `<span class="toc-element-count">${elemCount} elements</span>` : ''}
                </div>
                <div class="toc-dots"></div>
              </div>
              <div class="toc-path">${p.path}</div>`
            })
            .join('')}
        </div>`
      })
      .join('')}
  </div>
</div>

${/* ─── PAGES ─── */ ''}
${pages
  .map((page) => {
    const hasScreenshot = page.screenshot && !page.requiresAuth
    const hasElements = page.elements && page.elements.length > 0
    const elemCount = page.elements?.length || 0
    const version = page.version || '1.0.0'
    const lastUpdated = page.lastUpdated || dateStr

    if (!hasScreenshot) {
      return `<div class="page screenshot-page">
        <div class="sp-header">
          <div class="sp-red-bar"></div>
          <div class="sp-info">
            <div class="sp-title">${page.nameTh}</div>
            <div class="sp-name">${page.name} · ${page.path}</div>
          </div>
          <div class="sp-badges">
            ${page.requiresAuth ? '<span class="sp-badge">🔒 Requires Auth</span>' : '<span class="sp-badge">⚠ Unavailable</span>'}
          </div>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;color:#9e9e9e;font-size:12pt;">
          ${page.requiresAuth ? '🔒 ต้อง Login เพื่อเข้าถึงหน้านี้' : '⚠ ไม่สามารถจับ screenshot ได้'}
        </div>
        <div class="sp-footer"><div class="sp-footer-line"></div>
          <div class="sp-footer-content">
            <span class="sp-footer-brand">NUCHA VILLA</span>
            <span>v${version} · ${lastUpdated}</span>
          </div>
        </div>
      </div>`
    }

    // ─── Screenshot page with markers ───
    const screenshotPage = `<div class="page screenshot-page">
      <div class="sp-header">
        <div class="sp-red-bar"></div>
        <div class="sp-info">
          <div class="sp-title">${page.nameTh} (${page.name})</div>
          <div class="sp-path">${page.path}</div>
        </div>
        <div class="sp-badges">
          <span class="sp-badge sp-badge-green">Published</span>
          <span class="sp-badge">v${version}</span>
          ${hasElements ? `<span class="sp-elem-count">${elemCount} Elements</span>` : ''}
        </div>
      </div>
      <div class="sp-browser">
        <div class="sp-browser-bar">
          <div class="sp-dot sp-dot-r"></div>
          <div class="sp-dot sp-dot-y"></div>
          <div class="sp-dot sp-dot-g"></div>
          <div class="sp-url-bar">https://nucha-villa.com${page.path}</div>
        </div>
        <div class="sp-screenshot-wrap">
          <img src="${page.screenshot}" alt="${page.nameTh}" />
          ${hasElements ? renderMarkerOverlays(page.elements!, page.elementPositions, 642, 900) : ''}
          <div class="sp-fade"></div>
          ${hasElements ? `<div class="sp-scroll-hint">↑ ${elemCount} annotated elements — see spec table on next page</div>` : '<div class="sp-scroll-hint">Full page capture</div>'}
        </div>
      </div>
      <div class="sp-footer"><div class="sp-footer-line"></div>
        <div class="sp-footer-content">
          <span class="sp-footer-brand">NUCHA VILLA · UI Spec</span>
          <span>v${version} · ${lastUpdated}</span>
        </div>
      </div>
    </div>`

    if (!hasElements) return screenshotPage

    // ─── Spec table page(s) — split into chunks of 6 elements per page ───
    const CHUNK = 6
    const chunks: ElementData[][] = []
    for (let i = 0; i < page.elements!.length; i += CHUNK) {
      chunks.push(page.elements!.slice(i, i + CHUNK))
    }

    const specPages = chunks
      .map((chunk, chunkIdx) => {
        const isContinuation = chunkIdx > 0
        return `<div class="page spec-page">
          <div class="spec-header">
            <div class="spec-header-left">
              <div class="spec-red-bar"></div>
              <div>
                <div class="spec-title">${page.nameTh} — Element Spec${isContinuation ? ` (ต่อ ${chunkIdx + 1}/${chunks.length})` : ''}</div>
                <div class="spec-subtitle">${page.name} · ${page.path} · ${elemCount} elements total</div>
              </div>
            </div>
            <div class="spec-header-right">
              <div class="spec-page-label">UI Specification</div>
              <div class="spec-page-path">${page.path}</div>
            </div>
          </div>
          <div class="spec-table-wrap">
            <table class="spec-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Element</th>
                  <th>ข้อมูลเทคนิค</th>
                  <th>พฤติกรรม / Action</th>
                  <th>UX / Accessibility</th>
                </tr>
              </thead>
              <tbody>
                ${chunk.map((el, i) => renderElementSpec(el, chunkIdx * CHUNK + i)).join('')}
              </tbody>
            </table>
          </div>
          <div class="spec-footer"><div class="spec-footer-line"></div>
            <div class="spec-footer-content">
              <span class="spec-footer-brand">NUCHA VILLA · UI Spec</span>
              <span>v${version} · ${lastUpdated}</span>
            </div>
          </div>
        </div>`
      })
      .join('')

    return screenshotPage + specPages
  })
  .join('')}

</body>
</html>`
}
