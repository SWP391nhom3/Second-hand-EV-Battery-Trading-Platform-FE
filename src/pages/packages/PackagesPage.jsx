import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Space,
  Statistic,
  Badge,
  Tooltip,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tabs,
} from "antd";
import {
  CrownOutlined,
  ThunderboltOutlined,
  StarOutlined,
  CheckCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  RocketOutlined,
  SafetyOutlined,
  ShoppingCartOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Header, Footer } from "../../components/layout";
import styles from "./PackagesPage.module.css";

const { Meta } = Card;
const { TabPane } = Tabs;

const PackagesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Dữ liệu các gói đăng tin theo bài
  const packages = [
    {
      id: 1,
      name: "Gói Cơ Bản",
      tier: "basic",
      icon: <TrophyOutlined />,
      pricePerPost: 0,
      originalPrice: 0,
      minPosts: 1,
      maxPosts: 3,
      color: "#CD7F32",
      gradient: "linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)",
      popular: false,
      features: [
        { text: "Miễn phí 3 bài đăng", icon: <CheckCircleOutlined /> },
        { text: "Hiển thị 3 ngày/bài", icon: <CheckCircleOutlined /> },
        { text: "Hỗ trợ cơ bản", icon: <CheckCircleOutlined /> },
        {
          text: "Không ưu tiên hiển thị",
          icon: <CheckCircleOutlined />,
          disabled: true,
        },
        {
          text: "Không huy hiệu",
          icon: <CheckCircleOutlined />,
          disabled: true,
        },
      ],
      displayDays: 7,
      priority: "Thấp",
      support: "Email",
      badge: null,
      benefits: [
        "Dùng thử miễn phí",
        "Phù hợp người mới",
        "Không cần thanh toán",
      ],
    },
    {
      id: 2,
      name: "Gói Tiết Kiệm",
      tier: "silver",
      icon: <StarOutlined />,
      pricePerPost: 50000,
      originalPrice: 0,
      minPosts: 1,
      maxPosts: 50,
      color: "#C0C0C0",
      gradient: "linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 100%)",
      popular: false,
      features: [
        { text: "50.000₫/bài đăng", icon: <CheckCircleOutlined /> },
        { text: "Hiển thị 7 ngày/bài", icon: <CheckCircleOutlined /> },
        { text: "Huy hiệu Bạc", icon: <CheckCircleOutlined /> },
        { text: "Ưu tiên hiển thị trung bình", icon: <CheckCircleOutlined /> },
        { text: "Hỗ trợ email & chat", icon: <CheckCircleOutlined /> },
      ],
      displayDays: 14,
      priority: "Trung bình",
      support: "Email + Chat",
      badge: "Bạc",
      benefits: [
        "Giá cố định, rõ ràng",
        "Tăng khả năng tiếp cận",
        "Huy hiệu tin cậy",
      ],
    },
    {
      id: 3,
      name: "Gói Phổ Biến",
      tier: "gold",
      icon: <FireOutlined />,
      pricePerPost: 100000,
      originalPrice: 0,
      minPosts: 1,
      maxPosts: 100,
      color: "#FFD700",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      popular: true,
      features: [
        { text: "100.000₫/bài đăng", icon: <CheckCircleOutlined /> },
        { text: "Hiển thị 14 ngày/bài", icon: <CheckCircleOutlined /> },
        { text: "Huy hiệu Vàng", icon: <CheckCircleOutlined /> },
        { text: "Ưu tiên hiển thị cao", icon: <CheckCircleOutlined /> },
        { text: "Hỗ trợ 24/7", icon: <CheckCircleOutlined /> },
        { text: "Đẩy tin tự động", icon: <CheckCircleOutlined /> },
        { text: "Thống kê chi tiết", icon: <CheckCircleOutlined /> },
      ],
      displayDays: 30,
      priority: "Cao",
      support: "24/7",
      badge: "Vàng",
      benefits: [
        "Giá tốt nhất",
        "Tối ưu doanh số",
        "Tiếp cận tối đa",
        "Dashboard chuyên nghiệp",
      ],
    },
    {
      id: 4,
      name: "Gói Cao Cấp",
      tier: "diamond",
      icon: <CrownOutlined />,
      pricePerPost: 150000,
      originalPrice: 0,
      minPosts: 1,
      maxPosts: 500,
      color: "#B9F2FF",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      popular: false,
      features: [
        { text: "150.000₫/bài đăng", icon: <CheckCircleOutlined /> },
        { text: "Hiển thị 30 ngày/bài", icon: <CheckCircleOutlined /> },
        { text: "Huy hiệu Kim Cương", icon: <CheckCircleOutlined /> },
        { text: "Ưu tiên tối đa", icon: <CheckCircleOutlined /> },
        { text: "Hỗ trợ VIP 24/7", icon: <CheckCircleOutlined /> },
        { text: "Đẩy tin cao cấp", icon: <CheckCircleOutlined /> },
        { text: "Thống kê AI", icon: <CheckCircleOutlined /> },
        { text: "Quản lý tài khoản riêng", icon: <CheckCircleOutlined /> },
        { text: "Tư vấn chiến lược", icon: <CheckCircleOutlined /> },
      ],
      displayDays: 60,
      priority: "Tối đa",
      support: "VIP 24/7",
      badge: "Kim Cương",
      benefits: [
        "Dịch vụ cao cấp nhất",
        "Dành cho doanh nghiệp",
        "Tối ưu doanh thu tối đa",
        "AI hỗ trợ bán hàng",
      ],
    },
  ];

  const handleSelectPackage = (pkg) => {
    // Kiểm tra đăng nhập trước khi chuyển tới trang thanh toán
    const isAuth = !!(
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
    if (!isAuth) {
      message.info("Vui lòng đăng nhập để mua bài đăng");
      navigate(
        `/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
      return;
    }
    
    // Chuyển trực tiếp đến trang thanh toán
    const packageData = {
      id: pkg.id,
      name: pkg.name,
      tier: pkg.tier,
      pricePerPost: pkg.pricePerPost,
      originalPrice: pkg.originalPrice,
      quantity: 1,
      totalPrice: pkg.pricePerPost,
      color: pkg.color,
      gradient: pkg.gradient,
      displayDays: pkg.displayDays,
      priority: pkg.priority,
      support: pkg.support,
      badge: pkg.badge,
      features: pkg.features.map((f) => f.text),
      benefits: pkg.benefits,
    };
    navigate("/payment", {
      state: {
        type: "package",
        package: packageData,
      },
    });
  };

  const handlePurchase = (values) => {
    // Function này không còn dùng nữa, giữ lại để tránh lỗi
    navigate("/payment", {
      state: {
        type: "package",
        package: {
          ...selectedPackage,
          features: selectedPackage.features.map((f) => f.text),
        },
        userData: values,
      },
    });
    setModalVisible(false);
  };

  const getPackagesByTab = () => {
    if (activeTab === "all") return packages;
    if (activeTab === "free") return packages.filter((p) => p.price === 0);
    if (activeTab === "paid") return packages.filter((p) => p.price > 0);
    if (activeTab === "popular") return packages.filter((p) => p.popular);
    return packages;
  };

  return (
    <div className={styles.packagesPage}>
      <Header />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <RocketOutlined /> Đăng Tin Linh Hoạt - Thanh Toán Theo Bài
          </h1>
          <p className={styles.heroSubtitle}>
            Chọn số lượng bài đăng phù hợp - Chỉ trả tiền cho những gì bạn cần
          </p>
          <div className={styles.heroStats}>
            <Statistic
              title="Người dùng hoạt động"
              value={15420}
              prefix={<ThunderboltOutlined />}
              suffix="+"
            />
            <Statistic
              title="Giao dịch thành công"
              value={8750}
              prefix={<CheckCircleOutlined />}
              suffix="+"
            />
            <Statistic
              title="Đánh giá 5 sao"
              value={98}
              suffix="%"
              prefix={<StarOutlined />}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.contentWrapper}>
        <div className={styles.tabsSection}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            size="large"
            className={styles.filterTabs}
          >
            <TabPane tab="Tất cả gói" key="all" />
            <TabPane tab="Miễn phí" key="free" />
            <TabPane tab="Trả phí" key="paid" />
            <TabPane tab="Phổ biến" key="popular" />
          </Tabs>
        </div>

        {/* Packages Grid */}
        <Row gutter={[24, 24]} className={styles.packagesGrid}>
          {getPackagesByTab().map((pkg) => (
            <Col xs={24} sm={12} lg={6} key={pkg.id}>
              <Badge.Ribbon
                text={pkg.popular ? "Phổ biến nhất" : null}
                color="red"
                style={{ display: pkg.popular ? "block" : "none" }}
              >
                <Card
                  className={`${styles.packageCard} ${
                    pkg.popular ? styles.popularCard : ""
                  }`}
                  hoverable
                  bordered={false}
                >
                  {/* Package Header */}
                  <div
                    className={styles.packageHeader}
                    style={{ background: pkg.gradient }}
                  >
                    <div className={styles.packageIcon}>{pkg.icon}</div>
                    <h3 className={styles.packageName}>{pkg.name}</h3>
                    <Tag
                      color={pkg.tier}
                      className={styles.tierTag}
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "none",
                        color: "#fff",
                      }}
                    >
                      {pkg.tier.toUpperCase()}
                    </Tag>
                  </div>

                  {/* Package Price */}
                  <div className={styles.packagePrice}>
                    {pkg.pricePerPost === 0 ? (
                      <div className={styles.freePrice}>
                        <span className={styles.priceAmount}>Miễn phí</span>
                        <span className={styles.postLimit}>Tối đa {pkg.maxPosts} bài</span>
                      </div>
                    ) : (
                      <>
                        <div className={styles.priceInfo}>
                          {pkg.originalPrice > pkg.pricePerPost && (
                            <span className={styles.originalPrice}>
                              {pkg.originalPrice.toLocaleString("vi-VN")}₫
                            </span>
                          )}
                          <span className={styles.priceAmount}>
                            {pkg.pricePerPost.toLocaleString("vi-VN")}₫
                          </span>
                          <span className={styles.priceUnit}>/bài đăng</span>
                        </div>
                        {pkg.originalPrice > pkg.pricePerPost && (
                          <Tag color="red" className={styles.discountTag}>
                            Giảm {Math.round((1 - pkg.pricePerPost / pkg.originalPrice) * 100)}%
                          </Tag>
                        )}
                      </>
                    )}
                  </div>

                  {/* Package Features */}
                  <div className={styles.packageFeatures}>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      {pkg.features.map((feature, index) => (
                        <div
                          key={index}
                          className={`${styles.featureItem} ${
                            feature.disabled ? styles.featureDisabled : ""
                          }`}
                        >
                          <span className={styles.featureIcon}>
                            {feature.icon}
                          </span>
                          <span className={styles.featureText}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </Space>
                  </div>

                  {/* Package Benefits */}
                  <div className={styles.packageBenefits}>
                    <h4>
                      <SafetyOutlined /> Ưu điểm nổi bật
                    </h4>
                    <ul>
                      {pkg.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button
                    type="default"
                    size="large"
                    block
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleSelectPackage(pkg)}
                    className={styles.selectButton}
                  >
                    {pkg.pricePerPost === 0 ? "Nhận miễn phí" : "Mua ngay"}
                  </Button>

                  <div className={styles.packageInfo}>
                    <Tooltip title="Xem thông tin chi tiết">
                      <InfoCircleOutlined /> Chi tiết gói
                    </Tooltip>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>

        {/* Comparison Table Section */}
        <div className={styles.comparisonSection}>
          <h2 className={styles.sectionTitle}>So Sánh Chi Tiết Các Gói</h2>
          <div className={styles.comparisonTable}>
            <table>
              <thead>
                <tr>
                  <th>Tính năng</th>
                  <th>
                    <div className={styles.tableHeader}>
                      <TrophyOutlined />
                      <span>Cơ Bản</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <StarOutlined />
                      <span>Tiết Kiệm</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <FireOutlined />
                      <span>Phổ Biến</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <CrownOutlined />
                      <span>Cao Cấp</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Giá/bài đăng</td>
                  <td>Miễn phí</td>
                  <td>50.000₫</td>
                  <td>100.000₫</td>
                  <td>150.000₫</td>
                </tr>
                <tr>
                  <td>Số lượng tối đa</td>
                  <td>3 bài</td>
                  <td>50 bài</td>
                  <td>100 bài</td>
                  <td>500 bài</td>
                </tr>
                <tr>
                  <td>Thời gian hiển thị</td>
                  <td>3 ngày</td>
                  <td>7 ngày</td>
                  <td>14 ngày</td>
                  <td>30 ngày</td>
                </tr>
                <tr>
                  <td>Mức độ ưu tiên</td>
                  <td>Thấp</td>
                  <td>Trung bình</td>
                  <td>Cao</td>
                  <td>Tối đa</td>
                </tr>
                <tr>
                  <td>Hỗ trợ khách hàng</td>
                  <td>Email</td>
                  <td>Email + Chat</td>
                  <td>24/7</td>
                  <td>VIP 24/7</td>
                </tr>
                <tr>
                  <td>Huy hiệu</td>
                  <td>Không</td>
                  <td>Bạc</td>
                  <td>Vàng</td>
                  <td>Kim Cương</td>
                </tr>
                <tr>
                  <td>Thống kê & phân tích</td>
                  <td>❌</td>
                  <td>Cơ bản</td>
                  <td>Chi tiết</td>
                  <td>AI nâng cao</td>
                </tr>
                <tr>
                  <td>Đẩy tin tự động</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅ Cao cấp</td>
                </tr>
                <tr>
                  <td>Tư vấn chiến lược</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Câu Hỏi Thường Gặp</h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Bài đăng có thời hạn bao lâu?</h4>
                <p>
                  Thời hạn hiển thị tùy thuộc vào gói bạn chọn: Cơ Bản (3 ngày),
                  Tiết Kiệm (7 ngày), Phổ Biến (14 ngày), Cao Cấp (30 ngày).
                  Sau thời hạn, bài đăng sẽ tự động ẩn khỏi trang chủ.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Mỗi lần mua được bao nhiêu bài đăng?</h4>
                <p>
                  Mỗi lần mua bạn sẽ nhận được 1 bài đăng. Bạn có thể mua nhiều
                  lần và số bài đăng sẽ được cộng dồn vào tài khoản để sử dụng
                  linh hoạt khi cần.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Tại sao các gói có giá khác nhau?</h4>
                <p>
                  Giá phụ thuộc vào thời gian hiển thị và tính năng: Gói Tiết Kiệm
                  (50.000₫), Gói Phổ Biến (100.000₫), Gói Cao Cấp (150.000₫). 
                  Gói cao hơn có thời gian hiển thị dài hơn và nhiều tính năng hơn.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Có được hoàn tiền không?</h4>
                <p>
                  Chúng tôi có chính sách hoàn tiền trong vòng 24 giờ nếu bạn
                  chưa sử dụng bài đăng. Sau khi đã đăng tin, bạn sẽ không được
                  hoàn tiền.
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Purchase Modal */}
      <Modal
        title={
          <Space>
            {selectedPackage?.icon}
            <span>Đăng ký {selectedPackage?.name}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        className={styles.purchaseModal}
      >
        {selectedPackage && (
          <>
            <div className={styles.modalSummary}>
              <div className={styles.summaryItem}>
                <span>Gói đã chọn:</span>
                <strong>{selectedPackage.name}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Giá:</span>
                <strong className={styles.price}>
                  {selectedPackage.price === 0
                    ? "Miễn phí"
                    : `${selectedPackage.price.toLocaleString("vi-VN")}₫`}
                </strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Thời hạn:</span>
                <strong>{selectedPackage.duration}</strong>
              </div>
            </div>

            <Form layout="vertical" onFinish={handlePurchase}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input size="large" placeholder="Nguyễn Văn A" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input size="large" placeholder="example@email.com" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input size="large" placeholder="0901234567" />
              </Form.Item>

              {selectedPackage.price > 0 && (
                <Form.Item
                  label="Phương thức thanh toán"
                  name="paymentMethod"
                  rules={[
                    { required: true, message: "Vui lòng chọn phương thức" },
                  ]}
                >
                  <Select size="large" placeholder="Chọn phương thức">
                    <Select.Option value="bank">
                      Chuyển khoản ngân hàng
                    </Select.Option>
                    <Select.Option value="momo">Ví MoMo</Select.Option>
                    <Select.Option value="zalopay">ZaloPay</Select.Option>
                    <Select.Option value="vnpay">VNPay</Select.Option>
                    <Select.Option value="card">
                      Thẻ tín dụng/ghi nợ
                    </Select.Option>
                  </Select>
                </Form.Item>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  icon={<ShoppingCartOutlined />}
                >
                  {selectedPackage.price === 0
                    ? "Kích hoạt ngay"
                    : "Xác nhận thanh toán"}
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default PackagesPage;
