import { Badge } from '@/components/ui/badge'

/**
 * LeadListSkeleton Component
 * Skeleton loader cho danh sách Lead với hiệu ứng shimmer
 */
export default function LeadListSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bài đăng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người mua
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, index) => (
              <tr
                key={index}
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{
                  animationDelay: `${index * 30}ms`,
                  animationDuration: '200ms',
                  animationFillMode: 'both'
                }}
              >
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-32 animate-skeleton-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded w-24 animate-skeleton-pulse"></div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-28 animate-skeleton-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded w-36 animate-skeleton-pulse"></div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-20 animate-skeleton-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-24 animate-skeleton-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-16 animate-skeleton-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 animate-skeleton-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-24 animate-skeleton-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-16 animate-skeleton-pulse"></div>
                    <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 animate-skeleton-pulse"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

