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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (location.state?.newPost) {
      message.success(
        "Bài đăng của bạn đã được tạo thành công và đang chờ duyệt!"
      );
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, filters, sortBy, searchQuery]);

  // Helper function to resolve image URL (handle null/empty)
  const resolveImage = (url) => {
    return url && typeof url === 'string' && url.trim() !== '' ? url : null;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching products...');
      
      // TODO: Backend /api/Post endpoint returns empty, using admin endpoint as temporary fix
      // Switch back to getPosts() when backend fixes the public endpoint
      const response = await postService.getAdminAllPosts();
      console.log('📦 API Response:', response);
      
      // Handle response - getAdminAllPosts returns array directly
      let postsData = Array.isArray(response) ? response : [];
      
      console.log(`📊 Total posts from API: ${postsData.length}`);
      
      // Filter only APPROVED posts (case-insensitive)
      const approvedPosts = postsData.filter(post => {
        const isApproved = post.status?.toUpperCase() === 'APPROVED';
        if (!isApproved) {
          console.log(`⏭️ Skipping post ${post.postId} - status: ${post.status}`);
        }
        return isApproved;
      });
      
      console.log(`✅ Approved posts: ${approvedPosts.length}`);
      
      // Transform API response to match frontend product structure
      const transformedProducts = approvedPosts.map((post, index) => {
        // Determine if it's battery or vehicle
        const isBattery = post.batteryId && post.battery;
        const isVehicle = post.vehicleId && post.vehicle;
        
        // Extract package information
        const packageSub = post.postPackageSubs?.[0] || post.postPackageSub;
        const packageInfo = packageSub?.package || packageSub?.postPackage;
        
        // Resolve images with null handling
        const byPost = resolveImage(post.imageUrl);
        const byBattery = isBattery ? resolveImage(post.battery?.imageUrl) : null;
        const byVehicle = isVehicle ? resolveImage(post.vehicle?.imageUrl) : null;
        const finalImage = byPost || byBattery || byVehicle || null;

        return {
          id: post.postId,
          name: post.title || "Sản phẩm",
          price: post.price || 0,
          postType: post.postType,
          transactionType: post.transactionType,
          status: post.status,
          featured: post.featured || false,
          contactInfo: post.contactInfo,
          createdAt: post.createdAt,
          
          // Package information
          package: packageInfo ? {
            id: packageInfo.packageId,
            name: packageInfo.name,
            priorityLevel: packageInfo.priorityLevel,
          } : null,
          
          // Product info
          brand: isBattery ? post.battery?.brand : 
                 isVehicle ? post.vehicle?.brand : 'N/A',
          capacity: isBattery ? post.battery?.capacityKWh : 
                   isVehicle ? post.vehicle?.batteryCapacity : 0,
          condition: isBattery ? post.battery?.condition : 
                    isVehicle ? post.vehicle?.condition : 'good',
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
            batteryHealth: 85,
          }),
          
          // Display
          image: finalImage,
          images: [finalImage].filter(Boolean), // Array for modal
          tag: post.featured ? 'Nổi bật' : 
               post.postType === 'Direct' ? 'Trực tiếp' : 'Hỗ trợ',
          inStock: post.status?.toUpperCase() === 'APPROVED',
          
          // Seller info
          membershipLevel: post.member?.packageId || 1,
          rating: post.member?.rating || 4.5,
          reviews: 0,
          seller: {
            name: post.member?.fullName || "Người bán",
            avatar: post.member?.avatarUrl,
          },
        };
      });
      // Apply frontend filters
      let filteredProducts = transformedProducts;
      
      // Search filter
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.model?.toLowerCase().includes(query)
        );
        console.log(`🔍 After search filter "${searchQuery}": ${filteredProducts.length}`);
      }
      
      // Price range filter
      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(product =>
          product.price >= filters.priceRange[0] && 
          product.price <= filters.priceRange[1]
        );
        console.log(`💰 After price filter: ${filteredProducts.length}`);
      }
      
      // Capacity range filter
      if (filters.capacityRange) {
        filteredProducts = filteredProducts.filter(product =>
          product.capacity >= filters.capacityRange[0] && 
          product.capacity <= filters.capacityRange[1]
        );
        console.log(`🔋 After capacity filter: ${filteredProducts.length}`);
      }
      
      // Brand filter
      if (filters.brands && filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          filters.brands.includes(product.brand)
        );
        console.log(`🏷️ After brand filter: ${filteredProducts.length}`);
      }
      
      // Condition filter
      if (filters.conditions && filters.conditions.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          filters.conditions.includes(product.condition)
        );
        console.log(`⚙️ After condition filter: ${filteredProducts.length}`);
      }
      
      // Category filter (battery/vehicle)
      if (filters.categories && filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          filters.categories.includes(product.category)
        );
        console.log(`� After category filter: ${filteredProducts.length}`);
      }
      
      // In stock only filter
      if (filters.inStockOnly) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
        console.log(`✅ After inStock filter: ${filteredProducts.length}`);
      }
      
      // Apply sorting
      if (sortBy === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'newest') {
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
      
      console.log(`🎯 Final filtered products: ${filteredProducts.length}`);

      setProducts(filteredProducts);
      setTotal(filteredProducts.length);
      
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      message.error("Không thể tải sản phẩm. Vui lòng thử lại!");
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const formatPostedDate = (date) => {
    if (!date) return "Mới đăng";
    const diff = (Date.now() - new Date(date)) / 60000;
    if (diff < 60) return `${Math.floor(diff)} phút trước`;
    if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
    return `${Math.floor(diff / 1440)} ngày trước`;
  };

  const handleSearch = (v) => {
    setSearchQuery(v);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (f) => {
    setFilters(f);
    setCurrentPage(1);
  };
  
  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 99999999999],
      capacityRange: [0, 100],
      brands: [],
      conditions: [],
      locations: [],
      categories: [],
      warranty: "all",
      inStockOnly: false,
    });
    setSearchQuery("");
    setCurrentPage(1);
  };
  
  // Handle product detail modal
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };
  
  // Handle contact modal
  const handleContactVehicle = (product) => {
    setContactProduct(product);
    setContactModalVisible(true);
  };

  return (
    <>
      <Header />
      {console.log('RENDER ProductsPage - products length:', products?.length, 'total:', total, 'loading:', loading)}
      <div className={styles.productsPage}>
        <div className={styles.container}>
          <Breadcrumb className={styles.breadcrumb}>
            <Breadcrumb.Item href="/">
              <HomeOutlined /> Trang chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
          </Breadcrumb>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Sàn Giao Dịch Pin Xe Điện</h1>
            <p className={styles.pageSubtitle}>
              Tìm pin xe điện đã qua sử dụng hoàn hảo cho xe của bạn
            </p>
          </div>

          <div className={styles.searchSection}>
            <h3>
              <SearchOutlined /> Tìm kiếm sản phẩm
            </h3>
            <Search
              placeholder="Tìm theo thương hiệu, model..."
              enterButton="Tìm kiếm"
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={6}>
              <ProductFilters
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </Col>
            <Col xs={24} lg={18}>
              <ProductGrid
                products={products}
                loading={loading}
                total={total}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onViewDetails={handleViewDetails}
                onAddToCart={console.log}
                onContactVehicle={handleContactVehicle}
              />
            </Col>
          </Row>

          <FAQSection />
        </div>
      </div>
      <Footer />

      <ProductDetailModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={() => setModalVisible(false)}
      />
      <ContactVehicleModal
        visible={contactModalVisible}
        product={contactProduct}
        onClose={() => setContactModalVisible(false)}
      />
    </>
  );
};

export default Products;
