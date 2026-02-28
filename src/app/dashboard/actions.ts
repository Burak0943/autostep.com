'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type State = {
  status: 'success' | 'error' | null
  message: string | null
}

// --- 1. PROJE OLUŞTURMA ---
export async function createProject(prevState: State | null, formData: FormData): Promise<State> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'error', message: 'Oturum açmanız gerekiyor.' }

  const name = formData.get('name')?.toString().trim()
  const description = formData.get('description')?.toString().trim()

  if (!name || name.length < 3) return { status: 'error', message: 'Proje adı en az 3 karakter olmalı.' }

  const { error } = await supabase.from('projects').insert({
    name: name,
    description: description || '',
    status: 'active',
    progress: 0,
    user_id: user.id,
    created_at: new Date().toISOString()
  })

  if (error) {
    console.error('Hata:', error)
    return { status: 'error', message: 'Hata oluştu.' }
  }

  revalidatePath('/dashboard')
  return { status: 'success', message: 'Proje oluşturuldu!' }
}

// --- 2. STREAM TOKEN ALMA (AKTİF EDİLDİ) ---
export async function getStreamToken(projectId: string) {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
  const apiSecret = process.env.STREAM_API_SECRET

  if (!apiKey || !apiSecret) throw new Error('API Key Hatası')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Kullanıcı bulunamadı')

  // Dinamik import: Sadece gerektiğinde yüklenir, hataları engeller
  const { StreamChat } = await import('stream-chat') 
  const serverClient = new StreamChat(apiKey, apiSecret)

  await serverClient.upsertUser({
    id: user.id,
    name: user.user_metadata?.full_name || user.email || 'Kullanıcı',
    role: 'user', 
  })

  let channelId = ''

  if (projectId && projectId !== 'dashboard-init') {
      channelId = `project-${projectId}`

      const { data: project } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single()
      
      const realProjectName = project?.name || 'Proje Sohbeti'

      const channelData = {
        name: realProjectName,
        created_by_id: user.id,
        members: [user.id]
      } as any

      const channel = serverClient.channel('messaging', channelId, channelData) 
      await channel.create()
      await channel.updatePartial({ set: { name: realProjectName } } as any)
      await channel.addMembers([user.id])
  }

  const token = serverClient.createToken(user.id)

  return {
    token,
    userId: user.id,
    userName: user.user_metadata?.full_name || user.email,
    apiKey,
    channelId
  }
}

// --- 3. KULLANICI LİSTESİNİ GETİR (FİLTRELİ - SADECE AHSAN COBAN) ---
export async function getUsers() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const isAdmin = user.user_metadata?.role === 'admin' || user.email === 'cobanahsan@gmail.com'

  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', user.id) 
    .limit(50)

  if (!isAdmin) {
      const ADMIN_EMAIL = 'cobanahsan@gmail.com'
      query = query.eq('email', ADMIN_EMAIL)
  }

  const { data, error } = await query

  if (error) {
      console.error("Kullanıcı getirme hatası:", error)
      return []
  }

  return data || []
}

// --- 4. ÖZEL SOHBET (DM) BAŞLAT (AKTİF EDİLDİ) ---
export async function startDirectChat(targetUserId: string) {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
  const apiSecret = process.env.STREAM_API_SECRET
  if (!apiKey || !apiSecret) throw new Error('API Key Hatası')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Oturum açın')

  const { StreamChat } = await import('stream-chat')
  const serverClient = new StreamChat(apiKey, apiSecret)

  await serverClient.upsertUser({ id: user.id, role: 'user' })
  await serverClient.upsertUser({ id: targetUserId, role: 'user' })

  const members = [user.id, targetUserId].sort()
  const crypto = await import('crypto')
  const combinedId = members.join('-')
  const hash = crypto.createHash('md5').update(combinedId).digest('hex')
  const channelId = `dm-${hash}`

  const channel = serverClient.channel('messaging', channelId, {
    members: members,
    created_by_id: user.id,
  })

  await channel.create()

  const { messages } = await channel.query({ messages: { limit: 1 } })
  
  if (messages.length === 0) {
      await channel.sendMessage({
          text: 'Sohbet başlatıldı 👋',
          user_id: user.id,
      })
  }

  return { channelId }
}

