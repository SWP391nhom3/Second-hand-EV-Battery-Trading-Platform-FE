import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import NotificationList from '@/components/member/notification/NotificationList'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import notificationService from '@/api/services/notification.service'
import { toast } from 'sonner'
import { CheckCheck } from 'lucide-react'

/**
 * Notifications Page
 * Trang thông báo cho Member
 */
export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState({
    notificationType: null,
    isRead: null
  })

  useEffect(() => {
    loadNotifications()
  }, [filters])

  const loadNotifications = async (page = 1) => {
    try {
      setLoading(true)
      
      // Convert filter values to match backend expectations
      const apiParams = {
        pageNumber: page,
        pageSize: 20,
        notificationType: filters.notificationType || undefined,
        // Convert isRead filter: null = all, true = read, false = unread
        isRead: filters.isRead === null ? undefined : filters.isRead
      }

      const response = await notificationService.getNotifications(apiParams)

      // PagedResponse structure: { success, message, data: Array<T>, pageNumber, pageSize, totalCount, ... }
      // data is directly an array, not an object with items property
      if (response.success && response.data) {
        const newNotifications = Array.isArray(response.data) ? response.data : []
        
        if (page === 1) {
          setNotifications(newNotifications)
        } else {
          setNotifications((prev) => [...prev, ...newNotifications])
        }
        
        // Check if there are more pages
        const hasMorePages = response.hasNext || (newNotifications.length === 20)
        setHasMore(hasMorePages)
        setPageNumber(page)
        
        console.log('Notifications loaded:', {
          count: newNotifications.length,
          page,
          totalCount: response.totalCount,
          hasMore: hasMorePages
        })
      } else {
        console.error('Failed to load notifications:', response)
        toast.error(response.message || 'Không thể tải danh sách thông báo')
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
      console.error('Error response:', error.response?.data)
      toast.error(error.response?.data?.message || 'Không thể tải danh sách thông báo')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = (notification) => {
    // Navigate to related page based on notification type
    if (notification.relatedId) {
      switch (notification.notificationType) {
        case 'NEW_MESSAGE':
          // Navigate to chat
          window.location.href = `/member/chat`
          break
        case 'NEW_BID':
          // Navigate to auction
          window.location.href = `/auctions/${notification.relatedId}`
          break
        case 'ORDER_UPDATE':
          // Navigate to order/payment
          window.location.href = `/payments/${notification.relatedId}`
          break
        case 'NEW_LEAD':
          // Navigate to leads
          window.location.href = `/member/leads`
          break
        case 'APPOINTMENT':
          // Navigate to appointments
          window.location.href = `/member/leads`
          break
        default:
          break
      }
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId)
      if (response.success) {
        // Update notification in list
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.notificationId === notificationId
              ? { ...notif, isRead: true }
              : notif
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Không thể đánh dấu thông báo đã đọc')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead()
      if (response.success) {
        // Update all notifications
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        )
        toast.success('Đã đánh dấu tất cả thông báo đã đọc')
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Không thể đánh dấu tất cả thông báo đã đọc')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      
      if (value === 'all') {
        newFilters[key] = null
      } else if (key === 'isRead') {
        // Convert "read" -> true, "unread" -> false
        newFilters[key] = value === 'read' ? true : value === 'unread' ? false : null
      } else {
        newFilters[key] = value
      }
      
      return newFilters
    })
    setPageNumber(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Thông báo</h1>
            <p className="text-muted-foreground mt-2">
              Xem và quản lý thông báo của bạn
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Đánh dấu tất cả đã đọc
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <Select
            value={filters.notificationType || 'all'}
            onValueChange={(value) => handleFilterChange('notificationType', value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Loại thông báo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="NEW_MESSAGE">Tin nhắn mới</SelectItem>
              <SelectItem value="NEW_BID">Đấu giá mới</SelectItem>
              <SelectItem value="ORDER_UPDATE">Cập nhật đơn hàng</SelectItem>
              <SelectItem value="PRICE_CHANGE">Thay đổi giá</SelectItem>
              <SelectItem value="NEW_LEAD">Lead mới</SelectItem>
              <SelectItem value="APPOINTMENT">Lịch hẹn</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.isRead === null ? 'all' : filters.isRead ? 'read' : 'unread'}
            onValueChange={(value) => handleFilterChange('isRead', value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="unread">Chưa đọc</SelectItem>
              <SelectItem value="read">Đã đọc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notification List */}
        <NotificationList
          notifications={notifications}
          loading={loading}
          onNotificationClick={handleNotificationClick}
          onMarkAsRead={handleMarkAsRead}
        />

        {/* Load More */}
        {hasMore && !loading && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => loadNotifications(pageNumber + 1)}
            >
              Tải thêm
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

