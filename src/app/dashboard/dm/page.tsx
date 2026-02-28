'use client'

import { useEffect, useState } from 'react'
import { StreamChat, Channel as StreamChannel } from 'stream-chat'
import { 
  Chat, Channel, ChannelList, Window, ChannelHeader, MessageList, MessageInput, Thread, Streami18n
} from 'stream-chat-react'
import 'stream-chat-react/dist/css/v2/index.css'
import { getStreamToken, getUsers, startDirectChat } from '@/app/dashboard/actions' 
import { CustomChannelPreview } from '@/components/dashboard/custom-channel-preview'
import { Loader2, Plus, User, MessageCircle, Send, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// --- GELİŞMİŞ TÜRKÇE DİL AYARLARI ---
// Hem mesaj hem de kanal (sohbet) için "Gizle" lafını kaldırıp "Sil" yaptık.
const i18nInstance = new Streami18n({
  language: 'tr',
  translationsForLanguage: {
    // Mesaj İşlemleri
    'Are you sure you want to delete this message?': 'Bu mesajı tamamen silmek istediğinize emin misiniz?',
    'Delete': 'Sil',
    'Delete Message': 'Mesajı Sil',
    'Message deleted': 'Bu mesaj silindi',
    
    // Kanal (Sohbet) İşlemleri - Görseldeki hatayı çözen kısım burası
    'Are you sure you want to hide this conversation?': 'Bu sohbeti silmek istediğinize emin misiniz?',
    'Hide conversation': 'Sohbeti Sil',
    'Hide': 'Sil', // Genel gizle butonları için
    
    // Diğer Çeviriler
    'Reply': 'Yanıtla',
    'Edit Message': 'Düzenle',
    'Pin': 'Sabitle',
    'Mute': 'Sessize Al',
    'Flag': 'Bildir',
    'Unknown User': 'Bilinmeyen Kullanıcı'
  } as any, 
});

export default function DirectMessagesPage() {
  const [client, setClient] = useState<StreamChat | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [users, setUsers] = useState<any[]>([]) 
  const [isModalOpen, setIsModalOpen] = useState(false) 
  const [loadingChat, setLoadingChat] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const [activeChannel, setActiveChannel] = useState<StreamChannel | undefined>(undefined)
  
  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.user_metadata?.role === 'admin' || user?.email === 'cobanahsan@gmail.com') {
          setIsAdmin(true)
      }

      const data = await getStreamToken('dashboard-init') 
      const chatClient = StreamChat.getInstance(data.apiKey)
      
      await chatClient.connectUser(
        { id: data.userId, name: data.userName || 'Kullanıcı' },
        data.token
      )
      setUserId(data.userId)
      setClient(chatClient)
    }
    init()
    return () => { if (client) client.disconnectUser() }
  }, [])

  useEffect(() => {
    getUsers().then((data) => {
        setUsers(data)
    })
  }, [])

  const handleStartChat = async (targetId: string) => {
    if (!client) return
    setLoadingChat(true)
    
    try {
        const { channelId } = await startDirectChat(targetId)
        const channel = client.channel('messaging', channelId)
        await channel.watch()
        setActiveChannel(channel)
        setIsModalOpen(false)
    } catch (error) {
        console.error("Hata:", error)
        alert("Sohbet başlatılamadı.")
    } finally {
        setLoadingChat(false)
    }
  }

  if (!client || !userId) return <div className="flex h-full items-center justify-center bg-[#09090b] text-white"><Loader2 className="animate-spin"/></div>

  const filters = { 
    type: 'messaging', 
    members: { $in: [userId] }
  } as any

  const sort = { last_message_at: -1 } as const

  return (
    <div className="flex h-full w-full bg-[#09090b] text-white font-sans relative">
       
       <style jsx global>{`
        .str-chat__theme-dark { --bg-primary: #09090b; --bg-secondary: #18181b; --text-primary: #fff; --border: #27272a; }
        .str-chat { display: flex !important; height: 100% !important; width: 100% !important; }
        .str-chat-channel-list { background: #09090b; border-right: 1px solid #27272a; width: 350px !important; flex-shrink: 0; height: 100%; }
        .str-chat__channel-list-header { display: none; }
        .str-chat__main-panel { flex: 1; height: 100%; }
      `}</style>

       <Chat client={client} theme="str-chat__theme-dark" i18nInstance={i18nInstance}>
          
          <div className="w-[350px] flex flex-col border-r border-gray-800 h-full shrink-0">
              
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                 <div className="flex items-center gap-2">
                    <MessageCircle size={20} className={isAdmin ? "text-red-500" : "text-blue-500"}/>
                    <span className="font-bold text-lg">{isAdmin ? 'Tüm Mesajlar' : 'Destek'}</span>
                 </div>
                 <button onClick={() => setIsModalOpen(true)} className={`p-2 rounded-full transition shadow-lg ${isAdmin ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'}`}>
                    <Plus size={18} />
                 </button>
              </div>
              
              <ChannelList 
                filters={filters} 
                sort={sort} 
                Preview={(props) => (
                    <div onClick={() => setActiveChannel(props.channel)}>
                        <CustomChannelPreview {...props} />
                    </div>
                )}
                // @ts-ignore
                onSelect={(chan) => setActiveChannel(chan)}
                
                EmptyStateIndicator={() => (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-500 gap-4">
                       <Send size={32} className="opacity-50"/>
                       <p className="text-white font-medium">Henüz mesaj yok</p>
                       <button onClick={() => setIsModalOpen(true)} className={`px-4 py-2 text-white rounded-lg text-sm font-bold w-full ${isAdmin ? 'bg-red-600' : 'bg-blue-600'}`}>
                         {isAdmin ? 'Kullanıcı Seç & Yaz' : 'Destek Talebi Oluştur'}
                       </button>
                    </div>
                 )}
              />
          </div>

          <Channel channel={activeChannel}>
             <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
             </Window>
             <Thread />
          </Channel>
       </Chat>

       {isModalOpen && (
         <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-[#18181b] border border-gray-700 p-6 rounded-2xl w-[400px] max-h-[600px] flex flex-col shadow-2xl">
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
                    <h3 className="font-bold text-xl">{isAdmin ? 'Kullanıcı Seç' : 'Destek Ekibi'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white bg-gray-800 p-1 rounded-full"><Plus size={20} className="rotate-45"/></button>
                </div>
                
                <div className="overflow-y-auto flex-1 space-y-2 custom-scrollbar">
                    {users.length === 0 ? (
                        <div className="text-center py-8">
                             <p className="text-gray-500 mb-2">Kimse bulunamadı.</p>
                             {!isAdmin && <p className="text-xs text-red-400">Admin hesabı bulunamadı.</p>}
                        </div>
                    ) : (
                        users.map(u => (
                            <button 
                                key={u.id} 
                                disabled={loadingChat}
                                onClick={() => handleStartChat(u.id)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl transition-all text-left group border border-transparent hover:border-gray-700"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg shrink-0 ${isAdmin ? 'bg-gradient-to-tr from-purple-500 to-pink-500' : 'bg-blue-600'}`}>
                                    {isAdmin ? (u.full_name?.[0]?.toUpperCase() || <User size={18}/>) : <ShieldAlert size={18}/>}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="font-bold text-gray-200 group-hover:text-white truncate">
                                        {isAdmin ? (u.full_name || 'İsimsiz') : 'Admin Destek'}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">{u.email}</div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
         </div>
       )}
    </div>
  )
}