import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2, Receipt, CreditCard, Package, CheckCircle2, XCircle, Clock } from 'lucide-react'
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
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * PaymentDetail Page
 * Trang xem chi tiết thanh toán (UC30)
 */
export default function PaymentDetail() {
  const { id } = useParams()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchPayment()
    }
  }, [id])

  const fetchPayment = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await paymentService.getPaymentById(id)

      if (response.success) {
        setPayment(response.data)
      } else {
        setError(response.message || 'Không thể tải thông tin thanh toán')
      }
    } catch (err) {
      console.error('Error fetching payment:', err)
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải thông tin thanh toán')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'secondary', label: 'Chờ thanh toán', icon: Clock },
      SUCCESS: { variant: 'default', label: 'Thành công', icon: CheckCircle2 },
      FAILED: { variant: 'destructive', label: 'Thất bại', icon: XCircle }
    }

    const config = statusConfig[status] || { variant: 'secondary', label: status, icon: Clock }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Không tìm thấy</AlertTitle>
            <AlertDescription>Không tìm thấy thông tin thanh toán</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Receipt className="h-8 w-8 text-primary" />
                Chi tiết thanh toán
              </h1>
              <p className="text-muted-foreground mt-2">
                Mã thanh toán: {payment.paymentId.slice(0, 8)}
              </p>
            </div>
            {getStatusBadge(payment.status)}
          </div>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {payment.paymentType === 'PACKAGE' ? (
                  <Package className="h-5 w-5" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                Thông tin thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Loại thanh toán</div>
                  <div className="font-medium">
                    {payment.paymentType === 'PACKAGE' ? 'Mua gói tin' : 'Thanh toán giao dịch'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Số tiền</div>
                  <div className="font-bold text-2xl text-primary">
                    {formatPrice(payment.amount)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Cổng thanh toán</div>
                  <div className="font-medium">{payment.paymentGateway}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Mã giao dịch</div>
                  <div className="font-mono text-sm">
                    {payment.transactionCode || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Thời gian tạo</div>
                  <div className="font-medium">
                    {formatDate(payment.createdAt)}
                  </div>
                </div>
                {payment.completedAt && (
                  <div>
                    <div className="text-sm text-muted-foreground">Thời gian hoàn tất</div>
                    <div className="font-medium">
                      {formatDate(payment.completedAt)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Package Info */}
          {payment.paymentType === 'PACKAGE' && payment.packageName && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin gói tin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên gói:</span>
                    <span className="font-medium">{payment.packageName}</span>
                  </div>
                  {payment.creditsCount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số credits:</span>
                      <span className="font-medium">{payment.creditsCount}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Info */}
          {payment.paymentType === 'TRANSACTION' && payment.orderInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sản phẩm:</span>
                    <span className="font-medium">{payment.orderInfo.postTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Người bán:</span>
                    <span className="font-medium">{payment.orderInfo.sellerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giá:</span>
                    <span className="font-medium text-primary">
                      {formatPrice(payment.orderInfo.finalPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/payment-history">Quay lại lịch sử</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

