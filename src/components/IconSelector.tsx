'use client'

import { useState } from 'react'

const iconCategories = {
  'ทั่วไป': [
    'home', 'apartment', 'villa', 'house', 'cottage', 'gite',
    'location_city', 'map', 'place', 'navigation', 'explore',
    'business', 'store', 'storefront', 'shopping_cart', 'local_mall',
    'work', 'engineering', 'construction', 'build', 'handyman'
  ],
  'บ้าน': [
    'bed', 'bedroom_parent', 'bathroom', 'shower', 'kitchen',
    'living', 'chair', 'weekend', 'deck', 'balcony',
    'pool', 'hot_tub', 'spa', 'fitness_center', 'sports_tennis',
    'garage', 'door_open', 'door_front', 'window', 'curtains',
    'light', 'lightbulb', 'ceiling', 'stairs', 'elevator'
  ],
  'การออกแบบ': [
    'palette', 'brush', 'format_paint', 'draw', 'design_services',
    'architecture', 'auto_awesome', 'style', 'star', 'diamond',
    'widgets', 'dashboard_customize', 'view_module', 'grid_view', 'view_quilt',
    'crop_square', 'crop_free', 'aspect_ratio', 'straighten', 'rotate_90_degrees_ccw'
  ],
  'ธรรมชาติ': [
    'eco', 'park', 'forest', 'grass', 'local_florist',
    'wb_sunny', 'wb_cloudy', 'water_drop', 'air', 'waves',
    'landscape', 'nature', 'nights_stay', 'thermostat', 'ac_unit',
    'spa', 'self_improvement', 'psychiatry', 'favorite', 'favorite_border'
  ],
  'สถานะ': [
    'check_circle', 'cancel', 'error', 'warning', 'info',
    'help', 'question_mark', 'priority_high', 'new_releases', 'verified',
    'thumb_up', 'thumb_down', 'sentiment_satisfied', 'sentiment_dissatisfied', 'mood'
  ],
  'การสื่อสาร': [
    'mail', 'email', 'phone', 'call', 'chat',
    'forum', 'message', 'sms', 'contact_mail', 'contact_phone',
    'share', 'send', 'reply', 'forward', 'link'
  ],
  'การจัดการ': [
    'add', 'remove', 'edit', 'delete', 'save',
    'upload', 'download', 'file_copy', 'folder', 'inventory_2',
    'settings', 'tune', 'filter_list', 'sort', 'search',
    'visibility', 'visibility_off', 'lock', 'lock_open', 'key'
  ]
}

interface IconSelectorProps {
  value: string
  onChange: (icon: string) => void
}

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('ทั่วไป')

  const allIcons = Object.values(iconCategories).flat()
  const filteredIcons = search
    ? allIcons.filter(icon => icon.toLowerCase().includes(search.toLowerCase()))
    : iconCategories[activeCategory as keyof typeof iconCategories] || []

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer flex items-center gap-3 hover:border-primary transition-colors"
      >
        {value ? (
          <>
            <span className="material-symbols-outlined text-2xl text-primary">{value}</span>
            <span className="text-gray-700 font-body">{value}</span>
          </>
        ) : (
          <span className="text-gray-400">เลือกไอคอน...</span>
        )}
        <span className="material-symbols-outlined ml-auto text-gray-400">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[400px] overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาไอคอน..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Category Tabs */}
          {!search && (
            <div className="flex flex-wrap gap-1 p-3 border-b border-gray-100">
              {Object.keys(iconCategories).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Icons Grid */}
          <div className="p-3 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1 max-h-[250px] overflow-y-auto">
            {filteredIcons.map((icon) => (
              <button
                key={icon}
                onClick={() => {
                  onChange(icon)
                  setIsOpen(false)
                  setSearch('')
                }}
                title={icon}
                className={`p-2 rounded-lg flex items-center justify-center transition-all hover:bg-primary/10 ${
                  value === icon ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{icon}</span>
              </button>
            ))}
          </div>

          {filteredIcons.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
              <p className="text-sm">ไม่พบไอคอนที่ค้นหา</p>
            </div>
          )}

          {/* Selected & Close */}
          <div className="p-3 border-t border-gray-100 flex items-center justify-between">
            {value && (
              <button
                onClick={() => onChange('')}
                className="text-xs text-red-500 hover:text-red-700 font-bold"
              >
                ล้างไอคอน
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-700 font-bold ml-auto"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
