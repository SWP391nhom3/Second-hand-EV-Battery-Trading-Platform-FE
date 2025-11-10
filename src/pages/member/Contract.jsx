import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContractViewer from '@/components/member/contract/ContractViewer'
import ContractSigner from '@/components/member/contract/ContractSigner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

/**
 * Contract Page
 * Trang xem và ký hợp đồng (UC29)
 */
export default function Contract() {
  const { contractId } = useParams()
  const [showSignDialog, setShowSignDialog] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSign = () => {
    setShowSignDialog(true)
  }

  const handleSignSuccess = () => {
    setShowSignDialog(false)
    // Refresh contract data
    setRefreshKey(prev => prev + 1)
  }

  const handleSignCancel = () => {
    setShowSignDialog(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ContractViewer
            key={refreshKey}
            contractId={contractId}
            onSign={handleSign}
          />
        </div>
      </main>

      {/* Sign Dialog */}
      <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ký hợp đồng</DialogTitle>
            <DialogDescription>
              Vui lòng ký hợp đồng để hoàn tất giao dịch
            </DialogDescription>
          </DialogHeader>
          <ContractSigner
            contractId={contractId}
            onSuccess={handleSignSuccess}
            onCancel={handleSignCancel}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}

