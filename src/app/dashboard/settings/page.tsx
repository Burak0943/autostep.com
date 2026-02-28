'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateProfile, changePassword } from '@/app/dashboard/actions' // changePassword eklendi
import { 
  User, Mail, Camera, Save, Loader2, ShieldCheck, Lock, Key, Smartphone, Clock
} from 'lucide-react'

export default function SettingsPage() {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // SEKME YÖNETİMİ (profile | security | password)
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'password'>('profile')
  
  // Profil Form verileri
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
          setUser(user)
          setEmail(user.email || '')
          setFullName(user.user_metadata?.full_name || '')
          setAvatarUrl(user.user_metadata?.avatar_url || null)
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
            
          if (profile) {
              setFullName(profile.full_name || '')
              if (profile.avatar_url) setAvatarUrl(profile.avatar_url)
          }
      }
      setLoading(false)
    }
    getProfile()
  }, [])

  // --- PROFİL İŞLEMLERİ ---
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0]
          setNewAvatarFile(file)
          setAvatarUrl(URL.createObjectURL(file))
      }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSaving(true)
      const formData = new FormData()
      formData.append('fullName', fullName)
      if (newAvatarFile) formData.append('avatar', newAvatarFile)

      const result = await updateProfile(formData)
      alert(result.message)
      setIsSaving(false)
  }

  // --- ŞİFRE İŞLEMLERİ ---
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsSaving(true)
      const formData = new FormData(e.currentTarget)
      
      const result = await changePassword(formData)
      alert(result.message)
      
      if (result.status === 'success') {
          // Formu temizle
          (e.target as HTMLFormElement).reset()
      }
      setIsSaving(false)
  }

  if (loading) return <div className="h-full flex items-center justify-center text-white"><Loader2 className="animate-spin"/></div>

  return (
    <div className="text-white font-sans p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Hesap Ayarları</h1>
        <p className="text-gray-400 mb-8">Profil bilgilerinizi ve güvenliğinizi yönetin.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* SOL MENÜ */}
            <div className="space-y-6">
                {/* Avatar Kartı (Her zaman görünür) */}
                <div className="bg-[#18181b] border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-blue-500 transition-all bg-gray-900 flex items-center justify-center">
                            {avatarUrl ? <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover"/> : <User size={40} className="text-gray-500"/>}
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <Camera size={24} className="text-white"/>
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange}/>
                    <h2 className="mt-4 font-bold text-lg">{fullName || 'İsimsiz Kullanıcı'}</h2>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                {/* Sekme Butonları */}
                <div className="bg-[#18181b] border border-gray-800 rounded-2xl overflow-hidden">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full text-left px-6 py-4 font-medium text-sm flex items-center gap-3 transition ${activeTab === 'profile' ? 'bg-blue-600/10 text-blue-500 border-l-4 border-blue-500' : 'text-gray-400 hover:bg-white/5 border-l-4 border-transparent'}`}
                    >
                        <User size={18}/> Profil Bilgileri
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full text-left px-6 py-4 font-medium text-sm flex items-center gap-3 transition ${activeTab === 'security' ? 'bg-blue-600/10 text-blue-500 border-l-4 border-blue-500' : 'text-gray-400 hover:bg-white/5 border-l-4 border-transparent'}`}
                    >
                        <ShieldCheck size={18}/> Güvenlik
                    </button>
                    <button 
                        onClick={() => setActiveTab('password')}
                        className={`w-full text-left px-6 py-4 font-medium text-sm flex items-center gap-3 transition ${activeTab === 'password' ? 'bg-blue-600/10 text-blue-500 border-l-4 border-blue-500' : 'text-gray-400 hover:bg-white/5 border-l-4 border-transparent'}`}
                    >
                        <Lock size={18}/> Şifre Değiştir
                    </button>
                </div>
            </div>

            {/* SAĞ TARAF: İÇERİK ALANI */}
            <div className="md:col-span-2">
                
                {/* 1. SEKME: PROFİL */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSubmit} className="bg-[#18181b] border border-gray-800 rounded-2xl p-8 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-blue-500"><User size={20}/> Kişisel Bilgiler</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Ad Soyad</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 w-[50px] flex items-center justify-center pointer-events-none text-gray-500 border-r border-gray-800/50"><User size={20}/></div>
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ paddingLeft: '50px' }} className="w-full bg-black/50 border border-gray-700 rounded-xl pr-4 py-3 text-white focus:border-blue-500 focus:outline-none transition" placeholder="Adınız Soyadınız" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">E-Posta Adresi</label>
                                <div className="relative opacity-60 cursor-not-allowed">
                                    <div className="absolute inset-y-0 left-0 w-[50px] flex items-center justify-center pointer-events-none text-gray-500 border-r border-gray-800/50"><Mail size={20}/></div>
                                    <input type="email" value={email} disabled style={{ paddingLeft: '50px' }} className="w-full bg-black/50 border border-gray-700 rounded-xl pr-4 py-3 text-gray-400 focus:outline-none" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-800">
                                <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition flex items-center gap-2 ml-auto disabled:opacity-50">
                                    {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} Değişiklikleri Kaydet
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* 2. SEKME: GÜVENLİK (BİLGİ EKRANI) */}
                {activeTab === 'security' && (
                     <div className="bg-[#18181b] border border-gray-800 rounded-2xl p-8 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-green-500"><ShieldCheck size={20}/> Hesap Güvenliği</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 text-green-500 rounded-lg"><Smartphone size={20}/></div>
                                    <div>
                                        <p className="font-bold text-sm">E-Posta Doğrulama</p>
                                        <p className="text-xs text-gray-400">Hesabınız onaylanmış durumda.</p>
                                    </div>
                                </div>
                                <span className="text-green-500 text-xs font-bold px-3 py-1 bg-green-500/10 rounded-full">Onaylı</span>
                            </div>

                            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg"><Clock size={20}/></div>
                                    <div>
                                        <p className="font-bold text-sm">Son Giriş</p>
                                        <p className="text-xs text-gray-400">
                                            {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('tr-TR') : 'Bilinmiyor'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center justify-between opacity-50">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg"><Key size={20}/></div>
                                    <div>
                                        <p className="font-bold text-sm">İki Adımlı Doğrulama (2FA)</p>
                                        <p className="text-xs text-gray-400">Yakında gelecek.</p>
                                    </div>
                                </div>
                                <span className="text-gray-500 text-xs font-bold px-3 py-1 bg-gray-800 rounded-full">Pasif</span>
                            </div>
                        </div>
                     </div>
                )}

                {/* 3. SEKME: ŞİFRE DEĞİŞTİRME */}
                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="bg-[#18181b] border border-gray-800 rounded-2xl p-8 animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-red-500"><Lock size={20}/> Şifre Değiştir</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Yeni Şifre</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 w-[50px] flex items-center justify-center pointer-events-none text-gray-500 border-r border-gray-800/50"><Key size={20}/></div>
                                    <input type="password" name="password" required minLength={6} style={{ paddingLeft: '50px' }} className="w-full bg-black/50 border border-gray-700 rounded-xl pr-4 py-3 text-white focus:border-red-500 focus:outline-none transition" placeholder="******" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Yeni Şifre (Tekrar)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 w-[50px] flex items-center justify-center pointer-events-none text-gray-500 border-r border-gray-800/50"><Key size={20}/></div>
                                    <input type="password" name="confirmPassword" required minLength={6} style={{ paddingLeft: '50px' }} className="w-full bg-black/50 border border-gray-700 rounded-xl pr-4 py-3 text-white focus:border-red-500 focus:outline-none transition" placeholder="******" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-800">
                                <button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl transition flex items-center gap-2 ml-auto disabled:opacity-50">
                                    {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} Şifreyi Güncelle
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    </div>
  )
}