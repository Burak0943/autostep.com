'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// 1. EMAİL İLE GİRİŞ YAP
export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Lütfen tüm alanları doldurun.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Eğer kullanıcı mailini onaylamadıysa Supabase genellikle "Email not confirmed" hatası döner.
  if (error) {
    return { error: 'Giriş yapılamadı. Bilgiler hatalı veya mail onaylanmamış olabilir.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// 2. KAYIT OL (Email Onay Akışı Eklendi)
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string

  if (!email || !password || !fullName || !phone) {
    return { error: 'Lütfen tüm alanları eksiksiz doldurun.' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
      // Onay linkine tıklandığında kullanıcının gideceği adres
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    }
  })

  if (error) {
    return { error: error.message }
  }

  // DİKKAT: Artık redirect yapmıyoruz! 
  // Frontend'deki Modal'ı açmak için başarı sinyali gönderiyoruz.
  return { success: true }
}

// 3. GOOGLE İLE GİRİŞ
export async function loginWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error(error)
    redirect('/login?error=OAuthError')
  }

  if (data.url) {
    redirect(data.url)
  }
}