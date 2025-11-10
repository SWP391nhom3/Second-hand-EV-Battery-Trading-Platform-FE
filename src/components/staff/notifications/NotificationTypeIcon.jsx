import { 
  MessageSquare, 
  Gavel, 
  Package, 
  DollarSign, 
  UserCheck, 
  Calendar, 
  Bell,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * NotificationTypeIcon Component
 * Hiển thị icon khác nhau theo loại thông báo
 */
export default function NotificationTypeIcon({ type, className }) {
  const iconConfig = {
    // Tin nhắn
    NEW_MESSAGE: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
    MESSAGE: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
    
    // Đấu giá
    NEW_BID: { icon: Gavel, color: 'text-purple-600', bg: 'bg-purple-100' },
    BID_OUTBID: { icon: Gavel, color: 'text-orange-600', bg: 'bg-orange-100' },
    BID_WON: { icon: Gavel, color: 'text-green-600', bg: 'bg-green-100' },
    
    // Đơn hàng
    ORDER_UPDATE: { icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    ORDER_CREATED: { icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    ORDER_PAID: { icon: Package, color: 'text-green-600', bg: 'bg-green-100' },
    ORDER_DELIVERED: { icon: Package, color: 'text-green-600', bg: 'bg-green-100' },
    
    // Giá
    PRICE_CHANGE: { icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    
    // Lead
    NEW_LEAD: { icon: UserCheck, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    LEAD_ASSIGNED: { icon: UserCheck, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    LEAD_STATUS_UPDATED: { icon: UserCheck, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    
    // Lịch hẹn
    APPOINTMENT: { icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-100' },
    APPOINTMENT_CREATED: { icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-100' },
    APPOINTMENT_STATUS_UPDATED: { icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-100' },
    APPOINTMENT_REMINDER: { icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
    
    // Hệ thống
    SYSTEM: { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-100' },
    POST_APPROVED: { icon: Bell, color: 'text-green-600', bg: 'bg-green-100' },
    POST_REJECTED: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    POST_EXPIRED: { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-100' }
  }

  const config = iconConfig[type] || iconConfig.SYSTEM
  const Icon = config.icon

  return (
    <div className={cn('p-2 rounded-lg', config.bg, className)}>
      <Icon className={cn('h-5 w-5', config.color)} />
    </div>
  )
}


