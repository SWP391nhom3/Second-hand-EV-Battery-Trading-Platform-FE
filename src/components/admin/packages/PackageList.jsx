import { Button } from '@/components/ui/button'
import PackageStatusBadge from './PackageStatusBadge'
import PackageListSkeleton from './PackageListSkeleton'
import { Eye, Edit, Package, Power } from 'lucide-react'
import { format } from 'date-fns'

/**
 * PackageList Component
 * Hiển thị danh sách gói tin với pagination và smooth transitions
 */
export default function PackageList({
  packages = [],
  loading = false,
  onViewDetail,
  onEdit,
  onToggleStatus,
  pagination,
  onPageChange
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return <PackageListSkeleton rows={pagination?.pageSize || 10} />
  }

  if (packages.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 animate-fade-in">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-fade-in" />
          <p className="text-sm text-gray-500">Không có gói tin nào</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table with smooth transitions */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gói tin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ưu tiên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ảnh tối đa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg, index) => (
                <tr 
                  key={pkg.id} 
                  className="hover:bg-gray-50 transition-all duration-200 animate-fade-in"
                  style={{
                    animationDelay: `${Math.min(index * 30, 300)}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {pkg.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {pkg.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(pkg.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.creditsCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.priorityLevel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.maxImages}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PackageStatusBadge isActive={pkg.isActive} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(pkg.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetail(pkg.id)}
                        className="gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Chi tiết
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(pkg)}
                        className="gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleStatus(pkg.id, pkg.isActive)}
                        className="gap-1"
                        title={pkg.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {pagination.pageNumber * pagination.pageSize - pagination.pageSize + 1}-
            {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} trong
            tổng số {pagination.totalCount} gói tin
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber <= 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              {pagination.pageNumber} / {pagination.totalPages}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= pagination.totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

