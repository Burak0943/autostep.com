'use client'

import { ChannelPreviewUIComponentProps, useChatContext } from 'stream-chat-react'
import { Star, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
  const { channel, setActiveChannel, activeChannel } = props
  const { client } = useChatContext()

  // --- HATA ÇÖZÜMÜ ---
  // TypeScript'e "Sen karışma, verinin içinde name var" diyoruz.
  const data = channel.data as any
  const displayTitle = data?.name || channel.id || 'İsimsiz Sohbet'

  // Son mesajı al
  const latestMessage = channel.state.messages[channel.state.messages.length - 1]
  const unreadCount = channel.countUnread()

  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const favorites = JSON.parse(localStorage.getItem('favorite_channels') || '[]')
        setIsFavorite(favorites.includes(channel.id))
    }
  }, [channel.id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    const favorites = JSON.parse(localStorage.getItem('favorite_channels') || '[]')
    let newFavorites
    if (isFavorite) {
        newFavorites = favorites.filter((id: string) => id !== channel.id)
    } else {
        newFavorites = [...favorites, channel.id]
    }
    localStorage.setItem('favorite_channels', JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const confirm = window.confirm('Bu sohbeti gizlemek istiyor musunuz?')
    if (!confirm) return
    await channel.hide() 
  }

  const isActive = activeChannel?.id === channel.id

  return (
    <div 
      onClick={() => setActiveChannel?.(channel)}
      className={`
        flex items-center justify-between p-4 border-b border-gray-800 cursor-pointer transition-all
        ${isActive ? 'bg-gray-800/50 border-l-4 border-l-blue-500' : 'hover:bg-gray-900/50 border-l-4 border-l-transparent'}
      `}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        {/* AVATAR */}
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shrink-0">
           <span className="text-lg font-bold text-white">
              {displayTitle.charAt(0).toUpperCase()}
           </span>
        </div>

        {/* İSİM VE SON MESAJ */}
        <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-2">
                <span className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-gray-200'}`}>
                    {displayTitle}
                </span>
                {unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </div>
            
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
                {latestMessage?.text || 'Henüz mesaj yok...'}
            </p>
        </div>
      </div>

      {/* BUTONLAR */}
      <div className="flex items-center gap-1">
        <button onClick={toggleFavorite} className={`p-2 rounded-lg ${isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}>
            <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <button onClick={handleDelete} className="p-2 text-gray-600 hover:text-red-500 rounded-lg">
            <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}