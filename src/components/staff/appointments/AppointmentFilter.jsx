import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * AppointmentFilter Component for Staff
 * Component filter cho danh sách Appointment
 */
export default function AppointmentFilter({
  statusFilter = 'ALL',
  onStatusFilterChange,
  timeFilter = 'ALL',
  onTimeFilterChange,
  onReset
}) {
  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="CANCELED">Đã hủy</SelectItem>
              <SelectItem value="COMPLETED">Đã hoàn thành</SelectItem>
            </SelectContent>
          </Select>

          {/* Time Filter */}
          <Select value={timeFilter} onValueChange={onTimeFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="UPCOMING">Sắp tới</SelectItem>
              <SelectItem value="PAST">Đã qua</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
          >
            <Filter className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}


