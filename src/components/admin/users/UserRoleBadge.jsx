import { Badge } from '@/components/ui/badge'

/**
 * UserRoleBadge Component
 * Hiển thị badge role người dùng
 */
export default function UserRoleBadge({ role }) {
  const roleConfig = {
    MEMBER: {
      label: 'Thành viên',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    STAFF: {
      label: 'Nhân viên',
      className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    ADMIN: {
      label: 'Quản trị viên',
      className: 'bg-orange-100 text-orange-800 border-orange-200'
    }
  }

  const config = roleConfig[role] || {
    label: role || 'Không xác định',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

