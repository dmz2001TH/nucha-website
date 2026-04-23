# HANDOFF.md — Nucha Website Project

> อัปเดตล่าสุด: 2026-04-23 19:08 GMT+8
> Branch: `master` | Commit: `e9c5188`
> Repo: https://github.com/dmz2001TH/nucha-website

---

## 📋 โครงสร้างโปรเจค

- **Framework:** Next.js 16.2.2 (App Router)
- **DB:** Prisma + PostgreSQL (Neon)
- **Auth:** NextAuth v5 (beta)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript, React 19
- **Export:** Excel (xlsx) + PDF (jsPDF + jspdf-autotable)

## 🏗️ โครงสร้างไฟล์หลัก

```
src/
├── app/
│   ├── admin/           # หน้าแอดมินทั้งหมด
│   │   ├── layout.tsx   # Sidebar + Auth guard
│   │   ├── page.tsx     # Dashboard
│   │   ├── bookings/    # จองคิว
│   │   ├── inquiries/   # คำถาม
│   │   ├── pages/       # จัดการ Pages (มี image preview + modal)
│   │   ├── portfolio/   # ผลงาน
│   │   ├── villas/      # วิลล่า
│   │   ├── services/    # บริการ
│   │   ├── media/       # มีเดีย
│   │   ├── users/       # ผู้ใช้
│   │   ├── settings/    # ตั้งค่า
│   │   ├── login/       # เข้าสู่ระบบ
│   │   └── register/    # สมัครสมาชิก
│   ├── api/             # API routes ทั้งหมด
│   ├── portfolio/       # หน้าเว็บผลงาน
│   ├── villas/          # หน้าเว็บวิลล่า
│   ├── services/        # หน้าเว็บบริการ
│   ├── booking/         # หน้าจองคิว
│   ├── contact/         # หน้าติดต่อ
│   └── page.tsx         # หน้าแรก
├── components/          # Shared components
├── lib/
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # NextAuth config
│   ├── email.ts         # Email service
│   ├── pdf-generator.ts # PDF report generator ⭐ ใหม่
│   └── i18n/            # Translations (th/en)
└── middleware.ts
```

---

## ✅ สิ่งที่เสร็จแล้ว (2026-04-23)

### 1. Performance Optimization
- **ไฟล์:** `next.config.ts`
- เพิ่ม caching headers สำหรับ `/uploads/*` และ `/_next/static/*` (1 year, immutable)
- เปิด `compress: true` สำหรับ response compression
- เปิด `experimental.optimizeCss`
- ปิด `poweredByHeader` เพื่อความปลอดภัย
- กำหนด `deviceSizes` และ `imageSizes` ให้เหมาะสม
- **หมายเหตุ:** `images.unoptimized: true` ยัง保留อยู่ เพราะ deploy ไม่ใช้ Vercel Image Optimization — ถ้าใช้ Vercel หรือมี image proxy สามารถลบออกได้

### 2. Page Preview with Images
- **ไฟล์:** `src/app/admin/pages/page.tsx`
- เปลี่ยนจากตารางเป็น **Card Grid** แสดง cover image thumbnail
- เพิ่ม **Preview Modal** — คลิก "ดูตัวอย่าง" เพื่อดูรูป + เนื้อหาเต็มใน modal
- แสดงทั้ง Thai/English content
- รองรับ status badge, slug, วันที่อัปเดต

### 3. Professional PDF Export
- **ไฟล์ใหม่:** `src/lib/pdf-generator.ts`
- 依赖: `jspdf` + `jspdf-autotable` (ติดตั้งแล้ว)
- **3 รายงาน:**
  - `generateBookingsPDF()` — รายงานจองคิว: summary cards, status bar chart, ตาราง + detail cards
  - `generateInquiriesPDF()` — รายงานคำถาม: summary cards, interest distribution bar, ตาราง
  - `generateDashboardPDF()` — รายงานสรุปภาพรวม: key metrics + insights
