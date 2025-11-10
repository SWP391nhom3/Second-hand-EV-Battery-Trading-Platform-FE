import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

/**
 * NotificationFilter Component
 * Filter thông báo theo type và read status
 */
export default function NotificationFilter({ 
  filters, 
  onFilterChange, 
  onReset 
}) {
  const [localFilters, setLocalFilters] = useState({
    notificationType: filters?.notificationType ? filters.notificationType : 'all',
    isRead: filters?.isRead !== undefined ? String(filters.isRead) : 'all'
  })

  const handleTypeChange = (value) => {
    const newFilters = { ...localFilters, notificationType: value }
    setLocalFilters(newFilters)
    onFilterChange({
      notificationType: value === 'all' ? undefined : value,
      isRead: newFilters.isRead === 'all' ? undefined : newFilters.isRead === 'true'
    })
  }

  const handleReadStatusChange = (value) => {
    const newFilters = { ...localFilters, isRead: value }
    setLocalFilters(newFilters)
    onFilterChange({
      notificationType: newFilters.notificationType === 'all' ? undefined : newFilters.notificationType,
      isRead: value === 'all' ? undefined : value === 'true'
    })
  }

  const handleReset = () => {
    const resetFilters = {
      notificationType: 'all',
      isRead: 'all'
    }
    setLocalFilters(resetFilters)
    onFilterChange({
      notificationType: undefined,
      isRead: undefined
    })
    if (onReset) {
      onReset()
    }
  }

  const hasActiveFilters = localFilters.notificationType !== 'all' || localFilters.isRead !== 'all'

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Notification Type Filter */}
        <div className="flex-1">
          <Label htmlFor="notificationType" className="mb-2 block">
            Loại thông báo
          </Label>
          <Select
            value={localFilters.notificationType || 'all'}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger id="notificationType">
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="NEW_MESSAGE">Tin nhắn mới</SelectItem>
              <SelectItem value="NEW_BID">Đấu giá mới</SelectItem>
              <SelectItem value="ORDER_UPDATE">Cập nhật đơn hàng</SelectItem>
              <SelectItem value="PRICE_CHANGE">Thay đổi giá</SelectItem>
              <SelectItem value="NEW_LEAD">Lead mới</SelectItem>
              <SelectItem value="APPOINTMENT">Lịch hẹn</SelectItem>
              <SelectItem value="APPOINTMENT_CREATED">Lịch hẹn được tạo</SelectItem>
              <SelectItem value="APPOINTMENT_STATUS_UPDATED">Cập nhật lịch hẹn</SelectItem>
              <SelectItem value="POST_APPROVED">Bài đăng được duyệt</SelectItem>
              <SelectItem value="POST_REJECTED">Bài đăng bị từ chối</SelectItem>
              <SelectItem value="SYSTEM">Hệ thống</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Read Status Filter */}
        <div className="flex-1">
          <Label htmlFor="isRead" className="mb-2 block">
            Trạng thái
          </Label>
          <Select
            value={localFilters.isRead}
            onValueChange={handleReadStatusChange}
          >
            <SelectTrigger id="isRead">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="false">Chưa đọc</SelectItem>
              <SelectItem value="true">Đã đọc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full md:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Đặt lại
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

