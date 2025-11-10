import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CheckCheck } from 'lucide-react'
import NotificationFilter from '@/components/staff/notifications/NotificationFilter'
import NotificationList from '@/components/staff/notifications/NotificationList'
import staffNotificationService from '@/api/services/staffNotification.service'

/**
 * Notifications Page
 * Xem danh sách thông báo và đánh dấu đã đọc - UC37, UC38
 * Module 7: Thông báo
 */
export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter states
  const [filters, setFilters] = useState({
    notificationType: undefined,
    isRead: undefined
  })

  useEffect(() => {
    loadNotifications()
  }, [pageNumber, pageSize, filters])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)

      const params = {
        pageNumber,
        pageSize,
        notificationType: filters.notificationType,
        isRead: filters.isRead,
        sortBy: 'CreatedAt',
        sortOrder: 'DESC'
      }

      const response = await staffNotificationService.getNotifications(params)

      if (response?.success && response?.data) {
        // PagedResponse structure: { success, message, data: List<T>, pageNumber, pageSize, totalCount }
        setNotifications(response.data || [])
        setTotalCount(response.totalCount || 0)
      } else {
        toast.error(response?.message || 'Không thể tải danh sách thông báo')
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Không thể tải danh sách thông báo. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPageNumber(1) // Reset về trang đầu khi filter
  }

  const handleFilterReset = () => {
    setFilters({
      notificationType: undefined,
      isRead: undefined
    })
    setPageNumber(1)
  }

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
        setTotalCount(prev => Math.max(0, prev - 1))
        toast.success('Đã đánh dấu thông báo là đã đọc')
      } else {
        toast.error(response.message || 'Không thể đánh dấu thông báo')
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Không thể đánh dấu thông báo. Vui lòng thử lại sau.')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await staffNotificationService.markAllAsRead()
      if (response.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        )
        setTotalCount(0)
        toast.success('Đã đánh dấu tất cả thông báo là đã đọc')
      } else {
        toast.error(response.message || 'Không thể đánh dấu thông báo')
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Không thể đánh dấu thông báo. Vui lòng thử lại sau.')
    }
  }

  const handleNotificationClick = (notification) => {
    // Có thể navigate đến trang chi tiết dựa trên relatedId và notificationType
    // Ví dụ: nếu là APPOINTMENT thì navigate đến /staff/appointments
    // Hoặc mở modal chi tiết
    console.log('Notification clicked:', notification)
  }

  const hasUnreadNotifications = notifications.some(n => !n.isRead)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và xem tất cả thông báo của bạn
          </p>
        </div>
        {hasUnreadNotifications && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Filter */}
      <NotificationFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      {/* Notifications List */}
      <NotificationList
        notifications={notifications}
        loading={isLoading}
        onNotificationClick={handleNotificationClick}
        onMarkAsRead={handleMarkAsRead}
      />

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
            disabled={pageNumber === 1 || isLoading}
          >
            Trước
          </Button>
          <span className="text-sm text-gray-600">
            Trang {pageNumber} / {Math.ceil(totalCount / pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(prev => prev + 1)}
            disabled={pageNumber >= Math.ceil(totalCount / pageSize) || isLoading}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}

