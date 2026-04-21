'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/Toast'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
  isActive: boolean
  lastLogin: string | null
  createdAt: string
}

const roleLabels: Record<string, string> = {
  ADMIN: 'ผู้ดูแลระบบ',
  EDITOR: 'บรรณาธิการ',
  VIEWER: 'ผู้ชม'
}

const roleColors: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  EDITOR: 'bg-blue-100 text-blue-700',
  VIEWER: 'bg-gray-100 text-gray-600'
}

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const toast = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [changePasswordUser, setChangePasswordUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)

  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'VIEWER' as User['role'] })
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'VIEWER' as User['role'], isActive: true })
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data.data || [])
    } catch {
      toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้ได้')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (createForm.password.length < 6) { toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'ไม่สามารถสร้างผู้ใช้ได้'); return }
      toast.success('สร้างผู้ใช้สำเร็จ')
      setShowCreateModal(false)
      setCreateForm({ name: '', email: '', password: '', role: 'VIEWER' })
      fetchUsers()
    } catch {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUser) return
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${editUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'ไม่สามารถอัปเดตได้'); return }
      toast.success('อัปเดตผู้ใช้สำเร็จ')
      setEditUser(null)
      fetchUsers()
    } catch {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!changePasswordUser) return
    if (passwordForm.password !== passwordForm.confirm) { toast.error('รหัสผ่านไม่ตรงกัน'); return }
    if (passwordForm.password.length < 6) { toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${changePasswordUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordForm.password })
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้'); return }
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ')
      setChangePasswordUser(null)
      setPasswordForm({ password: '', confirm: '' })
    } catch {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (user: User) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive })
      })
      if (!res.ok) { toast.error('ไม่สามารถอัปเดตสถานะได้'); return }
      toast.success(user.isActive ? 'ปิดใช้งานบัญชีแล้ว' : 'เปิดใช้งานบัญชีแล้ว')
      fetchUsers()
    } catch {
      toast.error('เกิดข้อผิดพลาด')
    }
  }

  const handleDelete = async () => {
    if (!deleteUser) return
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${deleteUser.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'ไม่สามารถลบผู้ใช้ได้'); return }
      toast.success('ลบผู้ใช้สำเร็จ')
      setDeleteUser(null)
      fetchUsers()
    } catch {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (user: User) => {
    setEditUser(user)
    setEditForm({ name: user.name, email: user.email, role: user.role, isActive: user.isActive })
  }

  const isAdmin = session?.user?.role === 'ADMIN'

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">lock</span>
        <h2 className="text-xl font-headline font-bold text-gray-500">ไม่มีสิทธิ์เข้าถึง</h2>
        <p className="text-gray-400 mt-2">เฉพาะ Admin เท่านั้นที่สามารถจัดการผู้ใช้ได้</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline font-black text-gray-900">ผู้ใช้งาน</h1>
          <p className="text-gray-500 font-body mt-1">จัดการบัญชีและสิทธิ์ผู้ใช้งาน</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-white px-6 py-3 font-headline font-bold text-sm rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
        >
          <span className="material-symbols-outlined">person_add</span>
          เพิ่มผู้ใช้
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">ผู้ใช้</th>
                  <th className="text-left px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">บทบาท</th>
                  <th className="text-left px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="text-left px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">เข้าสู่ระบบล่าสุด</th>
                  <th className="text-right px-6 py-4 text-xs font-headline font-bold text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-xl">person</span>
                        </div>
                        <div>
                          <p className="font-headline font-bold text-gray-900 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        {session?.user?.id === user.id && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-headline font-bold">คุณ</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-headline font-bold px-3 py-1 rounded-full ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => session?.user?.id !== user.id && handleToggleActive(user)}
                        disabled={session?.user?.id === user.id}
                        className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className={`w-4 h-4 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={`text-xs font-headline font-bold ${user.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {user.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : 'ยังไม่เคยเข้าสู่ระบบ'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          title="แก้ไขข้อมูล"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          onClick={() => { setChangePasswordUser(user); setPasswordForm({ password: '', confirm: '' }) }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="เปลี่ยนรหัสผ่าน"
                        >
                          <span className="material-symbols-outlined text-[20px]">key</span>
                        </button>
                        {session?.user?.id !== user.id && (
                          <button
                            onClick={() => setDeleteUser(user)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="ลบผู้ใช้"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-headline font-bold text-gray-900">เพิ่มผู้ใช้ใหม่</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-headline font-bold text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                <input type="text" required value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="ชื่อผู้ใช้" />
              </div>
              <div>
                <label className="block text-sm font-headline font-bold text-gray-700 mb-1">อีเมล</label>
                <input type="email" required value={createForm.email} onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-headline font-bold text-gray-700 mb-1">รหัสผ่าน</label>
                <input type="password" required minLength={6} value={createForm.password} onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="อย่างน้อย 6 ตัวอักษร" />
              </div>
              <div>
                <label className="block text-sm font-headline font-bold text-gray-700 mb-1">บทบาท</label>
                <select value={createForm.role} onChange={e => setCreateForm(p => ({ ...p, role: e.target.value as User['role'] }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="VIEWER">ผู้ชม (VIEWER)</option>
                  <option value="EDITOR">บรรณาธิการ (EDITOR)</option>
                  <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-headline font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all">
                  ยกเลิก
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-headline font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  สร้างบัญชี
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-headline font-bold text-gray-900">แก้ไขข้อมูลผู้ใช้</h2>
              <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-headline font-bold text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                <input type="text" required value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-headline font-bold text-gray-700 mb-1">อีเมล</label>
                <input type="email" required value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-headline font-bold text-gray-700 mb-1">บทบาท</label>
                <select value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value as User['role'] }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={session?.user?.id === editUser.id}>
                  <option value="VIEWER">ผู้ชม (VIEWER)</option>
                  <option value="EDITOR">บรรณาธิการ (EDITOR)</option>
                  <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
                </select>
                {session?.user?.id === editUser.id && (
                  <p className="text-xs text-gray-400 mt-1">ไม่สามารถเปลี่ยนบทบาทของตัวเองได้</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={editForm.isActive}
                      onChange={e => setEditForm(p => ({ ...p, isActive: e.target.checked }))}
                      disabled={session?.user?.id === editUser.id}
                      className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-disabled:opacity-50"></div>
                  </div>
                  <span className="text-sm font-headline font-bold text-gray-700">เปิดใช้งานบัญชี</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditUser(null)}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-headline font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all">
                  ยกเลิก
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-headline font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-headline font-bold text-gray-900">เปลี่ยนรหัสผ่าน</h2>
                <p className="text-sm text-gray-500">{changePasswordUser.name}</p>
              </div>
              <button onClick={() => setChangePasswordUser(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-headline font-bold text-gray-700 mb-1">รหัสผ่านใหม่</label>
                <input type="password" required minLength={6} value={passwordForm.password}
                  onChange={e => setPasswordForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="อย่างน้อย 6 ตัวอักษร" />
              </div>
              <div>
                <label className="block text-sm font-headline font-bold text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
                <input type="password" required minLength={6} value={passwordForm.confirm}
                  onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="กรอกรหัสผ่านอีกครั้ง" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setChangePasswordUser(null)}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-headline font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all">
                  ยกเลิก
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-headline font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  เปลี่ยนรหัสผ่าน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-red-500">person_remove</span>
              </div>
              <div>
                <h2 className="text-lg font-headline font-bold text-gray-900">ยืนยันการลบ</h2>
                <p className="text-sm text-gray-500 mt-1">ลบบัญชี <strong>{deleteUser.name}</strong> ({deleteUser.email})?</p>
                <p className="text-xs text-red-500 mt-2">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteUser(null)}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-headline font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all">
                  ยกเลิก
                </button>
                <button onClick={handleDelete} disabled={saving}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-headline font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  ลบบัญชี
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
