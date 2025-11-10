import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, User, Mail, Phone, ExternalLink, Download, Send } from 'lucide-react'
import ContractStatusBadge from './ContractStatusBadge'
import staffContractService from '@/api/services/staffContract.service'
import { toast } from 'sonner'
import { useState } from 'react'

/**
 * ContractDetailModal Component for Staff
 * Modal hiển thị chi tiết hợp đồng
 */
export default function ContractDetailModal({ 
  contract, 
  isOpen, 
  onClose,
  onUpdate
}) {
  const [isSending, setIsSending] = useState(false)

  if (!contract) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'N/A'
    }
  }

  const handleDownloadPdf = async () => {
    try {
      const response = await staffContractService.getContractPdfUrl(contract.contractId)
      if (response?.success && response.data) {
        // Mở PDF trong tab mới
        window.open(response.data, '_blank')
      } else {
        toast.error('Không thể tải file PDF')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Có lỗi xảy ra khi tải file PDF')
    }
  }

  const handleViewPdf = () => {
    if (contract.contractPdfUrl) {
      window.open(contract.contractPdfUrl, '_blank')
    } else {
      handleDownloadPdf()
    }
  }

  const handleSendForSignature = async () => {
    if (!contract.contractId) return

    if (contract.status !== 'DRAFT') {
      toast.error('Chỉ có thể gửi hợp đồng ở trạng thái DRAFT')
      return
    }

    if (!confirm('Bạn có chắc chắn muốn gửi hợp đồng này để ký? Hợp đồng sẽ được gửi cho cả người mua và người bán.')) {
      return
    }

    setIsSending(true)
    try {
      const response = await staffContractService.sendForSignature(contract.contractId)
      if (response?.success) {
        toast.success('Gửi hợp đồng để ký thành công!')
        onUpdate?.(response.data)
        onClose()
      } else {
        toast.error(response?.message || 'Không thể gửi hợp đồng để ký')
      }
    } catch (error) {
      console.error('Error sending contract for signature:', error)
      toast.error('Có lỗi xảy ra khi gửi hợp đồng để ký')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết hợp đồng</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về hợp đồng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status và Info */}
          <div className="flex gap-2 flex-wrap items-center justify-between">
            <ContractStatusBadge status={contract.status} />
            <div className="flex gap-2">
              {contract.status === 'DRAFT' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSendForSignature}
                  disabled={isSending}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSending ? 'Đang gửi...' : 'Gửi để ký'}
                </Button>
              )}
              {contract.contractPdfUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewPdf}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Xem PDF
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPdf}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Tải PDF
              </Button>
            </div>
          </div>

          <Separator />

          {/* Thông tin hợp đồng */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Thông tin hợp đồng
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Mã hợp đồng</p>
                <p className="font-medium">{contract.contractId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mẫu hợp đồng</p>
                <p className="font-medium">{contract.templateName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Người tạo</p>
                <p className="font-medium">{contract.createdByName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">{formatDate(contract.createdAt)}</p>
              </div>
              {contract.leadId && (
                <div>
                  <p className="text-sm text-gray-500">Lead ID</p>
                  <p className="font-medium">{contract.leadId}</p>
                </div>
              )}
              {contract.orderId && (
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{contract.orderId}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Trạng thái ký */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Trạng thái ký
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Người mua</p>
                <div className="flex items-center gap-2">
                  <Badge variant={contract.isBuyerSigned ? 'default' : 'secondary'}>
                    {contract.isBuyerSigned ? 'Đã ký' : 'Chưa ký'}
                  </Badge>
                  {contract.buyerSignedAt && (
                    <p className="text-xs text-gray-500">
                      {formatDate(contract.buyerSignedAt)}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Người bán</p>
                <div className="flex items-center gap-2">
                  <Badge variant={contract.isSellerSigned ? 'default' : 'secondary'}>
                    {contract.isSellerSigned ? 'Đã ký' : 'Chưa ký'}
                  </Badge>
                  {contract.sellerSignedAt && (
                    <p className="text-xs text-gray-500">
                      {formatDate(contract.sellerSignedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {contract.signedAt && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  Hợp đồng đã được ký hoàn tất vào {formatDate(contract.signedAt)}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Nội dung hợp đồng */}
          {contract.contractContent && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Nội dung hợp đồng</h3>
              <div className="p-4 border rounded-lg bg-gray-50 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {contract.contractContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

