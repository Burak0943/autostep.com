import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsForm from '@/components/dashboard/settings-form'

export default async function SettingsPage() {
  const supabase = await createClient()

  // 1. Kullanıcı oturumunu kontrol et
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Profil detaylarını çek (Ad, Telefon vb.)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Verileri birleştir
  const userData = {
    email: user.email,
    full_name: profile?.full_name || '',
    phone: profile?.phone || ''
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Ayarlar</h1>
      
      <SettingsForm user={userData} />
    </div>
  )
}