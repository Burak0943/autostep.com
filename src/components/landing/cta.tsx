'use client'

import { motion } from 'framer-motion'
import { CalendarDays, ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Arkaplan - Koyu Gradient */}
      <div className="absolute inset-0 bg-zinc-900 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-50"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Projenizi Hayata Geçirelim
          </h2>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            Aklınızdaki soruları yanıtlamak ve size özel çözüm haritasını çıkarmak için ekibimizle 30 dakikalık ücretsiz bir görüşme ayarlayın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* CALENDLY BUTONU */}
            {/* href kısmına kendi Calendly linkini yapıştıracaksın */}
            <a 
              href="https://calendly.com/ekip-dopsistemi/30dk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-white text-zinc-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/20"
            >
              <CalendarDays className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
              Toplantı Planla
              <ArrowRight className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" size={20} />
            </a>
            
            <button className="px-8 py-4 text-white border border-zinc-700 rounded-full font-medium hover:bg-zinc-800 transition-colors">
              Bize Ulaşın
            </button>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            * Kredi kartı gerekmez. Ön görüşme tamamen ücretsizdir.
          </p>
        </motion.div>
      </div>
    </section>
  )
}