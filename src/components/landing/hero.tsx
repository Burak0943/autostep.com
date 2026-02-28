import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-10">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group opacity-100 hover:scale-105 transition-transform">
           <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-xl">
             <Zap size={20} fill="currentColor" className="text-yellow-400" />
           </div>
           <span className="font-black text-2xl tracking-tight text-[#1a1a1a]">AutoStep</span>
        </Link>

        {/* 5 TEMEL LİNK */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-gray-500">
          <Link href="/yardim-merkezi" className="hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg transition-all">
            Yardım Merkezi
          </Link>
          <Link href="/hizmet-durumu" className="hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg transition-all">
            Hizmet Durumu
          </Link>
          <Link href="/gizlilik-politikasi" className="hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg transition-all">
            Gizlilik Politikası
          </Link>
          <Link href="/kullanim-sartlari" className="hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg transition-all">
            Kullanım Şartları
          </Link>
          <Link href="/iletisim" className="hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg transition-all">
            İletişim
          </Link>
        </nav>

        {/* Telif Hakkı */}
        <p className="text-xs text-gray-400 font-medium border-t border-gray-100 pt-8 w-full text-center max-w-md">
          © 2026 AutoStep Inc. Tüm hakları saklıdır.
        </p>

      </div>
    </footer>
  )
}