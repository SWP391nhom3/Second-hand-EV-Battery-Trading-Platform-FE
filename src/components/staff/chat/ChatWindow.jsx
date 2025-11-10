import { useState, useEffect, useCallback } from 'react'
import ChatMessageList from './ChatMessageList'
import ChatMessageInput from './ChatMessageInput'
import ChatRoomHeader from './ChatRoomHeader'
import staffChatService from '@/api/services/staffChat.service'
import { toast } from 'sonner'
import { messageCreateSchema } from '@/lib/validations/chat.validation'

/**
 * ChatWindow Component
 * Combine ChatMessageList và ChatMessageInput
 * Handle real-time messages và auto mark as read
 */
export default function ChatWindow({ 
  room, 
  onViewLead 
}) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Load messages when room changes
  useEffect(() => {
    if (room?.roomId) {
      loadMessages(room.roomId, 1, true)
    } else {
      setMessages([])
    }
  }, [room?.roomId])

  const loadMessages = async (roomId, page = 1, reset = false) => {
    if (!roomId) return

    try {
      setLoading(true)
      const response = await staffChatService.getChatHistory(roomId, {
        pageNumber: page,
        pageSize: 20
      })

      if (response.success && response.data) {
        const newMessages = response.data.items || []
        
        if (reset) {
          setMessages(newMessages.reverse()) // Reverse để hiển thị từ cũ đến mới
        } else {
          setMessages(prev => [...newMessages.reverse(), ...prev])
        }

        setHasMore(newMessages.length === 20)
        setCurrentPage(page)

        // Mark as read
        await staffChatService.markAsRead(roomId)
      } else {
        toast.error(response.message || 'Không thể tải tin nhắn')
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      toast.error('Đã xảy ra lỗi khi tải tin nhắn')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (messageData) => {
    if (!room?.roomId) {
      toast.error('Vui lòng chọn phòng chat')
      return
    }

    try {
      // Validate
      const validationResult = messageCreateSchema.safeParse(messageData)
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(e => e.message).join(', ')
        toast.error(errors)
        return
      }

      setSending(true)

      const response = await staffChatService.sendMessage({
        ...messageData,
        roomId: room.roomId
      })

      if (response.success && response.data) {
        // Add new message to list
        setMessages(prev => [...prev, response.data])
        
        // Scroll to bottom will be handled by ChatMessageList
        toast.success('Đã gửi tin nhắn')
      } else {
        toast.error(response.message || 'Không thể gửi tin nhắn')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Đã xảy ra lỗi khi gửi tin nhắn')
    } finally {
      setSending(false)
    }
  }

  const handleLoadMore = () => {
    if (hasMore && !loading && room?.roomId) {
      loadMessages(room.roomId, currentPage + 1, false)
    }
  }

  // Handle new message (for real-time updates)
  const handleNewMessage = useCallback((newMessage) => {
    if (newMessage.roomId === room?.roomId) {
      setMessages(prev => {
        // Check if message already exists
        const exists = prev.some(m => m.messageId === newMessage.messageId)
        if (exists) return prev
        return [...prev, newMessage]
      })
    }
  }, [room?.roomId])

  // TODO: Setup WebSocket/SignalR connection for real-time messages
  // useEffect(() => {
  //   if (room?.roomId) {
  //     // Connect to WebSocket
  //     // Listen for new messages
  //     // Call handleNewMessage when receive new message
  //   }
  // }, [room?.roomId, handleNewMessage])

  if (!room) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <ChatRoomHeader room={room} onViewLead={onViewLead} />

      {/* Messages List */}
      <ChatMessageList
        messages={messages}
        loading={loading}
        onLoadMore={hasMore ? handleLoadMore : null}
      />

      {/* Input */}
      <ChatMessageInput
        roomId={room.roomId}
        onSendMessage={handleSendMessage}
        disabled={sending}
      />
    </div>
  )
}


