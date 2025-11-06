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

      // ÉP HIỆN TẤT CẢ BÀI: active + approved
      const params = {
        pageNumber: currentPage,
        pageSize: 50,
        status: "active,approved", // QUAN TRỌNG NHẤT
      };

      if (searchQuery) params.search = searchQuery;
      if (filters.priceRange?.[0]) params.minPrice = filters.priceRange[0];
      if (filters.priceRange?.[1] < 99999999999)
        params.maxPrice = filters.priceRange[1];
      if (filters.capacityRange?.[0])
        params.minCapacity = filters.capacityRange[0];
      if (filters.capacityRange?.[1] < 100)
        params.maxCapacity = filters.capacityRange[1];
      if (filters.brands?.length) params.brands = filters.brands.join(",");
      if (filters.conditions?.length)
        params.conditions = filters.conditions.join(",");
      if (filters.locations?.length)
        params.locations = filters.locations.join(",");
      if (filters.warranty && filters.warranty !== "all")
        params.minWarranty = parseInt(filters.warranty);

      // SẮP XẾP
      if (sortBy === "price-asc") {
        params.sortBy = "price";
        params.sortOrder = "asc";
      } else if (sortBy === "price-desc") {
        params.sortBy = "price";
        params.sortOrder = "desc";
      } else if (sortBy === "newest") {
        params.sortBy = "createdAt";
        params.sortOrder = "desc";
      }

      console.log("GỌI API VỚI PARAMS:", params); // DEBUG

      const response = await postService.getPosts(params);
      console.log("API TRẢ VỀ:", response);

      let postsData = [];
      if (Array.isArray(response)) postsData = response;
      else if (response?.data) postsData = response.data;
      else if (response?.items) postsData = response.items;
      else if (response?.posts) postsData = response.posts;
      else postsData = [];

      console.log(`TÌM THẤY ${postsData.length} BÀI ĐĂNG`);

      const transformedProducts = postsData.map((post, i) => {
        const isBattery = !!post.battery;
        const isVehicle = !!post.vehicle;

        // DEBUG: Xem status của từng bài
        if (i < 5) {
          console.log(
            `Bài #${i + 1} | ID: ${post.postId} | Status: "${
              post.status
            }" | Title: ${post.title}`
          );
        }

        return {
          id: post.postId,
          name: post.title || "Pin Xe Điện",
          price: post.price || 0,
          originalPrice: post.price * 1.2,
          image:
            post.imageUrl ||
            (isBattery
              ? post.battery.imageUrl
              : isVehicle
              ? post.vehicle.imageUrl
              : "/placeholder.jpg"),
          tag: post.featured
            ? "Nổi bật"
            : post.postType === "Direct"
            ? "Trực tiếp"
            : "Hỗ trợ",
          inStock: true, // LUÔN HIỆN
          category: isBattery ? "battery" : "vehicle",
          brand: isBattery
            ? post.battery.brand
            : isVehicle
            ? post.vehicle.brand
            : "Unknown",
          capacity: isBattery
            ? post.battery.capacityKWh
            : isVehicle
            ? post.vehicle.batteryCapacity
            : 0,
          status: post.status,
          postedDate: formatPostedDate(post.createdAt),
          seller: {
            name: post.member?.fullName || "Người bán",
            avatar: post.member?.avatarUrl,
          },
        };
      });

      let filtered = transformedProducts;
      if (filters.categories?.length) {
        filtered = filtered.filter((p) =>
          filters.categories.includes(p.category)
        );
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
