import { useState, useEffect } from 'react'
import PackageCard from './PackageCard'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import packageService from '@/api/services/package.service'
import { toast } from 'sonner'

/**
 * PackageList Component
 * Hiển thị danh sách các gói tin với comparison
 */
export default function PackageList({ onPurchase }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userPackages, setUserPackages] = useState([])

  useEffect(() => {
    fetchPackages()
    fetchUserPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await packageService.getAllPackages()
      
      if (response.success && response.data) {
        setPackages(response.data)
      } else {
        setError(response.message || 'Không thể tải danh sách gói tin')
      }
    } catch (err) {
      console.error('Error fetching packages:', err)
      setError('Đã xảy ra lỗi khi tải danh sách gói tin')
      toast.error('Không thể tải danh sách gói tin')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPackages = async () => {
    try {
      const response = await packageService.getMyPackages()
      if (response.success && response.data) {
        // Create a map of packageId -> creditsRemaining
        const packageMap = {}
        response.data.forEach(userPkg => {
          packageMap[userPkg.packageId] = userPkg.creditsRemaining
        })
        setUserPackages(packageMap)
      }
    } catch (err) {
      // Silent fail - user might not be logged in
      console.log('Could not fetch user packages:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Đang tải gói tin...</span>
      </div>
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

  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Chưa có gói tin nào</p>
      </div>
    )
  }

  // Sort packages by priority level (highest first)
  const sortedPackages = [...packages].sort((a, b) => b.priorityLevel - a.priorityLevel)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedPackages.map((pkg) => {
        const isPurchased = userPackages.hasOwnProperty(pkg.id)
        const creditsRemaining = userPackages[pkg.id] || null
        
        return (
          <PackageCard
            key={pkg.id}
            package={pkg}
            onPurchase={onPurchase}
            isPurchased={isPurchased}
            creditsRemaining={creditsRemaining}
          />
        )
      })}
    </div>
  )
}