// --- 5. PROJE GÜNCELLEME ---
export async function updateProject(projectId: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name')?.toString().trim()
  const description = formData.get('description')?.toString().trim()

  if (!name) return { status: 'error', message: 'Proje adı boş olamaz.' }

  const { error } = await supabase
    .from('projects')
    .update({ name, description })
    .eq('id', projectId)

  if (error) {
    console.error('Update hatası:', error)
    return { status: 'error', message: 'Güncellenemedi.' }
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath('/dashboard')
  
  return { status: 'success', message: 'Proje güncellendi.' }
}

// --- 6. PROJE SİLME ---
export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    console.error('Silme hatası:', error)
    return { status: 'error', message: 'Proje silinemedi.' }
  }

  revalidatePath('/dashboard')
  return { status: 'success', message: 'Proje başarıyla silindi.' }
}

// --- 7. DOSYA YÜKLEME (Storage + DB) ---
export async function uploadFile(projectId: string, formData: FormData) {
  const supabase = await createClient()
  
  const file = formData.get('file') as File
  if (!file) return { status: 'error', message: 'Dosya seçilmedi.' }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${projectId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('project-files')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Upload hatası:', uploadError)
    return { status: 'error', message: 'Dosya yüklenemedi.' }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('project-files')
    .getPublicUrl(filePath)

  const { error: dbError } = await supabase
    .from('project_files')
    .insert({
      project_id: projectId,
      file_name: file.name,
      file_url: publicUrl,
      file_type: file.type.startsWith('image/') ? 'image' : 'file'
    })

  if (dbError) {
    console.error('DB hatası:', dbError)
    return { status: 'error', message: 'Veritabanına kaydedilemedi.' }
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
  return { status: 'success', message: 'Dosya yüklendi!' }
}

// --- 8. DOSYA SİLME ---
export async function deleteFile(fileId: string) {
  const supabase = await createClient()

  const { data: fileData } = await supabase
    .from('project_files')
    .select('*')
    .eq('id', fileId)
    .single()

  if (!fileData) return { status: 'error', message: 'Dosya bulunamadı.' }

  const fileName = fileData.file_url.split('/project-files/')[1]

  if (fileName) {
      await supabase.storage.from('project-files').remove([fileName])
  }

  const { error } = await supabase
    .from('project_files')
    .delete()
    .eq('id', fileId)

  if (error) return { status: 'error', message: 'Silinemedi.' }

  revalidatePath('/dashboard')
  return { status: 'success', message: 'Dosya silindi.' }
}

// --- 9. PROFİL GÜNCELLEME ---
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { status: 'error', message: 'Oturum açın.' }

  const fullName = formData.get('fullName')?.toString().trim()
  const avatarFile = formData.get('avatar') as File

  const updates: any = {
    updated_at: new Date().toISOString(),
  }

  if (fullName) {
      updates.full_name = fullName
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      })
  }

  if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true })

      if (uploadError) {
         console.error('Avatar yükleme hatası:', uploadError)
      } else {
         const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)
         
         updates.avatar_url = publicUrl
         
         await supabase.auth.updateUser({
            data: { avatar_url: publicUrl }
         })
      }
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) return { status: 'error', message: 'Profil güncellenemedi.' }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  
  return { status: 'success', message: 'Profil başarıyla güncellendi!' }
}

