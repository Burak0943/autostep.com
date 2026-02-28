'use client'

import { useTransition, useEffect } from 'react'
import { createProject } from '@/app/dashboard/actions'
import { X, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

// Modal dışarıdan yönetilecek, bu yüzden props alıyor
interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProjectModal({ isOpen, onClose }: ModalProps) {
  const [isPending, startTransition] = useTransition()

  // Modal kapandığında formu sıfırlamak veya işlem yapmak istersen burayı kullanabilirsin
  useEffect(() => {
    if (!isOpen) {
      // Modal kapandı
    }
  }, [isOpen])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      // Server Action'ı çağır
      const result = await createProject(null, formData)
      
      if (result.status === 'success') {
        toast.success(result.message)
        onClose() // Başarılıysa kapat
      } else {
        toast.error(result.message)
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
        
        {/* Modal Başlık */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-xl font-extrabold text-black">Yeni Proje Oluştur</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Proje Adı */}
          <div>
            <label className="block text-sm font-extrabold text-black mb-2">Proje Adı</label>
            <input 
              name="name"
              required
              placeholder="Örn: Mobil Uygulama Tasarımı"
              className="w-full p-3 bg-white text-black font-medium border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Açıklama (Fiyat yerine bunu kullanıyoruz çünkü DB'de bu var) */}
          <div>
            <label className="block text-sm font-extrabold text-black mb-2">Açıklama</label>
            <textarea 
              name="description"
              rows={3}
              placeholder="Proje detayları..."
              className="w-full p-3 bg-white text-black font-medium border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-all resize-none"
            />
          </div>

          {/* Alt Butonlar */}
          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-white text-black border-2 border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              Kaydet
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}