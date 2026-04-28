export type ElementType =
  | 'button'
  | 'heading'
  | 'section'
  | 'image'
  | 'link'
  | 'input'
  | 'card'
  | 'navigation'
  | 'footer'
  | 'hero'
  | 'text'
  | 'icon'
  | 'badge'
  | 'form'
  | 'list'
  | 'other'

export type ElementStatus = 'active' | 'disabled' | 'loading' | 'hidden'

export type ViewMode = 'desktop' | 'tablet' | 'mobile'

export interface ElementUX {
  goal?: string
  kpi?: string
  priority: 1 | 2 | 3 | 4 | 5
}

export interface ElementTechnical {
  cssSelector: string
  htmlSnippet?: string
  dataSource: 'static' | 'api' | 'cms' | 'env'
  responsive: {
    desktop: boolean
    tablet: boolean
    mobile: boolean
  }
  tailwindClasses?: string[]
}

export interface ElementAccessibility {
  ariaLabel?: string
  role?: string
  tabIndex?: number
  keyboardShortcut?: string
  screenReaderText?: string
}

export interface ElementBehavior {
  clickAction?: string
  hoverEffect?: string
  route?: string
  externalUrl?: string
  eventName?: string
}

export interface AnnotatedElement {
  id: string
  selector: string
  name: string
  nameTh?: string
  type: ElementType
  description: string
  descriptionTh?: string
  textContent?: string
  component?: string
  variant?: string
  status: ElementStatus
  ux: ElementUX
  technical: ElementTechnical
  behavior?: ElementBehavior
  accessibility?: ElementAccessibility
  tags?: string[]
  dependencies?: string[]
  notes?: string
}

export interface PageAnnotation {
  pageId: string
  pageName: string
  pageNameTh: string
  path: string
  elements: AnnotatedElement[]
  lastUpdated: string
  version: string
}

export interface InspectorTab {
  id: string
  label: string
  labelTh?: string
}

export const INSPECTOR_TABS: InspectorTab[] = [
  { id: 'details', label: 'Details', labelTh: 'รายละเอียด' },
  { id: 'style', label: 'Style', labelTh: 'สไตล์' },
  { id: 'behavior', label: 'Behavior', labelTh: 'พฤติกรรม' },
  { id: 'accessibility', label: 'Accessibility', labelTh: 'การเข้าถึง' },
]
