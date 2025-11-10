import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, Wallet } from 'lucide-react'
import { paymentCreateRequestSchema } from '@/lib/validations/payment.validations'
import { toast } from 'sonner'
import paymentService from '@/api/services/payment.service'

/**
 * PaymentForm Component
 * Form để tạo thanh toán cho đơn hàng (UC28)
 * @param {Object} props
 * @param {string} props.orderId - UUID của đơn hàng
 * @param {number} props.amount - Số tiền cần thanh toán
 * @param {Function} props.onSuccess - Callback khi thanh toán thành công
 * @param {Function} props.onCancel - Callback khi hủy
 */
export default function PaymentForm({ orderId, amount, onSuccess, onCancel }) {
  const [paymentGateway, setPaymentGateway] = useState('PAYOS')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Validate
      const validationResult = paymentCreateRequestSchema.safeParse({
        orderId,
        paymentGateway
      })

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message)
        toast.error(errors[0] || 'Dữ liệu không hợp lệ')
        return
      }

      setLoading(true)

      // Call API
      const response = await paymentService.createPayment({
        orderId,
        paymentGateway
      })

      if (response.success) {
        toast.success('Tạo thanh toán thành công!')
        
        // Nếu có PaymentUrl, redirect đến cổng thanh toán
        if (response.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl
        } else {
          // Nếu không có URL, gọi callback
          if (onSuccess) {
            onSuccess(response.data)
          }
        }
      } else {
        toast.error(response.message || 'Không thể tạo thanh toán')
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi tạo thanh toán')
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thanh toán đơn hàng</CardTitle>
        <CardDescription>
          Chọn phương thức thanh toán để hoàn tất đơn hàng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Display */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tổng tiền cần thanh toán:</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(amount)}</span>
            </div>
          </div>

          {/* Payment Gateway Selection */}
          <div className="space-y-3">
            <Label>Phương thức thanh toán</Label>
            <RadioGroup value={paymentGateway} onValueChange={setPaymentGateway}>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer bg-blue-50">
                <RadioGroupItem value="PAYOS" id="payos" />
                <Label htmlFor="payos" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">PayOS</div>
                      <div className="text-sm text-muted-foreground">
                        Thanh toán qua PayOS
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Thanh toán ngay'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

