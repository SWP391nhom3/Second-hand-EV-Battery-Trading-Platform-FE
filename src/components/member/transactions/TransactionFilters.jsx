import { Search, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * TransactionFilters Component
 * Component filter cho danh sách giao dịch
 */
export default function TransactionFilters({
  keyword = '',
  onKeywordChange,
  transactionType = 'ALL',
  onTransactionTypeChange,
  status = 'ALL',
  onStatusChange,
  fromDate = '',
  onFromDateChange,
  toDate = '',
  onToDateChange,
  onReset,
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
              placeholder="Tìm kiếm theo tiêu đề bài đăng..."
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {/* Transaction Type Filter */}
          <Select value={transactionType} onValueChange={onTransactionTypeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Loại giao dịch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="BUY">Mua</SelectItem>
              <SelectItem value="SELL">Bán</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PENDING_PAYMENT">Chờ thanh toán</SelectItem>
              <SelectItem value="PAID">Đã thanh toán</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="SHIPPING">Đang vận chuyển</SelectItem>
              <SelectItem value="DELIVERED">Đã giao hàng</SelectItem>
              <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-[150px]"
              placeholder="Từ ngày"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-[150px]"
              placeholder="Đến ngày"
            />
          </div>

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
  );
}


