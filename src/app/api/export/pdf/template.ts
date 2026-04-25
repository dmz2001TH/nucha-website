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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Inter','Noto Sans Thai',-apple-system,sans-serif; color:#1a1a2e; background:#fff; }
.page { width:297mm; height:210mm; position:relative; page-break-after:always; overflow:hidden; }
.page:last-child { page-break-after:auto; }

/* COVER */
.cover-page { background:#fff; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; padding:40mm; }
.cover-accent-top { position:absolute; top:0; left:0; right:0; height:4mm; background:#911422; }
.cover-content { max-width:70%; }
.cover-label { font-size:10pt; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#911422; margin-bottom:8mm; }
.cover-title { font-size:42pt; font-weight:700; color:#1a1a2e; line-height:1.1; margin-bottom:4mm; }
.cover-subtitle { font-size:14pt; font-weight:300; color:#6b7280; margin-bottom:8mm; }
.cover-divider { width:25mm; height:1mm; background:#911422; margin-bottom:8mm; }
.cover-date { font-size:11pt; color:#9ca3af; margin-bottom:12mm; }
.cover-stats { display:flex; gap:12mm; }
.stat-box { background:#f9fafb; border:1px solid #f3f4f6; border-radius:3mm; padding:6mm 10mm; text-align:center; }
.stat-number { font-size:22pt; font-weight:700; color:#1a1a2e; }
.stat-label { font-size:8pt; color:#6b7280; text-transform:uppercase; letter-spacing:1px; margin-top:2mm; }
.cover-accent-block { position:absolute; top:0; right:0; width:35%; height:100%; background:#f8f8f8; clip-path:polygon(25% 0,100% 0,100% 100%,0 100%); }
.cover-footer { position:absolute; bottom:10mm; left:40mm; right:40mm; display:flex; justify-content:space-between; font-size:8pt; color:#9ca3af; border-top:0.3mm solid #f3f4f6; padding-top:4mm; }

/* TOC */
.toc-page { background:#fff; padding:15mm 25mm; }
.toc-accent-line { position:absolute; top:0; left:0; right:0; height:1.5mm; background:#911422; }
.toc-title { font-size:28pt; font-weight:700; color:#1a1a2e; margin-bottom:3mm; margin-top:10mm; }
.toc-subtitle { font-size:11pt; color:#9ca3af; margin-bottom:8mm; }
.toc-divider { width:15mm; height:0.8mm; background:#911422; margin-bottom:8mm; }
.toc-list { display:flex; flex-direction:column; gap:5mm; }
.toc-category { margin-bottom:3mm; }
.toc-cat-header { display:flex; justify-content:space-between; align-items:center; background:#f9fafb; border-radius:2mm; padding:3mm 5mm; margin-bottom:2mm; }
.toc-cat-name { font-size:9pt; font-weight:600; color:#911422; text-transform:uppercase; letter-spacing:1px; }
.toc-cat-count { font-size:7pt; color:#9ca3af; background:#f3f4f6; padding:1mm 3mm; border-radius:1.5mm; }
.toc-entry { display:flex; justify-content:space-between; align-items:center; padding:2mm 5mm; }
.toc-entry-main { display:flex; align-items:center; gap:3mm; }
.toc-name-th { font-size:9pt; font-weight:600; color:#374151; }
.toc-name-en { font-size:8pt; color:#9ca3af; }
.toc-page-num { font-size:8pt; font-weight:500; color:#6b7280; background:#f3f4f6; padding:1mm 3mm; border-radius:1.5mm; min-width:8mm; text-align:center; }
.toc-path { font-size:7pt; color:#d1d5db; padding:0 5mm; margin-bottom:2mm; }

/* CONTENT */
.content-page { background:#fff; display:flex; flex-direction:column; }
.content-header { display:flex; align-items:center; padding:8mm 15mm 5mm; border-bottom:0.3mm solid #f3f4f6; gap:5mm; }
.header-accent { width:1.5mm; height:10mm; background:#911422; border-radius:0.75mm; }
.header-info { flex:1; }
.header-title { font-size:12pt; font-weight:600; color:#1a1a2e; }
.header-name { font-size:8pt; color:#9ca3af; }
.header-category { font-size:7pt; color:#6b7280; background:#f9fafb; border:0.3mm solid #f3f4f6; padding:2mm 4mm; border-radius:2mm; }
.content-body { flex:1; display:flex; padding:5mm 15mm; gap:5mm; overflow:hidden; }
.screenshot-area { flex:2; display:flex; align-items:center; justify-content:center; }
.screenshot-frame { background:#fff; border-radius:2mm; box-shadow:0 2mm 8mm rgba(0,0,0,0.08),0 0.5mm 2mm rgba(0,0,0,0.04); overflow:hidden; max-height:100%; }
.screenshot-frame img { display:block; max-width:100%; max-height:165mm; object-fit:contain; }
.sidebar { flex:1; max-width:65mm; display:flex; flex-direction:column; gap:4mm; overflow:hidden; }
.sidebar-section { background:#f9fafb; border-radius:2mm; padding:4mm; }
.sidebar-title { font-size:8pt; font-weight:600; color:#911422; margin-bottom:2mm; }
.sidebar-line { width:8mm; height:0.5mm; background:#e5e7eb; margin-bottom:3mm; }
.sidebar-desc { font-size:7.5pt; color:#4b5563; line-height:1.5; }
.feature-list { list-style:none; padding:0; margin:0; }
.feature-list li { font-size:7pt; color:#4b5563; padding:1.5mm 0; padding-left:4mm; position:relative; }
.feature-list li::before { content:''; position:absolute; left:0; top:2.5mm; width:1.5mm; height:1.5mm; background:#911422; border-radius:50%; }
.tech-info { display:flex; flex-direction:column; gap:2mm; }
.tech-row { display:flex; justify-content:space-between; font-size:7pt; }
.tech-row span:first-child { color:#9ca3af; }
.tech-row span:last-child { color:#374151; font-weight:500; }

/* FALLBACK */
.fallback-area { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8mm; }
.fallback-card { background:#fff; border:0.3mm solid #f3f4f6; border-radius:3mm; padding:12mm 20mm; text-align:center; position:relative; overflow:hidden; }
.fallback-accent { position:absolute; top:0; left:0; right:0; height:1.5mm; background:#911422; }
.fallback-title { font-size:18pt; font-weight:600; color:#1a1a2e; margin-bottom:3mm; }
.fallback-name { font-size:10pt; color:#9ca3af; margin-bottom:5mm; }
.fallback-message { font-size:9pt; color:#6b7280; }
.fallback-message.auth { color:#911422; }
.fallback-sub { font-size:7pt; color:#d1d5db; margin-top:2mm; }
.fallback-desc { max-width:80mm; }

/* FOOTER */
.content-footer { padding:0 15mm 8mm; }
.footer-line { height:0.3mm; background:#f3f4f6; margin-bottom:3mm; }
.footer-content { display:flex; justify-content:space-between; align-items:center; font-size:7pt; color:#9ca3af; }
.footer-brand { font-weight:600; color:#6b7280; }
.footer-center { font-weight:500; }
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
  <div class="cover-accent-top"></div>
  <div class="cover-content">
    <div class="cover-label">WEBSITE PREVIEW REPORT</div>
    <h1 class="cover-title">NUCHA VILLA</h1>
    <p class="cover-subtitle">Website Documentation & Screenshot Report</p>
    <div class="cover-divider"></div>
    <p class="cover-date">${dateStr}</p>
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
  </div>
  <div class="cover-accent-block"></div>
  <div class="cover-footer">
    <span>nucha-villa.com</span>
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
          <div class="toc-page-num">${pageNum}</div>
        </div>
        <div class="toc-path">${p.path}</div>`
      }).join('')}
    </div>`
  }

  return `<div class="page toc-page">
  <div class="toc-accent-line"></div>
  <h2 class="toc-title">Contents</h2>
  <p class="toc-subtitle">สารบัญหน้าเว็บไซต์ทั้งหมด</p>
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
    <div class="header-accent"></div>
    <div class="header-info">
      <div class="header-title">${page.nameTh}</div>
      <div class="header-name">${page.name}</div>
    </div>
    <div class="header-category">${page.category}</div>
  </div>
  <div class="content-body">
    <div class="fallback-area">
      <div class="fallback-card">
        <div class="fallback-accent"></div>
        <h3 class="fallback-title">${page.nameTh}</h3>
        <p class="fallback-name">${page.name}</p>
        <p class="fallback-message ${page.requiresAuth ? 'auth' : ''}">
          ${page.requiresAuth ? 'Requires Authentication' : 'Screenshot capture failed'}
        </p>
        <p class="fallback-sub">${page.requiresAuth ? 'Login required to capture this page' : page.path}</p>
      </div>
      ${page.description ? `<div class="fallback-desc">
        <div class="sidebar-title">รายละเอียดหน้า</div>
        <div class="sidebar-line"></div>
        <p class="sidebar-desc">${page.description}</p>
      </div>` : ''}
    </div>
  </div>
  <div class="content-footer">
    <div class="footer-line"></div>
    <div class="footer-content">
      <span class="footer-brand">NUCHA VILLA</span>
      <span class="footer-center">${pageIndex} / ${total + 2}</span>
      <span class="footer-date">${dateStr}</span>
    </div>
  </div>
</div>`
  }

  return `<div class="page content-page">
  <div class="content-header">
    <div class="header-accent"></div>
    <div class="header-info">
      <div class="header-title">${page.nameTh}</div>
      <div class="header-name">${page.name}</div>
    </div>
    <div class="header-category">${page.category}</div>
  </div>
  <div class="content-body">
    <div class="screenshot-area">
      <div class="screenshot-frame">
        <img src="${page.screenshot}" alt="${page.nameTh}" />
      </div>
    </div>
    <div class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-title">รายละเอียดหน้า</div>
        <div class="sidebar-line"></div>
        <p class="sidebar-desc">${page.description || 'ไม่มีรายละเอียด'}</p>
      </div>
      ${page.features && page.features.length > 0 ? `<div class="sidebar-section">
        <div class="sidebar-title">ฟีเจอร์ / ความสามารถ</div>
        <div class="sidebar-line"></div>
        <ul class="feature-list">
          ${page.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>` : ''}
      <div class="sidebar-section">
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
      <span class="footer-center">${pageIndex} / ${total + 2}</span>
      <span class="footer-date">${dateStr}</span>
    </div>
  </div>
</div>`
}
