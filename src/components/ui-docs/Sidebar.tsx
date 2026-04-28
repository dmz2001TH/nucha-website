'use client'

import { useState, useMemo } from 'react'
import { useUIStore } from '@/lib/ui-docs/store'

export default function Sidebar() {
  const { state, dispatch, pageList, currentPage } = useUIStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredElements = useMemo(() => {
    if (!currentPage) return []
    if (!searchQuery.trim()) return currentPage.elements
    const q = searchQuery.toLowerCase()
    return currentPage.elements.filter(
      (el) =>
        el.name.toLowerCase().includes(q) ||
        el.nameTh?.toLowerCase().includes(q) ||
        el.type.toLowerCase().includes(q) ||
        el.id.toLowerCase().includes(q) ||
        el.description.toLowerCase().includes(q) ||
        el.component?.toLowerCase().includes(q) ||
        el.tags?.some((t) => t.toLowerCase().includes(q))
    )
  }, [currentPage, searchQuery])

  if (!state.sidebarOpen) {
    return (
      <button
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        className="fixed left-0 top-20 z-50 w-8 h-10 bg-white rounded-r-lg shadow-lg border border-l-0 border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
        title="Open Sidebar"
      >
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-red-500">description</span>
          <h2 className="font-semibold text-sm text-gray-900">UI Docs</h2>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
      </div>

      {/* Page List */}
      <div className="overflow-y-auto py-2">
        <div className="px-3 py-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pages</span>
        </div>
        {pageList.map((page) => {
          const isActive = state.selectedPageId === page.pageId
          return (
            <button
              key={page.pageId}
              onClick={() => {
                dispatch({ type: 'SELECT_PAGE', pageId: page.pageId })
                setSearchQuery('')
              }}
              className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                isActive
                  ? 'bg-red-50 text-red-700 border-r-2 border-red-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{page.pageName}</p>
                <p className="text-xs text-gray-400 truncate">{page.pageNameTh}</p>
              </div>
              <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                <span className={`material-symbols-outlined text-[14px] ${isActive ? 'text-red-400' : 'text-gray-300'}`}>layers</span>
                <span className={`text-xs font-medium ${isActive ? 'text-red-500' : 'text-gray-400'}`}>
                  {page.elementCount}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Element Summary for current page */}
      {currentPage && (
        <div className="border-t border-gray-200 flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <span className="material-symbols-outlined text-[16px] text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search elements..."
                className="w-full pl-8 pr-8 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-red-300 focus:border-red-300 outline-none transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Element count */}
          <div className="px-3 py-1 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Elements</span>
            <span className="text-xs text-gray-400">
              {searchQuery ? `${filteredElements.length}/${currentPage.elements.length}` : `${currentPage.elements.length} items`}
            </span>
          </div>

          {/* Element list */}
          <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-1">
            {filteredElements.length === 0 ? (
              <div className="py-6 text-center">
                <span className="material-symbols-outlined text-[20px] text-gray-300 block mb-1">search_off</span>
                <p className="text-xs text-gray-400">No matching elements</p>
              </div>
            ) : (
              filteredElements.map((el) => {
                const originalIdx = currentPage.elements.findIndex((e) => e.id === el.id)
                const isSelected = state.selectedElementId === el.id
                return (
                  <button
                    key={el.id}
                    onClick={() => dispatch({ type: 'SELECT_ELEMENT', elementId: el.id })}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-red-50 text-red-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        isSelected ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {originalIdx + 1}
                    </span>
                    <span className="truncate flex-1">{el.name}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">{el.type}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>v{currentPage?.version || '1.0.0'}</span>
          <span>{currentPage?.lastUpdated || '—'}</span>
        </div>
      </div>
    </div>
  )
}
