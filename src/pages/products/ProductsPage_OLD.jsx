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
      
      // Transform API response to match frontend product structure
      const transformedProducts = response.data.map(post => ({
        id: post.postId,
        name: post.title,
        brand: post.battery?.batteryModel?.brand || post.vehicle?.vehicleModel?.brand || 'Unknown',
        capacity: post.battery?.batteryModel?.capacity || post.vehicle?.vehicleModel?.batteryCapacity || 0,
        voltage: post.battery?.batteryModel?.voltage || post.vehicle?.vehicleModel?.voltage || 0,
        warranty: post.battery?.warrantyMonths || post.vehicle?.warrantyMonths || 0,
        condition: post.battery?.condition || post.vehicle?.condition || 'Good',
        price: post.price,
        originalPrice: post.originalPrice || post.price,
        rating: post.member?.rating || 4.0,
        reviews: post.reviewCount || 0,
        image: post.imageUrl || post.battery?.imageUrl || post.vehicle?.imageUrl || 'https://via.placeholder.com/400x300',
        tag: post.postType === 'DirectSale' ? 'Bán trực tiếp' : 'Yêu cầu hỗ trợ',
        membershipLevel: post.member?.packageId || 0,
        inStock: post.status === 'Available',
        category: post.battery ? 'battery' : post.vehicle?.vehicleModel?.vehicleType === 'Motorcycle' ? 'motorcycle' : 'car',
        description: post.description,
        seller: {
          name: post.member?.fullName || 'Unknown',
          avatar: post.member?.avatar,
          rating: post.member?.rating || 4.0,
          totalSales: post.member?.totalSales || 0,
        },
        batteryHealth: post.battery?.batteryHealth || post.vehicle?.batteryHealth || 90,
        usageYears: post.battery?.usageYears || post.vehicle?.usageYears || 0,
        location: post.member?.address || 'TP. Hồ Chí Minh',
        postedDate: formatPostedDate(post.createdAt),
      }));

      setProducts(transformedProducts);
      setTotal(response.totalCount || transformedProducts.length);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
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
      rating: 4.6,
      reviews: 134,
      image:
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 20,
      description: "Pin Nissan Leaf e+, dung lượng mở rộng",
    },
    {
      id: 7,
      name: "Pin Nissan Ariya - 87kWh AWD",
      brand: "Nissan",
      capacity: 87,
      voltage: 380,
      warranty: 3,
      condition: "Xuất sắc",
      price: 192000000, // 8,000 USD
      originalPrice: 228000000, // 9,500 USD
      rating: 4.7,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 16,
      description: "Pin Nissan Ariya mới nhất, công nghệ tiên tiến",
    },
    {
      id: 8,
      name: "Pin Nissan Leaf - 30kWh (2016-2017)",
      brand: "Nissan",
      capacity: 30,
      voltage: 350,
      warranty: 1,
      condition: "Khá",
      price: 72000000, // 3,000 USD
      originalPrice: 96000000, // 4,000 USD
      rating: 4.2,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=400&h=300&fit=crop",
      tag: "Đồng",
      membershipLevel: 1,
      inStock: true,
      discount: 25,
      description: "Pin Nissan Leaf đời cũ, giá kinh tế",
    },

    // BMW Batteries
    {
      id: 9,
      name: "Pin BMW i3 - 42kWh (120Ah)",
      brand: "BMW",
      capacity: 42,
      voltage: 353,
      warranty: 2,
      condition: "Rất tốt",
      price: 120000000, // 5,000 USD
      originalPrice: 144000000, // 6,000 USD
      rating: 4.5,
      reviews: 112,
      image:
        "https://images.unsplash.com/photo-1617886322168-72b886573c35?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 17,
      description: "Pin BMW i3 120Ah, chất lượng Đức",
    },
    {
      id: 10,
      name: "Pin BMW iX3 - 80kWh",
      brand: "BMW",
      capacity: 80,
      voltage: 400,
      warranty: 3,
      condition: "Xuất sắc",
      price: 216000000, // 9,000 USD
      originalPrice: 252000000, // 10,500 USD
      rating: 4.8,
      reviews: 87,
      image:
        "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 14,
      description: "Pin BMW iX3 thế hệ mới, hiệu suất cao",
    },
    {
      id: 11,
      name: "Pin BMW i4 eDrive40 - 83.9kWh",
      brand: "BMW",
      capacity: 84,
      voltage: 399,
      warranty: 2,
      condition: "Xuất sắc",
      price: 228000000, // 9,500 USD
      originalPrice: 264000000, // 11,000 USD
      rating: 4.7,
      reviews: 94,
      image:
        "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 14,
      description: "Pin BMW i4, công nghệ pin tiên tiến",
    },
    {
      id: 12,
      name: "Pin BMW iX xDrive50 - 105kWh",
      brand: "BMW",
      capacity: 105,
      voltage: 396,
      warranty: 3,
      condition: "Xuất sắc",
      price: 312000000, // 13,000 USD
      originalPrice: 360000000, // 15,000 USD
      rating: 4.9,
      reviews: 76,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: false,
      discount: 13,
      description: "Pin BMW iX cao cấp nhất, dung lượng lớn",
    },

    // Chevrolet Batteries
    {
      id: 13,
      name: "Pin Chevrolet Bolt EV - 60kWh",
      brand: "Chevrolet",
      capacity: 60,
      voltage: 360,
      warranty: 2,
      condition: "Tốt",
      price: 132000000, // 5,500 USD
      originalPrice: 168000000, // 7,000 USD
      rating: 4.3,
      reviews: 145,
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
      tag: "Bạc",
      membershipLevel: 2,
      inStock: true,
      discount: 21,
      description: "Pin Chevrolet Bolt EV, phổ biến tại Mỹ",
    },
    {
      id: 14,
      name: "Pin Chevrolet Bolt EUV - 65kWh",
      brand: "Chevrolet",
      capacity: 65,
      voltage: 360,
      warranty: 2,
      condition: "Rất tốt",
      price: 144000000, // 6,000 USD
      originalPrice: 180000000, // 7,500 USD
      rating: 4.5,
      reviews: 118,
      image:
        "https://images.unsplash.com/photo-1583267746897-f815a5135c93?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 20,
      description: "Pin Chevrolet Bolt EUV, phiên bản nâng cấp",
    },
    {
      id: 15,
      name: "Pin Chevrolet Blazer EV - 85kWh",
      brand: "Chevrolet",
      capacity: 85,
      voltage: 400,
      warranty: 3,
      condition: "Xuất sắc",
      price: 204000000, // 8,500 USD
      originalPrice: 240000000, // 10,000 USD
      rating: 4.6,
      reviews: 67,
      image:
        "https://images.unsplash.com/photo-1619976215249-10f97b5bfd25?w=400&h=300&fit=crop",
      tag: "Bạc",
      membershipLevel: 2,
      inStock: true,
      discount: 15,
      description: "Pin Chevrolet Blazer EV, SUV điện mạnh mẽ",
    },

    // Hyundai Batteries
    {
      id: 16,
      name: "Pin Hyundai Kona Electric - 64kWh",
      brand: "Hyundai",
      capacity: 64,
      voltage: 356,
      warranty: 2,
      condition: "Rất tốt",
      price: 144000000, // 6,000 USD
      originalPrice: 180000000, // 7,500 USD
      rating: 4.5,
      reviews: 178,
      image:
        "https://images.unsplash.com/photo-1614455427737-89610fc1b6b7?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 20,
      description: "Pin Hyundai Kona Electric, phổ biến và đáng tin cậy",
    },
    {
      id: 17,
      name: "Pin Hyundai Ioniq 5 - 72.6kWh Standard Range",
      brand: "Hyundai",
      capacity: 73,
      voltage: 697,
      warranty: 3,
      condition: "Xuất sắc",
      price: 168000000, // 7,000 USD
      originalPrice: 204000000, // 8,500 USD
      rating: 4.7,
      reviews: 142,
      image:
        "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 18,
      description: "Pin Hyundai Ioniq 5, sạc nhanh 800V",
    },
    {
      id: 18,
      name: "Pin Hyundai Ioniq 5 - 77.4kWh Long Range",
      brand: "Hyundai",
      capacity: 77,
      voltage: 697,
      warranty: 3,
      condition: "Xuất sắc",
      price: 192000000, // 8,000 USD
      originalPrice: 228000000, // 9,500 USD
      rating: 4.8,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1617469767319-c3eabadd2d59?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 16,
      description: "Pin Hyundai Ioniq 5 Long Range, công nghệ 800V",
    },
    {
      id: 19,
      name: "Pin Hyundai Ioniq 6 - 77.4kWh",
      brand: "Hyundai",
      capacity: 77,
      voltage: 697,
      warranty: 3,
      condition: "Xuất sắc",
      price: 204000000, // 8,500 USD
      originalPrice: 240000000, // 10,000 USD
      rating: 4.8,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1619976347725-791b22dfac34?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 15,
      description: "Pin Hyundai Ioniq 6, sedan điện hiệu suất cao",
    },

    // Volkswagen Batteries
    {
      id: 20,
      name: "Pin VW ID.4 - 77kWh Pro",
      brand: "VW",
      capacity: 77,
      voltage: 408,
      warranty: 2,
      condition: "Rất tốt",
      price: 180000000, // 7,500 USD
      originalPrice: 216000000, // 9,000 USD
      rating: 4.6,
      reviews: 134,
      image:
        "https://images.unsplash.com/photo-1614455427737-89610fc1b6b7?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 17,
      description: "Pin VW ID.4, SUV điện phổ biến tại châu Âu",
    },
    {
      id: 21,
      name: "Pin VW ID.3 - 58kWh Pure",
      brand: "VW",
      capacity: 58,
      voltage: 408,
      warranty: 2,
      condition: "Tốt",
      price: 132000000, // 5,500 USD
      originalPrice: 168000000, // 7,000 USD
      rating: 4.4,
      reviews: 167,
      image:
        "https://images.unsplash.com/photo-1617469767319-c3eabadd2d59?w=400&h=300&fit=crop",
      tag: "Đồng",
      membershipLevel: 1,
      inStock: true,
      discount: 21,
      description: "Pin VW ID.3 Pure, compact và tiết kiệm",
    },
    {
      id: 22,
      name: "Pin VW ID.3 - 77kWh Pro S",
      brand: "VW",
      capacity: 77,
      voltage: 408,
      warranty: 2,
      condition: "Xuất sắc",
      price: 168000000, // 7,000 USD
      originalPrice: 204000000, // 8,500 USD
      rating: 4.7,
      reviews: 123,
      image:
        "https://images.unsplash.com/photo-1617469767319-c3eabadd2d59?w=400&h=300&fit=crop",
      tag: "Bạc",
      membershipLevel: 2,
      inStock: true,
      discount: 18,
      description: "Pin VW ID.3 Pro S, dung lượng cao",
    },
    {
      id: 23,
      name: "Pin VW ID.Buzz - 82kWh",
      brand: "VW",
      capacity: 82,
      voltage: 408,
      warranty: 3,
      condition: "Xuất sắc",
      price: 216000000, // 9,000 USD
      originalPrice: 252000000, // 10,500 USD
      rating: 4.8,
      reviews: 78,
      image:
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop",
      tag: "Bạc",
      membershipLevel: 2,
      inStock: true,
      discount: 14,
      description: "Pin VW ID.Buzz, xe van điện đa năng",
    },

    // More Tesla
    {
      id: 24,
      name: "Pin Tesla Model 3 - 60kWh Standard Range",
      brand: "Tesla",
      capacity: 60,
      voltage: 350,
      warranty: 1,
      condition: "Tốt",
      price: 168000000, // 7,000 USD
      originalPrice: 204000000, // 8,500 USD
      rating: 4.5,
      reviews: 189,
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
      tag: "Đồng",
      membershipLevel: 1,
      inStock: true,
      discount: 18,
      description: "Pin Tesla Model 3 Standard Range, giá tốt",
    },

    // More Nissan
    {
      id: 25,
      name: "Pin Nissan e-NV200 - 40kWh",
      brand: "Nissan",
      capacity: 40,
      voltage: 360,
      warranty: 1,
      condition: "Khá",
      price: 84000000, // 3,500 USD
      originalPrice: 108000000, // 4,500 USD
      rating: 4.1,
      reviews: 94,
      image:
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop",
      tag: "Đồng",
      membershipLevel: 1,
      inStock: true,
      discount: 22,
      description: "Pin Nissan e-NV200, van điện thương mại",
    },

    // More BMW
    {
      id: 26,
      name: "Pin BMW i3 - 33kWh (94Ah)",
      brand: "BMW",
      capacity: 33,
      voltage: 353,
      warranty: 1,
      condition: "Tốt",
      price: 96000000, // 4,000 USD
      originalPrice: 120000000, // 5,000 USD
      rating: 4.3,
      reviews: 167,
      image:
        "https://images.unsplash.com/photo-1617886322168-72b886573c35?w=400&h=300&fit=crop",
      tag: "Đồng",
      membershipLevel: 1,
      inStock: true,
      discount: 20,
      description: "Pin BMW i3 94Ah, đời đầu tiên",
    },

    // More Chevrolet
    {
      id: 27,
      name: "Pin Chevrolet Silverado EV - 200kWh",
      brand: "Chevrolet",
      capacity: 200,
      voltage: 400,
      warranty: 3,
      condition: "Xuất sắc",
      price: 336000000, // 14,000 USD
      originalPrice: null,
      rating: 4.9,
      reviews: 45,
      image:
        "https://images.unsplash.com/photo-1619976215249-10f97b5bfd25?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: false,
      discount: null,
      description: "Pin Chevrolet Silverado EV, dung lượng khủng",
    },

    // More Hyundai
    {
      id: 28,
      name: "Pin Hyundai Kona Electric - 39.2kWh",
      brand: "Hyundai",
      capacity: 39,
      voltage: 356,
      warranty: 1,
      condition: "Tốt",
      price: 108000000, // 4,500 USD
      originalPrice: 132000000, // 5,500 USD
      rating: 4.3,
      reviews: 203,
      image:
        "https://images.unsplash.com/photo-1614455427737-89610fc1b6b7?w=400&h=300&fit=crop",
      tag: "Đồng",
      membershipLevel: 1,
      inStock: true,
      discount: 18,
      description: "Pin Hyundai Kona Electric Standard, giá phải chăng",
    },
    {
      id: 29,
      name: "Pin Hyundai Ioniq Electric - 38.3kWh",
      brand: "Hyundai",
      capacity: 38,
      voltage: 360,
      warranty: 1,
      condition: "Khá",
      price: 96000000, // 4,000 USD
      originalPrice: 120000000, // 5,000 USD
      rating: 4.2,
      reviews: 178,
      image:
        "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=300&fit=crop",
      tag: "Đồng",
      membershipLevel: 1,
      inStock: true,
      discount: 20,
      description: "Pin Hyundai Ioniq Electric, sedan compact",
    },

    // More VW
    {
      id: 30,
      name: "Pin VW e-Golf - 35.8kWh",
      brand: "VW",
      capacity: 36,
      voltage: 323,
      warranty: 1,
      condition: "Khá",
      price: 84000000, // 3,500 USD
      originalPrice: 108000000, // 4,500 USD
      rating: 4.0,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop",
      tag: "Đồng",
      membershipLevel: 1,
      inStock: true,
      discount: 22,
      description: "Pin VW e-Golf, thế hệ đầu tiên",
    },

    // Additional brands - Audi
    {
      id: 31,
      name: "Pin Audi e-tron - 95kWh",
      brand: "Audi",
      capacity: 95,
      voltage: 396,
      warranty: 3,
      condition: "Xuất sắc",
      price: 252000000, // 10,500 USD
      originalPrice: 300000000, // 12,500 USD
      rating: 4.8,
      reviews: 112,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 16,
      description: "Pin Audi e-tron, SUV điện sang trọng",
    },
    {
      id: 32,
      name: "Pin Audi Q4 e-tron - 82kWh",
      brand: "Audi",
      capacity: 82,
      voltage: 396,
      warranty: 2,
      condition: "Xuất sắc",
      price: 204000000, // 8,500 USD
      originalPrice: 240000000, // 10,000 USD
      rating: 4.7,
      reviews: 98,
      image:
        "https://images.unsplash.com/photo-1614455427737-89610fc1b6b7?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 15,
      description: "Pin Audi Q4 e-tron, compact SUV cao cấp",
    },

    // Ford
    {
      id: 33,
      name: "Pin Ford Mustang Mach-E - 88kWh Extended Range",
      brand: "Ford",
      capacity: 88,
      voltage: 376,
      warranty: 2,
      condition: "Xuất sắc",
      price: 216000000, // 9,000 USD
      originalPrice: 252000000, // 10,500 USD
      rating: 4.7,
      reviews: 145,
      image:
        "https://images.unsplash.com/photo-1619976347725-791b22dfac34?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 14,
      description: "Pin Ford Mustang Mach-E, SUV thể thao điện",
    },
    {
      id: 34,
      name: "Pin Ford F-150 Lightning - 131kWh Extended Range",
      brand: "Ford",
      capacity: 131,
      voltage: 400,
      warranty: 3,
      condition: "Xuất sắc",
      price: 288000000, // 12,000 USD
      originalPrice: 336000000, // 14,000 USD
      rating: 4.8,
      reviews: 87,
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 14,
      description: "Pin Ford F-150 Lightning, bán tải điện mạnh mẽ",
    },

    // Kia
    {
      id: 35,
      name: "Pin Kia EV6 - 77.4kWh Long Range",
      brand: "Kia",
      capacity: 77,
      voltage: 697,
      warranty: 3,
      condition: "Xuất sắc",
      price: 192000000, // 8,000 USD
      originalPrice: 228000000, // 9,500 USD
      rating: 4.8,
      reviews: 167,
      image:
        "https://images.unsplash.com/photo-1617469767319-c3eabadd2d59?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 16,
      description: "Pin Kia EV6, công nghệ 800V sạc siêu nhanh",
    },
    {
      id: 36,
      name: "Pin Kia Niro EV - 64kWh",
      brand: "Kia",
      capacity: 64,
      voltage: 356,
      warranty: 2,
      condition: "Rất tốt",
      price: 144000000, // 6,000 USD
      originalPrice: 180000000, // 7,500 USD
      rating: 4.5,
      reviews: 189,
      image:
        "https://images.unsplash.com/photo-1614455427737-89610fc1b6b7?w=400&h=300&fit=crop",
      tag: "Bạc",
      membershipLevel: 2,
      inStock: true,
      discount: 20,
      description: "Pin Kia Niro EV, crossover điện thực dụng",
    },

    // Mercedes-Benz
    {
      id: 37,
      name: "Pin Mercedes EQS - 107.8kWh",
      brand: "Mercedes-Benz",
      capacity: 108,
      voltage: 396,
      warranty: 3,
      condition: "Xuất sắc",
      price: 312000000, // 13,000 USD
      originalPrice: 360000000, // 15,000 USD
      rating: 4.9,
      reviews: 76,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: false,
      discount: 13,
      description: "Pin Mercedes EQS, sedan điện sang trọng nhất",
    },
    {
      id: 38,
      name: "Pin Mercedes EQC - 80kWh",
      brand: "Mercedes-Benz",
      capacity: 80,
      voltage: 408,
      warranty: 2,
      condition: "Rất tốt",
      price: 204000000, // 8,500 USD
      originalPrice: 240000000, // 10,000 USD
      rating: 4.6,
      reviews: 94,
      image:
        "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 15,
      description: "Pin Mercedes EQC, SUV điện hạng sang",
    },

    // Porsche
    {
      id: 39,
      name: "Pin Porsche Taycan - 93.4kWh Performance Battery Plus",
      brand: "Porsche",
      capacity: 93,
      voltage: 800,
      warranty: 3,
      condition: "Xuất sắc",
      price: 288000000, // 12,000 USD
      originalPrice: 336000000, // 14,000 USD
      rating: 4.9,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1619976347725-791b22dfac34?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 14,
      description: "Pin Porsche Taycan, hiệu suất thể thao tối đa",
    },

    // Polestar
    {
      id: 40,
      name: "Pin Polestar 2 - 78kWh Long Range",
      brand: "Polestar",
      capacity: 78,
      voltage: 400,
      warranty: 2,
      condition: "Xuất sắc",
      price: 192000000, // 8,000 USD
      originalPrice: 228000000, // 9,500 USD
      rating: 4.7,
      reviews: 112,
      image:
        "https://images.unsplash.com/photo-1617469767319-c3eabadd2d59?w=400&h=300&fit=crop",
      tag: "Bạc",
      membershipLevel: 2,
      inStock: true,
      discount: 16,
      description: "Pin Polestar 2, sedan điện Thụy Điển cao cấp",
    },

    // Rivian
    {
      id: 41,
      name: "Pin Rivian R1T - 135kWh Large Pack",
      brand: "Rivian",
      capacity: 135,
      voltage: 400,
      warranty: 3,
      condition: "Xuất sắc",
      price: 300000000, // 12,500 USD
      originalPrice: 348000000, // 14,500 USD
      rating: 4.8,
      reviews: 67,
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: false,
      discount: 14,
      description: "Pin Rivian R1T, bán tải điện adventure",
    },
    {
      id: 42,
      name: "Pin Rivian R1S - 135kWh Large Pack",
      brand: "Rivian",
      capacity: 135,
      voltage: 400,
      warranty: 3,
      condition: "Xuất sắc",
      price: 300000000, // 12,500 USD
      originalPrice: null,
      rating: 4.8,
      reviews: 54,
      image:
        "https://images.unsplash.com/photo-1619976347725-791b22dfac34?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: null,
      description: "Pin Rivian R1S, SUV điện adventure 7 chỗ",
    },

    // Lucid
    {
      id: 43,
      name: "Pin Lucid Air - 112kWh Grand Touring",
      brand: "Lucid",
      capacity: 112,
      voltage: 924,
      warranty: 3,
      condition: "Xuất sắc",
      price: 324000000, // 13,500 USD
      originalPrice: 360000000, // 15,000 USD
      rating: 4.9,
      reviews: 43,
      image:
        "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: false,
      discount: 10,
      description: "Pin Lucid Air, công nghệ pin tiên tiến nhất",
    },

    // MG
    {
      id: 44,
      name: "Pin MG ZS EV - 72.6kWh Long Range",
      brand: "MG",
      capacity: 73,
      voltage: 353,
      warranty: 2,
      condition: "Rất tốt",
      price: 132000000, // 5,500 USD
      originalPrice: 168000000, // 7,000 USD
      rating: 4.4,
      reviews: 145,
      image:
        "https://images.unsplash.com/photo-1614455427737-89610fc1b6b7?w=400&h=300&fit=crop",
      tag: "Bạc",
      membershipLevel: 2,
      inStock: true,
      discount: 21,
      description: "Pin MG ZS EV, SUV điện giá phải chăng",
    },
    {
      id: 45,
      name: "Pin MG4 Electric - 64kWh",
      brand: "MG",
      capacity: 64,
      voltage: 400,
      warranty: 2,
      condition: "Xuất sắc",
      price: 144000000, // 6,000 USD
      originalPrice: 180000000, // 7,500 USD
      rating: 4.6,
      reviews: 98,
      image:
        "https://images.unsplash.com/photo-1617469767319-c3eabadd2d59?w=400&h=300&fit=crop",
      tag: "Bạc",
      membershipLevel: 2,
      inStock: true,
      discount: 20,
      description: "Pin MG4 Electric, hatchback điện hiện đại",
    },

    // BYD
    {
      id: 46,
      name: "Pin BYD Atto 3 - 60.48kWh",
      brand: "BYD",
      capacity: 60,
      voltage: 403,
      warranty: 2,
      condition: "Xuất sắc",
      price: 144000000, // 6,000 USD
      originalPrice: 180000000, // 7,500 USD
      rating: 4.5,
      reviews: 134,
      image:
        "https://images.unsplash.com/photo-1614455427737-89610fc1b6b7?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 20,
      description: "Pin BYD Atto 3, công nghệ Blade Battery an toàn",
    },
    {
      id: 47,
      name: "Pin BYD Seal - 82.56kWh",
      brand: "BYD",
      capacity: 83,
      voltage: 550,
      warranty: 3,
      condition: "Xuất sắc",
      price: 192000000, // 8,000 USD
      originalPrice: 228000000, // 9,500 USD
      rating: 4.7,
      reviews: 87,
      image:
        "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 16,
      description: "Pin BYD Seal, sedan điện công nghệ cao",
    },
    {
      id: 48,
      name: "Pin BYD Han - 85.44kWh",
      brand: "BYD",
      capacity: 85,
      voltage: 550,
      warranty: 3,
      condition: "Xuất sắc",
      price: 204000000, // 8,500 USD
      originalPrice: 240000000, // 10,000 USD
      rating: 4.7,
      reviews: 76,
      image:
        "https://images.unsplash.com/photo-1619976347725-791b22dfac34?w=400&h=300&fit=crop",
      tag: "Bạc",
      membershipLevel: 2,
      inStock: true,
      discount: 15,
      description: "Pin BYD Han, sedan hạng sang Trung Quốc",
    },

    // Xe Máy Điện - Electric Motorcycles
    {
      id: 49,
      name: "Xe Máy Điện VinFast Klara S",
      brand: "VinFast",
      category: "motorcycle", // Thêm category
      capacity: 2.4,
      voltage: 60,
      warranty: 2,
      condition: "Như mới",
      price: 18000000,
      originalPrice: 22000000,
      rating: 4.6,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 18,
      description: "Xe máy điện VinFast Klara S, thiết kế hiện đại, tiết kiệm",
      seller: getRandomSeller(48),
      batteryHealth: 94,
      usageYears: 1,
      location: getRandomLocation(48),
      postedDate: getRandomPostedDate(48),
    },
    {
      id: 50,
      name: "Xe Máy Điện Dat Bike Weaver 200",
      brand: "Dat Bike",
      category: "motorcycle",
      capacity: 2.5,
      voltage: 60,
      warranty: 3,
      condition: "Như mới",
      price: 16500000,
      originalPrice: 20000000,
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 17,
      description:
        "Dat Bike Weaver 200, xe máy điện thông minh Made in Vietnam",
      seller: getRandomSeller(49),
      batteryHealth: 96,
      usageYears: 1,
      location: getRandomLocation(49),
      postedDate: getRandomPostedDate(49),
    },
    {
      id: 51,
      name: "Xe Máy Điện Yadea G5",
      brand: "Yadea",
      category: "motorcycle",
      capacity: 1.8,
      voltage: 48,
      warranty: 2,
      condition: "Tốt",
      price: 12000000,
      originalPrice: 15000000,
      rating: 4.4,
      reviews: 67,
      image:
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 20,
      description: "Yadea G5, xe máy điện phổ thông, giá rẻ",
      seller: getRandomSeller(50),
      batteryHealth: 88,
      usageYears: 2,
      location: getRandomLocation(50),
      postedDate: getRandomPostedDate(50),
    },
    {
      id: 52,
      name: "Xe Máy Điện Pega eSH",
      brand: "Pega",
      category: "motorcycle",
      capacity: 2.2,
      voltage: 60,
      warranty: 2,
      condition: "Rất tốt",
      price: 14500000,
      originalPrice: 18000000,
      rating: 4.5,
      reviews: 78,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 19,
      description: "Pega eSH, thiết kế giống SH, chất lượng tốt",
      seller: getRandomSeller(51),
      batteryHealth: 91,
      usageYears: 2,
      location: getRandomLocation(51),
      postedDate: getRandomPostedDate(51),
    },
    {
      id: 53,
      name: "Xe Máy Điện Dibao Smart",
      brand: "Dibao",
      category: "motorcycle",
      capacity: 1.5,
      voltage: 48,
      warranty: 1,
      condition: "Tốt",
      price: 9500000,
      originalPrice: 12000000,
      rating: 4.2,
      reviews: 45,
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop",
      tag: "Bạc",
      membershipLevel: 2,
      inStock: true,
      discount: 21,
      description: "Dibao Smart, xe máy điện giá rẻ cho sinh viên",
      seller: getRandomSeller(52),
      batteryHealth: 85,
      usageYears: 3,
      location: getRandomLocation(52),
      postedDate: getRandomPostedDate(52),
    },
    {
      id: 54,
      name: "Xe Máy Điện Anbico Ap1518",
      brand: "Anbico",
      category: "motorcycle",
      capacity: 1.6,
      voltage: 48,
      warranty: 1,
      condition: "Tốt",
      price: 8500000,
      originalPrice: 11000000,
      rating: 4.1,
      reviews: 38,
      image:
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=300&fit=crop",
      tag: "Đồng",
      membershipLevel: 1,
      inStock: true,
      discount: 23,
      description: "Anbico Ap1518, xe máy điện cơ bản, phù hợp đi lại ngắn",
      seller: getRandomSeller(53),
      batteryHealth: 82,
      usageYears: 3,
      location: getRandomLocation(53),
      postedDate: getRandomPostedDate(53),
    },

    // Xe Ô Tô Điện - Electric Cars
    {
      id: 55,
      name: "Xe Ô Tô Điện VinFast VF e34",
      brand: "VinFast",
      category: "car",
      capacity: 42,
      voltage: 350,
      warranty: 3,
      condition: "Như mới",
      price: 485000000,
      originalPrice: 590000000,
      rating: 4.7,
      reviews: 145,
      image:
        "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 18,
      description: "VinFast VF e34, SUV điện 5 chỗ, công nghệ hiện đại",
      seller: getRandomSeller(54),
      batteryHealth: 93,
      usageYears: 1,
      location: getRandomLocation(54),
      postedDate: getRandomPostedDate(54),
    },
    {
      id: 56,
      name: "Xe Ô Tô Điện VinFast VF 8",
      brand: "VinFast",
      category: "car",
      capacity: 87,
      voltage: 400,
      warranty: 3,
      condition: "Như mới",
      price: 980000000,
      originalPrice: 1200000000,
      rating: 4.8,
      reviews: 198,
      image:
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 18,
      description: "VinFast VF 8, SUV điện cao cấp, thiết kế sang trọng",
      seller: getRandomSeller(55),
      batteryHealth: 95,
      usageYears: 1,
      location: getRandomLocation(55),
      postedDate: getRandomPostedDate(55),
    },
    {
      id: 57,
      name: "Xe Ô Tô Điện Hyundai Kona Electric",
      brand: "Hyundai",
      category: "car",
      capacity: 64,
      voltage: 356,
      warranty: 2,
      condition: "Rất tốt",
      price: 720000000,
      originalPrice: 850000000,
      rating: 4.6,
      reviews: 112,
      image:
        "https://images.unsplash.com/photo-1619976347725-791b22dfac34?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 15,
      description: "Hyundai Kona Electric, SUV điện phổ thông, tiết kiệm",
      seller: getRandomSeller(56),
      batteryHealth: 90,
      usageYears: 2,
      location: getRandomLocation(56),
      postedDate: getRandomPostedDate(56),
    },
    {
      id: 58,
      name: "Xe Ô Tô Điện Kia EV6",
      brand: "Kia",
      category: "car",
      capacity: 77,
      voltage: 400,
      warranty: 3,
      condition: "Như mới",
      price: 950000000,
      originalPrice: 1150000000,
      rating: 4.9,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1612538498613-4e16a2ad2e89?w=400&h=300&fit=crop",
      tag: "Kim cương",
      membershipLevel: 4,
      inStock: true,
      discount: 17,
      description: "Kia EV6, crossover điện thể thao, công nghệ vượt trội",
      seller: getRandomSeller(57),
      batteryHealth: 94,
      usageYears: 1,
      location: getRandomLocation(57),
      postedDate: getRandomPostedDate(57),
    },
    {
      id: 59,
      name: "Xe Ô Tô Điện MG ZS EV",
      brand: "MG",
      category: "car",
      capacity: 51,
      voltage: 350,
      warranty: 2,
      condition: "Tốt",
      price: 580000000,
      originalPrice: 680000000,
      rating: 4.4,
      reviews: 87,
      image:
        "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 15,
      description: "MG ZS EV, SUV điện giá tốt, phù hợp gia đình",
      seller: getRandomSeller(58),
      batteryHealth: 88,
      usageYears: 2,
      location: getRandomLocation(58),
      postedDate: getRandomPostedDate(58),
    },
    {
      id: 60,
      name: "Xe Ô Tô Điện BYD Atto 3",
      brand: "BYD",
      category: "car",
      capacity: 60,
      voltage: 400,
      warranty: 3,
      condition: "Như mới",
      price: 765000000,
      originalPrice: 900000000,
      rating: 4.7,
      reviews: 134,
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
      tag: "Vàng",
      membershipLevel: 3,
      inStock: true,
      discount: 15,
      description: "BYD Atto 3, crossover điện thông minh, an toàn",
      seller: getRandomSeller(59),
      batteryHealth: 92,
      usageYears: 1,
      location: getRandomLocation(59),
      postedDate: getRandomPostedDate(59),
    },
  ];

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    // Implement search logic
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    // Implement filter logic
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 360000000], // VND: 0 - 360 triệu
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
