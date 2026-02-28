'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  getAdminDashboardData, deleteProject, deleteUserAsAdmin, toggleUserBan 
} from '@/app/dashboard/actions'
import { 
  Users, Layers, Search, Trash2, ExternalLink, Database, 
  DollarSign, Ban, Unlock, Plus, Edit3, Package, RefreshCcw, Loader2, X,
  ArrowLeft, LogOut // <-- Çıkış butonları için ikonlar eklendi
} from 'lucide-react'

export default function AdminPanel() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'inventory'>('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Ürün Düzenleme State'leri
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function loadAllData() {
    setLoading(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    setUser(authUser)

    const result = await getAdminDashboardData()
    const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    
    if (!result) { router.push('/dashboard'); return }
    setData({ ...result, allProducts: products || [] })
    setLoading(false)
  }

  useEffect(() => { loadAllData() }, [])

  const handleBan = async (id: string, status: string) => {
    setActionLoading(id); await toggleUserBan(id, status); await loadAllData(); setActionLoading(null)
  }

  const handleDeleteUser = async (id: string) => {
    if(!confirm('Kullanıcı silinsin mi?')) return
    setActionLoading(id); await deleteUserAsAdmin(id); await loadAllData(); setActionLoading(null)
  }

  const handleDeleteProj = async (id: string) => {
    if(!confirm('Proje silinsin mi?')) return
    setActionLoading(id); await deleteProject(id); await loadAllData(); setActionLoading(null)
  }

  // ÜRÜN DÜZENLEME FONKSİYONU
  const handleEditClick = (product: any) => {
    setEditingProduct(product)
    setIsEditModalOpen(true)
  }

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    
    const updates = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      access_code: formData.get('access_code')
    }

    const { error } = await supabase.from('products').update(updates).eq('id', editingProduct.id)
    
    if (error) {
      alert('Güncelleme hatası: ' + error.message)
    } else {
      setIsEditModalOpen(false)
      loadAllData() // Verileri yenile
    }
    setIsSaving(false)
  }

  const filteredUsers = data?.users?.filter((u: any) => u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  
  // Gelişmiş Proje Arama (Ad, ID veya E-posta)
  const filteredProjects = data?.projects?.filter((p: any) => {
    const search = searchTerm.toLowerCase()
    const projectUser = data?.users?.find((u: any) => u.id === p.user_id)
    const userEmail = projectUser?.email?.toLowerCase() || ''
    return p.name.toLowerCase().includes(search) || p.user_id.toLowerCase().includes(search) || userEmail.includes(search)
  })
  
  const filteredProducts = data?.allProducts?.filter((pr: any) => pr.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading && !data) return <div className="h-screen bg-[#09090b] flex items-center justify-center text-white"><Loader2 className="animate-spin" size={32}/></div>

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8 font-sans relative">
      
      {/* --- YENİ EKLENEN ÜST BİLGİ VE ÇIKIŞ BUTONLARI --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Yönetim Paneli</h1>
          <p className="text-sm text-gray-500 mt-1">Sistem, kullanıcılar ve envanter yönetimi.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 px-4 py-2.5 bg-[#18181b] border border-white/10 rounded-xl hover:bg-white/10 transition text-sm font-bold text-gray-300 hover:text-white">
            <ArrowLeft size={16}/> Müşteri Paneline Dön
          </button>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 transition text-sm font-bold text-red-500 hover:text-white">
            <LogOut size={16}/> Çıkış Yap
          </button>
        </div>
      </div>

      {/* ÜST ÖZET */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#18181b] border border-white/5 p-6 rounded-2xl">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Toplam Gelir</p>
          <p className="text-2xl font-bold text-green-500">₺{data.stats.totalRevenue}</p>
        </div>
        <div className="bg-[#18181b] border border-white/5 p-6 rounded-2xl">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Kullanıcılar</p>
          <p className="text-2xl font-bold">{data.stats.totalUsers}</p>
        </div>
        <div className="bg-[#18181b] border border-white/5 p-6 rounded-2xl">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Aktif Projeler</p>
          <p className="text-2xl font-bold text-blue-500">{data.stats.activeProjects}</p>
        </div>
        <div className="bg-[#18181b] border border-white/5 p-6 rounded-2xl">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Sistem Yükü</p>
          <p className="text-2xl font-bold text-white">%12</p>
        </div>
      </div>

      {/* ARAÇ ÇUBUĞU VE TABLOLAR */}
      <div className="bg-[#18181b] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-black p-1 rounded-xl border border-white/5">
            <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'users' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>KULLANICILAR</button>
            <button onClick={() => setActiveTab('projects')} className={`px-6 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'projects' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>PROJELER</button>
            <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'inventory' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>ENVANTER</button>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
            <input type="text" placeholder="Ad, Email veya ID ile ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs focus:border-blue-500 outline-none text-white"/>
          </div>
        </div>

        <div className="p-4 overflow-x-auto min-h-[400px]">
          
          {/* KULLANICILAR TABLOSU */}
          {activeTab === 'users' && (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-gray-500 font-bold uppercase border-b border-white/5">
                  <th className="p-4">Kullanıcı Bilgisi</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4">
                      <p className="font-bold text-sm text-white">{u.full_name || 'İsimsiz'}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </td>
                    <td className="p-4 text-xs font-bold">
                      {u.status === 'banned' ? <span className="text-red-500">Engelli</span> : <span className="text-green-500">Aktif</span>}
                    </td>
                    <td className="p-4">
                      <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] uppercase font-bold text-gray-400">{u.subscription_tier || 'FREE'}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => {setActiveTab('projects'); setSearchTerm(u.id)}} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition" title="Projelerini Gör"><ExternalLink size={16}/></button>
                        <button onClick={() => handleBan(u.id, u.status)} className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition" title="Engelle/Kaldır">
                          {u.status === 'banned' ? <Unlock size={16}/> : <Ban size={16}/>}
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition" title="Sil"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PROJELER TABLOSU */}
          {activeTab === 'projects' && (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-gray-500 font-bold uppercase border-b border-white/5">
                  <th className="p-4">Proje Adı</th>
                  <th className="p-4">Kullanıcı Bilgisi</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4">Oluşturulma</th>
                  <th className="p-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProjects?.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500 text-sm">Hiç proje bulunamadı.</td></tr>
                ) : (
                  filteredProjects?.map((p: any) => {
                    const projectUser = data?.users?.find((u: any) => u.id === p.user_id)
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition">
                        <td className="p-4">
                          <p className="font-bold text-sm text-white">{p.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{p.description || 'Açıklama yok'}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-[10px] font-mono text-gray-400 bg-black border border-white/5 px-2 py-1 rounded inline-block break-all max-w-[220px]">
                            {p.user_id}
                          </p>
                          {projectUser && (
                            <p className="text-xs text-blue-500 mt-1 font-medium">{projectUser.email}</p>
                          )}
                        </td>
                        <td className="p-4 text-xs font-bold">
                          {p.status === 'completed' ? (
                              <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded">Tamamlandı</span>
                          ) : (
                              <span className="text-blue-500 bg-blue-500/10 px-2 py-1 rounded">Aktif</span>
                          )}
                        </td>
                        <td className="p-4 text-xs text-gray-500">
                          {new Date(p.created_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => router.push(`/dashboard/projects/${p.id}`)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition" title="Projeyi Görüntüle">
                              <ExternalLink size={16}/>
                            </button>
                            <button onClick={() => handleDeleteProj(p.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition" title="Projeyi Sil">
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}

          {/* ENVANTER BÖLÜMÜ */}
          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
              <div onClick={() => router.push('/dashboard/admin/products')} className="border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-white/20 transition cursor-pointer group">
                <Plus size={32} className="text-gray-500 group-hover:text-white transition"/>
                <p className="text-xs font-bold mt-4 text-gray-400 group-hover:text-white">Yeni Ürün Ekle</p>
              </div>
              {filteredProducts?.map((prod: any) => (
                <div key={prod.id} className="bg-black border border-white/5 p-6 rounded-2xl flex flex-col hover:border-white/10 transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-white">{prod.name}</h3>
                    <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-gray-400">{prod.access_code}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 line-clamp-2">{prod.description}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-lg font-bold text-white">₺{prod.price}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(prod)} className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition" title="Ürünü Düzenle"><Edit3 size={16}/></button>
                      <button onClick={async () => {
                         if(confirm('Ürünü silmek istediğinize emin misiniz?')) {
                             await supabase.from('products').delete().eq('id', prod.id);
                             loadAllData();
                         }
                      }} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition" title="Ürünü Sil"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-between text-[10px] text-gray-600 font-mono italic">
        <span>Oturum: {user?.id}</span>
        <span>Son Senkronizasyon: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* --- ÜRÜN DÜZENLEME MODALI --- */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-gray-700 w-full max-w-md rounded-2xl p-6 relative">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X size={20}/>
            </button>
            <h2 className="text-xl font-bold mb-6 text-white uppercase tracking-tight">Ürün Düzenle</h2>
            
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-bold uppercase">Ürün Adı</label>
                <input name="name" type="text" defaultValue={editingProduct.name} required className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none transition"/>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-bold uppercase">Erişim Kodu (örn: PRO)</label>
                <input name="access_code" type="text" defaultValue={editingProduct.access_code} required className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none transition uppercase"/>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block font-bold uppercase">Fiyat (₺)</label>
                <input name="price" type="number" defaultValue={editingProduct.price} required className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none transition"/>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block font-bold uppercase">Açıklama</label>
                <textarea name="description" rows={3} defaultValue={editingProduct.description} className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none transition resize-none"/>
              </div>

              <button type="submit" disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition uppercase mt-2">
                {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}