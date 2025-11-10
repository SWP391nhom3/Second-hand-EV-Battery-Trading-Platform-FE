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
import { Calendar, User, Mail, FileText, DollarSign, Clock, Edit, MessageSquarePlus } from 'lucide-react'
import LeadStatusBadge from './LeadStatusBadge'
import { useState } from 'react'
import staffChatService from '@/api/services/staffChat.service'
import { toast } from 'sonner'

/**
 * LeadDetailModal Component for Staff
 * Modal hiển thị chi tiết Lead với nút cập nhật trạng thái
 */
export default function LeadDetailModal({ 
  lead, 
  isOpen, 
  onClose, 
  onUpdateStatus 
}) {
  if (!lead) return null
  const [creatingChat, setCreatingChat] = useState(false)

  const handleCreateChat = async () => {
    try {
      setCreatingChat(true)
      const response = await staffChatService.createRoomForLead(lead.leadId)
      if (response?.success) {
        toast.success('Đã tạo phòng chat cho Lead. Mở mục Chat để trao đổi.')
        // Optional: open staff chat page in new tab
        window.open('/staff/chat', '_blank')
      } else {
        toast.error(response?.message || 'Không thể tạo phòng chat cho Lead')
      }
    } catch (error) {
      console.error('Error creating chat room:', error)
      toast.error(error?.response?.data?.message || 'Đã xảy ra lỗi khi tạo phòng chat')
    } finally {
      setCreatingChat(false)
    }
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

  // Kiểm tra xem có thể cập nhật trạng thái không (chỉ khi chưa thành công hoặc thất bại)
  const canUpdateStatus = lead.status && 
    !['SUCCESSFUL', 'FAILED'].includes(lead.status.toUpperCase())

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
          <div className="flex gap-2 flex-wrap items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <LeadStatusBadge status={lead.status} />
              <Badge variant="outline">
                {getLeadTypeLabel(lead.leadType)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateChat}
                disabled={creatingChat}
                className="flex items-center gap-2"
              >
                <MessageSquarePlus className="h-4 w-4" />
                {creatingChat ? 'Đang tạo chat...' : 'Tạo phòng chat Lead'}
              </Button>
              {canUpdateStatus && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onClose()
                    onUpdateStatus(lead)
                  }}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Cập nhật trạng thái
                </Button>
              )}
            </div>
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

