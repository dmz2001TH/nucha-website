'use client'

import { useState, useEffect } from 'react'
import ImageUpload from '@/components/ImageUpload'
import { useToast } from '@/components/Toast'

interface Setting {
  id: string
  key: string
  value: string
  type: string
  group: string
  label: string
}

const groupLabels: Record<string, string> = {
  'general': 'ทั่วไป',
  'branding': 'แบรนด์',
  'hero': 'หน้าแรก (Hero)',
  'footer': 'Footer',
  'nav': 'เมนู Navigation',
  'seo': 'SEO',
  'social': 'โซเชียล',
  'contact': 'ติดต่อ',
  'appearance': 'การแสดงผล',
  'notification': 'การแจ้งเตือน',
  'chat': 'แชท',
  'analytics': 'Analytics',
  'philosophy': 'ปรัชญา/หลักการ'
}

const groupIcons: Record<string, string> = {
  'general': 'settings',
  'branding': 'palette',
  'hero': 'home',
  'footer': 'article',
  'nav': 'menu',
  'seo': 'search',
  'social': 'share',
  'contact': 'contact_mail',
  'appearance': 'brush',
  'notification': 'notifications',
  'chat': 'chat',
  'analytics': 'analytics',
  'philosophy': 'lightbulb'
}

export default function AdminSettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeGroup, setActiveGroup] = useState('general')
  const [editedValues, setEditedValues] = useState<Record<string, string>>({})
  const [testingLine, setTestingLine] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = Object.entries(editedValues).map(([key, value]) => ({ key, value }))
      
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updates })
      })

      await fetchSettings()
      setEditedValues({})
      toast.success('บันทึกการตั้งค่าสำเร็จ')
    } catch {
      toast.error('บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [key]: value }))
  }

  const handleTestLine = async () => {
    setTestingLine(true)
    try {
      const response = await fetch('/api/notify', { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('เกิดข้อผิดพลาดในการทดสอบ')
    } finally {
      setTestingLine(false)
    }
  }

  const groups = [...new Set(settings.map(s => s.group))].sort()
  const filteredSettings = settings.filter(s => s.group === activeGroup)

  const getValue = (setting: Setting) => {
    return editedValues[setting.key] !== undefined 
      ? editedValues[setting.key] 
      : setting.value
  }

  const hasChanges = Object.keys(editedValues).length > 0

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
          <h1 className="text-3xl font-headline font-black text-gray-900">ตั้งค่า</h1>
          <p className="text-gray-500 font-body mt-1">ตั้งค่าเว็บไซต์</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="bg-primary text-white px-6 py-3 font-headline font-bold text-sm rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">{saving ? 'progress_activity' : 'save'}</span>
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </div>

      {hasChanges && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-3">
          <span className="material-symbols-outlined">warning</span>
          <span className="text-sm">มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Group Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-headline font-bold text-gray-500 uppercase tracking-wider mb-4">กลุ่มการตั้งค่า</h3>
          <nav className="space-y-1">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                  activeGroup === group
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{groupIcons[group] || 'settings'}</span>
                <span className="font-headline text-sm font-bold">{groupLabels[group] || group}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-headline font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">{groupIcons[activeGroup] || 'settings'}</span>
            {groupLabels[activeGroup] || activeGroup}
          </h2>
          
          <div className="space-y-6">
            {filteredSettings.map((setting) => (
              <div key={setting.id} className="border-b border-gray-100 pb-6 last:border-0">
                <label className="block text-sm font-bold text-gray-700 mb-2 font-headline">
                  {setting.label}
                </label>
                <p className="text-xs text-gray-400 mb-3 font-mono bg-gray-50 px-2 py-1 rounded inline-block">{setting.key}</p>
                
                {setting.type === 'TEXT' && (
                  <input
                    type="text"
                    value={getValue(setting)}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
                
                {setting.type === 'TEXTAREA' && (
                  <textarea
                    value={getValue(setting)}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                )}
                
                {setting.type === 'COLOR' && (
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={getValue(setting)}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={getValue(setting)}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
                
                {setting.type === 'IMAGE' && (
                  <ImageUpload
                    value={getValue(setting)}
                    onChange={(url) => handleChange(setting.key, url)}
                  />
                )}
                
                {setting.type === 'NUMBER' && (
                  <input
                    type="number"
                    value={getValue(setting)}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
                
                {setting.type === 'BOOLEAN' && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={getValue(setting) === 'true'}
                        onChange={(e) => handleChange(setting.key, e.target.checked ? 'true' : 'false')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </div>
                    <span className="text-sm text-gray-600">เปิดใช้งาน</span>
                  </label>
                )}
              </div>
            ))}
            
            {filteredSettings.length === 0 && activeGroup !== 'notification' && (
              <div className="text-center py-8 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2 block">settings</span>
                <p className="font-body">ไม่มีการตั้งค่าในกลุ่มนี้</p>
              </div>
            )}

            {/* LINE Notify Test Section */}
            {activeGroup === 'notification' && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-headline font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#06C755]">chat</span>
                  ทดสอบ LINE Notify
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  หลังจากบันทึก LINE Notify Token แล้ว สามารถทดสอบการแจ้งเตือนได้ที่นี่
                </p>
                <button
                  onClick={handleTestLine}
                  disabled={testingLine}
                  className="inline-flex items-center gap-2 bg-[#06C755] text-white px-6 py-3 font-headline font-bold text-sm rounded-lg hover:bg-[#05B34C] transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">{testingLine ? 'progress_activity' : 'send'}</span>
                  {testingLine ? 'กำลังทดสอบ...' : 'ส่งข้อความทดสอบ'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
