'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Briefcase, 
  Settings, 
  LogOut, 
  ShieldAlert,
  BarChart3
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkRole() {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.user_metadata?.role === 'admin') {
            setIsAdmin(true)
        }
    }
    checkRole()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuItems = [
    { name: 'Panel', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mesajlar', href: '/dashboard/dm', icon: MessageSquare },
    { name: 'Projeler', href: '/dashboard/projects', icon: Briefcase },
    { name: 'Analizler', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    // ÖNEMLİ DEĞİŞİKLİK:
    // 'fixed' KALDIRILDI.
    // 'w-64': Genişlik sabit.
    // 'shrink-0': Alan daralırsa sakın küçülme, hep 256px kal.
    <div className="w-64 h-full bg-[#09090b] border-r border-gray-800 flex flex-col justify-between p-4 shrink-0">
      
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-2 px-4 mb-8 mt-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                A
            </div>
            <span className="font-bold text-xl text-white">AutoStep</span>
        </div>

        {/* LİNKLER */}
        <nav className="space-y-1">
            {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                            isActive 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <item.icon size={20} />
                        {item.name}
                    </Link>
                )
            })}

            {isAdmin && (
                <Link 
                    href="/dashboard/admin"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold mt-4 border border-red-900/30 ${
                        pathname === '/dashboard/admin' 
                        ? 'bg-red-600 text-white' 
                        : 'text-red-500 hover:bg-red-900/20'
                    }`}
                >
                    <ShieldAlert size={20} />
                    Admin Paneli
                </Link>
            )}
        </nav>
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
      >
        <LogOut size={20} />
        Çıkış Yap
      </button>
    </div>
  )
}