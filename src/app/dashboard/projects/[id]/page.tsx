'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, Loader2, Send, Clock, User, ShieldCheck, 
  CheckCircle2, AlertCircle 
} from 'lucide-react'

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Ekranı her zaman en son mesaja kaydır
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    async function loadProjectDetails() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      
      setCurrentUser(user)
      const adminCheck = user.user_metadata?.role === 'admin' || user.email === 'cobanahsan@gmail.com'
      setIsAdmin(adminCheck)

      // Projeyi getir
      const { data: projData, error: projErr } = await supabase.from('projects').select('*').eq('id', id).single()
      
      if (projErr || !projData) {
        alert('Proje bulunamadı veya erişim yetkiniz yok.')
        router.push('/dashboard')
        return
      }

      setProject(projData)

      // Mesajları getir
      const { data: msgData } = await supabase.from('project_messages').select('*').eq('project_id', id).order('created_at', { ascending: true })
      if (msgData) setMessages(msgData)

      setLoading(false)
      scrollToBottom()
    }

    loadProjectDetails()

    // Gerçek zamanlı mesaj dinleme (Realtime)
    const channel = supabase.channel(`project_${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_messages', filter: `project_id=eq.${id}` }, 
      (payload) => {
        setMessages((prev) => [...prev, payload.new])
        setTimeout(scrollToBottom, 100)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id, supabase, router])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    const { error } = await supabase.from('project_messages').insert([{
      project_id: project.id,
      sender_id: currentUser.id,
      is_admin: isAdmin,
      message: newMessage.trim()
    }])

    if (error) alert('Mesaj gönderilemedi: ' + error.message)
    else setNewMessage('')
    setSending(false)
  }

  const handleUpdateStatus = async (newStatus: string) => {
    const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', project.id)
    if (!error) setProject({ ...project, status: newStatus })
  }

  if (loading) return <div className="h-screen bg-[#09090b] flex items-center justify-center text-white"><Loader2 className="animate-spin text-blue-500" size={32}/></div>

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10 font-sans flex flex-col h-screen">
      
      {/* ÜST BAŞLIK */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-[#18181b] rounded-xl hover:bg-white/10 transition text-gray-400 hover:text-white">
            <ArrowLeft size={20}/>
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{project.name}</h1>
            <p className="text-xs font-mono text-gray-500 mt-1">ID: {project.id}</p>
          </div>
        </div>
        
        {/* Durum Rozeti */}
        <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${project.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
          {project.status === 'completed' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
          {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0 overflow-hidden">
        
        {/* SOL: PROJE DETAYLARI VE ADMİN KONTROLLERİ */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10">
          <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Proje Açıklaması</h2>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {project.description || 'Bu proje için bir açıklama girilmemiş.'}
            </p>
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500 font-mono">
              <Clock size={14}/> Oluşturulma: {new Date(project.created_at).toLocaleString('tr-TR')}
            </div>
          </div>

          {/* SADECE ADMİN GÖREBİLİR */}
          {isAdmin && (
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck size={18}/> Admin Kontrolleri
              </h2>
              <p className="text-xs text-gray-400 mb-4">Müşterinin projesi bittiyse durumunu güncelleyebilirsin.</p>
              
              {project.status !== 'completed' ? (
                <button onClick={() => handleUpdateStatus('completed')} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition text-sm flex justify-center items-center gap-2 shadow-lg shadow-green-900/20">
                  <CheckCircle2 size={18}/> Projeyi Tamamlandı İşaretle
                </button>
              ) : (
                <button onClick={() => handleUpdateStatus('active')} className="w-full bg-[#18181b] border border-white/10 hover:bg-white/5 text-gray-300 font-bold py-3 rounded-xl transition text-sm">
                  Aktife Geri Al
                </button>
              )}
            </div>
          )}
        </div>

        {/* SAĞ: MESAJLAŞMA (CHAT) SİSTEMİ */}
        <div className="w-full md:w-2/3 bg-[#18181b] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Proje İletişimi</h2>
            <span className="text-[10px] text-gray-500 font-mono italic">Uçtan Uca Şifreli</span>
          </div>

          {/* Mesaj Listesi */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                <MessageSquareIcon />
                <p className="text-sm mt-4 font-bold">Henüz mesaj yok. İlk mesajı gönderin.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === currentUser.id
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      {msg.is_admin ? <ShieldCheck size={12} className="text-blue-500"/> : <User size={12} className="text-gray-500"/>}
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {isMe ? 'Sen' : (msg.is_admin ? 'AutoStep Destek' : 'Müşteri')}
                      </span>
                      <span className="text-[9px] text-gray-600 font-mono ml-2">
                        {new Date(msg.created_at).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-900/20' : 'bg-[#27272a] text-gray-200 rounded-tl-sm border border-white/5'}`}>
                      {msg.message}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Mesaj Gönderme Inputu */}
          <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/5">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesajınızı yazın..." 
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-4 pl-4 pr-14 text-sm text-white focus:border-blue-500 outline-none transition placeholder:text-gray-600"
                disabled={sending}
              />
              <button 
                type="submit" 
                disabled={sending || !newMessage.trim()} 
                className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition"
              >
                {sending ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} className="ml-0.5"/>}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}

function MessageSquareIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  )
}