import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Zap, 
  Battery, 
  TrendingUp, 
  Shield, 
  Users, 
  Award,
  CheckCircle2,
  CheckCircle,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  Globe,
  Truck,
  HeadphonesIcon,
  ShoppingCart,
  FileCheck,
  PackageCheck,
  MessageSquare,
  Phone,
  Mail,
  Crown,
  Sparkles,
  Loader2,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import postsService from '@/api/services/posts.service';
import { getImageUrl } from '@/utils/imageHelper';
import AuctionList from '@/components/auction/AuctionList';
import FavoriteButton from '@/components/member/favorite/FavoriteButton';
import PostDetailModal from '@/components/posts/PostDetailModal';

export default function Home() {
  const [currentProcessStep, setCurrentProcessStep] = useState(0);
  const [luxuryPosts, setLuxuryPosts] = useState([]);
  const [premiumPosts, setPremiumPosts] = useState([]);
  const [basicPosts, setBasicPosts] = useState([]);
  const [auctionPosts, setAuctionPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  const processSteps = [
    {
      number: "01",
      title: "Đăng ký & Đăng tin",
      description: "Tạo tài khoản và đăng tin bán xe điện/pin của bạn với AI gợi ý giá thông minh",
      image: "/images/process-1.jpg",
      features: [
        "Đăng ký nhanh chóng",
        "AI gợi ý giá tự động",
        "Xác thực SOH/KM minh bạch"
      ]
    },
    {
      number: "02",
      title: "Kết nối & Thương lượng",
      description: "Người mua quan tâm sẽ liên hệ, Staff môi giới hỗ trợ điều phối và tư vấn",
      image: "/images/process-2.jpg",
      features: [
        "Chat 3 bên (Buyer-Seller-Staff)",
        "Lên lịch xem hàng",
        "Tư vấn chuyên nghiệp"
      ]
    },
    {
      number: "03",
      title: "Giao dịch An toàn",
      description: "Ký hợp đồng số hóa, thanh toán qua cổng an toàn, Staff giám sát toàn bộ",
      image: "/images/process-3.jpg",
      features: [
        "Hợp đồng có giá trị pháp lý",
        "Thanh toán bảo mật",
        "Staff hỗ trợ từ A-Z"
      ]
    },
    {
      number: "04",
      title: "Đánh giá & Hoàn tất",
      description: "Hoàn tất giao dịch, đánh giá 2 chiều xây dựng uy tín cho cả hai bên",
      image: "/images/process-4.jpg",
      features: [
        "Đánh giá minh bạch",
        "Xây dựng uy tín",
        "Hỗ trợ sau bán 24/7"
      ]
    }
  ];

  // Fetch posts data from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching posts from API...');

        // Fetch posts for each package type and auctions in parallel
        const [luxuryResponse, premiumResponse, basicResponse, auctionResponse] = await Promise.all([
          postsService.getPostsByPackage('LUXURY', 2),
          postsService.getPostsByPackage('PREMIUM', 3),
          postsService.getPostsByPackage('BASIC', 3),
          postsService.searchPosts({
            pageNumber: 1,
            pageSize: 6,
            auctionOnly: true,
            sortBy: 'CreatedAt',
            sortDirection: 'DESC'
          })
        ]);

        console.log('API Responses:', { 
          luxury: luxuryResponse, 
          premium: premiumResponse, 
          basic: basicResponse 
        });

        // Log detailed structure
        console.log('Luxury Response Structure:', {
          success: luxuryResponse?.success,
          hasData: !!luxuryResponse?.data,
          dataType: typeof luxuryResponse?.data,
          dataKeys: luxuryResponse?.data ? Object.keys(luxuryResponse.data) : [],
          fullResponse: JSON.stringify(luxuryResponse, null, 2)
        });

        // Set posts data if successful
        // API returns PagedResponse with structure: { success, data: { items, totalCount, ... } }
        if (luxuryResponse?.success && luxuryResponse?.data?.items) {
          console.log('Setting luxury posts:', luxuryResponse.data.items);
          console.log('Luxury posts postId check:', luxuryResponse.data.items.map(p => ({ postId: p.postId, id: p.id, title: p.title })));
          setLuxuryPosts(luxuryResponse.data.items);
        } else if (luxuryResponse?.success && Array.isArray(luxuryResponse?.data)) {
          // Fallback: if data is directly an array
          console.log('Setting luxury posts (array format):', luxuryResponse.data);
          console.log('Luxury posts postId check (array):', luxuryResponse.data.map(p => ({ postId: p.postId, id: p.id, title: p.title })));
          setLuxuryPosts(luxuryResponse.data);
        } else {
          console.warn('No luxury posts or invalid response:', luxuryResponse);
        }
        
        if (premiumResponse?.success && premiumResponse?.data?.items) {
          console.log('Setting premium posts:', premiumResponse.data.items);
          setPremiumPosts(premiumResponse.data.items);
        } else if (premiumResponse?.success && Array.isArray(premiumResponse?.data)) {
          console.log('Setting premium posts (array format):', premiumResponse.data);
          setPremiumPosts(premiumResponse.data);
        } else {
          console.warn('No premium posts or invalid response:', premiumResponse);
        }
        
        if (basicResponse?.success && basicResponse?.data?.items) {
          console.log('Setting basic posts:', basicResponse.data.items);
          setBasicPosts(basicResponse.data.items);
        } else if (basicResponse?.success && Array.isArray(basicResponse?.data)) {
          console.log('Setting basic posts (array format):', basicResponse.data);
          setBasicPosts(basicResponse.data);
        } else {
          console.warn('No basic posts or invalid response:', basicResponse);
        }

        // Set auction posts
        if (auctionResponse?.success && auctionResponse?.data?.items) {
          console.log('Setting auction posts:', auctionResponse.data.items);
          setAuctionPosts(auctionResponse.data.items);
        } else if (auctionResponse?.success && Array.isArray(auctionResponse?.data)) {
          console.log('Setting auction posts (array format):', auctionResponse.data);
          setAuctionPosts(auctionResponse.data);
        } else {
          console.warn('No auction posts or invalid response:', auctionResponse);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError('Không thể tải dữ liệu tin đăng. Vui lòng kiểm tra kết nối API.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format price to VND currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleViewDetails = (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPostId(postId);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedPostId(null);
  };

  const PostCard = ({ post, packageType }) => {
    const packageConfig = {
      luxury: {
        badge: { icon: Crown, label: "Luxury", className: "bg-gradient-to-r from-yellow-500 to-orange-500" },
        borderColor: "border-yellow-500/50 hover:border-yellow-500",
        cardBg: "bg-gradient-to-br from-yellow-50/50 to-orange-50/50"
      },
      premium: {
        badge: { icon: Sparkles, label: "Premium", className: "bg-gradient-to-r from-primary to-blue-500" },
        borderColor: "border-primary/50 hover:border-primary",
        cardBg: "bg-gradient-to-br from-blue-50/50 to-purple-50/50"
      },
      basic: {
        badge: { icon: Star, label: "Basic", className: "bg-muted-foreground" },
        borderColor: "border-border hover:border-muted-foreground",
        cardBg: "bg-white"
      }
    };

    const config = packageConfig[packageType];
    const BadgeIcon = config.badge.icon;
    const postId = post.postId || post.id;

    // Get image URL from API response
    const rawImageUrl = post.imageUrls && post.imageUrls.length > 0 
      ? post.imageUrls[0] 
      : post.image || '';
    
    // Convert to full URL using imageHelper
    const imageUrl = getImageUrl(rawImageUrl);

    // Determine category: 1=Vehicle, 2=Battery
    const isVehicle = post.categoryId === 1;
    const isBattery = post.categoryId === 2;

    return (
      <Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 ${config.borderColor} ${config.cardBg} flex flex-col`}>
        <Link to={`/posts/${postId}`} className="block flex-1">
          {/* Image Section */}
          <div className="relative h-56 bg-muted overflow-hidden">
          <Badge className={`absolute top-3 left-3 z-10 ${config.badge.className} text-white border-0 shadow-lg`}>
            <BadgeIcon className="h-3 w-3 mr-1 fill-current" />
            {config.badge.label}
          </Badge>
          
          {/* Favorite Button */}
          {(post.postId || post.id) && (
            <div className="absolute top-3 right-3 z-10">
              <FavoriteButton 
                postId={post.postId || post.id} 
                variant="ghost"
                size="icon"
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
              />
            </div>
          )}
          
          <img 
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="20"%3E' + (isVehicle ? 'Xe điện' : 'Pin') + '%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="text-xs shadow-md bg-white/95 backdrop-blur-sm">
              {isVehicle ? (
                <><Zap className="h-3 w-3 mr-1" />Xe điện</>
              ) : (
                <><Battery className="h-3 w-3 mr-1" />Pin</>
              )}
            </Badge>
          </div>
          {/* Price Badge - Large and Prominent */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <p className="text-xs text-muted-foreground">Giá bán</p>
            <p className="text-lg font-bold text-primary">{formatPrice(post.price)}</p>
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-3 text-sm">
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

        <CardContent className="space-y-4">
          {/* Brand & Model */}
          <div className="flex items-center gap-2 pb-3 border-b">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Thương hiệu</p>
              <p className="font-semibold text-sm">{post.brand}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="font-semibold text-sm">{post.model}</p>
            </div>
          </div>

          {/* Specifications - Different for Vehicle vs Battery */}
          {isVehicle ? (
            // Vehicle Specifications
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Số km đã đi</p>
                <p className="font-bold text-base">{(post.mileage || 0).toLocaleString()} km</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Tình trạng</p>
                <p className="font-semibold text-sm capitalize">{post.condition || 'N/A'}</p>
              </div>
              {post.batteryCapacityCurrent > 0 && (
                <div className="col-span-2 bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-muted-foreground mb-1">Dung lượng pin</p>
                  <p className="font-bold text-base text-green-700">{post.batteryCapacityCurrent} kWh</p>
                </div>
              )}
            </div>
          ) : (
            // Battery Specifications
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-muted-foreground mb-1">Dung lượng hiện tại</p>
                <p className="font-bold text-base text-blue-700">{post.batteryCapacityCurrent} kWh</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Số lần sạc</p>
                <p className="font-bold text-base">{post.chargeCount || 'N/A'}</p>
              </div>
              <div className="col-span-2 bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Tình trạng</p>
                <p className="font-semibold text-sm capitalize">{post.condition || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Status Badges */}
          <div className="flex gap-2 pt-3 border-t">
            {post.isActive && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Đang bán
              </Badge>
            )}
            {post.auctionEnabled && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                Đấu giá
              </Badge>
            )}
          </div>
        </CardContent>
        </Link>
        
        {/* Details Button - For all package types */}
        <div className="pt-3 border-t px-6 pb-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={(e) => handleViewDetails(postId, e)}
          >
            <Info className="h-4 w-4 mr-2" />
            Chi tiết
          </Button>
        </div>
      </Card>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/10 border-l-4 border-destructive text-destructive px-4 py-3" role="alert">
          <div className="container mx-auto flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="ml-auto"
            >
              Thử lại
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section - Full width with large image */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6),transparent)] -z-10" />
        
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              <Badge variant="outline" className="text-sm px-6 py-2 border-primary/50">
                🚀 Nền tảng C2C hàng đầu Việt Nam
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Sàn giao dịch
                <span className="block text-primary mt-2">Xe điện & Pin</span>
                <span className="block text-3xl md:text-4xl mt-4 text-muted-foreground font-normal">
                  uy tín hàng đầu
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Với nhiều năm kinh nghiệm, EVehicle cung cấp giải pháp mua bán an toàn, 
                minh bạch với sự hỗ trợ của đội ngũ môi giới chuyên nghiệp
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center lg:items-start space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Globe className="h-5 w-5" />
                    <span className="text-2xl font-bold">5+</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Thành phố</span>
                </div>
                <div className="flex flex-col items-center lg:items-start space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Truck className="h-5 w-5" />
                    <span className="text-2xl font-bold">1000+</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Giao dịch</span>
                </div>
                <div className="flex flex-col items-center lg:items-start space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <HeadphonesIcon className="h-5 w-5" />
                    <span className="text-2xl font-bold">24/7</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Hỗ trợ</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 text-base" asChild>
                  <Link to="/register">
                    Bắt đầu ngay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base" asChild>
                  <Link to="/posts">
                    Khám phá sản phẩm
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-semibold">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">2,500+ Thành viên</div>
                    <div className="text-muted-foreground text-xs">Đánh giá 4.8⭐</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:h-[600px] h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl" />
              <img 
                src="/images/hero-vehicle.png"
                alt="EVehicle Platform"
                className="w-full h-full object-contain rounded-3xl shadow-2xl"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect fill="%23f0f0f0" width="600" height="600"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24"%3EEVehicle Platform%3C/text%3E%3C/svg%3E';
                }}
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 lg:left-6 bg-background border rounded-2xl p-4 shadow-xl max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Giao dịch an toàn</div>
                    <div className="text-sm text-muted-foreground">99.5% Hài lòng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="mb-4">Dịch vụ của chúng tôi</Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Giải pháp toàn diện
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Từ đăng tin đến hoàn tất giao dịch - Chúng tôi hỗ trợ bạn từng bước
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50" />
              <CardHeader className="space-y-4">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Đăng tin & Bán hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Đăng tin miễn phí, gói ưu tiên linh hoạt</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>AI gợi ý giá thông minh</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Xác thực SOH/KM minh bạch</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 2 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-500/50" />
              <CardHeader className="space-y-4">
                <div className="h-16 w-16 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Môi giới chuyên nghiệp</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Staff hỗ trợ từ A-Z</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Điều phối lịch hẹn xem hàng</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tư vấn và soạn hợp đồng</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 3 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-500/50" />
              <CardHeader className="space-y-4">
                <div className="h-16 w-16 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Giao dịch an toàn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Hợp đồng số hóa hợp pháp</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Thanh toán qua cổng bảo mật</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Bảo vệ quyền lợi hai bên</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 4 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-500/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-500/50" />
              <CardHeader className="space-y-4">
                <div className="h-16 w-16 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HeadphonesIcon className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Hỗ trợ 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Chat trực tiếp 3 bên</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Hotline tư vấn nhanh</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Giải quyết tranh chấp</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Posts - Luxury */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/10 dark:to-orange-950/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  Tin Luxury
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    Cao cấp nhất
                  </Badge>
                </h2>
                <p className="text-muted-foreground">Sản phẩm cao cấp, hiển thị ưu tiên tối đa</p>
              </div>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/posts?package=luxury">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Đang tải tin đăng...</span>
            </div>
          ) : luxuryPosts.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                {luxuryPosts.map((post) => (
                  <PostCard key={post.postId} post={post} packageType="luxury" />
                ))}
              </div>
              <Button variant="outline" className="w-full md:hidden" asChild>
                <Link to="/posts?package=luxury">
                  Xem tất cả tin Luxury
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có tin đăng Luxury nào</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Posts - Premium */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  Tin Premium
                  <Badge className="bg-gradient-to-r from-primary to-blue-500 text-white border-0">
                    Nổi bật
                  </Badge>
                </h2>
                <p className="text-muted-foreground">Tin đăng được ưu tiên hiển thị cao</p>
              </div>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/posts?package=premium">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Đang tải tin đăng...</span>
            </div>
          ) : premiumPosts.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {premiumPosts.map((post) => (
                  <PostCard key={post.postId} post={post} packageType="premium" />
                ))}
              </div>
              <Button variant="outline" className="w-full md:hidden" asChild>
                <Link to="/posts?package=premium">
                  Xem tất cả tin Premium
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có tin đăng Premium nào</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Posts - Basic */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted-foreground flex items-center justify-center">
                <Star className="h-6 w-6 text-white fill-current" />
              </div>
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  Tin Basic
                  <Badge variant="secondary">
                    Giá tốt
                  </Badge>
                </h2>
                <p className="text-muted-foreground">Tin đăng tiêu chuẩn, giá cả phải chăng</p>
              </div>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/posts?package=basic">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Đang tải tin đăng...</span>
            </div>
          ) : basicPosts.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {basicPosts.map((post) => (
                  <PostCard key={post.postId} post={post} packageType="basic" />
                ))}
              </div>
              <Button variant="outline" className="w-full md:hidden" asChild>
                <Link to="/posts?package=basic">
                  Xem tất cả tin Basic
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có tin đăng Basic nào</p>
            </div>
          )}
        </div>
      </section>

      {/* Auction Posts Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/10 dark:to-red-950/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  Đấu giá
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                    Nóng
                  </Badge>
                </h2>
                <p className="text-muted-foreground">Sản phẩm đang đấu giá, đừng bỏ lỡ cơ hội</p>
              </div>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/auctions">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Đang tải đấu giá...</span>
            </div>
          ) : auctionPosts.length > 0 ? (
            <>
              <AuctionList posts={auctionPosts} loading={false} />
              <Button variant="outline" className="w-full md:hidden mt-6" asChild>
                <Link to="/auctions">
                  Xem tất cả đấu giá
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có đấu giá nào</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="mb-4">Lợi ích vượt trội</Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Vì sao chọn EVehicle?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nền tảng C2C tin cậy cho xe điện và pin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50" />
              <CardHeader className="space-y-4">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Đăng tin & Bán hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Đăng tin miễn phí, gói ưu tiên linh hoạt</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>AI gợi ý giá thông minh</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Xác thực SOH/KM minh bạch</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 2 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-500/50" />
              <CardHeader className="space-y-4">
                <div className="h-16 w-16 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Môi giới chuyên nghiệp</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Staff hỗ trợ từ A-Z</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Điều phối lịch hẹn xem hàng</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tư vấn và soạn hợp đồng</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 3 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-500/50" />
              <CardHeader className="space-y-4">
                <div className="h-16 w-16 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Giao dịch an toàn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Hợp đồng số hóa hợp pháp</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Thanh toán qua cổng bảo mật</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Bảo vệ quyền lợi hai bên</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 4 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-500/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-500/50" />
              <CardHeader className="space-y-4">
                <div className="h-16 w-16 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HeadphonesIcon className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Hỗ trợ 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Chat trực tiếp 3 bên</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Hotline tư vấn nhanh</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Giải quyết tranh chấp</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline">Vì sao bạn</Badge>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Nên chọn
                  <span className="block text-primary">EVehicle?</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Từ kho đến tay khách hàng - Bạn tập trung vào mua bán, phần còn lại để chúng tôi lo!
                </p>
              </div>

              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Phủ sóng toàn quốc</h3>
                    <p className="text-muted-foreground text-sm">
                      Hoạt động tại 5+ thành phố lớn, kết nối hàng nghìn giao dịch mỗi tháng
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Quản lý minh bạch</h3>
                    <p className="text-muted-foreground text-sm">
                      Hệ thống theo dõi giao dịch chi tiết, đánh giá 2 chiều xây dựng uy tín
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Linh hoạt mọi giao dịch</h3>
                    <p className="text-muted-foreground text-sm">
                      Hỗ trợ mua bán trực tiếp, đấu giá, đặt lịch xem hàng linh hoạt
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Bảo vệ quyền lợi</h3>
                    <p className="text-muted-foreground text-sm">
                      Chính sách bảo vệ người dùng 1:1, giải quyết tranh chấp công bằng
                    </p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="mt-8" asChild>
                <Link to="/about">
                  Tìm hiểu thêm
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-muted">
                <img 
                  src="/images/why-choose-us.jpg"
                  alt="Why Choose Us"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect fill="%23f0f0f0" width="600" height="600"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24"%3EWhy Choose Us%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-8 -left-8 bg-background border rounded-2xl p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-1">99.5%</div>
                  <div className="text-sm text-muted-foreground">Khách hàng hài lòng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline">Quy trình vận hành</Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Quy trình 4 bước
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quy trình tối ưu đảm bảo giao dịch chính xác và an toàn
            </p>
          </div>

          {/* Process Steps Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {processSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentProcessStep(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentProcessStep === index
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span className="text-lg font-bold mr-2">{step.number}</span>
                {step.title}
              </button>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-muted">
              <img 
                src={processSteps[currentProcessStep].image}
                alt={processSteps[currentProcessStep].title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="500"%3E%3Crect fill="%23f0f0f0" width="600" height="500"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24"%3EStep ' + (currentProcessStep + 1) + '%3C/text%3E%3C/svg%3E';
                }}
              />
              {/* Step Number Overlay */}
              <div className="absolute top-6 left-6 h-20 w-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold shadow-xl">
                {processSteps[currentProcessStep].number}
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="text-base px-4 py-1">
                  Bước {currentProcessStep + 1} trong quy trình
                </Badge>
                <h3 className="text-3xl md:text-4xl font-bold">
                  {processSteps[currentProcessStep].title}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {processSteps[currentProcessStep].description}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                {processSteps[currentProcessStep].features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-base">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="flex gap-2 pt-4">
                {processSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProcessStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentProcessStep === index
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 text-primary-foreground">
            <Badge variant="secondary" className="mb-4">
              Bắt đầu ngay hôm nay
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Sẵn sàng bắt đầu
              <span className="block mt-2">giao dịch an toàn?</span>
            </h2>
            
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Tham gia cộng đồng 2,500+ thành viên đang mua bán xe điện và pin 
              an toàn, minh bạch tại EVehicle
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-base" asChild>
                <Link to="/register">
                  Đăng ký miễn phí
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-10 text-base bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link to="/posts">
                  Xem sản phẩm
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid md:grid-cols-3 gap-8 pt-16">
              <div className="space-y-2">
                <PackageCheck className="h-12 w-12 mx-auto opacity-90" />
                <div className="text-3xl font-bold">1,000+</div>
                <div className="opacity-80">Sản phẩm</div>
              </div>
              <div className="space-y-2">
                <Users className="h-12 w-12 mx-auto opacity-90" />
                <div className="text-3xl font-bold">2,500+</div>
                <div className="opacity-80">Thành viên</div>
              </div>
              <div className="space-y-2">
                <Award className="h-12 w-12 mx-auto opacity-90" />
                <div className="text-3xl font-bold">4.8⭐</div>
                <div className="opacity-80">Đánh giá</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Contact Info */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="outline">Liên hệ</Badge>
                  <h2 className="text-4xl font-bold">
                    Cần hỗ trợ?
                    <span className="block text-primary mt-2">Chúng tôi luôn sẵn sàng</span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Đội ngũ tư vấn 24/7 sẵn sàng giải đáp mọi thắc mắc của bạn
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Điện thoại / Zalo</div>
                      <a href="tel:1900xxxx" className="text-muted-foreground hover:text-primary transition-colors">
                        1900-xxxx
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Email</div>
                      <a href="mailto:support@evehicle.vn" className="text-muted-foreground hover:text-primary transition-colors">
                        support@evehicle.vn
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Địa chỉ</div>
                      <p className="text-muted-foreground">
                        Hà Nội, Việt Nam
                      </p>
                    </div>
                  </div>

                  {/* Support Hours */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Giờ hỗ trợ</div>
                      <p className="text-muted-foreground">
                        Hỗ trợ 24/7<br />
                        Tư vấn: 8:00 - 22:00 hàng ngày
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button asChild>
                    <a href="tel:1900xxxx">
                      <Phone className="mr-2 h-4 w-4" />
                      Gọi ngay
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="mailto:support@evehicle.vn">
                      <Mail className="mr-2 h-4 w-4" />
                      Gửi email
                    </a>
                  </Button>
                </div>
              </div>

              {/* Right: Contact Form */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Gửi yêu cầu tư vấn</CardTitle>
                  <CardDescription>
                    Điền thông tin và chúng tôi sẽ liên hệ trong vòng 24h
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Họ và tên *</label>
                    <Input placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Số điện thoại *</label>
                    <Input placeholder="0912345678" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input type="email" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nội dung</label>
                    <textarea 
                      className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Gửi yêu cầu
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Post Detail Modal */}
      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          isOpen={isPostModalOpen}
          onClose={handleClosePostModal}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-white">EVehicle</span>
              </div>
              <p className="text-sm leading-relaxed">
                Nền tảng C2C hàng đầu cho xe điện và pin tại Việt Nam. 
                Giao dịch an toàn, minh bạch với sự hỗ trợ của đội ngũ môi giới chuyên nghiệp.
              </p>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-lg bg-slate-800 hover:bg-primary transition-colors flex items-center justify-center">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Về chúng tôi */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Về chúng tôi</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Cách thức hoạt động
                  </Link>
                </li>
                <li>
                  <Link to="/packages" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Bảng giá
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Hỗ trợ */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Hỗ trợ</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/faq" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link to="/dispute" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Giải quyết tranh chấp
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Liên hệ */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Liên hệ</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <a href="mailto:support@evehicle.vn" className="hover:text-primary transition-colors">
                    support@evehicle.vn
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <a href="tel:1900xxxx" className="hover:text-primary transition-colors">
                    Hotline: 1900-xxxx
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Hà Nội, Việt Nam</span>
                </li>
                <li className="flex items-start gap-2">
                  <HeadphonesIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Hỗ trợ 24/7</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p className="text-slate-400">
                &copy; 2025 EVehicle Marketplace. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link to="/terms" className="text-slate-400 hover:text-primary transition-colors">
                  Điều khoản
                </Link>
                <Link to="/privacy" className="text-slate-400 hover:text-primary transition-colors">
                  Bảo mật
                </Link>
                <Link to="/cookies" className="text-slate-400 hover:text-primary transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
