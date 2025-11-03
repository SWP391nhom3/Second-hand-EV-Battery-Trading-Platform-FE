import React, { useState, useEffect } from "react";
import { Row, Col, Input, Breadcrumb, message } from "antd";
import { SearchOutlined, HomeOutlined } from "@ant-design/icons";
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

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, filters, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build API params
      const params = {
        pageNumber: currentPage,
        pageSize: pageSize,
      };

      // Add search query
      if (searchQuery) {
        params.search = searchQuery;
      }

      // Add filters
      if (filters.priceRange) {
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];
      }

      if (filters.capacityRange) {
        params.minCapacity = filters.capacityRange[0];
        params.maxCapacity = filters.capacityRange[1];
      }

      if (filters.brands && filters.brands.length > 0) {
        params.brands = filters.brands.join(',');
      }

      if (filters.conditions && filters.conditions.length > 0) {
        params.conditions = filters.conditions.join(',');
      }

      if (filters.locations && filters.locations.length > 0) {
        params.locations = filters.locations.join(',');
      }

      if (filters.categories && filters.categories.length > 0) {
        params.categories = filters.categories.join(',');
      }

      if (filters.warranty && filters.warranty !== 'all') {
        params.minWarranty = parseInt(filters.warranty);
      }

      if (filters.inStockOnly) {
        params.inStock = true;
      }

      // Add sorting
      if (sortBy === 'price-asc') {
        params.sortBy = 'price';
        params.sortOrder = 'asc';
      } else if (sortBy === 'price-desc') {
        params.sortBy = 'price';
        params.sortOrder = 'desc';
      } else if (sortBy === 'rating') {
        params.sortBy = 'rating';
        params.sortOrder = 'desc';
      } else if (sortBy === 'newest') {
        params.sortBy = 'createdAt';
        params.sortOrder = 'desc';
      }

      const response = await postService.getPosts(params);
      
      console.log('API Response:', response); // Debug log
      
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
      
      // Transform API response to match frontend product structure
      const transformedProducts = postsData.map(post => ({
        id: post.postId || post.id,
        name: post.title || post.name || 'Sản phẩm',
        brand: post.battery?.batteryModel?.brand || post.vehicle?.vehicleModel?.brand || post.brand || 'Unknown',
        capacity: post.battery?.batteryModel?.capacity || post.vehicle?.vehicleModel?.batteryCapacity || post.capacity || 0,
        voltage: post.battery?.batteryModel?.voltage || post.vehicle?.vehicleModel?.voltage || post.voltage || 0,
        warranty: post.battery?.warrantyMonths || post.vehicle?.warrantyMonths || post.warranty || 12,
        condition: post.battery?.condition || post.vehicle?.condition || post.condition || 'Tốt',
        price: post.price || 0,
        originalPrice: post.originalPrice || post.price || 0,
        rating: post.member?.rating || post.rating || 4.0,
        reviews: post.reviewCount || post.reviews || 0,
        image: post.imageUrl || post.battery?.imageUrl || post.vehicle?.imageUrl || post.image || 'https://via.placeholder.com/400x300',
        tag: post.postType === 'DirectSale' ? 'Bán trực tiếp' : 'Yêu cầu hỗ trợ',
        membershipLevel: post.member?.packageId || post.membershipLevel || 1,
        inStock: post.status === 'Available' || post.inStock !== false,
        category: post.battery ? 'battery' : post.vehicle?.vehicleModel?.vehicleType === 'Motorcycle' ? 'motorcycle' : post.category || 'battery',
        description: post.description || 'Không có mô tả',
        seller: {
          name: post.member?.fullName || post.seller?.name || 'Người bán',
          avatar: post.member?.avatar || post.seller?.avatar,
          rating: post.member?.rating || post.seller?.rating || 4.5,
          totalSales: post.member?.totalSales || post.seller?.totalSales || 0,
        },
        batteryHealth: post.battery?.batteryHealth || post.vehicle?.batteryHealth || post.batteryHealth || 90,
        usageYears: post.battery?.usageYears || post.vehicle?.usageYears || post.usageYears || 1,
        location: post.member?.address || post.location || 'TP. Hồ Chí Minh',
        postedDate: formatPostedDate(post.createdAt || post.createdDate || post.postedDate),
      }));

      setProducts(transformedProducts);
      setTotal(totalCount);
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
