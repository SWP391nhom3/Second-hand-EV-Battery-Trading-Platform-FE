import React, { useState, useEffect } from "react";
import { Row, Col, Input, Breadcrumb, message } from "antd";
import { SearchOutlined, HomeOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { Header, Footer } from "../../components/layout";
import {
  ProductFilters,
  ProductGrid,
  FAQSection,
} from "../../components/products";
import ProductDetailModal from "../../components/products/ProductDetailModal/ProductDetailModal";
import ContactVehicleModal from "../../components/products/ContactVehicleModal";
import postService from "../../services/postService";
import styles from "./Products.module.css";

const { Search } = Input;

const Products = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 99999999999],
    capacityRange: [0, 100],
    brands: [],
    conditions: [],
    memberships: [],
    locations: [],
    categories: [],
    warranty: "all",
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contactProduct, setContactProduct] = useState(null);
  
  // API state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Check if coming from create post
  useEffect(() => {
    if (location.state?.newPost) {
      message.success("Bài đăng của bạn đã được tạo thành công và đang chờ duyệt!");
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, filters, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
  console.log('🔍 Fetching products...');
  console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

  // Helper: normalize image URLs - return null for empty/blank strings
  const resolveImage = (url) => (url && typeof url === 'string' && url.trim() !== '' ? url : null);

      console.log('📡 Calling API...');
      
      // TEMPORARY FIX: Use admin endpoint to get approved posts
      // TODO: Backend should provide public endpoint that returns approved posts
      // For now, we use admin/all which returns all posts including approved ones
      let response;
      let apiMethod = 'getAdminAllPosts() - temporary fix';
      
      console.log('🔍 Fetching all posts (including approved)...');
      response = await postService.getAdminAllPosts();
      console.log('✅ API response:', response);
      console.log('✅ Number of posts returned:', Array.isArray(response) ? response.length : 0);
        console.log(`📦 Using API method: ${apiMethod}`);

  // Handle different response structures
  // postService.getPosts already returns response.data from axios
  let postsData = [];
  let totalCount = 0;
      
      if (Array.isArray(response)) {
        // Response is directly an array
        postsData = response;
        totalCount = response.length;
      } else if (response?.data && Array.isArray(response.data)) {
        // Response has nested data property
        postsData = response.data;
        totalCount = response.totalCount || response.total || response.data.length;
      } else if (response?.items && Array.isArray(response.items)) {
        // Response has items property
        postsData = response.items;
        totalCount = response.totalCount || response.total || response.items.length;
      } else if (typeof response === 'object' && response !== null) {
        // Response is an object, might have pagination info
        postsData = response.posts || response.data || response.items || [];
        totalCount = response.totalCount || response.total || response.count || postsData.length;
      } else {
        console.warn('Unexpected API response structure:', response);
        postsData = [];
        totalCount = 0;
      }
      
      // Transform API response to match frontend product structure based on new schema
      const transformedProducts = postsData.map((post, index) => {
        // Determine if it's battery or vehicle
        const isBattery = post.batteryId && post.battery;
        const isVehicle = post.vehicleId && post.vehicle;
        
        // Extract package information from PostPackageSubs
        const packageSub = post.postPackageSubs?.[0] || post.postPackageSub;
        const packageInfo = packageSub?.package || packageSub?.postPackage;
        
        // Debug log for first 3 posts
        if (index < 3) {
          console.log(`🔍 Post #${index + 1} Package Debug:`, {
            postId: post.postId,
            title: post.title,
            postPackageSubs: post.postPackageSubs,
            packageSub: packageSub,
            packageInfo: packageInfo,
            extractedPackage: packageInfo ? {
              id: packageInfo.packageId,
              name: packageInfo.name,
              priorityLevel: packageInfo.priorityLevel,
              featured: packageInfo.featured
            } : 'NO PACKAGE'
          });
        }
        
        return {
          // Post basic info
          id: post.postId || post.id,
          name: post.title || 'Sản phẩm',
          description: post.description || 'Không có mô tả',
          price: post.price || 0,
          postType: post.postType, // "Direct" or "Staff-Assisted"
          transactionType: post.transactionType,
          status: post.status,
          featured: post.featured || false,
          contactInfo: post.contactInfo,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          expiryDate: post.expiryDate,
          
          // Package information
          package: packageInfo ? {
            id: packageInfo.packageId,
            name: packageInfo.name,
            price: packageInfo.price,
            durationDay: packageInfo.durationDay,
            priorityLevel: packageInfo.priorityLevel,
            featured: packageInfo.featured,
          } : null,
          packageSubscription: packageSub ? {
            startDate: packageSub.startDate,
            endDate: packageSub.endDate,
            status: packageSub.status,
            remainingDays: packageSub.endDate ? 
              Math.max(0, Math.ceil((new Date(packageSub.endDate) - new Date()) / (1000 * 60 * 60 * 24))) : 0,
          } : null,
          
          // Product specific info
          brand: isBattery ? post.battery.brand : 
                 isVehicle ? post.vehicle.brand : 'Unknown',
          capacity: isBattery ? post.battery.capacityKWh : 
                   isVehicle ? post.vehicle.batteryCapacity : 0,
          condition: isBattery ? post.battery.condition : 
                    isVehicle ? post.vehicle.condition : 'good',
          category: isBattery ? 'battery' : isVehicle ? 'vehicle' : 'unknown',
          
          // Battery specific
          ...(isBattery && {
            cycleCount: post.battery.cycleCount,
            manufactureYear: post.battery.manufactureYear,
            batteryHealth: post.battery.cycleCount ? 
              Math.max(100 - (post.battery.cycleCount / 30), 50) : 90,
          }),
          
          // Vehicle specific
          ...(isVehicle && {
            model: post.vehicle.model,
            mileageKm: post.vehicle.mileageKm,
            manufactureYear: post.vehicle.manufactureYear,
            batteryHealth: 85, // Default for vehicle
          }),
          
          // Display info - normalize image URLs to avoid empty-string src
          image: (function() {
            const byPost = resolveImage(post.imageUrl);
            const byBattery = isBattery ? resolveImage(post.battery?.imageUrl) : null;
            const byVehicle = isVehicle ? resolveImage(post.vehicle?.imageUrl) : null;
            // fallback -> null (do not render empty src)
            return byPost || byBattery || byVehicle || null;
          })(),
          tag: post.featured ? 'Nổi bật' : 
               post.postType === 'Direct' ? 'Trực tiếp' : 'Hỗ trợ',
          inStock: post.status?.toUpperCase() === 'ACTIVE' || 
                   post.status?.toUpperCase() === 'APPROVED',
          
          // Member/Seller info
          membershipLevel: post.member?.packageId || 1,
          rating: post.member?.rating || 4.5,
          reviews: 0, // Not in schema yet
          seller: {
            id: post.member?.memberId,
            name: post.member?.fullName || 'Người bán',
            avatar: post.member?.avatarUrl,
            address: post.member?.address,
            rating: post.member?.rating || 4.5,
            joinedAt: post.member?.joinedAt,
            status: post.member?.status,
            verified: post.member?.status === 'Active',
            totalSales: 0, // Not in schema
          },
          
          // Location
          location: post.member?.address || 'Việt Nam',
          
          // Date info
          postedDate: formatPostedDate(post.createdAt),
          
          // Staff info if applicable
          ...(post.staff && {
            assignedStaff: {
              id: post.staff.memberId,
              name: post.staff.fullName,
            }
          }),
          
          // Usage calculation
          usageYears: post.battery?.manufactureYear ? 
            new Date().getFullYear() - post.battery.manufactureYear :
            post.vehicle?.manufactureYear ?
            new Date().getFullYear() - post.vehicle.manufactureYear : 0,
        };
      });

      // Apply frontend filters (for fields not supported by backend API)
      let filteredProducts = transformedProducts;
      
      console.log('🔍 Before filtering - Total posts:', filteredProducts.length);
      console.log('📊 Full post details:', filteredProducts.map(p => ({ 
        id: p.id, 
        title: p.name, 
        status: p.status,
        postType: p.postType,
        category: p.category,
        price: p.price
      })));
      
      // Filter by status - Show only approved/active posts
      filteredProducts = filteredProducts.filter(product => {
        const status = product.status?.toString().toLowerCase();
        console.log(`🔍 Checking post ${product.id} - Status: "${product.status}" -> lowercase: "${status}"`);
        
        // Accept these statuses (API returns "Approved" with capital A)
        const validStatuses = ['approved', 'active', 'published'];
        const isValid = validStatuses.includes(status);
        
        console.log(`   ✅ Valid: ${isValid}`);
        return isValid;
      });
      
      console.log('✅ After status filter - Valid posts:', filteredProducts.length);
      console.log('📋 Filtered posts:', filteredProducts.map(p => ({ 
        id: p.id, 
        title: p.name, 
        status: p.status 
      })));
      
      // Filter by category (battery/vehicle) - Backend doesn't support this
      if (filters.categories && filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.categories.includes(product.category)
        );
        console.log('🔖 After category filter:', filteredProducts.length);
      }

      setProducts(filteredProducts);
      setTotal(filteredProducts.length); // Use filtered count
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Kiểm tra loại lỗi
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else if (error.response?.status === 404) {
        message.warning('Không tìm thấy sản phẩm nào.');
      } else if (error.response?.status === 500) {
        message.error('Lỗi server. Vui lòng thử lại sau.');
      } else {
        message.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      }
      
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format posted date
  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Mới đăng';
    
    const now = new Date();
    const posted = new Date(dateString);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 30) return `${diffDays} ngày trước`;
    return posted.toLocaleDateString('vi-VN');
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 99999999999],
      capacityRange: [0, 100],
      brands: [],
      conditions: [],
      memberships: [],
      locations: [],
      categories: [],
      warranty: "all",
      inStockOnly: false,
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    // Ngăn không cho xe máy/ô tô được thêm vào giỏ
    if (product.category === 'motorcycle' || product.category === 'car') {
      console.warn("Không thể thêm xe vào giỏ hàng:", product);
      return;
    }
    console.log("Thêm vào giỏ hàng:", product);
    // Implement your cart logic here
  };

  const handleContactVehicle = (product) => {
    setContactProduct(product);
    setContactModalVisible(true);
  };

  const handleCloseContactModal = () => {
    setContactModalVisible(false);
    setContactProduct(null);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
  };

  return (
    <>
      <Header />
      {console.log('RENDER ProductsPage - products length:', products?.length, 'total:', total, 'loading:', loading)}
      <div className={styles.productsPage}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <Breadcrumb className={styles.breadcrumb}>
            <Breadcrumb.Item href="/">
              <HomeOutlined /> Trang chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
          </Breadcrumb>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Sàn Giao Dịch Pin Xe Điện</h1>
              <p className={styles.pageSubtitle}>
                Tìm kiếm pin xe điện đã qua sử dụng hoàn hảo cho xe của bạn
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className={styles.searchSection}>
            <h3 className={styles.searchTitle}>
              <SearchOutlined /> Tìm kiếm sản phẩm
            </h3>
            <Search
              placeholder="Tìm theo thương hiệu, model hoặc thông số kỹ thuật..."
              allowClear
              enterButton="Tìm kiếm"
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              className={styles.searchBar}
            />
          </div>

          {/* Main Content */}
          <Row gutter={[24, 24]}>
            {/* Filters Sidebar */}
            <Col xs={24} lg={6}>
              <ProductFilters
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </Col>

            {/* Products Grid */}
            <Col xs={24} lg={18}>
              <ProductGrid
                products={products}
                loading={loading}
                currentPage={currentPage}
                pageSize={pageSize}
                total={total}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
                onContactVehicle={handleContactVehicle}
              />
            </Col>
          </Row>

          {/* FAQ Section */}
          <FAQSection />
        </div>
      </div>
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      {/* Contact Vehicle Modal */}
      <ContactVehicleModal
        visible={contactModalVisible}
        product={contactProduct}
        onClose={handleCloseContactModal}
      />
    </>
  );
};

export default Products;
