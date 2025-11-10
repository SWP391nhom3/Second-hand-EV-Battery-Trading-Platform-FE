import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
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
 * PostFilter Component
 * Component filter cho danh sách bài đăng
 */
export default function PostFilter({ filters, onFiltersChange, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters || {})

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      keyword: '',
      categoryId: null,
      brand: '',
      sortBy: 'createdAt',
      sortDirection: 'desc'
    }
    setLocalFilters(resetFilters)
    onFiltersChange?.(resetFilters)
    onReset?.()
  }

  const hasActiveFilters = 
    localFilters.keyword ||
    localFilters.categoryId ||
    localFilters.brand ||
    localFilters.sortBy !== 'createdAt' ||
    localFilters.sortDirection !== 'desc'

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">Bộ lọc</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs transition-all duration-200 hover:scale-105"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Keyword */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, thương hiệu..."
              value={localFilters.keyword || ''}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <Select
            value={localFilters.categoryId?.toString() || 'all'}
            onValueChange={(value) => 
              handleFilterChange('categoryId', value === 'all' ? null : parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="1">Xe điện</SelectItem>
              <SelectItem value="2">Pin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div>
          <Select
            value={localFilters.sortBy || 'createdAt'}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Ngày tạo</SelectItem>
              <SelectItem value="price">Giá</SelectItem>
              <SelectItem value="title">Tiêu đề</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sort Direction */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Chiều sắp xếp:</span>
        <Button
          variant={localFilters.sortDirection === 'asc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('sortDirection', 'asc')}
        >
          Tăng dần
        </Button>
        <Button
          variant={localFilters.sortDirection === 'desc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('sortDirection', 'desc')}
        >
          Giảm dần
        </Button>
      </div>
    </div>
  )
}

