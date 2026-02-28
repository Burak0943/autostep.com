import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

const pricingPlans = [
  {
    name: 'Başlangıç',
    price: '500', 
    description: 'Bireysel girişimciler ve yeni başlayanlar için temel paket.',
    features: ['1 Kullanıcı', '3 Temel Otomasyon', 'Günlük Veri Senkronizasyonu', 'E-posta Desteği', 'Temel Raporlama'],
  },
  {
    name: 'Pro',
    price: '899',
    isPopular: true,
    description: 'Büyüyen ekipler ve profesyonel işletmeler için tam güç.',
    features: ['5 Kullanıcı', 'Sınırsız Otomasyon', 'Anlık Veri Senkronizasyonu', 'Öncelikli Canlı Destek', 'Gelişmiş Analitik & API', 'Özel Entegrasyon (1 Adet)'],
  },
  {
    name: 'Enterprise',
    price: 'Özel',
    description: 'Kurumsal ihtiyaçlar için ölçeklenebilir altyapı.',
    features: ['Sınırsız Kullanıcı', 'Tüm Özellikler Sınırsız', 'Özel Sunucu Altyapısı', '7/24 Dedike Destek', 'Size Özel Hesap Yöneticisi', 'SLA Garantisi'],
    isEnterprise: true
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 relative bg-white z-10 border-t border-gray-100 overflow-hidden">
      
      {/* Arka plan dekoratif daireler */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[80px] -z-10"></div>

      <div className="container px-4 mx-auto relative">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-[#1a1a1a] mb-3 tracking-tight">
            TEK SEFERLİK ÖDEME, <span className="text-blue-600">ÖMÜR BOYU KULLANIM</span>
          </h2>
          <p className="text-base text-gray-600 font-medium max-w-xl mx-auto leading-relaxed">
            Abonelik yok, sürpriz faturalar yok. İhtiyacınıza uygun paketi seçin, 7 gün ücretsiz deneyin.
          </p>
        </div>

        {/* Max-Width değerini küçülttük (1150px -> 1000px) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-center">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`
                relative rounded-3xl p-6 flex flex-col h-full transition-all duration-300
                ${plan.isPopular 
                  ? 'bg-[#1a1a1a] text-white shadow-2xl md:scale-105 z-20 border border-gray-800' // Scale 110 -> 105 yaptık
                  : 'bg-white text-gray-900 border border-gray-100 hover:border-blue-100 hover:shadow-lg'
                }
              `}
            >
              
              {plan.isPopular && (
                <div className="absolute -top-12 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent blur-xl -z-10"></div>
              )}

              {/* Banner Alanı */}
              <div className="flex justify-between items-start mb-4">
                <div className={`text-[10px] font-black uppercase tracking-widest py-1 px-2.5 rounded-md inline-flex items-center gap-1 ${plan.isPopular ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                   {plan.isPopular && <Sparkles size={10} />}
                   {plan.isPopular ? 'EN ÇOK TERCİH EDİLEN' : '7 GÜN ÜCRETSİZ DENE'}
                </div>
              </div>

              <div className="mb-6">
                {/* Başlık Boyutu Küçüldü (2xl -> xl) */}
                <h3 className={`text-xl font-black mb-1 ${plan.isPopular ? 'text-white' : 'text-black'}`}>{plan.name}</h3>
                <p className={`text-xs font-medium leading-relaxed ${plan.isPopular ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                
                {/* Fiyat Alanı */}
                <div className="mt-5 flex flex-col">
                   <div className="flex items-start gap-1">
                      {!plan.isEnterprise && <span className={`text-xl font-bold mt-1 ${plan.isPopular ? 'text-gray-400' : 'text-gray-400'}`}>$</span>}
                      {/* Fiyat Fontu Küçüldü (6xl -> 5xl) */}
                      <span className={`text-5xl font-black tracking-tighter ${plan.isPopular ? 'text-white' : 'text-black'}`}>
                        {plan.price}
                      </span>
                   </div>
                   {!plan.isEnterprise && (
                     <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${plan.isPopular ? 'text-gray-500' : 'text-gray-400'}`}>
                       Tek Seferlik Ödeme
                     </span>
                   )}
                </div>
              </div>

              {/* Çizgi */}
              <div className={`h-px w-full mb-6 ${plan.isPopular ? 'bg-gray-800' : 'bg-gray-100'}`}></div>

              {/* Liste Aralığı Küçüldü (space-y-5 -> space-y-3) */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2.5 text-sm font-bold">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${plan.isPopular ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Check size={12} strokeWidth={4} />
                    </div>
                    <span className={plan.isPopular ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-2">
                {/* Buton Padding Küçüldü (py-4 -> py-3) */}
                <Link href={plan.isEnterprise ? "/contact" : "/signup"} className={`w-full block py-3 rounded-xl font-bold text-sm transition-all text-center hover:scale-[1.02] active:scale-[0.98] ${
                  plan.isPopular 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30' 
                    : 'bg-black hover:bg-gray-800 text-white shadow-md'
                }`}>
                  {plan.isEnterprise ? 'Teklif İste' : 'Hemen Başla'}
                </Link>
                
                {!plan.isEnterprise && (
                  <p className={`text-center mt-3 text-[10px] font-medium ${plan.isPopular ? 'text-gray-500' : 'text-gray-400'}`}>
                    Kredi kartı gerekmez.
                  </p>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}