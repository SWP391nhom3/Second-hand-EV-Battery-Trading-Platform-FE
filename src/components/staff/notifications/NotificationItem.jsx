import NotificationTypeIcon from './NotificationTypeIcon'
import { cn, formatRelativeTime } from '@/lib/utils'

/**
 * NotificationItem Component
 * Hiển thị một thông báo
 */
export default function NotificationItem({ 
  notification, 
  onClick,
  onMarkAsRead
}) {
  const { 
    notificationId, 
    notificationType, 
    title, 
    content, 
    isRead, 
    createdAt 
  } = notification

  const handleClick = () => {
    if (onClick) {
      onClick(notification)
    }
    
    // Tự động đánh dấu đã đọc khi click (nếu chưa đọc)
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(notificationId)
    }
  }

  const timeAgo = formatRelativeTime(createdAt)

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 p-4 cursor-pointer transition-colors duration-150',
        'hover:bg-gray-50 border-b border-gray-100 last:border-b-0',
        !isRead && 'bg-blue-50/50'
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <NotificationTypeIcon type={notificationType} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              'text-sm font-semibold text-gray-900 mb-1',
              !isRead && 'font-bold'
            )}>
              {title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {content}
            </p>
          </div>
          
          {/* Unread indicator */}
          {!isRead && (
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2" />
          )}
        </div>
        
        {/* Time */}
        <div className="mt-2 text-xs text-gray-500">
          {timeAgo}
        </div>
      </div>
    </div>
  )
}

