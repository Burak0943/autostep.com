"use client";

import { useState, useTransition } from 'react'
import { login, signup, loginWithGoogle } from '@/app/login/actions'
import { Loader2, Zap, Check, ShieldCheck, Mail } from 'lucide-react'
import { toast } from 'sonner'

// --- GOOGLE ICON SVG ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
)

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  // State'ler
  const [isHuman, setIsHuman] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  const handleAuth = (event: React.FormEvent<HTMLFormElement>, mode: 'login' | 'signup') => {
    event.preventDefault()

    if (mode === 'signup' && !isHuman) {
      toast.error('Lütfen robot olmadığınızı doğrulayın.')
      return
    }

    const formData = new FormData(event.currentTarget)
    
    startTransition(async () => {
      const action = mode === 'login' ? login : signup
      const result = await action(formData)

      // --- TİP KORUMALI HATA KONTROLÜ ---
      if (result && 'error' in result) {
        toast.error(result.error)
        return
      }

      // --- BAŞARI DURUMU ---
      if (mode === 'signup') {
        // Kayıt başarılıysa modalı göster (signup action return { success: true } döner)
        setShowVerifyModal(true)
      } else {
        // Giriş başarılıysa toast göster (redirect zaten server-side yapılıyor)
        toast.success('Giriş başarılı!')
      }
    })
  }

  const handleGoogleLogin = () => {
    startTransition(async () => {
      await loginWithGoogle()
    })
  }

  const toggleCaptcha = () => {
    if (isHuman) {
      setIsHuman(false)
      return
    }
    setIsChecking(true)
    setTimeout(() => {
      setIsChecking(false)
      setIsHuman(true)
    }, 600)
  }

  const inputClasses = "w-full p-3 bg-gray-50 text-black border-2 border-gray-200 rounded-lg font-bold outline-none focus:border-black transition-all placeholder:text-gray-500 text-sm"

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-[1000px] min-h-[700px] border border-gray-200 font-sans">
      
      {/* --- 1. KAYIT OL FORMU (SIGN UP) --- */}
      <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out w-full md:w-1/2 left-0 
        ${isSignUp ? 'md:translate-x-full opacity-100 z-50' : 'opacity-0 z-0'}
        ${isSignUp ? 'block' : 'hidden md:block'} 
      `}>
        <form 
          onSubmit={(e) => handleAuth(e, 'signup')}
          className="bg-white flex flex-col items-center justify-center h-full px-10 text-center"
        >
          <h1 className="font-black text-3xl mb-4 text-black tracking-tight">Hesap Oluştur</h1>
          
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-6 py-2.5 hover:bg-gray-50 hover:border-gray-300 transition-all mb-4 group"
          >
            <GoogleIcon />
            <span className="text-sm font-bold text-gray-800 group-hover:text-black">Google ile kayıt ol</span>
          </button>

          <span className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">veya email kullan</span>
          
          <div className="w-full space-y-3">
            <input name="full_name" type="text" placeholder="Ad Soyad" required className={inputClasses} />
            <input name="phone" type="tel" placeholder="Telefon Numarası" required className={inputClasses} />
            <input name="email" type="email" placeholder="Email" required className={inputClasses} />
            <input name="password" type="password" placeholder="Şifre (Min. 6 karakter)" required minLength={6} className={inputClasses} />
          </div>

          {/* CAPTCHA */}
          <div className="w-full mt-4 flex justify-center">
            <div 
              onClick={toggleCaptcha}
              className="w-full max-w-[300px] bg-[#f9f9f9] border border-[#d3d3d3] rounded-[3px] p-3 flex items-center justify-between shadow-sm cursor-pointer select-none hover:bg-[#f0f0f0] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 bg-white border-2 rounded-[2px] flex items-center justify-center transition-all
                  ${isHuman ? 'border-transparent' : 'border-[#c1c1c1]'}
                `}>
                  {isChecking ? (
                    <Loader2 className="animate-spin text-blue-500" size={18} />
                  ) : isHuman ? (
                    <Check className="text-green-500 font-bold" size={24} strokeWidth={4} />
                  ) : null}
                </div>
                <span className="text-sm font-medium text-[#222]">Ben bir insanım</span>
              </div>
              <div className="flex flex-col items-center justify-center text-gray-400 opacity-60">
                <ShieldCheck size={20} className="mb-0.5" />
                <span className="text-[9px] font-bold leading-none mb-[2px]">reCAPTCHA</span>
                <div className="text-[8px] flex gap-1 font-bold leading-none uppercase tracking-tighter">
                  <span>Privacy</span>
                  <span>-</span>
                  <span>Terms</span>
                </div>
              </div>
            </div>
          </div>
          
          <button disabled={isPending} className="mt-6 bg-black text-white py-3.5 px-12 rounded-lg font-black uppercase tracking-widest hover:bg-gray-900 transition-transform active:scale-95 disabled:opacity-70 text-sm shadow-lg w-full">
            {isPending ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Kayıt Ol'}
          </button>

          <p className="mt-6 md:hidden text-xs font-bold text-gray-500" onClick={() => setIsSignUp(false)}>
            Zaten hesabın var mı? <span className="text-black underline cursor-pointer">Giriş Yap</span>
          </p>
        </form>
      </div>

      {/* --- 2. GİRİŞ YAP FORMU (SIGN IN) --- */}
      <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out w-full md:w-1/2 left-0 z-20
        ${isSignUp ? 'md:translate-x-full opacity-0' : 'opacity-100'}
        ${isSignUp ? 'hidden md:block' : 'block'}
      `}>
        <form 
          onSubmit={(e) => handleAuth(e, 'login')}
          className="bg-white flex flex-col items-center justify-center h-full px-10 text-center"
        >
          <h1 className="font-black text-3xl mb-4 text-black tracking-tight">Giriş Yap</h1>
          
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-6 py-2.5 hover:bg-gray-50 hover:border-gray-300 transition-all mb-5 group"
          >
            <GoogleIcon />
            <span className="text-sm font-bold text-gray-800 group-hover:text-black">Google ile giriş yap</span>
          </button>

          <span className="text-xs font-bold text-gray-500 mb-5 uppercase tracking-widest">veya bilgilerini gir</span>
          
          <div className="w-full space-y-3">
            <input name="email" type="email" placeholder="Email" required className={inputClasses} />
            <input name="password" type="password" placeholder="Şifre" required className={inputClasses} />
          </div>
          
          <a href="#" className="text-xs font-black text-gray-500 mt-5 mb-2 hover:text-black hover:underline transition-all uppercase tracking-tighter">Şifreni mi unuttun?</a>
          
          <button disabled={isPending} className="mt-4 bg-black text-white py-3.5 px-12 rounded-lg font-black uppercase tracking-widest hover:bg-gray-900 transition-transform active:scale-95 disabled:opacity-70 text-sm shadow-lg w-full">
            {isPending ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Giriş Yap'}
          </button>

          <p className="mt-6 md:hidden text-xs font-bold text-gray-500" onClick={() => setIsSignUp(true)}>
            Hesabın yok mu? <span className="text-black underline cursor-pointer">Kayıt Ol</span>
          </p>
        </form>
      </div>

      {/* --- 3. KAYAN SİYAH PANEL (OVERLAY) --- */}
      <div className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-100 
        rounded-l-[100px] rounded-r-[0px] shadow-[0_0_80px_-10px_rgba(124,58,237,0.5)]
        ${isSignUp ? '-translate-x-full rounded-l-[0px] rounded-r-[100px] shadow-[0_0_80px_-10px_rgba(59,130,246,0.5)]' : ''}
      `}>
        <div className={`bg-black text-white relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out flex flex-row
          ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}
        `}>
          <div className="w-1/2 h-full flex flex-col items-center justify-center px-16 text-center">
            <div className="mb-6 p-3 bg-white/10 rounded-2xl backdrop-blur-sm"><Zap size={32}/></div>
            <h1 className="font-black text-4xl mb-4 leading-tight">Tekrar Hoşgeldin!</h1>
            <p className="text-gray-300 font-bold text-sm mb-8 leading-relaxed">
              Kaldığın yerden devam etmek için giriş yap.
            </p>
            <button type="button" onClick={() => setIsSignUp(false)} className="bg-white text-black py-3 px-12 rounded-lg font-black uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-md text-xs">
              Giriş Yap
            </button>
          </div>
          <div className="w-1/2 h-full flex flex-col items-center justify-center px-16 text-center">
            <div className="mb-6 p-3 bg-white/10 rounded-2xl backdrop-blur-sm"><Zap size={32}/></div>
            <h1 className="font-black text-4xl mb-4 leading-tight">Aramıza Katıl!</h1>
            <p className="text-gray-300 font-bold text-sm mb-8 leading-relaxed">
              Yeni bir yolculuğa başlamak için hemen hesabını oluştur.
            </p>
            <button type="button" onClick={() => setIsSignUp(true)} className="bg-white text-black py-3 px-12 rounded-lg font-black uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-md text-xs">
              Kayıt Ol
            </button>
          </div>
        </div>
      </div>

      {/* --- ONAY MODALI (MAIL KONTROL) --- */}
      {showVerifyModal && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-6 text-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border-2 border-black animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-100 shadow-inner">
              <Mail className="animate-bounce" size={40} />
            </div>
            <h2 className="text-2xl font-black text-black mb-3 leading-tight">Mailini Kontrol Et!</h2>
            <p className="text-gray-600 font-bold text-sm mb-6 leading-relaxed">
              Harika! Hesabını oluşturduk. Şimdi sana gönderdiğimiz onay linkine tıklayarak hesabını aktifleştirmen gerekiyor.
            </p>
            <div className="bg-gray-100 p-3 rounded-lg mb-6 border border-gray-200">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic leading-tight">
                (Mail onaylanmadan sisteme giriş yapılamaz)
              </p>
            </div>
            <button 
              type="button"
              onClick={() => {
                setShowVerifyModal(false)
                setIsSignUp(false)
              }}
              className="w-full bg-black text-white py-3 rounded-xl font-black hover:bg-gray-800 transition-all shadow-lg active:scale-95 text-xs tracking-widest uppercase"
            >
              ANLADIM
            </button>
          </div>
        </div>
      )}

    </div>
  )
}