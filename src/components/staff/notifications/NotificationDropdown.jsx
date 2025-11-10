import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NotificationItem from './NotificationItem'
import NotificationListSkeleton from './NotificationListSkeleton'
import staffNotificationService from '@/api/services/staffNotification.service'
import { toast } from 'sonner'

/**
 * NotificationDropdown Component
 * Dropdown hiển thị thông báo mới nhất trong header
 */
export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  // Load notifications và unread count
  const loadNotifications = async () => {
    try {
      setLoading(true)
      
      // Load unread count
      const countResponse = await staffNotificationService.getUnreadCount()
      if (countResponse.success) {
        setUnreadCount(countResponse.data || 0)
      }

      // Load latest notifications (chưa đọc, tối đa 10 items)
      const notificationsResponse = await staffNotificationService.getNotifications({
        pageNumber: 1,
        pageSize: 10,
        isRead: false,
        sortBy: 'CreatedAt',
        sortOrder: 'DESC'
      })

      if (notificationsResponse.success && notificationsResponse.data) {
        // PagedResponse structure: { success, message, data: List<T>, pageNumber, pageSize, totalCount }
        setNotifications(notificationsResponse.data || [])
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Không thể tải thông báo')
    } finally {
      setLoading(false)
    }
  }

  // Load khi dropdown mở
  useEffect(() => {
    if (open) {
      loadNotifications()
    }
  }, [open])

  // Load unread count khi component mount (polling mỗi 30 giây)
  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await staffNotificationService.markAsRead(notificationId)
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.notificationId === notificationId 
              ? { ...n, isRead: true }
              : n
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Có thể navigate đến trang chi tiết dựa trên relatedId và notificationType
    // Ví dụ: nếu là APPOINTMENT thì navigate đến /staff/appointments
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="px-4 py-3">
          Thông báo
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} mới
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-2">
              <NotificationListSkeleton rows={5} />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <Bell className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 text-center">
                Không có thông báo mới
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div key={notification.notificationId} className="px-2">
                  <NotificationItem
                    notification={notification}
                    onClick={handleNotificationClick}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link 
            to="/staff/notifications" 
            className="w-full cursor-pointer flex items-center justify-between"
            onClick={() => setOpen(false)}
          >
            <span>Xem tất cả thông báo</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

