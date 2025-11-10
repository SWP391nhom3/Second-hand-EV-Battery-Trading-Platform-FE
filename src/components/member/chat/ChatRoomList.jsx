import { MessageSquare } from 'lucide-react'
import { formatRelativeTime, truncate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getImageUrl } from '@/utils/imageHelper'

/**
 * ChatRoomList Component
 * Hiển thị danh sách phòng chat cho Member
 */
export default function ChatRoomList({ 
  rooms = [], 
  selectedRoomId,
  onSelectRoom,
  loading = false 
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-lg">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-4">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 text-center">Chưa có cuộc trò chuyện nào</p>
        <p className="text-sm text-gray-400 text-center mt-2">
          Các cuộc trò chuyện sẽ xuất hiện ở đây
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {rooms.map((room) => {
        const isSelected = room.roomId === selectedRoomId
        const hasUnread = room.unreadCount > 0

        return (
          <button
            key={room.roomId}
            onClick={() => onSelectRoom(room.roomId)}
            className={`
              flex items-start gap-3 p-3 rounded-lg transition-colors
              hover:bg-gray-50 text-left w-full
              ${isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''}
              ${hasUnread ? 'bg-blue-50/50' : ''}
            `}
          >
            {/* Post Thumbnail */}
            <div className="flex-shrink-0">
              {room.postThumbnail ? (
                <img
                  src={getImageUrl(room.postThumbnail)}
                  alt={room.postTitle}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23e5e7eb" width="48" height="48"/%3E%3C/svg%3E'
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-semibold text-sm text-gray-900 truncate">
                  {room.postTitle || 'Cuộc trò chuyện'}
                </h4>
                {room.lastMessageAt && (
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatRelativeTime(room.lastMessageAt)}
                  </span>
                )}
              </div>

              {/* Last Message */}
              {room.lastMessage ? (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-600 truncate flex-1">
                    <span className="font-medium">{room.lastMessage.senderName}:</span>{' '}
                    {truncate(
                      room.lastMessage.messageType === 'TEXT'
                        ? room.lastMessage.content
                        : room.lastMessage.messageType === 'IMAGE'
                        ? '📷 Hình ảnh'
                        : '📎 File',
                      30
                    )}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Chưa có tin nhắn</p>
              )}

              {/* Participants */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {room.buyerName && room.sellerName && (
                    <>
                      {room.buyerName}, {room.sellerName}
                      {room.staffName && `, ${room.staffName}`}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Unread Badge */}
            {hasUnread && (
              <div className="flex-shrink-0">
                <Badge 
                  variant="destructive" 
                  className="h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {room.unreadCount > 9 ? '9+' : room.unreadCount}
                </Badge>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

