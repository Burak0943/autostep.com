import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    // bg-white: Arka plan beyaz
    // text-gray-900: Yazılar koyu (görünür)
    <footer className="bg-white border-t border-gray-200 py-12 z-50 relative">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
           <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
             <Zap size={16} fill="currentColor" className="text-yellow-400" />
           </div>
           <span className="font-black text-xl tracking-tight text-black">AutoStep</span>
        </Link>

        {/* LİNKLER (Siyah ve Görünür) */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-gray-600">
          <Link href="/yardim-merkezi" className="hover:text-black hover:underline transition-all">
            Yardım Merkezi
          </Link>
          <Link href="/hizmet-durumu" className="hover:text-black hover:underline transition-all">
            Hizmet Durumu
          </Link>
          <Link href="/gizlilik-politikasi" className="hover:text-black hover:underline transition-all">
            Gizlilik Politikası
          </Link>
          <Link href="/kullanim-sartlari" className="hover:text-black hover:underline transition-all">
            Kullanım Şartları
          </Link>
          <Link href="/iletisim" className="hover:text-black hover:underline transition-all">
            İletişim
          </Link>
        </nav>

        {/* Telif Hakkı */}
        <p className="text-xs text-gray-400 font-medium">
          © 2026 AutoStep Inc.
        </p>

      </div>
    </footer>
  )
}