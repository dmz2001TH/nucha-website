'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/Toast'

interface Portfolio {
  id: string
  title: string
  location: string
  year: number
  category: string
  status: string
  featured: boolean
  coverImage: string
  createdAt: string
}

export default function AdminPortfolioPage() {
  const toast = useToast()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolio')
      const data = await response.json()
      setPortfolios(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error('Error fetching portfolios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจที่จะลบผลงานนี้?')) return
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
      setPortfolios(portfolios.filter(p => p.id !== id))
      toast.success('ลบผลงานสำเร็จ')
    } catch {
      toast.error('ลบผลงานไม่สำเร็จ')
    }
  }

  const statusColors: Record<string, string> = {
    'DRAFT': 'bg-gray-100 text-gray-800',
    'PUBLISHED': 'bg-green-100 text-green-800',
    'ARCHIVED': 'bg-yellow-100 text-yellow-800'
  }

  const statusLabels: Record<string, string> = {
    'DRAFT': 'ร่าง',
    'PUBLISHED': 'เผยแพร่',
    'ARCHIVED': 'เก็บถาวร'
  }

  const categoryLabels: Record<string, string> = {
    'RESIDENTIAL': 'บ้านพักอาศัย',
    'COMMERCIAL': 'พาณิชย์',
    'INTERIOR': 'ออกแบบภายใน',
    'ARCHITECTURE': 'สถาปัตยกรรม'
  }

  const filtered = portfolios.filter(p => {
    const matchFilter = filter === 'all' || p.category === filter
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [filter, search])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline font-black text-gray-900">ผลงาน</h1>
          <p className="text-gray-500 font-body mt-1">ทั้งหมด {portfolios.length} รายการ</p>
        </div>
        <Link href="/admin/portfolio/new" className="bg-primary text-white px-6 py-3 font-headline font-bold text-sm rounded-lg hover:bg-red-700 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          เพิ่มผลงาน
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
            placeholder="ค้นหาผลงาน..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'RESIDENTIAL', 'COMMERCIAL', 'INTERIOR', 'ARCHITECTURE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-headline text-xs tracking-wider font-bold px-4 py-2.5 rounded-lg transition-all ${
                filter === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'ทั้งหมด' : categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map((portfolio) => (
          <div key={portfolio.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img src={portfolio.coverImage} alt={portfolio.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[portfolio.status]}`}>
                  {statusLabels[portfolio.status] || portfolio.status}
                </span>
                {portfolio.featured && <span className="px-2 py-1 rounded text-xs font-bold bg-primary text-white">แนะนำ</span>}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-headline font-bold text-gray-900 mb-1">{portfolio.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{portfolio.location} • {portfolio.year}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{categoryLabels[portfolio.category] || portfolio.category}</span>
                <div className="flex gap-2">
                  <Link href={`/admin/portfolio/${portfolio.id}`} className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">edit</span></Link>
                  <button onClick={() => handleDelete(portfolio.id)} className="text-gray-400 hover:text-red-600"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {paginated.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">search_off</span>
          <p className="text-gray-500">{search ? 'ไม่พบผลงานที่ค้นหา' : 'ยังไม่มีผลงาน'}</p>
          {!search && <Link href="/admin/portfolio/new" className="inline-block mt-4 text-primary font-headline font-bold hover:underline">เพิ่มผลงานแรก →</Link>}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg font-headline font-bold text-sm transition-all ${
                currentPage === page ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  )
}
