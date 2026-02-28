import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Sol taraf: Metin Alanı */}
          <div className="flex-1 text-center lg:text-left space-y-6 lg:max-w-[45%]">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-[#1a1a1a] leading-[1.1] tracking-tight">
              İşinizi <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 inline-block pb-2">
                Otomatiğe Bağlayın
              </span>
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Verimliliği keşfedin. Büyümeye odaklanın. Tekrar eden operasyonel işleri akıllı robotlarımıza bırakın.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/#pricing" className="w-full sm:w-auto bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 text-center">
                Hemen Başla
              </Link>
              <Link href="/#automations" className="w-full sm:w-auto bg-white text-gray-700 font-bold py-4 px-8 rounded-2xl border-2 border-gray-100 transition-all hover:border-blue-100 hover:bg-blue-50/50 text-center">
                Keşfet
              </Link>
            </div>
          </div>

          {/* Sağ taraf: Dashboard Görseli (CSS Mockup) */}
          <div className="flex-1 relative w-full lg:w-[55%] perspective-1000 mt-10 lg:mt-0">
            {/* Arka plandaki glow efekti */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-200/40 via-purple-200/30 to-pink-200/20 blur-3xl -z-10 rounded-full opacity-70"></div>
            
            {/* CSS ile oluşturulmuş Dashboard Simülasyonu */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-white/60 bg-white/80 backdrop-blur-xl transform lg:rotate-y-[-5deg] lg:rotate-x-[5deg] lg:hover:rotate-y-0 lg:hover:rotate-x-0 transition-all duration-700 ease-out">
                
                {/* Tarayıcı Üst Barı */}
                <div className="bg-gray-50/80 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto w-1/2 h-2 bg-gray-200 rounded-full opacity-50"></div>
                </div>

                {/* Dashboard İçeriği (Vektörel Çizim) */}
                <div className="p-6 grid grid-cols-4 gap-4 bg-white/50 h-[350px] md:h-[400px]">
                   {/* Sidebar Temsili */}
                   <div className="col-span-1 space-y-3 hidden sm:block">
                      <div className="h-8 w-full bg-gray-900 rounded-lg opacity-10"></div>
                      <div className="h-4 w-3/4 bg-gray-400 rounded opacity-20"></div>
                      <div className="h-4 w-3/4 bg-gray-400 rounded opacity-20"></div>
                      <div className="h-4 w-3/4 bg-gray-400 rounded opacity-20"></div>
                      <div className="h-4 w-2/4 bg-gray-400 rounded opacity-20 mt-4"></div>
                   </div>
                   
                   {/* Ana İçerik Temsili */}
                   <div className="col-span-4 sm:col-span-3 space-y-4">
                      {/* Üst Kartlar */}
                      <div className="flex gap-4">
                         <div className="flex-1 h-24 bg-blue-50 border border-blue-100 rounded-xl relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400"></div>
                         </div>
                         <div className="flex-1 h-24 bg-purple-50 border border-purple-100 rounded-xl relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-400"></div>
                         </div>
                      </div>
                      
                      {/* Grafik Alanı */}
                      <div className="h-40 md:h-52 bg-gray-50 border border-gray-100 rounded-xl flex items-end justify-around pb-4 px-4 relative">
                         {/* Grid Çizgileri */}
                         <div className="absolute inset-0 border-b border-gray-200/50" style={{top: '25%'}}></div>
                         <div className="absolute inset-0 border-b border-gray-200/50" style={{top: '50%'}}></div>
                         <div className="absolute inset-0 border-b border-gray-200/50" style={{top: '75%'}}></div>
                         
                         {/* Bar Çubukları */}
                         <div className="w-6 md:w-8 h-[40%] bg-blue-400 rounded-t-md opacity-80 z-10"></div>
                         <div className="w-6 md:w-8 h-[70%] bg-blue-500 rounded-t-md z-10"></div>
                         <div className="w-6 md:w-8 h-[50%] bg-blue-400 rounded-t-md opacity-80 z-10"></div>
                         <div className="w-6 md:w-8 h-[90%] bg-purple-500 rounded-t-md z-10 shadow-lg shadow-purple-500/20"></div>
                         <div className="w-6 md:w-8 h-[60%] bg-blue-400 rounded-t-md opacity-80 z-10"></div>
                      </div>
                   </div>
                </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Dekoratif Arka Plan Şekilleri */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-100/50 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-20%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]"></div>
      </div>
    </section>
  )
}