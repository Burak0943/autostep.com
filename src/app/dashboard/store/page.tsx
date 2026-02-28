'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Check, Loader2, Search, ShieldCheck } from 'lucide-react'

export default function StorePage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_public', true)
        .order('price', { ascending: true })
      
      if (data) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    const { data } = await supabase.from('products').select('*').eq('access_code', code.trim().toUpperCase()).single()
    if (data) router.push(`/dashboard/store/checkout/${data.id}`)
    else alert('Geçersiz erişim kodu.')
    setLoading(false)
  }

  if (loading) return <div className="h-full flex items-center justify-center text-blue-500 py-20"><Loader2 className="animate-spin" size={32}/></div>

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 text-white font-sans min-h-screen">
      
      {/* ÜST SORGULAMA */}
      <div className="text-center mb-12">
        <h1 className="text-lg font-black mb-4 uppercase tracking-tighter italic">Özel Paket Sorgulama</h1>
        <form onSubmit={handleSearch} className="relative max-w-sm mx-auto">
          <input 
            type="text" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            placeholder="PRO-XXXX" 
            className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 px-6 text-center font-black focus:border-blue-500 outline-none transition-all text-sm tracking-widest text-white"
          />
          <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-600 p-1.5 rounded-lg hover:bg-blue-500 transition">
            <Search size={18} className="text-white"/>
          </button>
        </form>
      </div>

      {/* ANA BAŞLIK */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tighter italic leading-none">
          TEK SEFERLİK ÖDEME, <br /> <span className="text-blue-500 italic">ÖMÜR BOYU KULLANIM</span>
        </h2>
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-4">Abonelik yok, sürpriz faturalar yok.</p>
      </div>

      {/* PAKETLER (ANA SAYFA İLE BİREBİR AYNI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch px-2">
        {products.map((p, index) => {
          const isPro = p.access_code === 'PRO' || index === 1;

          return (
            <div 
              key={p.id} 
              className={`relative rounded-[2.5rem] p-8 md:p-10 flex flex-col transition-all duration-500 shadow-2xl 
                ${isPro 
                  ? 'bg-black text-white border border-white/10 scale-105 z-10 hover:scale-110 shadow-blue-500/10' 
                  : 'bg-white text-black hover:-translate-y-2'
                }`}
            >
              {/* ROZET */}
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20 whitespace-nowrap">
                  EN ÇOK TERCİH EDİLEN
                </div>
              )}

              {/* Üst Etiket */}
              {!isPro && (
                <div className="mb-6">
                  <span className="bg-gray-100 text-gray-400 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest">
                    {p.name === 'Başlangıç' ? 'GİRİŞİMCİ PAKETİ' : 'KURUMSAL ÇÖZÜM'}
                  </span>
                </div>
              )}

              {/* Başlık (İtalik) */}
              <div className={`mb-8 ${isPro ? 'pt-6' : ''}`}>
                <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-2 leading-none">{p.name}</h3>
                <p className={`text-[11px] font-bold leading-relaxed ${isPro ? 'text-gray-500' : 'text-gray-400'}`}>
                  {p.description}
                </p>
              </div>

              {/* FİYAT (Altındaki yazı tamamen kaldırıldı) */}
              <div className="mb-12 font-black">
                <p className="text-6xl md:text-7xl tracking-tighter italic">₺{p.price}</p>
              </div>

              {/* Avantajlar */}
              <div className="space-y-4 mb-12 flex-1">
                {['7/24 TEKNİK DESTEK', 'ANLIK BİLDİRİMLER', 'ÖZEL API ERİŞİMİ'].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-[12px] font-black tracking-tighter">
                    {isPro ? (
                      <CheckCircle2 size={18} className="text-blue-500 shrink-0 fill-blue-500 text-black"/>
                    ) : (
                      <Check size={18} className="text-blue-600 shrink-0" strokeWidth={4}/>
                    )}
                    <span className={isPro ? 'text-white' : 'text-gray-900'}>{feat}</span>
                  </div>
                ))}
              </div>

              {/* BUTON (Altındaki yazı tamamen kaldırıldı) */}
              <button 
                onClick={() => router.push(`/dashboard/store/checkout/${p.id}`)}
                className={`w-full py-5 rounded-2xl font-black text-sm transition-all uppercase italic tracking-widest
                  ${isPro 
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20' 
                    : 'bg-black text-white hover:opacity-90'
                  }`}
              >
                {p.name === 'Enterprise' ? 'TEKLİF İSTE' : 'HEMEN BAŞLA'}
              </button>
            </div>
          )
        })}
      </div>

      {/* ALT GÜVENLİK BİLGİSİ */}
      <div className="mt-20 flex flex-col items-center gap-4 opacity-20 pointer-events-none pb-10">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-white"/>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white">PAYTR GÜVENLİ ÖDEME SİSTEMİ</p>
        </div>
      </div>
    </div>
  )
}