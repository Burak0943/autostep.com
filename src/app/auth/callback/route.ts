import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Google'dan dönen URL'deki 'code' parametresini al
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Eğer 'next' parametresi varsa oraya, yoksa dashboard'a yönlendir
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    // Bu 'code'u Supabase'e verip karşılığında oturum (session) alıyoruz
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Başarılı! Kullanıcıyı içeri al
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Hata varsa login sayfasına geri at
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}