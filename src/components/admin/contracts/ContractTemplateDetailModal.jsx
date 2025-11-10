import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import ContractTemplateStatusBadge from './ContractTemplateStatusBadge'
import adminContractTemplateService from '@/api/services/adminContractTemplate.service'
import { toast } from 'sonner'
import { Loader2, FileText, Calendar, Edit, Tag } from 'lucide-react'

/**
 * ContractTemplateDetailModal Component
 * Hiển thị chi tiết mẫu hợp đồng
 */
export default function ContractTemplateDetailModal({ templateId, open, onOpenChange, onEdit }) {
  const [templateData, setTemplateData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && templateId) {
      loadTemplateDetail()
    }
  }, [open, templateId])

  const loadTemplateDetail = async () => {
    try {
      setLoading(true)
      const response = await adminContractTemplateService.getContractTemplateById(templateId)
      if (response.success) {
        setTemplateData(response.data)
      } else {
        toast.error(response.message || 'Không thể tải thông tin mẫu hợp đồng')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải thông tin mẫu hợp đồng')
      console.error('Error loading contract template detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('vi-VN')
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết mẫu hợp đồng</DialogTitle>
            <DialogDescription>
              Đang tải thông tin mẫu hợp đồng...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-sm text-gray-500 animate-pulse">Đang tải...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!templateData) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết mẫu hợp đồng</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về mẫu hợp đồng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 animate-fade-in">
          {/* Template Info */}
          <div className="space-y-4 animate-slide-in-right">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{templateData.templateName}</h3>
                  <p className="text-sm text-gray-500">ID: {templateData.templateId}</p>
                </div>
              </div>
              <ContractTemplateStatusBadge isActive={templateData.isActive} />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">Danh mục</span>
              </div>
              <p className="text-sm text-gray-900">
                {templateData.categoryName || 'Không có'}
              </p>
              {templateData.categoryId && (
                <p className="text-xs text-gray-500 mt-1">ID: {templateData.categoryId}</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">Ngày tạo</span>
              </div>
              <p className="text-sm text-gray-900">
                {formatDate(templateData.createdAt)}
              </p>
            </div>
          </div>

          {/* Template Content */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Nội dung mẫu hợp đồng</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 max-h-[400px] overflow-y-auto">
                {templateData.templateContent}
              </pre>
            </div>
            <p className="text-xs text-gray-500">
              Số ký tự: {templateData.templateContent?.length || 0}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
            {onEdit && (
              <Button
                onClick={() => {
                  onEdit(templateData)
                  onOpenChange(false)
                }}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

