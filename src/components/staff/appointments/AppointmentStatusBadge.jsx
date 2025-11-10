import { Badge } from '@/components/ui/badge'

/**
 * AppointmentStatusBadge Component
 * Component hiển thị badge trạng thái Appointment với màu sắc phù hợp
 */
export default function AppointmentStatusBadge({ status }) {
  const getStatusBadgeVariant = (status) => {
    if (!status) return 'outline'
    const upperStatus = status.toUpperCase()
    switch (upperStatus) {
      case 'CONFIRMED':
        return 'default'
      case 'CANCELED':
        return 'destructive'
      case 'COMPLETED':
        return 'default'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status) => {
    if (!status) return 'N/A'
    const statusMap = {
      CONFIRMED: 'Đã xác nhận',
      CANCELED: 'Đã hủy',
      COMPLETED: 'Đã hoàn thành'
    }
    return statusMap[status.toUpperCase()] || status
  }

  const getStatusColor = (status) => {
    if (!status) return ''
    const upperStatus = status.toUpperCase()
    switch (upperStatus) {
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CANCELED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return ''
    }
  }

  return (
    <Badge variant={getStatusBadgeVariant(status)} className={getStatusColor(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}


