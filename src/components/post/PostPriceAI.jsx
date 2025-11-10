import React, { useState } from 'react'
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'

/**
 * Component gợi ý giá bằng AI
 * UC51: AI Price Suggestion (được gọi trong UC06)
 */
const PostPriceAI = ({ 
  formData, 
  currentPrice, 
  onPriceAccept 
}) => {
  const [suggestedPrice, setSuggestedPrice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [priceRange, setPriceRange] = useState(null)

  const getSuggestedPrice = async () => {
    // Kiểm tra đủ thông tin
    if (!formData.categoryId || !formData.brand || !formData.model || !formData.yearOfManufacture) {
      setError('Vui lòng nhập đầy đủ thông tin: Loại sản phẩm, Thương hiệu, Model, Năm sản xuất')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // TODO: Call AI API endpoint
      // Tạm thời mock data
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock AI response
      const basePrice = formData.categoryId === 1 ? 150000000 : 25000000 // Xe: 150tr, Pin: 25tr
      const yearFactor = (new Date().getFullYear() - formData.yearOfManufacture) * 0.05
      const sohFactor = formData.soh ? (formData.soh / 100) : 0.8
      const kmFactor = formData.kilometers ? Math.max(0.5, 1 - (formData.kilometers / 100000)) : 1
      
      const calculatedPrice = basePrice * (1 - yearFactor) * sohFactor * kmFactor
      const suggested = Math.round(calculatedPrice / 1000000) * 1000000 // Round to million
      
      setSuggestedPrice(suggested)
      setPriceRange({
        min: Math.round(suggested * 0.85 / 1000000) * 1000000,
        max: Math.round(suggested * 1.15 / 1000000) * 1000000
      })

    } catch (err) {
      console.error('Error getting price suggestion:', err)
      setError('Không thể lấy gợi ý giá. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getPriceDifference = () => {
    if (!suggestedPrice || !currentPrice) return null
    
    const diff = ((currentPrice - suggestedPrice) / suggestedPrice * 100).toFixed(1)
    return parseFloat(diff)
  }

  const priceDiff = getPriceDifference()

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Gợi ý giá thông minh
        </CardTitle>
        <CardDescription>
          AI sẽ phân tích thông tin sản phẩm và đưa ra mức giá phù hợp với thị trường
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Get suggestion button */}
        {!suggestedPrice && (
          <Button
            type="button"
            onClick={getSuggestedPrice}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Đang phân tích...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Lấy gợi ý giá
              </>
            )}
          </Button>
        )}

        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Suggested price result */}
        {suggestedPrice && (
          <div className="space-y-4">
            {/* Main suggested price */}
            <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
              <p className="text-sm text-gray-600 mb-1">Giá đề xuất</p>
              <p className="text-3xl font-bold text-purple-600">
                {formatPrice(suggestedPrice)}
              </p>
            </div>

            {/* Price range */}
            {priceRange && (
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Khoảng giá hợp lý
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    Từ {formatPrice(priceRange.min)}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-700">
                    Đến {formatPrice(priceRange.max)}
                  </span>
                </div>
              </div>
            )}

            {/* Current price comparison */}
            {currentPrice && priceDiff !== null && (
              <Alert className={
                Math.abs(priceDiff) > 20 
                  ? "border-amber-300 bg-amber-50" 
                  : "border-green-300 bg-green-50"
              }>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {priceDiff > 20 ? (
                    <>Giá bạn đặt cao hơn {priceDiff}% so với thị trường. Có thể khó bán.</>
                  ) : priceDiff < -20 ? (
                    <>Giá bạn đặt thấp hơn {Math.abs(priceDiff)}% so với thị trường. Bạn có thể bán được giá cao hơn.</>
                  ) : (
                    <>Giá của bạn phù hợp với thị trường ({priceDiff > 0 ? '+' : ''}{priceDiff}%).</>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSuggestedPrice(null)
                  setPriceRange(null)
                  setError(null)
                }}
                className="flex-1"
              >
                Làm mới
              </Button>
              <Button
                type="button"
                onClick={() => onPriceAccept(suggestedPrice)}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Áp dụng giá này
              </Button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 text-center">
              * Giá chỉ mang tính chất tham khảo dựa trên dữ liệu thị trường
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PostPriceAI
