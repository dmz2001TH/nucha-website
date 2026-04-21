'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const timeSlots = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00'
]

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]
  const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateSelect = (date: Date) => {
    if (date < today) return
    if (date.getDay() === 0) return // วันอาทิตย์
    setSelectedDate(date)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: selectedDate.toISOString(),
          timeSlot: selectedTime
        })
      })

      if (res.ok) {
        setSubmitStatus('success')
        setStep(4)
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
      <Navigation currentPage="booking" />
      <main className="pt-20 sm:pt-24 md:pt-32 min-h-screen">
        <section className="px-5 sm:px-8 md:px-12 mb-8 sm:mb-12">
          <div className="max-w-[1400px] mx-auto">
            <span className="text-primary text-[0.6rem] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mb-3 sm:mb-4 block font-headline">
              นัดหมาย
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter text-gray-900 font-headline mb-4 sm:mb-6">
              จองคิวปรึกษา
            </h1>
            <p className="max-w-2xl text-gray-600 font-body text-base sm:text-lg leading-relaxed">
              เลือกวันและเวลาที่สะดวก เพื่อนัดปรึกษากับทีมผู้เชี่ยวชาญของเรา
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="px-5 sm:px-8 md:px-12 mb-8 sm:mb-12">
          <div className="max-w-[800px] mx-auto">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: 'เลือกวัน' },
                { num: 2, label: 'เลือกเวลา' },
                { num: 3, label: 'กรอกข้อมูล' },
                { num: 4, label: 'เสร็จสิ้น' }
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-headline font-bold text-sm sm:text-base ${
                    step >= s.num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? (
                      <span className="material-symbols-outlined text-lg">check</span>
                    ) : s.num}
                  </div>
                  <span className={`hidden sm:block ml-2 text-xs sm:text-sm font-headline font-bold ${
                    step >= s.num ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                  {i < 3 && (
                    <div className={`w-8 sm:w-16 md:w-24 h-0.5 mx-2 sm:mx-4 ${
                      step > s.num ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 md:px-12 pb-16 sm:pb-24">
          <div className="max-w-[800px] mx-auto">
            {/* Step 1: เลือกวัน */}
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 editorial-shadow">
                <h2 className="text-xl sm:text-2xl font-headline font-black text-gray-900 mb-6">
                  เลือกวันที่ต้องการนัด
                </h2>

                {/* Calendar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <h3 className="text-lg font-headline font-bold text-gray-900">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear() + 543}
                    </h3>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {dayNames.map(day => (
                      <div key={day} className="text-center text-xs text-gray-500 font-headline font-bold py-2">
                        {day}
                      </div>
                    ))}
                    {days.map((date, index) => {
                      if (!date) return <div key={`empty-${index}`} />
                      const isPast = date < today
                      const isSunday = date.getDay() === 0
                      const isSelected = selectedDate?.toDateString() === date.toDateString()
                      const isDisabled = isPast || isSunday

                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => handleDateSelect(date)}
                          disabled={isDisabled}
                          className={`aspect-square rounded-lg text-sm font-bold transition-all ${
                            isSelected
                              ? 'bg-primary text-white'
                              : isDisabled
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-900 hover:bg-primary/10'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-body mb-6">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-1">info</span>
                  ไม่สามารถจองวันอาทิตย์และวันย้อนหลังได้
                </p>

                {selectedDate && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                    <p className="text-sm font-headline font-bold text-gray-900">
                      วันที่เลือก: {selectedDate.toLocaleDateString('th-TH', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => selectedDate && setStep(2)}
                  disabled={!selectedDate}
                  className="w-full bg-primary text-white py-4 font-headline font-bold text-sm rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป
                </button>
              </div>
            )}

            {/* Step 2: เลือกเวลา */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 editorial-shadow">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-gray-500 hover:text-primary text-sm font-headline mb-6"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  กลับ
                </button>

                <h2 className="text-xl sm:text-2xl font-headline font-black text-gray-900 mb-2">
                  เลือกเวลา
                </h2>
                <p className="text-gray-500 font-body text-sm mb-6">
                  {selectedDate?.toLocaleDateString('th-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-4 rounded-lg font-headline font-bold text-sm transition-all ${
                        selectedTime === slot
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => selectedTime && setStep(3)}
                  disabled={!selectedTime}
                  className="w-full bg-primary text-white py-4 font-headline font-bold text-sm rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป
                </button>
              </div>
            )}

            {/* Step 3: กรอกข้อมูล */}
            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 editorial-shadow">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-gray-500 hover:text-primary text-sm font-headline mb-6"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  กลับ
                </button>

                <h2 className="text-xl sm:text-2xl font-headline font-black text-gray-900 mb-2">
                  กรอกข้อมูล
                </h2>
                <p className="text-gray-500 font-body text-sm mb-6">
                  {selectedDate?.toLocaleDateString('th-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} เวลา {selectedTime}
                </p>

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
                    <p className="font-headline font-bold">เกิดข้อผิดพลาด กรุณาลองใหม่</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-headline font-bold text-gray-700 mb-2 block">ชื่อ-นามสกุล *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="ชื่อเต็มของคุณ"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-headline font-bold text-gray-700 mb-2 block">อีเมล *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-headline font-bold text-gray-700 mb-2 block">เบอร์โทรศัพท์ *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+66 XX-XXX-XXXX"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-headline font-bold text-gray-700 mb-2 block">หัวข้อที่ต้องการปรึกษา</label>
                    <select
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    >
                      <option value="">เลือกหัวข้อ</option>
                      <option value="รับเหมาก่อสร้าง & บิวท์อิน">รับเหมาก่อสร้าง & บิวท์อิน</option>
                      <option value="โครงการขาย">โครงการขาย</option>
                      <option value="บริหารงานขายโครงการ">บริหารงานขายโครงการ</option>
                      <option value="ออกแบบครบวงจร">ออกแบบครบวงจร</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-headline font-bold text-gray-700 mb-2 block">รายละเอียดเพิ่มเติม</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="รายละเอียดเกี่ยวกับโปรเจกต์ของคุณ..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-4 font-headline font-bold text-sm rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                        กำลังจอง...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">event_available</span>
                        ยืนยันการจอง
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 4: สำเร็จ */}
            {step === 4 && submitStatus === 'success' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 editorial-shadow text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-green-600">check_circle</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-headline font-black text-gray-900 mb-3">
                  จองคิวสำเร็จ!
                </h2>
                <p className="text-gray-600 font-body mb-6">
                  เราได้รับคำขอจองคิวของคุณแล้ว ทีมงานจะติดต่อกลับเพื่อยืนยันนัดหมาย
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">วันที่:</span>
                      <span className="font-bold">{selectedDate?.toLocaleDateString('th-TH', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">เวลา:</span>
                      <span className="font-bold">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ชื่อ:</span>
                      <span className="font-bold">{formData.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/"
                    className="flex-1 bg-primary text-white py-3 font-headline font-bold text-sm rounded-lg hover:bg-primary-dark transition-all"
                  >
                    กลับหน้าแรก
                  </a>
                  <button
                    onClick={() => {
                      setStep(1)
                      setSelectedDate(null)
                      setSelectedTime('')
                      setFormData({ name: '', email: '', phone: '', topic: '', message: '' })
                      setSubmitStatus('idle')
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 font-headline font-bold text-sm rounded-lg hover:border-primary hover:text-primary transition-all"
                  >
                    จองอีกครั้ง
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
