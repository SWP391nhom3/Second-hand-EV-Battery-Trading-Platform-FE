import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PaymentHistoryList from '@/components/member/payment/PaymentHistoryList'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Receipt, Filter, X } from 'lucide-react'

export default function PaymentHistory() {
  const [filters, setFilters] = useState({
    paymentType: '',
    status: '',
    paymentGateway: '',
    fromDate: null,
    toDate: null
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      paymentType: '',
      status: '',
      paymentGateway: '',
      fromDate: null,
      toDate: null
    })
  }

  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== '' && v !== null
  ).length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Lịch sử thanh toán</h1>
          </div>
          <p className="text-muted-foreground">
            Xem và quản lý lịch sử thanh toán của bạn
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Bộ lọc
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </CardTitle>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Payment Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Loại thanh toán</label>
                <Select
                  value={filters.paymentType}
                  onValueChange={(value) => handleFilterChange('paymentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    <SelectItem value="PACKAGE">Gói tin</SelectItem>
                    <SelectItem value="TRANSACTION">Giao dịch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium mb-2 block">Trạng thái</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                    <SelectItem value="SUCCESS">Thành công</SelectItem>
                    <SelectItem value="FAILED">Thất bại</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Gateway */}
              <div>
                <label className="text-sm font-medium mb-2 block">Cổng thanh toán</label>
                <Select
                  value={filters.paymentGateway}
                  onValueChange={(value) => handleFilterChange('paymentGateway', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    <SelectItem value="PAYOS">PayOS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Khoảng thời gian</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={filters.fromDate ? new Date(filters.fromDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleFilterChange('fromDate', e.target.value ? new Date(e.target.value) : null)}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="date"
                    value={filters.toDate ? new Date(filters.toDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleFilterChange('toDate', e.target.value ? new Date(e.target.value) : null)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History List */}
        <PaymentHistoryList filters={filters} />
      </main>

      <Footer />
    </div>
  )
}

