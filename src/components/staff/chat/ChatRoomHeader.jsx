import { UserCheck, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { formatRelativeTime } from '@/lib/utils'

/**
 * ChatRoomHeader Component
 * Hiển thị thông tin phòng chat (Participants, Lead info)
 */
export default function ChatRoomHeader({ room, onViewLead }) {
  if (!room) {
    return (
      <div className="h-16 border-b border-gray-200 bg-white px-4 flex items-center">
        <p className="text-gray-500">Chọn một cuộc trò chuyện</p>
      </div>
    )
  }

  // Get other participants (not current user)
  const participants = []
  if (room.buyerName) participants.push({ name: room.buyerName, role: 'Người mua', avatar: room.buyerAvatar })
  if (room.sellerName) participants.push({ name: room.sellerName, role: 'Người bán', avatar: room.sellerAvatar })
  if (room.staffName) participants.push({ name: room.staffName, role: 'Staff', avatar: room.staffAvatar })

  return (
    <div className="h-16 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Post Thumbnail */}
        {room.postThumbnail && (
          <img
            src={room.postThumbnail}
            alt={room.postTitle}
            className="w-10 h-10 rounded-lg object-cover"
          />
        )}

        {/* Room Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {room.postTitle || 'Cuộc trò chuyện'}
            </h3>
            {room.leadId && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Lead
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {participants.map((p, index) => (
              <span key={index}>
                {p.name} ({p.role})
                {index < participants.length - 1 && ', '}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Note: leadId không có trong ChatRoomResponse, có thể cần thêm vào backend hoặc lấy từ Lead service */}
        {room.leadId && onViewLead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewLead(room.leadId)}
            title="Xem chi tiết Lead"
          >
            <UserCheck className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          asChild
          title="Xem bài đăng"
        >
          <Link to={`/posts/${room.postId}`} target="_blank">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

