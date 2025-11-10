import { Search, Filter, X, Loader2 } from 'lucide-react'
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
 * UserFilter Component
 * Filter component cho danh sách người dùng
 */
export default function UserFilter({ filters, onFilterChange, onReset, isSearching = false }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          {isSearching ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-200" />
          )}
          <Input
            type="search"
            placeholder="Tìm kiếm theo email, số điện thoại, tên..."
            value={filters.keyword || ''}
            onChange={(e) => onFilterChange({ keyword: e.target.value })}
            className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${isSearching ? 'pr-10' : ''}`}
          />
        </div>

        {/* Role Filter */}
        <Select
          value={filters.role ? filters.role : 'ALL'}
          onValueChange={(value) => {
            if (value === 'ALL') {
              onFilterChange({ role: null })
            } else {
              onFilterChange({ role: value })
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tất cả Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả Role</SelectItem>
            <SelectItem value="MEMBER">Thành viên</SelectItem>
            <SelectItem value="STAFF">Nhân viên</SelectItem>
            <SelectItem value="ADMIN">Quản trị viên</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status ? filters.status : 'ALL'}
          onValueChange={(value) => {
            if (value === 'ALL') {
              onFilterChange({ status: null })
            } else {
              onFilterChange({ status: value })
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tất cả Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả Status</SelectItem>
            <SelectItem value="ACTIVE">Hoạt động</SelectItem>
            <SelectItem value="BANNED">Đã khóa</SelectItem>
            <SelectItem value="SUSPENDED">Tạm khóa</SelectItem>
            <SelectItem value="PENDING_VERIFICATION">Chờ xác minh</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {(filters.keyword || filters.role || filters.status) && (
          <Button
            variant="outline"
            onClick={onReset}
            className="gap-2 transition-all duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 animate-slide-in-right"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

