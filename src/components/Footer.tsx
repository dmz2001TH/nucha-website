'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">NUCHA</h3>
                <p className="text-xs text-gray-500">INNOVATION</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Transforming spaces with innovation and excellence. Your vision, our expertise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['About', 'Services', 'Portfolio', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-gray-500 hover:text-primary-red transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
            <ul className="space-y-3">
              {['Construction', 'Built-in Furniture', 'Decoration', 'Design & Graphics'].map((item) => (
                <li key={item}>
                  <Link
                    href="/services"
                    className="text-gray-500 hover:text-primary-red transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-start gap-2">
                <span className="text-primary-red">📍</span>
                123 Innovation Street, Bangkok, Thailand
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-red">📞</span>
                +66 2 123 4567
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-red">✉️</span>
                info@nuchainnovation.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Nucha Innovation Co., Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-400 hover:text-primary-red text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-primary-red text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
