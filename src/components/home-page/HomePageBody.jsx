import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Space,
  Divider,
  Input,
  Select,
  Badge,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  RocketOutlined,
  CustomerServiceOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  StarFilled,
} from "@ant-design/icons";
import "./index.css";

const { Search } = Input;
const { Option } = Select;

const HomePageBody = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mock data cho sản phẩm pin xe điện
  const products = [
    {
      id: 1,
      name: "Pin Tesla Model 3 - 75kWh",
      price: 204000000, // 8,500 USD * 24,000
      originalPrice: 288000000, // 12,000 USD * 24,000
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=500",
      capacity: "75 kWh",
      voltage: "350V",
      condition: "Xuất sắc",
      warranty: "2 Năm",
      rating: 4.8,
      reviews: 124,
      discount: "-29%",
      tag: "Bán chạy nhất",
      tagColor: "gold",
    },
    {
      id: 2,
      name: "Pin Nissan Leaf - 40kWh",
      price: 100800000, // 4,200 USD * 24,000
      originalPrice: 156000000, // 6,500 USD * 24,000
      image: "https://images.unsplash.com/photo-1620943387734-e6e0b9a0e8e3?w=500",
      capacity: "40 kWh",
      voltage: "360V",
      condition: "Tốt",
      warranty: "1 Năm",
      rating: 4.5,
      reviews: 89,
      discount: "-35%",
      tag: "Giảm giá sốc",
      tagColor: "red",
    },
    {
      id: 3,
      name: "Pin BMW i3 Dung lượng cao - 42kWh",
      price: 139200000, // 5,800 USD * 24,000
      originalPrice: 196800000, // 8,200 USD * 24,000
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500",
      capacity: "42 kWh",
      voltage: "355V",
      condition: "Xuất sắc",
      warranty: "18 Tháng",
      rating: 4.7,
      reviews: 67,
      discount: "-29%",
      tag: "Cao cấp",
      tagColor: "purple",
    },
    {
      id: 4,
      name: "Pin Chevrolet Bolt EV - 66kWh",
      price: 172800000, // 7,200 USD * 24,000
      originalPrice: 252000000, // 10,500 USD * 24,000
      image: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=500",
      capacity: "66 kWh",
      voltage: "400V",
      condition: "Rất tốt",
      warranty: "2 Năm",
      rating: 4.6,
      reviews: 95,
      discount: "-31%",
      tag: "Nổi bật",
      tagColor: "blue",
    },
    {
      id: 5,
      name: "Pin Hyundai Kona Electric - 64kWh",
      price: 165600000, // 6,900 USD * 24,000
      originalPrice: 235200000, // 9,800 USD * 24,000
      image: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=500",
      capacity: "64 kWh",
      voltage: "375V",
      condition: "Xuất sắc",
      warranty: "2 Năm",
      rating: 4.9,
      reviews: 142,
      discount: "-30%",
      tag: "Đánh giá cao",
      tagColor: "green",
    },
    {
      id: 6,
      name: "Pin Volkswagen ID.4 - 82kWh",
      price: 225600000, // 9,400 USD * 24,000
      originalPrice: 316800000, // 13,200 USD * 24,000
      image: "https://images.unsplash.com/photo-1612544409025-2c41f06d5db7?w=500",
      capacity: "82 kWh",
      voltage: "408V",
      condition: "Xuất sắc",
      warranty: "3 Năm",
      rating: 4.8,
      reviews: 78,
      discount: "-29%",
      tag: "Hàng mới về",
      tagColor: "cyan",
    },
  ];

  // Statistics data
  const stats = [
    { number: "5,000+", label: "Pin đã bán", icon: <ThunderboltOutlined /> },
    { number: "98%", label: "Khách hàng hài lòng", icon: <TrophyOutlined /> },
    { number: "2-3 Năm", label: "Bảo hành", icon: <SafetyOutlined /> },
    { number: "24/7", label: "Hỗ trợ khách hàng", icon: <CustomerServiceOutlined /> },
  ];

  // Categories
  const categories = [
    { name: "Pin Tesla", count: "250+ sản phẩm", icon: "⚡", color: "#ff4757" },
    { name: "Pin Nissan", count: "180+ sản phẩm", icon: "🔋", color: "#5352ed" },
    { name: "Pin BMW", count: "120+ sản phẩm", icon: "🚗", color: "#00d2d3" },
    { name: "Pin Chevrolet", count: "95+ sản phẩm", icon: "⚙️", color: "#ffa502" },
  ];

  // Features
  const features = [
    {
      icon: <SafetyOutlined />,
      title: "Chất lượng đảm bảo",
      description: "Tất cả pin đều được kiểm tra kỹ lưỡng và chứng nhận về an toàn và hiệu suất.",
    },
    {
      icon: <RocketOutlined />,
      title: "Giao hàng nhanh",
      description: "Vận chuyển nhanh chóng và an toàn đến địa điểm của bạn trong 3-5 ngày làm việc.",
    },
    {
      icon: <CustomerServiceOutlined />,
      title: "Hỗ trợ chuyên nghiệp",
      description: "Dịch vụ khách hàng 24/7 sẵn sàng giải đáp mọi thắc mắc của bạn.",
    },
    {
      icon: <TrophyOutlined />,
      title: "Giá tốt nhất",
      description: "Giá cả cạnh tranh với các ưu đãi và giảm giá thường xuyên cho sản phẩm chất lượng.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 className="hero-title">Sàn Giao Dịch Pin Xe Điện Đã Qua Sử Dụng</h1>
          <p className="hero-subtitle">
            Tìm kiếm pin xe điện đã qua sử dụng chất lượng cao, được chứng nhận với giá cả tốt nhất
          </p>
          <Space size="large">
            <Button type="primary" size="large" icon={<ShoppingCartOutlined />}>
              Xem sản phẩm
            </Button>
            <Button size="large" style={{ background: "white", color: "#667eea" }}>
              Tìm hiểu thêm
            </Button>
          </Space>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <div className="stat-card">
                  <div style={{ fontSize: 40, color: "#1890ff", marginBottom: 12 }}>
                    {stat.icon}
                  </div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title">Pin nổi bật</h2>
            <p className="section-subtitle">
              Khám phá bộ sưu tập pin xe điện đã qua sử dụng được chứng nhận
            </p>
          </div>

          {/* Filters */}
          <Row gutter={16} style={{ marginBottom: 32 }}>
            <Col xs={24} md={12} lg={8}>
              <Search
                placeholder="Tìm kiếm pin..."
                size="large"
                enterButton="Tìm"
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Select
                placeholder="Dung lượng"
                size="large"
                style={{ width: "100%" }}
              >
                <Option value="40">40-50 kWh</Option>
                <Option value="50">50-70 kWh</Option>
                <Option value="70">70+ kWh</Option>
              </Select>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Select
                placeholder="Tình trạng"
                size="large"
                style={{ width: "100%" }}
              >
                <Option value="excellent">Xuất sắc</Option>
                <Option value="good">Tốt</Option>
                <Option value="fair">Khá</Option>
              </Select>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Select
                placeholder="Sắp xếp"
                size="large"
                style={{ width: "100%" }}
                defaultValue="featured"
              >
                <Option value="featured">Nổi bật</Option>
                <Option value="price-low">Giá: Thấp đến cao</Option>
                <Option value="price-high">Giá: Cao đến thấp</Option>
                <Option value="rating">Đánh giá cao nhất</Option>
              </Select>
            </Col>
          </Row>

          {/* Product Grid */}
          <Row gutter={[24, 24]}>
            {products.map((product) => (
              <Col xs={24} sm={12} lg={8} key={product.id}>
                <Badge.Ribbon text={product.tag} color={product.tagColor}>
                  <Card
                    className="product-card"
                    cover={
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <img alt={product.name} src={product.image} />
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            background: "rgba(255, 255, 255, 0.95)",
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontWeight: "bold",
                            color: "#52c41a",
                            fontSize: 14,
                          }}
                        >
                          {product.discount}
                        </div>
                      </div>
                    }
                    actions={[
                      <Button
                        type="link"
                        icon={<HeartOutlined />}
                        key="wishlist"
                      >
                        Lưu
                      </Button>,
                      <Button type="link" icon={<EyeOutlined />} key="view">
                        Xem
                      </Button>,
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        key="buy"
                      >
                        Mua ngay
                      </Button>,
                    ]}
                    onMouseEnter={() => setHoveredCard(product.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="product-title">{product.name}</div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <Space size={4}>
                        {[...Array(5)].map((_, index) => (
                          <StarFilled
                            key={index}
                            style={{
                              color: index < Math.floor(product.rating) ? "#faad14" : "#d9d9d9",
                              fontSize: 14,
                            }}
                          />
                        ))}
                        <span style={{ color: "#8c8c8c", fontSize: 14 }}>
                          ({product.reviews})
                        </span>
                      </Space>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <Space>
                        <span className="product-price">{product.price.toLocaleString('vi-VN')} ₫</span>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "#8c8c8c",
                            fontSize: 16,
                          }}
                        >
                          {product.originalPrice.toLocaleString('vi-VN')} ₫
                        </span>
                      </Space>
                    </div>

                    <div className="product-specs">
                      <div className="spec-item">
                        <ThunderboltOutlined className="spec-icon" />
                        <span>Dung lượng: {product.capacity}</span>
                      </div>
                      <div className="spec-item">
                        <SafetyOutlined className="spec-icon" />
                        <span>Điện áp: {product.voltage}</span>
                      </div>
                      <div className="spec-item">
                        <ClockCircleOutlined className="spec-icon" />
                        <span>Bảo hành: {product.warranty}</span>
                      </div>
                    </div>

                    <Tag color={product.condition === "Xuất sắc" ? "green" : "blue"}>
                      Tình trạng {product.condition}
                    </Tag>
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Button type="primary" size="large">
              Xem tất cả sản phẩm
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title">Mua sắm theo thương hiệu</h2>
            <p className="section-subtitle">
              Tìm pin từ các thương hiệu xe điện yêu thích của bạn
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {categories.map((category, index) => (
              <Col xs={12} sm={12} lg={6} key={index}>
                <div className="category-card">
                  <div
                    className="category-icon"
                    style={{ color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="category-name">{category.name}</div>
                  <div className="category-count">{category.count}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title">Tại sao chọn chúng tôi</h2>
            <p className="section-subtitle">
              Chúng tôi cung cấp dịch vụ tốt nhất cho nhu cầu pin xe điện của bạn
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-title">{feature.title}</div>
                  <div className="feature-description">{feature.description}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 className="cta-title">Sẵn sàng tìm kiếm pin hoàn hảo?</h2>
          <p className="cta-subtitle">
            Tham gia cùng hàng nghìn khách hàng hài lòng đã nâng cấp xe điện với pin được chứng nhận của chúng tôi
          </p>
          <Space size="large">
            <Button type="default" size="large" style={{ background: "white", color: "#1890ff" }}>
              Bắt đầu ngay
            </Button>
            <Button size="large" ghost>
              Liên hệ chúng tôi
            </Button>
          </Space>
        </div>
      </section>
    </div>
  );
};

export default HomePageBody;
