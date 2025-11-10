import { Image, File, Download } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import authService from '@/api/services/auth.service'

/**
 * MessageBubble Component
 * Hiển thị một tin nhắn dạng bubble
 */
export default function MessageBubble({ message }) {
  const currentUser = authService.getUserFromStorage()
  const isOwnMessage = message.userId === currentUser?.userId

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'TEXT':
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )
      
      case 'IMAGE':
        return (
          <div className="space-y-2">
            <img
              src={message.content}
              alt="Hình ảnh"
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.content, '_blank')}
            />
            {message.content && (
              <p className="text-xs text-gray-500">{message.content}</p>
            )}
          </div>
        )
      
      case 'FILE':
        return (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <File className="h-5 w-5 text-gray-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.content}</p>
              <p className="text-xs text-gray-500">File đính kèm</p>
            </div>
            <a
              href={message.content}
              download
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Download className="h-4 w-4 text-gray-600" />
            </a>
          </div>
        )
      
      default:
        return <p className="text-sm">{message.content}</p>
    }
  }

  return (
    <div
      className={`flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isOwnMessage ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {message.senderAvatar ? (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-blue-600">
              {message.senderName?.charAt(0) || 'U'}
            </span>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div
        className={`flex flex-col max-w-[70%] ${
          isOwnMessage ? 'items-end' : 'items-start'
        }`}
      >
        {/* Sender Name (chỉ hiển thị nếu không phải tin nhắn của mình) */}
        {!isOwnMessage && (
          <span className="text-xs font-medium text-gray-600 mb-1">
            {message.senderName}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`rounded-lg px-4 py-2 ${
            isOwnMessage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {renderMessageContent()}
        </div>

        {/* Time and Read Status */}
        <div
          className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
            isOwnMessage ? 'flex-row-reverse' : ''
          }`}
        >
          <span>{formatRelativeTime(message.createdAt)}</span>
          {isOwnMessage && (
            <span className={message.isRead ? 'text-blue-500' : 'text-gray-400'}>
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

