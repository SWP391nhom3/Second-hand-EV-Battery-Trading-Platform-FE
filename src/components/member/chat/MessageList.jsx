import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * MessageList Component
 * Hiển thị danh sách tin nhắn với auto scroll
 */
export default function MessageList({ 
  messages = [], 
  loading = false,
  onLoadMore 
}) {
  const messagesEndRef = useRef(null)
  const listRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-16 w-3/4 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-500">Chưa có tin nhắn nào</p>
          <p className="text-sm text-gray-400 mt-2">
            Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={listRef}
      className="flex-1 overflow-y-auto p-4 space-y-1"
    >
      {messages.map((message) => (
        <MessageBubble key={message.messageId} message={message} />
      ))}
      {loading && messages.length > 0 && (
        <div className="flex justify-center p-4">
          <Skeleton className="h-4 w-24" />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

