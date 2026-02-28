import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Mail, Shield, FileText, HelpCircle, Activity, MapPin, Clock, Phone, ChevronRight } from 'lucide-react'

// --- İÇERİK VERİLERİ (Aynı kalıyor, tasarımı aşağıda değiştiriyoruz) ---
const pages: any = {
  'yardim-merkezi': {
    title: 'Yardım Merkezi',
    icon: <HelpCircle size={40} className="text-blue-600" />,
    description: 'Aklınıza takılan tüm soruların cevapları burada.',
    content: [
      { type: 'header', text: 'Sıkça Sorulan Sorular' },
      { type: 'question', title: 'Otomasyonları nasıl kurarım?', text: 'Panelinizden "Yeni Otomasyon" butonuna tıklayıp, size uygun şablonu seçerek 3 adımda kurulumu tamamlayabilirsiniz.' },
      { type: 'question', title: 'Ücretsiz deneme süresi bitince ne olur?', text: '7 günlük deneme süreniz bittiğinde, kartınızdan otomatik çekim yapılmaz. Kullanıma devam etmek için bir paket seçmeniz gerekir.' },
      { type: 'question', title: 'Fatura alabilir miyim?', text: 'Evet, ödeme işleminin hemen ardından kurumsal faturanız kayıtlı e-posta adresinize gönderilir.' },
      { type: 'header', text: 'Teknik Destek' },
      { type: 'info_box', text: 'Eğer sorunuzun cevabını burada bulamadıysanız, canlı destek ekibimiz 7/24 hizmetinizdedir. Sağ alttaki chat balonunu kullanabilirsiniz.' }
    ]
  },
  'hizmet-durumu': {
    title: 'Sistem Durumu',
    icon: <Activity size={40} className="text-green-600" />,
    description: 'AutoStep platformunun anlık performans ve sağlık raporu.',
    content: [
      { type: 'status', label: 'API Gateway', status: 'operational' },
      { type: 'status', label: 'Web Dashboard', status: 'operational' },
      { type: 'status', label: 'Veritabanı Kümeleri', status: 'operational' },
      { type: 'status', label: 'Otomasyon Motoru (V2)', status: 'operational' },
      { type: 'info_box', text: 'Tüm sistemler %99.99 uptime oranıyla sorunsuz çalışmaktadır.' }
    ]
  },
  'gizlilik-politikasi': {
    title: 'Gizlilik Politikası',
    icon: <Shield size={40} className="text-purple-600" />,
    description: 'Verilerinizi nasıl koruduğumuza dair şeffaf bilgilendirme.',
    content: [
      { type: 'header', text: '1. Veri Toplama ve Kullanım' },
      { type: 'text', text: 'AutoStep olarak gizliliğinize saygı duyuyoruz. Hizmetlerimizi kullanırken adınız, e-posta adresiniz ve kullanım verileriniz gibi temel bilgileri topluyoruz. Bu veriler sadece hizmet kalitesini artırmak amacıyla kullanılır.' },
      { type: 'header', text: '2. Veri Güvenliği' },
      { type: 'text', text: 'Kullanıcı verileri, endüstri standardı şifreleme yöntemleri (AES-256) ile korunmaktadır. Kredi kartı bilgileriniz sunucularımızda saklanmaz.' },
      { type: 'header', text: '3. Paylaşım İzni' },
      { type: 'text', text: 'Kişisel verileriniz, yasal zorunluluklar haricinde üçüncü taraflarla asla paylaşılmaz, satılmaz veya kiralanmaz.' }
    ]
  },
  'kullanim-sartlari': {
    title: 'Kullanım Şartları',
    icon: <FileText size={40} className="text-orange-600" />,
    description: 'Hizmet kullanımına dair yasal sözleşme ve kurallar.',
    content: [
      { type: 'header', text: '1. Taraflar ve Amaç' },
      { type: 'text', text: 'Bu sözleşme, AutoStep platformuna üye olan kullanıcı ile şirketimiz arasındaki kullanım şartlarını belirler.' },
      { type: 'header', text: '2. Hesap Sorumluluğu' },
      { type: 'text', text: 'Hesap bilgilerinizin ve şifrenizin güvenliğinden tamamen kullanıcı sorumludur. Hesabınız üzerinden yapılan tüm işlemler sizin sorumluluğunuzdadır.' },
      { type: 'header', text: '3. İptal Politikası' },
      { type: 'text', text: 'Aboneliğinizi dilediğiniz zaman panel üzerinden iptal edebilirsiniz. İptal işlemi, bir sonraki fatura döneminden itibaren geçerli olur.' }
    ]
  },
  'iletisim': {
    title: 'İletişim',
    icon: <Mail size={40} className="text-pink-600" />,
    description: 'Projeleriniz için bize ulaşın, size yardımcı olalım.',
    content: [
      { type: 'grid_start' }, // Grid başlatıcı
      { type: 'contact_card', title: 'Merkez Ofis', text: 'Maslak Mah. Büyükdere Cad. No:123, Sarıyer / İstanbul', icon: <MapPin size={24} /> },
      { type: 'contact_card', title: 'E-posta', text: 'destek@autostep.com', icon: <Mail size={24} /> },
      { type: 'contact_card', title: 'Telefon', text: '+90 (212) 555 00 00', icon: <Phone size={24} /> },
      { type: 'contact_card', title: 'Çalışma Saatleri', text: 'Pazartesi - Cuma: 09:00 - 18:00', icon: <Clock size={24} /> },
      { type: 'grid_end' } // Grid bitirici
    ]
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function GenericPage(props: Props) {
  const params = await props.params;
  const slug = params.slug;
  const page = pages[slug];

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-black text-gray-900 mb-4">Sayfa Bulunamadı</h1>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          Ana Sayfaya Dön
        </Link>
      </div>
    )
  }

  return (
    // MODERN ARKA PLAN: Hafif gri + Grid deseni
    <div className="min-h-screen bg-[#F9FAFB] relative py-20 px-4 md:px-8 font-sans">
      
      {/* Dekoratif Arka Plan Deseni */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Üst Navigasyon */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-gray-200/50 shadow-sm hover:shadow-md">
          <ArrowLeft size={16} /> Ana Sayfaya Dön
        </Link>

        {/* ANA KART: Tüm içeriği tutan gölgeli, beyaz kutu */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            
            {/* Header Alanı */}
            <div className="p-8 md:p-12 border-b border-gray-50 bg-gradient-to-b from-gray-50/50 to-white">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* İkon Kutusu */}
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] border border-gray-100 shrink-0">
                        {page.icon}
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">{page.title}</h1>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">{page.description}</p>
                    </div>
                </div>
            </div>

            {/* İçerik Gövdesi */}
            <div className="p-8 md:p-12">
                <div className="space-y-8 max-w-none">
                    {page.content.map((item: any, i: number) => {
                        
                        // Başlık Tasarımı
                        if (item.type === 'header') {
                            return (
                                <div key={i} className="mt-10 mb-4 flex items-center gap-3">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">{item.text}</h2>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                            )
                        }
                        
                        // Soru-Cevap (Accordion Tarzı)
                        if (item.type === 'question') {
                            return (
                                <div key={i} className="group bg-gray-50 hover:bg-white p-6 rounded-2xl border border-transparent hover:border-gray-200 transition-all duration-300 hover:shadow-lg">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">?</span> 
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed pl-9">{item.text}</p>
                                </div>
                            )
                        }

                        // Sistem Durumu Satırı
                        if (item.type === 'status') {
                            return (
                                <div key={i} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <span className="font-bold text-gray-700 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                        {item.label}
                                    </span>
                                    <span className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        Operasyonel
                                    </span>
                                </div>
                            )
                        }

                        // Bilgi Kutusu (Mavi)
                        if (item.type === 'info_box') {
                            return (
                                <div key={i} className="p-5 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100 text-sm font-medium flex gap-3">
                                    <div className="shrink-0 mt-0.5">ℹ️</div>
                                    {item.text}
                                </div>
                            )
                        }

                        // Grid Başlat/Bitir (İletişim için)
                        if (item.type === 'grid_start') return <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>;
                        if (item.type === 'grid_end') return null;

                        // İletişim Kartı (Daha şık)
                        if (item.type === 'contact_card') {
                            return (
                                <div key={i} className="flex flex-col p-6 bg-white rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors mb-4">
                                        {item.icon}
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.title}</div>
                                    <div className="text-lg font-bold text-gray-900">{item.text}</div>
                                </div>
                            )
                        }

                        // Grid içi eleman render'ı (Manuel grid wrapper yoksa diye fallback)
                        if (slug === 'iletisim' && item.type === 'contact_card') return null; // Grid içinde render edilecek

                        // Normal Yazı
                        return <p key={i} className="text-lg text-gray-600 leading-relaxed">{item.text}</p>
                    })}

                    {/* İletişim Sayfası İçin Özel Grid Render */}
                    {slug === 'iletisim' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-4">
                            {page.content.filter((x:any) => x.type === 'contact_card').map((item:any, idx:number) => (
                                <div key={idx} className="flex flex-col p-6 bg-white rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors mb-4">
                                        {item.icon}
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.title}</div>
                                    <div className="text-lg font-bold text-gray-900">{item.text}</div>
                                </div>
                            ))}
                         </div>
                    )}

                </div>
            </div>

            {/* Footer Bilgisi */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400">
                <span>Son Güncelleme: 08.02.2026</span>
                <span className="flex items-center gap-1">AutoStep Inc. <Shield size={10}/></span>
            </div>
        </div>
      </div>
    </div>
  )
}