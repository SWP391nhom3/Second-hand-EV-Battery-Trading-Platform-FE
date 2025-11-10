import { Badge } from '@/components/ui/badge'

/**
 * LeadStatusBadge Component
 * Component hiển thị badge trạng thái Lead với màu sắc phù hợp
 */
export default function LeadStatusBadge({ status }) {
  const getStatusBadgeVariant = (status) => {
    if (!status) return 'outline'
    const upperStatus = status.toUpperCase()
    switch (upperStatus) {
      case 'NEW':
        return 'default'
      case 'ASSIGNED':
        return 'secondary'
      case 'CONTACTED':
        return 'secondary'
      case 'SCHEDULED':
        return 'default'
      case 'SUCCESSFUL':
        return 'default'
      case 'FAILED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status) => {
    if (!status) return 'N/A'
    const statusMap = {
      NEW: 'Mới',
      ASSIGNED: 'Đã gán',
      CONTACTED: 'Đã liên hệ',
      SCHEDULED: 'Đã lên lịch',
      SUCCESSFUL: 'Thành công',
      FAILED: 'Thất bại'
    }
    return statusMap[status.toUpperCase()] || status
  }

  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}

