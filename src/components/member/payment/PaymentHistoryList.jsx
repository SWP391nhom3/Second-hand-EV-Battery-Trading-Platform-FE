import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Receipt, CreditCard, Package, Loader2 } from 'lucide-react'
import paymentService from '@/api/services/payment.service'
import { Link } from 'react-router-dom'

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * PaymentHistoryList Component
 * Danh sách lịch sử thanh toán với filters và pagination (UC30)
 * @param {Object} props
 * @param {Object} props.filters - Filter parameters
 * @param {Function} props.onFiltersChange - Callback when filters change
 */
export default function PaymentHistoryList({ filters = {}, onFiltersChange }) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  })

  const fetchPayments = async (pageNumber = 1) => {
    try {
      setLoading(true)
      setError(null)

      // Convert 'all' values to null/undefined so they are not sent to API
      const apiFilters = Object.keys(filters).reduce((acc, key) => {
        const value = filters[key]
        // Only include filter if it's not 'all', not empty string, and not null
        if (value !== 'all' && value !== '' && value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {})

      const response = await paymentService.getPaymentHistory({
        pageNumber,
        pageSize: pagination.pageSize,
        ...apiFilters
      })

      if (response.success) {
        // PagedResponse structure: data is the list directly, pagination is at root level
        setPayments(response.data || [])
        setPagination({
          pageNumber: response.pageNumber || pageNumber,
          pageSize: response.pageSize || pagination.pageSize,
          totalCount: response.totalCount || 0,
          totalPages: response.totalPages || 0
        })
      } else {
        setError(response.message || 'Không thể tải lịch sử thanh toán')
      }
    } catch (err) {
      console.error('Error fetching payments:', err)
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải lịch sử thanh toán')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const handlePageChange = (newPage) => {
    fetchPayments(newPage)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'secondary', label: 'Chờ thanh toán' },
      SUCCESS: { variant: 'default', label: 'Thành công' },
      FAILED: { variant: 'destructive', label: 'Thất bại' }
    }

    const config = statusConfig[status] || { variant: 'secondary', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentTypeIcon = (type) => {
    return type === 'PACKAGE' ? <Package className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />
  }

  if (loading && payments.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Receipt className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Chưa có lịch sử thanh toán</h3>
        <p className="text-muted-foreground">
          Bạn chưa thực hiện giao dịch thanh toán nào
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Payments List */}
      {payments.map((payment) => (
        <Card key={payment.paymentId} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPaymentTypeIcon(payment.paymentType)}
                <div>
                  <CardTitle className="text-lg">
                    {payment.paymentType === 'PACKAGE' 
                      ? `Mua gói tin: ${payment.packageName || 'N/A'}`
                      : `Thanh toán đơn hàng`
                    }
                  </CardTitle>
                  <CardDescription>
                    {payment.paymentType === 'PACKAGE' && payment.creditsCount && (
                      <span>Số credits: {payment.creditsCount}</span>
                    )}
                    {payment.paymentType === 'TRANSACTION' && payment.orderInfo && (
                      <span>{payment.orderInfo.postTitle}</span>
                    )}
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(payment.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Số tiền</div>
                <div className="font-semibold text-lg text-primary">
                  {formatPrice(payment.amount)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Cổng thanh toán</div>
                <div className="font-medium">{payment.paymentGateway}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Thời gian</div>
                <div className="font-medium">
                  {formatDate(payment.createdAt)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Mã giao dịch</div>
                <div className="font-medium font-mono text-xs">
                  {payment.transactionCode || 'N/A'}
                </div>
              </div>
            </div>

            {payment.orderInfo && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Người bán: {payment.orderInfo.sellerName}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link to={`/payments/${payment.paymentId}`}>
                  Xem chi tiết
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.pageNumber - 1)}
            disabled={pagination.pageNumber === 1 || loading}
          >
            Trước
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Trang {pagination.pageNumber} / {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.pageNumber + 1)}
            disabled={pagination.pageNumber === pagination.totalPages || loading}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Loading More */}
      {loading && payments.length > 0 && (
        <div className="flex justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

