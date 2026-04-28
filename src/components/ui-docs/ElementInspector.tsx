'use client'

import { useUIStore } from '@/lib/ui-docs/store'
import { INSPECTOR_TABS } from '@/lib/ui-docs/types'

function handleExportJSON(currentPage: ReturnType<typeof useUIStore>['currentPage']) {
  if (!currentPage) return
  const data = JSON.stringify(currentPage, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ui-docs-${currentPage.pageId}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleExportMarkdown(currentPage: ReturnType<typeof useUIStore>['currentPage']) {
  if (!currentPage) return
  const lines: string[] = [
    `# UI Docs — ${currentPage.pageName} (${currentPage.pageNameTh})`,
    '',
    `- **Path:** \`${currentPage.path}\``,
    `- **Version:** ${currentPage.version}`,
    `- **Last Updated:** ${currentPage.lastUpdated}`,
    `- **Elements:** ${currentPage.elements.length}`,
    '',
    '---',
    '',
  ]

  currentPage.elements.forEach((el: typeof currentPage.elements[number], idx: number) => {
    lines.push(`## ${idx + 1}. ${el.name} (${el.nameTh || ''})`)
    lines.push('')
    lines.push(`- **Type:** ${el.type}`)
    lines.push(`- **Status:** ${el.status}`)
    lines.push(`- **Selector:** \`${el.selector}\``)
    if (el.component) lines.push(`- **Component:** ${el.component}`)
    if (el.variant) lines.push(`- **Variant:** ${el.variant}`)
    if (el.textContent) lines.push(`- **Text:** "${el.textContent}"`)
    lines.push('')
    lines.push(`> ${el.description}`)
    if (el.descriptionTh) lines.push(`> ${el.descriptionTh}`)
    lines.push('')
    lines.push('**UX:**')
    if (el.ux.goal) lines.push(`- Goal: ${el.ux.goal}`)
    if (el.ux.kpi) lines.push(`- KPI: ${el.ux.kpi}`)
    lines.push(`- Priority: ${el.ux.priority}/5`)
    lines.push('')
    lines.push('**Technical:**')
    lines.push(`- CSS: \`${el.technical.cssSelector}\``)
    lines.push(`- Data Source: ${el.technical.dataSource}`)
    lines.push(`- Responsive: Desktop ${el.technical.responsive.desktop ? '✓' : '✗'} | Tablet ${el.technical.responsive.tablet ? '✓' : '✗'} | Mobile ${el.technical.responsive.mobile ? '✓' : '✗'}`)
    if (el.technical.tailwindClasses?.length) {
      lines.push(`- Tailwind: \`${el.technical.tailwindClasses.join(' ')}\``)
    }
    if (el.behavior) {
      lines.push('')
      lines.push('**Behavior:**')
      if (el.behavior.clickAction) lines.push(`- Click: ${el.behavior.clickAction}`)
      if (el.behavior.route) lines.push(`- Route: \`${el.behavior.route}\``)
      if (el.behavior.eventName) lines.push(`- Event: \`${el.behavior.eventName}\``)
    }
    if (el.accessibility) {
      lines.push('')
      lines.push('**Accessibility:**')
      if (el.accessibility.ariaLabel) lines.push(`- ARIA Label: ${el.accessibility.ariaLabel}`)
      if (el.accessibility.role) lines.push(`- Role: ${el.accessibility.role}`)
    }
    if (el.tags?.length) {
      lines.push('')
      lines.push(`**Tags:** ${el.tags.map((t: string) => `\`${t}\``).join(', ')}`)
    }
    lines.push('')
    lines.push('---')
    lines.push('')
  })

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ui-docs-${currentPage.pageId}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ElementInspector() {
  const { state, dispatch, currentElement, currentPage } = useUIStore()

  if (!state.inspectorOpen) {
    return (
      <button
        onClick={() => dispatch({ type: 'TOGGLE_INSPECTOR' })}
        className="fixed right-4 top-20 z-50 w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition-colors"
        title="Open Inspector"
      >
        <span className="material-symbols-outlined text-[18px]">info</span>
      </button>
    )
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-red-500">layers</span>
            <h2 className="font-semibold text-sm text-gray-900">Inspector</h2>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_INSPECTOR' })}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">visibility_off</span>
          </button>
        </div>
        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportJSON(currentPage)}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
            title="Export as JSON"
          >
            <span className="material-symbols-outlined text-[12px]">data_object</span>
            JSON
          </button>
          <button
            onClick={() => handleExportMarkdown(currentPage)}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
            title="Export as Markdown"
          >
            <span className="material-symbols-outlined text-[12px]">markdown</span>
            Markdown
          </button>
          {currentPage && (
            <span className="ml-auto text-[10px] text-gray-400">{currentPage.elements.length} elements</span>
          )}
        </div>
      </div>

      {!currentElement ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          <div className="text-center">
            <span className="material-symbols-outlined text-[32px] mx-auto mb-2 opacity-50 block">touch_app</span>
            <p>Click an element on the page<br />to inspect its details</p>
            <p className="text-xs mt-2 opacity-60">Use ← → arrow keys to navigate</p>
          </div>
        </div>
      ) : (
        <>
          {/* Element Header */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded-md">
                    {currentElement.type}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                      currentElement.status === 'active'
                        ? 'bg-green-50 text-green-600'
                        : currentElement.status === 'disabled'
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-yellow-50 text-yellow-600'
                    }`}
                  >
                    {currentElement.status}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{currentElement.name}</h3>
                {currentElement.nameTh && (
                  <p className="text-sm text-gray-500">{currentElement.nameTh}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <PriorityStars priority={currentElement.ux.priority} />
              </div>
            </div>

            {currentElement.description && (
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{currentElement.description}</p>
            )}
            {currentElement.descriptionTh && (
              <p className="mt-1 text-sm text-gray-400 leading-relaxed">{currentElement.descriptionTh}</p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {INSPECTOR_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_INSPECTOR_TAB', tab: tab.id })}
                className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                  state.inspectorTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {state.inspectorTab === 'details' && <DetailsTab element={currentElement} />}
            {state.inspectorTab === 'style' && <StyleTab element={currentElement} />}
            {state.inspectorTab === 'behavior' && <BehaviorTab element={currentElement} />}
            {state.inspectorTab === 'accessibility' && <AccessibilityTab element={currentElement} />}
          </div>

          {/* Footer navigation */}
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <button
              onClick={() => dispatch({ type: 'PREV_ELEMENT' })}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Prev
            </button>
            <span className="text-xs text-gray-400 font-mono">{currentElement.id}</span>
            <button
              onClick={() => dispatch({ type: 'NEXT_ELEMENT' })}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function PriorityStars({ priority }: { priority: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-[14px] ${
            i < priority ? 'text-yellow-400' : 'text-gray-200'
          }`}
        >
          {i < priority ? 'star' : 'star_outline'}
        </span>
      ))}
    </div>
  )
}

function DetailsTab({ element }: { element: ReturnType<typeof useUIStore>['currentElement'] }) {
  if (!element) return null

  return (
    <div className="p-4 space-y-4">
      {/* Component */}
      {element.component && (
        <InfoRow icon={<span className="material-symbols-outlined text-[14px]">inventory_2</span>} label="Component" value={element.component} />
      )}

      {/* Variant */}
      {element.variant && (
        <InfoRow icon={<span className="material-symbols-outlined text-[14px]">tag</span>} label="Variant" value={element.variant} />
      )}

      {/* Text Content */}
      {element.textContent && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[14px] text-gray-400">text_fields</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Text Content</span>
          </div>
          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md font-mono">{element.textContent}</p>
        </div>
      )}

      {/* UX Section */}
      <div className="border-t border-gray-100 pt-3">
        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">UX / Business</h4>
        <div className="space-y-2">
          {element.ux.goal && <InfoRow label="Goal" value={element.ux.goal} />}
          {element.ux.kpi && <InfoRow label="KPI" value={element.ux.kpi} />}
          <InfoRow label="Priority" value={`${element.ux.priority}/5`} />
        </div>
      </div>

      {/* Tags */}
      {element.tags && element.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {element.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {element.notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[14px] text-yellow-600">notifications</span>
            <span className="text-xs font-medium text-yellow-700">Notes</span>
          </div>
          <p className="text-sm text-yellow-800">{element.notes}</p>
        </div>
      )}
    </div>
  )
}

function StyleTab({ element }: { element: ReturnType<typeof useUIStore>['currentElement'] }) {
  if (!element) return null

  const tech = element.technical

  return (
    <div className="p-4 space-y-4">
      <InfoRow icon={<span className="material-symbols-outlined text-[14px]">code</span>} label="CSS Selector" value={tech.cssSelector} mono />

      {tech.htmlSnippet && (
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">HTML Snippet</span>
          <pre className="text-xs text-gray-700 bg-gray-50 p-2 rounded-md overflow-x-auto font-mono">{tech.htmlSnippet}</pre>
        </div>
      )}

      <InfoRow label="Data Source" value={tech.dataSource} />

      {/* Responsive */}
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Responsive</span>
        <div className="flex gap-3">
          <ResponsiveBadge active={tech.responsive.desktop} label="Desktop" />
          <ResponsiveBadge active={tech.responsive.tablet} label="Tablet" />
          <ResponsiveBadge active={tech.responsive.mobile} label="Mobile" />
        </div>
      </div>

      {/* Tailwind classes */}
      {tech.tailwindClasses && tech.tailwindClasses.length > 0 && (
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Tailwind Classes</span>
          <div className="flex flex-wrap gap-1">
            {tech.tailwindClasses.map((cls) => (
              <span key={cls} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-mono border border-blue-100">
                {cls}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dependencies */}
      {element.dependencies && element.dependencies.length > 0 && (
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Dependencies</span>
          <div className="flex flex-wrap gap-1">
            {element.dependencies.map((dep) => (
              <span key={dep} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-md">
                {dep}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BehaviorTab({ element }: { element: ReturnType<typeof useUIStore>['currentElement'] }) {
  if (!element || !element.behavior) return (
    <div className="p-8 text-center text-gray-400 text-sm">No behavior data for this element</div>
  )

  const b = element.behavior

  return (
    <div className="p-4 space-y-4">
      {b.clickAction && <InfoRow icon={<span className="material-symbols-outlined text-[14px]">touch_app</span>} label="Click Action" value={b.clickAction} />}
      {b.route && (
        <div>
          <InfoRow icon={<span className="material-symbols-outlined text-[14px]">open_in_new</span>} label="Route" value={b.route} mono />
          <a
            href={b.route}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
          >
            Open page <span className="material-symbols-outlined text-[12px]">open_in_new</span>
          </a>
        </div>
      )}
      {b.externalUrl && <InfoRow icon={<span className="material-symbols-outlined text-[14px]">open_in_new</span>} label="External URL" value={b.externalUrl} mono />}
      {b.hoverEffect && <InfoRow icon={<span className="material-symbols-outlined text-[14px]">visibility</span>} label="Hover Effect" value={b.hoverEffect} />}
      {b.eventName && <InfoRow icon={<span className="material-symbols-outlined text-[14px]">notifications</span>} label="Event Name" value={b.eventName} mono />}
    </div>
  )
}

function AccessibilityTab({ element }: { element: ReturnType<typeof useUIStore>['currentElement'] }) {
  if (!element || !element.accessibility) return (
    <div className="p-8 text-center text-gray-400 text-sm">No accessibility data for this element</div>
  )

  const a = element.accessibility

  return (
    <div className="p-4 space-y-4">
      {a.ariaLabel && <InfoRow icon={<span className="material-symbols-outlined text-[14px]">info</span>} label="ARIA Label" value={a.ariaLabel} />}
      {a.role && <InfoRow icon={<span className="material-symbols-outlined text-[14px]">inventory_2</span>} label="Role" value={a.role} />}
      {a.tabIndex !== undefined && <InfoRow label="Tab Index" value={String(a.tabIndex)} />}
      {a.keyboardShortcut && <InfoRow icon={<span className="material-symbols-outlined text-[14px]">keyboard</span>} label="Keyboard Shortcut" value={a.keyboardShortcut} />}
      {a.screenReaderText && (
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Screen Reader Text</span>
          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">{a.screenReaderText}</p>
        </div>
      )}
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon?: React.ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-sm text-gray-900 bg-gray-50 p-2 rounded-md ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}

function ResponsiveBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-md font-medium ${
        active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
      }`}
    >
      {active ? '✓' : '✗'} {label}
    </span>
  )
}
