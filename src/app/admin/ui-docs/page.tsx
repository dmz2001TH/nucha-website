'use client'

import { UIProvider } from '@/lib/ui-docs/store'
import Sidebar from '@/components/ui-docs/Sidebar'
import PageCanvas from '@/components/ui-docs/PageCanvas'
import ElementInspector from '@/components/ui-docs/ElementInspector'

export default function UIDocsPage() {
  return (
    <UIProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <PageCanvas />
        <ElementInspector />
      </div>
    </UIProvider>
  )
}
