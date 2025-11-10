import { Eye, FileText, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContractStatusBadge from './ContractStatusBadge'

/**
 * ContractList Component for Staff
 * Component hiển thị danh sách hợp đồng
 * ⚠️ NOTE: Endpoint lấy danh sách hợp đồng chưa có ở backend
 * Component này được tạo sẵn để sử dụng khi backend có endpoint
 */
export default function ContractList({
  contracts = [],
  loading,
  onViewDetail
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'N/A'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Đang tải danh sách hợp đồng...</p>
        </div>
      </div>
    )
  }

  if (contracts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-sm text-gray-500 mb-2">Chưa có hợp đồng nào</p>
        <p className="text-xs text-gray-400">
          Tạo hợp đồng mới từ mẫu hợp đồng và Lead đã chốt giao dịch
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <div
          key={contract.contractId}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <ContractStatusBadge status={contract.status} />
                <span className="text-sm text-gray-500">
                  {contract.templateName || 'Hợp đồng'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Mã hợp đồng</p>
                  <p className="font-medium truncate">{contract.contractId}</p>
                </div>
                {contract.leadId && (
                  <div>
                    <p className="text-gray-500">Lead ID</p>
                    <p className="font-medium truncate">{contract.leadId}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">Người tạo</p>
                  <p className="font-medium">{contract.createdByName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{formatDate(contract.createdAt)}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>
                    Mua: {contract.isBuyerSigned ? 'Đã ký' : 'Chưa ký'} | 
                    Bán: {contract.isSellerSigned ? 'Đã ký' : 'Chưa ký'}
                  </span>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetail?.(contract)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


