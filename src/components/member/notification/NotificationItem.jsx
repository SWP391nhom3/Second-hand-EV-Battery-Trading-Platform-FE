import { cn, formatRelativeTime } from '@/lib/utils'
import { Bell, MessageSquare, TrendingUp, FileCheck, DollarSign, UserPlus, Calendar, AlertCircle } from 'lucide-react'

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
    createdAt,
    relatedId
  } = notification

  const getIcon = () => {
    switch (notificationType) {
      case 'NEW_MESSAGE':
        return <MessageSquare className="h-5 w-5" />
      case 'NEW_BID':
        return <TrendingUp className="h-5 w-5" />
      case 'ORDER_UPDATE':
        return <FileCheck className="h-5 w-5" />
      case 'PRICE_CHANGE':
        return <DollarSign className="h-5 w-5" />
      case 'NEW_LEAD':
        return <UserPlus className="h-5 w-5" />
      case 'APPOINTMENT':
        return <Calendar className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getIconColor = () => {
    switch (notificationType) {
      case 'NEW_MESSAGE':
        return 'text-blue-600 bg-blue-100'
      case 'NEW_BID':
        return 'text-orange-600 bg-orange-100'
      case 'ORDER_UPDATE':
        return 'text-green-600 bg-green-100'
      case 'PRICE_CHANGE':
        return 'text-yellow-600 bg-yellow-100'
      case 'NEW_LEAD':
        return 'text-purple-600 bg-purple-100'
      case 'APPOINTMENT':
        return 'text-indigo-600 bg-indigo-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const handleClick = () => {
    if (onClick) {
      onClick(notification)
    }
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(notificationId)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-4 hover:bg-gray-50 cursor-pointer transition-colors animate-in fade-in slide-in-from-left duration-300',
        !isRead && 'bg-blue-50/50 border-l-4 border-blue-600'
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          getIconColor()
        )}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              'text-sm font-semibold text-gray-900',
              !isRead && 'font-bold'
            )}>
              {title}
            </h4>
            {!isRead && (
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {content}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {formatRelativeTime(createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}

