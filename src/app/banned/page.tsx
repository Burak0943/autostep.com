'use client'

import { Ban, Lock, ShieldAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BannedPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 rounded-full"></div>
        <div className="relative bg-[#18181b] border-2 border-red-600/50 p-8 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.5)]">
           <Ban size={64} className="text-red-600 animate-pulse"/>
        </div>
      </div>

      <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">
        Hesap Askıya Alındı
      </h1>
      <p className="text-gray-400 max-w-md mb-8 text-lg">
        Bu hesaba erişim, yönetim tarafından güvenlik veya ihlal gerekçesiyle süresiz olarak durdurulmuştur.
      </p>

      <div className="bg-[#18181b] border border-red-900/30 p-6 rounded-xl max-w-sm w-full mb-8">
         <div className="flex items-center gap-3 text-red-400 mb-2">
            <ShieldAlert size={20}/>
            <span className="font-bold text-sm uppercase">Erişim Reddedildi</span>
         </div>
         <p className="text-xs text-gray-500 text-left">
            Sistem kayıtlarımızda hesabınızda şüpheli işlem veya kural ihlali tespit edilmiştir. Bu kararın bir hata olduğunu düşünüyorsanız destek ekibiyle iletişime geçin.
         </p>
      </div>

      <button 
        onClick={handleLogout}
        className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2"
      >
        <Lock size={18}/> Güvenli Çıkış Yap
      </button>
    </div>
  )
}