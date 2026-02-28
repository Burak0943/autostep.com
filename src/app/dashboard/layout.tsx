'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, FolderKanban, BarChart3, Settings, 
  LogOut, ShieldAlert, Menu, X, Loader2, ShoppingBag, 
  MessageSquare // İkon eklendi
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkUserStatus() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', user.id)
        .single()

      if (profile?.status === 'banned') { router.replace('/banned'); return }
      if (profile?.role === 'admin' || user.email === 'cobanahsan@gmail.com') { setIsAdmin(true) }
      setIsChecking(false)
    }
    checkUserStatus()
  }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (pathname.startsWith('/dashboard/admin')) {
      return <>{children}</>
  }

  if (isChecking) {
      return <div className="h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin text-blue-500"/></div>
  }

  // MENÜ LİSTESİNE MESAJLAR EKLENDİ
  const menuItems = [
    { name: 'Panel', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projeler', href: '/dashboard/projects', icon: FolderKanban },
    { name: 'Mağaza', href: '/dashboard/store', icon: ShoppingBag },
    { name: 'Mesajlar', href: '/dashboard/dm', icon: MessageSquare }, // Yeni eklenen sekme
    { name: 'Analizler', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* --- SABİT SOL SIDEBAR --- */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#09090b] shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white mr-3">A</div>
           <span className="font-bold text-lg tracking-wide">AutoStep</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
           {menuItems.map((item) => (
               <button
                 key={item.href}
                 onClick={() => router.push(item.href)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                   pathname === item.href ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                 }`}
               >
                 <item.icon size={18} /> {item.name}
               </button>
           ))}

           {isAdmin && (
             <div className="mt-8 pt-6 border-t border-white/5 space-y-1">
                <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Yönetim</p>
                <button onClick={() => router.push('/dashboard/admin')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-900/10 transition">
                    <ShieldAlert size={18}/> Admin Paneli
                </button>
             </div>
           )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition text-sm">
            <LogOut size={18}/> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* --- ANA İÇERİK ALANI --- */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        
        {/* Mobil Header */}
        <div className="md:hidden h-16 border-b border-white/10 flex items-center justify-between px-4 bg-black shrink-0">
            <span className="font-bold">AutoStep</span>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2"><Menu size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-black custom-scrollbar">
            {children}
        </div>
      </main>

      {/* MOBİL MENÜ MODALI */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#09090b] border-r border-white/10 p-6">
                <div className="flex justify-between items-center mb-8">
                    <span className="font-bold text-xl">AutoStep</span>
                    <button onClick={() => setIsMobileMenuOpen(false)}><X size={20}/></button>
                </div>
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button key={item.href} onClick={() => {router.push(item.href); setIsMobileMenuOpen(false)}} className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 text-left text-gray-300 transition-colors">
                            <item.icon size={20}/> {item.name}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
      )}
    </div>
  )
}