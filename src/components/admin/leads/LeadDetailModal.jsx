import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, User, Mail, FileText, DollarSign, Clock } from 'lucide-react'

/**
 * LeadDetailModal Component
 * Modal hiển thị chi tiết Lead
 */
export default function LeadDetailModal({ lead, isOpen, onClose }) {
  if (!lead) return null

  const getStatusBadgeVariant = (status) => {
    if (!status) return 'outline'
    const upperStatus = status.toUpperCase()
    switch (upperStatus) {
      case 'NEW':
        return 'default'
      case 'ASSIGNED':
        return 'secondary'
      case 'CONTACTED':
        return 'secondary'
      case 'SCHEDULED':
        return 'default'
      case 'SUCCESSFUL':
        return 'default'
      case 'FAILED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status) => {
    if (!status) return 'N/A'
    const statusMap = {
      NEW: 'Mới',
      ASSIGNED: 'Đã gán',
      CONTACTED: 'Đã liên hệ',
      SCHEDULED: 'Đã lên lịch',
      SUCCESSFUL: 'Thành công',
      FAILED: 'Thất bại'
    }
    return statusMap[status.toUpperCase()] || status
  }

  const getLeadTypeLabel = (leadType) => {
    if (!leadType) return 'N/A'
    const typeMap = {
      SCHEDULE_VIEW: 'Đặt lịch xem',
      AUCTION_WINNER: 'Người thắng đấu giá'
    }
    return typeMap[leadType.toUpperCase()] || leadType
  }

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

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A'
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(price)
    } catch (error) {
      console.error('Error formatting price:', error)
      return 'N/A'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết Lead</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về Lead và người mua
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status và Lead Type */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant={getStatusBadgeVariant(lead.status)}>
              {getStatusLabel(lead.status)}
            </Badge>
            <Badge variant="outline">
              {getLeadTypeLabel(lead.leadType)}
            </Badge>
          </div>

          <Separator />

          {/* Thông tin bài đăng */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Thông tin bài đăng
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tiêu đề</p>
                <p className="font-medium">{lead.postTitle || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Post ID</p>
                <p className="font-mono text-sm">{lead.postId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Thông tin người mua */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin người mua
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tên</p>
                <p className="font-medium">{lead.buyerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="font-medium">{lead.buyerEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Buyer ID</p>
                <p className="font-mono text-sm">{lead.buyerId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Thông tin Staff */}
          {lead.staffId && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin Staff
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên Staff</p>
                    <p className="font-medium">{lead.staffName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Staff ID</p>
                    <p className="font-mono text-sm">{lead.staffId}</p>
                  </div>
                  {lead.assignedAt && (
                    <div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Thời gian gán
                      </p>
                      <p className="font-medium">{formatDate(lead.assignedAt)}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Thông tin giá (nếu là đấu giá) */}
          {lead.finalPrice && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Giá cuối cùng
                </h3>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(lead.finalPrice)}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Ghi chú */}
          {lead.notes && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Ghi chú</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {lead.notes}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Thông tin thời gian */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Thông tin thời gian
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Thời gian tạo</p>
                <p className="font-medium">{formatDate(lead.createdAt)}</p>
              </div>
              {lead.closedAt && (
                <div>
                  <p className="text-sm text-gray-500">Thời gian đóng</p>
                  <p className="font-medium">{formatDate(lead.closedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

