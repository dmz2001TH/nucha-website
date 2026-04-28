'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Booking {
  id: number;
  service: string;
  booking_date: string;
  booking_time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: string;
  created_at: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bookings' | 'projects' | 'users' | 'analytics'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.user || data.user.role !== 'admin') {
        router.push('/login');
      }
    } catch {
      router.push('/login');
    }
  };

  const fetchData = async () => {
    try {
      const [bookingsRes, projectsRes, usersRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/projects'),
        fetch('/api/users'),
      ]);
      
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your business</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: '📅' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: '⏳' },
            { label: 'Projects', value: projects.length, icon: '🏗️' },
            { label: 'Users', value: users.length, icon: '👥' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm">
          {(['bookings', 'projects', 'users', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab
                  ? 'bg-primary-red text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">#{booking.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.service}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{booking.name}</div>
                        <div className="text-xs text-gray-500">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.booking_date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.booking_time}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'approved')}
                            className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'rejected')}
                            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="text-center py-12 text-gray-500">No bookings yet</div>
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                <button className="btn-primary text-sm px-4 py-2">+ Add Project</button>
              </div>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                    <div>
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-500">{project.location} • {project.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        project.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </span>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">#{user.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-primary-red text-white' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-100 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Bookings by Service</h3>
                  <div className="space-y-3">
                    {['Construction', 'Built-in Furniture', 'Decoration', 'Design & Graphics'].map((service) => {
                      const count = bookings.filter(b => b.service === service).length;
                      return (
                        <div key={service} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-32">{service}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-4">
                            <div
                              className="bg-primary-red h-4 rounded-full"
                              style={{ width: `${bookings.length ? (count / bookings.length) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Booking Status</h3>
                  <div className="space-y-3">
                    {['pending', 'approved', 'rejected'].map((status) => {
                      const count = bookings.filter(b => b.status === status).length;
                      const colors = {
                        pending: 'bg-yellow-500',
                        approved: 'bg-green-500',
                        rejected: 'bg-red-500',
                      };
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-20 capitalize">{status}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-4">
                            <div
                              className={`${colors[status as keyof typeof colors]} h-4 rounded-full`}
                              style={{ width: `${bookings.length ? (count / bookings.length) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
