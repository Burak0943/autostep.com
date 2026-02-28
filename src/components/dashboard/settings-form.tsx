'use client'

import { useState, useTransition } from 'react'
// Dosyalar yan yana olduğu için ./actions kullanıyoruz
import { updateProfile } from '@/components/dashboard/settings/actions'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface SettingsFormProps {
  user: {
    email?: string
    full_name?: string
    phone?: string
  }
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      try {
        const result = await updateProfile({ status: null, message: null }, formData)
        
        if (result.status === 'error') {
          toast.error(result.message)
        } else if (result.status === 'success') {
          toast.success(result.message)
        }
      } catch (error) {
        toast.error('Bir hata oluştu, lütfen tekrar deneyin.')
      }
    })
  }

  return (
    <form 
      onSubmit={handleFormSubmit} 
      // DÜZELTME: Kenarlık kalınlaştırıldı (border-2)
      className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-sm max-w-2xl"
    >
      <div className="space-y-6">
        
        <div>
          {/* DÜZELTME: Başlık simsiyah ve ekstra kalın */}
          <h3 className="text-lg font-extrabold text-black">Profil Bilgileri</h3>
          <p className="text-sm text-gray-700 font-bold mt-1">Kişisel bilgilerinizi buradan güncelleyebilirsiniz.</p>
        </div>

        <div className="grid gap-6">
          {/* Email */}
          <div>
            {/* DÜZELTME: Label simsiyah ve kalın */}
            <label htmlFor="email" className="block text-sm font-extrabold text-black mb-2">
              Email Adresi
            </label>
            <input 
              id="email"
              type="email" 
              name="email"
              disabled 
              value={user.email} 
              // DÜZELTME: Disabled input arka planı daha belirgin, yazısı siyah
              className="w-full p-3 bg-gray-100 text-black border-2 border-gray-200 rounded-lg cursor-not-allowed select-none font-bold opacity-70"
            />
          </div>

          {/* Ad Soyad */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-extrabold text-black mb-2">
              Ad Soyad
            </label>
            <input 
              id="fullName"
              name="fullName"
              defaultValue={user.full_name}
              placeholder="Adınız Soyadınız"
              autoComplete="name"
              // DÜZELTME: Input border-2, yazı siyah ve kalın
              className="w-full p-3 bg-white text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400 font-bold"
            />
          </div>

          {/* Telefon */}
          <div>
            <label htmlFor="phone" className="block text-sm font-extrabold text-black mb-2">
              Telefon Numarası
            </label>
            <input 
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone}
              placeholder="+90 555 ..."
              autoComplete="tel"
              className="w-full p-3 bg-white text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400 font-bold"
            />
          </div>
        </div>

        {/* Buton */}
        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            // DÜZELTME: Buton fontu kalınlaştırıldı
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Değişiklikleri Kaydet</span>
              </>
            )}
          </button>
        </div>

      </div>
    </form>
  )
}