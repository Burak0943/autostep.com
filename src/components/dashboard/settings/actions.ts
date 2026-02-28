'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type State = {
  status: 'success' | 'error' | null
  message: string | null
}

export async function updateProfile(prevState: State | null, formData: FormData): Promise<State> {
  const supabase = await createClient()

  // 1. Kullanıcıyı al
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      status: 'error',
      message: 'Oturum hatası. Lütfen sayfayı yenileyip tekrar giriş yapın.'
    }
  }

  const fullName = formData.get('fullName')?.toString().trim()
  const phone = formData.get('phone')?.toString().trim()

  if (!fullName || fullName.length < 2) {
    return {
      status: 'error',
      message: 'İsim en az 2 karakter olmalıdır.'
    }
  }

  // 2. VERİTABANI GÜNCELLEME (Fix: Email eklendi)
  const { error: updateError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email, // <--- İŞTE ÇÖZÜM BU SATIRDA!
      full_name: fullName,
      phone: phone,
      updated_at: new Date().toISOString(),
    })

  if (updateError) {
    console.error('Supabase Hatası:', updateError)
    return {
      status: 'error',
      message: `Hata Detayı: ${updateError.message} (Kod: ${updateError.code})`
    }
  }

  revalidatePath('/dashboard/settings')
  
  return {
    status: 'success',
    message: 'Profil başarıyla kaydedildi!'
  }
}