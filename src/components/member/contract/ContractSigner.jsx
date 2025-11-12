import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Pen, AlertCircle } from 'lucide-react'
import contractService from '@/api/services/contract.service'
import { contractSignRequestSchema } from '@/lib/validations/contract.validation'
import { toast } from 'sonner'
import { useRef } from 'react'
import SignatureCanvas from './SignatureCanvas'

/**
 * ContractSigner Component
 * Component để ký hợp đồng bằng chữ ký điện tử (UC29)
 * @param {Object} props
 * @param {string} props.contractId - UUID của hợp đồng
 * @param {Function} props.onSuccess - Callback khi ký thành công
 * @param {Function} props.onCancel - Callback khi hủy
 */
export default function ContractSigner({ contractId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [signatureData, setSignatureData] = useState('')
  const signatureRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Get signature from canvas ref
      if (!signatureRef.current) {
        setError('Không thể truy cập canvas chữ ký')
        return
      }

      // Check if canvas is empty
      if (signatureRef.current.isEmpty && signatureRef.current.isEmpty()) {
        setError('Vui lòng vẽ chữ ký của bạn')
        return
      }

      // Get signature data from canvas
      const canvasSignature = signatureRef.current.getDataURL 
        ? signatureRef.current.getDataURL() 
        : signatureData

      if (!canvasSignature || canvasSignature === '') {
        setError('Vui lòng vẽ chữ ký của bạn')
        return
      }

      // Validate
      const validationResult = contractSignRequestSchema.safeParse({
        signature: canvasSignature,
        signType: 'SIGNATURE'
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
        signature: canvasSignature,
        signType: 'SIGNATURE'
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
        <CardTitle className="flex items-center gap-2">
          <Pen className="h-5 w-5" />
          Ký hợp đồng
        </CardTitle>
        <CardDescription>
          Vẽ chữ ký điện tử của bạn để hoàn tất việc ký hợp đồng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Signature Canvas */}
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

