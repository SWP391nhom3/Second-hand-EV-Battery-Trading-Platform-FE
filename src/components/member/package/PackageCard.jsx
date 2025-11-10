import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Crown, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Image as ImageIcon,
  Zap,
  ArrowRight
} from 'lucide-react'

/**
 * PackageCard Component
 * Hiển thị thông tin gói tin với features và nút mua
 */
export default function PackageCard({ 
  package: pkg, 
  onPurchase, 
  isPurchased = false,
  creditsRemaining = null 
}) {
  // Package type configuration
  const packageConfig = {
    BASIC: {
      icon: Star,
      badge: 'Basic',
      className: 'bg-muted-foreground',
      borderColor: 'border-muted-foreground/50 hover:border-muted-foreground',
      gradient: 'from-gray-50 to-gray-100'
    },
    PREMIUM: {
      icon: Sparkles,
      badge: 'Premium',
      className: 'bg-gradient-to-r from-primary to-blue-500',
      borderColor: 'border-primary/50 hover:border-primary',
      gradient: 'from-blue-50 to-purple-50'
    },
    LUXURY: {
      icon: Crown,
      badge: 'Luxury',
      className: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-500/50 hover:border-yellow-500',
      gradient: 'from-yellow-50 to-orange-50'
    }
  }

  // Determine package type from name or priority level
  let packageType = 'BASIC'
  if (pkg.name) {
    const nameUpper = pkg.name.toUpperCase()
    if (nameUpper.includes('LUXURY')) packageType = 'LUXURY'
    else if (nameUpper.includes('PREMIUM')) packageType = 'PREMIUM'
    else packageType = 'BASIC'
  } else if (pkg.priorityLevel >= 8) {
    packageType = 'LUXURY'
  } else if (pkg.priorityLevel >= 5) {
    packageType = 'PREMIUM'
  }
  
  const config = packageConfig[packageType]
  const Icon = config.icon

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 ${config.borderColor} relative`}>
      {/* Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={`${config.className} text-white border-0 shadow-lg`}>
          <Icon className="h-3 w-3 mr-1 fill-current" />
          {config.badge}
        </Badge>
      </div>

      {/* Header */}
      <CardHeader className={`bg-gradient-to-br ${config.gradient} pb-8 pt-6`}>
        <CardTitle className="text-2xl font-bold mb-2">{pkg.name}</CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary">
            {formatPrice(pkg.price)}
          </span>
          <span className="text-muted-foreground text-sm">/gói</span>
        </div>
        <CardDescription className="text-base mt-2">
          {pkg.creditsCount} credits
        </CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-6 space-y-4">
        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-sm">
              <strong>{pkg.creditsCount}</strong> credits để đăng tin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <span className="text-sm">
              Mức độ ưu tiên: <strong>{pkg.priorityLevel}/10</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm">
              Tối đa <strong>{pkg.maxImages}</strong> ảnh/tin
            </span>
          </div>
        </div>

        {/* Credits Remaining (if purchased) */}
        {isPurchased && creditsRemaining !== null && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Credits còn lại:</span>
              <Badge variant="outline" className="text-base font-bold">
                {creditsRemaining}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => {
            console.log('PackageCard: onPurchase called with:', pkg)
            if (onPurchase && typeof onPurchase === 'function') {
              onPurchase(pkg)
            } else {
              console.error('PackageCard: onPurchase is not a function', onPurchase)
            }
          }}
          disabled={pkg.isActive === false}
        >
          {isPurchased ? 'Mua thêm' : 'Chọn gói này'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

