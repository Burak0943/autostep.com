import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Mail, Phone, Shield, CreditCard, Activity, Edit } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()

  // 1. Kullanıcıyı getir
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Profil detaylarını getir
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Tarih formatlamak için yardımcı fonksiyon
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Bilinmiyor'
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // İsimden baş harfleri alma
  const getInitials = (name: string) => {
    if (!name) return user.email?.substring(0, 2).toUpperCase() || '??'
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Üst Başlık */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
          {/* DÜZELTME: Başlık simsiyah */}
          <h1 className="text-3xl font-extrabold tracking-tight text-black">Profilim</h1>
          {/* DÜZELTME: Açıklama daha koyu ve kalın */}
          <p className="text-gray-700 mt-1 font-bold">Hesap durumunuz ve üyelik bilgileriniz.</p>
        </div>
        <Link 
          href="/dashboard/settings" 
          // DÜZELTME: Buton border ve yazı rengi netleştirildi
          className="flex items-center gap-2 bg-white border-2 border-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm shadow-sm"
        >
          <Edit size={16} />
          Profili Düzenle
        </Link>
      </div>

      {/* Ana Grid Yapısı */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 1. KART: Kullanıcı Kimliği */}
        {/* DÜZELTME: Border kalınlaştırıldı (border-2) */}
        <div className="md:col-span-2 bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold shadow-md shrink-0 border-4 border-gray-100">
            {getInitials(profile?.full_name)}
          </div>
          
          <div className="text-center sm:text-left space-y-4 w-full">
            <div>
              <h2 className="text-2xl font-black text-black">
                {profile?.full_name || 'İsimsiz Kullanıcı'}
              </h2>
              {/* DÜZELTME: Badge border belirginleştirildi */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 mt-2 border-2 border-blue-200">
                Pro Üye
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 text-black bg-gray-100 p-3 rounded-lg border-2 border-gray-200">
                <Mail size={18} className="text-gray-600" />
                {/* DÜZELTME: Email yazısı simsiyah */}
                <span className="text-sm font-bold truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-black bg-gray-100 p-3 rounded-lg border-2 border-gray-200">
                <Phone size={18} className="text-gray-600" />
                <span className="text-sm font-bold">{profile?.phone || 'Telefon yok'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. KART: Abonelik Özeti (Dark Mode Kartı - Okunabilirliği iyi) */}
        <div className="bg-black text-white rounded-xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden border-2 border-black">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <CreditCard size={18} />
              <span className="text-sm font-bold">Mevcut Plan</span>
            </div>
            <h3 className="text-3xl font-black">Pro Plan</h3>
            <p className="text-gray-400 text-sm mt-1 font-bold">Sonraki ödeme: 24 Mart 2026</p>
          </div>
          
          <div className="mt-6 relative z-10">
            <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-bold">
              <span>Kredi Kullanımı</span>
              <span>650 / 1000</span>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gray-800 rounded-full opacity-30 blur-2xl"></div>
        </div>

        {/* 3. KART: Hesap Güvenliği (EN ÖNEMLİ DÜZELTME BURADA) */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
          <h3 className="font-extrabold text-black flex items-center gap-2 mb-4 text-lg">
            <Shield size={20} className="text-black" />
            Hesap Güvenliği
          </h3>
          <ul className="space-y-4">
            <li className="flex justify-between text-sm items-center border-b-2 border-gray-100 pb-3 last:border-0 last:pb-0">
              <span className="text-gray-700 font-bold">Üyelik Tarihi</span>
              {/* DÜZELTME: Tarih text-black ve font-extrabold yapıldı */}
              <span className="font-extrabold text-black">{formatDate(user.created_at)}</span>
            </li>
            <li className="flex justify-between text-sm items-center border-b-2 border-gray-100 pb-3 last:border-0 last:pb-0">
              <span className="text-gray-700 font-bold">Son Giriş</span>
              <span className="font-extrabold text-black">{formatDate(user.last_sign_in_at)}</span>
            </li>
            <li className="flex justify-between text-sm items-center">
              <span className="text-gray-700 font-bold">Giriş Yöntemi</span>
              <span className="font-extrabold text-black capitalize">{user.app_metadata.provider || 'Email'}</span>
            </li>
          </ul>
        </div>

        {/* 4. KART: Son Aktiviteler */}
        <div className="md:col-span-2 bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
          <h3 className="font-extrabold text-black flex items-center gap-2 mb-4 text-lg">
            <Activity size={20} className="text-black" />
            Son Aktiviteler
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b-2 border-gray-100 last:border-0">
              <div className="w-3 h-3 mt-1 rounded-full bg-green-600 shadow-sm ring-2 ring-green-100"></div>
              <div>
                <p className="text-sm font-extrabold text-black">Profil bilgileri güncellendi</p>
                {/* DÜZELTME: Tarih rengi koyulaştırıldı */}
                <p className="text-xs text-gray-700 font-bold mt-0.5">{formatDate(profile?.updated_at || new Date().toISOString())}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 mt-1 rounded-full bg-blue-600 shadow-sm ring-2 ring-blue-100"></div>
              <div>
                <p className="text-sm font-extrabold text-black">Yeni oturum açıldı</p>
                <p className="text-xs text-gray-700 font-bold mt-0.5">{formatDate(user.last_sign_in_at)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}