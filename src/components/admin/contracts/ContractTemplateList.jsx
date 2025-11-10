import { Button } from '@/components/ui/button'
import ContractTemplateStatusBadge from './ContractTemplateStatusBadge'
import ContractTemplateListSkeleton from './ContractTemplateListSkeleton'
import { Eye, Edit, FileText, Trash2, Power } from 'lucide-react'
import { format } from 'date-fns'

/**
 * ContractTemplateList Component
 * Hiển thị danh sách mẫu hợp đồng với pagination và smooth transitions
 */
export default function ContractTemplateList({
  templates = [],
  loading = false,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleStatus,
  pagination,
  onPageChange
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return 'N/A'
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (loading) {
    return <ContractTemplateListSkeleton rows={pagination?.pageSize || 10} />
  }

  if (templates.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 animate-fade-in">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-fade-in" />
          <p className="text-sm text-gray-500">Không có mẫu hợp đồng nào</p>
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
                  Tên mẫu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
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
              {templates.map((template, index) => (
                <tr 
                  key={template.templateId} 
                  className="hover:bg-gray-50 transition-all duration-200 animate-fade-in"
                  style={{
                    animationDelay: `${Math.min(index * 30, 300)}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {template.templateName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {template.templateId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {template.categoryName || 'Không có'}
                    </div>
                    {template.categoryId && (
                      <div className="text-xs text-gray-500">
                        ID: {template.categoryId}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {truncateContent(template.templateContent, 80)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ContractTemplateStatusBadge isActive={template.isActive} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(template.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetail(template.templateId)}
                        className="gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Chi tiết
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(template)}
                        className="gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleStatus(template.templateId, template.isActive)}
                        className="gap-1"
                        title={template.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(template.templateId)}
                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
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
            tổng số {pagination.totalCount} mẫu hợp đồng
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

