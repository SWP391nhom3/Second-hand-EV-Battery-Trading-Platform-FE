import { useState, useEffect } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users } from 'lucide-react'
import messageService from '@/api/services/message.service'
import { toast } from 'sonner'
import { getImageUrl } from '@/utils/imageHelper'

/**
 * ChatRoom Component
 * Hiển thị phòng chat với message list và input
 */
export default function ChatRoom({ room, onBack }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (room?.roomId) {
      loadMessages()
    }
  }, [room?.roomId])

  const loadMessages = async (page = 1) => {
    if (!room?.roomId) return

    try {
      setLoading(true)
      const response = await messageService.getChatHistory(room.roomId, {
        pageNumber: page,
        pageSize: 20
      })

      if (response.success && response.data) {
        let messagesData = []
        if (Array.isArray(response.data)) {
          messagesData = response.data
        } else if (Array.isArray(response.data.data)) {
          messagesData = response.data.data
        } else if (Array.isArray(response.data.items)) {
          messagesData = response.data.items
        }

        const newMessages = messagesData
        if (page === 1) {
          setMessages(newMessages.reverse()) // Reverse để hiển thị từ cũ đến mới
        } else {
          setMessages((prev) => [...newMessages.reverse(), ...prev])
        }
        setHasMore(newMessages.length === 20)
        setPageNumber(page)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      toast.error('Không thể tải tin nhắn')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (data) => {
    if (!room?.roomId) return

    try {
      setSending(true)
      const response = await messageService.sendMessage({
        roomId: room.roomId,
        ...data
      })

      if (response.success && response.data) {
        // Add new message to list
        setMessages((prev) => [...prev, response.data])
        // Scroll to bottom will be handled by MessageList
      } else {
        toast.error(response.message || 'Không thể gửi tin nhắn')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Không thể gửi tin nhắn')
    } finally {
      setSending(false)
    }
  }

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMessages(pageNumber + 1)
    }
  }

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <CardHeader className="border-b bg-white">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {room.postThumbnail && (
            <img
              src={getImageUrl(room.postThumbnail)}
              alt={room.postTitle}
              className="w-10 h-10 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23e5e7eb" width="40" height="40"/%3E%3C/svg%3E'
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{room.postTitle}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span className="truncate">
                {room.buyerName && room.sellerName && (
                  <>
                    {room.buyerName}, {room.sellerName}
                    {room.staffName && `, ${room.staffName}`}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <MessageList
          messages={messages}
          loading={loading}
          onLoadMore={handleLoadMore}
        />
      </CardContent>

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={sending}
      />
    </div>
  )
}

