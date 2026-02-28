import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function DistanceSalesPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-600">
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black italic tracking-tighter">AUTOSTEP</Link>
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-white transition flex items-center gap-2"><ArrowLeft size={16} /> Ana Sayfa</Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 opacity-60">
            <FileText size={24} className="text-orange-500"/>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Sözleşme</span>
        </div>
        
        <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none mb-12">
          MESAFELİ SATIŞ <br /> <span className="text-white/50">SÖZLEŞMESİ</span>
        </h1>

        <div className="prose prose-invert max-w-none text-gray-300 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight mb-2">1. Taraflar</h2>
            <p><strong>SATICI:</strong> Ahsan Çoban - AutoStep (Bundan sonra "SATICI" olarak anılacaktır)<br/>Adres: Hasanefendi - Ramazan Paşa Mah. Efeler / Aydın, 09100<br/>E-posta: destek@autostep.com.tr</p>
            <p><strong>ALICI:</strong> www.autostep.com sitesi üzerinden hizmet satın alan gerçek veya tüzel kişi.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight mb-2">2. Konu</h2>
            <p>İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini yaptığı, nitelikleri ve satış fiyatı belirtilen dijital hizmetin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight mb-2">3. Cayma Hakkı</h2>
            <p>İşbu sözleşme konusu hizmet; <strong>"Elektronik ortamda anında ifa edilen hizmetler"</strong> kapsamında olduğundan, Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi uyarınca ALICI'nın cayma (iade) hakkı bulunmamaktadır. Alıcı, satın alma işlemini onayladığında bu durumu peşinen kabul eder.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight mb-2">4. Teslimat Şekli</h2>
            <p>Hizmet, ödemenin PayTR altyapısı üzerinden onaylanmasını takiben, ALICI'nın panele erişim yetkisinin tanımlanması veya satın alınan dijital kodun e-posta/SMS yoluyla iletilmesi suretiyle anında teslim edilir.</p>
          </section>
        </div>
      </div>
    </div>
  )
}