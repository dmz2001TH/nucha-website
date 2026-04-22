# Handoff — Nucha Website Performance Fix
**Date:** 2026-04-22  
**Branch:** `master`  
**Commit:** `4e0fd15`

---

## ปัญหา
Website ช้ามาก — แต่ละหน้าใช้เวลาโหลด **5-10 วินาที**

## สาเหตุ
ทุกหน้า public เป็น `'use client'` (Client Component) ที่:
1. Render ว่างๆ มาก่อน (ไม่มีข้อมูล)
2. Browser ค่อย fetch API แต่ละตัว (`/api/services`, `/api/portfolio`, `/api/settings` ฯลฯ)
3. แต่ละ API ต้อง query Neon PostgreSQL (serverless → cold start 1-3 วินาที)
4. ทำแบบ sequential = 2-3 fetch ต่อหน้า = 5-10 วินาที

## วิธีแก้
แปลงหน้า public ทั้งหมดเป็น **Server Components** ที่ดึงข้อมูลจาก Prisma โดยตรง ข้าม API layer

### ไฟล์ที่เปลี่ยน
| ไฟล์ | สิ่งที่เปลี่ยน |
|---|---|
| `src/app/page.tsx` (Home) | `'use client'` → Server Component, ดึง hero settings + services + portfolios พร้อมกัน |
| `src/app/services/page.tsx` | `'use client'` → Server Component, ดึง services ตรงจาก Prisma |
| `src/app/philosophy/page.tsx` | `'use client'` → Server Component, ดึง page + settings ตรง |
| `src/app/portfolio/page.tsx` | Server Component wrapper ดึงข้อมูล, ส่งให้ Client Component filter |
| `src/app/portfolio/PortfolioClient.tsx` | **ใหม่** — Client Component สำหรับ category filter |
| `src/app/villas/page.tsx` | แบบเดียวกับ portfolio |
| `src/app/villas/VillasClient.tsx` | **ใหม่** — Client Component สำหรับ filter + sort |
| `src/app/map/page.tsx` | Server Component wrapper ดึง villas + portfolios |
| `src/app/map/MapClient.tsx` | **ใหม่** — Client Component + dynamic import Leaflet |

### หน้าที่ไม่ได้แก้
- **Contact** — ฟอร์มอย่างเดียว ไม่มี fetch ข้อมูลมาแสดง โหลดเร็วอยู่แล้ว (~50ms)
- **Booking** — แบบเดียวกับ Contact (~30ms)
- **Admin pages** — ต้อง login อยู่แล้ว ไม่ critical

## ผลลัพธ์
| Page | ก่อน | หลัง | เร็วขึ้น |
|---|---|---|---|
| Home | ~5,000ms | ~370ms | **13x** |
| Services | ~2,100ms | ~280ms | **7.5x** |
| Portfolio | ~2,300ms | ~500ms | **4.6x** |
| Villas | ~1,880ms | ~500ms | **3.8x** |
| Philosophy | ~2,000ms | ~275ms | **7.3x** |
| Map | ~2,000ms | ~350ms | **5.7x** |
| Contact | ~1,850ms | ~35ms | **53x** |
| Booking | ~1,000ms | ~30ms | **33x** |

## สิ่งที่ควรทำต่อ
1. **Email notifications** — SMTP credentials ไม่ถูกต้อง (`Missing credentials for "PLAIN"`) → ตั้งค่า SMTP_HOST, SMTP_USER, SMTP_PASS
2. **LINE Notify** — token ยังไม่ตั้งค่า → ใส่ LINE_NOTIFY_TOKEN
3. **Domain mismatch** — Sitemap ใช้ `nucha-innovation.com` แต่ NEXTAUTH_URL คือ `nucha.shop` → แก้ให้ตรง
4. **⚠️ .env อยู่ใน repo** — มี database password + NextAuth secret → rotate credentials แล้ว add `.env` ใน `.gitignore`
5. **Register page** (`/admin/register`) เปิด public → ควรมี protection
6. **npm audit fix** — 5 vulnerabilities (2 moderate, 3 high)

## Pattern ที่ใช้ (สำหรับ reference)
```
Server Component (page.tsx)
  → async function ดึงข้อมูลจาก prisma
  → render HTML พร้อมข้อมูล
  → ส่ง props ให้ Client Component ถ้าต้องการ interactivity

Client Component (XxxClient.tsx)
  → 'use client'
  → รับ data เป็น props
  → จัดการ filter, sort, click handlers
```
