import { Eye, Calendar, MapPin, Clock, User, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AppointmentStatusBadge from './AppointmentStatusBadge'
import AppointmentListSkeleton from './AppointmentListSkeleton'
import { formatDateTime } from '@/lib/utils'

/**
 * AppointmentList Component for Staff
 * Component hiển thị danh sách Appointments
 */
export default function AppointmentList({
  appointments = [],
  loading,
  onViewDetail,
  onUpdate,
  onCancel
}) {
  if (loading) {
    return <AppointmentListSkeleton rows={8} />
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-gray-100 p-4 rounded-full mb-4 animate-in zoom-in duration-500">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
            Không có lịch hẹn nào
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            Hiện tại không có lịch hẹn nào. Hãy tạo lịch hẹn mới để bắt đầu.
          </p>
        </div>
      </div>
    )
  }

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
                Thời gian
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa điểm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người mua / Người bán
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment, index) => {
              if (!appointment || !appointment.appointmentId) {
                console.warn('Invalid appointment data:', appointment)
                return null
              }
              
              return (
                <tr
                  key={appointment.appointmentId || `appointment-${index}`}
                  className="hover:bg-gray-50 transition-colors duration-200 animate-in fade-in slide-in-from-bottom-2"
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animationDuration: '300ms',
                    animationFillMode: 'both'
                  }}
                >
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {appointment.postTitle || 'N/A'}
                        </p>
                      </div>
                      {appointment.postId && (
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {appointment.postId.substring(0, 8)}...
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{appointment.startTime ? formatDateTime(appointment.startTime) : 'N/A'}</span>
                      </div>
                      {appointment.endTime && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>Đến: {formatDateTime(appointment.endTime)}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 max-w-xs">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 truncate">
                        {appointment.location || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{appointment.buyerName || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{appointment.sellerName || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <AppointmentStatusBadge status={appointment.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetail(appointment)}
                        className="flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:shadow-sm"
                      >
                        <Eye className="h-4 w-4" />
                        Xem
                      </Button>
                      {/* Chỉ hiển thị nút cập nhật/hủy nếu chưa hoàn thành hoặc đã hủy */}
                      {appointment.status && 
                       !['COMPLETED', 'CANCELED'].includes(appointment.status.toUpperCase()) && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onUpdate(appointment)}
                            className="flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
                          >
                            Cập nhật
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onCancel(appointment)}
                            className="flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
                          >
                            Hủy
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}


