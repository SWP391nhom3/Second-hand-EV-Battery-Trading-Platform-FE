import React, { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
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
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

/**
 * SearchFilters Component
 * Component để lọc sản phẩm theo các tiêu chí - Thiết kế compact và hiện đại
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

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== null && v !== undefined && v !== '' && v !== 'all'
  ).length

  return (
    <Card className="sticky top-4 border bg-card shadow-sm">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Bộ lọc</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3 w-3 mr-1" />
                Xóa
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 px-2 text-xs"
            >
              {isExpanded ? (
                <>
                  Thu gọn
                  <ChevronUp className="h-3 w-3 ml-1" />
                </>
              ) : (
                <>
                  Mở rộng
                  <ChevronDown className="h-3 w-3 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">
        {/* Basic Filters - Always visible */}
        <div className="space-y-3">
          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Danh mục</Label>
            <Select
              value={filters.categoryId?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('categoryId', value === 'all' ? null : parseInt(value, 10))}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="1">Xe điện</SelectItem>
                <SelectItem value="2">Pin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Thương hiệu</Label>
            <Input
              placeholder="VD: VinFast, Tesla..."
              value={filters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value || null)}
              className="h-9 text-sm"
            />
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Model</Label>
            <Input
              placeholder="Nhập model"
              value={filters.model || ''}
              onChange={(e) => handleFilterChange('model', e.target.value || null)}
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <>
            <Separator className="my-3" />
            
            <div className="space-y-3">
              {/* Location */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Địa điểm</Label>
                <Input
                  placeholder="VD: Hà Nội, TP.HCM..."
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || null)}
                  className="h-9 text-sm"
                />
              </div>

              {/* Price Range */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Khoảng giá (VNĐ)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : null)}
                    className="h-9 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : null)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Production Year */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Năm sản xuất</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Từ"
                    min="1900"
                    max="2100"
                    value={filters.minProductionYear || ''}
                    onChange={(e) => handleFilterChange('minProductionYear', e.target.value ? parseInt(e.target.value, 10) : null)}
                    className="h-9 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Đến"
                    min="1900"
                    max="2100"
                    value={filters.maxProductionYear || ''}
                    onChange={(e) => handleFilterChange('maxProductionYear', e.target.value ? parseInt(e.target.value, 10) : null)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Battery Capacity */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Dung lượng pin (kWh)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={filters.minBatteryCapacity || ''}
                    onChange={(e) => handleFilterChange('minBatteryCapacity', e.target.value ? parseFloat(e.target.value) : null)}
                    className="h-9 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={filters.maxBatteryCapacity || ''}
                    onChange={(e) => handleFilterChange('maxBatteryCapacity', e.target.value ? parseFloat(e.target.value) : null)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Mileage (only for vehicles) */}
              {filters.categoryId === 1 && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Số km đã đi</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={filters.minMileage || ''}
                      onChange={(e) => handleFilterChange('minMileage', e.target.value ? parseInt(e.target.value, 10) : null)}
                      className="h-9 text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={filters.maxMileage || ''}
                      onChange={(e) => handleFilterChange('maxMileage', e.target.value ? parseInt(e.target.value, 10) : null)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Condition */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Tình trạng</Label>
                <Select
                  value={filters.condition || 'all'}
                  onValueChange={(value) => handleFilterChange('condition', value === 'all' ? null : value)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Mới">Mới</SelectItem>
                    <SelectItem value="Cũ">Cũ</SelectItem>
                    <SelectItem value="Đã qua sử dụng">Đã qua sử dụng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Auction Only */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Loại đăng</Label>
                <Select
                  value={filters.auctionOnly === true ? 'true' : filters.auctionOnly === false ? 'false' : 'all'}
                  onValueChange={(value) => handleFilterChange('auctionOnly', value === 'true' ? true : value === 'false' ? false : null)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
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
