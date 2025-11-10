import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * SortDropdown Component
 * Dropdown để sắp xếp kết quả tìm kiếm
 */
export default function SortDropdown({ value, onChange, className = '' }) {
  const [sortBy, sortDirection] = value ? value.split(':') : ['createdAt', 'desc']

  const sortOptions = [
    { value: 'price:asc', label: 'Giá: Thấp đến Cao', icon: ArrowUp },
    { value: 'price:desc', label: 'Giá: Cao đến Thấp', icon: ArrowDown },
    { value: 'createdAt:desc', label: 'Mới nhất', icon: ArrowDown },
    { value: 'createdAt:asc', label: 'Cũ nhất', icon: ArrowUp },
    { value: 'priorityLevel:desc', label: 'Độ ưu tiên: Cao đến Thấp', icon: ArrowDown },
    { value: 'priorityLevel:asc', label: 'Độ ưu tiên: Thấp đến Cao', icon: ArrowUp },
  ]

  const currentOption = sortOptions.find(opt => opt.value === value) || sortOptions[2]

  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={value || 'createdAt:desc'} onValueChange={handleChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => {
            const Icon = option.icon
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}


