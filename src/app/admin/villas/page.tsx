'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '@/components/Toast'

interface Villa {
  id: string
  name: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  status: string
  featured: boolean
  coverImage: string
  createdAt: string
}

export default function AdminVillasPage() {
  const toast = useToast()
  const [villas, setVillas] = useState<Villa[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchVillas()
  }, [])

  const fetchVillas = async () => {
    try {
      const response = await fetch('/api/villas')
      const data = await response.json()
      setVillas(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error('Error fetching villas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจที่จะลบวิลล่านี้?')) return
    try {
      await fetch(`/api/villas/${id}`, { method: 'DELETE' })
      setVillas(villas.filter(v => v.id !== id))
      toast.success('ลบวิลล่าสำเร็จ')
    } catch {
      toast.error('ลบวิลล่าไม่สำเร็จ')
    }
  }

  const statusColors: Record<string, string> = {
    'AVAILABLE': 'bg-green-100 text-green-800',
    'RESERVED': 'bg-yellow-100 text-yellow-800',
    'SOLD': 'bg-gray-100 text-gray-800',
    'UNDER_CONSTRUCTION': 'bg-blue-100 text-blue-800'
  }

  const statusLabels: Record<string, string> = {
    'AVAILABLE': 'ว่าง',
    'RESERVED': 'จองแล้ว',
    'SOLD': 'ขายแล้ว',
    'UNDER_CONSTRUCTION': 'กำลังก่อสร้าง'
  }

  const filtered = villas.filter(v => {
    const matchFilter = filter === 'all' || v.status === filter
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => { setCurrentPage(1) }, [filter, search])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-96 bg-gray-200 rounded-xl"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline font-black text-gray-900">วิลล่า</h1>
          <p className="text-gray-500 font-body mt-1">ทั้งหมด {villas.length} รายการ</p>
        </div>
        <Link href="/admin/villas/new" className="bg-primary text-white px-6 py-3 font-headline font-bold text-sm rounded-lg hover:bg-red-700 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          เพิ่มวิลล่า
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาวิลล่า..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'AVAILABLE', 'RESERVED', 'SOLD', 'UNDER_CONSTRUCTION'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`font-headline text-xs tracking-wider font-bold px-4 py-2.5 rounded-lg transition-all ${
                filter === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'ทั้งหมด' : statusLabels[status] || status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">วิลล่า</th>
              <th className="text-left px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">ทำเล</th>
              <th className="text-left px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">ราคา</th>
              <th className="text-left px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">ห้องนอน/ห้องน้ำ</th>
              <th className="text-left px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">สถานะ</th>
              <th className="text-right px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((villa) => (
              <tr key={villa.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Image src={villa.coverImage} alt={villa.name} width={64} height={48} className="object-cover rounded-lg" />
                    <div>
                      <p className="font-bold text-gray-900">{villa.name}</p>
                      <p className="text-xs text-gray-500">{villa.area} ตร.ม.</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{villa.location}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-primary">฿{(villa.price / 1000000).toFixed(1)}M</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{villa.bedrooms} / {villa.bathrooms}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[villa.status]}`}>{statusLabels[villa.status]}</span>
                    {villa.featured && <span className="px-2 py-1 rounded text-xs font-bold bg-primary text-white">แนะนำ</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/villas/${villa.id}`} className="text-gray-400 hover:text-primary p-1"><span className="material-symbols-outlined">edit</span></Link>
                    <button onClick={() => handleDelete(villa.id)} className="text-gray-400 hover:text-red-600 p-1"><span className="material-symbols-outlined">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginated.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">{search ? 'search_off' : 'home'}</span>
            <p className="text-gray-500">{search ? 'ไม่พบวิลล่าที่ค้นหา' : 'ยังไม่มีวิลล่า'}</p>
            {!search && <Link href="/admin/villas/new" className="inline-block mt-4 text-primary font-headline font-bold hover:underline">เพิ่มวิลล่าแรก →</Link>}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30">
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg font-headline font-bold text-sm ${currentPage === page ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  )
}
