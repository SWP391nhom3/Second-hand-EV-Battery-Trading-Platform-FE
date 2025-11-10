import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import ContractCreateModal from '@/components/staff/contracts/ContractCreateModal'
import ContractList from '@/components/staff/contracts/ContractList'
import ContractDetailModal from '@/components/staff/contracts/ContractDetailModal'
import staffContractService from '@/api/services/staffContract.service'

/**
 * ContractManagement Page for Staff
 * Page quản lý hợp đồng (UC43)
 * Module 5: Soạn thảo Hợp đồng
 */
export default function ContractManagement() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    try {
      setLoading(true)
      const response = await staffContractService.getContracts({
        pageNumber: 1,
        pageSize: 50
      })
      
      if (response?.success && response?.data?.data) {
        setContracts(response.data.data)
      } else {
        setContracts([])
      }
    } catch (error) {
      console.error('Error loading contracts:', error)
      toast.error('Không thể tải danh sách hợp đồng')
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContract = (newContract) => {
    // Thêm contract mới vào danh sách
    setContracts(prev => [newContract, ...prev])
    toast.success('Hợp đồng đã được tạo thành công!')
    // Có thể reload danh sách nếu cần
    // loadContracts()
  }

  const handleViewDetail = async (contract) => {
    try {
      // Load chi tiết contract từ API
      const response = await staffContractService.getContractById(contract.contractId)
      if (response?.success && response.data) {
        setSelectedContract(response.data)
        setIsDetailModalOpen(true)
      } else {
        toast.error('Không thể tải chi tiết hợp đồng')
      }
    } catch (error) {
      console.error('Error loading contract detail:', error)
      toast.error('Có lỗi xảy ra khi tải chi tiết hợp đồng')
    }
  }

  const handleContractUpdate = (updatedContract) => {
    // Cập nhật contract trong danh sách
    setContracts(prev => 
      prev.map(c => 
        c.contractId === updatedContract.contractId ? updatedContract : c
      )
    )
    setSelectedContract(updatedContract)
    // Reload danh sách để đảm bảo đồng bộ
    loadContracts()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Hợp đồng</h1>
          <p className="text-sm text-gray-500 mt-1">
            Soạn thảo và quản lý hợp đồng từ mẫu (UC43)
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tạo hợp đồng mới
        </Button>
      </div>


      {/* Contract List */}
      <div className="bg-white rounded-lg border p-6">
        <ContractList
          contracts={contracts}
          loading={loading}
          onViewDetail={handleViewDetail}
        />
      </div>

      {/* Create Modal */}
      <ContractCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateContract}
      />

      {/* Detail Modal */}
      <ContractDetailModal
        contract={selectedContract}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedContract(null)
        }}
        onUpdate={handleContractUpdate}
      />
    </div>
  )
}

