'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Save, Copy, Loader2, Check } from 'lucide-react'

export default function AdminProductsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // Rastgele Kod Üret (Örn: AHS-X92Z)
    const code = 'PRO-' + Math.random().toString(36).substring(2, 8).toUpperCase()

    const { error } = await supabase.from('products').insert({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        monthly_fee: formData.get('monthly_fee'),
        access_code: code
    })

    if (!error) {
        setGeneratedCode(code)
        alert('Ürün oluşturuldu! Kod: ' + code)
        ;(e.target as HTMLFormElement).reset()
    } else {
        alert('Hata oluştu.')
    }
    setLoading(false)
  }

  return (
    <div className="p-8 text-white max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Plus className="text-blue-500"/> Özel Ürün Oluştur
        </h1>

        <div className="bg-[#121214] p-6 rounded-xl border border-gray-800">
            <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Müşteri / Ürün Adı</label>
                    <input name="name" required placeholder="Örn: Ahmet Bey - Instagram Botu" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Açıklama</label>
                    <textarea name="description" rows={3} placeholder="Hizmet detayları..." className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Kurulum Ücreti (₺)</label>
                        <input name="price" type="number" required placeholder="5000" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm focus:border-green-500 outline-none"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Aylık Bakım (₺)</label>
                        <input name="monthly_fee" type="number" required placeholder="500" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none"/>
                    </div>
                </div>
                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin"/> : <Save size={18}/>}
                    Ürünü Oluştur ve Kod Al
                </button>
            </form>

            {generatedCode && (
                <div className="mt-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg flex justify-between items-center animate-in fade-in">
                    <div>
                        <p className="text-xs text-green-400 font-bold mb-1">ÜRÜN KODU OLUŞTURULDU</p>
                        <p className="text-xl font-mono font-bold text-white tracking-widest">{generatedCode}</p>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(generatedCode)} className="p-2 bg-green-600 hover:bg-green-500 text-white rounded transition">
                        <Copy size={18}/>
                    </button>
                </div>
            )}
        </div>
    </div>
  )
}