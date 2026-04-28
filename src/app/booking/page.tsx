'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  'Construction',
  'Built-in Furniture',
  'Decoration',
  'Design & Graphics',
];

const timeSlots = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00',
];

function BookingContent() {
  const searchParams = useSearchParams();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: searchParams.get('service') || '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.booking-hero', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.service !== '';
      case 2: return formData.date !== '';
      case 3: return formData.time !== '';
      case 4: return formData.name && formData.email;
      default: return false;
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-8xl mb-8">✅</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-gray-500 text-lg mb-8">
            Thank you for your booking. We will send a confirmation email shortly.
          </p>
          <div className="bg-light-red/30 rounded-2xl p-8 text-left">
            <h3 className="font-bold text-gray-900 mb-4">Booking Details</h3>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">Service:</span> {formData.service}</p>
              <p><span className="font-medium">Date:</span> {formData.date}</p>
              <p><span className="font-medium">Time:</span> {formData.time}</p>
              <p><span className="font-medium">Name:</span> {formData.name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section ref={heroRef} className="pt-32 pb-12 bg-gradient-to-br from-primary-red to-dark-red">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="booking-hero text-5xl md:text-6xl font-bold text-white mb-4">
            Book a Service
          </h1>
          <p className="booking-hero text-white/80 text-lg max-w-2xl mx-auto">
            Schedule your consultation in just a few steps
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-primary-red text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`w-20 h-1 mx-2 ${
                    step > s ? 'bg-primary-red' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-between mb-8 text-xs text-gray-500">
            <span>Service</span>
            <span>Date</span>
            <span>Time</span>
            <span>Info</span>
          </div>

          {/* Step Content */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service}
                      onClick={() => setFormData({ ...formData, service })}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        formData.service === service
                          ? 'border-primary-red bg-light-red'
                          : 'border-gray-200 hover:border-primary-red/30'
                      }`}
                    >
                      <h3 className="font-bold text-gray-900">{service}</h3>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Date</h2>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-red text-lg"
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Time</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setFormData({ ...formData, time })}
                      className={`p-4 rounded-lg border-2 text-center font-medium transition-all ${
                        formData.time === time
                          ? 'border-primary-red bg-light-red text-primary-red'
                          : 'border-gray-200 hover:border-primary-red/30'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-red"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-red resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              Previous
            </button>
            
            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="btn-primary px-8 py-3 disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || status === 'loading'}
                className="btn-primary px-8 py-3 disabled:opacity-50"
              >
                {status === 'loading' ? 'Submitting...' : 'Confirm Booking'}
              </button>
            )}
          </div>

          {status === 'error' && (
            <p className="mt-4 text-red-600 text-center">Something went wrong. Please try again.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default function Booking() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-red border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
