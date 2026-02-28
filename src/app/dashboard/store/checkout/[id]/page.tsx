'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck, Lock, CreditCard, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react'

export default function CheckoutPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProduct() {
      // id parametresine göre ürünü veritabanından çekiyoruz
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) setProduct(data)
      setLoading(false)
    }
    getProduct()
  }, [id])

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-blue-500"><Loader2 className="animate-spin" /></div>
  if (!product) return <div className="h-screen bg-black flex items-center justify-center text-white">Ürün bulunamadı.</div>

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition text-sm">
        <ChevronLeft size={16} /> Mağazaya Dön
      </button>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* SOL: SİPARİŞ ÖZETİ */}
        <div className="space-y-8">
          <h1 className="text-3xl font-bold mb-2">Ödeme Detayları</h1>
          <div className="bg-[#18181b] border border-white/5 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-blue-500">{product.name}</h3>
            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Paket Tutarı</span>
                <span>₺{product.price}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-green-500 pt-4">
                <span>Toplam Ödeme</span>
                <span>₺{product.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: ÖDEME FORMU (PAYTR GELECEK YER) */}
        <div className="bg-[#18181b] border border-white/10 rounded-[40px] p-8 flex flex-col items-center justify-center text-center shadow-2xl">
            <Lock className="text-blue-500 mb-4" size={40}/>
            <h2 className="text-xl font-bold">Güvenli Ödeme Formu</h2>
            <p className="text-gray-500 text-xs mt-2 px-8 mb-8">PayTR API entegrasyonu tamamlandığında kart giriş alanı burada görünecektir.</p>
            <div className="w-full h-48 bg-black/50 border border-dashed border-white/10 rounded-2xl flex items-center justify-center italic text-gray-700">
                PayTR Checkout Iframe
            </div>
        </div>
      </div>
    </div>
  )
}