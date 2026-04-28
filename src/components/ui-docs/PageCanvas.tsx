'use client'

import { useRef, useEffect, useState } from 'react'
import { useUIStore } from '@/lib/ui-docs/store'
import { ViewMode } from '@/lib/ui-docs/types'

const VIEW_WIDTHS: Record<ViewMode, number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
}

export default function PageCanvas() {
  const { state, dispatch, currentPage } = useUIStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const width = VIEW_WIDTHS[state.viewMode]
  const scale = state.zoom

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        dispatch({ type: 'NEXT_ELEMENT' })
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        dispatch({ type: 'PREV_ELEMENT' })
      }
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_FOCUS_MODE' })
      }
      if (e.key === 'm' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_MARKERS' })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dispatch])

  return (
    <div className="flex-1 overflow-auto bg-gray-100 relative">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['desktop', 'tablet', 'mobile'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', mode })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                state.viewMode === mode
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {mode === 'desktop' && 'Desktop'}
              {mode === 'tablet' && 'Tablet'}
              {mode === 'mobile' && 'Mobile'}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'SET_ZOOM', zoom: state.zoom - 0.1 })}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
          >
            −
          </button>
          <span className="text-xs font-medium text-gray-700 w-12 text-center">
            {Math.round(state.zoom * 100)}%
          </span>
          <button
            onClick={() => dispatch({ type: 'SET_ZOOM', zoom: state.zoom + 0.1 })}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
          >
            +
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <button
          onClick={() => dispatch({ type: 'TOGGLE_MARKERS' })}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            state.showMarkers ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Markers
        </button>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_OVERLAY' })}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            state.showOverlay ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Overlay
        </button>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_FOCUS_MODE' })}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            state.focusMode ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Focus
        </button>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={currentPage?.path || '/'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200"
          >
            View Live
          </a>
        </div>
      </div>

      {/* Canvas area */}
      <div className="p-8 flex justify-center min-h-[calc(100vh-120px)]">
        <div
          className="relative shadow-2xl bg-white"
          style={{
            width: width,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            marginBottom: `${width * (scale - 1)}px`,
          }}
        >
          <iframe
            ref={iframeRef}
            src={currentPage?.path || '/'}
            className="w-full border-0"
            style={{ height: '900px', width: '100%' }}
            sandbox="allow-same-origin allow-scripts"
            title="Page Preview"
          />

          {/* Annotation Overlay Layer */}
          {state.showOverlay && currentPage && (
            <AnnotationOverlayLayer iframeRef={iframeRef} />
          )}
        </div>
      </div>
    </div>
  )
}

function AnnotationOverlayLayer({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement | null> }) {
  const { state, dispatch, currentPage } = useUIStore()
  const [elementPositions, setElementPositions] = useState<Record<string, DOMRect | null>>({})

  useEffect(() => {
    if (!iframeRef.current || !currentPage) return
    const iframe = iframeRef.current

    function updatePositions() {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return
        const positions: Record<string, DOMRect | null> = {}
        currentPage.elements.forEach((el) => {
          const target = doc.querySelector(el.selector)
          if (target) {
            positions[el.id] = target.getBoundingClientRect()
          }
        })
        setElementPositions(positions)
      } catch {
        // cross-origin
      }
    }

    iframe.onload = updatePositions
    const interval = setInterval(updatePositions, 1000)
    updatePositions()

    return () => clearInterval(interval)
  }, [currentPage, iframeRef, state.selectedPageId])

  if (!currentPage) return null

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {currentPage.elements.map((el, idx) => {
        const pos = elementPositions[el.id]
        if (!pos) return null

        const isSelected = state.selectedElementId === el.id
        const isHovered = state.hoveredElementId === el.id
        const isDimmed =
          state.focusMode && state.selectedElementId && state.selectedElementId !== el.id

        if (isDimmed) return null

        return (
          <div
            key={el.id}
            className="absolute pointer-events-auto cursor-pointer transition-all duration-200"
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
            }}
            onClick={() => dispatch({ type: 'SELECT_ELEMENT', elementId: el.id })}
            onMouseEnter={() => dispatch({ type: 'HOVER_ELEMENT', elementId: el.id })}
            onMouseLeave={() => dispatch({ type: 'HOVER_ELEMENT', elementId: null })}
          >
            {/* Outline */}
            <div
              className={`absolute inset-0 border-2 rounded-sm transition-colors ${
                isSelected
                  ? 'border-red-500 bg-red-500/10'
                  : isHovered
                    ? 'border-red-400 bg-red-400/5'
                    : 'border-transparent'
              }`}
            />

            {/* Marker number */}
            {state.showMarkers && (
              <div
                className={`absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-transform ${
                  isSelected ? 'bg-red-600 scale-110' : 'bg-gray-700 hover:bg-red-500'
                }`}
              >
                {idx + 1}
              </div>
            )}

            {/* Label on hover */}
            {(isHovered || isSelected) && (
              <div className="absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30 shadow-lg">
                {el.name}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
