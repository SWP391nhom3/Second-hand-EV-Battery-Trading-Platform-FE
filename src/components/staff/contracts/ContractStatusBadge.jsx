import { Badge } from '@/components/ui/badge'

/**
 * ContractStatusBadge Component
 * Component hiển thị badge trạng thái hợp đồng với màu sắc phù hợp
 */
export default function ContractStatusBadge({ status }) {
  const getStatusBadgeVariant = (status) => {
    if (!status) return 'outline'
    const upperStatus = status.toUpperCase()
    switch (upperStatus) {
      case 'DRAFT':
        return 'secondary' // Gray
      case 'PENDING_SIGNATURE':
        return 'default' // Blue
      case 'SIGNED':
        return 'default' // Green (có thể custom màu xanh)
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status) => {
    if (!status) return 'N/A'
    const statusMap = {
      DRAFT: 'Nháp',
      PENDING_SIGNATURE: 'Đang chờ ký',
      SIGNED: 'Đã ký'
    }
    return statusMap[status.toUpperCase()] || status
  }

  const getStatusColor = (status) => {
    if (!status) return ''
    const upperStatus = status.toUpperCase()
    switch (upperStatus) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'PENDING_SIGNATURE':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'SIGNED':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return ''
    }
  }

  return (
    <Badge 
      variant={getStatusBadgeVariant(status)}
      className={getStatusColor(status)}
    >
      {getStatusLabel(status)}
    </Badge>
  )
}


