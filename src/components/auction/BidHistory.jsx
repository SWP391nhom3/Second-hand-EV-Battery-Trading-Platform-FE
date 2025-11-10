import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Trophy, User } from 'lucide-react'
import bidService from '@/api/services/bid.service'

/**
 * BidHistory Component
 * Lịch sử đặt giá
 */
export default function BidHistory({ postId }) {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBids()
  }, [postId])

  const fetchBids = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidService.getBidsByPostId(postId)
      
      if (response.success && response.data) {
        setBids(response.data.bids || [])
      } else {
        setError(response.message || 'Không thể tải lịch sử đấu giá')
      }
    } catch (err) {
      console.error('Error fetching bids:', err)
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải lịch sử đấu giá')
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử đấu giá</CardTitle>
        <CardDescription>
          Tổng số lượt đấu giá: {bids.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bids.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có lượt đấu giá nào
          </div>
        ) : (
          <div className="space-y-3">
            {bids.map((bid) => (
              <div
                key={bid.bidId}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  bid.isWinningBid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {bid.isWinningBid && (
                    <Trophy className="h-5 w-5 text-green-600" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{bid.bidderName}</span>
                      {bid.isWinningBid && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Đang thắng
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(bid.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">
                    {formatPrice(bid.bidAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


