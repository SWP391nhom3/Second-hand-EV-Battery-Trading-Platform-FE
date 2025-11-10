import { Badge } from '@/components/ui/badge'

/**
 * ContractTemplateStatusBadge Component
 * Hiển thị badge trạng thái mẫu hợp đồng
 */
export default function ContractTemplateStatusBadge({ isActive }) {
  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={`${
        isActive
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      {isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
    </Badge>
  )
}

