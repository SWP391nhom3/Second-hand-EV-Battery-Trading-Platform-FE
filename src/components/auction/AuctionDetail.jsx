import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, TrendingUp, Clock, Gavel } from 'lucide-react'
import CountdownTimer from './CountdownTimer'
import BidForm from './BidForm'
import BidHistory from './BidHistory'
import bidService from '@/api/services/bid.service'

/**
 * AuctionDetail Component
 * Hiển thị thông tin đấu giá, countdown timer
 */
export default function AuctionDetail({ postId, auctionInfo, onBidSuccess }) {
  const [bidData, setBidData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBidData()
  }, [postId])

  const fetchBidData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidService.getBidsByPostId(postId)
      
      if (response.success && response.data) {
        setBidData(response.data)
      } else {
        setError(response.message || 'Không thể tải thông tin đấu giá')
      }
    } catch (err) {
      console.error('Error fetching bid data:', err)
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải thông tin đấu giá')
    } finally {
      setLoading(false)
    }
  }

  const handleBidSuccess = (newBid) => {
    // Refresh bid data after successful bid
    fetchBidData()
    if (onBidSuccess) {
      onBidSuccess(newBid)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!bidData && !auctionInfo) {
    return null
  }

  const auctionEndTime = bidData?.auctionEndTime || auctionInfo?.auctionEndTime
  const currentHighestBid = bidData?.currentHighestBid || null
  const startingBid = bidData?.startingBid || auctionInfo?.startingBid || 0
  const buyNowPrice = bidData?.buyNowPrice || auctionInfo?.buyNowPrice
  const totalBids = bidData?.totalBids || 0

  const isExpired = auctionEndTime && new Date(auctionEndTime) < new Date()

  return (
    <div className="space-y-6">
      {/* Auction Info Card */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Thông tin đấu giá
            </CardTitle>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
              <Gavel className="h-3 w-3 mr-1" />
              Đang đấu giá
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Countdown Timer */}
          {auctionEndTime && !isExpired && (
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Thời gian còn lại</p>
                <CountdownTimer 
                  endTime={auctionEndTime}
                  onExpired={() => {
                    // Refresh data when expired
                    fetchBidData()
                  }}
                />
              </div>
            </div>
          )}

          {isExpired && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 font-semibold">Đấu giá đã kết thúc</p>
            </div>
          )}

          {/* Auction Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Giá khởi điểm</p>
              <p className="font-bold text-lg">{formatPrice(startingBid)}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Giá cao nhất</p>
              <p className="font-bold text-lg text-primary">
                {currentHighestBid ? formatPrice(currentHighestBid) : 'Chưa có'}
              </p>
            </div>
            {buyNowPrice && (
              <div className="p-3 bg-white rounded-lg border col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Giá mua ngay</p>
                <p className="font-bold text-lg text-green-600">{formatPrice(buyNowPrice)}</p>
              </div>
            )}
            <div className="p-3 bg-white rounded-lg border col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Tổng số lượt đấu giá</p>
              <p className="font-bold text-lg">{totalBids}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bid Form */}
      {!isExpired && (
        <BidForm
          postId={postId}
          currentHighestBid={currentHighestBid}
          startingBid={startingBid}
          onBidSuccess={handleBidSuccess}
        />
      )}

      {/* Bid History */}
      <BidHistory postId={postId} />
    </div>
  )
}


