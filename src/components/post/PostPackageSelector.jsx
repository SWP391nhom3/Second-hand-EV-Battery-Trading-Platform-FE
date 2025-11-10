import React, { useEffect, useState } from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'
import packageService from '@/api/services/package.service'

/**
 * Component chọn gói tin và hiển thị số credits
 * UC06: Step 6 - Chọn gói tin
 */
const PostPackageSelector = ({ 
  selectedPackage, 
  onPackageChange,
  onSelect, // Support for EditPostPage
  error 
}) => {
  const [packages, setPackages] = useState([])
  const [credits, setCredits] = useState({})
  const [loading, setLoading] = useState(true)

  // Package details
  const packageDetails = {
    BASIC: {
      name: 'Gói Basic',
      color: 'bg-gray-100 border-gray-300',
      icon: '📦',
      features: [
        'Hiển thị ở vị trí thường',
        'Tối đa 5 hình ảnh',
        'Thời gian hiển thị: 30 ngày'
      ]
    },
    PREMIUM: {
      name: 'Gói Premium',
      color: 'bg-blue-50 border-blue-300',
      icon: '⭐',
      features: [
        'Ưu tiên hiển thị cao',
        'Tối đa 10 hình ảnh',
        'Badge "Premium"',
        'Thời gian hiển thị: 45 ngày'
      ]
    },
    LUXURY: {
      name: 'Gói Luxury',
      color: 'bg-amber-50 border-amber-300',
      icon: '👑',
      features: [
        'Hiển thị ở vị trí TOP',
        'Không giới hạn hình ảnh',
        'Badge "VIP"',
        'Nổi bật trên trang chủ',
        'Thời gian hiển thị: 60 ngày'
      ]
    }
  }

  useEffect(() => {
    loadPackagesAndCredits()
  }, [])

  const loadPackagesAndCredits = async () => {
    try {
      setLoading(true)
      
      // Load user's packages with remaining credits (UC27)
      const packagesRes = await packageService.getMyPackages()

      console.log('🔍 Raw API Response:', packagesRes)

      // API trả về { success: true } chứ không phải { isSuccess: true }
      if (packagesRes.success && packagesRes.data) {
        const userPackages = packagesRes.data || []
        
        console.log('📦 User packages from API:', userPackages)
        console.log('📦 Number of packages:', userPackages.length)
        
        // Tạo map packageType -> data từ API (tránh duplicate)
        const packagesMap = {}
        userPackages.forEach(pkg => {
          let type = pkg.packageType?.toUpperCase()
          
          // Nếu không có packageType, extract từ packageName
          if (!type && pkg.packageName) {
            const pkgName = pkg.packageName.toUpperCase()
            if (pkgName.includes('LUXURY')) {
              type = 'LUXURY'
            } else if (pkgName.includes('PREMIUM')) {
              type = 'PREMIUM'
            } else if (pkgName.includes('BASIC')) {
              type = 'BASIC'
            }
          }
          
          // Chỉ lưu nếu có type và chưa tồn tại (tránh duplicate)
          if (type && !packagesMap[type]) {
            packagesMap[type] = {
              ...pkg,
              remainingCredits: pkg.creditsRemaining ?? pkg.remainingCredits ?? 0
            }
          }
        })
        
        // Tạo full list 3 gói với thông tin từ API (nếu có)
        const fullPackages = ['BASIC', 'PREMIUM', 'LUXURY'].map(type => {
          const apiData = packagesMap[type]
          return {
            packageId: apiData?.packageId || null,
            packageType: type,
            packageName: apiData?.packageName || `Gói ${type}`,
            price: apiData?.price || 0,
            remainingCredits: apiData?.remainingCredits || 0,
            hasData: !!apiData // Flag để biết user có mua gói này chưa
          }
        })
        
        console.log('✅ Full packages with credits:', fullPackages)
        setPackages(fullPackages)
      } else {
        console.error('❌ API call failed or no data:', packagesRes)
        // Vẫn hiển thị 3 gói nhưng không có credits
        setPackages([
          { packageId: null, packageType: 'BASIC', packageName: 'Gói Basic', price: 0, remainingCredits: 0, hasData: false },
          { packageId: null, packageType: 'PREMIUM', packageName: 'Gói Premium', price: 0, remainingCredits: 0, hasData: false },
          { packageId: null, packageType: 'LUXURY', packageName: 'Gói Luxury', price: 0, remainingCredits: 0, hasData: false }
        ])
      }

    } catch (error) {
      console.error('❌ Error loading packages:', error)
      // Fallback: hiển thị 3 gói trống
      setPackages([
        { packageId: null, packageType: 'BASIC', packageName: 'Gói Basic', price: 0, remainingCredits: 0, hasData: false },
        { packageId: null, packageType: 'PREMIUM', packageName: 'Gói Premium', price: 0, remainingCredits: 0, hasData: false },
        { packageId: null, packageType: 'LUXURY', packageName: 'Gói Luxury', price: 0, remainingCredits: 0, hasData: false }
      ])
    } finally {
      setLoading(false)
      console.log('✅ Loading finished')
    }
  }

  const getRemainingCredits = (packageType) => {
    return credits[packageType] || 0
  }

  const hasEnoughCredits = (packageType) => {
    return getRemainingCredits(packageType) > 0
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Chọn gói tin <span className="text-red-500">*</span>
        </label>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Chọn gói tin <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mt-1">
          Chọn gói tin phù hợp để đăng bài. Mỗi lượt đăng sẽ trừ 1 credit từ gói đã chọn.
        </p>
      </div>

      {/* Package cards - Hiển thị full 3 gói */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(() => {
          console.log('🎨 Rendering packages:', packages)
          console.log('🎨 Packages length:', packages.length)
          return packages.map((pkg) => {
            console.log('🎨 Rendering package:', pkg)
            
            // Lấy detail theo packageType
            const packageType = pkg.packageType?.toUpperCase() || 'BASIC'
            const detail = packageDetails[packageType] || packageDetails.BASIC
            
            // Lấy credits
            const remainingCredits = pkg.remainingCredits || 0
            const hasCredits = remainingCredits > 0 && pkg.hasData
            
            // Support both packageId (Create) and packageType (Edit)
            const isSelected = selectedPackage === pkg.packageId || 
                             selectedPackage === pkg.packageType ||
                             (typeof selectedPackage === 'string' && selectedPackage.toUpperCase() === pkg.packageType)

          return (
            <Card
              key={pkg.packageType}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                detail.color,
                isSelected && "ring-2 ring-blue-500 shadow-lg",
                !hasCredits && "opacity-60 cursor-not-allowed"
              )}
              onClick={() => {
                if (hasCredits && pkg.packageId) {
                  // Ưu tiên onSelect (cho Edit), fallback onPackageChange (cho Create)
                  const handler = onSelect || onPackageChange
                  if (handler) {
                    handler(onSelect ? pkg.packageType : pkg.packageId)
                  }
                }
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{detail.icon}</span>
                    <CardTitle className="text-lg">{detail.name}</CardTitle>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                
                {/* Credits badge */}
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant={hasCredits ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {hasCredits 
                      ? `${remainingCredits} credits còn lại`
                      : 'Hết credits'
                    }
                  </Badge>
                  {pkg.price && (
                    <span className="text-xs text-gray-600">
                      {pkg.price.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2">
                  {detail.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Buy more credits link */}
                {!hasCredits && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="mt-3 p-0 h-auto text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.location.href = '/packages'
                    }}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Mua thêm credits
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })
        })()}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Lưu ý:</strong> Sau khi gửi bài đăng, Admin sẽ duyệt trong vòng 24h. 
          Credits chỉ bị trừ khi bài đăng được chấp nhận. Nếu bị từ chối, credits sẽ không bị trừ.
        </p>
      </div>
    </div>
  )
}

export default PostPackageSelector
