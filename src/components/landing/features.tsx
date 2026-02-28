'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, BarChart2 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: "Yıldırım Hızında",
    description: "Next.js 15 ve Supabase altyapısı ile işlemleriniz milisaniyeler içinde gerçekleşir."
  },
  {
    icon: Shield,
    title: "Kurumsal Güvenlik",
    description: "Verileriniz RLS (Row Level Security) ve şifreleme teknolojileri ile güvende."
  },
  {
    icon: BarChart2,
    title: "Detaylı Analiz",
    description: "Dashboard üzerinden tüm metrikleri gerçek zamanlı takip edin ve raporlayın."
  }
]

export default function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden AutoStep?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            İhtiyacınız olan tüm araçlar tek bir çatı altında. Karmaşık entegrasyonlarla uğraşmayın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}