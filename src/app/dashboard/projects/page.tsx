'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { createProject } from '@/app/dashboard/actions'
import { 
  Plus, Search, Grid, List, Filter, Loader2, 
  Briefcase, Clock, CheckCircle2, MoreVertical, X, Calendar
} from 'lucide-react'

export default function AllProjectsPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Verileri Çek
  async function fetchProjects() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const isAdmin = user.user_metadata?.role === 'admin' || user.email === 'cobanahsan@gmail.com'

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (!isAdmin) {
        query = query.eq('user_id', user.id)
    }

    const { data } = await query
    if (data) setProjects(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Yeni Proje Oluşturma
  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsCreating(true)
      const formData = new FormData(e.currentTarget)
      const result = await createProject(null, formData)
      if (result.status === 'success') {
          setIsModalOpen(false)
          fetchProjects()
      } else {
          alert(result.message)
      }
      setIsCreating(false)
  }

  // Filtreleme Mantığı
  const filteredProjects = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' 
          ? true 
          : filterStatus === 'active' 
              ? project.status !== 'completed' 
              : project.status === 'completed'
      
      return matchesSearch && matchesFilter
  })

  if (loading) return <div className="h-full flex items-center justify-center text-white"><Loader2 className="animate-spin"/></div>

  return (
    <div className="text-white font-sans p-8 max-w-7xl mx-auto min-h-screen">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/5 pb-6 gap-4">
            <div>
                <h1 className="text-3xl font-bold mb-2">Projelerim</h1>
                <p className="text-gray-400 text-sm">Tüm çalışmalarınızı buradan yönetin ve takip edin.</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-blue-900/20"
            >
                <Plus size={18}/> Yeni Proje
            </button>
        </div>

        {/* FİLTRE VE ARAMA */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Arama Kutusu (DÜZELTİLDİ) */}
            <div className="relative flex-1">
                {/* İKON ALANI: Sabit 50px genişlik, tam ortalı ve sağ tarafında ince çizgi */}
                <div className="absolute inset-y-0 left-0 w-[50px] flex items-center justify-center pointer-events-none text-gray-500 border-r border-white/5">
                    <Search size={18}/>
                </div>
                
                {/* INPUT: Soldan 50px zorunlu boşluk */}
                <input 
                    type="text" 
                    placeholder="Proje ara..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '50px' }} 
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
            </div>
            
            {/* Durum Filtresi */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-1 flex shrink-0">
                <button 
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${filterStatus === 'all' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                    Tümü
                </button>
                <button 
                    onClick={() => setFilterStatus('active')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${filterStatus === 'active' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                    Devam Eden
                </button>
                <button 
                    onClick={() => setFilterStatus('completed')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${filterStatus === 'completed' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                    Tamamlanan
                </button>
            </div>
        </div>

        {/* PROJE LİSTESİ (GRID) */}
        {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/30">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <Briefcase size={24} className="text-gray-500"/>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Proje Bulunamadı</h3>
                <p className="text-gray-500 text-sm mb-6">Aradığınız kriterlere uygun bir proje yok.</p>
                <button onClick={() => {setSearchTerm(''); setFilterStatus('all')}} className="text-blue-500 text-sm hover:underline">Filtreleri Temizle</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <div 
                        key={project.id}
                        onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                        className="group bg-zinc-900 border border-white/5 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 transition cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-inner ${
                                    project.status === 'completed' 
                                    ? 'bg-gradient-to-br from-green-500 to-green-700 text-white' 
                                    : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                                }`}>
                                    {project.name.charAt(0).toUpperCase()}
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                    project.status === 'completed'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {project.status === 'completed' ? 'Tamamlandı' : 'Aktif'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition">{project.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                                {project.description || 'Açıklama girilmemiş.'}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14}/>
                                    <span>{new Date(project.created_at).toLocaleDateString('tr-TR')}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${project.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`} 
                                            style={{ width: project.status === 'completed' ? '100%' : `${project.progress || 35}%` }}
                                        ></div>
                                    </div>
                                    <span className="font-bold text-gray-400">
                                        {project.status === 'completed' ? '100%' : `${project.progress || 35}%`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* YENİ PROJE MODALI */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
                    <h2 className="text-xl font-bold mb-1">Yeni Proje Oluştur</h2>
                    <p className="text-gray-400 text-sm mb-6">Projeniz için bir isim ve kısa bir açıklama girin.</p>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Proje Adı</label>
                            <input name="name" type="text" required placeholder="Örn: E-Ticaret Sitesi" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Açıklama (İsteğe bağlı)</label>
                            <textarea name="description" rows={3} placeholder="Proje detayları..." className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"/>
                        </div>
                        <div className="pt-2 flex gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl transition text-sm">İptal</button>
                            <button type="submit" disabled={isCreating} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2">{isCreating ? <Loader2 size={16} className="animate-spin"/> : 'Oluştur'}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

    </div>
  )
}