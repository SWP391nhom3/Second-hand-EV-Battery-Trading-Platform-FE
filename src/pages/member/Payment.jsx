import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PaymentForm from '@/components/member/payment/PaymentForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import orderService from '@/api/services/order.service'

/**
 * Payment Page
 * Trang thanh toán cho đơn hàng (UC28)
 */
export default function Payment() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    } else {
      setError('Không tìm thấy ID đơn hàng')
      setLoading(false)
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await orderService.getOrderById(orderId)

      if (response.success) {
        setOrder(response.data)
      } else {
        setError(response.message || 'Không thể tải thông tin đơn hàng')
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải thông tin đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentData) => {
    // Redirect to payment history or order detail
    navigate(`/payments/${paymentData.paymentId}`)
  }

  const handleCancel = () => {
    navigate(-1)
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

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Không tìm thấy</AlertTitle>
            <AlertDescription>Không tìm thấy đơn hàng</AlertDescription>
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
        <div className="max-w-2xl mx-auto">
          {/* Order Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
              <CardDescription>Đơn hàng #{order.orderId.slice(0, 8)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sản phẩm:</span>
                  <span className="font-medium">{order.postTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người bán:</span>
                  <span className="font-medium">{order.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá:</span>
                  <span className="font-bold text-lg text-primary">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(order.finalPrice)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <PaymentForm
            orderId={order.orderId}
            amount={order.finalPrice}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancel}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}

