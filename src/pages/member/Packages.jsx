import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PackageList from '@/components/member/package/PackageList'
import PurchasePackageModal from '@/components/member/package/PurchasePackageModal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Sparkles } from 'lucide-react'

/**
 * Packages Page
 * UC25: Xem Danh sách Gói tin
 * UC26: Mua Gói tin
 */
export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handlePurchase = (pkg) => {
    console.log('Packages: handlePurchase called with:', pkg)
    if (!pkg) {
      console.error('Packages: Package is null or undefined')
      return
    }
    setSelectedPackage(pkg)
    setModalOpen(true)
    console.log('Packages: Modal opened, selectedPackage:', pkg)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedPackage(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Gói tin đăng bài</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chọn gói tin phù hợp với nhu cầu của bạn. Mua gói tin để nhận credits và bắt đầu đăng tin bán sản phẩm.
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-blue-50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Ưu đãi đặc biệt
            </CardTitle>
            <CardDescription>
              Mua gói tin ngay hôm nay để nhận được nhiều ưu đãi hấp dẫn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Credits không có thời hạn sử dụng</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Thanh toán an toàn, bảo mật</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Hỗ trợ đổi trả trong vòng 7 ngày</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Nhiều phương thức thanh toán</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Package List */}
        <PackageList onPurchase={handlePurchase} />
      </main>

      {/* Purchase Modal */}
      <PurchasePackageModal
        open={modalOpen}
        onClose={handleCloseModal}
        selectedPackage={selectedPackage}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

