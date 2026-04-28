# HANDOFF.md — Nucha Website Project

> อัปเดตล่าสุด: 2026-04-28 16:14 GMT+8
> Branch: `master` | Commit: `6a4c44e`
> Repo: https://github.com/dmz2001TH/nucha-website

---

## 📋 โครงสร้างโปรเจค

- **Framework:** Next.js 16.2.2 (App Router)
- **DB:** Prisma + PostgreSQL (Neon)
- **Auth:** NextAuth v5 (beta)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript, React 19
- **Export:** Excel (xlsx) + PDF (jsPDF + jspdf-autotable) + UI Spec PDF (Puppeteer)

## 🏗️ โครงสร้างไฟล์หลัก

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Sidebar + Auth guard
│   │   ├── page.tsx            # Dashboard
│   │   ├── bookings/           # จองคิว
│   │   ├── inquiries/          # คำถาม
│   │   ├── pages/              # จัดการ Pages
│   │   ├── portfolio/          # ผลงาน
│   │   ├── villas/             # วิลล่า
│   │   ├── services/           # บริการ
│   │   ├── media/              # มีเดีย
│   │   ├── users/              # ผู้ใช้
│   │   ├── settings/           # ตั้งค่า
│   │   ├── page-preview/       # ⭐ Page Builder (live preview + element inspector)
│   │   ├── ui-docs/            # ⭐ UI Docs (element annotation viewer)
│   │   ├── login/              # เข้าสู่ระบบ
│   │   └── register/           # สมัครสมาชิก
│   ├── api/
│   │   └── export/pdf/         # ⭐ UI Spec PDF export (Puppeteer server-side)
│   ├── portfolio/              # หน้าเว็บผลงาน (+ slug detail)
│   ├── villas/                 # หน้าเว็บวิลล่า (+ slug detail)
│   ├── services/               # หน้าเว็บบริการ (+ slug detail)
│   ├── booking/                # หน้าจองคิว
│   ├── contact/                # หน้าติดต่อ
│   ├── philosophy/             # หน้าปรัชญา
│   ├── map/                    # หน้าแผนที่
│   └── page.tsx                # หน้าแรก
├── components/
│   └── ui-docs/                # ⭐ UI Docs components
│       ├── Sidebar.tsx         # Page list + element search/filter
│       ├── PageCanvas.tsx      # iframe preview + overlay markers
│       └── ElementInspector.tsx # Element details + JSON/MD export
├── lib/
│   ├── prisma.ts               # Prisma client
│   ├── auth.ts                 # NextAuth config
│   ├── email.ts                # Email service
│   ├── pdf-generator.ts        # PDF report generator (jsPDF)
│   └── ui-docs/                # ⭐ UI Docs system
│       ├── types.ts            # TypeScript types (ElementType, AnnotatedElement, etc.)
│       ├── store.tsx           # React Context + useReducer state
│       └── sample-data.ts      # ⭐ Annotation data for 7 pages (42 elements)
└── middleware.ts
```

---

## ✅ สิ่งที่เสร็จแล้วทั้งหมด

### Phase 1 — Foundation (ก่อน 2026-04-23)
- Next.js 16 + Prisma + NextAuth v5 setup
- All admin CRUD pages (villas, portfolio, services, bookings, inquiries, pages, media, users, settings)
- Public pages (homepage, villas, services, portfolio, booking, contact, philosophy, map)
- Responsive design, Thai/English content
- Excel + PDF export (client-side jsPDF)

### Phase 2 — Performance & Polish (2026-04-23)
- Caching headers for `/uploads/*` and `/_next/static/*`
- Response compression, CSS optimization
- Page Preview with cover image thumbnails + preview modal
- Professional PDF reports (bookings, inquiries, dashboard)
- Admin sidebar update (external link to live site)
- Bug fixes (auth/status endpoint, sw.js placeholder, cache headers)

### Phase 3 — UI Docs System (2026-04-28) ⭐ NEW

#### 3a. UI Docs Annotation Viewer (`/admin/ui-docs`)
- **ไฟล์:** `src/app/admin/ui-docs/page.tsx`, `src/components/ui-docs/*`, `src/lib/ui-docs/*`
- **3-column layout:** Sidebar → Page Canvas → Element Inspector
- **Sidebar:** Page list, element list with search/filter (by name, type, component, tags)
- **PageCanvas:** iframe preview with responsive viewport switcher (Desktop/Tablet/Mobile), zoom, overlay markers, focus mode
- **ElementInspector:** 4 tabs (Details, Style, Behavior, Accessibility), priority stars, bilingual labels
- **Export:** JSON + Markdown export buttons
- **Keyboard nav:** ← → navigate, F = focus, M = markers

#### 3b. Annotation Data (7 pages, 42 elements) ⭐
- **ไฟล์:** `src/lib/ui-docs/sample-data.ts`
- Homepage (7 elements), Villas (4), Services (6), Portfolio (5), Booking (6), Contact (7), Philosophy (7)
- Each element has: type, selector, name (EN/TH), description (EN/TH), component, variant, status, UX (goal/KPI/priority), technical (CSS/data source/responsive/tailwind), behavior (action/route/event), accessibility (ARIA/role), tags

#### 3c. Page Builder (`/admin/page-preview`)
- **ไฟล์:** `src/app/admin/page-preview/page.tsx`
- **Top bar:** Breadcrumb, page title + Published badge, live URL, action buttons
- **Device toggle:** Desktop (1440px) / Tablet (768px) / Mobile (375px)
- **Live preview:** iframe with clickable element overlays + numbered markers
- **Bottom panel:** Component list with numbered markers + type badges
- **Right sidebar:** Element inspector with General Info, Action, Purpose, Technical, Accessibility, Tags
- **Keyboard nav:** ↑↓ navigate, Esc deselect
- **Page selector dropdown** in sidebar
- **Export UI Spec PDF** button

#### 3d. UI Spec PDF Export ⭐
- **ไฟล์:** `src/app/api/export/pdf/route.ts` + `template.ts`
- **Server-side** capture with Puppeteer (headless Chrome)
- **PDF structure:**
  1. **Cover page** — dark theme, page/element/category counts
  2. **Table of Contents** — category grouping with element counts
  3. **Per page → 2 sheets:**
     - **Screenshot page:** Full-page screenshot + numbered red marker boxes overlaid on real DOM positions
     - **Spec table page(s):** 6 elements per page, each row shows:
       - Name (EN/TH), description, type, status badge
       - Component, text content, CSS selector, tailwind classes
       - Data source, responsive (Desktop/Tablet/Mobile dots)
       - Click action, route/URL, event name
       - UX goal, KPI, priority (●●●●○ dots)
       - ARIA label, role
- **Design:** Red accent (#e94560), professional typography, browser chrome frame on screenshots

---

## 🔧 Architecture Decisions

### UI Docs = 3 layers
1. **`sample-data.ts`** — Static annotation data (edit in code)
2. **`store.tsx`** — React Context state management (runtime)
3. **`components/ui-docs/*`** — UI components (viewer)

### PDF Export = 2 layers
1. **`route.ts`** — Puppeteer captures screenshots + element positions from live DOM
2. **`template.ts`** — Pure HTML/CSS template renders the spec document

### Why server-side PDF?
- Client-side jsPDF can't capture live website screenshots
- Puppeteer renders actual pages with fonts, images, animations
- Element positions are read from real DOM (getBoundingClientRect)

---

## 🔧 วิธี Run

```bash
# Setup
npm install
npx prisma generate
npx prisma db push
npx prisma db seed   # (optional, seed data)

# Dev
npm run dev

# Build
npm run build
npm start
```

### Dependencies ที่ต้องมี (เพิ่มแล้ว)
- `puppeteer` — server-side screenshot capture
- `jspdf` + `jspdf-autotable` — client-side PDF generation
- `prisma` + `@prisma/client` — database ORM
- `next-auth` — authentication
- `lucide-react` — icons
- `leaflet` — maps

---

## 📌 สิ่งที่ควรทำต่อ (ถ้าต้องการ)

### 🔴 ควรทำ (UX/Performance)
1. **Replace `images.unoptimized: true`** — ถ้า deploy บน Vercel หรือมี image CDN/proxy
2. **`<Image>` component** — หลายหน้ายังใช้ `<img>` ธรรมดา ควรเปลี่ยนเป็น `next/image`
3. **Font optimization** — Material Symbols โหลดแบบ `<link>` ควรใช้ `next/font`
4. **Database query optimization** — ตรวจสอบ N+1 queries, เพิ่ม `select` เฉพาะ fields

### 🟡 ควรทำ (คุณภาพโค้ด)
5. **Loading states** — บางหน้ายังไม่มี skeleton loading
6. **Error boundaries** — เพิ่ม error.tsx ใน route groups
7. **Form validation** — เพิ่ม client-side validation ด้วย zod
8. **Image upload to cloud** — ย้ายจาก `/public/uploads/` ไป S3/R2

### 🟢 UI Docs / Page Builder enhancements
9. **`data-doc` attributes** — เพิ่มในทุกหน้า (ตอนนี้มีแค่ homepage) เพื่อให้ overlay markers ทำงานถูกต้อง
10. **Edit mode** — แก้ไข annotation ผ่าน UI ได้เลย (ไม่ต้องแก้ code)
11. **Multi-page PDF export** — เลือกหลายหน้าแล้ว export รวมเป็น PDF เดียว
12. **Element position calibration** — ปรับตำแหน่ง marker สำหรับ responsive viewports
13. **Component-to-code mapping** — แสดง code snippet ของแต่ละ component ใน inspector

### 🟢 อื่นๆ
14. **PDF export สำหรับ Villas/Portfolio** — เพิ่ม `generateVillasPDF()` / `generatePortfolioPDF()`
15. **i18n สำหรับ PDF** — เพิ่ม English version
16. **Scheduled reports** — cron job ส่งรายงาน PDF ทางอีเมล

---

## 📝 Notes สำหรับ Agent ถัดไป

### Flow การทำงาน
1. **UI Docs data** อยู่ใน `src/lib/ui-docs/sample-data.ts` — แก้ annotation ได้โดยตรง
2. **Page Builder** ที่ `/admin/page-preview` ใช้ annotation data จาก sample-data.ts
3. **PDF Export** route อยู่ที่ `src/app/api/export/pdf/` — ต้องมี Puppeteer (npm install แล้ว)
4. **Admin sidebar** มีเมนู UI Docs แล้ว (`/admin/ui-docs`)
5. **Search/filter** ใน Sidebar ค้นได้จาก name, type, component, tags

### สิ่งที่ต้องรู้
- `data-doc` attributes ใน homepage (`src/app/page.tsx`) ใช้สำหรับ element overlay markers
- `prisma/schema.prisma` คือ database schema — ดู structure ของ Villa, Portfolio, Service, Booking, Inquiry
- `.env` ต้องมี `DATABASE_URL` (Neon PostgreSQL), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- PDF export ใช้ Puppeteer ซึ่งต้อง headless Chrome — ทำงานได้บน Linux/Mac/Windows

### Commits ล่าสุด (2026-04-28)
```
6a4c44e feat(pdf-export): redesign as Interactive UI Spec Document
3537d87 feat(page-preview): redesign as page builder with element inspector
c11518f feat(ui-docs): complete UI Docs to 100%
```
