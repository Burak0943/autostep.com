import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Zap, Check, User, Search, Globe, ArrowRight, 
  ShoppingCart, BarChart2, Share2, FileText,
  Mail, MapPin, MessageCircle, Calendar 
} from 'lucide-react'

export default async function LandingPage() {
  // 1. KULLANICI KONTROLÜ
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a] selection:bg-blue-100">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
               <Zap size={20} fill="currentColor" className="text-yellow-400" />
             </div>
             <span className="text-xl font-black tracking-tight">AutoStep</span>
          </div>

          {/* Menü Linkleri */}
          <div className="hidden md:flex items-center gap-4 text-sm font-bold text-gray-500">
             <Link href="#features" className="hover:text-black transition-colors px-3 py-2">Otomasyonlar</Link>
             <Link href="#meeting" className="hover:text-black transition-colors px-3 py-2">Toplantı</Link>
             <Link href="#pricing" className="hover:text-black transition-colors px-3 py-2">Fiyatlandırma</Link>
             
             {/* İletişim Butonu (Animasyonlu) */}
             <Link href="/iletisim" className="group relative px-5 py-2.5 rounded-full overflow-hidden bg-gray-50 text-gray-900 border border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ml-2">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-blue-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <div className="relative flex items-center gap-2">
                   <MessageCircle size={16} className="text-blue-600 group-hover:scale-110 transition-transform"/>
                   <span>İletişim</span>
                </div>
             </Link>
          </div>

          {/* Giriş Yap Butonu */}
          <Link href="/login" className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
             <User size={16} /> <span className="hidden sm:inline">Giriş Yap</span>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-0 w-[50%] h-[50%] bg-blue-100 rounded-full blur-[150px] opacity-40 animate-pulse delay-1000"></div>
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
         </div>

         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 pt-12 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* SOL YAZI */}
            <div className="flex-1 text-center lg:text-left space-y-8">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 mx-auto lg:mx-0">
                    <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Yapay Zeka Destekli v2.0
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-gray-900">
                İşinizi <br className="hidden lg:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Otomatiğe</span> Bağlayın
                </h1>
                
                <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Kodlama bilmeden iş süreçlerinizi hızlandırın. AutoStep ile verimliliği artırın, zamandan tasarruf edin ve büyümeye odaklanın.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                    <Link href="/login" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1">
                        Hemen Başla <ArrowRight size={20}/>
                    </Link>
                    <Link href="#pricing" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:-translate-y-1">
                        Planları Gör
                    </Link>
                </div>
            </div>
            
            {/* SAĞ DASHBOARD GÖRSELİ */}
            <div className="flex-1 w-full transform hover:scale-[1.01] transition-transform duration-700 relative z-10">
                <div className="relative bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-1000 delay-200">
                    <div className="h-12 border-b border-gray-100 bg-white flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="ml-4 flex-1 bg-gray-50 h-8 rounded-lg max-w-sm border border-gray-100 flex items-center px-3 text-xs text-gray-400 gap-2">
                            <Search size={14} /> auto-step.com/dashboard
                        </div>
                    </div>
                    <div className="flex h-[450px] bg-gray-50">
                        <div className="w-60 bg-white border-r border-gray-100 hidden md:flex flex-col p-4 gap-2 shrink-0">
                            <div className="h-8 w-24 bg-gray-100 rounded mb-6 animate-pulse"></div>
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className="h-10 w-full bg-gray-50 rounded-lg flex items-center px-3 gap-3">
                                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                    <div className="w-20 h-3 bg-gray-100 rounded"></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 p-6 overflow-hidden flex flex-col">
                            <div className="flex justify-between items-end mb-6 shrink-0">
                                <div>
                                    <div className="h-7 w-40 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                                </div>
                                <div className="h-9 w-28 bg-black rounded-lg"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-6 shrink-0">
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"><div className="w-8 h-8 bg-blue-50 rounded-lg mb-3"></div><div className="h-6 w-20 bg-gray-200 rounded mb-1"></div><div className="h-2 w-12 bg-gray-100 rounded"></div></div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"><div className="w-8 h-8 bg-green-50 rounded-lg mb-3"></div><div className="h-6 w-20 bg-gray-200 rounded mb-1"></div><div className="h-2 w-12 bg-gray-100 rounded"></div></div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"><div className="w-8 h-8 bg-purple-50 rounded-lg mb-3"></div><div className="h-6 w-20 bg-gray-200 rounded mb-1"></div><div className="h-2 w-12 bg-gray-100 rounded"></div></div>
                            </div>
                            <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 relative overflow-hidden flex items-end gap-2">
                                <div className="absolute inset-x-0 bottom-0 h-full opacity-[0.05]" style={{backgroundImage: 'linear-gradient(0deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                                {[40, 70, 45, 90, 60, 80, 50, 75, 60, 95, 70, 85].map((h, i) => (
                                    <div key={i} className="flex-1 bg-blue-500 rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* --- OTOMASYONLAR --- */}
      <section id="features" className="py-24 bg-gray-50 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Otomasyonlar</h2>
                <p className="text-gray-500 mt-4 max-w-2xl mx-auto">İş süreçlerinizi hızlandıracak, insan hatasını sıfıra indirecek akıllı çözümlerimizle tanışın.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <FeatureCard icon={<ShoppingCart size={28} className="text-blue-600" />} title="E-ticaret Entegrasyonu" text="Siparişleri, stokları ve müşteri verilerini tüm pazaryerleriyle otomatik senkronize edin." />
               <FeatureCard icon={<BarChart2 size={28} className="text-purple-600" />} title="Veri Analiz Robotu" text="Büyük veri setlerini analiz edin, anlık raporlar ve eyleme dönüştürülebilir içgörüler alın." />
               <FeatureCard icon={<Share2 size={28} className="text-pink-600" />} title="Sosyal Medya Asistanı" text="Gönderileri planlayın, etkileşimleri takip edin ve performans raporlarını otomatik oluşturun." />
               <FeatureCard icon={<FileText size={28} className="text-orange-600" />} title="Raporlama Otomasyonu" text="Haftalık ve aylık finans/performans raporlarını tek tıkla hazırlayın ve dağıtın." />
            </div>
         </div>
      </section>

      {/* --- CALENDLY TOPLANTI MODÜLÜ (GÜNCELLENDİ) --- */}
      <section id="meeting" className="py-24 bg-white border-t border-gray-100">
         <div className="max-w-6xl mx-auto px-6">
             <div className="text-center mb-12">
                 <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                     <Calendar size={14} /> Ücretsiz Danışmanlık
                 </div>
                 <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Projenizi Hayata Geçirelim</h2>
                 <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                     Aklınızdaki soruları yanıtlamak ve size özel çözüm haritasını çıkarmak için ekibimizle 30 dakikalık ücretsiz bir görüşme ayarlayın.
                 </p>
             </div>

             {/* Calendly Iframe */}
             <div className="w-full h-[700px] bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden shadow-2xl">
                 <iframe 
                    src="https://calendly.com/autostep-tr/30-dakikalik-ucretsiz-danismanlik" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0"
                    title="Calendly Randevu Sistemi"
                 ></iframe>
             </div>
         </div>
      </section>

      {/* --- FİYATLANDIRMA --- */}
      <section id="pricing" className="py-24 px-6 bg-gray-50 border-t border-gray-100">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                    TEK SEFERLİK ÖDEME, <span className="text-blue-600">ÖMÜR BOYU KULLANIM</span>
                </h2>
                <p className="text-gray-500 mt-4">Abonelik yok, sürpriz faturalar yok. İhtiyacınıza uygun paketi seçin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
               <PricingCard 
                 title="Başlangıç" price="$500" desc="Bireysel girişimciler ve yeni başlayanlar için temel paket."
                 features={['1 Kullanıcı', '3 Temel Otomasyon', 'Günlük Veri Senkronizasyonu', 'E-posta Desteği', 'Temel Raporlama']}
               />
               <div className="bg-[#111] text-white p-8 rounded-3xl shadow-2xl relative transform hover:scale-105 transition-transform duration-300 border border-gray-800 ring-4 ring-blue-600/20">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">EN ÇOK TERCİH EDİLEN</div>
                  <h3 className="text-2xl font-black mb-2">Pro</h3>
                  <p className="text-gray-400 text-sm mb-6">Büyüyen ekipler ve profesyonel işletmeler için tam güç.</p>
                  <div className="text-5xl font-black mb-1">$899</div>
                  <div className="text-gray-500 text-xs font-bold uppercase mb-8">TEK SEFERLİK ÖDEME</div>
                  <ul className="space-y-4 mb-8">
                     {['5 Kullanıcı', 'Sınırsız Otomasyon', 'Anlık Veri Senkronizasyonu', 'Öncelikli Canlı Destek', 'Gelişmiş Analitik & API', 'Özel Entegrasyon (1 Adet)'].map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-300"><div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0"><Check size={12} strokeWidth={4} /></div>{feat}</li>
                     ))}
                  </ul>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-900/50">Hemen Başla</button>
                  <p className="text-center text-gray-500 text-xs mt-4">Kredi kartı gerekmez.</p>
               </div>
               <PricingCard 
                 title="Enterprise" price="Özel" desc="Kurumsal ihtiyaçlar için ölçeklenebilir altyapı."
                 features={['Sınırsız Kullanıcı', 'Tüm Özellikler Sınırsız', 'Özel Sunucu Altyapısı', '7/24 Dedike Destek', 'Size Özel Hesap Yöneticisi', 'SLA Garantisi']}
                 btnText="Teklif İste" blackBtn={true}
               />
            </div>
         </div>
      </section>

      {/* --- FOOTER (PayTR Uyumlu Yasal Linklerle) --- */}
      <footer className="bg-black text-white py-16 border-t border-gray-800">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
               
               {/* Kolon 1: Logo */}
               <div className="space-y-4">
                   <div className="flex items-center gap-2">
                       <Zap size={20} fill="currentColor" className="text-yellow-400" />
                       <span className="text-xl font-black">AutoStep</span>
                   </div>
                   <p className="text-gray-500 text-sm leading-relaxed">
                       İşletmeler için yapay zeka destekli otomasyon çözümleri.
                   </p>
               </div>

               {/* Kolon 2: Hızlı Erişim */}
               <div className="flex flex-col gap-3 text-sm text-gray-400">
                   <h4 className="font-bold text-white mb-2">Hızlı Erişim</h4>
                   <Link href="#features" className="hover:text-white transition-colors">Otomasyonlar</Link>
                   <Link href="#meeting" className="hover:text-white transition-colors">Toplantı Al</Link>
                   <Link href="#pricing" className="hover:text-white transition-colors">Fiyatlandırma</Link>
               </div>

               {/* Kolon 3: Kurumsal & Yasal Metinler */}
               <div className="flex flex-col gap-3 text-sm text-gray-400">
                   <h4 className="font-bold text-white mb-2">Kurumsal & Yasal</h4>
                   <Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link>
                   <Link href="/iptal-iade" className="hover:text-white transition-colors">İptal ve İade Koşulları</Link>
                   <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
                   <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</Link>
               </div>

               {/* Kolon 4: İletişim */}
               <div className="flex flex-col gap-4 text-sm text-gray-400">
                   <h4 className="font-bold text-white mb-2">Destek</h4>
                   <div className="flex items-center gap-3 group">
                       <Mail size={16} className="text-blue-500"/>
                       <span className="group-hover:text-white transition-colors">destek@autostep.com.tr</span>
                   </div>
                   <div className="flex items-center gap-3 group">
                       <MapPin size={16} className="text-purple-500 shrink-0"/>
                       <span className="group-hover:text-white transition-colors">Hasanefendi - Ramazan Paşa Mah. Efeler / Aydın</span>
                   </div>
               </div>

            </div>

            {/* Alt Telif ve Güvenli Ödeme */}
            <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
               <p>© 2026 AutoStep Inc. Tüm hakları saklıdır.</p>
               <div className="flex items-center gap-4">
                   <span>Güvenli Ödeme Altyapısı</span>
                   <div className="font-black text-white tracking-widest">PayTR</div> 
               </div>
            </div>
         </div>
      </footer>
    </div>
  )
}

