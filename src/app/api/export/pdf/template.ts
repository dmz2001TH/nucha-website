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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Inter','Noto Sans Thai',-apple-system,sans-serif; color:#1a1a2e; background:#faf9f7; }
.page { width:297mm; height:210mm; position:relative; page-break-after:always; overflow:hidden; }
.page:last-child { page-break-after:auto; }

/* ─── LUXURY COVER PAGE ─── */
.cover-page {
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%);
  display:flex; flex-direction:column; justify-content:center; padding:35mm 40mm;
}
.cover-gold-line {
  position:absolute; top:0; left:0; right:0; height:1.5mm;
  background: linear-gradient(90deg, transparent 0%, #c9a96e 20%, #e8d5a3 50%, #c9a96e 80%, transparent 100%);
}
.cover-pattern {
  position:absolute; top:0; left:0; right:0; bottom:0;
  background-image: radial-gradient(circle at 80% 20%, rgba(201,169,110,0.08) 0%, transparent 50%),
                    radial-gradient(circle at 20% 80%, rgba(201,169,110,0.05) 0%, transparent 40%);
}
.cover-content { position:relative; z-index:1; max-width:65%; }
.cover-eyebrow {
  font-size:9pt; font-weight:500; letter-spacing:4px; text-transform:uppercase;
  color:#c9a96e; margin-bottom:10mm;
}
.cover-title {
  font-family:'Playfair Display','Noto Sans Thai',serif;
  font-size:48pt; font-weight:600; color:#f5f0e8; line-height:1.05;
  margin-bottom:5mm; letter-spacing:-0.5pt;
}
.cover-title-accent {
  color:#c9a96e; font-style:italic;
}
.cover-divider {
  width:20mm; height:0.8mm;
  background: linear-gradient(90deg, #c9a96e, #e8d5a3, #c9a96e);
  margin:8mm 0;
}
.cover-subtitle {
  font-size:13pt; font-weight:300; color:#a0aab8; line-height:1.5;
  margin-bottom:15mm;
}
.cover-date {
  font-size:10pt; color:#6b7a8f; letter-spacing:1px;
}
.cover-stats {
  position:absolute; bottom:30mm; left:40mm;
  display:flex; gap:10mm;
}
.stat-box {
  border:0.3mm solid rgba(201,169,110,0.3); border-radius:2mm;
  padding:5mm 8mm; text-align:center; min-width:28mm;
  background:rgba(255,255,255,0.03);
}
.stat-number {
  font-family:'Playfair Display',serif;
  font-size:24pt; font-weight:600; color:#e8d5a3; line-height:1;
}
.stat-label {
  font-size:7pt; color:#6b7a8f; text-transform:uppercase; letter-spacing:1.5px;
  margin-top:2mm;
}
.cover-watermark {
  position:absolute; right:15mm; top:50%; transform:translateY(-50%);
  font-family:'Playfair Display',serif;
  font-size:120pt; font-weight:700; color:rgba(201,169,110,0.04);
  writing-mode:vertical-rl; letter-spacing:5mm;
}
.cover-footer {
  position:absolute; bottom:10mm; left:40mm; right:40mm;
  display:flex; justify-content:space-between; align-items:center;
  font-size:8pt; color:#4a5568;
  border-top:0.2mm solid rgba(201,169,110,0.2); padding-top:4mm;
}
.cover-footer-brand { color:#c9a96e; font-weight:500; letter-spacing:1px; }

/* ─── LUXURY TOC ─── */
.toc-page {
  background:#faf9f7; padding:15mm 30mm;
}
.toc-gold-line {
  position:absolute; top:0; left:0; right:0; height:1mm;
  background: linear-gradient(90deg, #c9a96e, #e8d5a3, transparent 60%);
}
.toc-header {
  margin-bottom:10mm;
}
.toc-eyebrow {
  font-size:8pt; font-weight:500; letter-spacing:3px; text-transform:uppercase;
  color:#c9a96e; margin-bottom:3mm;
}
.toc-title {
  font-family:'Playfair Display',serif;
  font-size:32pt; font-weight:600; color:#1a2332; margin-bottom:2mm;
}
.toc-subtitle {
  font-size:10pt; color:#8b95a5;
}
.toc-divider {
  width:15mm; height:0.6mm;
  background: linear-gradient(90deg, #c9a96e, #e8d5a3);
  margin:6mm 0 10mm;
}
.toc-list { display:flex; flex-direction:column; gap:6mm; }
.toc-category { margin-bottom:2mm; }
.toc-cat-header {
  display:flex; justify-content:space-between; align-items:center;
  padding:3mm 0; border-bottom:0.3mm solid #e8e4df;
  margin-bottom:3mm;
}
.toc-cat-name {
  font-size:9pt; font-weight:600; color:#1a2332; text-transform:uppercase;
  letter-spacing:1.5px;
}
.toc-cat-count {
  font-size:7pt; color:#8b95a5; background:#f0ede8;
  padding:1mm 3mm; border-radius:1mm;
}
.toc-entry {
  display:flex; justify-content:space-between; align-items:baseline;
  padding:2.5mm 0; border-bottom:0.15mm solid #f0ede8;
}
.toc-entry-main { display:flex; align-items:baseline; gap:3mm; flex:1; }
.toc-name-th { font-size:9.5pt; font-weight:500; color:#2d3748; }
.toc-name-en { font-size:8pt; color:#a0aab8; }
.toc-dots { flex:1; border-bottom:0.3mm dotted #d4cfc7; margin:0 4mm; height:3mm; }
.toc-page-num {
  font-family:'Playfair Display',serif;
  font-size:10pt; font-weight:500; color:#c9a96e; min-width:8mm; text-align:right;
}
.toc-path {
  font-size:7pt; color:#c4bfb6; padding-left:2mm;
}

/* ─── LUXURY CONTENT PAGE ─── */
.content-page {
  background:#faf9f7; display:flex; flex-direction:column;
}
.content-header {
  display:flex; align-items:center;
  padding:8mm 20mm 4mm; border-bottom:0.3mm solid #e8e4df;
  gap:5mm;
}
.header-gold-bar {
  width:1.2mm; height:12mm;
  background: linear-gradient(180deg, #c9a96e, #e8d5a3, #c9a96e);
  border-radius:0.6mm;
}
.header-info { flex:1; }
.header-title {
  font-family:'Playfair Display',serif;
  font-size:14pt; font-weight:600; color:#1a2332;
}
.header-name { font-size:8pt; color:#8b95a5; margin-top:1mm; }
.header-category {
  font-size:7pt; color:#6b7a8f; background:#f0ede8;
  padding:2mm 4mm; border-radius:1.5mm;
  border:0.2mm solid #e8e4df;
}
.content-body {
  flex:1; display:flex;
  padding:5mm 20mm; gap:6mm; overflow:hidden;
}

/* Browser Chrome Frame */
.browser-frame {
  flex:2; display:flex; flex-direction:column;
  background:#fff; border-radius:3mm;
  box-shadow:0 1mm 4mm rgba(0,0,0,0.06), 0 0.3mm 1mm rgba(0,0,0,0.03);
  overflow:hidden;
}
.browser-header {
  display:flex; align-items:center; gap:2mm;
  padding:3mm 4mm;
  background: linear-gradient(180deg, #f8f8f8, #f0f0f0);
  border-bottom:0.3mm solid #e0e0e0;
}
.browser-dot { width:2.5mm; height:2.5mm; border-radius:50%; }
.browser-dot.red { background:#ff5f57; }
.browser-dot.yellow { background:#febc2e; }
.browser-dot.green { background:#28c840; }
.browser-url {
  flex:1; background:#fff; border-radius:1.5mm;
  padding:1.5mm 3mm; font-size:6.5pt; color:#8b95a5;
  border:0.2mm solid #e0e0e0; margin-left:2mm;
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
  background: linear-gradient(transparent, rgba(255,255,255,0.9));
}
.browser-scroll-hint {
  position:absolute; bottom:2mm; left:50%; transform:translateX(-50%);
  font-size:6pt; color:#a0aab8; background:rgba(255,255,255,0.9);
  padding:1mm 3mm; border-radius:2mm;
}

/* Sidebar */
.sidebar {
  flex:1; max-width:60mm;
  display:flex; flex-direction:column; gap:4mm; overflow:hidden;
}
.sidebar-section {
  background:#fff; border-radius:2mm;
  padding:4mm; box-shadow:0 0.5mm 2mm rgba(0,0,0,0.04);
}
.sidebar-eyebrow {
  font-size:7pt; font-weight:600; letter-spacing:1.5px;
  text-transform:uppercase; color:#c9a96e; margin-bottom:2mm;
}
.sidebar-title {
  font-size:9pt; font-weight:600; color:#1a2332; margin-bottom:2mm;
}
.sidebar-line {
  width:6mm; height:0.4mm;
  background: linear-gradient(90deg, #c9a96e, #e8d5a3);
  margin-bottom:3mm;
}
.sidebar-desc {
  font-size:7.5pt; color:#4a5568; line-height:1.6;
}
.feature-list { list-style:none; padding:0; margin:0; }
.feature-list li {
  font-size:7pt; color:#4a5568; padding:1.5mm 0;
  padding-left:4mm; position:relative;
}
.feature-list li::before {
  content:''; position:absolute; left:0; top:2.8mm;
  width:1.2mm; height:1.2mm;
  background: linear-gradient(135deg, #c9a96e, #e8d5a3);
  border-radius:50%;
}
.tech-info { display:flex; flex-direction:column; gap:2mm; }
.tech-row {
  display:flex; justify-content:space-between; font-size:6.5pt;
  padding:1mm 0; border-bottom:0.15mm solid #f0ede8;
}
.tech-row span:first-child { color:#a0aab8; }
.tech-row span:last-child { color:#2d3748; font-weight:500; }

/* Fallback */
.fallback-area {
  flex:1; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:6mm;
}
.fallback-card {
  background:#fff; border-radius:3mm;
  padding:12mm 18mm; text-align:center;
  box-shadow:0 1mm 4mm rgba(0,0,0,0.06);
  position:relative; overflow:hidden;
}
.fallback-gold-top {
  position:absolute; top:0; left:0; right:0; height:1mm;
  background: linear-gradient(90deg, #c9a96e, #e8d5a3, #c9a96e);
}
.fallback-icon {
  font-size:24pt; margin-bottom:4mm;
}
.fallback-title {
  font-family:'Playfair Display',serif;
  font-size:16pt; font-weight:600; color:#1a2332; margin-bottom:2mm;
}
.fallback-name { font-size:9pt; color:#8b95a5; margin-bottom:4mm; }
.fallback-message {
  font-size:8pt; color:#6b7a8f; padding:2mm 4mm;
  background:#f8f6f3; border-radius:1.5mm;
}
.fallback-message.auth { color:#c9a96e; background:rgba(201,169,110,0.08); }

/* Footer */
.content-footer { padding:0 20mm 6mm; }
.footer-gold-line {
  height:0.3mm;
  background: linear-gradient(90deg, transparent, #e8e4df, transparent);
  margin-bottom:3mm;
}
.footer-content {
  display:flex; justify-content:space-between; align-items:center;
  font-size:7pt; color:#a0aab8;
}
.footer-brand { font-weight:500; color:#6b7a8f; letter-spacing:0.5px; }
.footer-page-num {
  font-family:'Playfair Display',serif;
  font-size:9pt; color:#c9a96e;
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
  <div class="cover-gold-line"></div>
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
  <div class="toc-gold-line"></div>
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
    <div class="header-gold-bar"></div>
    <div class="header-info">
      <div class="header-title">${page.nameTh}</div>
      <div class="header-name">${page.name}</div>
    </div>
    <div class="header-category">${page.category}</div>
  </div>
  <div class="content-body">
    <div class="fallback-area">
      <div class="fallback-card">
        <div class="fallback-gold-top"></div>
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
    <div class="footer-gold-line"></div>
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
    <div class="header-gold-bar"></div>
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
    <div class="footer-gold-line"></div>
    <div class="footer-content">
      <span class="footer-brand">NUCHA VILLA</span>
      <span class="footer-page-num">${pageIndex}</span>
      <span>${dateStr}</span>
    </div>
  </div>
</div>`
}
