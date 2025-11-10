import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Loader2, 
  MapPin, 
  Calendar, 
  TrendingUp,
  User,
  Mail,
  Phone,
  Car,
  Battery,
  AlertCircle,
  CheckCircle,
  Clock,
  Info
} from 'lucide-react'
import { getImageUrl } from '@/utils/imageHelper'
import CountdownTimer from './CountdownTimer'
import postsService from '@/api/services/posts.service'
import leadService from '@/api/services/lead.service'
import authService from '@/api/services/auth.service'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'

/**
 * AuctionDetailModal Component
 * Modal hiển thị chi tiết đấu giá
 * - Nếu là Pin (Battery): Hiển thị đầy đủ thông tin người bán
 * - Nếu là Xe (Vehicle): Không hiển thị thông tin người bán, gửi request đến admin
 */
export default function AuctionDetailModal({ postId, isOpen, onClose }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && postId) {
      fetchPostDetail()
    }
  }, [isOpen, postId])

  const fetchPostDetail = async () => {
    try {
      setLoading(true)
      const response = await postsService.getPostById(postId)
      
      if (response.success && response.data) {
        setPost(response.data)
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: response.message || 'Không thể tải thông tin đấu giá'
        })
        onClose()
      }
    } catch (error) {
      console.error('Error fetching post detail:', error)
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tải thông tin đấu giá'
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleRequestStaff = async () => {
    // Kiểm tra authentication
    if (!authService.isAuthenticated()) {
      toast({
        variant: 'destructive',
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để gửi yêu cầu hỗ trợ từ Staff.',
      })
      navigate('/auth/login', { state: { returnUrl: `/posts/${postId}` } })
      onClose()
      return
    }

    try {
      setRequesting(true)
      
      // Tạo lead với leadType = SCHEDULE_VIEW để yêu cầu admin gán staff
      const response = await leadService.createLead({
        postId: postId,
        leadType: 'SCHEDULE_VIEW'
      })

      if (response.success) {
        toast({
          title: 'Thành công',
          description: 'Yêu cầu của bạn đã được gửi đến admin. Chúng tôi sẽ liên hệ với bạn sớm nhất.',
        })
        onClose()
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: response.message || 'Không thể gửi yêu cầu'
        })
      }
    } catch (error) {
      console.error('Error requesting staff:', error)
      
      // Nếu lỗi 401 (Unauthorized), redirect to login
      if (error.response?.status === 401) {
        toast({
          variant: 'destructive',
          title: 'Phiên đăng nhập hết hạn',
          description: 'Vui lòng đăng nhập lại để tiếp tục.',
        })
        navigate('/auth/login', { state: { returnUrl: `/posts/${postId}` } })
        onClose()
        return
      }
      
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.'
      })
    } finally {
      setRequesting(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!post) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            {loading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <span>Đang tải thông tin...</span>
              </>
            ) : (
              <span className="text-muted-foreground">Không có dữ liệu</span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const isVehicle = post.categoryId === 1
  const isBattery = post.categoryId === 2
  const isExpired = post.auctionEndTime && new Date(post.auctionEndTime) < new Date()
  const imageUrl = post.imageUrls && post.imageUrls.length > 0 
    ? getImageUrl(post.imageUrls[0]) 
    : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{post.title}</DialogTitle>
          <DialogDescription>
            Chi tiết đấu giá sản phẩm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Section */}
          {imageUrl && (
            <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-orange-500 text-white border-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Đấu giá
                </Badge>
              </div>
              {post.auctionEndTime && !isExpired && (
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                  <CountdownTimer endTime={post.auctionEndTime} />
                </div>
              )}
              {isExpired && (
                <div className="absolute top-3 right-3">
                  <Badge variant="destructive">Đã kết thúc</Badge>
                </div>
              )}
            </div>
          )}

          {/* Auction Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đấu giá</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Giá khởi điểm</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(post.startingBid || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Giá cao nhất hiện tại</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatPrice(post.currentHighestBid || post.startingBid || 0)}
                  </p>
                </div>
                {post.buyNowPrice && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Giá mua ngay</p>
                    <p className="text-xl font-semibold text-green-600">
                      {formatPrice(post.buyNowPrice)}
                    </p>
                  </div>
                )}
                {post.auctionEndTime && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Thời gian kết thúc</p>
                    <p className="font-medium">
                      {formatDate(post.auctionEndTime)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Thông số kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Loại sản phẩm</p>
                  <p className="font-semibold flex items-center gap-2">
                    {isVehicle ? (
                      <><Car className="h-4 w-4" /> Xe điện</>
                    ) : (
                      <><Battery className="h-4 w-4" /> Pin</>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Thương hiệu</p>
                  <p className="font-semibold">{post.brand || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Model</p>
                  <p className="font-semibold">{post.model || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Năm sản xuất</p>
                  <p className="font-semibold">{post.productionYear || 'N/A'}</p>
                </div>
                {post.batteryCapacityCurrent && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Dung lượng pin</p>
                    <p className="font-semibold">{post.batteryCapacityCurrent} kWh</p>
                  </div>
                )}
                {isVehicle && post.mileage != null && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Số km đã đi</p>
                    <p className="font-semibold">{post.mileage.toLocaleString('vi-VN')} km</p>
                  </div>
                )}
                {isBattery && post.chargeCount != null && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Số lần sạc</p>
                    <p className="font-semibold">{post.chargeCount.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tình trạng</p>
                  <p className="font-semibold">{post.condition || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Địa điểm</p>
                  <p className="font-semibold flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {post.location || 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {post.description && (
            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{post.description}</p>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Seller Info - Only for Battery */}
          {isBattery && (post.seller || post.user) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin người bán
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Support both seller and user for compatibility
                  const seller = post.seller || post.user
                  if (!seller) return null
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Tài khoản đã xác minh</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Họ tên</p>
                          <p className="font-semibold">{seller.fullName || 'N/A'}</p>
                        </div>
                        {seller.email && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              Email
                            </p>
                            <p className="font-semibold">{seller.email}</p>
                          </div>
                        )}
                        {seller.phoneNumber && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              Số điện thoại
                            </p>
                            <p className="font-semibold">{seller.phoneNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Vehicle - Request Staff */}
          {isVehicle && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Info className="h-5 w-5" />
                  Yêu cầu hỗ trợ từ Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-orange-200">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Đối với sản phẩm <strong>xe điện</strong>, để đảm bảo tính minh bạch và an toàn, 
                        chúng tôi yêu cầu hỗ trợ từ đội ngũ Staff chuyên nghiệp. 
                        Vui lòng gửi yêu cầu và chúng tôi sẽ gán Staff hỗ trợ bạn trong quá trình giao dịch.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleRequestStaff}
                    disabled={requesting}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    {requesting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang gửi yêu cầu...
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Gửi yêu cầu hỗ trợ từ Staff
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Sau khi gửi yêu cầu, Admin sẽ gán Staff hỗ trợ và liên hệ với bạn trong thời gian sớm nhất.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Đóng
            </Button>
            <Button 
              className="flex-1"
              onClick={() => window.open(`/posts/${postId}`, '_blank')}
            >
              Xem chi tiết đầy đủ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

