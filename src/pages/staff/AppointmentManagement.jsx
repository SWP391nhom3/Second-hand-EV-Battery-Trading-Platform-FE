import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Plus, Calendar } from 'lucide-react'
import AppointmentFilter from '@/components/staff/appointments/AppointmentFilter'
import AppointmentList from '@/components/staff/appointments/AppointmentList'
import AppointmentCreateModal from '@/components/staff/appointments/AppointmentCreateModal'
import AppointmentUpdateModal from '@/components/staff/appointments/AppointmentUpdateModal'
import AppointmentDetailModal from '@/components/staff/appointments/AppointmentDetailModal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import staffAppointmentService from '@/api/services/staffAppointment.service'
import { appointmentStatusUpdateSchema } from '@/lib/validations/appointment.validation'

/**
 * AppointmentManagement Page
 * Quản lý lịch hẹn cho Staff - UC41, UC42
 * Module 3: Quản lý Lịch hẹn
 */
export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter states
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [timeFilter, setTimeFilter] = useState('ALL')

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // Alert dialog states
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)
  const [appointmentToComplete, setAppointmentToComplete] = useState(null)

  useEffect(() => {
    loadAppointments()
  }, [pageNumber, pageSize, statusFilter, timeFilter])

  const loadAppointments = async () => {
    try {
      setIsLoading(true)

      const params = {
        pageNumber,
        pageSize,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        upcoming: timeFilter === 'UPCOMING' ? true : undefined,
        past: timeFilter === 'PAST' ? true : undefined,
        sortBy: 'StartTime',
        sortOrder: 'ASC'
      }

      const response = await staffAppointmentService.getAppointments(params)

      if (response?.success && response?.data) {
        setAppointments(response.data.data || [])
        setTotalCount(response.data.totalCount || 0)
      } else {
        toast.error(response?.message || 'Không thể tải danh sách lịch hẹn')
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
      toast.error('Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAppointment = async (data) => {
    try {
      const response = await staffAppointmentService.createAppointment(data)

      if (response?.success) {
        toast.success('Tạo lịch hẹn thành công')
        loadAppointments()
      } else {
        toast.error(response?.message || 'Không thể tạo lịch hẹn')
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error(error?.response?.data?.message || 'Không thể tạo lịch hẹn. Vui lòng thử lại.')
    }
  }

  const handleUpdateAppointment = async (appointmentId, data) => {
    try {
      const response = await staffAppointmentService.updateAppointment(appointmentId, data)

      if (response?.success) {
        toast.success('Cập nhật lịch hẹn thành công')
        loadAppointments()
      } else {
        toast.error(response?.message || 'Không thể cập nhật lịch hẹn')
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error(error?.response?.data?.message || 'Không thể cập nhật lịch hẹn. Vui lòng thử lại.')
    }
  }

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return

    try {
      const response = await staffAppointmentService.cancelAppointment(appointmentToCancel.appointmentId)

      if (response?.success) {
        toast.success('Hủy lịch hẹn thành công')
        loadAppointments()
        setIsCancelDialogOpen(false)
        setAppointmentToCancel(null)
      } else {
        toast.error(response?.message || 'Không thể hủy lịch hẹn')
      }
    } catch (error) {
      console.error('Error canceling appointment:', error)
      toast.error(error?.response?.data?.message || 'Không thể hủy lịch hẹn. Vui lòng thử lại.')
    }
  }

  const handleCompleteAppointment = async () => {
    if (!appointmentToComplete) return

    try {
      const response = await staffAppointmentService.updateAppointmentStatus(
        appointmentToComplete.appointmentId,
        { status: 'COMPLETED' }
      )

      if (response?.success) {
        toast.success('Đánh dấu hoàn thành lịch hẹn thành công')
        loadAppointments()
        setIsCompleteDialogOpen(false)
        setAppointmentToComplete(null)
      } else {
        toast.error(response?.message || 'Không thể đánh dấu hoàn thành lịch hẹn')
      }
    } catch (error) {
      console.error('Error completing appointment:', error)
      toast.error(error?.response?.data?.message || 'Không thể đánh dấu hoàn thành lịch hẹn. Vui lòng thử lại.')
    }
  }

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailModalOpen(true)
  }

  const handleUpdate = (appointment) => {
    setSelectedAppointment(appointment)
    setIsUpdateModalOpen(true)
  }

  const handleCancel = (appointment) => {
    setAppointmentToCancel(appointment)
    setIsCancelDialogOpen(true)
  }

  const handleComplete = (appointment) => {
    setAppointmentToComplete(appointment)
    setIsCompleteDialogOpen(true)
  }

  const handleFilterReset = () => {
    setStatusFilter('ALL')
    setTimeFilter('ALL')
    setPageNumber(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Quản lý lịch hẹn
          </h1>
          <p className="text-gray-500 mt-1">
            Tạo và quản lý lịch hẹn với người mua và người bán
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tạo lịch hẹn mới
        </Button>
      </div>

      {/* Filter */}
      <AppointmentFilter
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        onReset={handleFilterReset}
      />

      {/* Appointment List */}
      <AppointmentList
        appointments={appointments}
        loading={isLoading}
        onViewDetail={handleViewDetail}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
      />

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {appointments.length} / {totalCount} lịch hẹn
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
              disabled={pageNumber === 1 || isLoading}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber((prev) => prev + 1)}
              disabled={pageNumber * pageSize >= totalCount || isLoading}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <AppointmentCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAppointment}
      />

      {/* Update Modal */}
      <AppointmentUpdateModal
        appointment={selectedAppointment}
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false)
          setSelectedAppointment(null)
        }}
        onSubmit={handleUpdateAppointment}
      />

      {/* Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedAppointment(null)
        }}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
        onComplete={handleComplete}
      />

      {/* Cancel Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy lịch hẹn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelAppointment}>
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Dialog */}
      <AlertDialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hoàn thành lịch hẹn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đánh dấu lịch hẹn này là đã hoàn thành?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleCompleteAppointment}>
              Xác nhận hoàn thành
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


