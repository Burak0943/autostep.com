'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Yönlendirme için
import { StreamChat } from 'stream-chat'
import { 
  Chat, 
  Channel, 
  ChannelList, 
  Window, 
  ChannelHeader, 
  MessageList, 
  MessageInput, 
  Thread,
} from 'stream-chat-react'
import 'stream-chat-react/dist/css/v2/index.css'
import { getStreamToken } from '@/app/dashboard/actions'
import { CustomChannelPreview } from '@/components/dashboard/custom-channel-preview'
import { Loader2, ArrowLeft, Home } from 'lucide-react' // İkonlar

const sort = { last_message_at: -1 } as const

export default function MessagesPage() {
  const [client, setClient] = useState<StreamChat | null>(null)
  const [userId, setUserId] = useState<string>('')
  const router = useRouter() // Router kancası

  useEffect(() => {
    async function init() {
      // Listeyi görmek için init modunda bağlanıyoruz
      const data = await getStreamToken('dashboard-init')

      const chatClient = StreamChat.getInstance(data.apiKey)

      await chatClient.connectUser(
        {
          id: data.userId,
          name: data.userName || 'Kullanıcı',
        },
        data.token
      )

      setUserId(data.userId)
      setClient(chatClient)
    }

    init()

    return () => {
      if (client) client.disconnectUser()
    }
  }, [])

  if (!client || !userId) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-[#09090b] text-white">
          <Loader2 className="animate-spin text-blue-500" size={40} />
       </div>
    )
  }

  const filters = { type: 'messaging', members: { $in: [userId] } }

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-white overflow-hidden font-sans">
       <style jsx global>{`
        .str-chat__theme-dark {
            --bg-primary: #09090b;
            --bg-secondary: #18181b;
            --text-primary: #ffffff;
            --border: #27272a;
        }
        .str-chat { height: 100vh; width: 100%; }
        .str-chat-channel-list { background: #09090b; border-right: 1px solid #27272a; width: 350px; }
        .str-chat__channel-list-header { display: none; } 
      `}</style>

       <Chat client={client} theme="str-chat__theme-dark">
          
          {/* SOL PANEL */}
          <div className="w-[350px] flex flex-col border-r border-gray-800 h-full shrink-0">
              
              {/* --- YENİ EKLENEN BAŞLIK VE GERİ BUTONU --- */}
              <div className="p-4 border-b border-gray-800 flex flex-col gap-4 bg-gray-900/50">
                 
                 {/* Geri Dön Butonu */}
                 <button 
                    onClick={() => router.push('/dashboard')} 
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium hover:bg-gray-800 p-2 rounded-lg -ml-2 w-fit"
                 >
                    <ArrowLeft size={16} /> Dashboard'a Dön
                 </button>

                 <div className="flex justify-between items-end">
                    <span className="font-bold text-xl text-white">Gelen Kutusu</span>
                    <span className="text-[10px] font-bold bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full border border-blue-600/30">CANLI</span>
                 </div>
              </div>
              
              {/* Kanal Listesi */}
              <ChannelList 
                 filters={filters} 
                 sort={sort}
                 Preview={CustomChannelPreview} 
                 EmptyStateIndicator={() => (
                    <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
                       <Home size={32} className="opacity-20"/>
                       <p>Henüz mesajınız yok.</p>
                       <p className="text-xs">Projelerinizden mesaj attığınızda burada görünür.</p>
                    </div>
                 )}
              />
          </div>

          {/* SAĞ PANEL (SOHBET) */}
          <Channel>
             <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
             </Window>
             <Thread />
          </Channel>
       </Chat>
    </div>
  )
}