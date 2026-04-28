'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { AnnotatedElement, ViewMode, PageAnnotation, InspectorTab, INSPECTOR_TABS } from './types'
import { allPageAnnotations, pageList } from './sample-data'

interface UIState {
  selectedPageId: string
  selectedElementId: string | null
  hoveredElementId: string | null
  viewMode: ViewMode
  zoom: number
  inspectorTab: InspectorTab['id']
  showMarkers: boolean
  showOverlay: boolean
  focusMode: boolean
  sidebarOpen: boolean
  inspectorOpen: boolean
  pages: PageAnnotation[]
}

type UIAction =
  | { type: 'SELECT_PAGE'; pageId: string }
  | { type: 'SELECT_ELEMENT'; elementId: string | null }
  | { type: 'HOVER_ELEMENT'; elementId: string | null }
  | { type: 'SET_VIEW_MODE'; mode: ViewMode }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_INSPECTOR_TAB'; tab: InspectorTab['id'] }
  | { type: 'TOGGLE_MARKERS' }
  | { type: 'TOGGLE_OVERLAY' }
  | { type: 'TOGGLE_FOCUS_MODE' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_INSPECTOR' }
  | { type: 'NEXT_ELEMENT' }
  | { type: 'PREV_ELEMENT' }

const initialState: UIState = {
  selectedPageId: 'homepage',
  selectedElementId: null,
  hoveredElementId: null,
  viewMode: 'desktop',
  zoom: 1,
  inspectorTab: 'details',
  showMarkers: true,
  showOverlay: true,
  focusMode: false,
  sidebarOpen: true,
  inspectorOpen: true,
  pages: allPageAnnotations,
}

function uiReducer(state: UIState, action: UIAction): UIState {
  const currentPage = state.pages.find((p) => p.pageId === state.selectedPageId)
  const elements = currentPage?.elements || []

  switch (action.type) {
    case 'SELECT_PAGE':
      return { ...state, selectedPageId: action.pageId, selectedElementId: null, hoveredElementId: null }
    case 'SELECT_ELEMENT':
      return { ...state, selectedElementId: action.elementId }
    case 'HOVER_ELEMENT':
      return { ...state, hoveredElementId: action.elementId }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.mode }
    case 'SET_ZOOM':
      return { ...state, zoom: Math.max(0.25, Math.min(2, action.zoom)) }
    case 'SET_INSPECTOR_TAB':
      return { ...state, inspectorTab: action.tab }
    case 'TOGGLE_MARKERS':
      return { ...state, showMarkers: !state.showMarkers }
    case 'TOGGLE_OVERLAY':
      return { ...state, showOverlay: !state.showOverlay }
    case 'TOGGLE_FOCUS_MODE':
      return { ...state, focusMode: !state.focusMode }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'TOGGLE_INSPECTOR':
      return { ...state, inspectorOpen: !state.inspectorOpen }
    case 'NEXT_ELEMENT': {
      if (!state.selectedElementId) {
        if (elements.length > 0) return { ...state, selectedElementId: elements[0].id }
        return state
      }
      const idx = elements.findIndex((e) => e.id === state.selectedElementId)
      if (idx >= 0 && idx < elements.length - 1) {
        return { ...state, selectedElementId: elements[idx + 1].id }
      }
      return state
    }
    case 'PREV_ELEMENT': {
      if (!state.selectedElementId) {
        if (elements.length > 0) return { ...state, selectedElementId: elements[elements.length - 1].id }
        return state
      }
      const idx = elements.findIndex((e) => e.id === state.selectedElementId)
      if (idx > 0) {
        return { ...state, selectedElementId: elements[idx - 1].id }
      }
      return state
    }
    default:
      return state
  }
}

interface UIContextValue {
  state: UIState
  dispatch: React.Dispatch<UIAction>
  currentPage: PageAnnotation | undefined
  currentElement: AnnotatedElement | undefined
  pageList: typeof pageList
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState)
  const currentPage = state.pages.find((p) => p.pageId === state.selectedPageId)
  const currentElement = currentPage?.elements.find((e) => e.id === state.selectedElementId)

  return (
    <UIContext.Provider value={{ state, dispatch, currentPage, currentElement, pageList }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUIStore() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUIStore must be used within UIProvider')
  return ctx
}
