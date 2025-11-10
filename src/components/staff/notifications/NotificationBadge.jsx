import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import staffNotificationService from '@/api/services/staffNotification.service'

/**
 * NotificationBadge Component
 * Badge hiển thị số thông báo chưa đọc
 */
export default function NotificationBadge({ className }) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await staffNotificationService.getUnreadCount()
        if (response.success) {
          setUnreadCount(response.data || 0)
        }
      } catch (error) {
        console.error('Error loading unread count:', error)
      }
    }

    loadUnreadCount()
    // Poll every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  if (unreadCount === 0) {
    return null
  }

  return (
    <Badge 
      variant="destructive" 
      className={className}
    >
      {unreadCount > 9 ? '9+' : unreadCount}
    </Badge>
  )
}


