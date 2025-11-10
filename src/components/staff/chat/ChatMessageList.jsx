import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import { formatRelativeTime } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * ChatMessageList Component
 * Hiển thị danh sách tin nhắn với infinite scroll
 */
export default function ChatMessageList({ 
  messages = [], 
  loading = false,
  onLoadMore 
}) {
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const prevMessagesLengthRef = useRef(0)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      // New messages added, scroll to bottom
      scrollToBottom()
    }
    prevMessagesLengthRef.current = messages.length
  }, [messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = []
    let currentDate = null
    let currentGroup = []

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt).toDateString()
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup
          })
        }
        currentDate = messageDate
        currentGroup = [message]
      } else {
        currentGroup.push(message)
      }

      // Add last group
      if (index === messages.length - 1) {
        groups.push({
          date: currentDate,
          messages: currentGroup
        })
      }
    })

    return groups
  }

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua'
    } else {
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center justify-center h-full py-16">
          <div className="text-center space-y-2">
            <p className="text-gray-500">Chưa có tin nhắn nào</p>
            <p className="text-sm text-gray-400">Bắt đầu cuộc trò chuyện!</p>
          </div>
        </div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {/* Load More Button (if needed) */}
      {onLoadMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            className="text-sm text-blue-600 hover:text-blue-700 px-4 py-2"
          >
            Tải thêm tin nhắn
          </button>
        </div>
      )}

      {/* Messages grouped by date */}
      {messageGroups.map((group, groupIndex) => (
        <div key={group.date}>
          {/* Date Separator */}
          <div className="flex items-center justify-center my-4">
            <div className="flex items-center gap-2">
              <div className="h-px bg-gray-200 flex-1 w-16"></div>
              <span className="text-xs text-gray-500 px-2">
                {formatDateLabel(group.date)}
              </span>
              <div className="h-px bg-gray-200 flex-1 w-16"></div>
            </div>
          </div>

          {/* Messages in this group */}
          {group.messages.map((message) => (
            <MessageBubble key={message.messageId} message={message} />
          ))}
        </div>
      ))}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}


