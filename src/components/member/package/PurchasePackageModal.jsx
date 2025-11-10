import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import PaymentMethodSelector from './PaymentMethodSelector'
import { packagePurchaseSchema } from '@/lib/validations/package.validation'
import packageService from '@/api/services/package.service'
import { toast } from 'sonner'

/**
 * PurchasePackageModal Component
 * Modal mua gói tin với payment method selection
 */
export default function PurchasePackageModal({ 
  open, 
  onClose, 
  selectedPackage 
}) {
  const [paymentGateway, setPaymentGateway] = useState('PAYOS')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePurchase = async () => {
    if (!selectedPackage) return

    try {
      setLoading(true)
      setError(null)

      // Validate
      const validationResult = packagePurchaseSchema.safeParse({
        packageId: selectedPackage.id,
        paymentGateway
      })

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(e => e.message).join(', ')
        setError(errors)
        return
      }

      // Call API
      const response = await packageService.purchasePackage({
        packageId: selectedPackage.id,
        paymentGateway
      })

      if (response.success && response.data) {
        const { paymentUrl, status } = response.data

        if (paymentUrl) {
          // Redirect to payment URL
          toast.success('Đang chuyển hướng đến trang thanh toán...')
          window.location.href = paymentUrl
        } else {
          toast.success('Tạo đơn hàng thành công!')
          onClose()
          // Refresh page or update state
          window.location.reload()
        }
      } else {
        setError(response.message || 'Không thể tạo đơn hàng')
        toast.error(response.message || 'Không thể tạo đơn hàng')
      }
    } catch (err) {
      console.error('Error purchasing package:', err)
      const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi khi mua gói tin'
      setError(errorMessage)
      toast.error(errorMessage)
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

  if (!selectedPackage) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose()
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mua gói tin: {selectedPackage.name}</DialogTitle>
          <DialogDescription>
            Chọn phương thức thanh toán để tiếp tục
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Package Info */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Gói tin</span>
              <span className="font-semibold">{selectedPackage.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Số credits</span>
              <span className="font-semibold">{selectedPackage.creditsCount} credits</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-semibold">Tổng thanh toán</span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(selectedPackage.price)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Phương thức thanh toán
            </label>
            <PaymentMethodSelector
              value={paymentGateway}
              onChange={setPaymentGateway}
            />
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Sau khi thanh toán thành công, credits sẽ được cộng vào tài khoản của bạn ngay lập tức.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handlePurchase} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Thanh toán'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

