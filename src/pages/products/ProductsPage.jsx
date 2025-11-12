import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Heart, Eye, Zap, Car, Battery, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import postsService from '@/api/services/posts.service'
import favoriteService from '@/api/services/favorite.service'
import { formatCurrency, formatDate } from '@/utils/formatters'

/**
 * Products Page - Trang danh sách sản phẩm
 */
export default function ProductsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [favorites, setFavorites] = useState(new Set())
  
  // Filters
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [pageNumber, setPageNumber] = useState(parseInt(searchParams.get('pageNumber')) || 1)
  const pageSize = 12

  // Fetch products
  useEffect(() => {
    fetchProducts()
    fetchFavorites()
  }, [pageNumber, keyword])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await postsService.searchPosts({
        keyword,
        pageNumber,
        pageSize,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      })
      
      if (response.success) {
        setProducts(response.data || [])
        setTotal(response.totalCount || 0)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await favoriteService.getFavorites({ pageSize: 1000 })
      if (response.success && response.data) {
        const favoriteIds = new Set(response.data.map(fav => fav.post?.postId).filter(Boolean))
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const handleToggleFavorite = async (postId) => {
    try {
      if (favorites.has(postId)) {
        await favoriteService.removeFromFavorites(postId)
        setFavorites(prev => {
          const newSet = new Set(prev)
          newSet.delete(postId)
          return newSet
        })
      } else {
        await favoriteService.addToFavorites(postId)
        setFavorites(prev => new Set(prev).add(postId))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleSearch = () => {
    setPageNumber(1)
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    params.set('pageNumber', '1')
    setSearchParams(params)
  }

  const ProductCard = ({ product }) => {
    const isFavorite = favorites.has(product.postId)
    const hasAuction = product.auctionEnabled
    const isPremium = product.priorityLevel >= 3

    return (
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="relative">
            {isPremium && (
              <Badge className="absolute top-2 left-2 z-10 bg-yellow-500">
                <Zap className="h-3 w-3 mr-1" /> Premium
              </Badge>
            )}
            {hasAuction && (
              <Badge className="absolute top-2 right-2 z-10 bg-red-500">
                Đấu Giá
              </Badge>
            )}
            <img
              alt={product.title}
              src={product.imageUrls?.[0] || '/placeholder-battery.png'}
              className="w-full h-48 object-cover rounded-t-lg"
              onError={(e) => {
                e.target.src = '/placeholder-battery.png'
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg mb-2 line-clamp-2 h-14">
            {product.title}
          </CardTitle>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(product.price)}
            </div>
            
            {hasAuction && product.startingBid && (
              <div className="text-sm text-gray-500">
                Giá khởi điểm: {formatCurrency(product.startingBid)}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                <Car className="h-3 w-3 mr-1" />
                {product.brand}
              </Badge>
              <Badge variant="outline">
                <Battery className="h-3 w-3 mr-1" />
                {product.batteryCapacityCurrent} kWh
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {product.location || 'Toàn quốc'}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(product.createdAt)}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            className="flex-1"
            onClick={() => navigate(`/posts/${product.postId}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem Chi Tiết
          </Button>
          <Button
            variant={isFavorite ? "destructive" : "outline"}
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleToggleFavorite(product.postId)
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            <ShoppingCart className="mr-3" size={40} />
            Sản Phẩm Pin & Xe Điện
          </h1>
          <p className="text-purple-100">
            Khám phá hàng trăm sản phẩm pin và xe điện chất lượng cao
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>
                Tìm Kiếm
              </Button>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Tìm thấy <strong>{total}</strong> sản phẩm
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-full">
                <CardHeader className="p-0">
                  <Skeleton className="w-full h-48 rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm nào</h3>
                <p>Thử tìm kiếm với từ khóa khác</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.postId} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={pageNumber === 1}
                  onClick={() => setPageNumber(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={pageNumber === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPageNumber(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  )).slice(Math.max(0, pageNumber - 3), Math.min(totalPages, pageNumber + 2))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={pageNumber === totalPages}
                  onClick={() => setPageNumber(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <span className="ml-4 text-sm text-gray-600">
                  Trang {pageNumber} / {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ShoppingCart(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
