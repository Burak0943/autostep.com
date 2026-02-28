'use client'

import Link from 'next/link'
import { User, Menu, X, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Scroll olayını dinle (Navbar arka planı değişimi için)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm border-gray-200' 
            : 'bg-transparent py-6 border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* 1. LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Zap size={20} fill="currentColor" className="text-yellow-400" />
            </div>
            <span className="font-black text-2xl tracking-tight text-black group-hover:opacity-80 transition-opacity">
              AutoStep
            </span>
          </Link>

          {/* 2. DESKTOP LİNKLER */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-600">
            <Link href="/#automations" className="hover:text-black transition-colors relative group">
              Otomasyonlar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/#pricing" className="hover:text-black transition-colors relative group">
              Fiyatlandırma
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
            {/* Mevcut yapıda contact sayfası yoksa burayı kaldırabilir veya #contact yapabilirsin */}
            <Link href="/contact" className="hover:text-black transition-colors relative group">
              İletişim
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* 3. SAĞ TARAF AKSİYONLAR */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
            >
              <User size={18} />
              <span>Giriş Yap</span>
            </Link>
          </div>

          {/* 4. MOBİL MENÜ BUTONU */}
          <button 
            className="md:hidden p-2 text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* MOBİL MENÜ (OVERLAY) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-in slide-in-from-top-10 duration-200">
          <div className="flex flex-col gap-6 text-xl font-black text-black">
            <Link href="/#automations" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">
              Otomasyonlar
            </Link>
            <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">
              Fiyatlandırma
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">
              İletişim
            </Link>
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="bg-black text-white text-center py-4 rounded-xl mt-4 shadow-xl"
            >
              Giriş Yap / Kayıt Ol
            </Link>
          </div>
        </div>
      )}
    </>
  )
}