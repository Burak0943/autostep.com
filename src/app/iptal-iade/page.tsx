import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-600">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-blue-600/20">A</div>
            <span className="text-2xl font-black italic tracking-tighter">AUTOSTEP</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-white transition flex items-center gap-2">
             <ArrowLeft size={16} /> Ana Sayfaya Dön
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 opacity-60">
            <ShieldCheck size={24} className="text-blue-500"/>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Yasal Bilgilendirme</span>
        </div>
        
        <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none mb-12">
          İPTAL VE İADE <br /> <span className="text-white/50">KOŞULLARI</span>
        </h1>

        <div className="prose prose-invert max-w-none text-gray-300 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4 border-b border-white/10 pb-2">1. Dijital Hizmetlerin İadesi</h2>
            <p className="text-sm leading-relaxed">
              AutoStep tarafından sunulan hizmetler (AI entegrasyonları, otomasyon yazılımları, özel panel kurulumları) dijital içerikli hizmetler kapsamına girmektedir. 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin (ğ) bendi uyarınca; <strong>elektronik ortamda anında ifa edilen hizmetler ve tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz.</strong>
            </p>
            <p className="text-sm leading-relaxed mt-4">
              Bu nedenle, kullanıcının hesabına tanımlanan, erişime açılan veya kod/yazılım teslimatı yapılan projelerde ücret iadesi yapılmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4 border-b border-white/10 pb-2">2. İptal Koşulları (Hizmet Başlamadan Önce)</h2>
            <p className="text-sm leading-relaxed">
              Satın alma işlemi gerçekleştirildikten sonra, eğer AutoStep ekibi tarafından projenin altyapı kurulumuna, kodlanmasına veya otomasyon entegrasyonuna <strong>henüz başlanmamışsa</strong>, müşteri siparişin iptalini ve tam iadesini talep edebilir. İptal talepleri destek@autostep.com.tr adresi üzerinden sipariş numarası iletilerek yapılmalıdır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4 border-b border-white/10 pb-2">3. Hatalı veya Ayıplı Hizmet Durumu</h2>
            <p className="text-sm leading-relaxed">
              Tarafımızdan sağlanan yazılım veya otomasyon sisteminde, sözleşmede veya ürün sayfasında belirtilen ana fonksiyonların çalışmaması (ayıplı hizmet) durumunda, AutoStep sistemi düzeltmekle yükümlüdür. Teknik ekibimiz tarafından çözülemeyen majör bir altyapı sorunu tespit edilirse, hizmet bedeli kısmen veya tamamen iade edilebilir. Müşteri kaynaklı kullanım hataları bu kapsama girmez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4 border-b border-white/10 pb-2">4. İade Süreci</h2>
            <p className="text-sm leading-relaxed">
              Onaylanan iade taleplerinde, iade tutarı müşterinin ödeme yaptığı kredi kartına / banka hesabına en geç 14 (on dört) iş günü içerisinde iade edilir. İade işleminin müşterinin banka hesaplarına yansıma süresi bankaların işlem sürelerine bağlı olarak değişiklik gösterebilir; bu gecikmelerden AutoStep sorumlu tutulamaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4 border-b border-white/10 pb-2">5. Yetkili Mahkeme</h2>
            <p className="text-sm leading-relaxed">
              İşbu İptal ve İade Koşulları'nın uygulanmasından doğabilecek her türlü uyuşmazlıkta, T.C. Gümrük ve Ticaret Bakanlığı tarafından her yıl ilan edilen değere kadar Alıcının yerleşim yerindeki veya hizmetin satın alındığı yerdeki Tüketici Hakem Heyetleri, söz konusu değerin üzerindeki uyuşmazlıklarda ise Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Son Güncelleme: 14 Şubat 2026</p>
        </div>
      </div>
    </div>
  )
}