import Link from 'next/link'
import AuthForm from '@/components/auth/auth-form'
import { Zap, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden p-4">
      
      {/* --- ARKA PLAN DESENİ --- */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* --- ANA SAYFAYA DÖN BUTONU --- */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Ana Sayfa</span>
      </Link>

      {/* --- ANA KAPLAYICI (Genişlik: max-w-4xl yapıldı) --- */}
      <div className="w-full max-w-4xl z-10 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        
        {/* Üst Başlık Alanı */}
        <div className="text-center mb-8">
           <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
             <Zap size={28} fill="currentColor" className="text-yellow-400" />
           </div>

          <h2 className="text-3xl font-black tracking-tight text-[#1a1a1a]">
            Tekrar Hoş Geldin
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Otomasyon paneline erişmek için giriş yap.
          </p>
        </div>

        {/* FORM ALANI */}
        <div className="w-full flex justify-center">
            <AuthForm />
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-medium">
                Giriş yaparak <Link href="/kullanim-sartlari" className="underline hover:text-black">Kullanım Şartları</Link>'nı kabul etmiş olursunuz.
            </p>
        </div>
        
      </div>
      
    </div>
  )
}