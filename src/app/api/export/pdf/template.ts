interface PageData {
  name: string
  nameTh: string
  path: string
  category: string
  description?: string
  features?: string[]
  screenshot?: string
  requiresAuth?: boolean
}

export function generateReportHTML(pages: PageData[], title: string) {
  const dateStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
  const categories = [...new Set(pages.map(p => p.category))]

  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Thai+Looped:wght@400;500;600;700;800&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Noto Sans Thai Looped','Inter',-apple-system,sans-serif; color:#212121; background:#ffffff; }
.page { width:297mm; height:210mm; position:relative; page-break-after:always; overflow:hidden; }
.page:last-child { page-break-after:auto; }

/* ─── COVER PAGE ─── */
.cover-page {
  background: #ffffff;
  display:flex; flex-direction:column; justify-content:center; padding:35mm 40mm;
}
.cover-red-line {
  position:absolute; top:0; left:0; right:0; height:2mm;
  background: #D32F2F;
}
.cover-pattern {
  position:absolute; top:0; left:0; right:0; bottom:0;
  background-image: radial-gradient(circle at 85% 15%, rgba(211,47,47,0.04) 0%, transparent 45%);
}
.cover-content { position:relative; z-index:1; max-width:70%; }
.cover-eyebrow {
  font-size:9pt; font-weight:700; letter-spacing:4px; text-transform:uppercase;
  color:#D32F2F; margin-bottom:8mm;
}
.cover-title {
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:42pt; font-weight:800; color:#212121; line-height:1.1;
  margin-bottom:5mm; letter-spacing:-0.5pt;
}
.cover-title-accent {
  color:#D32F2F;
}
.cover-divider {
  width:15mm; height:1mm;
  background: #D32F2F;
  margin:8mm 0;
}
.cover-subtitle {
  font-size:12pt; font-weight:400; color:#757575; line-height:1.6;
  margin-bottom:15mm;
}
.cover-date {
  font-size:10pt; color:#9E9E9E; letter-spacing:1px;
}
.cover-stats {
  position:absolute; bottom:30mm; left:40mm;
  display:flex; gap:10mm;
}
.stat-box {
  border-left:2mm solid #D32F2F;
  padding:4mm 6mm; text-align:left; min-width:28mm;
  background:#F5F5F5;
}
.stat-number {
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:22pt; font-weight:800; color:#D32F2F; line-height:1;
}
.stat-label {
  font-size:7pt; color:#757575; text-transform:uppercase; letter-spacing:1.5px;
  margin-top:2mm;
}
.cover-watermark {
  position:absolute; right:12mm; top:50%; transform:translateY(-50%);
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:100pt; font-weight:800; color:rgba(211,47,47,0.03);
  writing-mode:vertical-rl; letter-spacing:4mm;
}
.cover-footer {
  position:absolute; bottom:10mm; left:40mm; right:40mm;
  display:flex; justify-content:space-between; align-items:center;
  font-size:8pt; color:#9E9E9E;
  border-top:0.3mm solid #EEEEEE; padding-top:4mm;
}
.cover-footer-brand { color:#D32F2F; font-weight:700; letter-spacing:1px; }

/* ─── TOC ─── */
.toc-page {
  background:#ffffff; padding:15mm 30mm;
}
.toc-red-line {
  position:absolute; top:0; left:0; right:0; height:1mm;
  background: #D32F2F;
}
.toc-header {
  margin-bottom:10mm;
}
.toc-eyebrow {
  font-size:8pt; font-weight:700; letter-spacing:3px; text-transform:uppercase;
  color:#D32F2F; margin-bottom:3mm;
}
.toc-title {
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:28pt; font-weight:800; color:#212121; margin-bottom:2mm;
}
.toc-subtitle {
  font-size:10pt; color:#9E9E9E;
}
.toc-divider {
  width:12mm; height:1mm;
  background: #D32F2F;
  margin:6mm 0 10mm;
}
.toc-list { display:flex; flex-direction:column; gap:6mm; }
.toc-category { margin-bottom:2mm; }
.toc-cat-header {
  display:flex; justify-content:space-between; align-items:center;
  padding:3mm 0; border-bottom:0.4mm solid #EEEEEE;
  margin-bottom:3mm;
}
.toc-cat-name {
  font-size:9pt; font-weight:700; color:#212121; text-transform:uppercase;
  letter-spacing:1.5px;
}
.toc-cat-count {
  font-size:7pt; color:#757575; background:#F5F5F5;
  padding:1mm 3mm; border-radius:1mm;
}
.toc-entry {
  display:flex; justify-content:space-between; align-items:baseline;
  padding:2.5mm 0; border-bottom:0.15mm solid #F5F5F5;
}
.toc-entry-main { display:flex; align-items:baseline; gap:3mm; flex:1; }
.toc-name-th { font-size:9.5pt; font-weight:600; color:#212121; }
.toc-name-en { font-size:8pt; color:#9E9E9E; }
.toc-dots { flex:1; border-bottom:0.3mm dotted #E0E0E0; margin:0 4mm; height:3mm; }
.toc-page-num {
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:10pt; font-weight:700; color:#D32F2F; min-width:8mm; text-align:right;
}
.toc-path {
  font-size:7pt; color:#BDBDBD; padding-left:2mm;
}

/* ─── CONTENT PAGE ─── */
.content-page {
  background:#ffffff; display:flex; flex-direction:column;
}
.content-header {
  display:flex; align-items:center;
  padding:8mm 20mm 4mm; border-bottom:0.4mm solid #EEEEEE;
  gap:5mm;
}
.header-red-bar {
  width:2mm; height:12mm;
  background: #D32F2F;
  border-radius:0;
}
.header-info { flex:1; }
.header-title {
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:14pt; font-weight:700; color:#212121;
}
.header-name { font-size:8pt; color:#9E9E9E; margin-top:1mm; }
.header-category {
  font-size:7pt; font-weight:600; color:#757575; background:#F5F5F5;
  padding:2mm 4mm; border-radius:1mm;
  border:0.2mm solid #E0E0E0;
}
.content-body {
  flex:1; display:flex;
  padding:5mm 20mm; gap:6mm; overflow:hidden;
}

/* Browser Chrome Frame */
.browser-frame {
  flex:2; display:flex; flex-direction:column;
  background:#fff; border-radius:2mm;
  box-shadow:0 0.5mm 2mm rgba(0,0,0,0.06);
  overflow:hidden;
}
.browser-header {
  display:flex; align-items:center; gap:2mm;
  padding:3mm 4mm;
  background: #F5F5F5;
  border-bottom:0.3mm solid #E0E0E0;
}
.browser-dot { width:2.5mm; height:2.5mm; border-radius:50%; }
.browser-dot.red { background:#D32F2F; }
.browser-dot.yellow { background:#FEEA3B; }
.browser-dot.green { background:#4CAF50; }
.browser-url {
  flex:1; background:#fff; border-radius:1mm;
  padding:1.5mm 3mm; font-size:6.5pt; color:#9E9E9E;
  border:0.2mm solid #E0E0E0; margin-left:2mm;
}
.browser-content {
  flex:1; overflow:hidden; position:relative;
}
.browser-content img {
  display:block; width:100%; height:100%; object-fit:cover; object-position:top;
}
.browser-fade {
  position:absolute; bottom:0; left:0; right:0;
  height:15mm;
  background: linear-gradient(transparent, rgba(255,255,255,0.95));
}
.browser-scroll-hint {
  position:absolute; bottom:2mm; left:50%; transform:translateX(-50%);
  font-size:6pt; color:#9E9E9E; background:rgba(255,255,255,0.95);
  padding:1mm 3mm; border-radius:1mm;
}

/* Sidebar */
.sidebar {
  flex:1; max-width:60mm;
  display:flex; flex-direction:column; gap:4mm; overflow:hidden;
}
.sidebar-section {
  background:#F5F5F5; border-radius:1mm;
  padding:4mm;
}
.sidebar-eyebrow {
  font-size:7pt; font-weight:700; letter-spacing:1.5px;
  text-transform:uppercase; color:#D32F2F; margin-bottom:2mm;
}
.sidebar-title {
  font-size:9pt; font-weight:700; color:#212121; margin-bottom:2mm;
}
.sidebar-line {
  width:6mm; height:0.6mm;
  background: #D32F2F;
  margin-bottom:3mm;
}
.sidebar-desc {
  font-size:7.5pt; color:#424242; line-height:1.6;
}
.feature-list { list-style:none; padding:0; margin:0; }
.feature-list li {
  font-size:7pt; color:#424242; padding:1.5mm 0;
  padding-left:4mm; position:relative;
}
.feature-list li::before {
  content:''; position:absolute; left:0; top:2.8mm;
  width:1.5mm; height:1.5mm;
  background: #D32F2F;
  border-radius:50%;
}
.tech-info { display:flex; flex-direction:column; gap:2mm; }
.tech-row {
  display:flex; justify-content:space-between; font-size:6.5pt;
  padding:1mm 0; border-bottom:0.15mm solid #F5F5F5;
}
.tech-row span:first-child { color:#9E9E9E; }
.tech-row span:last-child { color:#212121; font-weight:600; }

/* Fallback */
.fallback-area {
  flex:1; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:6mm;
}
.fallback-card {
  background:#F5F5F5; border-radius:2mm;
  padding:12mm 18mm; text-align:center;
  position:relative; overflow:hidden;
}
.fallback-red-top {
  position:absolute; top:0; left:0; right:0; height:1.5mm;
  background: #D32F2F;
}
.fallback-icon {
  font-size:24pt; margin-bottom:4mm;
}
.fallback-title {
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:16pt; font-weight:700; color:#212121; margin-bottom:2mm;
}
.fallback-name { font-size:9pt; color:#757575; margin-bottom:4mm; }
.fallback-message {
  font-size:8pt; color:#757575; padding:2mm 4mm;
  background:#EEEEEE; border-radius:1mm;
}
.fallback-message.auth { color:#D32F2F; background:rgba(211,47,47,0.08); }

/* Footer */
.content-footer { padding:0 20mm 6mm; }
.footer-line {
  height:0.4mm;
  background: #EEEEEE;
  margin-bottom:3mm;
}
.footer-content {
  display:flex; justify-content:space-between; align-items:center;
  font-size:7pt; color:#9E9E9E;
}
.footer-brand { font-weight:700; color:#757575; letter-spacing:0.5px; }
.footer-page-num {
  font-family:'Noto Sans Thai Looped','Inter',sans-serif;
  font-size:9pt; font-weight:700; color:#D32F2F;
}
</style>
</head>
<body>
${renderCoverPage(pages, categories, dateStr)}
${renderTocPage(pages, categories)}
${pages.map((p, i) => renderContentPage(p, i, pages.length, dateStr)).join('')}
</body>
</html>`
}

function renderCoverPage(pages: PageData[], categories: string[], dateStr: string) {
  return `<div class="page cover-page">
  <div class="cover-red-line"></div>
  <div class="cover-pattern"></div>
  <div class="cover-content">
    <div class="cover-eyebrow">Website Preview Report</div>
    <h1 class="cover-title">NUCHA<br/><span class="cover-title-accent">VILLA</span></h1>
    <div class="cover-divider"></div>
    <p class="cover-subtitle">Comprehensive website documentation<br/>with full-page screenshots</p>
    <p class="cover-date">${dateStr}</p>
  </div>
  <div class="cover-stats">
    <div class="stat-box">
      <div class="stat-number">${pages.length}</div>
      <div class="stat-label">Pages</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">${categories.length}</div>
      <div class="stat-label">Categories</div>
    </div>
  </div>
  <div class="cover-watermark">NUCHA</div>
  <div class="cover-footer">
    <span class="cover-footer-brand">nucha-villa.com</span>
    <span>Generated from Admin System</span>
  </div>
</div>`
}

function renderTocPage(pages: PageData[], categories: string[]) {
  let pageNum = 2
  let tocEntries = ''
  for (const cat of categories) {
    const catPages = pages.filter(p => p.category === cat)
    tocEntries += `<div class="toc-category">
      <div class="toc-cat-header">
        <span class="toc-cat-name">${cat}</span>
        <span class="toc-cat-count">${catPages.length} pages</span>
      </div>
      ${catPages.map(p => {
        pageNum++
        return `<div class="toc-entry">
          <div class="toc-entry-main">
            <span class="toc-name-th">${p.nameTh}</span>
            <span class="toc-name-en">${p.name}</span>
          </div>
          <div class="toc-dots"></div>
          <div class="toc-page-num">${pageNum}</div>
        </div>
        <div class="toc-path">${p.path}</div>`
      }).join('')}
    </div>`
  }

  return `<div class="page toc-page">
  <div class="toc-red-line"></div>
  <div class="toc-header">
    <div class="toc-eyebrow">Contents</div>
    <h2 class="toc-title">Table of Contents</h2>
    <p class="toc-subtitle">สารบัญหน้าเว็บไซต์ทั้งหมด</p>
  </div>
  <div class="toc-divider"></div>
  <div class="toc-list">${tocEntries}</div>
</div>`
}

function renderContentPage(page: PageData, index: number, total: number, dateStr: string) {
  const hasScreenshot = page.screenshot && !page.requiresAuth
  const pageIndex = index + 3

  if (!hasScreenshot) {
    return `<div class="page content-page">
  <div class="content-header">
    <div class="header-red-bar"></div>
    <div class="header-info">
      <div class="header-title">${page.nameTh}</div>
      <div class="header-name">${page.name}</div>
    </div>
    <div class="header-category">${page.category}</div>
  </div>
  <div class="content-body">
    <div class="fallback-area">
      <div class="fallback-card">
        <div class="fallback-red-top"></div>
        <div class="fallback-icon">${page.requiresAuth ? '🔒' : '⚠'}</div>
        <h3 class="fallback-title">${page.nameTh}</h3>
        <p class="fallback-name">${page.name}</p>
        <p class="fallback-message ${page.requiresAuth ? 'auth' : ''}">
          ${page.requiresAuth ? 'Requires Authentication' : 'Screenshot Unavailable'}
        </p>
      </div>
      ${page.description ? `<div class="sidebar-section" style="max-width:70mm;">
        <div class="sidebar-eyebrow">Details</div>
        <div class="sidebar-line"></div>
        <p class="sidebar-desc">${page.description}</p>
      </div>` : ''}
    </div>
  </div>
  <div class="content-footer">
    <div class="footer-line"></div>
    <div class="footer-content">
      <span class="footer-brand">NUCHA VILLA</span>
      <span class="footer-page-num">${pageIndex}</span>
      <span>${dateStr}</span>
    </div>
  </div>
</div>`
  }

  return `<div class="page content-page">
  <div class="content-header">
    <div class="header-red-bar"></div>
    <div class="header-info">
      <div class="header-title">${page.nameTh}</div>
      <div class="header-name">${page.name}</div>
    </div>
    <div class="header-category">${page.category}</div>
  </div>
  <div class="content-body">
    <div class="browser-frame">
      <div class="browser-header">
        <div class="browser-dot red"></div>
        <div class="browser-dot yellow"></div>
        <div class="browser-dot green"></div>
        <div class="browser-url">${page.path}</div>
      </div>
      <div class="browser-content">
        <img src="${page.screenshot}" alt="${page.nameTh}" />
        <div class="browser-fade"></div>
        <div class="browser-scroll-hint">Full page capture</div>
      </div>
    </div>
    <div class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-eyebrow">Overview</div>
        <div class="sidebar-title">รายละเอียดหน้า</div>
        <div class="sidebar-line"></div>
        <p class="sidebar-desc">${page.description || 'ไม่มีรายละเอียด'}</p>
      </div>
      ${page.features && page.features.length > 0 ? `<div class="sidebar-section">
        <div class="sidebar-eyebrow">Features</div>
        <div class="sidebar-title">ฟีเจอร์ / ความสามารถ</div>
        <div class="sidebar-line"></div>
        <ul class="feature-list">
          ${page.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>` : ''}
      <div class="sidebar-section">
        <div class="sidebar-eyebrow">Technical</div>
        <div class="sidebar-title">ข้อมูลเทคนิค</div>
        <div class="sidebar-line"></div>
        <div class="tech-info">
          <div class="tech-row"><span>Path</span><span>${page.path}</span></div>
          <div class="tech-row"><span>Category</span><span>${page.category}</span></div>
          <div class="tech-row"><span>Auth Required</span><span>${page.requiresAuth ? 'Yes' : 'No'}</span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="content-footer">
    <div class="footer-line"></div>
    <div class="footer-content">
      <span class="footer-brand">NUCHA VILLA</span>
      <span class="footer-page-num">${pageIndex}</span>
      <span>${dateStr}</span>
    </div>
  </div>
</div>`
}