- **ดีไซน์:** แบรนด์ NUCHA สีแดง #C41E3A, header/footer, page numbers, ตาราง alternating rows
- **ปุ่ม Export:**
  - หน้า Dashboard: ปุ่ม "ส่งออกรายงาน PDF" + ปุ่ม PDF bookings/inquiries ใน export section
  - หน้าจองคิว: ปุ่ม "ส่งออก PDF"
  - หน้าคำถาม: ปุ่ม "ส่งออก PDF"
- Excel export เดิมยัง保留อยู่

### 4. Admin Sidebar Update
- **ไฟล์:** `src/app/admin/layout.tsx`
- เพิ่มเมนู **"ดูเว็บไซต์"** (open_in_new icon) ท้าย sidebar — เปิดเว็บจริงใน tab ใหม่
- เพิ่ม divider เส้นแบ่งระหว่างเมนูหลักกับลิงก์ภายนอก
- ปรับ type definition รองรับ mixed menu items (ปกติ + divider + external)

---

## 📌 สิ่งที่ควรทำต่อ (ถ้าต้องการ)

### 🔴 ควรทำ (มีผลกระทบต่อ UX/Performance)
1. **Replace `images.unoptimized: true`** — ถ้า deploy บน Vercel หรือมี image CDN/proxy ควรลบออกเพื่อให้ Next.js optimize รูปอัตโนมัติ
2. **Add `<Image>` component** แทน `<img>` ทั่วไป — หลายหน้า (portfolio, villas) ยังใช้ `<img>` ธรรมดา ควรเปลี่ยนเป็น `next/image` เพื่อ lazy loading + responsive sizing
3. **Font optimization** — ยังโหลด Google Fonts (Material Symbols) แบบ `<link>` ควรใช้ `next/font` เพื่อ self-host และลด layout shift
4. **Database query optimization** — ตรวจสอบ N+1 queries ใน API routes, เพิ่ม `select` เฉพาะ fields ที่จำเป็น

### 🟡 ควรทำ (คุณภาพโค้ด)
5. **Add loading states** — บางหน้า (services, media) ยังไม่มี skeleton loading
6. **Error boundaries** — ควเพิ่ม error.tsx ในแต่ละ route group
7. **Form validation** — หลายฟอร์มยังไม่มี client-side validation ด้วย zod (มี zod ใน dependencies แล้ว)
8. **Image upload to cloud** — ปัจจุบันเก็บใน `/public/uploads/` ควรย้ายไป cloud storage (S3, Cloudflare R2, etc.)

### 🟢 ถ้าต้องการเพิ่ม
9. **Page Preview ใน sidebar** — ถ้าต้องการเมนู "ดูตัวอย่างเว็บ" แบบ live preview (iframe) แทนที่จะเปิด tab ใหม่
10. **PDF export สำหรับ Villas/Portfolio** — ยังไม่มี สามารถเพิ่มฟังก์ชัน `generateVillasPDF()` / `generatePortfolioPDF()` ใน pdf-generator.ts
11. **i18n สำหรับ PDF** — ปัจจุบัน PDF เป็นภาษาไทยเท่านั้น อาจเพิ่ม English version
12. **Scheduled reports** — ตั้ง cron job ส่งรายงาน PDF ทางอีเมลอัตโนมัติ

---

## 🔧 วิธี Run

```bash
# Setup
npm install
npx prisma generate
npx prisma db push

# Dev
npm run dev

# Build
npm run build
npm start
```

## 📝 Notes
- Prisma schema อยู่ที่ `prisma/schema.prisma` — ใช้ PostgreSQL (Neon)
- PDF generator ใช้ jsPDF (client-side) — ไม่ต้องติดตั้ง server-side dependencies เพิ่ม
- ทุก export (Excel + PDF) ทำงาน client-side — ดาวน์โหลดทันทีไม่ต้องรอ server
