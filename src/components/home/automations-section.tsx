import { Cog, Database, Share2, FileText } from 'lucide-react'

const automations = [
  {
    icon: <Cog className="w-7 h-7 text-blue-600" strokeWidth={2} />,
    title: 'E-ticaret Entegrasyonu',
    description: 'Siparişleri, stokları ve müşteri verilerini tüm pazaryerleriyle otomatik senkronize edin.',
    color: 'bg-blue-50',
    // Glow rengi
    glowColor: 'from-blue-400/20 to-blue-600/20',
    borderColor: 'group-hover:border-blue-200'
  },
  {
    icon: <Database className="w-7 h-7 text-purple-600" strokeWidth={2} />,
    title: 'Veri Analiz Robotu',
    description: 'Büyük veri setlerini analiz edin, anlık raporlar ve eyleme dönüştürülebilir içgörüler alın.',
    color: 'bg-purple-50',
    // Glow rengi
    glowColor: 'from-purple-400/20 to-purple-600/20',
    borderColor: 'group-hover:border-purple-200'
  },
  {
    icon: <Share2 className="w-7 h-7 text-indigo-600" strokeWidth={2} />,
    title: 'Sosyal Medya Asistanı',
    description: 'Gönderileri planlayın, etkileşimleri takip edin ve performans raporlarını otomatik oluşturun.',
    color: 'bg-indigo-50',
    // Glow rengi
    glowColor: 'from-indigo-400/20 to-indigo-600/20',
    borderColor: 'group-hover:border-indigo-200'
  },
  {
    icon: <FileText className="w-7 h-7 text-pink-600" strokeWidth={2} />,
    title: 'Raporlama Otomasyonu',
    description: 'Haftalık ve aylık finans/performans raporlarını tek tıkla hazırlayın ve dağıtın.',
    color: 'bg-pink-50',
    // Glow rengi
    glowColor: 'from-pink-400/20 to-pink-600/20',
    borderColor: 'group-hover:border-pink-200'
  },
]

export default function AutomationsSection() {
  return (
    <section id="automations" className="py-24 bg-white relative z-10 overflow-hidden">
      <div className="container px-4 mx-auto">
        
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-[40px] font-black text-[#1a1a1a] mb-4 tracking-tight">
            OTOMASYONLAR
          </h2>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            İş süreçlerinizi hızlandıracak, insan hatasını sıfıra indirecek akıllı çözümlerimizle tanışın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {automations.map((item, index) => (
            // Dış Kapsayıcı (Glow için)
            <div key={index} className="relative group h-full">
              {/* Arka Plan Parlaması (Glow Effect) */}
              <div className={`absolute -inset-4 bg-gradient-to-br ${item.glowColor} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
              
              {/* Kartın Kendisi */}
              <div className={`bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] border-2 border-gray-50 ${item.borderColor} transition-all duration-300 hover:-translate-y-2 relative overflow-hidden h-full flex flex-col z-10`}>
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-[#1a1a1a] mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-[15px] font-medium leading-relaxed flex-grow">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}