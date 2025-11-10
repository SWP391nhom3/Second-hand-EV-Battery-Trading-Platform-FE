import React, { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

/**
 * SearchFilters Component
 * Component để lọc sản phẩm theo các tiêu chí
 */
export default function SearchFilters({ filters, onFiltersChange, onReset }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const handleReset = () => {
    if (onReset) {
      onReset()
    }
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== null && value !== undefined && value !== ''
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-lg">Bộ lọc</CardTitle>
            {hasActiveFilters && (
              <span className="text-xs text-muted-foreground">
                ({Object.values(filters).filter(v => v !== null && v !== undefined && v !== '').length} bộ lọc đang áp dụng)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="h-4 w-4 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Thu gọn' : 'Mở rộng'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Filters - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <Label>Danh mục</Label>
            <Select
              value={filters.categoryId?.toString() || ''}
              onValueChange={(value) => handleFilterChange('categoryId', value ? parseInt(value, 10) : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả danh mục</SelectItem>
                <SelectItem value="1">Xe điện</SelectItem>
                <SelectItem value="2">Pin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label>Thương hiệu</Label>
            <Input
              placeholder="Nhập thương hiệu"
              value={filters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value || null)}
            />
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label>Model</Label>
            <Input
              placeholder="Nhập model"
              value={filters.model || ''}
              onChange={(e) => handleFilterChange('model', e.target.value || null)}
            />
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <Label>Địa điểm</Label>
                <Input
                  placeholder="Nhập địa điểm"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || null)}
                />
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Giá tối thiểu (VNĐ)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>

              <div className="space-y-2">
                <Label>Giá tối đa (VNĐ)</Label>
                <Input
                  type="number"
                  placeholder="Không giới hạn"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>

              {/* Production Year */}
              <div className="space-y-2">
                <Label>Năm sản xuất từ</Label>
                <Input
                  type="number"
                  placeholder="1900"
                  min="1900"
                  max="2100"
                  value={filters.minProductionYear || ''}
                  onChange={(e) => handleFilterChange('minProductionYear', e.target.value ? parseInt(e.target.value, 10) : null)}
                />
              </div>

              <div className="space-y-2">
                <Label>Năm sản xuất đến</Label>
                <Input
                  type="number"
                  placeholder="2100"
                  min="1900"
                  max="2100"
                  value={filters.maxProductionYear || ''}
                  onChange={(e) => handleFilterChange('maxProductionYear', e.target.value ? parseInt(e.target.value, 10) : null)}
                />
              </div>

              {/* Battery Capacity */}
              <div className="space-y-2">
                <Label>Dung lượng pin tối thiểu (kWh)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minBatteryCapacity || ''}
                  onChange={(e) => handleFilterChange('minBatteryCapacity', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>

              <div className="space-y-2">
                <Label>Dung lượng pin tối đa (kWh)</Label>
                <Input
                  type="number"
                  placeholder="Không giới hạn"
                  value={filters.maxBatteryCapacity || ''}
                  onChange={(e) => handleFilterChange('maxBatteryCapacity', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>

              {/* Mileage (only for vehicles) */}
              {filters.categoryId === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>Số km tối thiểu</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minMileage || ''}
                      onChange={(e) => handleFilterChange('minMileage', e.target.value ? parseInt(e.target.value, 10) : null)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Số km tối đa</Label>
                    <Input
                      type="number"
                      placeholder="Không giới hạn"
                      value={filters.maxMileage || ''}
                      onChange={(e) => handleFilterChange('maxMileage', e.target.value ? parseInt(e.target.value, 10) : null)}
                    />
                  </div>
                </>
              )}

              {/* Condition */}
              <div className="space-y-2">
                <Label>Tình trạng</Label>
                <Select
                  value={filters.condition || ''}
                  onValueChange={(value) => handleFilterChange('condition', value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    <SelectItem value="Mới">Mới</SelectItem>
                    <SelectItem value="Cũ">Cũ</SelectItem>
                    <SelectItem value="Đã qua sử dụng">Đã qua sử dụng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Auction Only */}
              <div className="space-y-2">
                <Label>Loại đăng</Label>
                <Select
                  value={filters.auctionOnly === true ? 'true' : filters.auctionOnly === false ? 'false' : ''}
                  onValueChange={(value) => handleFilterChange('auctionOnly', value === 'true' ? true : value === 'false' ? false : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    <SelectItem value="false">Mua bán thường</SelectItem>
                    <SelectItem value="true">Chỉ đấu giá</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}


