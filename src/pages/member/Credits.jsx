import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CreditsDisplay from '@/components/member/package/CreditsDisplay'
import PurchasePackageModal from '@/components/member/package/PurchasePackageModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Package, ArrowRight, ShoppingCart } from 'lucide-react'
import packageService from '@/api/services/package.service'
import { useEffect } from 'react'

/**
 * Credits Page
 * UC27: Xem Số Credits còn lại
 */
export default function Credits() {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handlePurchase = () => {
    // Redirect to packages page or open modal with first package
    // For now, redirect to packages page
    window.location.href = '/packages'
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Credits của tôi</h1>
                <p className="text-muted-foreground">
                  Quản lý và theo dõi số credits bạn có
                </p>
              </div>
            </div>
            <Button size="lg" asChild>
              <Link to="/packages">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Mua gói tin
              </Link>
            </Button>
          </div>
        </div>

        {/* Credits Display */}
        <CreditsDisplay />

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Mua thêm gói tin
              </CardTitle>
              <CardDescription>
                Mua thêm credits để tiếp tục đăng tin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/packages">
                  Xem các gói tin
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Lịch sử mua hàng
              </CardTitle>
              <CardDescription>
                Xem lịch sử các gói tin đã mua
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Xem lịch sử
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
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

