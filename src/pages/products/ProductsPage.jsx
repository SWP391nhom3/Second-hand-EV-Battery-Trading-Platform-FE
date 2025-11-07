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

      // NOTE: Backend API doesn't support category filter, so we'll filter on frontend
      // if (filters.categories && filters.categories.length > 0) {
      //   params.categories = filters.categories.join(',');
      // }

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
          id: post.postId,
          name: post.title || "Pin Xe Điện",
          price: post.price || 0,
          originalPrice: post.price ? (post.price * 1.2) : 0, // 20% markup for original
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
          
          // Display info
          image: post.imageUrl || 
                (isBattery ? post.battery.imageUrl : 
                 isVehicle ? post.vehicle.imageUrl : 
                 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400'),
          tag: post.featured ? 'Nổi bật' : 
               post.postType === 'Direct' ? 'Trực tiếp' : 'Hỗ trợ',
          inStock: post.status === 'Active' || post.status === 'Approved',
          
          // Member/Seller info
          membershipLevel: post.member?.packageId || 1,
          rating: post.member?.rating || 4.5,
          reviews: 0, // Not in schema yet
          seller: {
            name: post.member?.fullName || "Người bán",
            avatar: post.member?.avatarUrl,
          },
        };
      });

      // Apply frontend filters (for fields not supported by backend API)
      let filteredProducts = transformedProducts;
      
      // Filter by category (battery/vehicle) - Backend doesn't support this
      if (filters.categories && filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.categories.includes(product.category)
        );
        console.log('🔖 After category filter:', filteredProducts.length);
      }

      setProducts(filtered);
      setTotal(filtered.length);
      message.info(`Đã tải ${filtered.length} sản phẩm`);
    } catch (err) {
      console.error("LỖI API:", err);
      message.error("Không tải được sản phẩm. Kiểm tra backend!");
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
                onViewDetails={setSelectedProduct}
                onAddToCart={console.log}
                onContactVehicle={setContactProduct}
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
