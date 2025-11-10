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
import { Calendar, User, Mail, FileText, MapPin, Clock, Edit, X, CheckCircle } from 'lucide-react'
import AppointmentStatusBadge from './AppointmentStatusBadge'
import { formatDateTime } from '@/lib/utils'

/**
 * AppointmentDetailModal Component for Staff
 * Modal hiển thị chi tiết Appointment với các nút thao tác
 */
export default function AppointmentDetailModal({ 
  appointment, 
  isOpen, 
  onClose, 
  onUpdate,
  onCancel,
  onComplete
}) {
  if (!appointment) return null

  // Kiểm tra xem có thể cập nhật/hủy/hoàn thành không
  const canUpdate = appointment.status && 
    !['COMPLETED', 'CANCELED'].includes(appointment.status.toUpperCase())
  const canCancel = appointment.status && 
    appointment.status.toUpperCase() === 'CONFIRMED'
  const canComplete = appointment.status && 
    appointment.status.toUpperCase() === 'CONFIRMED'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về lịch hẹn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex gap-2 flex-wrap items-center justify-between">
            <AppointmentStatusBadge status={appointment.status} />
            {canUpdate && (
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onClose()
                    onUpdate(appointment)
                  }}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Cập nhật
                </Button>
                {canCancel && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onClose()
                      onCancel(appointment)
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </Button>
                )}
                {canComplete && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      onClose()
                      onComplete(appointment)
                    }}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Hoàn thành
                  </Button>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Thông tin lịch hẹn */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Thông tin lịch hẹn
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Thời gian bắt đầu
                </p>
                <p className="font-medium">{appointment.startTime ? formatDateTime(appointment.startTime) : 'N/A'}</p>
              </div>
              {appointment.endTime && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Thời gian kết thúc
                  </p>
                  <p className="font-medium">{formatDateTime(appointment.endTime)}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Địa điểm
                </p>
                <p className="font-medium">{appointment.location || 'N/A'}</p>
              </div>
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
                <p className="font-medium">{appointment.postTitle || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Post ID</p>
                <p className="font-mono text-sm">{appointment.postId}</p>
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
                <p className="font-medium">{appointment.buyerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="font-medium">{appointment.buyerEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Buyer ID</p>
                <p className="font-mono text-sm">{appointment.buyerId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Thông tin người bán */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin người bán
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tên</p>
                <p className="font-medium">{appointment.sellerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="font-medium">{appointment.sellerEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Seller ID</p>
                <p className="font-mono text-sm">{appointment.sellerId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Thông tin Staff */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin Staff
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tên Staff</p>
                <p className="font-medium">{appointment.staffName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Staff ID</p>
                <p className="font-mono text-sm">{appointment.staffId}</p>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          {appointment.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Ghi chú</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {appointment.notes}
                </p>
              </div>
            </>
          )}

          {/* Thông tin Lead */}
          <Separator />
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin Lead</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Lead ID</p>
                <p className="font-mono text-sm">{appointment.leadId}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


