import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Eye, 
  Heart,
  Share2,
  Car,
  Battery,
  Zap,
  Award,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Phone,
  Mail,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Package,
  User,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import Header from '@/components/layout/Header'
import postsService from '@/api/services/posts.service'
import leadService from '@/api/services/lead.service'
import authService from '@/api/services/auth.service'
import { getImageUrl } from '@/utils/imageHelper'
import AuctionDetail from '@/components/auction/AuctionDetail'
import FavoriteButton from '@/components/member/favorite/FavoriteButton'
import PostChatDialog from '@/components/member/chat/PostChatDialog'

/**
 * Trang chi tiết bài đăng
 * Hiển thị đầy đủ thông tin xe điện/pin
 */
export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [requesting, setRequesting] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    fetchPostDetail()
  }, [id])

  const fetchPostDetail = async () => {
    try {
      setLoading(true)
      const response = await postsService.getPostById(id)
      
      console.log('Post Detail Response:', response)
      
      if (response.success && response.data) {
        setPost(response.data)
      }
    } catch (error) {
      console.error('Error fetching post detail:', error)
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tải thông tin bài đăng'
      })
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
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPackageBadge = (packageType) => {
    const packageConfig = {
      LUXURY: {
        label: 'Luxury',
        className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
        icon: '👑'
      },
      PREMIUM: {
        label: 'Premium',
        className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
        icon: '⭐'
      },
      BASIC: {
        label: 'Basic',
        className: 'bg-gray-500 text-white',
        icon: '📦'
      }
    }

    const config = packageConfig[packageType?.toUpperCase()] || packageConfig.BASIC

    return (
      <Badge className={config.className}>
        {config.icon} {config.label}
      </Badge>
    )
  }

  const handleRequestStaff = async () => {
    // Kiểm tra authentication
    if (!authService.isAuthenticated()) {
      toast({
        variant: 'destructive',
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để gửi yêu cầu hỗ trợ từ Staff.',
      })
      navigate('/auth/login', { state: { returnUrl: `/posts/${id}` } })
      return
    }

    try {
      setRequesting(true)
      
      // Tạo lead với leadType = SCHEDULE_VIEW để yêu cầu admin gán staff
      const response = await leadService.createLead({
        postId: id,
        leadType: 'SCHEDULE_VIEW'
      })

      if (response.success) {
        toast({
          title: 'Thành công',
          description: 'Yêu cầu của bạn đã được gửi đến admin. Chúng tôi sẽ liên hệ với bạn sớm nhất.',
        })
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
        navigate('/auth/login', { state: { returnUrl: `/posts/${id}` } })
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

  const handleOpenChat = () => {
    if (!authService.isAuthenticated()) {
      toast({
        variant: 'destructive',
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để sử dụng tính năng chat với Staff.'
      })
      navigate('/auth/login', { state: { returnUrl: `/posts/${id}` } })
      return
    }

    setIsChatOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Không tìm thấy bài đăng</h2>
              <p className="text-muted-foreground mb-6">
                Bài đăng không tồn tại hoặc đã bị xóa
              </p>
              <Button onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isVehicle = post.categoryId === 1
  const isBattery = post.categoryId === 2
  const images = post.imageUrls || []
  const currentImage = images.length > 0 ? getImageUrl(images[currentImageIndex]) : null
  const seller = post.seller || post.user

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                {/* Main Image */}
                <div className="relative h-96 bg-muted">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={post.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {isVehicle ? (
                        <Car className="h-24 w-24 text-muted-foreground" />
                      ) : (
                        <Battery className="h-24 w-24 text-muted-foreground" />
                      )}
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2"
                        onClick={() => setCurrentImageIndex(i => (i === 0 ? images.length - 1 : i - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setCurrentImageIndex(i => (i === images.length - 1 ? 0 : i + 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Package Badge */}
                  <div className="absolute top-4 left-4">
                    {getPackageBadge(post.packageType)}
                  </div>

                  {/* Favorite Button */}
                  <div className="absolute top-4 right-4">
                    <FavoriteButton 
                      postId={post.postId}
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 backdrop-blur-sm hover:bg-white"
                    />
                  </div>

                  {/* Auction Badge */}
                  {post.auctionEnabled && (
                    <div className="absolute top-16 right-4">
                      <Badge variant="outline" className="bg-white text-orange-600 border-orange-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Đấu giá
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`${post.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Title & Description */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {post.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.createdAt)}
                      </div>
                      {post.viewCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.viewCount} lượt xem
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{post.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
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
                    <p className="font-semibold">{post.brand}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Model</p>
                    <p className="font-semibold">{post.model}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Năm sản xuất</p>
                    <p className="font-semibold">{post.productionYear}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Dung lượng pin</p>
                    <p className="font-semibold">{post.batteryCapacityCurrent} kWh</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tình trạng</p>
                    <p className="font-semibold">{post.condition}</p>
                  </div>

                  {isVehicle && post.mileage != null && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Số KM đã đi</p>
                      <p className="font-semibold">{post.mileage.toLocaleString()} km</p>
                    </div>
                  )}

                  {post.chargeCount != null && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Số lần sạc</p>
                      <p className="font-semibold">{post.chargeCount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Auction Section */}
            {post.auctionEnabled && (
              <AuctionDetail
                postId={post.postId}
                auctionInfo={{
                  startingBid: post.startingBid,
                  buyNowPrice: post.buyNowPrice,
                  auctionEndTime: post.auctionEndTime
                }}
                onBidSuccess={() => {
                  // Refresh post data after successful bid
                  fetchPostDetail()
                }}
              />
            )}
          </div>

          {/* Right Column - Price & Contact */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">
                  {formatPrice(post.price)}
                </CardTitle>
                {post.auctionEnabled && (
                  <CardDescription>
                    <div className="mt-2 space-y-2">
                      <p>Giá khởi điểm: {formatPrice(post.startingBid || 0)}</p>
                      {post.buyNowPrice && (
                        <p>Giá mua ngay: {formatPrice(post.buyNowPrice)}</p>
                      )}
                      {post.auctionEndTime && (
                        <p className="text-orange-600">
                          Kết thúc: {formatDate(post.auctionEndTime)}
                        </p>
                      )}
                    </div>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chat & Support Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleOpenChat}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat với Staff
                  </Button>

                  {isVehicle && (
                    <Button 
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={handleRequestStaff}
                      disabled={requesting}
                    >
                      {requesting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang gửi yêu cầu...
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 mr-2" />
                          Gửi yêu cầu Staff hỗ trợ
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Info Message for Vehicle */}
                {isVehicle && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Đối với sản phẩm <strong>xe điện</strong>, để đảm bảo tính minh bạch và an toàn, 
                      chúng tôi yêu cầu hỗ trợ từ đội ngũ Staff chuyên nghiệp.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <div className="flex-1">
                    <FavoriteButton 
                      postId={post.postId}
                      variant="outline"
                      className="w-full justify-center"
                    />
                  </div>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>

                <Separator />

                {/* Seller Info - Only for Battery */}
                {isBattery && seller && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Thông tin người bán
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Tài khoản đã xác minh</span>
                      </div>
                      <p className="font-medium">{seller.fullName || 'Người dùng'}</p>
                      {seller.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{seller.email}</span>
                        </div>
                      )}
                      {seller.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{seller.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mẹo an toàn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Gặp mặt người bán tại địa điểm công cộng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Kiểm tra kỹ sản phẩm trước khi thanh toán</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Không chuyển tiền trước khi nhận hàng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Đảm bảo có đầy đủ giấy tờ hợp lệ</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PostChatDialog
        postId={post?.postId}
        postTitle={post?.title}
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
        onRequestStaff={handleRequestStaff}
        requestingStaff={requesting}
      />
    </div>
  )
}