// --- 10. ŞİFRE DEĞİŞTİRME ---
export async function changePassword(formData: FormData) {
  const supabase = await createClient()
  
  const password = formData.get('password')?.toString()
  const confirmPassword = formData.get('confirmPassword')?.toString()

  if (!password || password.length < 6) {
    return { status: 'error', message: 'Şifre en az 6 karakter olmalı.' }
  }

  if (password !== confirmPassword) {
    return { status: 'error', message: 'Şifreler uyuşmuyor.' }
  }

  const { error } = await supabase.auth.updateUser({ password: password })

  if (error) {
    console.error('Şifre hatası:', error)
    return { status: 'error', message: 'Şifre değiştirilemedi.' }
  }

  revalidatePath('/dashboard/settings')
  return { status: 'success', message: 'Şifreniz başarıyla güncellendi!' }
}

// --- 11. BİLDİRİM İŞLEMLERİ ---
export async function getNotifications() {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return data || []
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient()
  
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    
  revalidatePath('/dashboard')
}

export async function markAllRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
  }
  revalidatePath('/dashboard')
}

// --- 12. ANALİZ VERİLERİ ---
export async function getAnalyticsData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Profil tablosundan hem abonelik durumunu hem de "role" (rol) bilgisini çekiyoruz
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, role')
    .eq('id', user.id)
    .single()

  // SİHİRLİ DOKUNUŞ: Eğer kullanıcı adminse veya senin mailinse, otomatik "PRO" say!
  const isAdmin = profile?.role === 'admin' || user.email === 'cobanahsan@gmail.com'
  const isPro = profile?.subscription_tier === 'pro' || isAdmin

  const { data: metrics } = await supabase
    .from('analytics_metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })
    .limit(7)

  const { data: sales } = await supabase
    .from('recent_sales')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const totalRevenue = metrics?.reduce((acc, curr) => acc + (curr.revenue || 0), 0) || 0
  const totalSubscribers = metrics?.reduce((acc, curr) => acc + (curr.subscribers || 0), 0) || 0
  const totalVisitors = metrics?.reduce((acc, curr) => acc + (curr.visitors || 0), 0) || 0
  
  const activeSessions = metrics && metrics.length > 0 ? metrics[metrics.length - 1].active_sessions : 0

  return {
    isPro,
    metrics: metrics || [],
    sales: sales || [],
    summary: {
      revenue: totalRevenue,
      subscribers: totalSubscribers,
      visitors: totalVisitors,
      activeSessions
    }
  }
}

// Yanlışlıkla silinen o masum fonksiyon :)
export async function upgradeToPro() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('profiles').update({ subscription_tier: 'pro' }).eq('id', user.id)
  revalidatePath('/dashboard/analytics')
}

// --- 13. ADMIN DASHBOARD VERİLERİ ---
export async function getAdminDashboardData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.user_metadata?.role !== 'admin' && user.email !== 'cobanahsan@gmail.com')) {
      return null
  }

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: metrics } = await supabase.from('analytics_metrics').select('revenue')
  const totalRevenue = metrics?.reduce((acc, curr) => acc + (Number(curr.revenue) || 0), 0) || 0

  return {
    users: users || [],
    projects: projects || [],
    stats: {
        totalUsers: users?.length || 0,
        totalProjects: projects?.length || 0,
        activeProjects: projects?.filter((p: any) => p.status !== 'completed').length || 0,
        totalRevenue: totalRevenue
    }
  }
}

export async function deleteUserAsAdmin(targetUserId: string) {
    const supabase = await createClient()
    
    const { error } = await supabase.from('profiles').delete().eq('id', targetUserId)
    
    if (error) return { status: 'error', message: 'Kullanıcı silinemedi.' }
    
    revalidatePath('/dashboard/admin')
    return { status: 'success', message: 'Kullanıcı ve verileri silindi.' }
}

// --- 14. ADMIN KULLANICI YÖNETİMİ ---
export async function toggleUserBan(userId: string, currentStatus: string) {
  const supabase = await createClient()
  
  const newStatus = currentStatus === 'banned' ? 'active' : 'banned'

  const { error } = await supabase
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', userId)

  if (error) return { status: 'error', message: 'İşlem başarısız.' }

  revalidatePath('/dashboard/admin')
  return { status: 'success', message: `Kullanıcı durumu: ${newStatus}` }
}