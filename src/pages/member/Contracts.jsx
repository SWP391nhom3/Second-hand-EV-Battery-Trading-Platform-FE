import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, FileText, Download, CheckCircle2, XCircle, Eye } from 'lucide-react'
import contractService from '@/api/services/contract.service'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

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
 * Contracts Page (Member)
 * Trang danh sách hợp đồng của Member
 */
export default function Contracts() {
  const navigate = useNavigate()
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await contractService.getMyContracts({
        pageNumber: 1,
        pageSize: 50
      })

      if (response.success) {
        // Handle PagedResponse structure
        let contractsData = []
        if (Array.isArray(response.data)) {
          contractsData = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          contractsData = response.data.data
        } else if (response.data?.items && Array.isArray(response.data.items)) {
          contractsData = response.data.items
        }
        setContracts(contractsData)
      } else {
        setError(response.message || 'Không thể tải danh sách hợp đồng')
      }
    } catch (err) {
      console.error('Error loading contracts:', err)
      // If endpoint doesn't exist yet, show empty state instead of error
      if (err.response?.status === 404) {
        setContracts([])
      } else {
        setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải danh sách hợp đồng')
      }
    } finally {
      setLoading(false)
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

  const handleViewContract = (contractId) => {
    navigate(`/contracts/${contractId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Hợp đồng của tôi</h1>
            <p className="text-muted-foreground mt-2">
              Quản lý và xem tất cả hợp đồng của bạn
            </p>
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!error && contracts.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có hợp đồng</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Bạn chưa có hợp đồng nào. Hợp đồng sẽ xuất hiện ở đây sau khi Staff tạo hợp đồng cho giao dịch của bạn.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Contracts List */}
          {contracts.length > 0 && (
            <div className="space-y-4">
              {contracts.map((contract) => (
                <Card key={contract.contractId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-lg">
                            Hợp đồng #{contract.contractId.slice(0, 8)}
                          </CardTitle>
                          <CardDescription>
                            {contract.templateName || 'Hợp đồng mua bán'}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(contract.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <div className="text-muted-foreground">Ngày tạo</div>
                        <div className="font-medium">{formatDate(contract.createdAt)}</div>
                      </div>
                      {contract.signedAt && (
                        <div>
                          <div className="text-muted-foreground">Ngày ký</div>
                          <div className="font-medium">{formatDate(contract.signedAt)}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-muted-foreground">Trạng thái ký</div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-2">
                            {contract.isBuyerSigned ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-xs">Người mua</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {contract.isSellerSigned ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-xs">Người bán</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewContract(contract.contractId)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </Button>
                      {contract.status === 'SIGNED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              const response = await contractService.getContractPdfUrl(contract.contractId)
                              if (response.success && response.data) {
                                window.open(response.data, '_blank')
                              }
                            } catch (err) {
                              console.error('Error downloading PDF:', err)
                            }
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Tải PDF
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

