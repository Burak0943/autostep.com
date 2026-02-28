'use server'

import { StreamChat } from 'stream-chat'
import { createClient } from '@/lib/supabase/server'

export async function getStreamToken(projectId: string) {
  const supabase = await createClient()
  
  // 1. Supabase'den kimin giriş yaptığını bul
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Kullanıcı bulunamadı")

  // 2. İsmini çekelim (Stream'de adı güzel gözüksün)
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const userName = profile?.full_name || 'Kullanıcı'

  // 3. Stream İstemcisini oluştur (Secret Key sadece sunucuda kullanılır, güvenlidir)
  const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!
  )

  // 4. Kullanıcı için güvenli Token üret
  const token = serverClient.createToken(user.id)

  // Stream'deki kanal ID'leri boşluk veya özel karakter sevemez, 
  // Supabase'den gelen UUID içindeki tireleri temizleyelim
  const safeChannelId = projectId.replace(/-/g, '')

  return {
    token,
    userId: user.id,
    userName,
    safeChannelId
  }
}