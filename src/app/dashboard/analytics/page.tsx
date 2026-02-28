'use client'

import { useEffect, useState } from 'react'
import { getAnalyticsData, upgradeToPro } from '@/app/dashboard/actions'
import { 
  TrendingUp, Users, Eye, Activity, Calendar, Download, Rocket, 
  CreditCard, ArrowUpRight, ArrowDownRight, Loader2, Lock, Sparkles
} from 'lucide-react'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const result = await getAnalyticsData()
      setData(result)
      setLoading(false)
    }
    load()
  }, [])

  const downloadReport = () => {
    if (!data?.metrics || data.metrics.length === 0) {
        alert("İndirilecek veri yok.")
        return
    }
    let csvContent = "data:text/csv;charset=utf-8,Tarih,Ciro,Ziyaretci,Abone\r\n"
    data.metrics.forEach((row: any) => {
        csvContent += `${row.date},${row.revenue},${row.visitors},${row.subscribers}\r\n`
    })
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "analiz_raporu.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleUpgrade = async () => {
      if(confirm("Hesabınızı Pro Plana yükseltmek istiyor musunuz?")) {
          setLoading(true)
          await upgradeToPro()
          window.location.reload()
      }
  }

  if (loading) return <div className="h-full flex items-center justify-center text-white"><Loader2 className="animate-spin text-blue-500"/></div>

  // --- GRAFİK HESAPLAMALARI (Gerçek Veri Yoksa Düz Çizgi) ---
  const hasData = data?.metrics && data.metrics.length > 0
  const maxRevenue = hasData ? Math.max(...data.metrics.map((m: any) => Number(m.revenue))) : 100
  
  // Eğer veri yoksa boş bir çizgi göster
  const chartPoints = hasData 
      ? data.metrics.map((m: any, i: number) => {
          const x = (i / (data.metrics.length - 1)) * 100
          const y = 100 - ((Number(m.revenue) / (maxRevenue || 1)) * 80) // %80 yükseklik kullan
          return `${x},${y}`
      }).join(' ')
      : "0,90 100,90" // Düz çizgi

  return (
    <div className="text-white font-sans p-8 max-w-7xl mx-auto min-h-screen">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-2">
                    Performans Analizi
                </h1>
                <p className="text-gray-400 text-sm">Gerçek zamanlı işletme verileriniz.</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
                <div className="bg-zinc-900 border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500"/> Son 7 Gün
                </div>
                <button 
                    onClick={downloadReport}
                    className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                    <Download size={14}/> Raporu İndir
                </button>
            </div>
        </div>

        {/* --- 1. KUTUCUKLAR (KPI CARDS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            {/* CİRO KARTI */}
            <div className="group bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
                    <CreditCard size={40} className="text-blue-500"/>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Toplam Ciro</p>
                <h2 className="text-3xl font-bold text-white mb-2">₺{data?.summary.revenue.toLocaleString()}</h2>
                {data?.summary.revenue > 0 ? (
                     <p className="text-green-500 text-xs font-bold flex items-center gap-1"><ArrowUpRight size={12}/> Aktif Gelir</p>
                ) : (
                     <p className="text-gray-600 text-xs flex items-center gap-1">Henüz gelir yok</p>
                )}
            </div>

            {/* ABONE KARTI */}
            <div className="group bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-purple-500/30 transition duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
                    <Users size={40} className="text-purple-500"/>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Toplam Abone</p>
                <h2 className="text-3xl font-bold text-white mb-2">{data?.summary.subscribers}</h2>
                <p className="text-gray-600 text-xs">Aktif üyelikler</p>
            </div>

            {/* ZİYARETÇİ KARTI */}
            <div className="group bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-orange-500/30 transition duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
                    <Eye size={40} className="text-orange-500"/>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Ziyaretçiler</p>
                <h2 className="text-3xl font-bold text-white mb-2">{data?.summary.visitors.toLocaleString()}</h2>
                <p className="text-gray-600 text-xs">Tekil görüntülenme</p>
            </div>

             {/* AKTİF OTURUM */}
             <div className="group bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-green-500/30 transition duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
                    <Activity size={40} className="text-green-500"/>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Canlı Oturum</p>
                <h2 className="text-3xl font-bold text-white mb-2">{data?.summary.activeSessions}</h2>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <p className="text-green-500 text-xs font-bold">Sistem Aktif</p>
                </div>
            </div>
        </div>

        {/* --- PRO BÖLÜMÜ (KİLİTLİ ALAN) --- */}
        <div className="relative">
            
            {/* --- KİLİT EKRANI (GLASSMORPHISM) --- */}
            {!data?.isPro && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#09090b] p-8 rounded-2xl border border-white/10 text-center max-w-md shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600/5 blur-3xl"></div>
                        <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/20">
                            <Sparkles size={28} className="text-white"/>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-white">Pro Analizlerin Kilidini Aç</h3>
                        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                            Gelir büyüme grafikleri, detaylı müşteri listeleri ve yapay zeka destekli tahminleri görmek için planınızı yükseltin.
                        </p>
                        <button 
                            onClick={handleUpgrade}
                            className="bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition w-full flex items-center justify-center gap-2"
                        >
                            <Rocket size={18} className="text-blue-600"/> Pro'ya Yükselt
                        </button>
                    </div>
                </div>
            )}

            {/* --- İÇERİK (Pro Değilse Bulanık ve Soluk) --- */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 ${!data?.isPro ? 'opacity-10 pointer-events-none filter grayscale' : ''}`}>
                
                {/* GRAFİK: GELİR ANALİZİ */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-white">Gelir Grafiği</h3>
                            <p className="text-gray-500 text-xs">Günlük ciro hareketleri.</p>
                        </div>
                        {hasData ? (
                             <span className="text-green-500 text-xs bg-green-500/10 px-2 py-1 rounded">+ Veri Akışı Var</span>
                        ) : (
                             <span className="text-gray-500 text-xs bg-gray-500/10 px-2 py-1 rounded">Veri Yok</span>
                        )}
                    </div>
                    
                    {/* SVG Chart */}
                    <div className="h-64 w-full relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible preserve-3d">
                            {/* Gridler */}
                            <line x1="0" y1="25" x2="100" y2="25" stroke="#333" strokeWidth="0.2"/>
                            <line x1="0" y1="50" x2="100" y2="50" stroke="#333" strokeWidth="0.2"/>
                            <line x1="0" y1="75" x2="100" y2="75" stroke="#333" strokeWidth="0.2"/>
                            <line x1="0" y1="100" x2="100" y2="100" stroke="#333" strokeWidth="0.5"/>

                            {/* Gradyan Tanımı */}
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            
                            {/* Dolgu Alanı */}
                             <polygon 
                                points={`0,100 ${chartPoints} 100,100`} 
                                fill="url(#chartGradient)" 
                            />

                            {/* Çizgi */}
                            <polyline 
                                points={chartPoints} 
                                fill="none" 
                                stroke="#3b82f6" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                        
                        {/* Tarihler */}
                        <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-mono uppercase">
                             {hasData 
                                ? data.metrics.map((m:any) => <span key={m.date}>{new Date(m.date).toLocaleDateString('tr-TR', {day:'2-digit', month:'2-digit'})}</span>)
                                : <span>--/--</span>
                             }
                        </div>
                    </div>
                </div>

                {/* LİSTE: SON SATIŞLAR */}
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg text-white">Son Müşteriler</h3>
                        <p className="text-gray-500 text-xs">Son yapılan işlemler.</p>
                    </div>
                    
                    <div className="space-y-4">
                        {data?.sales.length === 0 ? (
                            <div className="text-center py-10 text-gray-600 text-xs">
                                Henüz satış kaydı yok.
                            </div>
                        ) : (
                            data?.sales.map((sale: any) => (
                                <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/5 cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-white text-xs border border-white/10 shadow-inner">
                                            {sale.avatar_text}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-200">{sale.customer_name}</p>
                                            <p className="text-xs text-gray-500">{sale.customer_email}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm text-green-400">+₺{sale.amount.toLocaleString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

             {/* TRAFİK BARI */}
            <div className={`bg-zinc-900/50 border border-white/5 p-6 rounded-2xl ${!data?.isPro ? 'opacity-10 pointer-events-none filter grayscale' : ''}`}>
                 <div className="mb-6">
                    <h3 className="font-bold text-lg text-white">Trafik Yoğunluğu</h3>
                    <p className="text-gray-500 text-xs">Günlere göre ziyaretçi dağılımı.</p>
                 </div>
                 <div className="h-32 flex items-end gap-2">
                    {hasData ? data.metrics.map((m: any) => {
                         const h = (m.visitors / (Math.max(...data.metrics.map((x:any)=>Number(x.visitors))) || 1)) * 100;
                         return (
                            <div key={m.date} className="flex-1 flex flex-col justify-end group cursor-pointer">
                                <div className="w-full bg-zinc-800 rounded-t-sm group-hover:bg-blue-500 transition-all duration-300 relative" style={{ height: `${h}%` }}>
                                     {/* Tooltip */}
                                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition shadow-lg pointer-events-none">
                                        {m.visitors}
                                     </div>
                                </div>
                            </div>
                         )
                    }) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Veri yok</div>
                    )}
                 </div>
            </div>
        </div>
    </div>
  )
}