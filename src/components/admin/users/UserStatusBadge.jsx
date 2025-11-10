import { Badge } from '@/components/ui/badge'

/**
 * UserStatusBadge Component
 * Hiển thị badge trạng thái người dùng
 */
export default function UserStatusBadge({ status }) {
  const statusConfig = {
    ACTIVE: {
      label: 'Hoạt động',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    BANNED: {
      label: 'Đã khóa',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    SUSPENDED: {
      label: 'Tạm khóa',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    PENDING_VERIFICATION: {
      label: 'Chờ xác minh',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const config = statusConfig[status] || {
    label: status || 'Không xác định',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

