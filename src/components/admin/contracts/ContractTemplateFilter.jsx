import { useState, useEffect, useRef } from 'react'
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
import axiosInstance from '@/api/axios.config'

/**
 * ContractTemplateFilter Component
 * Filter component cho danh sách mẫu hợp đồng với debounce và local state
 */
export default function ContractTemplateFilter({ filters, onFilterChange, onReset, isSearching = false }) {
  const [localFilters, setLocalFilters] = useState({
    keyword: filters?.keyword || '',
    categoryId: filters?.categoryId ? String(filters.categoryId) : 'ALL',
    isActive: filters?.isActive !== null && filters?.isActive !== undefined ? String(filters.isActive) : 'ALL'
  })
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const debounceTimerRef = useRef(null)

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await axiosInstance.get('/categories')
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  // Debounce cho keyword search
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Only trigger if keyword actually changed from external filters
    if (localFilters.keyword !== (filters?.keyword || '')) {
      setIsTyping(true)
      debounceTimerRef.current = setTimeout(() => {
        setIsTyping(false)
        onFilterChange?.({ keyword: localFilters.keyword || null })
      }, 500) // 500ms debounce
    } else {
      setIsTyping(false)
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFilters.keyword])

  // Sync với external filters (khi reset)
  useEffect(() => {
    if (filters?.keyword === null || filters?.keyword === undefined) {
      setLocalFilters(prev => ({ ...prev, keyword: '' }))
    }
    if (filters?.categoryId === null || filters?.categoryId === undefined) {
      setLocalFilters(prev => ({ ...prev, categoryId: 'ALL' }))
    }
    if (filters?.isActive === null || filters?.isActive === undefined) {
      setLocalFilters(prev => ({ ...prev, isActive: 'ALL' }))
    }
  }, [filters])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    
    if (key === 'categoryId') {
      // Category filter không cần debounce
      onFilterChange?.({ categoryId: value === 'ALL' ? null : parseInt(value) })
    } else if (key === 'isActive') {
      // Status filter không cần debounce
      onFilterChange?.({ isActive: value === 'ALL' ? null : value === 'true' })
    }
  }

  const handleReset = () => {
    const resetFilters = {
      keyword: '',
      categoryId: 'ALL',
      isActive: 'ALL'
    }
    setLocalFilters(resetFilters)
    setIsTyping(false)
    onReset?.()
  }

  const hasActiveFilters = 
    localFilters.keyword ||
    (localFilters.categoryId !== 'ALL') ||
    (localFilters.isActive !== 'ALL')

  const showLoading = isSearching || isTyping

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">Bộ lọc</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs transition-all duration-200 hover:scale-105 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="md:col-span-1 relative">
          {showLoading ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin z-10" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-200 z-10" />
          )}
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên mẫu..."
            value={localFilters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
              showLoading ? 'pr-10' : ''
            } ${
              isTyping ? 'border-primary/50' : ''
            }`}
          />
          {isTyping && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <Select
          value={localFilters.categoryId}
          onValueChange={(value) => handleFilterChange('categoryId', value)}
          disabled={loadingCategories}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả danh mục</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={localFilters.isActive}
          onValueChange={(value) => handleFilterChange('isActive', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="true">Đang hoạt động</SelectItem>
            <SelectItem value="false">Đã vô hiệu hóa</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

