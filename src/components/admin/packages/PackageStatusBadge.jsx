import { Badge } from '@/components/ui/badge'

/**
 * PackageStatusBadge Component
 * Hiển thị badge trạng thái gói tin (ACTIVE/INACTIVE)
 */
export default function PackageStatusBadge({ isActive }) {
  const statusConfig = {
    true: {
      label: 'Đang hoạt động',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    false: {
      label: 'Đã vô hiệu hóa',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const config = statusConfig[String(isActive)] || {
    label: 'Không xác định',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

