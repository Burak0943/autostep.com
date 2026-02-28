'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, Users, FolderOpen, LogOut, 
  Search, ArrowUpRight, Clock, CheckCircle2, Zap, MessageSquare // <-- EKLENDİ
} from 'lucide-react'

export default function AdminView({ profile, user }: any) {
  const router = useRouter()
  const supabase = createClient()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Admin Paneli Açılınca TÜM PROJELERİ Çek
  useEffect(() => {
    async function fetchAllProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*') 
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Proje çekme hatası:", error)
      }

      if (data) setProjects(data)
      setLoading(false)
    }
    fetchAllProjects()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      
      {/* SOL SIDEBAR (Admin) */}
      <aside className="w-64 border-r border-gray-800 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10 text-white">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
               <Zap size={16} className="text-black" fill="currentColor"/>
            </div>
            <span className="text-xl font-black tracking-tight">AutoStep</span>
            <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400">ADMIN</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white text-black font-bold">
            <FolderOpen size={20} /> Projeler
          </button>
          
          {/* --- YENİ EKLENEN MESAJLAR BUTONU --- */}
          <button onClick={() => router.push('/dashboard/messages')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-white transition-colors font-bold">
            <MessageSquare size={20} /> Mesajlar
          </button>
          {/* ------------------------------------ */}

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-900 transition-colors font-bold">
            <Users size={20} /> Müşteriler
          </button>
        </nav>

        <button onClick={handleSignOut} className="flex items-center gap-2 text-red-500 font-bold hover:text-red-400">
           <LogOut size={16} /> Çıkış
        </button>
      </aside>

      {/* İÇERİK */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Başlık */}
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-black">Yönetim Paneli</h1>
                <p className="text-gray-400 mt-1">Sistemdeki tüm otomasyon talepleri.</p>
            </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <div className="text-gray-400 text-xs font-bold uppercase mb-2">Toplam Proje</div>
                <div className="text-3xl font-black text-white">{projects.length}</div>
            </div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <div className="text-gray-400 text-xs font-bold uppercase mb-2">Aktif İşler</div>
                <div className="text-3xl font-black text-blue-400">{projects.filter(p => p.status === 'active').length}</div>
            </div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <div className="text-gray-400 text-xs font-bold uppercase mb-2">Bekleyen Gelir</div>
                <div className="text-3xl font-black text-green-400">₺0</div>
            </div>
        </div>

        {/* Proje Tablosu */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 font-bold">Son Talepler</div>
            
            {loading ? (
                <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
            ) : (
                <div className="divide-y divide-gray-800">
                    {projects.map((project) => (
                        <Link 
                            href={`/dashboard/project/${project.id}`} 
                            key={project.id} 
                            className="p-4 flex items-center justify-between hover:bg-gray-800 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${project.status === 'active' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {project.status === 'active' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                                </div>
                                <div>
                                    <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{project.name}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                        <span>Müşteri ID: {project.user_id.slice(0, 8)}...</span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                        <span>{new Date(project.created_at).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 font-bold">DURUM</div>
                                    <div className="text-sm font-medium capitalize">{project.status}</div>
                                </div>
                                <ArrowUpRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                    ))}
                    
                    {projects.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            Hiç proje bulunamadı.
                        </div>
                    )}
                </div>
            )}
        </div>

      </main>
    </div>
  )
}