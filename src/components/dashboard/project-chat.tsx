'use client'

import { useEffect, useState } from 'react'
import { StreamChat, Channel as StreamChannel } from 'stream-chat'
import { 
  Chat, 
  Channel, 
  ChannelHeader, 
  MessageList, 
  MessageInput, 
  Window, 
  Thread
} from 'stream-chat-react'
import 'stream-chat-react/dist/css/v2/index.css'

// Server Action'ı doğru yerden çağırıyoruz
import { getStreamToken } from '@/app/dashboard/actions' 
import { Loader2, AlertCircle } from 'lucide-react'

export default function ProjectChat({ projectId }: { projectId: string }) {
  const [client, setClient] = useState<StreamChat | null>(null)
  const [channel, setChannel] = useState<StreamChannel | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let chatClient: StreamChat | null = null;

    async function initChat() {
      try {
        setError(null)
        // 1. Token al (actions.ts içindeki fonksiyon)
        const data = await getStreamToken(projectId)

        // 2. Client başlat
        chatClient = StreamChat.getInstance(data.apiKey)

        // 3. Bağlan
        await chatClient.connectUser(
          {
            id: data.userId,
            name: data.userName || 'Kullanıcı',
          },
          data.token
        )

        // 4. Kanalı İzle
        const streamChannel = chatClient.channel('messaging', data.channelId)
        await streamChannel.watch()

        setChannel(streamChannel)
        setClient(chatClient)

      } catch (err: any) {
        console.error("Chat Hatası:", err)
        setError("Sohbet bağlantısı kurulamadı. Lütfen sayfayı yenileyin.")
      }
    }

    if (projectId) initChat()

    return () => {
      if (chatClient) chatClient.disconnectUser()
    }
  }, [projectId])

  if (error) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-[#09090b] text-red-400 p-4">
            <div className="flex flex-col items-center gap-2">
                <AlertCircle size={32} />
                <p>{error}</p>
            </div>
        </div>
    )
  }

  if (!client || !channel) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#09090b] text-white">
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-sm text-gray-400">Sohbet yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#09090b] text-white font-sans overflow-hidden">
      <style jsx global>{`
        .str-chat__theme-dark {
            --bg-primary: #09090b;
            --bg-secondary: #18181b;
            --text-primary: #ffffff;
            --border: #27272a;
        }
        .str-chat__main-panel { height: 100%; background-color: var(--bg-primary); }
        .str-chat__list { background-color: var(--bg-primary); }
        .str-chat__header-livestream { background-color: var(--bg-primary); border-bottom: 1px solid var(--border); }
      `}</style>

      <Chat client={client} theme="str-chat__theme-dark">
        <Channel channel={channel}>
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