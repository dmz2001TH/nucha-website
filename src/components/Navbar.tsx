'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check auth
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className={`text-lg font-bold ${scrolled ? 'text-primary-red' : 'text-white'}`}>
                NUCHA
              </h1>
              <p className={`text-xs ${scrolled ? 'text-gray-500' : 'text-white/70'}`}>
                INNOVATION
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-red ${
                  scrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className={`text-sm ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                  {user.name}
                </span>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/booking"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Book Now
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={`text-sm font-medium ${scrolled ? 'text-gray-700' : 'text-white'}`}
                >
                  Login
                </Link>
                <Link href="/booking" className="btn-primary text-sm px-4 py-2">
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <div className="space-y-1.5">
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
                className={`w-6 h-0.5 ${scrolled ? 'bg-gray-800' : 'bg-white'}`}
              />
              <motion.div
                animate={{ opacity: isOpen ? 0 : 1 }}
                className={`w-6 h-0.5 ${scrolled ? 'bg-gray-800' : 'bg-white'}`}
              />
              <motion.div
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
                className={`w-6 h-0.5 ${scrolled ? 'bg-gray-800' : 'bg-white'}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 hover:text-primary-red font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t">
                {user ? (
                  <div className="space-y-3">
                    <p className="text-gray-700">Hello, {user.name}</p>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block btn-primary text-center">
                        Dashboard
                      </Link>
                    )}
                    <Link href="/booking" className="block btn-primary text-center">
                      Book Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" className="block text-gray-700 text-center">
                      Login
                    </Link>
                    <Link href="/booking" className="block btn-primary text-center">
                      Book Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
