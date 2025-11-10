import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'

/**
 * RevenueChartWidget Component
 * Widget hiển thị biểu đồ doanh thu
 * Module 7: Dashboard Admin
 * 
 * Note: Cần cài đặt thư viện chart (recharts hoặc chart.js)
 * Hiện tại hiển thị dạng table, có thể nâng cấp thành chart sau
 */
export default function RevenueChartWidget({ 
  revenueData = null, 
  loading = false,
  chartData = [] 
}) {
  const [period, setPeriod] = useState('month') // 'week' | 'month' | 'year'

  // Mock chart data nếu chưa có từ API
  const defaultChartData = chartData.length > 0 ? chartData : [
    { date: '01/01', value: 50000000 },
    { date: '02/01', value: 75000000 },
    { date: '03/01', value: 60000000 },
    { date: '04/01', value: 90000000 },
    { date: '05/01', value: 85000000 },
    { date: '06/01', value: 100000000 },
    { date: '07/01', value: 95000000 }
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Doanh thu</h2>
          <DollarSign className="h-5 w-5 text-gray-400 animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const totalRevenue = revenueData?.total || 0
  const monthlyRevenue = revenueData?.monthly || 0
  const weeklyRevenue = revenueData?.weekly || 0

  const maxValue = Math.max(...defaultChartData.map(d => d.value), 1)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Doanh thu</h2>
          <DollarSign className="h-5 w-5 text-emerald-600" />
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Tuần</SelectItem>
            <SelectItem value="month">Tháng</SelectItem>
            <SelectItem value="year">Năm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Tổng doanh thu</p>
          <p className="text-lg font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Tháng này</p>
          <p className="text-lg font-bold text-emerald-600">{formatPrice(monthlyRevenue)}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Tuần này</p>
          <p className="text-lg font-bold text-blue-600">{formatPrice(weeklyRevenue)}</p>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Biểu đồ doanh thu ({period === 'week' ? '7 ngày' : period === 'month' ? '30 ngày' : '12 tháng'})</span>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </div>
        
        <div className="space-y-2">
          {defaultChartData.map((item, index) => {
            const percentage = (item.value / maxValue) * 100
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 text-xs text-gray-600 text-right flex-shrink-0">
                  {item.date}
                </div>
                <div className="flex-1">
                  <div className="relative h-6 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                      <span className="text-xs font-medium text-gray-700">
                        {formatPrice(item.value)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Note: Có thể nâng cấp thành chart thật bằng Recharts sau */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Tip: Có thể tích hợp Recharts để hiển thị biểu đồ đẹp hơn
        </p>
      </div>
    </div>
  )
}

