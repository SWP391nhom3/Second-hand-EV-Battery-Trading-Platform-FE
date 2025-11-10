import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Pen, Shield, AlertCircle } from 'lucide-react'
import contractService from '@/api/services/contract.service'
import { contractSignRequestSchema } from '@/lib/validations/contract.validation'
import { toast } from 'sonner'
import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import SignatureCanvas from './SignatureCanvas'

/**
 * ContractSigner Component
 * Component để ký hợp đồng bằng chữ ký hoặc OTP (UC29)
 * @param {Object} props
 * @param {string} props.contractId - UUID của hợp đồng
 * @param {Function} props.onSuccess - Callback khi ký thành công
 * @param {Function} props.onCancel - Callback khi hủy
 */
export default function ContractSigner({ contractId, onSuccess, onCancel }) {
  const [signType, setSignType] = useState('SIGNATURE')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [signatureData, setSignatureData] = useState('')
  const signatureRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let signature = ''

      if (signType === 'SIGNATURE') {
        // Get signature from canvas
        if (!signatureData || signatureData === '') {
          setError('Vui lòng vẽ chữ ký của bạn')
          return
        }
        signature = signatureData
      } else {
        // OTP
        if (!otp || otp.length < 6) {
          setError('OTP phải có ít nhất 6 ký tự')
          return
        }
        signature = otp
      }

      // Validate
      const validationResult = contractSignRequestSchema.safeParse({
        signature,
        signType
      })

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message)
        setError(errors[0] || 'Dữ liệu không hợp lệ')
        return
      }

      setLoading(true)
      setError(null)

      // Call API
      const response = await contractService.signContract(contractId, {
        signature,
        signType
      })

      if (response.success) {
        toast.success('Ký hợp đồng thành công!')
        if (onSuccess) {
          onSuccess(response.data)
        }
      } else {
        setError(response.message || 'Không thể ký hợp đồng')
        toast.error(response.message || 'Không thể ký hợp đồng')
      }
    } catch (error) {
      console.error('Error signing contract:', error)
      const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi ký hợp đồng'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClearSignature = () => {
    if (signatureRef.current && signatureRef.current.clear) {
      signatureRef.current.clear()
    }
    setSignatureData('')
  }

  const handleSignatureChange = (dataUrl) => {
    setSignatureData(dataUrl)
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ký hợp đồng</CardTitle>
        <CardDescription>
          Chọn phương thức ký hợp đồng của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sign Type Selection */}
          <div className="space-y-3">
            <Label>Phương thức ký</Label>
            <RadioGroup value={signType} onValueChange={setSignType}>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="SIGNATURE" id="signature" />
                <Label htmlFor="signature" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Pen className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Chữ ký điện tử</div>
                      <div className="text-sm text-muted-foreground">
                        Vẽ chữ ký của bạn trên màn hình
                      </div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="OTP" id="otp" />
                <Label htmlFor="otp" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    <div>
                      <div className="font-medium">OTP</div>
                      <div className="text-sm text-muted-foreground">
                        Nhập mã OTP được gửi đến số điện thoại của bạn
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Signature Canvas */}
          {signType === 'SIGNATURE' && (
            <div className="space-y-2">
              <Label>Vẽ chữ ký của bạn</Label>
              <div className="border-2 border-dashed rounded-lg p-4 bg-muted/50">
                <SignatureCanvas
                  ref={signatureRef}
                  onSignatureChange={handleSignatureChange}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearSignature}
              >
                Xóa chữ ký
              </Button>
              <p className="text-xs text-muted-foreground">
                Vẽ chữ ký của bạn trên khung trên bằng chuột hoặc ngón tay (trên mobile)
              </p>
            </div>
          )}

          {/* OTP Input */}
          {signType === 'OTP' && (
            <div className="space-y-2">
              <Label>Nhập mã OTP</Label>
              <Input
                type="text"
                placeholder="Nhập mã OTP (6 ký tự)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Implement OTP request
                  toast.info('Chức năng gửi OTP sẽ được triển khai')
                }}
              >
                Gửi mã OTP
              </Button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                'Xác nhận ký'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