// --- YARDIMCI BİLEŞENLER ---

function FeatureCard({ icon, title, text }: any) {
    return (
       <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                {icon}
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-black transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors">{text}</p>
          </div>
       </div>
    )
}

function PricingCard({ title, price, desc, features, btnText = "Hemen Başla", blackBtn = false }: any) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gray-100 w-fit px-3 py-1 rounded-lg text-[10px] font-bold text-gray-500 uppercase mb-4">7 GÜN ÜCRETSİZ DENE</div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm mb-6">{desc}</p>
            <div className="text-5xl font-black text-gray-900 mb-1">{price}</div>
            <div className="text-gray-400 text-xs font-bold uppercase mb-8">TEK SEFERLİK ÖDEME</div>
            <ul className="space-y-4 mb-8">
                {features.map((feat: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600"><Check size={16} className="text-blue-600 shrink-0" />{feat}</li>
                ))}
            </ul>
            <button className={`w-full py-4 rounded-xl font-bold transition-colors ${blackBtn ? 'bg-black text-white hover:bg-gray-800' : 'bg-black text-white hover:bg-gray-800'}`}>{btnText}</button>
            {!blackBtn && <p className="text-center text-gray-400 text-xs mt-4">Kredi kartı gerekmez.</p>}
        </div>
    )
}