import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, TrendingUp, Loader2, Info } from 'lucide-react'
import { getImageUrl } from '@/utils/imageHelper'
import CountdownTimer from './CountdownTimer'
import AuctionDetailModal from './AuctionDetailModal'

/**
 * AuctionList Component
 * Danh sách đấu giá đang diễn ra
 */
export default function AuctionList({ posts, loading }) {
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleViewDetails = (postId, e) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedPostId(postId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPostId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Chưa có đấu giá nào đang diễn ra</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => {
        // Support both postId and id for compatibility
        const postId = post.postId || post.id
        const imageUrl = post.imageUrls && post.imageUrls.length > 0 
          ? getImageUrl(post.imageUrls[0]) 
          : null
        const isExpired = post.auctionEndTime && new Date(post.auctionEndTime) < new Date()

        if (!postId) {
          console.warn('Post missing postId and id:', post)
          return null
        }

        return (
          <Card key={postId} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-500/50 overflow-hidden flex flex-col">
            <Link to={`/posts/${postId}`} className="block flex-1">
              {/* Image Section */}
              <div className="relative h-56 bg-muted overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TrendingUp className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}

                {/* Auction Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="outline" className="bg-orange-500 text-white border-orange-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Đấu giá
                  </Badge>
                </div>

                {/* Countdown Timer */}
                {post.auctionEndTime && !isExpired && (
                  <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg">
                    <CountdownTimer endTime={post.auctionEndTime} />
                  </div>
                )}

                {isExpired && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant="destructive">Đã kết thúc</Badge>
                  </div>
                )}

                {/* Price Badge */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                  <p className="text-xs text-muted-foreground">Giá cao nhất</p>
                  <p className="text-lg font-bold text-primary">
                    {post.currentHighestBid 
                      ? formatPrice(post.currentHighestBid)
                      : formatPrice(post.startingBid || 0)}
                  </p>
                </div>
              </div>

              {/* Content Section */}
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <div className="flex items-center gap-3 text-sm mt-2">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {post.location || 'Chưa cập nhật'}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    Năm {post.productionYear}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Auction Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-orange-50 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Giá khởi điểm</p>
                    <p className="font-semibold">{formatPrice(post.startingBid || 0)}</p>
                  </div>
                  {post.buyNowPrice && (
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Mua ngay</p>
                      <p className="font-semibold text-green-700">{formatPrice(post.buyNowPrice)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Link>
            
            <CardFooter className="pt-3 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => handleViewDetails(postId, e)}
              >
                <Info className="h-4 w-4 mr-2" />
                Chi tiết
              </Button>
            </CardFooter>
          </Card>
        )
      })}
      
      {/* Auction Detail Modal */}
      {selectedPostId && (
        <AuctionDetailModal
          postId={selectedPostId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}


