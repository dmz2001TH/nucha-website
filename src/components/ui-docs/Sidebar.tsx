'use client'

import { useUIStore } from '@/lib/ui-docs/store'

export default function Sidebar() {
  const { state, dispatch, pageList, currentPage } = useUIStore()

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
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 py-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pages</span>
        </div>
        {pageList.map((page) => {
          const isActive = state.selectedPageId === page.pageId
          return (
            <button
              key={page.pageId}
              onClick={() => dispatch({ type: 'SELECT_PAGE', pageId: page.pageId })}
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
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Elements</span>
            <span className="text-xs text-gray-400">{currentPage.elements.length} items</span>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {currentPage.elements.map((el, idx) => {
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
                    {idx + 1}
                  </span>
                  <span className="truncate">{el.name}</span>
                </button>
              )
            })}
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
