import { Bell } from 'lucide-react'
import NotificationItem from './NotificationItem'
import NotificationListSkeleton from './NotificationListSkeleton'

/**
 * NotificationList Component
 * Hiển thị danh sách thông báo
 */
export default function NotificationList({
  notifications = [],
  loading,
  onNotificationClick,
  onMarkAsRead
}) {
  if (loading) {
    return <NotificationListSkeleton rows={10} />
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-gray-100 p-4 rounded-full mb-4 animate-in zoom-in duration-500">
            <Bell className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
            Không có thông báo nào
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            Hiện tại không có thông báo nào. Bạn sẽ nhận được thông báo khi có sự kiện mới.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-in fade-in duration-300">
      <div className="divide-y divide-gray-100">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.notificationId}
            notification={notification}
            onClick={onNotificationClick}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </div>
  )
}


