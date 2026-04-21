'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import InteractiveMap from '@/components/InteractiveMap'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'RESIDENTIAL_DESIGN',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', interest: 'RESIDENTIAL_DESIGN', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <>
      <Navigation currentPage="contact" />
      <main className="pt-20 sm:pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="px-5 sm:px-8 md:px-12 mb-12 sm:mb-16">
          <div className="max-w-[1400px] mx-auto">
            <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline">
              ติดต่อเรา
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter text-gray-900 font-headline mb-4 sm:mb-6">
              ติดต่อเรา
            </h1>
            <p className="max-w-2xl text-gray-600 font-body text-base sm:text-lg leading-relaxed">
              ติดต่อเราเพื่อรับคำปรึกษาฟรี ทีมงานของเราพร้อมให้บริการและตอบทุกคำถาม
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="px-5 sm:px-8 md:px-12 pb-16 sm:pb-24">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
              {/* Contact Form */}
              <div className="bg-gray-50 p-6 sm:p-8 md:p-12 rounded-2xl border-t-4 border-primary shadow-2xl">
                <h2 className="text-2xl sm:text-3xl font-headline font-black text-gray-900 mb-6 sm:mb-8">
                  ส่งข้อความถึงเรา
                </h2>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[20px] mt-0.5">check_circle</span>
                    <div>
                      <span className="font-headline font-bold block">ส่งข้อความสำเร็จ!</span>
                      <p className="text-sm mt-1">ทีมงานจะติดต่อกลับโดยเร็วที่สุด</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[20px] mt-0.5">error</span>
                    <div>
                      <span className="font-headline font-bold block">ส่งข้อความไม่สำเร็จ</span>
                      <p className="text-sm mt-1">กรุณาลองใหม่อีกครั้ง</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="text-[0.65rem] tracking-widest text-primary font-bold uppercase font-headline">
                      ชื่อ-นามสกุล *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="ชื่อเต็มของคุณ"
                      className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-primary focus:ring-0 text-gray-900 placeholder:text-gray-400 transition-all py-3 text-sm sm:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-[0.65rem] tracking-widest text-primary font-bold uppercase font-headline">
                        อีเมล *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-primary focus:ring-0 text-gray-900 placeholder:text-gray-400 transition-all py-3 text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.65rem] tracking-widest text-primary font-bold uppercase font-headline">
                        เบอร์โทรศัพท์
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+66 XX-XXX-XXXX"
                        className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-primary focus:ring-0 text-gray-900 placeholder:text-gray-400 transition-all py-3 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.65rem] tracking-widest text-primary font-bold uppercase font-headline">
                      ความสนใจ *
                    </label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-primary focus:ring-0 text-gray-900 transition-all py-3 text-sm sm:text-base"
                    >
                      <option value="RESIDENTIAL_DESIGN">ออกแบบบ้านพักอาศัย</option>
                      <option value="COMMERCIAL_PROJECT">โครงการพาณิชย์</option>
                      <option value="INTERIOR_CONSULTATION">ปรึกษาออกแบบภายใน</option>
                      <option value="VILLA_PURCHASE">ซื้อวิลล่า</option>
                      <option value="GENERAL_INQUIRY">สอบถามทั่วไป</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.65rem] tracking-widest text-primary font-bold uppercase font-headline">
                      ข้อความ
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="เล่าโปรเจกต์ของคุณให้เราฟัง..."
                      className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-primary focus:ring-0 text-gray-900 placeholder:text-gray-400 transition-all py-3 resize-none text-sm sm:text-base"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white font-headline font-bold py-3.5 sm:py-4 uppercase tracking-[0.2em] rounded-lg hover:bg-primary-dark transition-all shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                        กำลังส่ง...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        ส่งข้อความ
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-headline font-black text-gray-900 mb-6 sm:mb-8">
                  ข้อมูลติดต่อ
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  {[
                    {
                      icon: 'location_on',
                      title: 'สำนักงานพัทยา',
                      content: '123 ถนนพัทยาสาย 3\nตำบลหนองปรือ อำเภอบางละมุง\nชลบุรี 20150 ประเทศไทย',
                      sub: null
                    },
                    {
                      icon: 'call',
                      title: 'โทรศัพท์',
                      content: '+66 (0) 81-234-5678',
                      sub: 'จันทร์ - ศุกร์: 9:00 - 18:00 น.'
                    },
                    {
                      icon: 'mail',
                      title: 'อีเมล',
                      content: 'concierge@nucha-innovation.com',
                      sub: 'เราจะตอบกลับภายใน 24 ชั่วโมง'
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-5 sm:p-6 rounded-xl editorial-shadow hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-primary text-[20px] sm:text-[24px]">{item.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-headline font-bold text-gray-900 mb-1.5 sm:mb-2">{item.title}</h3>
                          <p className="text-gray-600 font-body text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                            {item.content}
                          </p>
                          {item.sub && (
                            <p className="text-gray-500 font-body text-[0.65rem] sm:text-xs mt-1">{item.sub}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Social */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl editorial-shadow hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-[20px] sm:text-[24px]">share</span>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-headline font-bold text-gray-900 mb-3">โซเชียลมีเดีย</h3>
                        <div className="flex gap-2 sm:gap-3">
                          {[
                            'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                            'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                            'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
                          ].map((path, i) => (
                            <a
                              key={i}
                              href="#"
                              className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all"
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d={path} />
                              </svg>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-6 sm:mt-8 rounded-xl overflow-hidden h-[200px] sm:h-[300px]">
                  <InteractiveMap 
                    locations={[
                      { id: '1', name: 'NUCHA INNOVATION VILL PATTAYA', lat: 12.9276, lng: 100.8772, type: 'portfolio', location: 'พัทยา ชลบุรี ประเทศไทย', link: '#' }
                    ]}
                    center={{ lat: 12.9276, lng: 100.8772 }}
                    zoom={13}
                    height="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
