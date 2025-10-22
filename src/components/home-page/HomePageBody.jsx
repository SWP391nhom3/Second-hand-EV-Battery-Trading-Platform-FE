import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Badge,
  message,
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
  StarFilled,
} from "@ant-design/icons";
import "./index.css";

const { Search } = Input;
const { Option } = Select;

const HomePageBody = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  // Mock data cho sản phẩm pin xe điện
  const products = [
    {
      id: 1,
      name: "Pin Tesla Model 3 - 75kWh",
      price: 204000000,
      originalPrice: 288000000,
      image:
        "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=500",
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
      price: 100800000,
      originalPrice: 156000000,
      image:
        "https://images.unsplash.com/photo-1620943387734-e6e0b9a0e8e3?w=500",
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
      price: 139200000,
      originalPrice: 196800000,
      image:
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500",
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
      price: 172800000,
      originalPrice: 252000000,
      image:
        "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=500",
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
      price: 165600000,
      originalPrice: 235200000,
      image:
        "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=500",
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
      price: 225600000,
      originalPrice: 316800000,
      image:
        "https://images.unsplash.com/photo-1612544409025-2c41f06d5db7?w=500",
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

  const stats = [
    { number: "5,000+", label: "Pin đã bán", icon: <ThunderboltOutlined /> },
    { number: "98%", label: "Khách hàng hài lòng", icon: <TrophyOutlined /> },
    { number: "2-3 Năm", label: "Bảo hành", icon: <SafetyOutlined /> },
    {
      number: "24/7",
      label: "Hỗ trợ khách hàng",
      icon: <CustomerServiceOutlined />,
    },
  ];

  const features = [
    {
      icon: <SafetyOutlined />,
      title: "Chất lượng đảm bảo",
      description:
        "Tất cả pin đều được kiểm tra kỹ lưỡng và chứng nhận về an toàn và hiệu suất.",
    },
    {
      icon: <RocketOutlined />,
      title: "Giao hàng nhanh",
      description:
        "Vận chuyển nhanh chóng và an toàn đến địa điểm của bạn trong 3-5 ngày làm việc.",
    },
    {
      icon: <CustomerServiceOutlined />,
      title: "Hỗ trợ chuyên nghiệp",
      description:
        "Dịch vụ khách hàng 24/7 sẵn sàng giải đáp mọi thắc mắc của bạn.",
    },
    {
      icon: <TrophyOutlined />,
      title: "Giá tốt nhất",
      description:
        "Giá cả cạnh tranh với các ưu đãi và giảm giá thường xuyên cho sản phẩm chất lượng.",
    },
  ];

  // brands để hiển thị trên homepage và truyền slug khi điều hướng
  const brands = [
    { key: "tesla", name: "Tesla", icon: "🔺" },
    { key: "nissan", name: "Nissan", icon: "🔋" },
    { key: "bmw", name: "BMW", icon: "🚗" },
    { key: "chevrolet", name: "Chevrolet", icon: "⚙️" },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg,#eef2ff 0%, #f7f9ff 100%)",
          padding: "64px 16px",
          textAlign: "center",
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>
            Sàn Giao Dịch Pin Xe Điện Đã Qua Sử Dụng
          </h1>
          <p style={{ fontSize: 16, color: "#555", marginBottom: 24 }}>
            Kết nối người bán và người mua pin xe điện đã qua sử dụng — an toàn,
            minh bạch và tiết kiệm.
          </p>

          <Space size="middle" style={{ justifyContent: "center" }}>
            <Input.Search
              placeholder="Tìm kiếm theo thương hiệu, dung lượng, mã..."
              enterButton="Tìm sản phẩm"
              size="large"
              onSearch={(q) =>
                navigate(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`)
              }
              style={{ width: 560 }}
            />
          </Space>
        </div>
      </section>

      {/* Statistics */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto 32px", padding: "0 16px" }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, color: "#1890ff" }}>
                <ThunderboltOutlined />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>5,000+</div>
              <div style={{ color: "#777" }}>Pin đã kết nối</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, color: "#fadb14" }}>
                <StarFilled />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>4.8/5</div>
              <div style={{ color: "#777" }}>Độ hài lòng khách hàng</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, color: "#52c41a" }}>
                <SafetyOutlined />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>24/7</div>
              <div style={{ color: "#777" }}>Hỗ trợ & kiểm tra</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, color: "#ff7a45" }}>
                <TrophyOutlined />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>98%</div>
              <div style={{ color: "#777" }}>Giao dịch thành công</div>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Brands (navigates to /products?brand=slug) */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto 32px", padding: "0 16px" }}
      >
        <h2 style={{ marginBottom: 16 }}>Mua sắm theo hãng xe</h2>
        <Row gutter={[16, 16]}>
          {brands.map((b) => (
            <Col xs={24} sm={12} md={6} key={b.key}>
              <Card
                hoverable
                onClick={() =>
                  navigate(`/products?brand=${encodeURIComponent(b.key)}`)
                }
                style={{
                  textAlign: "center",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 40 }}>{b.icon}</div>
                <div style={{ fontWeight: 700, marginTop: 12 }}>{b.name}</div>
                <div style={{ color: "#888", marginTop: 8 }}>Lọc theo hãng</div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Features */}
      <section
        style={{ background: "#fff", padding: "32px 0", marginBottom: 32 }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
          <h2 style={{ textAlign: "center", marginBottom: 24 }}>
            Tại sao chọn chúng tôi
          </h2>
          <Row gutter={[16, 16]}>
            {features.map((f, i) => (
              <Col xs={24} sm={12} md={6} key={i}>
                <Card bordered={false} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, color: "#1890ff" }}>{f.icon}</div>
                  <h4 style={{ marginTop: 12 }}>{f.title}</h4>
                  <p style={{ color: "#666", fontSize: 14 }}>{f.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Call to Action + Newsletter */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto 48px",
          padding: "0 16px",
          textAlign: "center",
        }}
      >
        <Card style={{ borderRadius: 8 }}>
          <h2>Nhận thông báo về ưu đãi và tin tức</h2>
          <p style={{ color: "#666" }}>
            Đăng ký nhận bản tin để không bỏ lỡ các cơ hội tốt.
          </p>
          <Space style={{ marginTop: 12 }}>
            <Input placeholder="Nhập email của bạn" style={{ width: 360 }} />
            <Button type="primary">Đăng ký</Button>
          </Space>
          <div style={{ marginTop: 20 }}>
            <Button type="default" onClick={() => navigate("/about")}>
              Tìm hiểu thêm
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: 12 }}
              onClick={() => navigate("/products")}
            >
              Bắt đầu duyệt
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default HomePageBody;
