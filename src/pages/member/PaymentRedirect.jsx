import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2, QrCode, ArrowLeft, RefreshCw } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import paymentService from '@/api/services/payment.service'
import { toast } from 'sonner'

/**
 * PaymentRedirect Page
 * Trang xử lý redirect từ PayOS payment gateway
 * Hiển thị QR code hoặc thông tin thanh toán
 */
export default function PaymentRedirect() {
  const { paymentId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const gateway = searchParams.get('gateway') || 'PAYOS'
  const amount = searchParams.get('amount')
  
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState(null) // PayOS QR code URL from backend (when available)
  const [polling, setPolling] = useState(false)
  const [qrCodeData, setQrCodeData] = useState(null) // QR code data to generate QR locally
  const [paymentUrl, setPaymentUrl] = useState(null) // PayOS payment URL

  // Define checkPaymentStatus before using it in useEffect
  const checkPaymentStatus = useCallback(async () => {
    if (polling || !paymentId) return
    
    try {
      setPolling(true)
      const response = await paymentService.getPaymentById(paymentId)
      
      if (response.success) {
        setPayment(response.data)
        
        // If payment is completed, redirect to payment detail page
        if (response.data.status === 'SUCCESS') {
          toast.success('Thanh toán thành công!')
          setTimeout(() => {
            navigate(`/payments/${paymentId}`)
          }, 2000)
        } else if (response.data.status === 'FAILED') {
          toast.error('Thanh toán thất bại!')
          setPolling(false)
        }
      }
    } catch (err) {
      console.error('Error checking payment status:', err)
    } finally {
      setPolling(false)
    }
  }, [paymentId, polling, navigate])

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await paymentService.getPaymentById(paymentId)

      if (response.success) {
        setPayment(response.data)
        
        // If payment is pending and gateway is PAYOS
        if (response.data.status === 'PENDING' && gateway === 'PAYOS') {
          // Get PayOS QR code from backend
          try {
            const payOSResponse = await paymentService.getPayOSPaymentLink(paymentId)
            if (payOSResponse.success && payOSResponse.data) {
              // Store payment URL if available
              if (payOSResponse.data.paymentUrl) {
                setPaymentUrl(payOSResponse.data.paymentUrl)
              }
              
              // PayOS returns qrCodeUrl which can be either:
              // 1. A QR code data string (starts with numbers/letters, no http/https)
              // 2. An image URL (starts with http/https)
              if (payOSResponse.data.qrCodeUrl) {
                const qrCodeValue = payOSResponse.data.qrCodeUrl
                // Check if it's a URL (starts with http/https) or QR code data string
                if (qrCodeValue.startsWith('http://') || qrCodeValue.startsWith('https://')) {
                  // It's an image URL, display as image
                  setQrCodeUrl(qrCodeValue)
                  setQrCodeData(null)
                } else {
                  // It's QR code data string, generate QR code from it
                  setQrCodeUrl(null)
                  setQrCodeData(qrCodeValue)
                }
              } else if (payOSResponse.data.paymentUrl) {
                // Backend returned payment URL, generate QR code from it
                setQrCodeUrl(null)
                setQrCodeData(payOSResponse.data.paymentUrl)
              } else {
                // No QR code or payment URL, generate temporary QR code
                const paymentInfo = {
                  type: 'PAYMENT',
                  paymentId: response.data.paymentId,
                  amount: response.data.amount,
                  currency: 'VND',
                  gateway: gateway
                }
                setQrCodeData(JSON.stringify(paymentInfo))
              }
            } else {
              // API call failed, generate temporary QR code
              const paymentInfo = {
                type: 'PAYMENT',
                paymentId: response.data.paymentId,
                amount: response.data.amount,
                currency: 'VND',
                gateway: gateway
              }
              setQrCodeData(JSON.stringify(paymentInfo))
            }
          } catch (err) {
            console.error('Error fetching PayOS payment link:', err)
            // Generate temporary QR code as fallback
            const paymentInfo = {
              type: 'PAYMENT',
              paymentId: response.data.paymentId,
              amount: response.data.amount,
              currency: 'VND',
              gateway: gateway
            }
            setQrCodeData(JSON.stringify(paymentInfo))
          }
        }
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

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails()
    } else {
      setError('Không tìm thấy ID thanh toán')
      setLoading(false)
    }
  }, [paymentId])

  // Start polling to check payment status when payment is pending
  useEffect(() => {
    if (payment && payment.status === 'PENDING') {
      const interval = setInterval(() => {
        checkPaymentStatus()
      }, 5000) // Check every 5 seconds

      return () => clearInterval(interval)
    }
  }, [payment?.status, checkPaymentStatus])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-50'
      case 'FAILED':
        return 'text-red-600 bg-red-50'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'Thành công'
      case 'FAILED':
        return 'Thất bại'
      case 'PENDING':
        return 'Đang chờ thanh toán'
      default:
        return status
    }
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

  if (error && !payment) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
            </div>
          </div>
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
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Thanh toán qua {gateway}</h1>
              <p className="text-muted-foreground">
                Vui lòng quét QR code hoặc thanh toán theo hướng dẫn
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>

          {/* Payment Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin thanh toán</CardTitle>
              <CardDescription>
                Payment ID: {paymentId?.slice(0, 8)}...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount */}
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="text-lg font-semibold">Số tiền thanh toán:</span>
                <span className="text-2xl font-bold text-primary">
                  {payment ? formatPrice(payment.amount) : amount ? formatPrice(parseFloat(amount)) : 'N/A'}
                </span>
              </div>

              {/* Status */}
              {payment && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trạng thái:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                    {getStatusText(payment.status)}
                  </span>
                </div>
              )}

              {/* Payment Gateway */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cổng thanh toán:</span>
                <span className="font-medium">{gateway}</span>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Quét QR code để thanh toán
              </CardTitle>
              <CardDescription>
                Sử dụng ứng dụng ngân hàng để quét QR code và thanh toán
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qrCodeUrl ? (
                // PayOS QR code from backend
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-dashed">
                    <img
                      src={qrCodeUrl}
                      alt="PayOS QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Quét QR code bằng ứng dụng ngân hàng của bạn để thanh toán
                  </p>
                </div>
              ) : qrCodeData ? (
                // Generated QR code from PayOS QR code data string
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-primary/20">
                    <QRCodeSVG
                      value={qrCodeData}
                      size={256}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Quét QR code bằng ứng dụng ngân hàng của bạn để thanh toán
                  </p>
                </div>
              ) : (
                // No QR code available
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Thông tin thanh toán</AlertTitle>
                    <AlertDescription>
                      <div className="space-y-2 mt-2">
                        <p>
                          <strong>Payment ID:</strong> {paymentId}
                        </p>
                        <p>
                          <strong>Số tiền:</strong> {payment ? formatPrice(payment.amount) : amount ? formatPrice(parseFloat(amount)) : 'N/A'}
                        </p>
                        <p>
                          <strong>Cổng thanh toán:</strong> {gateway}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                  <Alert variant="default">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lưu ý</AlertTitle>
                    <AlertDescription>
                      Không thể tạo QR code thanh toán. 
                      Backend đang được tích hợp với PayOS API. 
                      QR code thanh toán sẽ được hiển thị tại đây khi tích hợp hoàn tất.
                      <br />
                      <br />
                      Vui lòng liên hệ admin để được hỗ trợ thanh toán hoặc quay lại sau.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Mở ứng dụng ngân hàng trên điện thoại của bạn</li>
                <li>Chọn tính năng quét QR code</li>
                <li>Quét QR code phía trên</li>
                <li>Xác nhận thanh toán trong ứng dụng ngân hàng</li>
                <li>Chờ hệ thống xác nhận thanh toán (tự động trong 5-10 giây)</li>
              </ol>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={fetchPaymentDetails}
                disabled={polling}
                className="flex-1"
              >
                {polling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Làm mới trạng thái
                  </>
                )}
              </Button>
              {payment && payment.status === 'SUCCESS' && (
                <Button
                  onClick={() => navigate(`/payments/${paymentId}`)}
                  className="flex-1"
                >
                  Xem chi tiết thanh toán
                </Button>
              )}
            </div>
            {paymentUrl && payment && payment.status === 'PENDING' && (
              <Button
                onClick={() => window.open(paymentUrl, '_blank')}
                className="w-full"
                variant="default"
              >
                Thanh toán qua trình duyệt
              </Button>
            )}
          </div>

          {/* Auto-redirect notice */}
          {payment && payment.status === 'PENDING' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Hệ thống đang tự động kiểm tra trạng thái thanh toán. 
                Bạn sẽ được chuyển hướng khi thanh toán thành công.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

