'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { createProject, getNotifications, markNotificationAsRead, markAllRead } from '@/app/dashboard/actions'
import { 
  Briefcase, Plus, ArrowRight, Loader2, FileText, MessageSquare, 
  Clock, X, Bell, CheckCircle2
} from 'lucide-react'

export default function UserDashboard() {
  const supabase = createClient()
  const router = useRouter()
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const [projects, setProjects] = useState<any[]>([]) 
  const [stats, setStats] = useState({ active: 0, completed: 0 })
  
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)

    const adminCheck = user.user_metadata?.role === 'admin' || user.email === 'cobanahsan@gmail.com'
    setIsAdmin(adminCheck)

    // DÜZELTME: Artık "adminCheck ise zorla admin paneline at" kodunu SİLDİK.
    // DÜZELTME: Admin de olsa bu sayfada sadece kendi açtığı projeleri görecek (Tüm projeleri zaten admin panelinde görüyor).
    let query = supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

    const { data: projectData } = await query
    if (projectData) {
        setProjects(projectData)
        setStats({
            active: projectData.filter((p: any) => p.status === 'active').length,
            completed: projectData.filter((p: any) => p.status === 'completed').length
        })
    }

    const notifs = await getNotifications()
    setNotifications(notifs)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsCreating(true)
      const formData = new FormData(e.currentTarget)
      const result = await createProject(null, formData)
      if (result.status === 'success') {
          setIsModalOpen(false)
          fetchData()
      } else {
          alert(result.message || 'Bir hata oluştu.')
      }
      setIsCreating(false)
  }

  const handleNotificationClick = async (notif: any) => {
      if (!notif.is_read) {
          await markNotificationAsRead(notif.id)
          setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n))
      }
      if (notif.link) router.push(notif.link)
      setShowNotifications(false)
  }

  const handleMarkAllRead = async () => {
      await markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  if (loading) return <div className="h-full flex items-center justify-center text-white min-h-screen bg-[#09090b]"><Loader2 className="animate-spin text-blue-500"/></div>

  const displayName = user?.user_metadata?.full_name || 'Kullanıcı'
  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="text-white font-sans p-6 max-w-5xl mx-auto relative min-h-screen">
        
        {/* HEADER */}
        <div className="flex justify-between items-end border-b border-gray-800 pb-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight mb-1">
                    Merhaba, <span className="text-blue-500">{displayName}</span>
                </h1>
                <p className="text-gray-400 text-sm">
                    Projelerini buradan takip edebilirsin.
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2.5 rounded-xl border transition relative ${showNotifications ? 'bg-zinc-800 border-gray-500 text-white' : 'bg-[#18181b] border-gray-700 text-gray-400 hover:text-white hover:bg-zinc-800'}`}
                    >
                        <Bell size={20}/>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-[#09090b] text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-14 w-[380px] bg-zinc-950 border border-gray-700 rounded-2xl shadow-2xl z-[999] overflow-hidden">
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-zinc-900">
                                <h3 className="font-bold text-sm text-white">Bildirimler</h3>
                                {unreadCount > 0 && (
                                    <button onClick={handleMarkAllRead} className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1.5">
                                        <CheckCircle2 size={12}/> Tümünü Oku
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[350px] overflow-y-auto bg-zinc-950">
                                {notifications.length === 0 ? (
                                    <div className="py-12 text-center text-gray-500"><p className="text-sm">Yeni bildirim yok.</p></div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif.id} onClick={() => handleNotificationClick(notif)} className={`p-4 border-b border-gray-800 hover:bg-zinc-900 cursor-pointer transition flex gap-4 ${!notif.is_read ? 'bg-blue-900/10' : ''}`}>
                                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${!notif.is_read ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm mb-1 leading-tight ${!notif.is_read ? 'font-bold text-white' : 'text-gray-400'}`}>{notif.title}</h4>
                                                <p className="text-xs text-gray-400">{notif.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition flex items-center gap-2">
                    <Plus size={18}/> Yeni Proje
                </button>
            </div>
        </div>

        {/* İSTATİSTİKLER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#18181b] p-5 rounded-xl border border-gray-800">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Briefcase size={20}/></div>
                    <span className="text-xl font-bold">{stats.active}</span>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Aktif Projeler</p>
            </div>
            
            <div className="bg-[#18181b] p-5 rounded-xl border border-gray-800">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><FileText size={20}/></div>
                    <span className="text-xl font-bold">{stats.completed}</span>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Tamamlanan İşler</p>
            </div>

            <div onClick={() => router.push('/dashboard/dm')} className="bg-[#18181b] p-5 rounded-xl border border-gray-800 hover:border-purple-500 transition cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition"><MessageSquare size={20}/></div>
                    <span className="text-xl font-bold">Mesajlar</span>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Mesajlara Git</p>
            </div>
        </div>

        {/* PROJELER LİSTESİ */}
        <div>
            <h2 className="text-lg font-bold mb-3 text-gray-200 uppercase tracking-tight">Son Projelerin</h2>
            <div className="bg-[#18181b] rounded-xl border border-gray-800 overflow-hidden">
                {projects.length === 0 ? (
                    <div className="py-8 px-4 text-center text-gray-500">
                        <p className="text-sm italic">Henüz bir projeniz bulunmuyor.</p>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} onClick={() => router.push(`/dashboard/projects/${project.id}`)} className="p-4 border-b border-gray-800 flex items-center justify-between hover:bg-white/5 transition cursor-pointer group last:border-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold bg-blue-600`}>
                                    {project.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-200 group-hover:text-white text-sm">{project.name}</h3>
                                    <p className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                                        <Clock size={10}/> {new Date(project.created_at).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${project.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                    {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                                </span>
                                <ArrowRight size={16} className="text-gray-600 group-hover:text-white"/>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* PROJE OLUŞTURMA MODAL */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#18181b] border border-gray-700 w-full max-w-md rounded-2xl p-6 relative">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
                    <h2 className="text-xl font-bold mb-4 uppercase italic">Yeni Proje</h2>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                        <input name="name" type="text" required placeholder="Proje Adı" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none transition"/>
                        <textarea name="description" rows={3} placeholder="Açıklama" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none transition resize-none"/>
                        <button type="submit" disabled={isCreating} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition uppercase">{isCreating ? 'İşleniyor...' : 'Oluştur'}</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}