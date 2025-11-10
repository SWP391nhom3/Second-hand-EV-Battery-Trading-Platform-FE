import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * LeadFilter Component
 * Component filter cho danh sách Lead
 */
export default function LeadFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  leadTypeFilter,
  onLeadTypeFilterChange,
  onReset
}) {
  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-200" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên người mua, email, tiêu đề bài đăng..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="NEW">Mới</SelectItem>
              <SelectItem value="ASSIGNED">Đã gán</SelectItem>
              <SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
              <SelectItem value="SCHEDULED">Đã lên lịch</SelectItem>
              <SelectItem value="SUCCESSFUL">Thành công</SelectItem>
              <SelectItem value="FAILED">Thất bại</SelectItem>
            </SelectContent>
          </Select>

          {/* Lead Type Filter */}
          <Select value={leadTypeFilter} onValueChange={onLeadTypeFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Loại Lead" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="SCHEDULE_VIEW">Đặt lịch xem</SelectItem>
              <SelectItem value="AUCTION_WINNER">Người thắng đấu giá</SelectItem>
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

