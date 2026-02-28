'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, User, Settings, Plus, 
  Clock, CheckCircle2, Bell, Briefcase, LogOut,
  BarChart3, Lock, Zap, Menu, X, MessageSquare // <-- 1. İKON EKLENDİ
} from 'lucide-react'

import CreateProjectModal from './create-project-modal' 

export default function CustomerView({ profile, user, dbProjects }: any) {
  const router = useRouter()
  const supabase = createClient()
  
  // State Yönetimi
  const [activeTab, setActiveTab] = useState('panel')
  const [loading, setLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Plan Kontrolü
  const userPlan = profile?.plan || 'free'
  const isPro = userPlan === 'pro'

  // Proje Verileri
  const projects = dbProjects || []

  // Çıkış Yap Fonksiyonu
  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans text-[#1a1a1a]">
      
      {/* === MOBİL MENÜ BUTONU === */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* === SOL SIDEBAR === */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col
      `}>
        {/* Logo Alanı */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
               <Zap size={16} fill="currentColor" className="text-yellow-400"/>
            </div>
            <span className="text-xl font-black tracking-tight">AutoStep</span>
        </div>
        
        {/* Navigasyon */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarBtn 
            icon={<LayoutDashboard size={20} />} 
            text="Panel" 
            active={activeTab === 'panel'} 
            onClick={() => { setActiveTab('panel'); setIsMobileMenuOpen(false); }} 
          />
          
          {/* --- 2. YENİ MESAJLAR BUTONU EKLENDİ --- */}
          {/* Bu buton tıklandığında sayfayı değiştirip /dashboard/messages adresine gider */}
          <SidebarBtn 
            icon={<MessageSquare size={20} />} 
            text="Mesajlar" 
            active={false} 
            onClick={() => router.push('/dashboard/messages')} 
          />
          {/* --------------------------------------- */}

          <SidebarBtn 
            icon={<BarChart3 size={20} />} 
            text="Analizler" 
            active={activeTab === 'analytics'} 
            onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }} 
            badge={!isPro ? <Lock size={12} className="text-gray-400"/> : null} 
          />
          <SidebarBtn 
            icon={<User size={20} />} 
            text="Profil" 
            active={activeTab === 'profile'} 
            onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }} 
          />
          <SidebarBtn 
            icon={<Settings size={20} />} 
            text="Ayarlar" 
            active={activeTab === 'settings'} 
            onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} 
          />
        </nav>

        {/* Alt Kullanıcı Bilgisi ve Çıkış */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
             </div>
             <div className="overflow-hidden">
                <div className="font-bold text-sm truncate text-gray-900">{profile?.full_name || 'Kullanıcı'}</div>
                <div className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded w-fit ${isPro ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {isPro ? 'PRO ÜYE' : 'BAŞLANGIÇ'}
                </div>
             </div>
          </div>
          
          <button 
            onClick={handleSignOut} 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-red-600 py-2 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-100 transition-all"
          >
            {loading ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div> : <LogOut size={16} />}
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* === SAĞ İÇERİK ALANI === */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen relative">
        
        {/* --- 1. PANEL SEKMESİ --- */}
        {activeTab === 'panel' && (
           <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Header title={`Hoş geldin, ${profile?.full_name?.split(' ')[0] || 'Kullanıcı'} 👋`} subtitle={isPro ? "Pro üyelik ile sistemlerin tam güç çalışıyor." : "Projelerini buradan yönetebilirsin."} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                   {/* İstatistikler */}
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <StatCard title="Aktif Proje" value={projects.filter((p:any)=>p.status==='active').length} icon={<Briefcase size={20} />} color="blue" />
                      <StatCard title="Tamamlanan" value={projects.filter((p:any)=>p.status==='completed').length} icon={<CheckCircle2 size={20} />} color="green" />
                      <StatCard title="Kalan Hak" value={isPro ? "Sınırsız" : "1 Adet"} icon={<Zap size={20} />} color="orange" />
                   </div>
                   
                   {/* Proje Listesi */}
                   <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                         <h3 className="font-bold text-gray-900">Projelerim</h3>
                      </div>
                      <div className="divide-y divide-gray-50">
                         {projects.length > 0 ? (
                            projects.map((project: any) => (
                               <div key={project.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center gap-3">
                                     <div className={`p-2.5 rounded-xl shrink-0 ${project.status==='active'?'bg-blue-50 text-blue-600':'bg-green-50 text-green-600'}`}>
                                        {project.status==='active'?<Clock size={20}/>:<CheckCircle2 size={20}/>}
                                     </div>
                                     <div>
                                        <div className="font-bold text-sm text-gray-900">{project.name}</div>
                                        <div className="text-xs text-gray-500">{project.description}</div>
                                     </div>
                                  </div>
                                  
                                  <Link 
                                     href={`/dashboard/project/${project.id}`}
                                     className="text-xs font-bold bg-gray-100 hover:bg-black hover:text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto text-center"
                                  >
                                     Detay
                                  </Link>
                               </div>
                            ))
                         ) : (
                            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                  <Briefcase size={24} className="text-gray-300"/>
                               </div>
                               <p className="font-medium">Henüz hiç projen yok.</p>
                               <p className="text-xs mt-1">Hızlı işlemler menüsünden yeni bir talep oluştur.</p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Sağ Taraf */}
                <div className="space-y-6">
                   {!isPro && (
                       <div className="bg-gradient-to-br from-[#1a1a1a] to-black text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                           <div className="relative z-10">
                               <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center mb-4"><Zap className="text-yellow-400" fill="currentColor"/></div>
                               <h3 className="font-black text-lg mb-1">Pro'ya Yükselt</h3>
                               <p className="text-white/60 text-xs mb-4 leading-relaxed">Sınırsız otomasyon ve analizlere erişim sağla.</p>
                               <button className="w-full bg-white text-black py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">Planları İncele</button>
                           </div>
                       </div>
                   )}
                   
                   {/* --- HIZLI İŞLEMLER --- */}
                   <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                       <div className="p-4 border-b border-gray-100 font-bold text-xs text-gray-400 uppercase tracking-wider">Hızlı İşlemler</div>
                       <button 
                           onClick={() => setIsModalOpen(true)} 
                           className="w-full text-left p-4 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                       >
                           <Plus size={16} /> Yeni Talep Oluştur
                       </button>
                   </div>
                </div>
              </div>
           </div>
        )}

        {/* --- 2. ANALİZLER SEKMESİ --- */}
        {activeTab === 'analytics' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
               <Header title="Analizler" subtitle="Otomasyonlarının performans verileri." />
               
               <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!isPro ? 'blur-md pointer-events-none select-none opacity-60' : ''}`}>
                  <div className="col-span-1 md:col-span-2 h-72 bg-white rounded-2xl border border-gray-200 p-6 flex items-end justify-between gap-2 shadow-sm">
                      {[40, 60, 30, 80, 50, 90, 40, 70, 45, 60, 80, 95].map((h,i)=>(
                          <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group overflow-hidden">
                              <div style={{height: `${h}%`}} className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg"></div>
                          </div>
                      ))}
                  </div>
                  <div className="h-48 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-center text-gray-300 font-bold">Grafik 1</div>
                  <div className="h-48 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-center text-gray-300 font-bold">Grafik 2</div>
               </div>

               {!isPro && (
                   <div className="absolute inset-0 z-20 flex items-center justify-center">
                       <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 text-center max-w-md mx-4 transform hover:scale-105 transition-transform duration-300">
                           <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner">
                               <Lock size={32} />
                           </div>
                           <h2 className="text-2xl font-black text-gray-900 mb-2">Bu Özellik Kilitli 🔒</h2>
                           <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                               Detaylı performans analizleri sadece <span className="font-bold text-black"> Pro Plan</span> üyelerine özeldir.
                           </p>
                           <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all">
                               Pro'ya Yükselt - ₺899/Ay
                           </button>
                       </div>
                   </div>
               )}
            </div>
        )}

        {/* --- 3. PROFİL SEKMESİ --- */}
        {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <Header title="Profilim" subtitle="Hesap detayların." />
               
               <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                  <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-800"></div>
                  <div className="px-8 pb-8 relative">
                     <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg -mt-12 flex items-center justify-center text-3xl font-black text-gray-800">
                        {profile?.full_name?.charAt(0).toUpperCase()}
                     </div>
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-4 gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">{profile?.full_name}</h2>
                            <p className="text-gray-500 font-medium">{user.email}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wide border ${isPro ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                            {isPro ? 'Pro Üye' : 'Başlangıç Paket'}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                   <div>
                       <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mevcut Plan</div>
                       <div className="text-xl font-black text-gray-900">{isPro ? 'AutoStep PRO' : 'AutoStep Başlangıç'}</div>
                       <div className="text-sm text-gray-500 mt-1">
                           {isPro ? 'Sonraki ödeme: 12 Mart 2026' : 'Ömür boyu ücretsiz sürümdesiniz.'}
                       </div>
                   </div>
                   {!isPro && (
                       <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                           Planı Yükselt
                       </button>
                   )}
               </div>
            </div>
        )}

        {/* --- 4. AYARLAR SEKMESİ --- */}
        {activeTab === 'settings' && (
             <div className="max-w-3xl mx-auto flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in duration-300">
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                     <Settings size={32} className="text-gray-400" />
                 </div>
                 <h2 className="text-xl font-black text-gray-900">Ayarlar Yapım Aşamasında</h2>
                 <p className="text-gray-500 mt-2 max-w-sm">
                     Hesap ayarları, bildirimler ve entegrasyon seçenekleri çok yakında burada olacak.
                 </p>
             </div>
        )}

        {/* --- MODAL BİLEŞENİ --- */}
        <CreateProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />

      </main>
    </div>
  )
}

// --- YARDIMCI BİLEŞENLER ---

function SidebarBtn({ icon, text, active, onClick, badge }: any) {
    return (
        <button 
            onClick={onClick}
            className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all mb-1 
                ${active 
                    ? 'bg-[#1a1a1a] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                }
            `}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span>{text}</span>
            </div>
            {badge && <div>{badge}</div>}
        </button>
    )
}

function Header({ title, subtitle }: any) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
                <p className="text-gray-500 font-medium mt-1">{subtitle}</p>
            </div>
            <div className="flex gap-2">
                <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-black hover:border-black transition-colors shadow-sm">
                    <Bell size={20} />
                </button>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
       blue: 'bg-blue-50 text-blue-600',
       green: 'bg-green-50 text-green-600',
       orange: 'bg-orange-50 text-orange-600'
    }
    return (
       <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
             <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
          </div>
          <div>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
             <h4 className="text-2xl font-black text-gray-900">{value}</h4>
          </div>
       </div>
    )
}