import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Package, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import packageService from '@/api/services/package.service'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

/**
 * CreditsDisplay Component
 * Hiển thị số credits còn lại của user
 */
export default function CreditsDisplay() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCredits, setTotalCredits] = useState(0)

  useEffect(() => {
    fetchMyCredits()
  }, [])

  const fetchMyCredits = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await packageService.getMyCredits()

      if (response.success && response.data) {
        setPackages(response.data)
        // Calculate total credits
        const total = response.data.reduce((sum, pkg) => sum + pkg.creditsRemaining, 0)
        setTotalCredits(total)
      } else {
        setError(response.message || 'Không thể tải thông tin credits')
      }
    } catch (err) {
      console.error('Error fetching credits:', err)
      setError('Đã xảy ra lỗi khi tải thông tin credits')
      toast.error('Không thể tải thông tin credits')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Đang tải...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Total Credits Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Tổng số Credits
          </CardTitle>
          <CardDescription>
            Số credits bạn có thể sử dụng để đăng tin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-primary mb-2">
            {totalCredits}
          </div>
          <p className="text-sm text-muted-foreground">
            credits còn lại
          </p>
        </CardContent>
      </Card>

      {/* Packages List */}
      {packages.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Chi tiết gói tin
          </h3>
          <div className="grid gap-4">
            {packages.map((pkg) => (
              <Card key={pkg.packageId}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{pkg.packageName}</span>
                        {pkg.isExpired && (
                          <Badge variant="destructive">Đã hết hạn</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Mua vào: {new Date(pkg.purchasedAt).toLocaleDateString('vi-VN')}
                      </div>
                      {pkg.expiresAt && (
                        <div className="text-sm text-muted-foreground">
                          Hết hạn: {new Date(pkg.expiresAt).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {pkg.creditsRemaining}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        / {pkg.totalCredits} credits
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Đã sử dụng</span>
                      <span>
                        {pkg.totalCredits - pkg.creditsRemaining} / {pkg.totalCredits}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${(pkg.creditsRemaining / pkg.totalCredits) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Bạn chưa có gói tin nào
            </p>
            <p className="text-sm text-muted-foreground">
              Mua gói tin để bắt đầu đăng tin bán sản phẩm
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

