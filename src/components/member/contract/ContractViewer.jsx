import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, FileText, Download, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import contractService from '@/api/services/contract.service'

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
 * ContractViewer Component
 * Xem chi tiết hợp đồng và tải PDF
 * @param {Object} props
 * @param {string} props.contractId - UUID của hợp đồng
 * @param {Function} props.onSign - Callback khi cần ký hợp đồng
 */
export default function ContractViewer({ contractId, onSign }) {
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadingPdf, setLoadingPdf] = useState(false)

  useEffect(() => {
    fetchContract()
  }, [contractId])

  const fetchContract = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await contractService.getContractById(contractId)

      if (response.success) {
        setContract(response.data)
      } else {
        setError(response.message || 'Không thể tải thông tin hợp đồng')
      }
    } catch (err) {
      console.error('Error fetching contract:', err)
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải thông tin hợp đồng')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = async () => {
    try {
      setLoadingPdf(true)
      const response = await contractService.getContractPdfUrl(contractId)

      if (response.success && response.data) {
        // Open PDF in new tab
        window.open(response.data, '_blank')
      } else {
        alert('Không thể tải file PDF')
      }
    } catch (err) {
      console.error('Error downloading PDF:', err)
      alert('Đã xảy ra lỗi khi tải file PDF')
    } finally {
      setLoadingPdf(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { variant: 'secondary', label: 'Nháp', icon: FileText },
      PENDING_SIGNATURE: { variant: 'default', label: 'Chờ ký', icon: FileText },
      SIGNED: { variant: 'default', label: 'Đã ký', icon: CheckCircle2 }
    }

    const config = statusConfig[status] || { variant: 'secondary', label: status, icon: FileText }
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
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
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

  if (!contract) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Không tìm thấy</AlertTitle>
        <AlertDescription>Không tìm thấy hợp đồng</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Contract Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Hợp đồng #{contract.contractId.slice(0, 8)}
              </CardTitle>
              <CardDescription>
                {contract.templateName || 'Hợp đồng mua bán'}
              </CardDescription>
            </div>
            {getStatusBadge(contract.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Trạng thái</div>
              <div className="font-medium">{contract.status}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Ngày tạo</div>
              <div className="font-medium">
                {formatDate(contract.createdAt)}
              </div>
            </div>
            {contract.createdByName && (
              <div>
                <div className="text-muted-foreground">Người tạo</div>
                <div className="font-medium">{contract.createdByName}</div>
              </div>
            )}
            {contract.signedAt && (
              <div>
                <div className="text-muted-foreground">Ngày ký</div>
                <div className="font-medium">
                  {formatDate(contract.signedAt)}
                </div>
              </div>
            )}
          </div>

          {/* Sign Status */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {contract.isBuyerSigned ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-sm">Người mua: {contract.isBuyerSigned ? 'Đã ký' : 'Chưa ký'}</span>
              </div>
              <div className="flex items-center gap-2">
                {contract.isSellerSigned ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-sm">Người bán: {contract.isSellerSigned ? 'Đã ký' : 'Chưa ký'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadPdf}
              disabled={loadingPdf}
            >
              {loadingPdf ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Tải PDF
                </>
              )}
            </Button>
            {(contract.status === 'PENDING_SIGNATURE' || contract.status === 'DRAFT') && 
             onSign && (
              <Button onClick={onSign}>
                Ký hợp đồng
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contract Content */}
      {contract.contractContent && (
        <Card>
          <CardHeader>
            <CardTitle>Nội dung hợp đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose max-w-none whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: contract.contractContent }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

